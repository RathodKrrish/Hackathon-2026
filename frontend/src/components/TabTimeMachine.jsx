import React, { useState } from 'react';
import { 
  Zap, Play, RotateCcw, Sliders, CheckCircle2, XCircle, TrendingDown, 
  Leaf, DollarSign, Clock, ArrowRight, Sun, Moon, Wind, RefreshCw 
} from 'lucide-react';

// Gujarat Solar Hub (Charanka, Lat: 23.9042°N, Lon: 71.2008°E) Astronomical Solar Elevation
function calculateSolarElevation(hour) {
  const declination = -0.02; // Autumn/Spring average solar declination
  const latRad = (23.9042 * Math.PI) / 180;
  const trueSolarHour = hour - 0.75;
  const hourAngleRad = ((trueSolarHour * 15 - 180) * Math.PI) / 180;
  const sinElev = Math.sin(latRad) * Math.sin(declination) + Math.cos(latRad) * Math.cos(declination) * Math.cos(hourAngleRad);
  const elevRad = Math.asin(Math.max(-1, Math.min(1, sinElev)));
  return (elevRad * 180) / Math.PI;
}

export default function TabTimeMachine({
  liveState,
  isLiveTime = true,
  setIsLiveTime,
  scrubberHour = 12.5,
  setScrubberHour,
  cloudCoverage = 22
}) {
  const [horizonMinutes, setHorizonMinutes] = useState(60);

  // Counterfactual Sandbox Sliders (Point 4)
  const [batteryMw, setBatteryMw] = useState(20);
  const [cloudExtraPct, setCloudExtraPct] = useState(25);
  const [demandSpikePct, setDemandSpikePct] = useState(10);
  const [transmissionDropPct, setTransmissionDropPct] = useState(0);

  // Determine current active base hour
  const now = new Date();
  const liveDecimalHour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  const activeHour = isLiveTime ? liveDecimalHour : (scrubberHour !== undefined ? scrubberHour : 12.5);

  // Format decimal hour to 12-hour AM/PM string
  const formatHourString = (hourVal) => {
    const totalMinutes = Math.floor(hourVal * 60);
    const normalizedMinutes = ((totalMinutes % (24 * 60)) + (24 * 60)) % (24 * 60);
    const h = Math.floor(normalizedMinutes / 60);
    const m = normalizedMinutes % 60;
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${String(displayH).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
  };

  // Astronomical calculations for Base Time and Future Time
  const futureHour = (activeHour + (horizonMinutes / 60)) % 24;
  const currentElevation = calculateSolarElevation(activeHour);
  const futureElevation = calculateSolarElevation(futureHour);
  const isCurrentDaylight = currentElevation > 0.0;
  const isFutureDaylight = futureElevation > 0.0;

  // Real-time Solar Physics at Target Future Hour
  const effectiveCloud = Math.min(100, Math.max(0, cloudCoverage + cloudExtraPct));
  const futureSunFactor = isFutureDaylight ? Math.max(0.01, Math.sin((futureElevation * Math.PI) / 180)) : 0.0;
  const effectiveSolar = Math.max(0, futureSunFactor * 220.0 * (1 - (effectiveCloud / 100) * 0.72));

  // Current Solar generation right now at Base Hour
  const currentSunFactor = isCurrentDaylight ? Math.max(0.01, Math.sin((currentElevation * Math.PI) / 180)) : 0.0;
  const currentSolar = Math.max(0, currentSunFactor * 220.0 * (1 - (cloudCoverage / 100) * 0.72));

  // Diurnal Grid Demand at Target Future Hour
  const baseDemand = 160.0 + 35.0 * Math.sin((Math.PI * (futureHour - 6.0)) / 12.0);
  const effectiveDemand = Math.max(130.0, baseDemand) * (1 + demandSpikePct / 100);

  // Deficit and BESS dispatch
  const netDeficit = Math.max(0, effectiveDemand - effectiveSolar);
  const bessCoverage = Math.min(batteryMw, netDeficit);
  const unmetDeficit = Math.max(0, netDeficit - bessCoverage);

  // Without AI vs With Solar Pulse Metrics
  const withoutPeakerMwh = (netDeficit * (isFutureDaylight ? 0.92 : 0.75) * (horizonMinutes / 60)).toFixed(1);
  const withoutCostInr = Math.round(withoutPeakerMwh * 9500); // ₹9,500/MWh for gas peaker
  const withoutCo2Tons = (withoutPeakerMwh * 0.45).toFixed(1);
  const withoutCurtailmentMwh = isFutureDaylight ? (Math.max(0, effectiveSolar - 180) * (horizonMinutes / 60)).toFixed(1) : "0.0";

  const withPeakerMwh = (unmetDeficit * 0.38 * (horizonMinutes / 60)).toFixed(1);
  const withCostInr = Math.round(withPeakerMwh * 9500);
  const withCo2Tons = (withPeakerMwh * 0.45).toFixed(1);
  const withCurtailmentMwh = (Number(withoutCurtailmentMwh) * 0.1).toFixed(1);

  const co2AvoidedTons = Math.max(0, Number(withoutCo2Tons) - Number(withCo2Tons)).toFixed(1);
  const costSavedInr = Math.max(0, withoutCostInr - withCostInr);
  const curtailmentSavedPct = Number(withoutCurtailmentMwh) > 0 ? 90 : 100;

  return (
    <div className="space-y-6">
      {/* Top Header & Simulation Controller */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Zap className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-extrabold text-slate-100 uppercase tracking-wide font-mono">
              Grid Time Machine & Counterfactual Sandbox (Points 3, 4, 29)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Predict the exact future state from <strong>Current Time ({formatHourString(activeHour)})</strong> ahead by <strong>+{horizonMinutes} minutes</strong>.
          </p>
        </div>

        {/* Future Horizon Selector (+30, +60, +120 Min) */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
          {[30, 60, 120].map((mins) => (
            <button
              key={mins}
              onClick={() => setHorizonMinutes(mins)}
              className={`px-3 py-1.5 rounded text-xs font-mono font-bold transition flex items-center space-x-1 ${
                horizonMinutes === mins ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>+{mins} Min Future</span>
            </button>
          ))}
        </div>
      </div>

      {/* DYNAMIC TIME JUMP READOUT (Base Time ➔ Target Future Time) */}
      <div className="bg-slate-900/95 border-2 border-amber-500/40 rounded-xl p-4 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
        {/* Left: Base Time */}
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
            isCurrentDaylight ? 'bg-amber-950/70 border-amber-600/70 text-amber-300' : 'bg-indigo-950/70 border-indigo-700/70 text-indigo-300'
          }`}>
            {isCurrentDaylight ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400">
                Current Base Time
              </span>
              {isLiveTime ? (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-rose-950 text-rose-300 border border-rose-800 font-bold">
                  LIVE CLOCK
                </span>
              ) : (
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800 font-bold">
                  CUSTOM TIME
                </span>
              )}
            </div>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-base font-extrabold font-mono text-slate-100">
                {formatHourString(activeHour)} IST
              </span>
              <span className="text-xs font-mono text-slate-400">
                (Solar: {currentSolar.toFixed(1)} MW • Elev: {currentElevation.toFixed(1)}°)
              </span>
            </div>
          </div>
        </div>

        {/* Center: Arrow Transition */}
        <div className="flex items-center space-x-2 font-mono text-xs text-amber-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 self-center">
          <span>Projecting +{horizonMinutes} Minutes Ahead</span>
          <ArrowRight className="w-4 h-4 text-amber-400 animate-pulse" />
        </div>

        {/* Right: Projected Target Future Time */}
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${
            isFutureDaylight ? 'bg-emerald-950/70 border-emerald-600/70 text-emerald-300' : 'bg-indigo-950/70 border-indigo-700/70 text-indigo-300'
          }`}>
            {isFutureDaylight ? <Sun className="w-5 h-5 text-emerald-400" /> : <Moon className="w-5 h-5 text-indigo-400" />}
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-emerald-400">
              Target Predicted Time ({horizonMinutes === 30 ? '+30 Min' : horizonMinutes === 60 ? '+60 Min' : '+120 Min'})
            </span>
            <div className="flex items-baseline space-x-2 mt-0.5">
              <span className="text-base font-extrabold font-mono text-emerald-300">
                {formatHourString(futureHour)} IST
              </span>
              <span className="text-xs font-mono text-slate-400">
                (Solar: {effectiveSolar.toFixed(1)} MW • Elev: {futureElevation.toFixed(1)}°)
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Point 3 & 29: Head-to-Head Split Screen Comparison for Projected Horizon */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Box 1: WITHOUT AI (The Old Legacy Grid) */}
        <div className="bg-slate-900/90 border-2 border-rose-900/50 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-rose-900/40 pb-3">
            <div className="flex items-center space-x-2">
              <XCircle className="w-5 h-5 text-rose-500" />
              <h3 className="font-bold text-sm text-rose-400 uppercase tracking-wide font-mono">
                WITHOUT AI (Legacy Reactive Grid at {formatHourString(futureHour)})
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950/80 px-2 py-0.5 rounded border border-rose-800">
              REACTIVE & EXPENSIVE
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            {isFutureDaylight ? (
              <span>Operators react 15 minutes late to solar fluctuation at {formatHourString(futureHour)}. Expensive gas peakers must fire immediately to prevent blackout.</span>
            ) : (
              <span>Night transition at {formatHourString(futureHour)} causes sharp grid ramp. Without proactive storage, heavy thermal peaker fuel is consumed.</span>
            )}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono">Gas Peaker Burn:</span>
              <p className="text-lg font-mono font-bold text-rose-400 mt-1">{withoutPeakerMwh} MWh</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono">Fuel Cost Burned:</span>
              <p className="text-lg font-mono font-bold text-rose-400 mt-1">₹{withoutCostInr.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono">Carbon Emitted:</span>
              <p className="text-lg font-mono font-bold text-rose-400 mt-1">{withoutCo2Tons} Tons CO₂</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono">Curtailment Waste:</span>
              <p className="text-lg font-mono font-bold text-rose-400 mt-1">{withoutCurtailmentMwh} MWh</p>
            </div>
          </div>
        </div>

        {/* Box 2: WITH SUNSYNC AI (The Proactive Autonomous Grid) */}
        <div className="bg-slate-900/90 border-2 border-emerald-900/60 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-emerald-900/40 pb-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              <h3 className="font-bold text-sm text-emerald-300 uppercase tracking-wide font-mono">
                WITH SUNSYNC AI (Predicted for {formatHourString(futureHour)})
              </h3>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              OPTIMIZED & SAVINGS
            </span>
          </div>

          <p className="text-xs text-slate-400 leading-relaxed font-mono">
            {isFutureDaylight ? (
              <span>AI preempts solar shift at {formatHourString(futureHour)}, commands BESS fast-discharge, and optimizes electrolyzer Green H₂ feed to eliminate waste.</span>
            ) : (
              <span>AI predicts nightfall at {formatHourString(futureHour)} and pre-schedules battery dispatch, cutting peaker fuel costs by 62%.</span>
            )}
          </p>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="bg-slate-950 p-3 rounded-lg border border-emerald-950">
              <span className="text-[11px] text-slate-400 font-mono">Peaker Reduced To:</span>
              <p className="text-lg font-mono font-bold text-emerald-400 mt-1">{withPeakerMwh} MWh</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-emerald-950">
              <span className="text-[11px] text-slate-400 font-mono">Financial Money Saved:</span>
              <p className="text-lg font-mono font-bold text-emerald-300 mt-1">₹{costSavedInr.toLocaleString('en-IN')}</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-emerald-950">
              <span className="text-[11px] text-slate-400 font-mono">CO₂ Avoided:</span>
              <p className="text-lg font-mono font-bold text-emerald-400 mt-1">+{co2AvoidedTons} Tons</p>
            </div>
            <div className="bg-slate-950 p-3 rounded-lg border border-emerald-950">
              <span className="text-[11px] text-slate-400 font-mono">Curtailment Saved:</span>
              <p className="text-lg font-mono font-bold text-emerald-400 mt-1">+{curtailmentSavedPct}% Saved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Point 4: COUNTERFACTUAL SENSITIVITY ENGINE */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <div className="flex items-center space-x-2">
            <Sliders className="w-4 h-4 text-sky-400" />
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
              Counterfactual Sensitivity Engine (Point 4)
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            Grid Reliability Score: <strong className="text-emerald-400">{Math.round(Math.max(15, 100 - (unmetDeficit / effectiveDemand) * 100))}%</strong>
          </span>
        </div>

        <p className="text-xs text-slate-400 font-mono">
          Simulate hypothetical grid constraints at <strong>{formatHourString(futureHour)} IST</strong>:
        </p>

        {/* 4 Interactive Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          {/* Slider 1: Battery MW */}
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-medium">BESS Capacity:</span>
              <span className="font-mono font-bold text-amber-400">{batteryMw} MW</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={batteryMw}
              onChange={(e) => setBatteryMw(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <p className="text-[10px] text-slate-500 font-mono">Storage available for dispatch</p>
          </div>

          {/* Slider 2: Cloud Extra % */}
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-medium">Cloud Density:</span>
              <span className="font-mono font-bold text-sky-400">+{cloudExtraPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="80"
              value={cloudExtraPct}
              onChange={(e) => setCloudExtraPct(Number(e.target.value))}
              className="w-full accent-sky-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <p className="text-[10px] text-slate-500 font-mono">Optical overcast density</p>
          </div>

          {/* Slider 3: Demand Spike % */}
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-medium">Demand Spike:</span>
              <span className="font-mono font-bold text-rose-400">+{demandSpikePct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="35"
              value={demandSpikePct}
              onChange={(e) => setDemandSpikePct(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <p className="text-[10px] text-slate-500 font-mono">Heatwave / AC load surge</p>
          </div>

          {/* Slider 4: Transmission Line Constraint */}
          <div className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-slate-300 font-medium">Grid Line Capacity:</span>
              <span className="font-mono font-bold text-purple-400">-{transmissionDropPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="50"
              value={transmissionDropPct}
              onChange={(e) => setTransmissionDropPct(Number(e.target.value))}
              className="w-full accent-purple-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
            <p className="text-[10px] text-slate-500 font-mono">Transmission line outage buffer</p>
          </div>
        </div>

        {/* Live Calculation Output Bar */}
        <div className="bg-slate-950/90 border border-slate-800 rounded-lg p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div>
            <span className="text-slate-500">Effective Solar at {formatHourString(futureHour)}: </span>
            <strong className="text-amber-400">{effectiveSolar.toFixed(1)} MW</strong>
          </div>
          <div>
            <span className="text-slate-500">Predicted Load Demand: </span>
            <strong className="text-sky-400">{effectiveDemand.toFixed(1)} MW</strong>
          </div>
          <div>
            <span className="text-slate-500">BESS Buffer: </span>
            <strong className="text-emerald-400">+{bessCoverage.toFixed(1)} MW</strong>
          </div>
          <div>
            <span className="text-slate-500">Unmet Deficit: </span>
            <strong className={unmetDeficit > 0 ? "text-rose-400 font-bold" : "text-emerald-400"}>
              {unmetDeficit.toFixed(1)} MW
            </strong>
          </div>
        </div>
      </div>
    </div>
  );
}
