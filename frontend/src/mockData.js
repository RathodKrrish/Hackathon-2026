// SOLAR PULSE AI - INDIAN NATIONAL GRID & GUJARAT SLDC TELEMETRY
// Synced to Indian Standard Time (IST - Asia/Kolkata, UTC+5:30)

export const INITIAL_STATE = {
  timestamp_ist: new Date().toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata', hour12: true }) + " IST",
  solar_geometry: {
    elevation_deg: 65.4,
    zenith_deg: 24.6,
    azimuth_deg: 182.1,
    is_daylight: true,
    ist_hour: 12.75
  },
  weather_regime: "PEAK_SOLAR_INSOLATION",
  grid_frequency_hz: 50.01,
  frequency_status: "STABLE_IEGC",
  total_solar_generation_mw: 212.4,
  regional_solar_capacity_mw: 250.0,
  capacity_utilization_factor_pct: 85.0,
  grid_demand_mw: 198.5,
  net_deficit_mw: 0.0,
  bess_soc_pct: 82.5,
  bess_dispatch_mw: 0.0,
  bess_charge_mw: 13.9,
  fossil_peaker_mw: 0.0,
  peaker_status: "SHUTDOWN_STANDBY",
  co2_avoided_today_tons: 24.6,
  curtailment_prevented_mwh: 38.2,
  dsm_penalty_saved_inr_lakhs: 4.85,
  plants: {
    Plant_Charanka: {
      name: "Charanka Solar Park (Patan, Gujarat)",
      capacity_mw: 80.0,
      generation_mw: 68.2,
      status: "OPTIMAL",
      shadow_eta_minutes: null,
      inverters_online: 32
    },
    Plant_Bhadla: {
      name: "Bhadla Mega Array (Rajasthan Hub)",
      capacity_mw: 120.0,
      generation_mw: 102.8,
      status: "OPTIMAL",
      shadow_eta_minutes: 18.5,
      inverters_online: 48
    },
    Plant_Dholera: {
      name: "Dholera SIR Solar Cluster (Gujarat)",
      capacity_mw: 50.0,
      generation_mw: 41.4,
      status: "OPTIMAL",
      shadow_eta_minutes: null,
      inverters_online: 20
    }
  },
  // Official CEA / SECI / GERC Statutory System Losses & Energy Balance Benchmarks
  losses: {
    gross_photon_potential_mw: 268.4,
    thermal_derate_loss_mw: 24.8,
    thermal_derate_pct: 10.3,
    soiling_dust_loss_mw: 10.2,
    soiling_dust_pct: 4.2,
    inverter_transformer_loss_mw: 5.4,
    inverter_transformer_pct: 2.5,
    getco_transmission_loss_mw: 7.7,
    getco_transmission_loss_pct: 3.65,
    auxiliary_consumption_mw: 0.5,
    auxiliary_consumption_pct: 0.25,
    net_grid_delivered_mw: 204.7,
    performance_ratio_pct: 81.2,
    daily_generation_mwh: 1324.5,
    daily_consumption_mwh: 4180.0,
    solar_self_sufficiency_pct: 31.7
  },
  is_real_time_mode: true
};

