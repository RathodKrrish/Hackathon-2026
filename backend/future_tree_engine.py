"""
SOLAR PULSE AI - FUTURE TREE ENGINE
Implements Branching Scenario Forecasting (Point 1 in Masterplan).
Generates 5 distinct futures (A to E) with probabilities, grid risks,
battery dispatch requirements, costs, CO2 offsets, and curtailment.
"""

def generate_future_tree(base_generation_mw: float = 145.0, cloud_pct: float = 30.0, grid_demand_mw: float = 160.0):
    """
    Constructs a multi-path probabilistic scenario tree starting from the present state.
    """
    # Sensitivity scaling based on user/judge sliders
    cloud_severity = cloud_pct / 100.0

    branches = [
        {
            "id": "A",
            "name": "Future A: Clear Dissipation",
            "icon": "☀️",
            "description": "Clouds dissipate rapidly under rising thermal wind. Generation stabilizes at full capacity.",
            "probability_pct": max(5, round((1.0 - cloud_severity) * 60)),
            "generation_mw": round(base_generation_mw * 1.05, 1),
            "generation_delta_mw": round(base_generation_mw * 0.05, 1),
            "grid_risk": "VERY_LOW",
            "battery_action": "RECHARGE_STANDBY",
            "battery_dispatch_mw": 0.0,
            "curtailment_risk_mwh": 4.2,
            "peaker_cost_saved_eur": 1250.0,
            "peaker_cost_saved_inr": 110000,
            "co2_avoided_tons": 5.4
        },
        {
            "id": "B",
            "name": "Future B: Moderate Cloud Transient",
            "icon": "🌤️",
            "description": "Scattered cumulus clouds pass over Plant A only. Minor generation drop handled seamlessly.",
            "probability_pct": 35,
            "generation_mw": round(base_generation_mw * 0.90, 1),
            "generation_delta_mw": round(-base_generation_mw * 0.10, 1),
            "grid_risk": "LOW",
            "battery_action": "MICRO_DISCHARGE",
            "battery_dispatch_mw": 8.5,
            "curtailment_risk_mwh": 0.0,
            "peaker_cost_saved_eur": 980.0,
            "peaker_cost_saved_inr": 86000,
            "co2_avoided_tons": 3.8
        },
        {
            "id": "C",
            "name": "Future C: Dense Cloud Front",
            "icon": "☁️",
            "description": "Thick overcast stratum covers both Plant A & Plant B. Noticeable deficit threatening frequency.",
            "probability_pct": max(10, round(cloud_severity * 40)),
            "generation_mw": round(base_generation_mw * 0.65, 1),
            "generation_delta_mw": round(-base_generation_mw * 0.35, 1),
            "grid_risk": "MEDIUM",
            "battery_action": "FULL_BESS_DISCHARGE",
            "battery_dispatch_mw": 22.0,
            "curtailment_risk_mwh": 0.0,
            "peaker_cost_saved_eur": 2400.0,
            "peaker_cost_saved_inr": 210000,
            "co2_avoided_tons": 9.2
        },
        {
            "id": "D",
            "name": "Future D: Fast-Ramp Storm Vector",
            "icon": "🌪️",
            "description": "High wind accelerates dark cumulonimbus. Steep ramp-down rate (-28 MW/min). Virtual inertia triggered.",
            "probability_pct": max(5, round(cloud_severity * 25)),
            "generation_mw": round(base_generation_mw * 0.40, 1),
            "generation_delta_mw": round(-base_generation_mw * 0.60, 1),
            "grid_risk": "HIGH",
            "battery_action": "BESS_PLUS_EV_FLEXIBILITY",
            "battery_dispatch_mw": 25.0,
            "curtailment_risk_mwh": 0.0,
            "peaker_cost_saved_eur": 3850.0,
            "peaker_cost_saved_inr": 340000,
            "co2_avoided_tons": 14.6
        },
        {
            "id": "E",
            "name": "Future E: Cloud Eclipse + Peak Demand Spike",
            "icon": "⚠️",
            "description": "Worst-case compound stress: cloud front hits exactly during regional industrial demand peak.",
            "probability_pct": max(3, round(cloud_severity * 15)),
            "generation_mw": round(base_generation_mw * 0.30, 1),
            "generation_delta_mw": round(-base_generation_mw * 0.70, 1),
            "grid_risk": "CRITICAL_DEFICIT",
            "battery_action": "EMERGENCY_DISPATCH_AND_DEMAND_RESPONSE",
            "battery_dispatch_mw": 25.0,
            "curtailment_risk_mwh": 0.0,
            "peaker_cost_saved_eur": 5200.0,
            "peaker_cost_saved_inr": 460000,
            "co2_avoided_tons": 18.9
        }
    ]

    # Normalize probabilities to sum to 100%
    total_p = sum(b["probability_pct"] for b in branches)
    for b in branches:
        b["probability_pct"] = round((b["probability_pct"] / total_p) * 100.0, 1)

    return {
        "root": {
            "current_generation_mw": base_generation_mw,
            "current_cloud_coverage_pct": cloud_pct,
            "grid_demand_mw": grid_demand_mw,
            "timestamp": "CURRENT_TIME_T0"
        },
        "branches": branches
    }
