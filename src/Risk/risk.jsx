import { useState } from "react";
import { useCreateAssessmentMutation } from "../Api/healthApi";
import toast from "react-hot-toast";
import ResultScreen from "./Resultscreen ";

const STEPS = [
  { id: "basic",     label: "Basic Info",  icon: "👤" },
  { id: "vitals",    label: "Vitals",      icon: "💓" },
  { id: "lifestyle", label: "Lifestyle",   icon: "🏃" },
  { id: "family",    label: "Family",      icon: "🧬" },
  { id: "symptoms",  label: "Symptoms",    icon: "🩺" },
];

const SYMPTOM_OPTIONS = [
  { value: "fatigue",             label: "Fatigue" },
  { value: "chest_pain",          label: "Chest Pain" },
  { value: "shortness_of_breath", label: "Shortness of Breath" },
  { value: "frequent_urination",  label: "Frequent Urination" },
  { value: "excessive_thirst",    label: "Excessive Thirst" },
  { value: "blurred_vision",      label: "Blurred Vision" },
  { value: "headache",            label: "Headache" },
  { value: "dizziness",           label: "Dizziness" },
  { value: "joint_pain",          label: "Joint Pain" },
  { value: "weight_gain",         label: "Weight Gain" },
  { value: "weight_loss",         label: "Weight Loss" },
  { value: "nausea",              label: "Nausea" },
  { value: "sweating",            label: "Sweating" },
  { value: "palpitations",        label: "Palpitations" },
  { value: "swollen_feet",        label: "Swollen Feet" },
];

const INITIAL = {
  age: "", gender: "", heightCm: "", weightKg: "",
  bloodPressureSystolic: "", bloodPressureDiastolic: "",
  bloodSugarFasting: "", cholesterolTotal: "", heartRateBpm: "",
  smokingStatus: "never", alcoholConsumption: "none",
  exerciseDaysPerWeek: 0, sleepHoursPerDay: 7, dietType: "other",
  familyHistory: { diabetes: false, heartDisease: false, hypertension: false },
  symptoms: [],
  notes: "",
};

