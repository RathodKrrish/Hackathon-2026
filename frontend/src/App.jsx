import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import TabCommandCenter from './components/TabCommandCenter';
import TabSkyRadar from './components/TabSkyRadar';
import TabTimeMachine from './components/TabTimeMachine';
import TabReasoningAudit from './components/TabReasoningAudit';
import TabAdversarialLab from './components/TabAdversarialLab';
import TabJudgeMode from './components/TabJudgeMode';

// New Real-World Powerhouse Proof Modules
import VisionLab from './components/VisionLab';
import SolarFarmTwin from './components/SolarFarmTwin';
import DataLaboratory from './components/DataLaboratory';
import MarketTrading from './components/MarketTrading';
import GridCopilot from './components/GridCopilot';

import { INITIAL_STATE, INITIAL_FORECAST, INITIAL_FUTURE_TREE, INITIAL_CAUSAL_CHAIN } from './mockData';

// Astronomical Solar Elevation calculation for Gujarat Solar Hub (Lat: 23.9042, Lon: 71.2008)
function getSolarElevationForHour(decimalHour) {
  const declination = -0.02; // equinox period
  const latRad = (23.9042 * Math.PI) / 180;
  const trueSolarHour = decimalHour - 0.75;
  const hourAngleRad = ((trueSolarHour * 15 - 180) * Math.PI) / 180;
  
  const sinElev = Math.sin(latRad) * Math.sin(declination) + Math.cos(latRad) * Math.cos(declination) * Math.cos(hourAngleRad);
  const elevRad = Math.asin(Math.max(-1, Math.min(1, sinElev)));
  return (elevRad * 180) / Math.PI;
}

