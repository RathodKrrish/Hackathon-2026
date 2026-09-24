"""
SOLAR PULSE AI - COMPUTER VISION & CLOUD RADAR ENGINE
Handles Optical Flow velocity vectors, cloud segmentation, shadow projection,
and localized 0-30 minute Nowcasting (Points 2, 8).
"""
import math
import numpy as np

class CloudObject:
    def __init__(self, cloud_id: int, x: float, y: float, radius: float, optical_density: float, vx: float, vy: float):
        self.cloud_id = cloud_id
        self.x = x  # Normalized coordinates [0, 1] across sky dome
        self.y = y
        self.radius = radius
        self.optical_density = optical_density  # 0.0 to 1.0 (light cirrus to thick cumulonimbus)
        self.vx = vx  # Velocity vector in x (normalized units per minute)
        self.vy = vy  # Velocity vector in y

    def to_dict(self):
        speed_kmh = math.sqrt(self.vx**2 + self.vy**2) * 600.0  # scaled to km/h
        heading_deg = (math.degrees(math.atan2(self.vy, self.vx)) + 360) % 360
        cloud_type = "Cirrus" if self.optical_density < 0.35 else ("Altocumulus" if self.optical_density < 0.70 else "Cumulonimbus")
        return {
            "id": self.cloud_id,
            "x": round(self.x, 3),
            "y": round(self.y, 3),
            "radius": round(self.radius, 3),
            "optical_density": round(self.optical_density, 3),
            "type": cloud_type,
            "velocity_kmh": round(speed_kmh, 1),
            "heading_deg": round(heading_deg, 1)
        }

class CVCloudEngine:
    def __init__(self):
        # Initial simulated cloud field over regional solar plants
        self.clouds = [
            CloudObject(1, 0.25, 0.35, 0.18, 0.78, 0.012, 0.006),
            CloudObject(2, 0.65, 0.20, 0.12, 0.42, 0.014, 0.005),
            CloudObject(3, 0.10, 0.70, 0.22, 0.85, 0.010, 0.008)
        ]
        # Coordinates of the 3 solar plant clusters in normalized sky footprint
        self.plant_locations = {
            "Plant_A": (0.45, 0.45),
            "Plant_B": (0.75, 0.55),
            "Plant_C": (0.30, 0.80)
        }

    def update_cloud_positions(self, delta_minutes: float = 1.0, wind_factor: float = 1.0):
        for cloud in self.clouds:
            cloud.x += cloud.vx * delta_minutes * wind_factor
            cloud.y += cloud.vy * delta_minutes * wind_factor
            # Wrap around sky dome boundaries
            if cloud.x > 1.2: cloud.x = -0.2
            if cloud.y > 1.2: cloud.y = -0.2

    def calculate_shadow_impact(self, plant_key: str):
        """
        Calculates time-to-impact and estimated irradiance attenuation for a specific plant.
        """
        if plant_key not in self.plant_locations:
            return {"impact_in_minutes": None, "attenuation_pct": 0.0, "status": "CLEAR"}
        
        px, py = self.plant_locations[plant_key]
        min_eta = 999.0
        max_attenuation = 0.0
        active_cloud_id = None

        for cloud in self.clouds:
            dx = px - cloud.x
            dy = py - cloud.y
            dist = math.sqrt(dx**2 + dy**2)
            
            # Check if shadow is currently over plant
            if dist <= cloud.radius:
                attenuation = cloud.optical_density * 100.0 * (1.0 - (dist / cloud.radius) * 0.4)
                return {
                    "impact_in_minutes": 0.0,
                    "attenuation_pct": round(attenuation, 1),
                    "status": "IMPACTING_NOW",
                    "cloud_id": cloud.cloud_id,
                    "cloud_type": "Cumulonimbus" if cloud.optical_density > 0.7 else "Cumulus"
                }
            
            # Check projected trajectory
            v_mag = math.sqrt(cloud.vx**2 + cloud.vy**2)
            if v_mag > 0:
                dot_prod = (dx * cloud.vx + dy * cloud.vy) / v_mag
                if dot_prod > 0:  # Moving towards plant
                    cross_dist = abs(dx * cloud.vy - dy * cloud.vx) / v_mag
                    if cross_dist <= cloud.radius * 1.2:
                        eta_minutes = dot_prod / (v_mag * 60.0)
                        if eta_minutes < min_eta:
                            min_eta = eta_minutes
                            max_attenuation = cloud.optical_density * 90.0
                            active_cloud_id = cloud.cloud_id

        if min_eta < 60.0:
            return {
                "impact_in_minutes": round(min_eta, 1),
                "attenuation_pct": round(max_attenuation, 1),
                "status": "APPROACHING",
                "cloud_id": active_cloud_id
            }
        
        return {
            "impact_in_minutes": None,
            "attenuation_pct": 0.0,
            "status": "CLEAR_AHEAD"
        }

    def get_radar_state(self, wind_factor: float = 1.0):
        self.update_cloud_positions(delta_minutes=0.5, wind_factor=wind_factor)
        impacts = {p: self.calculate_shadow_impact(p) for p in self.plant_locations}
        return {
            "clouds": [c.to_dict() for c in self.clouds],
            "plant_impacts": impacts,
            "total_clouds_tracked": len(self.clouds)
        }
