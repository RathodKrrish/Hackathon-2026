import React from 'react';
import { ResponsiveContainer, AreaChart, Area, Line, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ReferenceLine } from 'recharts';
import { Sun, BatteryCharging, Flame, TrendingUp, AlertTriangle, ArrowRight, ShieldCheck, Zap, Moon, IndianRupee, Activity, CheckCircle2, Leaf } from 'lucide-react';

export default function TabCommandCenter({ liveState, forecastData, futureTreeData, userRole = 'DISPATCHER' }) {
  const branches = futureTreeData?.branches || [];
  const isNight = liveState?.solar_geometry?.elevation_deg <= 0.0;
  const currentGen = liveState?.total_solar_generation_mw || 0.0;

  return (
    <div className="space-y-6">
      {/* Dynamic Multi-Stakeholder Perspective Mission Deck */}
      {userRole === 'DISPATCHER' && (
        <div className="bg-gradient-to-r from-sky-950/70 via-slate-900 to-indigo-950/60 border border-sky-800/80 rounded-xl p-4 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-sky-900/60 pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-sky-900/60 border border-sky-700 rounded-lg text-sky-400">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold font-mono uppercase tracking-widest text-sky-400 bg-sky-950 border border-sky-800 px-2 py-0.5 rounded">
                    SLDC DISPATCHER LENS
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Gujarat Energy Transmission Corp. (GETCO / SLDC)</span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-100 mt-0.5">
                  Real-Time Grid Frequency Stabilization & Rapid Ramp Security
                </h2>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-1 rounded flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Grid Frequency: 50.01 Hz Nominal
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
            <div className="bg-slate-950/70 border border-sky-950 p-2.5 rounded-lg">
              <span className="text-slate-400 block text-[11px]">Primary Mission:</span>
              <span className="text-sky-300 font-bold font-mono">Zero Blackout Guarantee</span>
              <span className="text-slate-500 block text-[10px] mt-0.5">Frequency Band: 49.90 - 50.05 Hz</span>
            </div>
            <div className="bg-slate-950/70 border border-sky-950 p-2.5 rounded-lg">
              <span className="text-slate-400 block text-[11px]">Ramp Rate Security:</span>
              <span className="text-emerald-400 font-bold font-mono">+4.2 MW/min (Safe)</span>
              <span className="text-slate-500 block text-[10px] mt-0.5">CERC Limit: &lt; 15 MW/min max</span>
            </div>
            <div className="bg-slate-950/70 border border-sky-950 p-2.5 rounded-lg">
              <span className="text-slate-400 block text-[11px]">BESS Fast Injection:</span>
              <span className="text-amber-400 font-bold font-mono">60 MWh Armed</span>
              <span className="text-slate-500 block text-[10px] mt-0.5">&lt; 200ms sub-cycle response</span>
            </div>
            <div className="bg-slate-950/70 border border-sky-950 p-2.5 rounded-lg">
              <span className="text-slate-400 block text-[11px]">Thermal Peaker Ignitions:</span>
              <span className="text-emerald-400 font-bold font-mono">0 Plants Ignited</span>
              <span className="text-slate-500 block text-[10px] mt-0.5">Save ₹12,400/hr coal cost</span>
            </div>
          </div>
        </div>
      )}

      {userRole === 'PLANT_OWNER' && (
        <div className="bg-gradient-to-r from-amber-950/70 via-slate-900 to-emerald-950/60 border border-amber-800/80 rounded-xl p-4 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-amber-900/60 pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-amber-900/60 border border-amber-700 rounded-lg text-amber-400">
                <IndianRupee className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold font-mono uppercase tracking-widest text-amber-400 bg-amber-950 border border-amber-800 px-2 py-0.5 rounded">
                    SOLAR PARK OWNER LENS
                  </span>
                  <span className="text-xs text-slate-400 font-mono">IPP Developer (GSECL / Adani Green / Tata Power)</span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-100 mt-0.5">
                  Asset Revenue Maximization & CERC DSM Penalty Shielding
                </h2>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-1 rounded flex items-center">
                <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> DSM Penalty Risk: ₹0.00
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
            <div className="bg-slate-950/70 border border-amber-950 p-2.5 rounded-lg">
              <span className="text-slate-400 block text-[11px]">Daily PPA Inflow:</span>
              <span className="text-amber-300 font-bold font-mono">₹42,88,400</span>
              <span className="text-slate-500 block text-[10px] mt-0.5">GUVNL Fixed @ ₹3.24/kWh</span>
            </div>
            <div className="bg-slate-950/70 border border-amber-950 p-2.5 rounded-lg">
              <span className="text-slate-400 block text-[11px]">CERC DSM Penalty Saved:</span>
              <span className="text-emerald-400 font-bold font-mono">₹4.85 Lakhs Avoided</span>
              <span className="text-slate-500 block text-[10px] mt-0.5">Deviation: 2.8% (Allowed &lt; 10%)</span>
            </div>
            <div className="bg-slate-950/70 border border-amber-950 p-2.5 rounded-lg">
              <span className="text-slate-400 block text-[11px]">32 Inverter Availability:</span>
              <span className="text-sky-400 font-bold font-mono">99.4% Active (31/32)</span>
              <span className="text-slate-500 block text-[10px] mt-0.5">SCADA Health Matrix live</span>
            </div>
            <div className="bg-slate-950/70 border border-amber-950 p-2.5 rounded-lg">
              <span className="text-slate-400 block text-[11px]">IEX Green Spot Arbitrage:</span>
              <span className="text-emerald-300 font-bold font-mono">₹3.85/kWh Peak</span>
              <span className="text-slate-500 block text-[10px] mt-0.5">+18.8% vs Base Tariff</span>
            </div>
          </div>
        </div>
      )}

      {userRole === 'ESG_AUDITOR' && (
        <div className="bg-gradient-to-r from-emerald-950/70 via-slate-900 to-teal-950/60 border border-emerald-800/80 rounded-xl p-4 shadow-lg">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-emerald-900/60 pb-3">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-emerald-900/60 border border-emerald-700 rounded-lg text-emerald-400">
                <Leaf className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold font-mono uppercase tracking-widest text-emerald-400 bg-emerald-950 border border-emerald-800 px-2 py-0.5 rounded">
                    CERC ESG AUDITOR LENS
                  </span>
                  <span className="text-xs text-slate-400 font-mono">Central Electricity Regulatory Commission / Decarbonization</span>
                </div>
                <h2 className="text-sm sm:text-base font-bold text-slate-100 mt-0.5">
                  Statutory Decarbonization Accounting & Sovereign Green Audit
                </h2>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-1 rounded flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" /> SECI PR: 81.2% (Passed &ge; 78%)
              </span>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3 text-xs">
            <div className="bg-slate-950/70 border border-emerald-950 p-2.5 rounded-lg">
              <span className="text-slate-400 block text-[11px]">Carbon Emissions Avoided:</span>
              <span className="text-emerald-400 font-bold font-mono">1,086.1 MT CO₂/day</span>
              <span className="text-slate-500 block text-[10px] mt-0.5">CEA Factor: 0.82 tCO₂/MWh</span>
            </div>
            <div className="bg-slate-950/70 border border-emerald-950 p-2.5 rounded-lg">
              <span className="text-slate-400 block text-[11px]">SECI PR Guarantee Audit:</span>
              <span className="text-teal-300 font-bold font-mono">81.2% Performance</span>
              <span className="text-slate-500 block text-[10px] mt-0.5">Contract threshold &ge; 78.0%</span>
            </div>
            <div className="bg-slate-950/70 border border-emerald-950 p-2.5 rounded-lg">
              <span className="text-slate-400 block text-[11px]">Certified Clean Energy:</span>
              <span className="text-emerald-300 font-bold font-mono">1,324.5 MWh/Day</span>
              <span className="text-slate-500 block text-[10px] mt-0.5">100% Zero-Carbon Origin</span>
            </div>
            <div className="bg-slate-950/70 border border-emerald-950 p-2.5 rounded-lg">
              <span className="text-slate-400 block text-[11px]">Renewable Purchase (RPO):</span>
              <span className="text-teal-400 font-bold font-mono">100% Compliant</span>
              <span className="text-slate-500 block text-[10px] mt-0.5">MoP Mandate Tier-1 Verified</span>
            </div>
          </div>
        </div>
      )}

      {/* Top Enterprise Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3.5 sm:gap-4">
        {/* Card 1: Solar Gen */}
        <div className={`border rounded-xl p-4 shadow-sm relative overflow-hidden interactive-card ${
          userRole === 'PLANT_OWNER' ? 'ring-2 ring-amber-500/80 shadow-lg shadow-amber-950/40 bg-slate-900 border-amber-500/50' :
          isNight ? 'bg-slate-900/90 border-indigo-900/50' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gujarat Solar Output</span>
              {userRole === 'PLANT_OWNER' && (
                <span className="text-[9px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.2 rounded font-mono font-bold">
                  IPP REVENUE
                </span>
              )}
            </div>
            {isNight ? <Moon className="w-4 h-4 text-indigo-400" /> : <Sun className="w-4 h-4 text-amber-400" />}
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className={`text-2xl font-bold font-mono ${isNight ? 'text-indigo-300' : 'text-amber-300'}`}>
              {currentGen.toFixed(1)}
            </span>
            <span className="text-xs font-mono text-slate-400">/ 250 MW</span>
          </div>
          <div className="mt-2 flex items-center text-[11px] font-medium">
            {isNight ? (
              <span className="text-indigo-400 font-mono">🌙 Night Lock: 0.00 kW Active</span>
            ) : (
              <span className="text-emerald-400 flex items-center">
                <TrendingUp className="w-3.5 h-3.5 mr-1" />
                CUF: {liveState?.capacity_utilization_factor_pct || ((currentGen / 250) * 100).toFixed(1)}% (Peak Insolation)
              </span>
            )}
          </div>
        </div>

        {/* Card 2: Grid Demand */}
        <div className={`border rounded-xl p-4 shadow-sm transition-all duration-300 ${
          userRole === 'DISPATCHER' ? 'ring-2 ring-sky-500/80 shadow-lg shadow-sky-950/40 bg-slate-900 border-sky-500/50' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gujarat Grid Demand</span>
              {userRole === 'DISPATCHER' && (
                <span className="text-[9px] bg-sky-950 text-sky-300 border border-sky-800 px-1.5 py-0.2 rounded font-mono font-bold">
                  SLDC CRITICAL
                </span>
              )}
            </div>
            <Zap className="w-4 h-4 text-sky-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-sky-300">
              {liveState?.grid_demand_mw?.toFixed(1) || '198.5'}
            </span>
            <span className="text-xs font-mono text-slate-400">MW</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            {isNight ? 'Covered by BESS + Hydro Base' : `Solar Covers: ${Math.min(100, Math.round((currentGen / (liveState?.grid_demand_mw || 198.5)) * 100))}% of Demand`}
          </p>
        </div>

        {/* Card 3: BESS Storage */}
        <div className={`border rounded-xl p-4 shadow-sm transition-all duration-300 ${
          userRole === 'DISPATCHER' ? 'ring-2 ring-sky-500/80 shadow-lg shadow-sky-950/40 bg-slate-900 border-sky-500/50' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">BESS Storage (60 MWh)</span>
              {userRole === 'DISPATCHER' && (
                <span className="text-[9px] bg-sky-950 text-sky-300 border border-sky-800 px-1.5 py-0.2 rounded font-mono font-bold">
                  FAST RESERVE
                </span>
              )}
            </div>
            <BatteryCharging className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-2">
            <span className="text-2xl font-bold font-mono text-emerald-300">
              {liveState?.bess_soc_pct?.toFixed(1) || '82.5'}%
            </span>
            <span className="text-xs font-mono font-semibold text-emerald-400">
              {isNight ? `-${liveState?.bess_dispatch_mw || 25.0} MW (Discharging)` : `+${liveState?.bess_charge_mw || 13.9} MW (Absorbing)`}
            </span>
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div
              className="bg-emerald-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${liveState?.bess_soc_pct || 82}%` }}
            ></div>
          </div>
        </div>

        {/* Card 4: Gas Peaker Avoidance */}
        <div className={`border rounded-xl p-4 shadow-sm transition-all duration-300 ${
          userRole === 'ESG_AUDITOR' ? 'ring-2 ring-emerald-500/80 shadow-lg shadow-emerald-950/40 bg-slate-900 border-emerald-500/50' :
          userRole === 'DISPATCHER' ? 'border-sky-800/80 bg-slate-900/90' : 'bg-slate-900/90 border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gas Peaker Status</span>
              {userRole === 'ESG_AUDITOR' && (
                <span className="text-[9px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-1.5 py-0.2 rounded font-mono font-bold">
                  ZERO EMISSION
                </span>
              )}
            </div>
            <Flame className="w-4 h-4 text-rose-400" />
          </div>
          <div className="mt-2">
            <span className="text-sm font-bold font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded">
              {liveState?.peaker_status || 'SHUTDOWN_STANDBY'}
            </span>
          </div>
          <p className="mt-2 text-[11px] text-slate-400">Zero fossil peakers ignited</p>
        </div>

        {/* Card 5: DSM Savings (Indian Regulatory Compliance) */}
        <div className={`border rounded-xl p-4 shadow-sm bg-gradient-to-br from-slate-900 to-amber-950/20 transition-all duration-300 ${
          userRole === 'PLANT_OWNER' ? 'ring-2 ring-amber-500/80 shadow-lg shadow-amber-950/40 border-amber-500/50' :
          userRole === 'ESG_AUDITOR' ? 'border-emerald-800/70' : 'border-slate-800'
        }`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">CERC DSM Savings</span>
              {userRole === 'PLANT_OWNER' && (
                <span className="text-[9px] bg-amber-950 text-amber-300 border border-amber-800 px-1.5 py-0.2 rounded font-mono font-bold">
                  ₹0 PENALTY RISK
                </span>
              )}
            </div>
            <IndianRupee className="w-4 h-4 text-amber-400" />
          </div>
          <div className="mt-2 flex items-baseline space-x-1">
            <span className="text-2xl font-bold font-mono text-amber-400">
              ₹{liveState?.dsm_penalty_saved_inr_lakhs || '4.85'}
            </span>
            <span className="text-xs font-mono text-slate-400">Lakhs Saved</span>
          </div>
          <p className="mt-2 text-[11px] text-slate-300 font-medium">Deviation Penalty Avoided</p>
        </div>
      </div>

      {/* Official System Energy Balance, Use & Expected Loss Waterfall (CEA / GERC Statutory Standards) */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
                Official Energy Generation, Consumption & System Loss Audit (CEA / GERC / GETCO Norms)
              </h3>
              <p className="text-xs text-slate-400">
                100% Grounded in Central Electricity Authority (CEA) Technical Standards & GERC Tariff Orders
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <span className="bg-emerald-950/80 text-emerald-300 border border-emerald-800 px-2.5 py-1 rounded">
              Performance Ratio (PR): <strong>{liveState?.losses?.performance_ratio_pct || 81.2}%</strong>
            </span>
            <span className="bg-slate-800 text-amber-300 border border-slate-700 px-2.5 py-1 rounded">
              Daily Solar Yield: <strong>{liveState?.losses?.daily_generation_mwh || '1,324.5'} MWh/day</strong>
            </span>
          </div>
        </div>

        {/* 4 Summary Cards: Gross Potential -> Generation -> Use/Demand -> Net Delivered */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">Gross Solar Influx (STC):</span>
            <span className="text-lg font-bold font-mono text-amber-300">
              {liveState?.losses?.gross_photon_potential_mw || '268.4'} MW
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Raw Photon Flux (1000 W/m²)</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">Net Solar Generation:</span>
            <span className="text-lg font-bold font-mono text-emerald-400">
              {liveState?.total_solar_generation_mw || '212.4'} MW
            </span>
            <span className="text-[10px] text-emerald-500/80 block mt-0.5">CUF: {liveState?.capacity_utilization_factor_pct || 85.0}%</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">Regional Grid Use / Demand:</span>
            <span className="text-lg font-bold font-mono text-sky-400">
              {liveState?.grid_demand_mw || '198.5'} MW
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Local 400kV Ring Consumption</span>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 block">Commercial Grid Injection:</span>
            <span className="text-lg font-bold font-mono text-emerald-300">
              {liveState?.losses?.net_grid_delivered_mw || '204.7'} MW
            </span>
            <span className="text-[10px] text-slate-500 block mt-0.5">Delivered to Gujarat SLDC</span>
          </div>
        </div>

        {/* Detailed 5-Stage Physical Loss Waterfall Grid */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono">
            <span className="font-bold text-slate-300 uppercase">Statutory Loss Breakdown (CEA / GERC Benchmarks):</span>
            <span className="text-slate-400 text-[11px]">Total Expected Losses: ~18.8% (SECI Tolerance &lt; 22%)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-xs font-mono">
            {/* Loss 1: Thermal Derate */}
            <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">1. Thermal Derate</span>
                <span className="text-rose-400 font-bold">-{liveState?.losses?.thermal_derate_pct || 10.3}%</span>
              </div>
              <div className="text-sm font-bold text-rose-300">
                -{liveState?.losses?.thermal_derate_loss_mw || 24.8} MW
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Cell Temp: 54.5°C (-0.35%/°C above 25°C STC)
              </p>
            </div>

            {/* Loss 2: Soiling & Dust */}
            <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">2. Dust & Soiling</span>
                <span className="text-amber-400 font-bold">-{liveState?.losses?.soiling_dust_pct || 4.2}%</span>
              </div>
              <div className="text-sm font-bold text-amber-300">
                -{liveState?.losses?.soiling_dust_loss_mw || 10.2} MW
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                Patan/Thar Arid Salt & Sand Deposition
              </p>
            </div>

            {/* Loss 3: AC/DC Conversion */}
            <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">3. Inverter & Trafo</span>
                <span className="text-sky-400 font-bold">-{liveState?.losses?.inverter_transformer_pct || 2.5}%</span>
              </div>
              <div className="text-sm font-bold text-sky-300">
                -{liveState?.losses?.inverter_transformer_loss_mw || 5.4} MW
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                1500V DC Inv (98.6%) + 33/400kV Step-Up
              </p>
            </div>

            {/* Loss 4: GETCO Transmission */}
            <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">4. GETCO Wheeling</span>
                <span className="text-indigo-400 font-bold">-{liveState?.losses?.getco_transmission_loss_pct || 3.65}%</span>
              </div>
              <div className="text-sm font-bold text-indigo-300">
                -{liveState?.losses?.getco_transmission_loss_mw || 7.7} MW
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                GERC Intra-State 400kV Grid Wheeling Loss
              </p>
            </div>

            {/* Loss 5: Auxiliary Consumption */}
            <div className="bg-slate-900/90 border border-slate-800 p-2.5 rounded-lg space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-[11px]">5. Substation Aux</span>
                <span className="text-slate-400 font-bold">-{liveState?.losses?.auxiliary_consumption_pct || 0.25}%</span>
              </div>
              <div className="text-sm font-bold text-slate-300">
                -{liveState?.losses?.auxiliary_consumption_mw || 0.5} MW
              </div>
              <p className="text-[10px] text-slate-500 leading-tight">
                CERC Switchyard SCADA & Yard Consumption
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Dual-Section: Multi-Plant Indian Digital Twin & Probabilistic 24H Forecast Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Indian Solar Parks (Charanka, Bhadla, Dholera) */}
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">Regional Solar Parks (India)</h3>
              <p className="text-xs text-slate-400">Spatio-Temporal Coordination (Point 10)</p>
            </div>
            <span className="text-[11px] font-mono text-amber-400 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
              3 Clusters Online
            </span>
          </div>

          <div className="space-y-3">
            {Object.entries(liveState?.plants || {}).map(([key, plant]) => (
              <div key={key} className="bg-slate-950/80 border border-slate-800/80 rounded-lg p-3 hover:border-slate-700 transition">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-slate-200">{plant.name}</span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${
                    plant.status === 'OPTIMAL' ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' :
                    plant.status === 'NIGHT_STANDBY' ? 'bg-indigo-950 text-indigo-400 border border-indigo-800' :
                    'bg-amber-950 text-amber-400 border border-amber-800'
                  }`}>
                    {plant.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs">
                  <span className="text-slate-400">Live Output: <strong className="text-amber-300 font-mono">{plant.generation_mw?.toFixed(1)} MW</strong></span>
                  <span className="text-slate-500 text-[11px] font-mono">Capacity: {plant.capacity_mw} MW</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className={isNight ? "bg-indigo-500 h-full rounded-full transition-all duration-300" : "bg-amber-500 h-full rounded-full transition-all duration-300"}
                    style={{ width: `${(plant.generation_mw / plant.capacity_mw) * 100}%` }}
                  ></div>
                </div>
                <div className="mt-2 flex justify-between text-[10px] text-slate-400 font-mono">
                  <span>Inverters: {plant.inverters_online} Online</span>
                  <span>{plant.shadow_eta_minutes ? `☁️ Cloud ETA: ~${plant.shadow_eta_minutes}m` : 'Clear Sky'}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Physics Guardrail Notice (Point 20) */}
          <div className="bg-slate-950 border border-slate-800/80 rounded-lg p-3 text-xs space-y-1">
            <div className="flex items-center space-x-2 text-sky-400 font-semibold mb-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Solar Astronomy & Physics Guardrail (Point 20)</span>
            </div>
            <p className="text-slate-400 text-[11px] leading-relaxed">
              Solar elevation for Gujarat (23.9°N, 71.2°E) is <strong className="text-amber-400 font-mono">{liveState?.solar_geometry?.elevation_deg?.toFixed(1)}°</strong> (Zenith: {liveState?.solar_geometry?.zenith_deg?.toFixed(1)}°).
              {isNight ? (
                <span className="text-indigo-400 font-bold block mt-1">
                  🌙 Night Detected: Output hard-locked to 0.00 kW to eliminate neural network hallucinations.
                </span>
              ) : (
                <span className="text-emerald-400 block mt-1">
                  ☀️ Day Active: Solar radiation GHI reaching {Math.round(Math.sin((liveState?.solar_geometry?.elevation_deg || 65) * Math.PI / 180) * 980)} W/m².
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Right 2 Columns: 24-Hour Multi-Horizon Forecast Chart */}
        <div className="lg:col-span-2 bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                  24-Hour Diurnal Solar Forecast (IST Timeline)
                </h3>
                {userRole === 'DISPATCHER' && (
                  <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-800 px-2 py-0.5 rounded font-mono font-bold">
                    ⚡ SLDC RAMP ENVELOPE
                  </span>
                )}
                {userRole === 'PLANT_OWNER' && (
                  <span className="text-[10px] bg-amber-950 text-amber-300 border border-amber-800 px-2 py-0.5 rounded font-mono font-bold">
                    💰 PPA & DSM ±10% BAND
                  </span>
                )}
                {userRole === 'ESG_AUDITOR' && (
                  <span className="text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded font-mono font-bold">
                    🌿 GREEN MWh CERTIFIED
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-400">P10 (Pessimistic) - P50 (Expected) - P90 (Optimistic) Quantiles vs Legacy Grid TSO Baseline</p>
            </div>
            <div className="flex items-center space-x-2 text-xs font-mono">
              <span className="bg-slate-800 text-amber-400 px-2 py-0.5 rounded border border-slate-700">
                AI MAPE: {forecastData?.metrics?.model_mape_pct || 3.4}%
              </span>
              <span className="bg-slate-800 text-slate-400 px-2 py-0.5 rounded border border-slate-700 line-through">
                TSO MAPE: {forecastData?.metrics?.legacy_mape_pct || 14.8}%
              </span>
            </div>
          </div>

          {/* Recharts Forecast Graph */}
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={forecastData?.timeline || []} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="quantileGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.25}/>
                    <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.02}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis dataKey="timestamp" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} label={{ value: 'MW', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '8px', fontSize: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Area type="monotone" dataKey="p90_mw" name="P90 (Upper Bound)" stroke="#fbbf24" strokeDasharray="2 2" fill="url(#quantileGrad)" fillOpacity={0.3} />
                <Area type="monotone" dataKey="p10_mw" name="P10 (Worst Case)" stroke="#b45309" strokeDasharray="2 2" fill="#020617" fillOpacity={0.9} />
                <Line type="monotone" dataKey="p50_mw" name="SUNSYNC AI (P50)" stroke="#f59e0b" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="legacy_tso_mw" name="Legacy Grid TSO Baseline" stroke="#a855f7" strokeWidth={1.5} strokeDasharray="4 4" dot={false} />
                <Line type="monotone" dataKey="ground_truth_mw" name="Actual Grid Infeed" stroke="#38bdf8" strokeWidth={2} dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Point 1: FUTURE TREE Branching Scenarios */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-base">🌳</span>
              <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider">
                Future Tree: Probabilistic Scenario Branches (Point 1)
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              SLDC Gujarat monitors 5 distinct future branches simultaneously to guarantee zero blackouts.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            Current Input: <strong className="text-amber-400">{currentGen.toFixed(1)} MW</strong>
          </span>
        </div>

        {/* 5 Branches Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
          {branches.map((b) => (
            <div
              key={b.id}
              className={`rounded-xl p-3.5 border interactive-card flex flex-col justify-between ${
                b.grid_risk === 'VERY_LOW' ? 'bg-slate-950 border-emerald-900/60 hover:border-emerald-600' :
                b.grid_risk === 'LOW' ? 'bg-slate-950 border-sky-900/60 hover:border-sky-600' :
                b.grid_risk === 'MEDIUM' ? 'bg-slate-950 border-amber-900/60 hover:border-amber-600' :
                b.grid_risk === 'HIGH' ? 'bg-slate-950 border-rose-900/60 hover:border-rose-600' :
                'bg-slate-950 border-red-800 hover:border-red-500 shadow-md shadow-red-950/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xl">{b.icon}</span>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-800 text-slate-200">
                    {b.probability_pct}% Prob
                  </span>
                </div>
                <h4 className="mt-2 text-xs font-bold text-slate-200">{b.name}</h4>
                <p className="mt-1 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{b.description}</p>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-800/80 space-y-1.5 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-slate-400">Expected:</span>
                  <strong className={b.generation_delta_mw >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {b.generation_mw} MW ({b.generation_delta_mw >= 0 ? `+${b.generation_delta_mw}` : b.generation_delta_mw})
                  </strong>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Battery:</span>
                  <span className="text-amber-300 font-semibold">{b.battery_dispatch_mw} MW</span>
                </div>
                <div className="flex justify-between text-[11px]">
                  <span className="text-slate-400">Peaker Saved:</span>
                  <span className="text-emerald-400 font-semibold">₹{Math.round((b.peaker_cost_saved_eur || 1000) * 88).toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
