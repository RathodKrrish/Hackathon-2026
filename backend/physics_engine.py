"""
SOLAR PULSE AI - PHYSICS-INFORMED SOLAR ENGINE (IST & INDIA SYNCHRONIZED)
Computes real-time astronomical solar elevation, azimuth, and clear-sky GHI
specifically for Indian Solar Parks (Gujarat / Rajasthan) in IST (Asia/Kolkata).
Includes hard-lock 0.00 kW night guardrails (Point 20) and sunrise/sunset regimes.
"""
import math
from datetime import datetime, timezone, timedelta
import numpy as np

# Indian Standard Time (UTC + 5 hours 30 minutes)
IST_OFFSET = timedelta(hours=5, minutes=30)

def get_current_ist_time():
    """Returns the current real-time timestamp in Indian Standard Time."""
    return datetime.now(timezone.utc) + IST_OFFSET

def calculate_solar_position(timestamp_dt: datetime = None, lat: float = 23.9042, lon: float = 71.2008, hour_override: float = None):
    """
    Computes precise solar elevation, zenith angle, and azimuth for Indian Solar Parks.
    If hour_override is provided, uses that specific hour of day (0.0 to 24.0) in IST.
    """
    if timestamp_dt is None:
        timestamp_dt = get_current_ist_time()
    
    # Determine the solar decimal hour in IST
    if hour_override is not None:
        hour = float(hour_override)
    else:
        # If timestamp is naive or UTC, ensure we have IST
        if timestamp_dt.tzinfo is None:
            # Assume it's already local IST
            hour = timestamp_dt.hour + timestamp_dt.minute / 60.0 + timestamp_dt.second / 3600.0
        else:
            ist_dt = timestamp_dt.astimezone(timezone(IST_OFFSET))
            hour = ist_dt.hour + ist_dt.minute / 60.0 + ist_dt.second / 3600.0

    day_of_year = timestamp_dt.timetuple().tm_yday
    
    # Solar declination angle delta (Spencer formula)
    gamma = 2 * math.pi * (day_of_year - 1) / 365.0
    declination = (
        0.006918
        - 0.399912 * math.cos(gamma)
        + 0.070257 * math.sin(gamma)
        - 0.006758 * math.cos(2 * gamma)
        + 0.000907 * math.sin(2 * gamma)
        - 0.002697 * math.cos(3 * gamma)
        + 0.00148 * math.sin(3 * gamma)
    )  # radians
    
    # Equation of time (minutes)
    eqtime = 229.18 * (
        0.000075
        + 0.001868 * math.cos(gamma)
        - 0.032077 * math.sin(gamma)
        - 0.014615 * math.cos(2 * gamma)
        - 0.040849 * math.sin(2 * gamma)
    )
    
    # Time offset from IST standard meridian (82.5° E) to Gujarat Solar Park (71.2° E)
    # 4 minutes per degree longitude difference
    std_meridian_lon = 82.5
    local_time_offset_min = eqtime + 4.0 * (lon - std_meridian_lon)
    
    true_solar_time_min = (hour * 60.0 + local_time_offset_min) % 1440.0
    solar_hour_angle = math.radians((true_solar_time_min / 4.0) - 180.0)
    
    lat_rad = math.radians(lat)
    
    # Cosine law for zenith
    cos_zenith = math.sin(lat_rad) * math.sin(declination) + math.cos(lat_rad) * math.cos(declination) * math.cos(solar_hour_angle)
    cos_zenith = max(-1.0, min(1.0, cos_zenith))
    zenith_rad = math.acos(cos_zenith)
    elevation_deg = 90.0 - math.degrees(zenith_rad)
    zenith_deg = math.degrees(zenith_rad)
    
    # Solar Azimuth
    sin_azimuth = -(math.cos(declination) * math.sin(solar_hour_angle)) / max(0.0001, math.sin(zenith_rad))
    sin_azimuth = max(-1.0, min(1.0, sin_azimuth))
    azimuth_deg = (math.degrees(math.asin(sin_azimuth)) + 180.0) % 360.0
    
    return {
        "elevation_deg": round(elevation_deg, 2),
        "zenith_deg": round(zenith_deg, 2),
        "azimuth_deg": round(azimuth_deg, 2),
        "is_daylight": elevation_deg > 0.0,
        "ist_hour": round(hour, 2)
    }

