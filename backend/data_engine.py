"""
SOLAR PULSE AI - DATA INGESTION & PIPELINE ENGINE
Loads, merges, and validates the Spanish ENTSO-E Energy & Weather CSVs.
Features automatic synthetic fallback generator so the system runs immediately.
"""
import os
import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from pathlib import Path
from config import ENERGY_DATASET_PATH, WEATHER_DATASET_PATH, DATA_DIR
from physics_engine import calculate_solar_position, clear_sky_irradiance

class DataEngine:
    def __init__(self):
        DATA_DIR.mkdir(parents=True, exist_ok=True)
        self.df = None
        self.load_data()

    def generate_synthetic_historical_data(self, days: int = 14):
        """
        Generates realistic Spanish ENTSO-E grid & Valencia weather data matching the schema.
        Ensures the system never crashes even before the user copies their 18MB files.
        """
        records = []
        base_time = datetime(2026, 6, 1, 0, 0, 0)
        np.random.seed(42)

        for step in range(days * 24):
            dt = base_time + timedelta(hours=step)
            solar_pos = calculate_solar_position(dt)
            cs = clear_sky_irradiance(solar_pos["elevation_deg"])
            
            # Base weather
            hour = dt.hour
            cloud_pct = 0.0 if (step % 48 < 24) else np.clip(np.random.normal(45, 25), 0, 100)
            temp_k = 285.0 + 10.0 * np.sin(np.pi * (hour - 8) / 12) + np.random.normal(0, 1.5)
            humidity = np.clip(75 - (hour * 2) + np.random.normal(0, 5), 30, 95)
            wind_speed = np.clip(np.random.normal(2.5, 1.2), 0.5, 12.0)
            
            # Solar generation (MW)
            cloud_factor = 1.0 - (cloud_pct / 100.0) * 0.75
            max_solar_cap = 4200.0  # Regional capacity in MW
            solar_actual = max(0.0, (cs["ghi_w_m2"] / 1000.0) * max_solar_cap * cloud_factor)
            
            # Baseline TSO Forecast (Simulating legacy forecast with ~14% error)
            tso_forecast = max(0.0, solar_actual * np.random.normal(1.0, 0.14) + np.random.normal(0, 50))
            if solar_pos["elevation_deg"] <= 0:
                solar_actual = 0.0
                tso_forecast = 0.0

            # Grid Demand & Fossil Peaker Generation
            load_actual = 21000.0 + 6000.0 * np.sin(np.pi * (hour - 6) / 12) + np.random.normal(0, 400)
            fossil_gas = max(1500.0, (load_actual - solar_actual - 6000.0) * 0.45)
            price_actual = 45.0 + (load_actual / 1000.0) * 0.9 + (1.0 if cloud_pct > 50 else 0) * 8.0

            records.append({
                "time": dt.isoformat(),
                "generation solar": round(solar_actual, 1),
                "forecast solar day ahead": round(tso_forecast, 1),
                "total load actual": round(load_actual, 1),
                "generation fossil gas": round(fossil_gas, 1),
                "price actual": round(price_actual, 2),
                "temp": round(temp_k, 2),
                "humidity": round(humidity, 1),
                "wind_speed": round(wind_speed, 1),
                "clouds_all": round(cloud_pct, 1),
                "solar_elevation": solar_pos["elevation_deg"],
                "clear_sky_ghi": cs["ghi_w_m2"]
            })
        
        df = pd.DataFrame(records)
        return df

    def load_data(self):
        if ENERGY_DATASET_PATH.exists() and WEATHER_DATASET_PATH.exists():
            try:
                print(f"[DATA] Loading energy data from {ENERGY_DATASET_PATH}...")
                df_energy = pd.read_csv(ENERGY_DATASET_PATH)
                df_weather = pd.read_csv(WEATHER_DATASET_PATH)

                # Standardize timestamps
                df_energy['time_dt'] = pd.to_datetime(df_energy['time'], utc=True)
                df_weather['time_dt'] = pd.to_datetime(df_weather['dt_iso'], utc=True)

                # Filter Valencia or aggregate
                if 'city_name' in df_weather.columns:
                    df_weather = df_weather[df_weather['city_name'].str.contains('Valencia|Madrid', case=False, na=False)]
                df_weather_hourly = df_weather.groupby('time_dt').mean(numeric_only=True).reset_index()

                # Merge
                merged = pd.merge(df_energy, df_weather_hourly, on='time_dt', how='inner')
                merged.sort_values('time_dt', inplace=True)
                merged.fillna(method='ffill', inplace=True)
                merged.fillna(0, inplace=True)

                # Keep relevant columns
                self.df = merged
                print(f"[DATA] Successfully loaded {len(self.df)} real records from college CSVs!")
                return
            except Exception as e:
                print(f"[DATA ERROR] Failed to parse custom CSVs: {e}. Falling back to high-fidelity simulation.")

        # Fallback to high-fidelity dataset
        print("[DATA] Custom CSVs not yet in data/ folder. Initializing high-fidelity Spanish ENTSO-E baseline.")
        self.df = self.generate_synthetic_historical_data(days=30)

    def get_recent_window(self, count: int = 48):
        """Returns the most recent 48 hours of energy & weather observations."""
        tail_df = self.df.tail(count)
        return tail_df.to_dict(orient="records")

    def get_latest_metrics(self):
        latest = self.df.iloc[-1]
        prev = self.df.iloc[-2]
        return {
            "timestamp": str(latest.get("time", datetime.utcnow().isoformat())),
            "solar_actual_mw": float(latest.get("generation solar", 0.0)),
            "grid_demand_mw": float(latest.get("total load actual", 25000.0)),
            "tso_forecast_mw": float(latest.get("forecast solar day ahead", 0.0)),
            "fossil_gas_mw": float(latest.get("generation fossil gas", 4200.0)),
            "market_price_eur": float(latest.get("price actual", 58.5)),
            "cloud_coverage_pct": float(latest.get("clouds_all", 15.0)),
            "temperature_c": round(float(latest.get("temp", 295.0)) - 273.15, 1),
            "wind_speed_ms": float(latest.get("wind_speed", 3.2))
        }

data_engine = DataEngine()
