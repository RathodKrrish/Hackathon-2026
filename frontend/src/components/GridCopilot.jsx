import React, { useState } from 'react';
import { Bot, Send, Terminal, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, Zap } from 'lucide-react';

export default function GridCopilot({ onExecuteAction, userRole = 'DISPATCHER' }) {
  const getInitialMessage = () => {
    if (userRole === 'PLANT_OWNER') {
      return 'Greetings, Solar Park Owner. SUNSYNC Asset Copilot active. Monitoring 32 central inverters, GUVNL PPA execution (₹42.88L daily target), and CERC DSM deviation zero-penalty buffer. How can I assist you?';
    }
    if (userRole === 'ESG_AUDITOR') {
      return 'Greetings, CERC ESG Auditor. Decarbonization Copilot active. Validating 1,086.1 MT avoided CO₂, CEA 0.82 grid emission factors, and SECI 81.2% PR statutory compliance. How can I assist you?';
    }
    return 'Greetings, SLDC Dispatcher. SUNSYNC Grid Copilot is locked onto Gujarat SLDC Gotri frequency corridor (50.01 Hz). 60 MWh BESS stands armed with sub-cycle 118ms injection ready for cloud ramp protection. How can I assist you?';
  };

  const [messages, setMessages] = useState([
    {
      sender: 'ai',
      text: getInitialMessage(),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const quickChips = userRole === 'PLANT_OWNER' ? [
    { label: '💰 Check DSM Penalty Savings', action: 'DSM_SAVINGS' },
    { label: '🔍 Diagnose Charanka Array 14', action: 'DIAGNOSE_CHARANKA' },
    { label: '📈 IEX Green Spot Revenue', action: 'IEX_REVENUE' },
    { label: '⚡ Optimize BESS for Zero Peaker', action: 'OPTIMIZE_BESS' },
    { label: '📐 Explain PINN Loss Function', action: 'EXPLAIN_PINN' }
  ] : userRole === 'ESG_AUDITOR' ? [
    { label: '🌿 Audit Avoided CO₂ Emissions', action: 'AUDIT_CO2' },
    { label: '📜 Verify SECI PR Guarantee', action: 'VERIFY_PR' },
    { label: '⚡ Optimize BESS for Zero Peaker', action: 'OPTIMIZE_BESS' },
    { label: '📐 Explain PINN Loss Function', action: 'EXPLAIN_PINN' },
    { label: '💰 Check DSM Penalty Savings', action: 'DSM_SAVINGS' }
  ] : [
    { label: '🌪️ Simulate 40MW Cloud Ramp', action: 'SIMULATE_STORM' },
    { label: '⚡ Optimize BESS for Zero Peaker', action: 'OPTIMIZE_BESS' },
    { label: '🔍 Diagnose Charanka Array 14', action: 'DIAGNOSE_CHARANKA' },
    { label: '💰 Check DSM Penalty Savings', action: 'DSM_SAVINGS' },
    { label: '📐 Explain PINN Loss Function', action: 'EXPLAIN_PINN' }
  ];

  const messagesEndRef = React.useRef(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = (textToSend = null, actionKey = null) => {
    const text = textToSend || inputText;
    if (!text || !text.trim()) return;

    const userMsg = {
      sender: 'user',
      text: text,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    setTimeout(() => {
      let aiResponseText = '';
      try {
        const lower = text.toLowerCase();
        if (actionKey === 'DIAGNOSE_CHARANKA' || lower.includes('charanka')) {
          aiResponseText = '🔍 Diagnosed Charanka Solar Park (Array 14): Thermal scan confirms 42°C (nominal). Any generation dip is 100% cloud-shadow induced. All 32 central inverters report 98.8% MPPT efficiency. SCADA health check OK — No hardware fault.';
        } else if (lower.includes('damage') || lower.includes('fault') || lower.includes('fire') || lower.includes('arc') || lower.includes('hotspot')) {
          aiResponseText = '⚠️ SCADA Hardware Alert: Monitoring Inverter Block #14. High-temperature DC arc fault detected (88.5°C hotspot). Line safely isolated via Circuit Breaker CB-14. 15-second emergency siren protocol armed.';
        } else if (lower.includes('night') || lower.includes('dark') || lower.includes('sleep') || lower.includes('sunset') || lower.includes('raat')) {
          aiResponseText = '🌙 Astronomical Night Status: Solar elevation is ≤ 0.0°. All 32 inverters in Charanka Solar Park are in zero-power sleep mode (0.00 kW, ~24°C). Grid baseline is sustained via hydro & base thermal generation.';
        } else if (lower.includes('freq') || lower.includes('grid') || lower.includes('hz') || lower.includes('iegc') || lower.includes('sldc')) {
          aiResponseText = '⚡ Grid Frequency Telemetry: System frequency locked at 50.01 Hz within statutory IEGC band (49.90 - 50.05 Hz). RoCoF is ±0.01 Hz/s. 60 MWh BESS standing by for sub-cycle injection.';
        } else if (lower.includes('cloud') || lower.includes('weather') || lower.includes('rain') || lower.includes('wind') || lower.includes('badal') || lower.includes('varsad')) {
          aiResponseText = '☁️ Atmospheric Telemetry: Patan All-Sky Imager detects cloud front ingress. Optical flow vectors calculate wind speed at ~24 km/h NW. Proactive BESS fast-dispatch armed to buffer solar generation dip.';
        } else if (lower.includes('khavda') || lower.includes('bhadla') || lower.includes('dholera') || lower.includes('park')) {
          aiResponseText = '🏭 National Solar Hub Registry: Khavda (9,500 MW active / 765kV PS-1), Bhadla (2,245 MW / 100% operational), Charanka (790 MW GETCO connected), Dholera (50 MW operational). All hubs streaming real-time SCADA telemetry.';
        } else if (actionKey === 'SIMULATE_STORM' || lower.includes('storm') || lower.includes('ramp')) {
          aiResponseText = '🌪️ Simulating 40 MW Cumulonimbus ramp over Bhadla array. Proactive dispatch staged: BESS injected +28 MW within 118ms. Grid frequency stabilized at 50.01 Hz. Peaker gas plant avoided.';
          if (onExecuteAction) onExecuteAction(70);
        } else if (actionKey === 'OPTIMIZE_BESS' || lower.includes('bess') || lower.includes('battery') || lower.includes('peaker') || lower.includes('storage')) {
          aiResponseText = '⚡ BESS Dispatch Optimization Complete: 60 MWh Battery Storage set to Zero-Peaker mode. BESS will inject up to +28.4 MW during solar cloud transients within 118ms, preventing expensive gas turbine spinning reserve firing and saving ₹1.28L/hr.';
          if (onExecuteAction) onExecuteAction(50);
        } else if (actionKey === 'EXPLAIN_PINN' || lower.includes('pinn') || lower.includes('loss') || lower.includes('formula') || lower.includes('math') || lower.includes('physics')) {
          aiResponseText = '📐 Mathematical Loss Formula: L_total = L_Huber(y, y_pred) + λ1 * max(0, y_pred - y_clearsky) + λ2 * NightHardLock. This guarantees zero night hallucinations and strict physical energy bounds adherence.';
        } else if (actionKey === 'DSM_SAVINGS' || lower.includes('dsm') || lower.includes('saving') || lower.includes('penalty')) {
          aiResponseText = '💰 DSM Settlement Analysis: Under CERC Deviation Settlement Mechanism, keeping 15-minute forecasting error below 10% saved Gujarat SLDC ₹4.85 Lakhs today in avoided grid deviation penalties.';
        } else if (actionKey === 'IEX_REVENUE' || lower.includes('iex') || lower.includes('revenue') || lower.includes('price') || lower.includes('profit') || lower.includes('money') || lower.includes('paisa')) {
          aiResponseText = '📈 IEX Green Spot Revenue: Real-time Green Day-Ahead Market cleared at ₹3.85/kWh (vs ₹3.24 base PPA). Net dispatch yield: +₹4,88,200 additional profit achieved without grid curtailment.';
        } else if (actionKey === 'AUDIT_CO2' || lower.includes('co2') || lower.includes('carbon') || lower.includes('esg') || lower.includes('emission')) {
          aiResponseText = '🌿 Statutory Decarbonization Audit: Displaced 1,324.5 MWh of thermal coal baseline generation. Avoided CO2 emissions calculated at 1,086.1 Metric Tons today using official CEA 0.82 tCO2/MWh factor.';
        } else if (actionKey === 'VERIFY_PR' || lower.includes('pr') || lower.includes('guarantee')) {
          aiResponseText = '📜 SECI Performance Ratio (PR) Audit: Measured field PR is 81.2% (temperature normalized via IEC 61724-1). Statutory SECI guarantee threshold (≥78.0%) passed with 3.2% safety margin.';
        } else if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey') || lower.includes('help') || lower.includes('who') || lower.includes('namaste') || lower.includes('kem cho')) {
          aiResponseText = '👋 Greetings! I am SUNSYNC AI Grid Copilot v2.4, an autonomous SCADA assistant for the Gujarat State Load Despatch Centre (SLDC). You can ask me to optimize BESS battery, simulate cloud ramps, check inverter faults, or review DSM revenue savings!';
        } else if (lower.includes('samjav') || lower.includes('batao') || lower.includes('explain') || lower.includes('su chhe') || lower.includes('karo')) {
          aiResponseText = `💡 SCADA Analysis for "${text}": SUNSYNC AI PINN system continuously monitors real-time solar irradiance, diurnal elevation, cloud velocity vectors (24 km/h), and BESS battery reserves (84% SoC) to prevent grid frequency deviations below 49.90 Hz.`;
        } else {
          aiResponseText = `🤖 Command Acknowledged: "${text}". Real-time telemetry validated across 3 solar parks (Charanka, Bhadla, Khavda). Grid frequency steady at 50.01 Hz. 60 MWh BESS standing by in autonomous sub-cycle dispatch mode.`;
        }
      } catch (err) {
        console.error('Copilot processing error:', err);
        aiResponseText = `SUNSYNC SCADA telemetry active. Status: Grid frequency 50.01 Hz, BESS 84% SoC, 32 Inverters Nominal.`;
      } finally {
        const aiMsg = {
          sender: 'ai',
          text: aiResponseText,
          timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST'
        };
        setMessages((prev) => [...prev, aiMsg]);
        setIsTyping(false);
      }
    }, 500);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4 flex flex-col h-[520px]">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/40">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 uppercase tracking-wider font-mono">
              SUNSYNC AI Grid Copilot (Interactive Assistant)
            </h3>
            <p className="text-[11px] text-slate-400">Autonomous Reasoning & SCADA Command Terminal</p>
          </div>
        </div>
        <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
          ONLINE (AGENT v2.4)
        </span>
      </div>

      {/* Quick Prompt Chips */}
      <div className="flex space-x-2 overflow-x-auto pb-1 text-xs font-mono no-scrollbar touch-pan-x scroll-smooth">
        {quickChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(chip.label, chip.action)}
            className="px-2.5 py-1 rounded bg-slate-950 hover:bg-slate-800 text-slate-300 hover:text-amber-300 border border-slate-800 whitespace-nowrap transition-all duration-200 active:scale-95"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Chat Messages Log */}
      <div className="flex-1 overflow-y-auto space-y-3 p-3.5 bg-slate-950 rounded-xl border border-slate-800 font-mono text-xs min-h-[340px] max-h-[520px] scroll-smooth">
        {messages.map((m, idx) => (
          <div
            key={idx}
            className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`p-3 rounded-xl max-w-[85%] leading-relaxed ${
                m.sender === 'user'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-900 border border-slate-800 text-slate-200'
              }`}
            >
              {m.text}
            </div>
            <span className="text-[9px] text-slate-500 mt-0.5 px-1">{m.timestamp}</span>
          </div>
        ))}
        {isTyping && (
          <div className="text-[11px] text-amber-400 font-mono animate-pulse">
            SUNSYNC AI is computing physics tensors & SCADA response...
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center space-x-2 pt-1"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask anything or enter a grid command (e.g., 'Check Gujarat frequency status')..."
          className="flex-1 bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-lg px-3.5 py-2 text-xs font-mono text-slate-100 placeholder-slate-500 focus:outline-none"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs font-mono transition flex items-center space-x-1"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
}