// ── Green theme tokens ─────────────────────────────────────
const G = {
  primary:      "#22C55E",
  primaryMid:   "#16A34A",
  primaryDeep:  "#15803D",
  primaryGlow:  "rgba(34,197,94,0.18)",
  primaryFaint: "rgba(34,197,94,0.07)",
  primaryBorder:"rgba(34,197,94,0.22)",
  bg:           "#050A05",
  card:         "rgba(6,14,6,0.96)",
  inputBg:      "rgba(5,20,8,0.95)",
  inputBorder:  "rgba(34,197,94,0.16)",
  textPrimary:  "#DCFCE7",
  textMuted:    "#4A8A5A",
  textFaint:    "#2A5A32",
  labelColor:   "#3A7A4A",
};

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

    .ha-page * { box-sizing: border-box; font-family: 'DM Sans', 'Segoe UI', sans-serif; }

    .ha-input {
      width: 100%;
      padding: 0.8rem 1rem;
      background: ${G.inputBg};
      border: 1px solid ${G.inputBorder};
      border-radius: 12px;
      color: ${G.textPrimary};
      font-size: 0.9rem;
      outline: none;
      box-sizing: border-box;
      transition: border-color 0.2s, box-shadow 0.2s;
      font-family: inherit;
    }
    .ha-input::placeholder { color: #1A3A22; }
    .ha-input:focus {
      border-color: ${G.primary} !important;
      box-shadow: 0 0 0 3px rgba(34,197,94,0.12);
    }
    .ha-input option { background: #060E06; color: ${G.textPrimary}; }

    .ha-range { width: 100%; accent-color: ${G.primary}; height: 5px; cursor: pointer; }

    .ha-symptom-chip {
      padding: 0.65rem 0.85rem;
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.18s;
      font-size: 0.8rem;
      font-weight: 400;
      backdrop-filter: blur(4px);
      user-select: none;
      border: 1px solid rgba(34,197,94,0.08);
      background: rgba(5,18,8,0.85);
      color: rgba(220,252,231,0.5);
    }
    .ha-symptom-chip.active {
      background: rgba(34,197,94,0.14);
      border-color: rgba(34,197,94,0.45);
      color: ${G.primary};
      font-weight: 600;
    }
    .ha-symptom-chip:hover { border-color: ${G.primaryBorder}; color: ${G.textPrimary}; }

    .ha-family-card {
      display: flex; align-items: center; gap: 1rem;
      padding: 1rem; border-radius: 16px; margin-bottom: 0.9rem;
      cursor: pointer; transition: all 0.22s ease;
      background: rgba(6,18,8,0.85);
      border: 1px solid rgba(34,197,94,0.08);
      user-select: none;
    }
    .ha-family-card.active {
      background: rgba(34,197,94,0.10);
      border-color: rgba(34,197,94,0.38);
      transform: scale(1.01);
    }

    .ha-btn-primary {
      padding: 0.82rem 1.2rem;
      background: linear-gradient(90deg, ${G.primaryDeep}, ${G.primaryMid}, ${G.primary});
      color: #F0FFF4;
      border: none; border-radius: 40px;
      font-weight: 700; font-size: 0.88rem;
      cursor: pointer; transition: all 0.2s ease;
      letter-spacing: 0.02em; font-family: inherit;
      box-shadow: 0 4px 14px rgba(34,197,94,0.22);
    }
    .ha-btn-primary:hover { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(34,197,94,0.28); }
    .ha-btn-primary:active { transform: translateY(1px); }
    .ha-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

    .ha-btn-back {
      padding: 0.82rem 1.2rem;
      background: rgba(5,20,8,0.9);
      color: ${G.textMuted};
      border: 1px solid ${G.inputBorder};
      border-radius: 40px;
      font-weight: 600; font-size: 0.88rem;
      cursor: pointer; transition: all 0.2s ease; font-family: inherit;
    }
    .ha-btn-back:hover { border-color: ${G.primary}; color: ${G.primary}; transform: translateY(-1px); }

    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes greenFloat {
      0% { transform: translate(0,0) scale(1); }
      100% { transform: translate(2%,2%) scale(1.05); }
    }
    @keyframes stepPop {
      0% { transform: scale(0.85); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    .step-anim { animation: stepPop 0.3s ease-out; }
    .ha-blob { animation: greenFloat 12s infinite alternate; will-change: transform; }
    .ha-spin { animation: spin 0.7s linear infinite; }

    .ha-step-dot {
      width: 34px; height: 34px; border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 1rem; font-weight: 700;
      transition: all 0.3s ease;
      border: 2px solid rgba(34,197,94,0.12);
      background: rgba(5,18,8,0.9);
      color: rgba(220,252,231,0.25);
    }
    .ha-step-dot.done {
      background: ${G.primary};
      border-color: ${G.primary};
      color: #052008;
    }
    .ha-step-dot.active {
      background: rgba(34,197,94,0.14);
      border-color: ${G.primary};
      color: ${G.primary};
      box-shadow: 0 0 0 4px rgba(34,197,94,0.15);
    }
  `}</style>
);

const Field = ({ label, children, unit }) => (
  <div style={{ marginBottom: "1.2rem" }}>
    <label style={{
      display: "flex", alignItems: "center", gap: "6px",
      fontSize: "0.7rem", fontWeight: 700,
      color: G.textMuted, textTransform: "uppercase",
      letterSpacing: "0.07em", marginBottom: "0.5rem",
    }}>
      <span style={{ color: G.primary, fontSize: "0.65rem" }}>✦</span>
      {label}
      {unit && (
        <span style={{ color: G.primary, marginLeft: "auto", fontWeight: 500, textTransform: "none" }}>
          ({unit})
        </span>
      )}
    </label>
    {children}
  </div>
);

export default function HealthAssessment() {
  const [step, setStep]     = useState(0);
  const [form, setForm]     = useState(INITIAL);
  const [result, setResult] = useState(null);

  const [createAssessment, { isLoading }] = useCreateAssessmentMutation();

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setFamily = (key, val) => setForm(f => ({
    ...f, familyHistory: { ...f.familyHistory, [key]: val }
  }));
  const toggleSymptom = (val) => setForm(f => ({
    ...f,
    symptoms: f.symptoms.includes(val)
      ? f.symptoms.filter(x => x !== val)
      : [...f.symptoms, val],
  }));

  const bmi = form.heightCm && form.weightKg
    ? (form.weightKg / ((form.heightCm / 100) ** 2)).toFixed(1)
    : null;

  const handleSubmit = async () => {
    if (!form.age || !form.gender || !form.heightCm || !form.weightKg) {
      toast.error("Age, Gender, Height & Weight are required!");
      setStep(0);
      return;
    }
    const payload = {
      age: Number(form.age), gender: form.gender,
      heightCm: Number(form.heightCm), weightKg: Number(form.weightKg),
      bloodPressureSystolic:  Number(form.bloodPressureSystolic)  || undefined,
      bloodPressureDiastolic: Number(form.bloodPressureDiastolic) || undefined,
      bloodSugarFasting:      Number(form.bloodSugarFasting)      || undefined,
      cholesterolTotal:       Number(form.cholesterolTotal)       || undefined,
      heartRateBpm:           Number(form.heartRateBpm)           || undefined,
      smokingStatus: form.smokingStatus, alcoholConsumption: form.alcoholConsumption,
      exerciseDaysPerWeek: Number(form.exerciseDaysPerWeek),
      sleepHoursPerDay: Number(form.sleepHoursPerDay),
      dietType: form.dietType,
      familyHistory: form.familyHistory,
      symptoms: form.symptoms,
      notes: form.notes,
    };
    try {
      const res = await createAssessment(payload).unwrap();
      setResult(res);
      toast.success("Assessment saved!");
    } catch (err) {
      toast.error(err?.data?.message || "Something went wrong");
    }
  };

  const steps = [
    // Step 0 — Basic
    <div key="basic" className="step-anim">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
        <Field label="Age" unit="years">
          <input className="ha-input" type="number" placeholder="25" min={1} max={120}
            value={form.age} onChange={e => set("age", e.target.value)} />
        </Field>
        <Field label="Gender">
          <select className="ha-input" value={form.gender} onChange={e => set("gender", e.target.value)}>
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </Field>
        <Field label="Height" unit="cm">
          <input className="ha-input" type="number" placeholder="170" min={50} max={300}
            value={form.heightCm} onChange={e => set("heightCm", e.target.value)} />
        </Field>
        <Field label="Weight" unit="kg">
          <input className="ha-input" type="number" placeholder="70" min={1} max={500}
            value={form.weightKg} onChange={e => set("weightKg", e.target.value)} />
        </Field>
      </div>
      {bmi && (
        <div style={{
          marginTop: "0.8rem", padding: "0.85rem 1.2rem",
          background: G.primaryFaint,
          borderRadius: "14px", border: `1px solid ${G.primaryBorder}`,
          display: "flex", justifyContent: "space-between", alignItems: "center",
        }}>
          <span style={{ fontSize: "0.8rem", color: G.textMuted }}>BMI Score</span>
          <span style={{ color: G.primary, fontWeight: 700, fontSize: "1.15rem" }}>{bmi}</span>
          <span style={{
            fontSize: "0.75rem", fontWeight: 600, padding: "3px 10px", borderRadius: "20px",
            background: bmi < 18.5 ? "rgba(249,115,22,0.12)" : bmi < 25 ? "rgba(34,197,94,0.12)" : bmi < 30 ? "rgba(234,179,8,0.12)" : "rgba(239,68,68,0.12)",
            color: bmi < 18.5 ? "#fb923c" : bmi < 25 ? G.primary : bmi < 30 ? "#fbbf24" : "#f87171",
          }}>
            {bmi < 18.5 ? "Underweight" : bmi < 25 ? "Optimal ✓" : bmi < 30 ? "Elevated" : "High Risk"}
          </span>
        </div>
      )}
    </div>,

    // Step 1 — Vitals
    <div key="vitals" className="step-anim">
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.8rem" }}>
        <Field label="Systolic BP" unit="mmHg">
          <input className="ha-input" type="number" placeholder="120" min={60} max={250}
            value={form.bloodPressureSystolic} onChange={e => set("bloodPressureSystolic", e.target.value)} />
        </Field>
        <Field label="Diastolic BP" unit="mmHg">
          <input className="ha-input" type="number" placeholder="80" min={40} max={150}
            value={form.bloodPressureDiastolic} onChange={e => set("bloodPressureDiastolic", e.target.value)} />
        </Field>
        <Field label="Blood Sugar" unit="mg/dL">
          <input className="ha-input" type="number" placeholder="100" min={50} max={600}
            value={form.bloodSugarFasting} onChange={e => set("bloodSugarFasting", e.target.value)} />
        </Field>
        <Field label="Cholesterol" unit="mg/dL">
          <input className="ha-input" type="number" placeholder="180" min={50} max={600}
            value={form.cholesterolTotal} onChange={e => set("cholesterolTotal", e.target.value)} />
        </Field>
        <Field label="Heart Rate" unit="bpm">
          <input className="ha-input" type="number" placeholder="72" min={30} max={220}
            value={form.heartRateBpm} onChange={e => set("heartRateBpm", e.target.value)} />
        </Field>
      </div>
    </div>,

    // Step 2 — Lifestyle
    <div key="lifestyle" className="step-anim">
      <Field label="Smoking Status">
        <select className="ha-input" value={form.smokingStatus} onChange={e => set("smokingStatus", e.target.value)}>
          <option value="never">🚭 Never Smoked</option>
          <option value="former">🚬 Former Smoker</option>
          <option value="current">🔥 Current Smoker</option>
        </select>
      </Field>
      <Field label="Alcohol Consumption">
        <select className="ha-input" value={form.alcoholConsumption} onChange={e => set("alcoholConsumption", e.target.value)}>
          <option value="none">🍵 None</option>
          <option value="occasional">🥂 Occasional</option>
          <option value="moderate">🍷 Moderate</option>
          <option value="heavy">🍸 Heavy</option>
        </select>
      </Field>
      <Field label="Diet Type">
        <select className="ha-input" value={form.dietType} onChange={e => set("dietType", e.target.value)}>
          <option value="other">🥗 Mixed / Other</option>
          <option value="vegetarian">🥦 Vegetarian</option>
          <option value="vegan">🌱 Vegan</option>
          <option value="non-vegetarian">🍖 Non-Vegetarian</option>
        </select>
      </Field>
      <Field label="Exercise" unit="days/week">
        <input className="ha-range" type="range" min={0} max={7} step={1}
          value={form.exerciseDaysPerWeek}
          onChange={e => set("exerciseDaysPerWeek", e.target.value)} />
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.68rem", color: G.textFaint, marginTop: "5px" }}>
          {[0,1,2,3,4,5,6,7].map(n => <span key={n}>{n}</span>)}
        </div>
        <div style={{ textAlign: "center", marginTop: "8px", color: G.primary, fontSize: "0.85rem", fontWeight: 700 }}>
          🏋️ {form.exerciseDaysPerWeek} days/week
        </div>
      </Field>
      <Field label="Sleep" unit="hours/day">
        <input className="ha-range" type="range" min={0} max={12} step={0.5}
          value={form.sleepHoursPerDay}
          onChange={e => set("sleepHoursPerDay", e.target.value)} />
        <div style={{ textAlign: "center", marginTop: "8px", color: G.primary, fontSize: "0.85rem", fontWeight: 700 }}>
          😴 {form.sleepHoursPerDay} hours/day
        </div>
      </Field>
    </div>,

    // Step 3 — Family History
    <div key="family" className="step-anim">
      {[
        { key: "diabetes",     label: "Diabetes",     icon: "🩸", desc: "Parent/sibling with diabetes" },
        { key: "heartDisease", label: "Heart Disease", icon: "❤️", desc: "Heart disease before age 60" },
        { key: "hypertension", label: "Hypertension",  icon: "🩺", desc: "High blood pressure in family" },
      ].map(({ key, label, icon, desc }) => (
        <div
          key={key}
          className={`ha-family-card${form.familyHistory[key] ? " active" : ""}`}
          onClick={() => setFamily(key, !form.familyHistory[key])}
        >
          <span style={{ fontSize: "1.5rem" }}>{icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, color: G.textPrimary, fontSize: "0.9rem" }}>{label}</div>
            <div style={{ fontSize: "0.7rem", color: G.textFaint, marginTop: "3px" }}>{desc}</div>
          </div>
          <div style={{
            width: "24px", height: "24px", borderRadius: "50%", flexShrink: 0,
            border: `2px solid ${form.familyHistory[key] ? G.primary : "rgba(34,197,94,0.2)"}`,
            background: form.familyHistory[key] ? G.primary : "transparent",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.2s",
          }}>
            {form.familyHistory[key] && (
              <span style={{ fontSize: "12px", color: "#052008", fontWeight: 800 }}>✓</span>
            )}
          </div>
        </div>
      ))}
    </div>,

    // Step 4 — Symptoms
    <div key="symptoms" className="step-anim">
      <div style={{
        background: G.primaryFaint, borderRadius: "12px", padding: "0.75rem 1rem",
        marginBottom: "1.2rem", borderLeft: `3px solid ${G.primary}`,
      }}>
        <p style={{ fontSize: "0.75rem", color: G.textMuted, margin: 0, lineHeight: 1.5 }}>
          Select all symptoms you are currently experiencing — this helps our AI provide a more accurate assessment.
        </p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.65rem" }}>
        {SYMPTOM_OPTIONS.map(({ value, label }) => (
          <div
            key={value}
            className={`ha-symptom-chip${form.symptoms.includes(value) ? " active" : ""}`}
            onClick={() => toggleSymptom(value)}
          >
            <span style={{ marginRight: "5px", fontSize: "0.75rem" }}>
              {form.symptoms.includes(value) ? "✓" : "○"}
            </span>
            {label}
          </div>
        ))}
      </div>
      {form.symptoms.length > 0 && (
        <div style={{
          marginTop: "1rem", fontSize: "0.75rem", color: G.primary,
          textAlign: "center", padding: "0.5rem 1rem",
          background: G.primaryFaint, borderRadius: "30px",
          border: `1px solid ${G.primaryBorder}`, fontWeight: 600,
        }}>
          {form.symptoms.length} symptom{form.symptoms.length > 1 ? "s" : ""} selected
        </div>
      )}
      <div style={{ marginTop: "1.2rem" }}>
        <Field label="Additional Notes (optional)">
          <textarea
            className="ha-input"
            style={{ height: "75px", resize: "vertical", borderRadius: "12px" }}
            placeholder="Any other information you'd like to share..."
            value={form.notes}
            onChange={e => set("notes", e.target.value)}
          />
        </Field>
      </div>
    </div>,
  ];

  if (result) {
    return (
      <ResultScreen
        result={result}
        onReset={() => { setResult(null); setStep(0); setForm(INITIAL); }}
        userEmail=""
      />
    );
  }

  return (
    <div className="ha-page" style={{
      minHeight: "100vh",
      background: G.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem 1.2rem",
      position: "relative",
    }}>
      <GlobalStyles />

      {/* Background blobs */}
      <div className="ha-blob" style={{
        position: "fixed", top: "-15%", left: "-8%",
        width: "70%", height: "70%",
        background: "radial-gradient(circle, rgba(34,197,94,0.10) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none", zIndex: 0,
      }} />
      <div className="ha-blob" style={{
        position: "fixed", bottom: "-15%", right: "-8%",
        width: "70%", height: "70%",
        background: "radial-gradient(circle, rgba(16,185,129,0.07) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(90px)", pointerEvents: "none", zIndex: 0,
        animationDelay: "1.5s",
      }} />

      {/* Card */}
      <div style={{
        width: "100%", maxWidth: "540px",
        background: G.card,
        backdropFilter: "blur(16px)",
        border: `1px solid ${G.primaryBorder}`,
        borderRadius: "28px",
        padding: "2.2rem 2rem",
        boxShadow: "0 28px 50px rgba(0,0,0,0.65), inset 0 1px 0 rgba(34,197,94,0.05)",
        position: "relative", zIndex: 2,
      }}>

        {/* Top glow strip */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "100px",
          background: "linear-gradient(180deg, rgba(34,197,94,0.05) 0%, transparent 100%)",
          borderRadius: "28px 28px 0 0", pointerEvents: "none",
        }} />

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "2rem", position: "relative", zIndex: 1 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: G.primaryFaint,
            border: `1px solid ${G.primaryBorder}`,
            padding: "4px 14px", borderRadius: "40px", marginBottom: "1rem",
          }}>
            <span style={{
              width: "6px", height: "6px", borderRadius: "50%",
              background: G.primary, boxShadow: `0 0 6px ${G.primary}`,
              display: "inline-block",
            }} />
            <span style={{ fontSize: "0.7rem", fontWeight: 600, color: G.primary, letterSpacing: "0.06em" }}>
              AI HEALTH ASSESSMENT
            </span>
          </div>
          <h2 style={{ color: G.textPrimary, fontSize: "1.5rem", fontWeight: 700, margin: "0.4rem 0 0.2rem", letterSpacing: "-0.02em" }}>
            Wellness Check
          </h2>
          <p style={{ color: G.textFaint, fontSize: "0.75rem", margin: 0 }}>
            Complete the steps for a personalized risk analysis
          </p>
        </div>

        {/* Step indicator */}
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem", position: "relative", padding: "0 0.2rem", zIndex: 1 }}>
          <div style={{
            position: "absolute", top: "16px", left: "8%", right: "8%",
            height: "2px", background: "rgba(34,197,94,0.10)", zIndex: 0, borderRadius: "4px",
          }} />
          {/* Progress fill */}
          <div style={{
            position: "absolute", top: "16px", left: "8%",
            width: `${(step / (STEPS.length - 1)) * 84}%`,
            height: "2px", background: `linear-gradient(90deg, ${G.primaryDeep}, ${G.primary})`,
            zIndex: 0, borderRadius: "4px", transition: "width 0.4s ease",
          }} />
          {STEPS.map((s, i) => (
            <div
              key={s.id}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", position: "relative", zIndex: 1, cursor: i <= step ? "pointer" : "default" }}
              onClick={() => i <= step && setStep(i)}
            >
              <div className={`ha-step-dot${i < step ? " done" : i === step ? " active" : ""}`}>
                {i < step ? "✓" : s.icon}
              </div>
              <span style={{
                fontSize: "0.62rem",
                color: i === step ? G.primary : i < step ? G.primaryMid : G.textFaint,
                fontWeight: i === step ? 700 : 400,
                textTransform: "uppercase", letterSpacing: "0.04em",
              }}>
                {s.label}
              </span>
            </div>
          ))}
        </div>

        {/* Step content */}
        <div style={{ minHeight: "300px", position: "relative", zIndex: 1 }}>
          {steps[step]}
        </div>

        {/* Navigation */}
        <div style={{ display: "flex", gap: "12px", marginTop: "2rem", position: "relative", zIndex: 1 }}>
          {step > 0 && (
            <button className="ha-btn-back" style={{ flex: 1 }} onClick={() => setStep(s => s - 1)}>
              ← Back
            </button>
          )}
          {step < STEPS.length - 1 ? (
            <button className="ha-btn-primary" style={{ flex: 2 }} onClick={() => setStep(s => s + 1)}>
              Continue →
            </button>
          ) : (
            <button
              className="ha-btn-primary"
              style={{ flex: 2 }}
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? (
                <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                  <span className="ha-spin" style={{
                    width: "15px", height: "15px",
                    border: "2px solid rgba(240,255,244,0.3)",
                    borderTopColor: "#F0FFF4",
                    borderRadius: "50%", display: "inline-block",
                  }} />
                  Analyzing...
                </span>
              ) : "Get Risk Analysis →"}
            </button>
          )}
        </div>

        {/* Footer note */}
        <p style={{
          textAlign: "center", fontSize: "0.65rem",
          color: G.textFaint, marginTop: "1rem",
          position: "relative", zIndex: 1,
        }}>
          🔒 Your data is encrypted and used only for health analysis
        </p>
      </div>
    </div>
  );
}