"""
SOLAR PULSE AI - SYSTEM CONFIGURATION (INDIAN GRID & REAL-TIME IST SYNCHRONIZATION)
Configured for Indian National Grid & Gujarat SLDC (State Load Despatch Centre).
Aligned with IEGC (Indian Electricity Grid Code) & DSM (Deviation Settlement Mechanism).
"""
import os
from pathlib import Path

# Paths
BASE_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BASE_DIR.parent
DATA_DIR = PROJECT_ROOT / "data"

ENERGY_DATASET_PATH = DATA_DIR / "energy_dataset.csv"
WEATHER_DATASET_PATH = DATA_DIR / "weather_features.csv"

# Geographic Hub: Gujarat Solar Belt (Charanka / Patan, Gujarat, India)
LATITUDE = 23.9042
LONGITUDE = 71.2008
ALTITUDE = 12.0  # meters above sea level
TIMEZONE = "Asia/Kolkata"  # Indian Standard Time (UTC+5:30)

# Regional Multi-Plant Indian Solar Parks (Point 10)
PLANTS = {
    "Plant_Charanka": {
        "name": "Charanka Solar Park (Patan, Gujarat)",
        "capacity_mw": 80.0,
        "tilt_deg": 24,
        "azimuth_deg": 180,
        "lat": 23.9042,
        "lon": 71.2008,
        "inverters_online": 32,
        "total_inverters": 32
    },
    "Plant_Bhadla": {
        "name": "Bhadla Mega Array (Rajasthan Hub)",
        "capacity_mw": 120.0,
        "tilt_deg": 26,
        "azimuth_deg": 180,
        "lat": 27.5386,
        "lon": 71.9161,
        "inverters_online": 48,
        "total_inverters": 48
    },
    "Plant_Dholera": {
        "name": "Dholera SIR Solar Cluster (Gujarat)",
        "capacity_mw": 50.0,
        "tilt_deg": 22,
        "azimuth_deg": 180,
        "lat": 22.2472,
        "lon": 72.1953,
        "inverters_online": 20,
        "total_inverters": 20
    }
}
TOTAL_REGIONAL_CAPACITY_MW = sum(p["capacity_mw"] for p in PLANTS.values())  # 250 MW

# BESS (Battery Energy Storage System) Specs
BESS_CONFIG = {
    "capacity_mwh": 60.0,
    "max_discharge_mw": 30.0,
    "max_charge_mw": 30.0,
    "round_trip_efficiency": 0.93,
    "min_soc": 0.15,
    "max_soc": 0.95,
    "target_soc": 0.70
}

# Indian Electricity Grid Code (IEGC) Frequency Bands (CERC Norms)
IEGC_FREQ_LOWER_HZ = 49.90
IEGC_FREQ_NOMINAL_HZ = 50.00
IEGC_FREQ_UPPER_HZ = 50.05

# Financial & Carbon Constants (INR and EUR)
PEAKER_GAS_CO2_PER_MWH = 0.45  # Metric tons CO2 per MWh
PEAKER_COAL_CO2_PER_MWH = 0.95 # Metric tons CO2 per MWh
SOLAR_LCOE_INR_PER_KWH = 2.45
PEAKER_COST_INR_PER_KWH = 9.80  # Gas/Diesel peaker cost in India (~₹9,800/MWh)
PEAKER_COST_INR_PER_MWH = 9800.0
PEAKER_COST_EUR_PER_MWH = 115.0
EUR_TO_INR_RATE = 91.5

# CERC DSM (Deviation Settlement Mechanism) Penalty: ₹250 per MWh for forecast error > 10%
DSM_PENALTY_THRESHOLD_PCT = 10.0
DSM_PENALTY_INR_PER_MWH = 450.0