// 24-Hour Diurnal Solar Profile in Indian Standard Time (IST)
// Sunrise: ~06:15 IST | Solar Noon: ~12:40 IST | Sunset: ~18:45 IST | Night: 19:00 - 05:30 IST
export const INITIAL_FORECAST = {
  forecast_horizon_hours: 24,
  metrics: {
    ai_mae_mw: 4.12,
    legacy_mae_mw: 18.40,
    accuracy_improvement_pct: 77.6,
    model_mape_pct: 3.42,
    legacy_mape_pct: 14.85
  },
  timeline: [
    { timestamp: "00:00", solar_elevation_deg: -68.0, p10_mw: 0, p50_mw: 0, p90_mw: 0, legacy_tso_mw: 0, ground_truth_mw: 0 },
    { timestamp: "02:00", solar_elevation_deg: -55.0, p10_mw: 0, p50_mw: 0, p90_mw: 0, legacy_tso_mw: 0, ground_truth_mw: 0 },
    { timestamp: "04:00", solar_elevation_deg: -32.0, p10_mw: 0, p50_mw: 0, p90_mw: 0, legacy_tso_mw: 0, ground_truth_mw: 0 },
    { timestamp: "06:00", solar_elevation_deg: -1.2, p10_mw: 0, p50_mw: 0, p90_mw: 0, legacy_tso_mw: 0, ground_truth_mw: 0 },
    { timestamp: "07:00", solar_elevation_deg: 14.5, p10_mw: 24.0, p50_mw: 38.5, p90_mw: 46.0, legacy_tso_mw: 22.0, ground_truth_mw: 36.8 },
    { timestamp: "08:00", solar_elevation_deg: 28.2, p10_mw: 65.0, p50_mw: 88.4, p90_mw: 104.0, legacy_tso_mw: 71.0, ground_truth_mw: 86.2 },
    { timestamp: "09:00", solar_elevation_deg: 42.0, p10_mw: 115.0, p50_mw: 142.0, p90_mw: 162.0, legacy_tso_mw: 118.0, ground_truth_mw: 139.5 },
    { timestamp: "10:00", solar_elevation_deg: 54.5, p10_mw: 155.0, p50_mw: 184.5, p90_mw: 208.0, legacy_tso_mw: 150.0, ground_truth_mw: 181.0 },
    { timestamp: "11:00", solar_elevation_deg: 63.8, p10_mw: 178.0, p50_mw: 215.0, p90_mw: 236.0, legacy_tso_mw: 174.0, ground_truth_mw: 211.5 },
    { timestamp: "12:00", solar_elevation_deg: 68.2, p10_mw: 185.0, p50_mw: 228.0, p90_mw: 244.0, legacy_tso_mw: 185.0, ground_truth_mw: 224.8 },
    { timestamp: "13:00", solar_elevation_deg: 66.5, p10_mw: 182.0, p50_mw: 224.0, p90_mw: 242.0, legacy_tso_mw: 180.0, ground_truth_mw: 220.0 },
    { timestamp: "14:00", solar_elevation_deg: 58.4, p10_mw: 165.0, p50_mw: 202.0, p90_mw: 222.0, legacy_tso_mw: 162.0, ground_truth_mw: 198.2 },
    { timestamp: "15:00", solar_elevation_deg: 46.8, p10_mw: 130.0, p50_mw: 165.0, p90_mw: 188.0, legacy_tso_mw: 134.0, ground_truth_mw: 161.0 },
    { timestamp: "16:00", solar_elevation_deg: 33.2, p10_mw: 85.0, p50_mw: 114.0, p90_mw: 135.0, legacy_tso_mw: 89.0, ground_truth_mw: 111.4 },
    { timestamp: "17:00", solar_elevation_deg: 19.4, p10_mw: 38.0, p50_mw: 58.0, p90_mw: 74.0, legacy_tso_mw: 44.0, ground_truth_mw: 55.6 },
    { timestamp: "18:00", solar_elevation_deg: 5.6, p10_mw: 4.0, p50_mw: 12.4, p90_mw: 20.0, legacy_tso_mw: 6.0, ground_truth_mw: 11.2 },
    { timestamp: "19:00", solar_elevation_deg: -8.0, p10_mw: 0, p50_mw: 0, p90_mw: 0, legacy_tso_mw: 0, ground_truth_mw: 0 },
    { timestamp: "20:00", solar_elevation_deg: -22.0, p10_mw: 0, p50_mw: 0, p90_mw: 0, legacy_tso_mw: 0, ground_truth_mw: 0 },
    { timestamp: "22:00", solar_elevation_deg: -48.0, p10_mw: 0, p50_mw: 0, p90_mw: 0, legacy_tso_mw: 0, ground_truth_mw: 0 }
  ]
};

