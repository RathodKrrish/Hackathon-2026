import os
import pptx
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.enum.shapes import MSO_SHAPE
from pptx.oxml import parse_xml

def create_presentation():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)
    blank_layout = prs.slide_layouts[6]

    # Theme Palette
    BG_COLOR = RGBColor(11, 15, 25)         # #0B0F19
    CARD_BG = RGBColor(17, 24, 39)          # #111827
    CARD_BORDER = RGBColor(31, 41, 55)      # #1F2937
    SCRIPT_BG = RGBColor(15, 23, 42)        # #0F172A
    SCRIPT_BORDER = RGBColor(30, 41, 59)    # #1E293B
    GOLD = RGBColor(245, 158, 11)           # #F59E0B
    EMERALD = RGBColor(16, 185, 129)        # #10B981
    CYAN = RGBColor(56, 189, 248)           # #38BDF8
    ROSE = RGBColor(244, 63, 94)            # #F43F5E
    WHITE = RGBColor(248, 250, 252)         # #F8FAFC
    MUTED = RGBColor(148, 163, 184)         # #94A3B8
    KPI_BG = RGBColor(4, 47, 46)            # #042F2E
    KPI_BORDER = RGBColor(17, 94, 89)       # #115E59
    KPI_TEXT = RGBColor(52, 211, 153)       # #34D399

    def add_slide_transition(slide, trans_type="push", dir_val="l"):
        try:
            if trans_type == "push":
                xml_str = f'<p:transition xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" spd="med"><p:push dir="{dir_val}"/></p:transition>'
            elif trans_type == "fade":
                xml_str = '<p:transition xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" spd="med"><p:fade/></p:transition>'
            else:
                xml_str = '<p:transition xmlns:p="http://schemas.openxmlformats.org/presentationml/2006/main" spd="med"><p:comb/></p:transition>'
            slide._element.append(parse_xml(xml_str))
        except Exception as e:
            print("Transition notice:", e)

    def set_bg(slide):
        bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.333), Inches(7.5))
        bg.fill.solid()
        bg.fill.fore_color.rgb = BG_COLOR
        bg.line.fill.background()
        return bg

    slides_data = [
        {
            "num": "01",
            "title": "Executive Hook & The 500 GW Clean Grid Dilemma",
            "star": "STAR: SITUATION",
            "tab": "Top Navigation Header (SUNSYNC | SLDC Gujarat | PS-5A)",
            "cue": "Show the live dashboard home page and the golden SUNSYNC branding banner.",
            "script": "Respected judges, we present SUNSYNC, an autonomous solar dispatch platform built by team LUMINITY for Problem Statement PS-5A. India wants to build 500 gigawatts of clean energy. However, fast-moving clouds cause sudden solar power drops that can crash our electrical grid. SUNSYNC solves this by combining smart physics, fast camera tracking, and instant battery power, creating a modern grid that runs without expensive fossil-fuel plants.",
            "kpis": [
                ("PS-5A", "Track Statement"),
                ("500 GW", "National Target"),
                ("LUMINITY", "Innovator Team"),
                ("0-PEAKER", "Clean Grid Mandate")
            ],
            "trans": "fade"
        },
        {
            "num": "02",
            "title": "The Multi-Gigawatt Crisis in Gujarat's Solar Parks",
            "star": "STAR: SITUATION",
            "tab": "Gujarat SLDC Gotri Frequency Bar & National Solar Hub Registry",
            "cue": "Point to 50.01 Hz frequency telemetry and Khavda, Bhadla, Charanka mega parks.",
            "script": "Across Gujarat's giant solar parks—like 9,500 megawatt Khavda, 2,245 megawatt Bhadla, and 790 megawatt Charanka—dark clouds can suddenly cut 40 megawatts in just 30 seconds. When solar generation drops this fast, grid frequency crashes below the legal 49.90 Hertz limit. Grid operators face heavy penalties and are forced to start polluting gas peaker plants that cost a very expensive ₹12 per kilowatt-hour.",
            "kpis": [
                ("9,500 MW", "Khavda Park"),
                ("2,245 MW", "Bhadla Park"),
                ("40 MW / 30s", "Ramp Severity"),
                ("₹12 / kWh", "Fossil Peaker Cost")
            ],
            "trans": "push"
        },
        {
            "num": "03",
            "title": "Engineering Mission & Technical Goals (PS-5A)",
            "star": "STAR: TASK",
            "tab": "System Architecture & Probabilistic Quantile Goals",
            "cue": "Highlight the P50/P90 quantile curves and 120-minute forward forecast timeline.",
            "script": "Our mission for PS-5A was to replace slow, old forecasting tools with an intelligent real-time system. We set three clear goals: predict solar power drops 120 minutes ahead with under 4% error, stop AI models from making mistakes at night, and command big batteries in under 150 milliseconds. This protects the grid instantly so fossil-fuel backup plants never have to fire up.",
            "kpis": [
                ("120 Min", "Forecast Horizon"),
                ("< 4.0 %", "Target Error"),
                ("< 150 ms", "BESS Trigger"),
                ("100 %", "Zero Peaker Run")
            ],
            "trans": "push"
        },
        {
            "num": "04",
            "title": "Command Center: Real-Time SCADA & Quantile Telemetry",
            "star": "STAR: ACTION",
            "tab": "Tab 1 — Command Center",
            "cue": "Demonstrate live P10, P50, P90 Quantile Area Chart and 50.01 Hz frequency lock.",
            "script": "Our Command Center tab connects directly to 32 central inverters across the solar park. Instead of just guessing one number, SUNSYNC provides three smart prediction lines with an ultra-fast 48 millisecond reaction speed. It stays locked onto Gujarat's SLDC grid frequency at 50.01 Hertz. Operators get clean, live charts that show the best case, worst case, and most likely power output every second.",
            "kpis": [
                ("32 Inverters", "Active SCADA Feed"),
                ("48 ms", "Inference Latency"),
                ("P10/P50/P90", "Quantile Bounds"),
                ("50.01 Hz", "Frequency Lock")
            ],
            "trans": "push"
        },
        {
            "num": "05",
            "title": "Sky Radar: Optical Flow & Cloud Vector Anticipation",
            "star": "STAR: ACTION",
            "tab": "Tab 2 — Sky Radar",
            "cue": "Show Patan ground camera feed, 24 km/h optical wind vectors, and 7-Step Causal Chain.",
            "script": "In our Sky Radar tab, SUNSYNC looks directly at the sky using Patan ground cameras. Computer vision software tracks incoming clouds moving at 17 to 36 kilometers per hour. Its smart 7-step system warns operators 8 minutes before cloud shadows hit the solar panels. By predicting a 14.2 megawatt drop early, our system readies battery power before any solar loss actually happens.",
            "kpis": [
                ("17-36 km/h", "Wind Vector Speed"),
                ("8 Minutes", "Advance Warning"),
                ("-14.2 MW", "Predicted Shadow Dip"),
                ("7 Steps", "Causal Chain AI")
            ],
            "trans": "push"
        },
        {
            "num": "06",
            "title": "Solar Farm Digital Twin & Instant Hotspot Isolation",
            "star": "STAR: ACTION",
            "tab": "Tab 3 — Solar Farm Twin",
            "cue": "Move 24-hr day/night slider, show 0 kW night standby, and trigger Inverter 14 arc fault.",
            "script": "Our Solar Farm Twin monitors all 32 central inverters in Charanka. We built a 24-hour time slider to see real day and night operations. At night, all inverters sleep safely at zero kilowatts and 24 degrees Celsius. During the day, thermal sensors watch panel heat. When Inverter 14 showed an 88.5 degree hotspot, circuit breaker CB-14 isolated the line instantly to prevent equipment fire.",
            "kpis": [
                ("24-Hr", "Diurnal Slider"),
                ("0.00 kW", "Night Sleep (24°C)"),
                ("88.5 °C", "Hotspot Alarm"),
                ("CB-14", "Sub-Sec Line Cut")
            ],
            "trans": "push"
        },
        {
            "num": "07",
            "title": "Time Machine & Physics-Informed Neural Network (PINN)",
            "star": "STAR: ACTION",
            "tab": "Tab 4 — Time Machine & PINN Formula Card",
            "cue": "Click +30m, +60m, +120m lookahead buttons and explain clear-sky energy bounds.",
            "script": "Our Time Machine looks up to 120 minutes ahead using a Physics-Informed Neural Network. Typical AI models hallucinate sunshine at midnight, but SUNSYNC locks predictions within true clear-sky limits and forces power to zero after sunset. When an 18.4 megawatt afternoon drop is forecasted, our system prepares clean battery reserves, avoiding expensive gas peakers and saving ₹1.28 lakhs every single hour.",
            "kpis": [
                ("+120 Min", "Lookahead Horizon"),
                ("-18.4 MW", "Anticipated Dip"),
                ("0.00 %", "Night Hallucination"),
                ("₹1.28 L/hr", "Avoided Peaker Cost")
            ],
            "trans": "push"
        },
        {
            "num": "08",
            "title": "Sub-Cycle 118 Millisecond BESS Dispatch & Frequency Lock",
            "star": "STAR: ACTION",
            "tab": "60 MWh BESS SCADA Controller & Frequency Stabilizer",
            "cue": "Highlight 118ms reaction speed counter, +28.4 MW power injection, and IEGC limits.",
            "script": "When clouds cover solar panels, the grid needs instant power. Gas turbines take 15 minutes to start, but SUNSYNC's 60 megawatt-hour battery system fires in just 118 milliseconds. It immediately injects up to 28.4 megawatts of clean electricity into the wires. This holds grid frequency steady at 50.01 Hertz, safely inside India's strict legal band between 49.90 and 50.05 Hertz.",
            "kpis": [
                ("60 MWh", "BESS Capacity"),
                ("118 ms", "Reaction Latency"),
                ("+28.4 MW", "Instant Injection"),
                ("49.90-50.05", "IEGC Band (Hz)")
            ],
            "trans": "push"
        },
        {
            "num": "09",
            "title": "Adversarial Benchmarks, Data Laboratory & AI Copilot",
            "star": "STAR: RESULT",
            "tab": "Tabs 5, 6 & 7 — Adversarial Lab, Data Lab & AI Copilot",
            "cue": "Show #1 benchmark rank (4.12 MW RMSE), Data Lab error diffs, and Copilot live response.",
            "script": "In benchmark tests, SUNSYNC achieved a low 4.12 megawatt error and a 3.42% MAPE, outperforming legacy grid models by over 60%. It withstood dust storms and fake cyber attacks with zero crashes. Operators can also interact with our built-in AI Copilot across three roles: Dispatcher, Owner, and Auditor. It speaks both English and Gujarati, giving instant SCADA telemetry and battery answers in half a second.",
            "kpis": [
                ("4.12 MW", "RMSE Benchmark"),
                ("3.42 %", "MAPE Accuracy"),
                ("> 60 %", "Gain vs Legacy"),
                ("3 Personas", "Dual-Lang Copilot")
            ],
            "trans": "push"
        },
        {
            "num": "10",
            "title": "Grid Economics, Decarbonization & 8-Month Payback",
            "star": "STAR: RESULT & CONCLUSION",
            "tab": "Economic Metrics, ESG Carbon Audit & Footer (LUMINITY)",
            "cue": "Display ₹4.85L DSM savings, 1,086.1 MT avoided CO2, and the (c) 2026 LUMINITY footer.",
            "script": "Under CERC rules, forecast error under 10% saved Gujarat SLDC ₹4.85 lakhs daily in avoided deviation penalties, while generating ₹4.88 lakhs in green market spot revenue. Environmentally, it displaced 1,324.5 megawatt-hours of coal, avoiding 1,086.1 metric tons of carbon dioxide. With full payback in under 8 months, team LUMINITY's SUNSYNC is fully tested, cyber-secure, and ready to power India's 500-gigawatt clean grid today. Thank you!",
            "kpis": [
                ("₹4.85 L", "Daily DSM Savings"),
                ("₹4.88 L", "IEX Spot Profit"),
                ("1,086 MT", "Avoided CO2 / Day"),
                ("< 8 Months", "Full ROI Payback")
            ],
            "trans": "fade"
        }
    ]

    for data in slides_data:
        slide = prs.slides.add_slide(blank_layout)
        set_bg(slide)
        add_slide_transition(slide, data.get("trans", "push"))

        # --- TOP HEADER BAR ---
        header_box = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.6), Inches(0.4), Inches(12.133), Inches(0.95))
        header_box.fill.solid()
        header_box.fill.fore_color.rgb = CARD_BG
        header_box.line.color.rgb = CARD_BORDER
        header_box.line.width = Pt(1)

        # Slide Number Pill
        pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.8), Inches(0.55), Inches(1.1), Inches(0.35))
        pill.fill.solid()
        pill.fill.fore_color.rgb = GOLD
        pill.line.fill.background()
        tf = pill.text_frame
        tf.text = f"SLIDE {data['num']}"
        tf.paragraphs[0].font.size = Pt(11)
        tf.paragraphs[0].font.bold = True
        tf.paragraphs[0].font.color.rgb = BG_COLOR
        tf.paragraphs[0].alignment = PP_ALIGN.CENTER

        # STAR Tag Pill
        star_pill = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(2.05), Inches(0.55), Inches(1.8), Inches(0.35))
        star_pill.fill.solid()
        star_pill.fill.fore_color.rgb = RGBColor(8, 47, 73)
        star_pill.line.color.rgb = CYAN
        star_pill.line.width = Pt(1)
        stf = star_pill.text_frame
        stf.text = data["star"]
        stf.paragraphs[0].font.size = Pt(10)
        stf.paragraphs[0].font.bold = True
        stf.paragraphs[0].font.color.rgb = CYAN
        stf.paragraphs[0].alignment = PP_ALIGN.CENTER

        # Slide Title
        title_box = slide.shapes.add_textbox(Inches(4.0), Inches(0.45), Inches(8.5), Inches(0.5))
        ttf = title_box.text_frame
        ttf.word_wrap = True
        tp = ttf.paragraphs[0]
        tp.text = data["title"]
        tp.font.size = Pt(16)
        tp.font.bold = True
        tp.font.color.rgb = WHITE

        # Subtitle in header
        sub_p = ttf.add_paragraph()
        sub_p.text = "SUNSYNC AI // Autonomous Solar Grid Intelligence • Problem Statement PS-5A"
        sub_p.font.size = Pt(10)
        sub_p.font.color.rgb = MUTED

        # --- LEFT CARD: WEBSITE & LIVE DEMO CUE ---
        left_card = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.6), Inches(1.5), Inches(4.3), Inches(3.9))
        left_card.fill.solid()
        left_card.fill.fore_color.rgb = CARD_BG
        left_card.line.color.rgb = CARD_BORDER
        left_card.line.width = Pt(1)

        ltf = left_card.text_frame
        ltf.word_wrap = True
        ltf.margin_left = Inches(0.25)
        ltf.margin_right = Inches(0.25)
        ltf.margin_top = Inches(0.2)
        ltf.margin_bottom = Inches(0.2)

        lp1 = ltf.paragraphs[0]
        lp1.text = "LIVE PLATFORM SYNC"
        lp1.font.size = Pt(11)
        lp1.font.bold = True
        lp1.font.color.rgb = GOLD
        lp1.space_after = Pt(10)

        lp2 = ltf.add_paragraph()
        lp2.text = "Website Tab:"
        lp2.font.size = Pt(10)
        lp2.font.color.rgb = MUTED

        lp3 = ltf.add_paragraph()
        lp3.text = data["tab"]
        lp3.font.size = Pt(13)
        lp3.font.bold = True
        lp3.font.color.rgb = CYAN
        lp3.space_after = Pt(14)

        lp4 = ltf.add_paragraph()
        lp4.text = "Presenter Visual Cue:"
        lp4.font.size = Pt(10)
        lp4.font.color.rgb = MUTED

        lp5 = ltf.add_paragraph()
        lp5.text = data["cue"]
        lp5.font.size = Pt(12)
        lp5.font.color.rgb = WHITE
        lp5.space_after = Pt(12)

        # --- RIGHT CARD: SPEAKER SCRIPT ---
        right_card = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(5.1), Inches(1.5), Inches(7.633), Inches(3.9))
        right_card.fill.solid()
        right_card.fill.fore_color.rgb = SCRIPT_BG
        right_card.line.color.rgb = SCRIPT_BORDER
        right_card.line.width = Pt(1)

        rtf = right_card.text_frame
        rtf.word_wrap = True
        rtf.margin_left = Inches(0.35)
        rtf.margin_right = Inches(0.35)
        rtf.margin_top = Inches(0.25)
        rtf.margin_bottom = Inches(0.25)

        rp1 = rtf.paragraphs[0]
        rp1.text = "SPEAKER SCRIPT  (SIMPLE ENGLISH)"
        rp1.font.size = Pt(11)
        rp1.font.bold = True
        rp1.font.color.rgb = GOLD
        rp1.space_after = Pt(12)

        rp2 = rtf.add_paragraph()
        rp2.text = f'"{data["script"]}"'
        rp2.font.size = Pt(14.5)
        rp2.font.color.rgb = WHITE
        rp2.font.italic = False
        rp2.space_before = Pt(4)

        # --- BOTTOM KPI BADGES ---
        kpi_y = Inches(5.55)
        kpi_w = Inches(2.88)
        kpi_h = Inches(1.4)
        gap = Inches(0.2)

        for idx, (val, lbl) in enumerate(data["kpis"]):
            kpi_x = Inches(0.6) + idx * (kpi_w + gap)
            kbox = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, kpi_x, kpi_y, kpi_w, kpi_h)
            kbox.fill.solid()
            kbox.fill.fore_color.rgb = KPI_BG
            kbox.line.color.rgb = KPI_BORDER
            kbox.line.width = Pt(1)

            ktf = kbox.text_frame
            ktf.word_wrap = True
            ktf.margin_left = Inches(0.15)
            ktf.margin_right = Inches(0.15)
            ktf.margin_top = Inches(0.18)

            kp1 = ktf.paragraphs[0]
            kp1.text = val
            kp1.font.size = Pt(20)
            kp1.font.bold = True
            kp1.font.color.rgb = KPI_TEXT
            kp1.alignment = PP_ALIGN.CENTER

            kp2 = ktf.add_paragraph()
            kp2.text = lbl
            kp2.font.size = Pt(10)
            kp2.font.color.rgb = MUTED
            kp2.alignment = PP_ALIGN.CENTER
            kp2.space_before = Pt(3)

        # Small bottom copyright footer
        foot_box = slide.shapes.add_textbox(Inches(0.6), Inches(7.05), Inches(12.133), Inches(0.35))
        ftf = foot_box.text_frame
        fp = ftf.paragraphs[0]
        fp.text = "SUNSYNC Autonomous Grid Intelligence • (c) 2026 LUMINITY. All rights reserved."
        fp.font.size = Pt(9)
        fp.font.color.rgb = RGBColor(100, 116, 139)
        fp.alignment = PP_ALIGN.CENTER

    out_path = r"C:\Kunj\Hackathon-kunj\SUNSYNC_10_Slides_Animated.pptx"
    prs.save(out_path)
    print(f"Presentation saved successfully at: {out_path}")
    print(f"Total Slides: {len(slides_data)}")

if __name__ == "__main__":
    create_presentation()
