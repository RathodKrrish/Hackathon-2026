import React, { useState, useEffect } from 'react';
import { 
  Eye, ArrowRight, ShieldCheck, AlertCircle, RefreshCw, Compass, 
  Moon, Sun, Wind, Zap, Activity, CloudSun, CloudRain
} from 'lucide-react';

export default function TabSkyRadar({ 
  causalChainData, 
  liveState, 
  cloudCoverage = 22, 
  setCloudCoverage 
}) {
  const elevation = liveState?.solar_geometry?.elevation_deg ?? -10;
  const isNight = elevation <= 0.0;

  // Gentle atmospheric wind pulse loop
  const [windTick, setWindTick] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => {
      setWindTick((t) => (t + 1) % 360);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  // Atmospheric physics: Wind increases with cloud front barometric pressure drops
  const baseWind = 17.5 + (cloudCoverage * 0.19);
  const windOscillation = Math.sin((windTick * Math.PI) / 8) * 2.1;
  const currentWindSpeed = Number(Math.max(12.0, baseWind + windOscillation).toFixed(1));

  // Dynamic moving clouds in radar
  const [clouds, setClouds] = useState([
    { id: 1, x: 35, y: 40, baseR: 18, type: 'Cumulonimbus', heading: 310, speedFactor: 1.08 },
    { id: 2, x: 72, y: 25, baseR: 12, type: 'Altocumulus', heading: 295, speedFactor: 0.94 },
    { id: 3, x: 20, y: 75, baseR: 24, type: 'Cumulonimbus', heading: 320, speedFactor: 1.15 },
  ]);

  // Optical flow animation loop with speed proportional to wind
  useEffect(() => {
    const speedMultiplier = (currentWindSpeed / 24.0) * 0.32;
    const timer = setInterval(() => {
      setClouds((prev) =>
        prev.map((c) => ({
          ...c,
          x: c.x > 95 ? 5 : c.x + speedMultiplier,
          y: c.y > 95 ? 5 : c.y + (speedMultiplier * 0.5),
        }))
      );
    }, 100);
    return () => clearInterval(timer);
  }, [currentWindSpeed]);

  // Dynamic Spatio-Temporal Nowcasting Causal Physics
  const nominalGenMw = 212.4;
  const dniDropW = Math.round(cloudCoverage * 14.1);
  const genLossMw = isNight ? 0.0 : Number(((nominalGenMw * (cloudCoverage / 100)) * 0.73).toFixed(1));
  const bessDispatchMw = isNight ? 0.0 : Number(Math.min(30.0, genLossMw * 0.643).toFixed(1));
  const demandShiftMw = isNight ? 0.0 : Number(Math.max(0, genLossMw - bessDispatchMw).toFixed(1));
  const reserveMargin = Math.max(7.2, (18.5 - (genLossMw * 0.125))).toFixed(1);
  const etaMinutes = Math.max(3, Math.round((290 / currentWindSpeed) * Math.max(0.6, 1 - (cloudCoverage / 220))));

  // Dynamic 7-step Causal Chain
  const dynamicSteps = [
    {
      step_number: 1,
      title: 'Cloud Vector Ingress',
      metric: `+${cloudCoverage}% Optical Coverage`,
      detail: `All-Sky camera in Patan detected ${cloudCoverage > 50 ? 'dense thunderstorm front' : 'moving cloud mass'} traveling at ${currentWindSpeed} km/h NW.`
    },
    {
      step_number: 2,
      title: 'Shadow Arrival Trajectory',
      metric: `ETA: ~${etaMinutes} Minutes`,
      detail: `Optical flow vectors project ground shadow impact on Charanka Cluster ${cloudCoverage > 40 ? 'A, B & C' : 'B'}.`
    },
    {
      step_number: 3,
      title: 'Direct Irradiance Attenuation',
      metric: isNight ? '0 W/m² (Night)' : `DNI Drop: -${dniDropW} W/m²`,
      detail: isNight ? 'Sun is below horizon. Astronomical starlight tracking active.' : `Direct Normal Irradiance blocked by ${cloudCoverage > 50 ? 'cumulonimbus optical density' : 'stratocumulus cloud deck'}.`
    },
    {
      step_number: 4,
      title: 'Solar Generation Curtailment/Loss',
      metric: isNight ? '0.0 MW (Night Standby)' : `-${genLossMw} MW Generation`,
      detail: isNight ? 'All 32 inverter arrays already in 0.00 kW sleep mode.' : `PV array output drops from ${nominalGenMw} MW to ${(nominalGenMw - genLossMw).toFixed(1)} MW.`
    },
    {
      step_number: 5,
      title: 'Grid Reserve Margin Compression',
      metric: `Reserve: ${reserveMargin}% (IEGC Band)`,
      detail: `Gujarat grid spinning reserve margin approaches the 12% regulatory threshold.`
    },
    {
      step_number: 6,
      title: 'Smart BESS Fast-Discharge',
      metric: `+${bessDispatchMw} MW Dispatched`,
      detail: `Autonomous inverter fast-injection (response time < 140ms) locks grid at 50.01 Hz.`
    },
    {
      step_number: 7,
      title: 'Flexible Demand Shifting',
      metric: `-${demandShiftMw} MW Deferred`,
      detail: `Gujarat DISCOM industrial agri-pumping loads shifted by 15 minutes to buffer deficit.`
    }
  ];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-sky-400" />
            <h2 className="text-base font-bold text-slate-100 uppercase tracking-wide font-mono">
              Computer Vision & Cloud Radar: Gujarat Solar Belt (Points 2, 8)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Spatio-Temporal Nowcasting (0 - 30 Minutes): Ground All-Sky Imager in Patan + Real-Time Optical Flow Vectoring
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
          <span className="bg-slate-950 text-sky-400 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center">
            <Wind className="w-3.5 h-3.5 mr-1.5 text-cyan-400 animate-pulse" />
            Wind: <strong>{currentWindSpeed} km/h NW</strong>
          </span>
          <span className="bg-slate-950 text-amber-400 border border-slate-800 px-3 py-1.5 rounded-lg flex items-center">
            <Compass className="w-3.5 h-3.5 mr-1.5 animate-spin-slow" />
            Farneback Optical Flow v2.4
          </span>
          <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-3 py-1.5 rounded-lg">
            CV Latency: 42 ms
          </span>
        </div>
      </div>

      {/* CLOUD COVERAGE SIMULATOR BAR (Directly updates radar & causal chain in real-time) */}
      <div className="bg-slate-900/95 border-2 border-sky-500/40 rounded-xl p-4 shadow-lg space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-2.5">
          <div className="flex items-center space-x-2">
            <CloudSun className="w-4 h-4 text-sky-400" />
            <span className="text-xs font-mono font-bold text-slate-200 uppercase tracking-wider">
              Live Cloud Coverage & Optical Density Controller
            </span>
          </div>
          <div className="flex items-center space-x-2 font-mono text-xs">
            <span className="text-slate-400">Current Coverage:</span>
            <span className="px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800 font-extrabold text-sm">
              {cloudCoverage}%
            </span>
            <span className="text-slate-500">|</span>
            <span className="text-slate-400">Wind: <strong className="text-cyan-300">{currentWindSpeed} km/h</strong></span>
          </div>
        </div>

        {/* Range Slider for Cloud Coverage */}
        <div className="space-y-1.5">
          <input
            type="range"
            min="0"
            max="100"
            value={cloudCoverage}
            onChange={(e) => {
              const val = parseInt(e.target.value, 10);
              if (setCloudCoverage) setCloudCoverage(val);
            }}
            className="w-full h-3 bg-slate-800 rounded-lg appearance-none cursor-ew-resize accent-sky-400 hover:accent-sky-300 transition shadow-inner"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0% Clear Sky</span>
            <span>25% Scattered Cumulus</span>
            <span>50% Broken Clouds</span>
            <span>75% Overcast Deck</span>
            <span>100% Severe Monsoon Storm</span>
          </div>
        </div>

        {/* Quick Shortcut Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-mono text-slate-400 mr-1">Quick Scenarios:</span>
          <button
            onClick={() => setCloudCoverage && setCloudCoverage(5)}
            className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-[11px] font-mono text-slate-300 border border-slate-800 transition"
          >
            ☀️ Clear Sky (5%)
          </button>
          <button
            onClick={() => setCloudCoverage && setCloudCoverage(22)}
            className="px-2 py-0.5 rounded bg-sky-950/50 hover:bg-sky-900/60 text-[11px] font-mono text-sky-300 border border-sky-800 font-bold transition shadow"
          >
            🌤️ Scattered (22%)
          </button>
          <button
            onClick={() => setCloudCoverage && setCloudCoverage(48)}
            className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-[11px] font-mono text-amber-300 border border-slate-800 transition"
          >
            ☁️ Heavy Cloud (48%)
          </button>
          <button
            onClick={() => setCloudCoverage && setCloudCoverage(78)}
            className="px-2 py-0.5 rounded bg-slate-950 hover:bg-slate-800 text-[11px] font-mono text-rose-300 border border-slate-800 transition"
          >
            ⛈️ Storm Front (78%)
          </button>
        </div>
      </div>

      {/* Main Dual Grid: Interactive Radar + Causal Chain */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Sky Radar Dome (Points 8 & 21) */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 flex flex-col">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
                {isNight ? "Night Thermal Infrared Imager" : "All-Sky Imager Projection (Charanka Hub)"}
              </h3>
              <p className="text-xs text-slate-400">
                {isNight ? "Solar elevation ≤ 0° — Zero irradiance, sky dome tracking thermal cloud base" : "Live optical cloud tracking with velocity vectors"}
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center space-x-1">
                <Wind className="w-3 h-3 text-cyan-400" />
                <span>{currentWindSpeed} km/h</span>
              </span>
              <span className={`text-xs font-mono px-2 py-0.5 rounded border ${
                isNight ? 'bg-indigo-950 text-indigo-300 border-indigo-800' : 'bg-slate-800 text-amber-400 border-slate-700'
              }`}>
                {isNight ? '🌙 Thermal IR Mode' : `${clouds.length} Active Cloud Objects`}
              </span>
            </div>
          </div>

          {/* Simulated 2D Sky Radar Dome */}
          <div className={`relative w-full aspect-square max-h-[380px] rounded-2xl border-2 overflow-hidden flex items-center justify-center transition-all duration-500 ${
            isNight ? 'bg-gradient-to-b from-indigo-950/70 via-slate-950 to-slate-950 border-indigo-900/60' : 'bg-slate-950 border-slate-800'
          }`}>
            {/* Radar Grid Rings */}
            <div className="absolute inset-8 rounded-full border border-slate-800/80"></div>
            <div className="absolute inset-20 rounded-full border border-slate-800/60"></div>
            <div className="absolute inset-32 rounded-full border border-dashed border-slate-800/50"></div>
            {/* Crosshairs */}
            <div className="absolute inset-x-0 top-1/2 h-[1px] bg-slate-800/70"></div>
            <div className="absolute inset-y-0 left-1/2 w-[1px] bg-slate-800/70"></div>

            {/* Daytime Sun or Night Moon */}
            {isNight ? (
              <div className="absolute top-12 right-16 flex items-center space-x-1.5 opacity-80 animate-pulse">
                <Moon className="w-6 h-6 text-sky-200" />
                <span className="text-[10px] font-mono text-sky-300">Waxing Moon (Elev: {elevation.toFixed(1)}°)</span>
              </div>
            ) : (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
                <div className="w-12 h-12 rounded-full bg-amber-400/20 blur-md animate-ping"></div>
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-amber-300 to-yellow-400 shadow-lg shadow-amber-400/50 flex items-center justify-center">
                  <Sun className="w-5 h-5 text-slate-950" />
                </div>
                <span className="text-[9px] font-mono font-bold text-amber-300 bg-slate-950/80 px-1 rounded mt-1">
                  Solar Noon (Elev: {elevation.toFixed(1)}°)
                </span>
              </div>
            )}

            {/* Sweep Arm */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`w-1/2 h-[2px] origin-left animate-spin-slow opacity-60 ${
                isNight ? 'bg-gradient-to-r from-transparent to-indigo-400' : 'bg-gradient-to-r from-transparent to-sky-400'
              }`}></div>
            </div>

            {/* Solar Plant Footprints on Ground */}
            {/* Plant Charanka: Patan, Gujarat */}
            <div className="absolute top-[48%] left-[42%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-5 h-5 rounded-md bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center animate-pulse">
                <span className="text-[9px] font-bold text-amber-300">CH</span>
              </div>
              <span className="text-[10px] font-mono font-bold text-amber-400 mt-1 bg-slate-950/80 px-1 rounded">
                Charanka (80MW)
              </span>
            </div>

            {/* Plant Bhadla: Rajasthan */}
            <div className="absolute top-[35%] left-[75%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-4 h-4 rounded-md bg-sky-500/20 border border-sky-400 flex items-center justify-center">
                <span className="text-[9px] font-bold text-sky-300">BH</span>
              </div>
              <span className="text-[10px] font-mono text-sky-400 mt-1 bg-slate-950/80 px-1 rounded">
                Bhadla (120MW)
              </span>
            </div>

            {/* Plant Dholera: Gujarat SIR */}
            <div className="absolute top-[75%] left-[55%] -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
              <div className="w-4 h-4 rounded-md bg-emerald-500/20 border border-emerald-400 flex items-center justify-center">
                <span className="text-[9px] font-bold text-emerald-300">DH</span>
              </div>
              <span className="text-[10px] font-mono text-emerald-400 mt-1 bg-slate-950/80 px-1 rounded">
                Dholera (50MW)
              </span>
            </div>

            {/* Render Dynamic Moving Clouds with Optical Flow Vectors */}
            {clouds.map((c) => {
              // Dynamic radius and density scaling based on cloudCoverage
              const radius = Math.max(8, Math.min(32, c.baseR * (0.6 + (cloudCoverage / 70))));
              const dynamicDensity = Math.min(0.95, (cloudCoverage / 100) * 1.1);
              const cloudSpeed = Number((currentWindSpeed * c.speedFactor).toFixed(1));

              return (
                <div
                  key={c.id}
                  className="absolute transition-all duration-100 cursor-pointer group"
                  style={{
                    top: `${c.y}%`,
                    left: `${c.x}%`,
                    width: `${radius * 2}%`,
                    height: `${radius * 2}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div
                    className="w-full h-full rounded-full blur-md opacity-75 border transition-colors duration-300"
                    style={{
                      borderColor: dynamicDensity > 0.65 ? 'rgba(239, 68, 68, 0.6)' : 'rgba(56, 189, 248, 0.5)',
                      backgroundColor: dynamicDensity > 0.65 
                        ? `rgba(239, 68, 68, ${Math.min(0.7, 0.3 + dynamicDensity * 0.4)})` 
                        : `rgba(56, 189, 248, ${Math.min(0.6, 0.2 + dynamicDensity * 0.3)})`,
                    }}
                  ></div>

                  {/* Dynamic Velocity Vector Arrow */}
                  <div
                    className="absolute top-1/2 left-1/2 w-8 h-[2px] bg-cyan-300 origin-left"
                    style={{ transform: `rotate(${c.heading}deg)` }}
                  >
                    <div className="absolute right-0 -top-1 w-2 h-2 border-t-2 border-r-2 border-cyan-300 rotate-45"></div>
                  </div>

                  <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-[10px] font-mono px-2 py-0.5 rounded shadow-lg text-slate-200 whitespace-nowrap z-20">
                    {c.type} | {cloudSpeed} km/h | COD: {dynamicDensity.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Plant Health & Inverter Anomaly Diagnostic (Point 21) */}
          <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 text-xs space-y-1">
            <div className="flex items-center justify-between text-amber-400 font-semibold font-mono">
              <span className="flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1.5 text-emerald-400" />
                Plant Health vs Cloud Shading Inspector (Point 21)
              </span>
              <span className="text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-800 text-[10px]">
                INVERTERS 99.4% HEALTHY
              </span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed font-mono">
              Charanka String 14 output confirmed: Generation dip is <strong>100% weather cloud-induced</strong> ({cloudCoverage}% coverage). No combiner box trips or string disconnects observed across all 32 central inverters. Maintenance team ticket: <strong className="text-slate-300">DISMISSED (NO FAULT)</strong>.
            </p>
          </div>
        </div>

        {/* Right Column: Dynamic Causal Chain */}
        <div className="lg:col-span-6 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
                  Cloud → Power → Grid → Action Causal Chain
                </h3>
                <p className="text-xs text-slate-400 font-mono">Point 2: Explainable Physics & SLDC Gujarat Reaction Pipeline</p>
              </div>
              <span className="text-[10px] font-bold font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                DEFICIT AVERTED
              </span>
            </div>

            {/* Dynamic Summary Banner */}
            <p className="mt-3 text-xs text-slate-300 bg-slate-950/70 p-3 rounded-lg border border-slate-800/80 leading-relaxed font-mono">
              {isNight ? (
                <span>🌙 <strong>Night Standby Active:</strong> Zero solar generation at night. 32 inverters in sleep mode. Grid deficit managed via baseline thermal & hydro dispatch.</span>
              ) : (
                <span>⚡ <strong>Live Dynamic Action:</strong> Cloud shadow ({cloudCoverage}%) triggers a <strong>{genLossMw} MW</strong> generation drop; fully neutralized via <strong>{bessDispatchMw} MW</strong> BESS + <strong>{demandShiftMw} MW</strong> demand shift.</span>
              )}
            </p>
          </div>

          {/* 7-Step Step-by-Step Dynamic Chain */}
          <div className="space-y-2.5 my-2">
            {dynamicSteps.map((st) => (
              <div
                key={st.step_number}
                className="flex items-center space-x-3 bg-slate-950/80 border border-slate-800/80 rounded-lg p-2.5 hover:border-slate-700 transition"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-mono font-bold text-amber-400">
                  {st.step_number}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-200">{st.title}</span>
                    <span className="text-xs font-mono font-bold text-amber-300">{st.metric}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 truncate font-mono">{st.detail}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-emerald-950/30 border border-emerald-800/50 rounded-lg p-3 text-xs flex items-center justify-between font-mono">
            <span className="text-emerald-300 font-medium">Gujarat Grid Frequency: Locked at 50.01 Hz (IEGC Norm)</span>
            <span className="text-emerald-400 font-bold">RoCoF: ±0.01 Hz/s</span>
          </div>
        </div>
      </div>
    </div>
  );
}