export const INITIAL_FUTURE_TREE = {
  branches: [
    {
      id: "A",
      name: "Future A: Clear Desert Insolation",
      icon: "☀️",
      description: "High Gujarat thermal currents dissipate haze. High-noon output reaches 228 MW.",
      probability_pct: 48,
      generation_mw: 228.0,
      generation_delta_mw: 15.6,
      grid_risk: "VERY_LOW",
      battery_action: "CHARGE_SURPLUS",
      battery_dispatch_mw: 14.5,
      curtailment_risk_mwh: 0.0,
      peaker_cost_saved_eur: 1850.0,
      co2_avoided_tons: 8.2
    },
    {
      id: "B",
      name: "Future B: Scattered Cloud Veil",
      icon: "🌤️",
      description: "Passing cirrus over Bhadla array. Transient drop compensated by BESS micro-dispatch.",
      probability_pct: 32,
      generation_mw: 194.5,
      generation_delta_mw: -17.9,
      grid_risk: "LOW",
      battery_action: "MICRO_DISCHARGE",
      battery_dispatch_mw: 9.2,
      curtailment_risk_mwh: 0.0,
      peaker_cost_saved_eur: 1240.0,
      co2_avoided_tons: 5.4
    },
    {
      id: "C",
      name: "Future C: Monsoon Overcast Front",
      icon: "☁️",
      description: "Thick monsoon cloud bank rolls from Arabian Sea over Charanka & Dholera.",
      probability_pct: 12,
      generation_mw: 125.0,
      generation_delta_mw: -87.4,
      grid_risk: "MEDIUM",
      battery_action: "FULL_BESS_DISCHARGE",
      battery_dispatch_mw: 28.0,
      curtailment_risk_mwh: 0.0,
      peaker_cost_saved_eur: 3450.0,
      co2_avoided_tons: 13.8
    },
    {
      id: "D",
      name: "Future D: Fast-Ramp Squall Event",
      icon: "🌪️",
      description: "Pre-monsoon squall brings sudden wind-shear. Fast ramp rate (-38 MW/min) arrested via BESS.",
      probability_pct: 6,
      generation_mw: 82.0,
      generation_delta_mw: -130.4,
      grid_risk: "HIGH",
      battery_action: "BESS_PLUS_EV_FLEXIBILITY",
      battery_dispatch_mw: 30.0,
      curtailment_risk_mwh: 0.0,
      peaker_cost_saved_eur: 5100.0,
      co2_avoided_tons: 21.4
    },
    {
      id: "E",
      name: "Future E: Cloud Surge + Evening Peak Overlap",
      icon: "⚠️",
      description: "Critical compound stress: cloud shadow hits during 7:30 PM regional lighting surge.",
      probability_pct: 2,
      generation_mw: 0.0,
      generation_delta_mw: -212.4,
      grid_risk: "CRITICAL_DEFICIT",
      battery_action: "EMERGENCY_DISPATCH_AND_DEMAND_RESPONSE",
      battery_dispatch_mw: 30.0,
      curtailment_risk_mwh: 0.0,
      peaker_cost_saved_eur: 7200.0,
      co2_avoided_tons: 29.5
    }
  ]
};

export const INITIAL_CAUSAL_CHAIN = {
  summary: "Cloud shadow triggers a 34.2 MW generation drop; fully neutralized via 22.0 MW BESS + 12.2 MW demand shift.",
  deficit_prevented: true,
  causal_steps: [
    { step_number: 1, title: "Cloud Vector Ingress", metric: "+22% Optical Coverage", detail: "All-Sky camera in Patan detected cloud front moving at 24.2 km/h NW.", status: "DETECTED", badge_color: "blue" },
    { step_number: 2, title: "Shadow Arrival Trajectory", metric: "ETA: ~14 Minutes", detail: "Optical flow vectors project ground shadow impact on Charanka Cluster B.", status: "PROJECTED", badge_color: "cyan" },
    { step_number: 3, title: "Direct Irradiance Attenuation", metric: "DNI Drop: -310 W/m²", detail: "Direct Normal Irradiance blocked by cumulonimbus optical density.", status: "CALCULATED", badge_color: "amber" },
    { step_number: 4, title: "Solar Generation Curtailment/Loss", metric: "-34.2 MW Generation", detail: "PV array output drops from 212.4 MW to 178.2 MW.", status: "IMMINENT", badge_color: "rose" },
    { step_number: 5, title: "Grid Reserve Margin Compression", metric: "Reserve: 14.1% (IEGC Band)", detail: "Gujarat grid spinning reserve margin approaches the 12% regulatory threshold.", status: "ALERT", badge_color: "red" },
    { step_number: 6, title: "Smart BESS Fast-Discharge", metric: "+22.0 MW Dispatched", detail: "Autonomous inverter fast-injection (response time < 140ms) locks grid at 50.01 Hz.", status: "DISPATCHED", badge_color: "emerald" },
    { step_number: 7, title: "Flexible Demand Shifting", metric: "-12.2 MW Deferred", detail: "Gujarat DISCOM industrial agri-pumping loads shifted by 15 minutes to buffer deficit.", status: "RESOLVED", badge_color: "green" }
  ]
};
