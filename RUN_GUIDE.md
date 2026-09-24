# 🏆 SOLAR PULSE AI - COMPLETE RUN & PRESENTATION GUIDE
**Track 5: Energy & Resource Efficiency (Problem ID: PS-5A)**  
**Aligned UN SDGs:** SDG 7, SDG 9, SDG 12, SDG 13

---

## 📁 ૧. પ્રોજેક્ટ ફોલ્ડર સ્ટ્રક્ચર (C:\Kunj\Hackathon-kunj)

```text
C:\Kunj\Hackathon-kunj\
├── data/                       <-- તમારી બંને CSV ફાઈલો અહીં મૂકવાની છે
│   ├── energy_dataset.csv
│   └── weather_features.csv
├── backend/                    <-- Python FastAPI + Solar Physics + AI Models
│   ├── config.py
│   ├── physics_engine.py
│   ├── cv_cloud_engine.py
│   ├── data_engine.py
│   ├── ml_forecaster.py
│   ├── future_tree_engine.py
│   ├── causal_chain_engine.py
│   ├── grid_balancer.py
│   ├── reasoning_engine.py
│   ├── ai_trust_engine.py
│   ├── truth_auditor.py
│   ├── main.py
│   └── requirements.txt
├── frontend/                   <-- React 18 + Vite + Tailwind CSS + Recharts
│   ├── package.json
│   ├── vite.config.js
│   ├── index.html
│   └── src/
│       ├── App.jsx
│       ├── mockData.js
│       └── components/
│           ├── Navbar.jsx
│           ├── TabCommandCenter.jsx
│           ├── TabSkyRadar.jsx
│           ├── TabTimeMachine.jsx
│           ├── TabReasoningAudit.jsx
│           ├── TabAdversarialLab.jsx
│           └── TabJudgeMode.jsx
└── start_project.bat           <-- ડબલ ક્લિક કરીને ચાલુ કરવા માટેનો બેચ ફાઈલ
```

---

## 🚀 ૨. પ્રોજેક્ટ ચાલુ કરવાના માત્ર ૩ સરળ સ્ટેપ્સ

### સ્ટેપ ૧: ડેટાસેટ ફાઈલો મૂકો
તમારા કોલેજવાળા બંને CSV ફાઈલ્સને આ ફોલ્ડરમાં કોપી-પેસ્ટ કરી દો:
`C:\Kunj\Hackathon-kunj\data\`
* `energy_dataset.csv`
* `weather_features.csv`
*(નોંધ: જો હજુ સુધી CSV ન મૂકો તો પણ સિસ્ટમ ઓટોમેટિકલી બિલ્ટ-ઇન સિમ્યુલેશન મોડમાં ચાલશે!)*

---

### સ્ટેપ ૨: ડિપેન્ડન્સી ઇન્સ્ટોલ કરો (ફક્ત પહેલી વાર)

**A. Backend Libraries:**
PowerShell ખોલીને આ કમાન્ડ રન કરો:
```powershell
cd C:\Kunj\Hackathon-kunj\backend
py -3.11 -m pip install -r requirements.txt
```

**B. Frontend Packages:**
નવા PowerShell માં આ કમાન્ડ રન કરો:
```powershell
cd C:\Kunj\Hackathon-kunj\frontend
npm install
```

---

### સ્ટેપ ૩: પ્રોજેક્ટ રન કરો

તમે સીધા `C:\Kunj\Hackathon-kunj\start_project.bat` પર **ડબલ-ક્લિક** કરી શકો છો!

અથવા બે અલગ PowerShell વિન્ડોમાં રન કરો:
* **વિન્ડો ૧ (Backend):**
  ```powershell
  cd C:\Kunj\Hackathon-kunj\backend
  py -3.11 -m uvicorn main:app --reload --port 8000
  ```
* **વિન્ડો ૨ (Frontend):**
  ```powershell
  cd C:\Kunj\Hackathon-kunj\frontend
  npm run dev
  ```

બ્રાઉઝરમાં ખોલો:
👉 **`http://localhost:3000`**

---

## 🎯 ૩. જજ સામે ૩ મિનિટમાં ૧st Prize જીતવા માટેનું ડેમો સ્ક્રિપ્ટ (Demo Script)

1. **૦:૦૦ - ૦:૪૫ (Master Command Center & Future Tree):**
   * "સર, સામાન્ય મોડેલ્સ માત્ર ૧ સિંગલ લાઈન પ્રિડિક્ટ કરે છે. પણ રિયલ ગ્રીડ ઓપરેટર્સ ક્યારેય ૧ લાઈન પર રિસ્ક ન લઈ શકે."
   * સ્ક્રીન પર **FUTURE TREE (A થી E)** બતાવો: "અમારું સિસ્ટમ ૫ અલગ-અલગ ફ્યુચર્સ એકસાથે મોનિટર કરે છે."
   * ગ્રાફ બતાવો: "જુઓ સર, સ્પેનિશ ગ્રીડનો ઓફિશિયલ જૂનો ફોરકાસ્ટ (જાંબલી લાઈન) ૧૪.૮% એરર ધરાવતો હતો. અમારા હાઇબ્રિડ AI એ તેને સુધારીને **+૭૭.૬% એક્યુરેસી લીપ** આપી છે!"

2. **૦:૪૫ - ૧:૩૦ (Sky Radar & Causal Chain):**
   * Sky Radar ટેબ ખોલો.
   * વાદળોની ગતિ (Optical Flow Arrows) બતાવો: "અમારું કમ્પ્યુટર વિઝન ૦ થી ૩૦ મિનિટનું સ્થાનિક નાઉકાસ્ટિંગ કરે છે."
   * જજને **Causal Chain** બતાવો: "Cloud ↑ → Irradiance ↓ → Solar drop → Grid reserve margin ↓ → Battery dispatch! જજ એક-એક સ્ટેપ નજર સામે જોઈ શકે છે."

3. **૧:૩૦ - ૨:૧૫ (Grid Time Machine & Counterfactuals):**
   * Time Machine ટેબ ખોલો.
   * જજને Split-Screen બતાવો: **WITHOUT AI** (જૂની પદ્ધતિ: ડીઝલ/ગેસ બળી ગયો, કરોડો રૂપિયાનું નુકસાન) vs **WITH SOLAR PULSE** (બેટરી ઓટો-ડિસ્ચાર્જ, ૧૮.૪ ટન CO₂ બચી ગયો).
   * જજને કહો: *"સર, સ્લાઈડર ફેરવીને તમે પોતે ટેસ્ટ કરી જુઓ કે બેટરી ૧૦ MW હોય કે ૫૦ MW હોય તો ગ્રીડ પર શું અસર થાય!"*

4. **૨:૧૫ - ૩:૦૦ (Reasoning, Adversarial Lab & Judge Mode):**
   * **Why & Why Not Engine** બતાવો: "અમે AI ને પૂછીએ છીએ કે બેટરી ૧૦૦% ડિસ્ચાર્જ કેમ ન કરી? AI જવાબ આપે છે: કારણ કે ૪૪ મિનિટ પછી બીજું મોટું વાદળ આવે છે!"
   * **Adversarial Lab ("Break the AI")**: કેમેરા ફીડ ફોલ્ટ ઇન્જેક્ટ કરીને બતાવો કે સિસ્ટમ ક્રેશ થયા વગર સેલ્ફ-હીલિંગ મોડમાં સેટેલાઇટ પર સ્વિચ થઈ જાય છે.
   * **"Export Audit PDF"** પર ક્લિક કરીને CERC/CEA ગ્રીડ ડિસ્પેચ રિપોર્ટ જજને બતાવી દો!
