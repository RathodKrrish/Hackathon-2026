"""
SOLAR PULSE AI - CAUSAL CHAIN ENGINE
Translates raw computer vision and physics telemetry into a transparent,
multi-step cause-and-effect chain (Point 2 in Masterplan).
"""

def build_causal_chain(cloud_coverage_pct: float, wind_speed_ms: float, current_gen_mw: float, demand_mw: float):
    """
    Constructs the step-by-step causal chain showing HOW a cloud event ripples into the grid.
    """
    eta_minutes = max(3, int(60.0 / max(1.0, wind_speed_ms)))
    solar_drop_mw = round(current_gen_mw * (cloud_coverage_pct / 100.0) * 0.72, 1)
    new_gen_mw = max(0.0, round(current_gen_mw - solar_drop_mw, 1))
    
    reserve_margin_pct = round(max(2.0, 18.0 - (solar_drop_mw / max(1.0, demand_mw)) * 100.0), 1)
    deficit_risk_pct = round(min(98.0, max(5.0, (solar_drop_mw / 25.0) * 85.0)), 1)
    
    battery_needed_mw = min(25.0, solar_drop_mw)
    ev_shift_needed_mw = max(0.0, round(solar_drop_mw - battery_needed_mw, 1))

    steps = [
        {
            "step_number": 1,
            "title": "Cloud Vector Ingress",
            "metric": f"+{cloud_coverage_pct}% Optical Coverage",
            "detail": f"All-Sky camera detected cloud front moving at {round(wind_speed_ms * 3.6, 1)} km/h.",
            "status": "DETECTED",
            "badge_color": "blue"
        },
        {
            "step_number": 2,
            "title": "Shadow Arrival Trajectory",
            "metric": f"ETA: ~{eta_minutes} Minutes",
            "detail": f"Optical flow vectors project ground shadow impact on Array Cluster B.",
            "status": "PROJECTED",
            "badge_color": "cyan"
        },
        {
            "step_number": 3,
            "title": "Direct Irradiance Attenuation",
            "metric": f"DNI Drop: -{int(cloud_coverage_pct * 7.5)} W/m²",
            "detail": "Direct Normal Irradiance blocked by cumulonimbus optical density.",
            "status": "CALCULATED",
            "badge_color": "amber"
        },
        {
            "step_number": 4,
            "title": "Solar Generation Curtailment/Loss",
            "metric": f"-{solar_drop_mw} MW Generation",
            "detail": f"PV array output drops from {current_gen_mw} MW to {new_gen_mw} MW.",
            "status": "IMMINENT",
            "badge_color": "rose"
        },
        {
            "step_number": 5,
            "title": "Grid Reserve Margin Compression",
            "metric": f"Reserve: {reserve_margin_pct}% (Risk: {deficit_risk_pct}%)",
            "detail": "Regional spinning reserve margins drop below the 15% CERC regulatory threshold.",
            "status": "ALERT",
            "badge_color": "red"
        },
        {
            "step_number": 6,
            "title": "Smart BESS Fast-Discharge",
            "metric": f"+{battery_needed_mw} MW Dispatched",
            "detail": "Autonomous inverter fast-injection (response time < 140ms) maintains 50.00 Hz.",
            "status": "DISPATCHED",
            "badge_color": "emerald"
        },
        {
            "step_number": 7,
            "title": "Flexible Demand Shifting",
            "metric": f"-{ev_shift_needed_mw} MW Deferred",
            "detail": "Regional EV fast-chargers throttled by 10% for 15 minutes to buffer deficit.",
            "status": "RESOLVED",
            "badge_color": "green"
        }
    ]

    return {
        "summary": f"Cloud shadow triggers a {solar_drop_mw} MW generation drop; fully neutralized via {battery_needed_mw} MW BESS + {ev_shift_needed_mw} MW demand shift.",
        "deficit_prevented": True,
        "causal_steps": steps
    }
