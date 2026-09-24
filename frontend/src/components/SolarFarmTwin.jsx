import React, { useState, useEffect } from 'react';
import { 
  Grid, Eye, Zap, Thermometer, ShieldCheck, AlertCircle, X, Activity, 
  Flame, Bell, BellOff, RefreshCw, AlertTriangle, ShieldAlert, Sun, Moon, Clock, Wind, Play
} from 'lucide-react';
import { start15SecondSiren, stopEmergencySiren } from '../utils/scadaAudio';

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

export default function SolarFarmTwin({ 
  cloudCoverage = 25,
  liveState,
  isLiveTime = true,
  setIsLiveTime,
  scrubberHour = 12.5,
  setScrubberHour
}) {
  const [selectedInverter, setSelectedInverter] = useState(null);
  const [viewMode, setViewMode] = useState('POWER'); // 'POWER', 'THERMAL', 'SOILING'
  const [faultBlockId, setFaultBlockId] = useState(null);
  const [sirenSeconds, setSirenSeconds] = useState(0);

  // Compute precise decimal hour
  const now = new Date();
  const liveDecimalHour = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
  const activeHour = isLiveTime ? liveDecimalHour : (scrubberHour !== undefined ? scrubberHour : 12.5);

  // Astronomical elevation & Diurnal time context
  const elevation = calculateSolarElevation(activeHour);
  const isNight = elevation <= 0.0;

  // Drifting Cloud Physics: Wind drifts cloud patches across the 32 arrays
  const shadedCount = isNight || cloudCoverage <= 5 ? 0 : Math.min(24, Math.max(3, Math.round((cloudCoverage / 100) * 32)));
  // Wind shifts clouds dynamically with time across blocks
  const shiftOffset = Math.floor((activeHour * 4.6) % 32);

  // Helper to format decimal hour as 12-hour AM/PM string
  const formatHourString = (hourVal) => {
    const h = Math.floor(hourVal) % 24;
    const m = Math.floor((hourVal - Math.floor(hourVal)) * 60);
    const period = h >= 12 ? 'PM' : 'AM';
    const displayH = h % 12 === 0 ? 12 : h % 12;
    return `${String(displayH).padStart(2, '0')}:${String(m).padStart(2, '0')} ${period}`;
  };

  // Trigger 15-second critical hardware damage siren
  const handleTriggerHardwareDamage = (blockId = 14) => {
    setFaultBlockId(blockId);
    start15SecondSiren(
      (sec) => setSirenSeconds(sec),
      () => setSirenSeconds(0)
    );

    // Select the damaged inverter to immediately show diagnostics
    setSelectedInverter({
      id: blockId,
      name: `Inverter Substation-Block ${String(blockId).padStart(2, '0')}`,
      capacity_mw: 2.5,
      current_mw: 0.00,
      dc_voltage: 0,
      ac_current: 0,
      temp_c: 88.5,
      status: 'CRITICAL_ARC_FAULT',
      mppt_efficiency: 0.0,
      inverter_model: 'SMA Sunny Central 2500-EV (1500V DC)'
    });
  };

  const handleSilenceSiren = () => {
    stopEmergencySiren();
    setSirenSeconds(0);
  };

  const handleRepairFault = () => {
    stopEmergencySiren();
    setSirenSeconds(0);
    setFaultBlockId(null);
    setSelectedInverter(null);
  };

  // Quick preset button click handler
  const handleSetPreset = (presetHour, live = false) => {
    if (live) {
      if (setIsLiveTime) setIsLiveTime(true);
    } else {
      if (setIsLiveTime) setIsLiveTime(false);
      if (setScrubberHour) setScrubberHour(presetHour);
    }
  };

  // Generate 32 central inverter blocks for Charanka Solar Park
  const inverters = Array.from({ length: 32 }, (_, i) => {
    const blockNum = i + 1;
    const isDamaged = faultBlockId === blockNum;
    
    // Check if this block falls inside the drifting cloud shadow window
    const dist = (i - shiftOffset + 32) % 32;
    const isUnderCloud = !isNight && dist < shadedCount;
    
    // Diurnal astronomical physics factor (sine of solar elevation)
    const sunFactor = isNight ? 0.0 : Math.max(0.01, Math.sin((elevation * Math.PI) / 180));
    const baseOutput = 2.5 * sunFactor;
    
    let output = 0.00;
    let tempC = 25;
    let status = 'OPTIMAL';

    if (isDamaged) {
      output = 0.00;
      tempC = 88.5;
      status = 'CRITICAL_ARC_FAULT';
    } else if (isNight) {
      output = 0.00;
      tempC = Math.round(24 + (blockNum % 3) * 0.7); // 24°C - 26°C calm desert night
      status = 'NIGHT_STANDBY';
    } else {
      output = isUnderCloud ? (baseOutput * 0.42) : (baseOutput * 0.94);
      tempC = Math.round(27 + sunFactor * 24 + (blockNum % 4) * 0.9 - (isUnderCloud ? 5 : 0));
      status = isUnderCloud ? 'SHADED_CLOUD' : (blockNum === 14 ? 'DUST_ACCUMULATION' : 'OPTIMAL');
    }

    return {
      id: blockNum,
      name: `Inverter Substation-Block ${String(blockNum).padStart(2, '0')}`,
      capacity_mw: 2.5,
      current_mw: Number(output.toFixed(2)),
      dc_voltage: isDamaged || isNight ? 0 : Math.round(1120 * sunFactor + (blockNum % 7) * 4),
      ac_current: isDamaged || isNight ? 0 : Math.round(1240 * sunFactor + (blockNum % 5) * 5),
      temp_c: tempC,
      status: status,
      mppt_efficiency: isDamaged ? 0.0 : isNight ? 0.0 : (isUnderCloud ? 96.2 : 98.8),
      inverter_model: 'SMA Sunny Central 2500-EV (1500V DC)'
    };
  });

  const totalFarmMw = Number(inverters.reduce((sum, inv) => sum + inv.current_mw, 0).toFixed(1));
  const avgTemp = Math.round(inverters.reduce((sum, inv) => sum + inv.temp_c, 0) / 32);

  // Cloud drifting window display text
  const cloudStartBlock = ((shiftOffset) % 32) + 1;
  const cloudEndBlock = ((shiftOffset + shadedCount - 1) % 32) + 1;

  return (
    <div className="space-y-6">
      {/* 15-Second Active Emergency Banner (Shows when siren is blaring) */}
      {sirenSeconds > 0 && (
        <div className="bg-rose-950/90 border-2 border-rose-500 rounded-xl p-4 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-3 animate-pulse">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center animate-bounce">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-mono font-bold uppercase bg-rose-900 px-2 py-0.5 rounded text-rose-200 border border-rose-700">
                  CRITICAL HARDWARE DAMAGE (15s SIREN)
                </span>
                <span className="text-xs font-mono font-extrabold text-amber-300">
                  COUNTDOWN: {sirenSeconds}s
                </span>
              </div>
              <p className="text-xs text-rose-200 font-mono mt-0.5">
                Block #14 DC Arc Flash & Thermal Hotspot detected! Audio siren active across substation.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleSilenceSiren}
              className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-mono font-bold flex items-center space-x-1.5 border border-slate-700 transition"
            >
              <BellOff className="w-3.5 h-3.5 text-rose-400" />
              <span>Silence Horn</span>
            </button>
            <button
              onClick={handleRepairFault}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center space-x-1.5 transition shadow"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Repair & Restore</span>
            </button>
          </div>
        </div>
      )}

      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Grid className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-extrabold text-slate-100 uppercase tracking-wide font-mono">
              Charanka Solar Park (Patan, Gujarat) - 32-Block Digital Twin
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            <strong>Substation SCADA Telemetry:</strong> Diurnal astronomical solar physics with dynamic wind-drifted shading and live hardware fault simulation.
          </p>
        </div>

        {/* View Mode Switcher + Live Fault Trigger Button */}
        <div className="flex flex-wrap items-center gap-2">
          {/* 15s Hardware Fault Demo Button for Judges */}
          <button
            onClick={() => handleTriggerHardwareDamage(14)}
            className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold transition flex items-center space-x-1.5 shadow-md shadow-rose-900/30"
            title="Demonstrate 15-second emergency siren for panel/inverter damage"
          >
            <Flame className="w-3.5 h-3.5" />
            <span>Simulate Hardware Damage (15s Siren)</span>
          </button>

          <div className="flex items-center space-x-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
            <button
              onClick={() => setViewMode('POWER')}
              className={`px-3 py-1.5 rounded transition ${viewMode === 'POWER' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              ⚡ Power
            </button>
            <button
              onClick={() => setViewMode('THERMAL')}
              className={`px-3 py-1.5 rounded transition ${viewMode === 'THERMAL' ? 'bg-rose-500 text-white font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              🔥 Thermal
            </button>
            <button
              onClick={() => setViewMode('SOILING')}
              className={`px-3 py-1.5 rounded transition ${viewMode === 'SOILING' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
            >
              🧹 Soiling
            </button>
          </div>
        </div>
      </div>

      {/* 24-HOUR INTERACTIVE DIURNAL TIME SCROLLER & SCADA SIMULATOR */}
      <div className="bg-slate-900/95 border-2 border-amber-500/50 rounded-xl p-5 shadow-2xl space-y-4">
        {/* Top row: Title + Glowing Digital Clock & Metrics */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border shadow-inner ${
              isNight 
                ? 'bg-indigo-950/80 border-indigo-700/80 text-indigo-300' 
                : 'bg-amber-950/80 border-amber-600/80 text-amber-300'
            }`}>
              {isNight ? <Moon className="w-5 h-5 text-indigo-400" /> : <Sun className="w-5 h-5 text-amber-400" />}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wide font-mono">
                  Diurnal Time Scrubber (24-Hour Continuous Simulator)
                </h3>
                {isLiveTime ? (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-950/90 text-rose-300 border border-rose-700 font-bold flex items-center space-x-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping"></span>
                    <span>LIVE SYNC</span>
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950/90 text-amber-300 border border-amber-700 font-bold">
                    🎛️ MANUAL SCRUBBER
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400 font-mono mt-0.5">
                Drag this slider smoothly left/right to simulate any time of the day and watch inverters respond live!
              </p>
            </div>
          </div>

          {/* Glowing Digital Telemetry Readouts */}
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            <div className={`px-3 py-1.5 rounded-lg border flex items-center space-x-2 ${
              isNight 
                ? 'bg-indigo-950/70 border-indigo-600/80 text-indigo-200' 
                : 'bg-amber-950/70 border-amber-500/80 text-amber-200'
            }`}>
              <Clock className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-extrabold">{formatHourString(activeHour)} IST</span>
              <span className="text-slate-500">|</span>
              <span className="font-semibold">Elev: {elevation.toFixed(1)}°</span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Farm: <strong className={isNight ? 'text-indigo-400' : 'text-emerald-400'}>{totalFarmMw} MW</strong> / 80 MW</span>
            </div>

            <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-slate-200 flex items-center space-x-2">
              <Thermometer className="w-4 h-4 text-rose-400" />
              <span>Avg Core: <strong className={isNight ? 'text-sky-300' : 'text-orange-400'}>{avgTemp}°C</strong></span>
            </div>
          </div>
        </div>

        {/* INTERACTIVE RANGE SLIDER (Smooth side scroll like 22% cloud slider) */}
        <div className="bg-slate-950/90 border border-slate-800/90 rounded-xl p-4 space-y-2">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="text-slate-300 font-bold flex items-center space-x-2">
              <span>⏰ Slide Time (00:00 to 24:00):</span>
              <span className="text-amber-400 font-extrabold text-sm px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
                {formatHourString(activeHour)}
              </span>
            </span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleSetPreset(null, true)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition flex items-center space-x-1 border ${
                  isLiveTime
                    ? 'bg-rose-600 text-white border-rose-500 font-bold shadow'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700'
                }`}
                title="Sync directly to live clock"
              >
                <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse"></span>
                <span>Reset to Live Time</span>
              </button>
            </div>
          </div>

          {/* Big Horizontal Range Slider */}
          <div className="relative pt-1 pb-1">
            <input 
              type="range"
              min="0.0"
              max="24.0"
              step="0.05"
              value={activeHour}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                if (setIsLiveTime) setIsLiveTime(false);
                if (setScrubberHour) setScrubberHour(val);
              }}
              className="w-full h-4 bg-slate-800 rounded-lg appearance-none cursor-ew-resize accent-amber-500 hover:accent-amber-400 transition shadow-inner"
            />
          </div>

          {/* 24-Hour Milestone Ticks */}
          <div className="grid grid-cols-4 sm:grid-cols-8 text-[10px] font-mono text-slate-400 pt-1 border-t border-slate-900">
            <span className="text-left">🌙 00:00 (0 kW)</span>
            <span className="text-center">🌅 06:15 Dawn</span>
            <span className="text-center">☀️ 09:30 (1.6 MW)</span>
            <span className="text-center font-bold text-amber-400">☀️ 12:30 Peak (2.35 MW)</span>
            <span className="text-center">🌤️ 16:00 (1.2 MW)</span>
            <span className="text-center">🌆 18:30 Sunset</span>
            <span className="text-center">🌙 21:00 Standby</span>
            <span className="text-right">🌙 24:00 (0 kW)</span>
          </div>
        </div>

        {/* Quick Jump Shortcuts (Optional 1-Click Buttons) */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-mono text-slate-400 mr-1 font-semibold">Quick Jump:</span>
          <button
            onClick={() => handleSetPreset(6.25, false)}
            className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-[11px] font-mono text-slate-300 border border-slate-800 hover:border-slate-600 transition"
          >
            🌅 06:15 AM (Dawn 0.15 MW)
          </button>
          <button
            onClick={() => handleSetPreset(9.5, false)}
            className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-[11px] font-mono text-slate-300 border border-slate-800 hover:border-slate-600 transition"
          >
            ☀️ 09:30 AM (1.65 MW)
          </button>
          <button
            onClick={() => handleSetPreset(12.5, false)}
            className="px-2.5 py-1 rounded bg-amber-950/40 hover:bg-amber-900/60 text-[11px] font-mono text-amber-300 border border-amber-700/80 font-bold transition shadow"
          >
            ☀️ 12:30 PM (Midday Peak 2.35 MW)
          </button>
          <button
            onClick={() => handleSetPreset(16.0, false)}
            className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-[11px] font-mono text-slate-300 border border-slate-800 hover:border-slate-600 transition"
          >
            🌤️ 04:00 PM (1.25 MW)
          </button>
          <button
            onClick={() => handleSetPreset(18.3, false)}
            className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-[11px] font-mono text-orange-300 border border-slate-800 hover:border-orange-700 transition"
          >
            🌆 06:20 PM (Sunset Ramp 0.20 MW)
          </button>
          <button
            onClick={() => handleSetPreset(21.0, false)}
            className="px-2.5 py-1 rounded bg-indigo-950/40 hover:bg-indigo-900/60 text-[11px] font-mono text-indigo-300 border border-indigo-800/80 transition"
          >
            🌙 09:00 PM (Night Sleep 0.00 kW)
          </button>
        </div>

        {/* Dynamic Wind & Cloud Drifting Status Bar */}
        <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
          <div className="flex items-center space-x-2 text-slate-300">
            <Wind className="w-4 h-4 text-sky-400 shrink-0" />
            <span>
              <strong>Wind Dynamics (Patan Desert):</strong> 14.8 km/h West-to-East
            </span>
          </div>
          <div className="text-slate-400">
            {isNight ? (
              <span className="text-indigo-300 font-semibold">
                🌙 Night Standby: Sun elevation is {elevation.toFixed(1)}° (below horizon). All 32 inverters in sleep mode (0.00 kW, 24°C).
              </span>
            ) : shadedCount > 0 ? (
              <span className="text-amber-300">
                ☁️ Wind Drifting Clouds: Shading dynamically moved across <strong>Blocks #{cloudStartBlock} to #{cloudEndBlock}</strong> ({shadedCount} blocks shaded)
              </span>
            ) : (
              <span className="text-emerald-400">
                ☀️ Clear-Sky: All 32 inverter blocks receiving 100% direct normal irradiance
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 32 Inverter Array Blocks Grid Matrix */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-mono">
            <span>Status:</span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
              <span className="text-emerald-400">Optimal ({inverters.filter(i => i.status === 'OPTIMAL').length})</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
              <span className="text-amber-400">Cloud Shaded ({inverters.filter(i => i.status === 'SHADED_CLOUD').length})</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded bg-indigo-500"></span>
              <span className="text-indigo-300">Night Standby ({inverters.filter(i => i.status === 'NIGHT_STANDBY').length})</span>
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-2.5 h-2.5 rounded bg-rose-500 animate-ping"></span>
              <span className="text-rose-400 font-bold">Arc Fault ({inverters.filter(i => i.status === 'CRITICAL_ARC_FAULT').length})</span>
            </span>
          </div>
          <span className="text-xs font-mono text-slate-400">Click any block to inspect full SCADA diagnostics</span>
        </div>

        {/* 32 Grid Cards */}
        <div className="grid grid-cols-2 xs:grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2 sm:gap-2.5">
          {inverters.map((inv) => {
            const isDamaged = inv.status === 'CRITICAL_ARC_FAULT';
            const isShaded = inv.status === 'SHADED_CLOUD';
            const isBlockNight = inv.status === 'NIGHT_STANDBY';
            return (
              <button
                key={inv.id}
                onClick={() => setSelectedInverter(inv)}
                className={`p-3 rounded-lg border text-left transition-all duration-200 group relative overflow-hidden ${
                  selectedInverter?.id === inv.id
                    ? 'border-amber-400 ring-2 ring-amber-400/30'
                    : isDamaged
                      ? 'bg-rose-950/80 border-rose-500 ring-2 ring-rose-500/50 animate-pulse'
                      : isBlockNight
                        ? 'bg-slate-950/90 border-slate-800/90 hover:border-indigo-600/70 hover:bg-slate-900/60'
                        : isShaded
                          ? 'bg-amber-950/40 border-amber-800/80 hover:border-amber-500'
                          : 'bg-slate-950 border-slate-800 hover:border-slate-600 hover:bg-slate-900'
                }`}
              >
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="font-bold text-slate-300">#{inv.id}</span>
                  <span className={`w-2 h-2 rounded-full ${
                    isDamaged 
                      ? 'bg-rose-500 animate-ping' 
                      : isBlockNight
                        ? 'bg-indigo-500'
                        : isShaded 
                          ? 'bg-amber-400 animate-pulse' 
                          : 'bg-emerald-400'
                  }`}></span>
                </div>

                <div className="mt-2 text-center">
                  {viewMode === 'POWER' && (
                    <span className={`text-xs font-mono font-bold block ${
                      isDamaged 
                        ? 'text-rose-400' 
                        : isBlockNight
                          ? 'text-slate-500'
                          : isShaded
                            ? 'text-amber-300'
                            : 'text-emerald-300'
                    }`}>
                      {isBlockNight ? '0.00 kW' : `${inv.current_mw} MW`}
                    </span>
                  )}
                  {viewMode === 'THERMAL' && (
                    <span className={`text-xs font-mono font-bold block ${
                      isDamaged 
                        ? 'text-rose-400' 
                        : isBlockNight 
                          ? 'text-sky-400' 
                          : isShaded 
                            ? 'text-amber-400' 
                            : 'text-orange-400'
                    }`}>
                      {inv.temp_c}°C
                    </span>
                  )}
                  {viewMode === 'SOILING' && (
                    <span className="text-xs font-mono font-bold text-emerald-400 block">
                      {inv.id === 14 ? '88% Clean' : '99% Clean'}
                    </span>
                  )}
                </div>

                {isDamaged ? (
                  <span className="text-[9px] font-mono font-bold text-rose-300 block text-center mt-1 animate-pulse">
                    🔥 ARC FAULT
                  </span>
                ) : isBlockNight ? (
                  <span className="text-[9px] font-mono text-indigo-400/80 block text-center mt-1">
                    🌙 Standby
                  </span>
                ) : isShaded ? (
                  <span className="text-[9px] font-mono text-amber-400/90 block text-center mt-1">
                    ☁️ Shaded
                  </span>
                ) : (
                  <span className="text-[9px] font-mono text-emerald-400/70 block text-center mt-1">
                    ⚡ 100% Gen
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modal: Deep SCADA Telemetry when an Inverter Block is clicked */}
      {selectedInverter && (
        <div className={`rounded-xl p-5 shadow-2xl relative space-y-4 border-2 transition-all ${
          selectedInverter.status === 'CRITICAL_ARC_FAULT'
            ? 'bg-slate-950 border-rose-500 shadow-rose-950/50'
            : selectedInverter.status === 'NIGHT_STANDBY'
              ? 'bg-slate-950 border-indigo-700/80 shadow-indigo-950/50'
              : 'bg-slate-900 border-amber-500/60'
        }`}>
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              {selectedInverter.status === 'CRITICAL_ARC_FAULT' ? (
                <Flame className="w-5 h-5 text-rose-500 animate-bounce" />
              ) : selectedInverter.status === 'NIGHT_STANDBY' ? (
                <Moon className="w-5 h-5 text-indigo-400" />
              ) : (
                <Zap className="w-5 h-5 text-amber-400" />
              )}
              <h3 className="font-bold text-sm text-slate-100 uppercase font-mono">
                {selectedInverter.name} — SCADA Live Diagnostic
              </h3>
              {selectedInverter.status === 'CRITICAL_ARC_FAULT' && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-900 text-rose-200 border border-rose-700 font-bold animate-pulse">
                  CRITICAL DAMAGE ALERT
                </span>
              )}
              {selectedInverter.status === 'NIGHT_STANDBY' && (
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800 font-bold">
                  NIGHT SLEEP MODE (IEC 62109)
                </span>
              )}
            </div>
            <button
              onClick={() => setSelectedInverter(null)}
              className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
            <div className={`p-3 rounded-lg border ${
              selectedInverter.status === 'CRITICAL_ARC_FAULT' 
                ? 'bg-rose-950/30 border-rose-800' 
                : selectedInverter.status === 'NIGHT_STANDBY'
                  ? 'bg-slate-950 border-indigo-900/60'
                  : 'bg-slate-950 border-slate-800'
            }`}>
              <span className="text-slate-400">Current Output:</span>
              <p className={`text-lg font-bold mt-1 ${
                selectedInverter.status === 'CRITICAL_ARC_FAULT' 
                  ? 'text-rose-400' 
                  : selectedInverter.status === 'NIGHT_STANDBY'
                    ? 'text-slate-500'
                    : 'text-amber-300'
              }`}>
                {selectedInverter.status === 'NIGHT_STANDBY' ? '0.00 kW' : `${selectedInverter.current_mw} MW`} / 2.5 MW
              </p>
              {selectedInverter.status === 'CRITICAL_ARC_FAULT' && (
                <span className="text-[10px] text-rose-400 font-bold block mt-0.5">TRIPPED / OFFLINE</span>
              )}
              {selectedInverter.status === 'NIGHT_STANDBY' && (
                <span className="text-[10px] text-indigo-400 font-bold block mt-0.5">NO SOLAR INSOLATION</span>
              )}
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400">DC Array Voltage:</span>
              <p className="text-lg font-bold text-sky-400 mt-1">{selectedInverter.dc_voltage} V DC</p>
              {selectedInverter.status === 'NIGHT_STANDBY' && (
                <span className="text-[10px] text-slate-500 block mt-0.5">PV Open Circuit 0V</span>
              )}
            </div>

            <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
              <span className="text-slate-400">AC Injected Current:</span>
              <p className="text-lg font-bold text-emerald-400 mt-1">{selectedInverter.ac_current} A</p>
              {selectedInverter.status === 'NIGHT_STANDBY' && (
                <span className="text-[10px] text-slate-500 block mt-0.5">Contactor Disengaged</span>
              )}
            </div>

            <div className={`p-3 rounded-lg border ${
              selectedInverter.status === 'CRITICAL_ARC_FAULT' 
                ? 'bg-rose-950/40 border-rose-600' 
                : 'bg-slate-950 border-slate-800'
            }`}>
              <span className="text-slate-400">Inverter Core Temp:</span>
              <p className={`text-lg font-bold mt-1 ${
                selectedInverter.status === 'CRITICAL_ARC_FAULT'
                  ? 'text-rose-400'
                  : selectedInverter.status === 'NIGHT_STANDBY'
                    ? 'text-sky-300'
                    : 'text-orange-400'
              }`}>
                {selectedInverter.temp_c}°C
              </p>
              {selectedInverter.status === 'CRITICAL_ARC_FAULT' && (
                <span className="text-[10px] text-rose-300 font-bold block mt-0.5">HOTSPOT OVERHEAT</span>
              )}
              {selectedInverter.status === 'NIGHT_STANDBY' && (
                <span className="text-[10px] text-sky-400 block mt-0.5">Ambient Desert Cool</span>
              )}
            </div>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono gap-2">
            <div>
              <span className="text-slate-400">Hardware Specification: </span>
              <span className="text-slate-200 font-semibold">{selectedInverter.inverter_model}</span>
            </div>
            <div>
              <span className="text-slate-400">MPPT Tracking Efficiency: </span>
              <strong className={
                selectedInverter.status === 'CRITICAL_ARC_FAULT' 
                  ? 'text-rose-400' 
                  : selectedInverter.status === 'NIGHT_STANDBY'
                    ? 'text-slate-500'
                    : 'text-emerald-400'
              }>
                {selectedInverter.mppt_efficiency}%
              </strong>
            </div>
          </div>

          {selectedInverter.status === 'NIGHT_STANDBY' && (
            <div className="p-3 bg-indigo-950/40 border border-indigo-800/60 rounded-lg flex items-center space-x-2 text-xs font-mono text-indigo-200">
              <Moon className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                <strong>Astronomical Night Standby:</strong> Sun is below the horizon (Elevation: {elevation.toFixed(1)}°). Internal IGBT switches in sleep mode to prevent reverse power flow. Scheduled wake up at sunrise (~06:15 AM IST).
              </span>
            </div>
          )}

          {selectedInverter.status === 'CRITICAL_ARC_FAULT' && (
            <div className="p-3 bg-rose-950/50 border border-rose-800 rounded-lg flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs font-mono text-rose-300">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>Automated Fire Suppression Valve Armed. Line Isolated via Circuit Breaker CB-14.</span>
              </div>
              <button
                onClick={handleRepairFault}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs rounded font-bold transition flex items-center space-x-1"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Clear Fault & Restore</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