export default function App() {
  const [activeTab, setActiveTab] = useState('command');
  const [cloudSlider, setCloudSlider] = useState(22);
  const [isConnected, setIsConnected] = useState(false);

  // Time-Travel & Live Clock Modes
  const [isLiveTime, setIsLiveTime] = useState(true);
  const [scrubberHour, setScrubberHour] = useState(13.85); // Matches midday IST

  const [liveState, setLiveState] = useState(INITIAL_STATE);
  const [forecastData, setForecastData] = useState(INITIAL_FORECAST);
  const [futureTreeData, setFutureTreeData] = useState(INITIAL_FUTURE_TREE);
  const [causalChainData, setCausalChainData] = useState(INITIAL_CAUSAL_CHAIN);
  const [userRole, setUserRole] = useState('DISPATCHER'); // 'DISPATCHER', 'PLANT_OWNER', 'ESG_AUDITOR'

  // Master Clock & Solar Physics Tick Loop (Runs every 1 second)
  useEffect(() => {
    const updatePhysicsLoop = () => {
      let activeHour = scrubberHour;
      if (isLiveTime) {
        const now = new Date();
        activeHour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
        setScrubberHour(Number(activeHour.toFixed(2)));
      }

      // Compute exact astronomical elevation for Gujarat
      const elevation = getSolarElevationForHour(activeHour);
      const isDaylight = elevation > 0.0;
      const zenith = 90.0 - elevation;

      // Atmospheric Regime
      let regime = 'PARTLY_CLOUDY';
      if (!isDaylight) {
        regime = 'NIGHT';
      } else if (elevation < 12.0) {
        regime = 'SUNRISE_SUNSET_RAMP';
      } else if (elevation > 45.0 && cloudSlider < 25) {
        regime = 'PEAK_SOLAR_INSOLATION';
      } else if (cloudSlider > 60) {
        regime = 'HEAVY_OVERCAST_STORM';
      }

      // Solar Generation Physics (Clear-Sky GHI * Cloud Attenuation * Derate)
      let totalGen = 0.0;
      if (isDaylight) {
        const sinElev = Math.sin((elevation * Math.PI) / 180);
        const clearSkyGhi = Math.max(0, sinElev * 980.0);
        const cloudFactor = 1.0 - (cloudSlider / 100) * 0.72;
        const tempDerate = 0.94; // standard hot Gujarat midday derate
        totalGen = (clearSkyGhi / 1000.0) * 250.0 * cloudFactor * tempDerate;
      }
      totalGen = Number(totalGen.toFixed(1));

      // Official CEA / SECI / GERC Statutory Physical System Loss Breakdown
      const thermalLossMw = isDaylight ? Number((totalGen * 0.103).toFixed(1)) : 0.0;
      const soilingLossMw = isDaylight ? Number((totalGen * 0.042).toFixed(1)) : 0.0;
      const conversionLossMw = isDaylight ? Number((totalGen * 0.025).toFixed(1)) : 0.0;
      const transmissionLossMw = isDaylight ? Number((totalGen * 0.0365).toFixed(1)) : 0.0;
      const auxiliaryLossMw = isDaylight ? Number((totalGen * 0.0025).toFixed(1)) : 0.0;
      const grossPotentialMw = isDaylight ? Number((totalGen + thermalLossMw + soilingLossMw + conversionLossMw).toFixed(1)) : 0.0;
      const netDeliveredMw = isDaylight ? Number((totalGen - transmissionLossMw).toFixed(1)) : 0.0;

      // Grid Load Demand curve in India (Peaks at 1:00 PM and 8:00 PM)
      const baseDemand = 170.0 + 35.0 * Math.sin((Math.PI * (activeHour - 6.0)) / 12.0);
      const gridDemand = Number(Math.max(140.0, baseDemand).toFixed(1));
      const netGap = Number(Math.max(0, gridDemand - totalGen).toFixed(1));

      // BESS & Peaker state
      const bessDis = isDaylight ? Math.min(30.0, netGap) : Math.min(30.0, netGap * 0.5);
      const bessChg = isDaylight && totalGen > gridDemand ? Math.min(30.0, totalGen - gridDemand) : 0.0;
      const peakerNeeded = Number(Math.max(0, netGap - bessDis).toFixed(1));

      // Frequency stability (IEGC 49.90 - 50.05 Hz)
      const freq = 50.01 + (peakerNeeded > 20 ? -0.03 : 0.0);

      // Multi-plant breakdown
      const plantCharanka = Number((totalGen * 0.32).toFixed(1));
      const plantBhadla = Number((totalGen * 0.48).toFixed(1));
      const plantDholera = Number((totalGen * 0.20).toFixed(1));

      const nowStr = new Date().toLocaleTimeString('en-IN', { hour12: true }) + " IST";

      setLiveState((prev) => ({
        ...prev,
        timestamp_ist: nowStr,
        solar_geometry: {
          elevation_deg: Number(elevation.toFixed(1)),
          zenith_deg: Number(zenith.toFixed(1)),
          azimuth_deg: 182.1,
          is_daylight: isDaylight,
          ist_hour: Number(activeHour.toFixed(2))
        },
        weather_regime: regime,
        grid_frequency_hz: freq,
        total_solar_generation_mw: totalGen,
        capacity_utilization_factor_pct: Number(((totalGen / 250) * 100).toFixed(1)),
        grid_demand_mw: gridDemand,
        net_deficit_mw: netGap,
        bess_dispatch_mw: Number(bessDis.toFixed(1)),
        bess_charge_mw: Number(bessChg.toFixed(1)),
        fossil_peaker_mw: peakerNeeded,
        peaker_status: peakerNeeded > 0 ? "ACTIVE_EMISSION" : "SHUTDOWN_STANDBY",
        losses: {
          gross_photon_potential_mw: grossPotentialMw,
          thermal_derate_loss_mw: thermalLossMw,
          thermal_derate_pct: 10.3,
          soiling_dust_loss_mw: soilingLossMw,
          soiling_dust_pct: 4.2,
          inverter_transformer_loss_mw: conversionLossMw,
          inverter_transformer_pct: 2.5,
          getco_transmission_loss_mw: transmissionLossMw,
          getco_transmission_loss_pct: 3.65,
          auxiliary_consumption_mw: auxiliaryLossMw,
          auxiliary_consumption_pct: 0.25,
          net_grid_delivered_mw: netDeliveredMw,
          performance_ratio_pct: isDaylight ? 81.2 : 0.0,
          daily_generation_mwh: 1324.5,
          daily_consumption_mwh: 4180.0,
          solar_self_sufficiency_pct: 31.7
        },
        plants: {
          Plant_Charanka: {
            ...prev.plants.Plant_Charanka,
            generation_mw: plantCharanka,
            status: !isDaylight ? "NIGHT_STANDBY" : (cloudSlider > 50 ? "SHADED" : "OPTIMAL")
          },
          Plant_Bhadla: {
            ...prev.plants.Plant_Bhadla,
            generation_mw: plantBhadla,
            status: !isDaylight ? "NIGHT_STANDBY" : "OPTIMAL"
          },
          Plant_Dholera: {
            ...prev.plants.Plant_Dholera,
            generation_mw: plantDholera,
            status: !isDaylight ? "NIGHT_STANDBY" : "OPTIMAL"
          }
        }
      }));
    };

    updatePhysicsLoop();
    const interval = setInterval(updatePhysicsLoop, 1000);
    return () => clearInterval(interval);
  }, [isLiveTime, scrubberHour, cloudSlider]);

  const handleApplyChallenge = (cloudValue, shouldNavigate = false) => {
    setCloudSlider(cloudValue);
    if (shouldNavigate) {
      setActiveTab('command');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      {/* Top Navbar with All 10 Powerhouse Modules */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        liveState={liveState}
        cloudSlider={cloudSlider}
        setCloudSlider={setCloudSlider}
        isConnected={isConnected}
        isLiveTime={isLiveTime}
        setIsLiveTime={setIsLiveTime}
        scrubberHour={scrubberHour}
        setScrubberHour={setScrubberHour}
        userRole={userRole}
        setUserRole={setUserRole}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-[1680px] w-full mx-auto px-3 sm:px-5 md:px-6 lg:px-8 py-3.5 sm:py-6">
        <div key={activeTab} className="animate-tab-enter">
          {activeTab === 'command' && (
            <TabCommandCenter
              liveState={liveState}
              forecastData={forecastData}
              futureTreeData={futureTreeData}
              userRole={userRole}
            />
          )}
          {activeTab === 'vision_lab' && (
            <VisionLab
              onApplyCloudToSystem={(cov) => setCloudSlider(cov)}
            />
          )}
          {activeTab === 'solar_twin' && (
            <SolarFarmTwin
              cloudCoverage={cloudSlider}
              liveState={liveState}
              isLiveTime={isLiveTime}
              setIsLiveTime={setIsLiveTime}
              scrubberHour={scrubberHour}
              setScrubberHour={setScrubberHour}
            />
          )}
          {activeTab === 'sky_radar' && (
            <TabSkyRadar
              causalChainData={causalChainData}
              liveState={liveState}
              cloudCoverage={cloudSlider}
              setCloudCoverage={setCloudSlider}
            />
          )}
          {activeTab === 'data_lab' && (
            <DataLaboratory />
          )}
          {activeTab === 'market' && (
            <MarketTrading />
          )}
          {activeTab === 'copilot' && (
            <GridCopilot
              onExecuteAction={(cVal) => setCloudSlider(cVal)}
              userRole={userRole}
            />
          )}
          {activeTab === 'time_machine' && (
            <TabTimeMachine
              liveState={liveState}
              isLiveTime={isLiveTime}
              setIsLiveTime={setIsLiveTime}
              scrubberHour={scrubberHour}
              setScrubberHour={setScrubberHour}
              cloudCoverage={cloudSlider}
            />
          )}
          {activeTab === 'reasoning' && (
            <TabReasoningAudit />
          )}
          {activeTab === 'adversarial' && (
            <TabAdversarialLab />
          )}
          {activeTab === 'judge' && (
            <TabJudgeMode
              onApplyChallenge={handleApplyChallenge}
              liveState={liveState}
              setActiveTab={setActiveTab}
            />
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 px-6 py-4 text-xs text-slate-500 flex items-center justify-center">
        <p className="font-mono text-center text-slate-400">
          © {new Date().getFullYear()} <span className="font-bold text-amber-400 tracking-wider">LUMINITY</span>. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
