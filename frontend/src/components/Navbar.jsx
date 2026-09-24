import React, { useState, useEffect } from 'react';
import { Sun, Cloud, Zap, Shield, HelpCircle, Activity, Award, Clock, Compass, Moon, Eye, Grid, Database, IndianRupee, Bot, Volume2, VolumeX, UserCheck } from 'lucide-react';

import { playScadaBeep, playEmergencyAlarm, setScadaAudioMute } from '../utils/scadaAudio';

export default function Navbar({
  activeTab,
  setActiveTab,
  liveState,
  cloudSlider,
  setCloudSlider,
  isConnected,
  isLiveTime,
  setIsLiveTime,
  scrubberHour,
  setScrubberHour,
  userRole = 'DISPATCHER',
  setUserRole
}) {
  const [currentClock, setCurrentClock] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Sync mute state on mount
  useEffect(() => {
    setScadaAudioMute(!soundEnabled);
  }, []);

  // Live ticking clock in IST with Today's exact date
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentClock(now.toLocaleTimeString('en-IN', { hour12: true }));
      setCurrentDate(now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleTabClick = (tabId) => {
    playScadaBeep(1100, 0.05);
    setActiveTab(tabId);
  };

  const tabs = [
    { id: 'command', label: 'Command Center', icon: Activity, badge: 'Future Tree' },
    { id: 'vision_lab', label: 'AI Vision Lab', icon: Eye, badge: 'Image Upload' },
    { id: 'solar_twin', label: '32-Inverter Twin', icon: Grid, badge: 'SCADA' },
    { id: 'sky_radar', label: 'Sky Radar', icon: Cloud, badge: 'Radar' },
    { id: 'data_lab', label: 'Dataset Lab', icon: Database, badge: 'CSV Test' },
    { id: 'market', label: 'IEX Trading', icon: IndianRupee, badge: '₹ Profit' },
    { id: 'copilot', label: 'AI Copilot', icon: Bot, badge: 'Terminal' },
    { id: 'time_machine', label: 'Time Machine', icon: Zap, badge: 'Sandbox' },
    { id: 'reasoning', label: 'Why & Why Not', icon: HelpCircle, badge: 'XAI Audit' },
    { id: 'adversarial', label: 'Adversarial Lab', icon: Shield, badge: 'Break AI' },
    { id: 'judge', label: 'Judge Mode', icon: Award, badge: '1-Click Test', highlight: true },
  ];

  const isNight = liveState?.solar_geometry?.elevation_deg <= 0.0;

  return (
    <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      {/* Top Ticker & Real-Time IST Synchronization Bar */}
      <div className="flex flex-wrap items-center justify-between px-3 sm:px-6 py-1.5 sm:py-2 border-b border-slate-900 text-xs gap-2">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Live Pulse */}
          <div className="flex items-center space-x-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isNight ? 'bg-indigo-400' : 'bg-emerald-400'}`}></span>
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 ${isNight ? 'bg-indigo-500' : 'bg-emerald-500'}`}></span>
            </span>
            <span className="font-mono text-slate-200 font-bold tracking-wide text-[11px] sm:text-xs">
              {isNight ? 'NIGHT GRID DISPATCH' : 'SOLAR INSOLATION PEAK'}
            </span>
          </div>

          {/* Real-Time IST Digital Clock with Today's Date */}
          <div className="flex items-center space-x-1.5 sm:space-x-2 bg-slate-900/90 px-2.5 py-1 rounded-lg border border-slate-800 text-amber-300 font-mono font-bold text-[11px] sm:text-xs shadow-inner">
            <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
            <span className="whitespace-nowrap">
              {isLiveTime 
                ? `${currentDate} • ${currentClock} IST` 
                : `${currentDate} • Scrubber: ${String(Math.floor(scrubberHour)).padStart(2, '0')}:${String(Math.floor((scrubberHour % 1) * 60)).padStart(2, '0')} IST`}
            </span>
          </div>

          {/* Grid Frequency */}
          <div className="hidden xs:flex items-center space-x-1.5 text-slate-400 text-[11px]">
            <span>FREQ:</span>
            <span className="font-mono font-bold px-1.5 py-0.5 rounded text-[11px] bg-emerald-950 text-emerald-400 border border-emerald-800">
              {liveState?.grid_frequency_hz?.toFixed(2) || '50.01'} Hz
            </span>
          </div>

          {/* Regime Pill */}
          <div className="hidden md:flex items-center space-x-1.5 text-slate-400 text-[11px]">
            <span>REGIME:</span>
            <span className={`font-mono font-bold px-2 py-0.5 rounded text-[11px] ${
              isNight
                ? 'bg-indigo-950 text-indigo-300 border border-indigo-800'
                : 'bg-amber-950/70 text-amber-300 border border-amber-800/80'
            }`}>
              {liveState?.weather_regime || 'PEAK_SOLAR_INSOLATION'}
            </span>
          </div>
        </div>

        {/* Right Controls: Role Switcher + Sound Toggle + Time Mode + Cloud Slider */}
        <div className="flex items-center space-x-1.5 sm:space-x-2.5">
          {/* Multi-Stakeholder Role Switcher */}
          <div className="flex items-center space-x-1 bg-slate-900/90 px-2 py-1 rounded-lg border border-slate-800 text-[11px] font-mono">
            <span className="text-slate-400 hidden sm:inline">Role:</span>
            <select
              value={userRole}
              onChange={(e) => {
                setUserRole(e.target.value);
                playScadaBeep(900, 0.06);
              }}
              className="bg-transparent text-amber-300 font-bold focus:outline-none cursor-pointer"
            >
              <option value="DISPATCHER" className="bg-slate-900 text-slate-200">SLDC Dispatcher</option>
              <option value="PLANT_OWNER" className="bg-slate-900 text-slate-200">Solar Park Owner</option>
              <option value="ESG_AUDITOR" className="bg-slate-900 text-slate-200">CERC ESG Auditor</option>
            </select>
          </div>

          {/* Audio SCADA Sound Engine Toggle */}
          <button
            onClick={() => {
              const newState = !soundEnabled;
              setSoundEnabled(newState);
              setScadaAudioMute(!newState);
              if (newState) playEmergencyAlarm();
            }}
            title={soundEnabled ? "Mute SCADA Audio" : "Enable SCADA Substation Sound FX"}
            className={`p-1.5 rounded-lg border transition-all duration-200 ${
              soundEnabled
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Time Mode Switch */}
          <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-800 text-[11px] font-mono">
            <button
              onClick={() => {
                setIsLiveTime(true);
                playScadaBeep(800, 0.05);
              }}
              className={`px-2 sm:px-2.5 py-1 rounded transition-all duration-200 ${isLiveTime ? 'bg-amber-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              ● Live
            </button>
            <button
              onClick={() => {
                setIsLiveTime(false);
                playScadaBeep(800, 0.05);
              }}
              className={`px-2 sm:px-2.5 py-1 rounded transition-all duration-200 ${!isLiveTime ? 'bg-sky-500 text-slate-950 font-bold shadow' : 'text-slate-400 hover:text-slate-200'}`}
            >
              ⏱ Scrub
            </button>
          </div>

          {/* Demo Cloud Cover Slider */}
          <div className="hidden xl:flex items-center space-x-2 bg-slate-900 px-2.5 py-1 rounded-lg border border-slate-800">
            <Cloud className="w-3.5 h-3.5 text-sky-400" />
            <input
              type="range"
              min="0"
              max="100"
              value={cloudSlider}
              onChange={(e) => setCloudSlider(Number(e.target.value))}
              className="w-16 accent-amber-500 cursor-pointer h-1.5 bg-slate-700 rounded-lg"
            />
            <span className="font-mono font-bold text-amber-400 w-7 text-right text-xs">{cloudSlider}%</span>
          </div>
        </div>
      </div>

      {/* Manual Time Scrubber Bar */}
      {!isLiveTime && (
        <div className="bg-sky-950/40 border-b border-sky-800/50 px-4 sm:px-6 py-2 flex flex-col sm:flex-row items-center justify-between text-xs gap-2 animate-slide-up">
          <div className="flex items-center space-x-3 w-full sm:max-w-xl">
            <span className="text-sky-300 font-bold font-mono whitespace-nowrap text-[11px] sm:text-xs">
              🌙 00:00 (Night)
            </span>
            <input
              type="range"
              min="0"
              max="23.9"
              step="0.25"
              value={scrubberHour}
              onChange={(e) => setScrubberHour(Number(e.target.value))}
              className="w-full accent-sky-400 cursor-pointer h-2 bg-slate-800 rounded-lg"
            />
            <span className="text-amber-300 font-bold font-mono whitespace-nowrap text-[11px] sm:text-xs">
              ☀️ 12:30 (Noon)
            </span>
          </div>
          <span className="font-mono text-sky-300 font-bold whitespace-nowrap">
            Simulated Hour: {String(Math.floor(scrubberHour)).padStart(2, '0')}:{String(Math.floor((scrubberHour % 1) * 60)).padStart(2, '0')} IST
          </span>
        </div>
      )}

      {/* Main Navigation Bar */}
      <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between px-3 sm:px-6 py-2 sm:py-2.5 gap-2.5">
        {/* Brand */}
        <div className="flex items-center space-x-3">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-lg transition-transform duration-300 hover:scale-105 ${
            isNight
              ? 'bg-gradient-to-tr from-indigo-700 to-sky-400 text-white shadow-indigo-500/20'
              : 'bg-gradient-to-tr from-amber-600 via-solar-500 to-amber-300 text-slate-950 shadow-amber-500/20'
          }`}>
            {isNight ? <Moon className="w-5 h-5 text-slate-950" /> : <Sun className="w-5 h-5 text-slate-950" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-amber-400 via-yellow-200 to-amber-500 bg-clip-text text-transparent">
                SUNSYNC
              </span>
              <span className="text-[10px] uppercase font-mono font-bold tracking-wider px-1.5 py-0.2 bg-amber-500/20 text-amber-300 border border-amber-500/30 rounded">
                SLDC GUJARAT
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Autonomous Solar & Grid Dispatch Intelligence (PS-5A)</p>
          </div>
        </div>

        {/* Tab Navigation (All 11 tabs with smooth touch horizontal scroll and sleek styling) */}
        <div className="w-full xl:w-auto overflow-x-auto no-scrollbar touch-pan-x scroll-smooth">
          <nav className="flex items-center space-x-1.5 py-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleTabClick(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all duration-200 cubic-bezier(0.16, 1, 0.3, 1) active:scale-95 ${
                    isActive
                      ? tab.highlight
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-lg shadow-amber-500/30 ring-1 ring-amber-300'
                        : 'bg-slate-800 text-white border border-slate-700 shadow-md ring-1 ring-amber-400/30'
                      : tab.highlight
                        ? 'bg-amber-950/40 text-amber-300 border border-amber-800 hover:bg-amber-900/60 hover:border-amber-700'
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/90'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 transition-colors ${isActive && tab.highlight ? 'text-slate-950' : 'text-amber-400'}`} />
                  <span>{tab.label}</span>
                  {tab.badge && (
                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono hidden md:inline transition-colors ${
                      isActive
                        ? tab.highlight ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-700 text-slate-200'
                        : 'bg-slate-800/80 text-slate-400'
                    }`}>
                      {tab.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}
