import React, { useState } from 'react';
import { IndianRupee, TrendingUp, DollarSign, Award, Droplets, ArrowUpRight, Zap, CheckCircle2, Clock } from 'lucide-react';

export default function MarketTrading() {
  const [biddingHorizon, setBiddingHorizon] = useState('DAM'); // 'DAM' (Day-Ahead) or 'RTM' (Real-Time)

  const damRows = [
    { block: '10:00 - 11:00', mw: 184.5, price: '₹4.65', rev: '₹8,57,925', bess: 'Charging (+8 MW)', h2: '140 kg', status: 'COMPLIANT' },
    { block: '11:00 - 12:00', mw: 215.0, price: '₹5.12', rev: '₹11,00,800', bess: 'Charging (+14 MW)', h2: '280 kg', status: 'COMPLIANT' },
    { block: '12:00 - 13:00', mw: 228.0, price: '₹5.40', rev: '₹12,31,200', bess: 'Full Absorption', h2: '420 kg', status: 'COMPLIANT' },
    { block: '13:00 - 14:00', mw: 224.0, price: '₹5.25', rev: '₹11,76,000', bess: 'Standby Buffer', h2: '310 kg', status: 'COMPLIANT' },
    { block: '18:00 - 19:00', mw: 12.4, price: '₹7.80', rev: '₹96,720', bess: 'Discharging (-25 MW)', h2: '0 kg', status: 'PEAK_ARBITRAGE' },
    { block: '19:00 - 20:00', mw: 0.0, price: '₹8.45', rev: '₹0 (Solar)', bess: 'Discharging (-28 MW)', h2: '0 kg', status: 'NIGHT_ARBITRAGE' }
  ];

  const rtmRows = [
    { block: '14:00 - 14:15', mw: 221.4, price: '₹5.85', rev: '₹3,23,797', bess: 'Float Standby', h2: '85 kg', status: 'CLEARED_RTM' },
    { block: '14:15 - 14:30', mw: 216.8, price: '₹6.15', rev: '₹3,33,330', bess: 'Compensating (+4 MW)', h2: '60 kg', status: 'CLEARED_RTM' },
    { block: '14:30 - 14:45', mw: 198.2, price: '₹6.90', rev: '₹3,41,895', bess: 'Discharging (+12 MW)', h2: '0 kg', status: 'HIGH_VOLATILITY' },
    { block: '14:45 - 15:00', mw: 182.0, price: '₹7.25', rev: '₹3,29,875', bess: 'Fast BESS (+18 MW)', h2: '0 kg', status: 'PEAK_RAMP' },
    { block: '15:00 - 15:15', mw: 168.5, price: '₹6.80', rev: '₹2,86,450', bess: 'Standby (+5 MW)', h2: '0 kg', status: 'CLEARED_RTM' },
    { block: '15:15 - 15:30', mw: 154.0, price: '₹6.40', rev: '₹2,46,400', bess: 'Float Buffer', h2: '20 kg', status: 'CLEARED_RTM' }
  ];

  const currentRows = biddingHorizon === 'DAM' ? damRows : rtmRows;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <IndianRupee className="w-5 h-5 text-amber-400" />
            <h2 className="text-base font-extrabold text-slate-100 uppercase tracking-wide font-mono">
              Power Market Economics & Green Hydrogen Dispatch (IEX & Gujarat SLDC)
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            <strong>Monetizing Forecasting Accuracy:</strong> {biddingHorizon === 'DAM' ? 'Day-Ahead Market (DAM) hourly schedule submitted by 12:00 PM for next-day dispatch.' : 'Real-Time Market (RTM) 15-minute gate-closure bidding for intra-day balancing.'}
          </p>
        </div>

        {/* Market Horizon Switcher */}
        <div className="flex items-center space-x-2 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs font-mono">
          <button
            onClick={() => setBiddingHorizon('DAM')}
            className={`px-3 py-1.5 rounded transition ${biddingHorizon === 'DAM' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            IEX Day-Ahead (DAM)
          </button>
          <button
            onClick={() => setBiddingHorizon('RTM')}
            className={`px-3 py-1.5 rounded transition ${biddingHorizon === 'RTM' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Real-Time Market (RTM)
          </button>
        </div>
      </div>

      {/* 4 Financial KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 interactive-card">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>{biddingHorizon === 'DAM' ? 'Trading Profit Today:' : 'RTM Intra-Day Revenue:'}</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">
            {biddingHorizon === 'DAM' ? '₹14.28 Lakhs' : '₹18.61 Lakhs'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            {biddingHorizon === 'DAM' ? 'Via high-accuracy DAM dispatch' : 'Includes intra-day peak arbitrage'}
          </p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 interactive-card">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>CERC DSM Penalty Avoided:</span>
            <CheckCircle2 className="w-4 h-4 text-amber-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-amber-400 mt-1">₹4.85 Lakhs</p>
          <p className="text-[11px] text-slate-400 mt-1">Forecasting error kept &lt;10% band</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 interactive-card">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Green Hydrogen Produced:</span>
            <Droplets className="w-4 h-4 text-sky-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-sky-400 mt-1">1,240 kg H₂</p>
          <p className="text-[11px] text-slate-400 mt-1">From diverted surplus solar</p>
        </div>

        <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 interactive-card">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Tradable RECs Minted:</span>
            <Award className="w-4 h-4 text-purple-400" />
          </div>
          <p className="text-2xl font-bold font-mono text-purple-300 mt-1">214 RECs</p>
          <p className="text-[11px] text-slate-400 mt-1">Renewable Energy Certificates</p>
        </div>
      </div>

      {/* Hourly Market Clearing Price (MCP) & Dispatch Schedule */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-800 pb-3 gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono flex items-center space-x-2">
              <span>{biddingHorizon === 'DAM' ? 'IEX (Indian Energy Exchange) Day-Ahead Schedule' : 'IEX Real-Time Market (15-Min Gate-Closure Schedule)'}</span>
            </h3>
            <p className="text-xs text-slate-400">
              {biddingHorizon === 'DAM' ? 'Gujarat SLDC Hourly Time-Block Settlement' : '15-Minute Dynamic Gate Closure & Secondary Reserve Dispatch'}
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            {biddingHorizon === 'DAM' ? 'Weighted Average MCP: ₹4.82/kWh' : 'Dynamic Spot MCP: ₹6.56/kWh'}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-slate-950 text-slate-400 uppercase text-[10px] border-b border-slate-800">
              <tr>
                <th className="p-3">Time Block (IST)</th>
                <th className="p-3 text-amber-400">Solar Dispatch (MW)</th>
                <th className="p-3 text-emerald-400">IEX Price (₹/kWh)</th>
                <th className="p-3 text-slate-200">Dispatched Revenue</th>
                <th className="p-3 text-sky-400">BESS Energy Arbitrage</th>
                <th className="p-3 text-sky-300">Electrolyzer Feed (kg H₂)</th>
                <th className="p-3">Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {currentRows.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-950/70 transition">
                  <td className="p-3 text-slate-300 font-semibold">{row.block}</td>
                  <td className="p-3 text-amber-300 font-bold">{row.mw} MW</td>
                  <td className="p-3 text-emerald-400 font-bold">{row.price}</td>
                  <td className="p-3 text-slate-200 font-bold">{row.rev}</td>
                  <td className="p-3 text-sky-400">{row.bess}</td>
                  <td className="p-3 text-sky-300">{row.h2}</td>
                  <td className="p-3">
                    <span className="bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded text-[10px]">
                      {row.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