def clear_sky_irradiance(elevation_deg: float, altitude_m: float = 12.0):
    """
    Computes theoretical clear-sky GHI in W/m^2.
    Strictly 0.00 W/m^2 when elevation <= 0 (Night lock).
    """
    if elevation_deg <= 0.0:
        return {"ghi_w_m2": 0.0, "dni_w_m2": 0.0, "dhi_w_m2": 0.0}
    
    elev_rad = math.radians(elevation_deg)
    zenith_rad = math.radians(90.0 - elevation_deg)
    
    # Air mass with Kasten-Young empirical adjustment
    air_mass = 1.0 / (math.cos(zenith_rad) + 0.50572 * ((96.07995 - (90.0 - elevation_deg)) ** -1.6364))
    air_mass = max(1.0, min(30.0, air_mass))
    
    # Solar constant I0
    I0 = 1361.0  # W/m^2
    dni = I0 * (0.72 ** (air_mass ** 0.678))
    dhi = 0.12 * dni
    ghi = dni * math.sin(elev_rad) + dhi
    
    return {
        "ghi_w_m2": max(0.0, round(ghi, 1)),
        "dni_w_m2": max(0.0, round(dni, 1)),
        "dhi_w_m2": max(0.0, round(dhi, 1))
    }

def apply_pv_physics(ghi_w_m2: float, ambient_temp_k: float, capacity_mw: float, dust_factor: float = 1.0):
    """
    Calculates net AC output taking into account temperature de-rating (-0.4%/°C above 25°C)
    and soiling/dust on panels.
    """
    if ghi_w_m2 <= 0.0:
        return 0.0
    
    ambient_temp_c = ambient_temp_k - 273.15
    # Photovoltaic cell operating temperature (NOCT model)
    cell_temp_c = ambient_temp_c + (ghi_w_m2 / 800.0) * 28.0
    
    # Official Indian Mono-PERC thermal coefficient loss (-0.35%/°C above 25°C STC)
    temp_derate = 1.0 - 0.0035 * max(0.0, (cell_temp_c - 25.0))
    temp_derate = max(0.72, min(1.05, temp_derate))
    
    # 1000 W/m² = STC standard peak irradiance
    nominal_mw = capacity_mw * (ghi_w_m2 / 1000.0)
    actual_mw = nominal_mw * temp_derate * dust_factor
    
    return max(0.0, round(actual_mw, 2))

def detect_weather_regime(cloud_coverage_pct: float, wind_speed_ms: float, elevation_deg: float):
    """
    Classifies the exact operational regime based on live sun position and atmosphere:
    NIGHT, SUNRISE_RAMP, SUNSET_RAMP, PEAK_SOLAR_INSOLATION, PARTLY_CLOUDY, HEAVY_OVERCAST, FAST_MOVING_CLOUDS.
    """
    if elevation_deg <= 0.0:
        return "NIGHT"
    if 0.0 < elevation_deg <= 10.0:
        return "SUNRISE_RAMP"
    if 10.0 < elevation_deg <= 18.0 and elevation_deg < 25.0:
        return "MORNING_TRANSITION"
    if elevation_deg > 45.0 and cloud_coverage_pct < 20.0:
        return "PEAK_SOLAR_INSOLATION"
    if cloud_coverage_pct >= 65.0:
        return "HEAVY_OVERCAST_STORM"
    if wind_speed_ms > 7.5:
        return "FAST_MOVING_CLOUDS"
    return "PARTLY_CLOUDY"
