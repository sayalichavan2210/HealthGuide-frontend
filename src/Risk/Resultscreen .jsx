import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
const G = {
  primary:       "#22C55E",
  primaryMid:    "#16A34A",
  primaryDeep:   "#15803D",
  primaryGlow:   "rgba(34,197,94,0.18)",
  primaryFaint:  "rgba(34,197,94,0.07)",
  primaryBorder: "rgba(34,197,94,0.22)",
  bg:            "#050A05",
  card:          "rgba(6,14,6,0.96)",
  inputBg:       "rgba(5,20,8,0.95)",
  inputBorder:   "rgba(34,197,94,0.16)",
  textPrimary:   "#DCFCE7",
  textMuted:     "#4A8A5A",
  textFaint:     "#2A5A32",
};

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

    .rs-page * { box-sizing: border-box; font-family: 'DM Sans', 'Segoe UI', sans-serif; }

    @keyframes rsBlob {
      0%   { transform: translate(0,0) scale(1); }
      100% { transform: translate(2%,2%) scale(1.05); }
    }
    @keyframes rsFadeUp {
      from { opacity: 0; transform: translateY(18px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes rsBarFill {
      from { width: 0; }
    }
    @keyframes rsSpin {
      to { transform: rotate(360deg); }
    }
    @keyframes rsPulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
      50%      { box-shadow: 0 0 0 8px rgba(34,197,94,0); }
    }

    .rs-blob { animation: rsBlob 12s infinite alternate; will-change: transform; }
    .rs-card { animation: rsFadeUp 0.5s ease-out; }
    .rs-bar-fill { animation: rsBarFill 1.2s cubic-bezier(0.4,0,0.2,1) forwards; }
    .rs-spin { animation: rsSpin 0.7s linear infinite; }
    .rs-pulse { animation: rsPulse 1.8s ease-in-out infinite; }

    .rs-risk-card {
      margin-bottom: 0.9rem;
      padding: 1rem 1.1rem;
      background: rgba(5,18,8,0.85);
      border-radius: 14px;
      border: 1px solid rgba(34,197,94,0.10);
      transition: border-color 0.2s;
    }
    .rs-risk-card:hover { border-color: rgba(34,197,94,0.25); }

    .rs-email-input {
      width: 100%;
      padding: 0.72rem 1rem;
      background: ${G.inputBg};
      border: 1px solid ${G.inputBorder};
      border-radius: 10px;
      color: ${G.textPrimary};
      font-size: 0.9rem;
      outline: none;
      box-sizing: border-box;
      font-family: inherit;
      transition: border-color 0.2s, box-shadow 0.2s;
      margin-bottom: 0.75rem;
    }
    .rs-email-input::placeholder { color: #1A3A22; }
    .rs-email-input:focus {
      border-color: ${G.primary};
      box-shadow: 0 0 0 3px rgba(34,197,94,0.12);
    }

    .rs-btn-primary {
      padding: 0.78rem 1.2rem;
      background: linear-gradient(90deg, ${G.primaryDeep}, ${G.primaryMid}, ${G.primary});
      color: #F0FFF4;
      border: none; border-radius: 40px;
      font-weight: 700; font-size: 0.88rem;
      cursor: pointer; transition: all 0.2s ease;
      font-family: inherit; width: 100%;
      box-shadow: 0 4px 14px rgba(34,197,94,0.22);
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .rs-btn-primary:hover { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 8px 22px rgba(34,197,94,0.28); }
    .rs-btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

    .rs-btn-ghost {
      padding: 0.78rem 1.2rem;
      background: rgba(5,20,8,0.9);
      color: ${G.textMuted};
      border: 1px solid ${G.inputBorder};
      border-radius: 40px;
      font-weight: 600; font-size: 0.88rem;
      cursor: pointer; transition: all 0.2s ease;
      font-family: inherit; width: 100%;
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .rs-btn-ghost:hover { border-color: ${G.primary}; color: ${G.primary}; transform: translateY(-1px); }

    .rs-btn-outline-green {
      padding: 0.78rem 1.2rem;
      background: ${G.primaryFaint};
      color: ${G.primary};
      border: 1px solid ${G.primaryBorder};
      border-radius: 40px;
      font-weight: 600; font-size: 0.88rem;
      cursor: pointer; transition: all 0.2s ease;
      font-family: inherit; width: 100%;
      display: flex; align-items: center; justify-content: center; gap: 8px;
    }
    .rs-btn-outline-green:hover { background: rgba(34,197,94,0.13); transform: translateY(-1px); }

    .rs-cancel-btn {
      flex: 1; padding: 0.65rem;
      background: rgba(5,20,8,0.9);
      color: ${G.textMuted};
      border: 1px solid ${G.inputBorder};
      border-radius: 10px; cursor: pointer;
      font-size: 0.85rem; font-family: inherit;
      transition: all 0.2s;
    }
    .rs-cancel-btn:hover { border-color: ${G.primary}; color: ${G.primary}; }

    .rs-send-btn {
      flex: 2; padding: 0.65rem;
      border: none; border-radius: 10px;
      font-weight: 700; font-size: 0.85rem;
      font-family: inherit; cursor: pointer;
      transition: all 0.2s;
      display: flex; align-items: center; justify-content: center; gap: 6px;
    }
  `}</style>
);

const getRiskColor = (v) => {
  if (v > 0.6)  return "#F87171";
  if (v > 0.35) return "#FBBF24";
  return G.primary;
};
const getRiskBg = (v) => {
  if (v > 0.6)  return "rgba(248,113,113,0.10)";
  if (v > 0.35) return "rgba(251,191,36,0.10)";
  return G.primaryFaint;
};
const getRiskBorder = (v) => {
  if (v > 0.6)  return "rgba(248,113,113,0.28)";
  if (v > 0.35) return "rgba(251,191,36,0.28)";
  return G.primaryBorder;
};
const getLabel = (v) => v > 0.6 ? "High Risk" : v > 0.35 ? "Moderate" : "Low Risk";

const RISK_META = [
  { key: "diabetes",     label: "Diabetes Risk",     icon: "🩸" },
  { key: "heartDisease", label: "Heart Disease Risk", icon: "❤️" },
  { key: "hypertension", label: "Hypertension Risk",  icon: "🩺" },
];

function RiskBar({ value }) {
  const pct   = Math.round(value * 100);
  const color = getRiskColor(value);
  return (
    <div style={{ height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "4px", overflow: "hidden", marginTop: "10px" }}>
      <div
        className="rs-bar-fill"
        style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "4px" }}
      />
    </div>
  );
}

function OverallBadge({ risk }) {
  const isHigh = ["high", "very_high"].includes(risk);
  const isMid  = risk === "moderate";
  const color  = isHigh ? "#F87171" : isMid ? "#FBBF24" : G.primary;
  const bg     = isHigh ? "rgba(248,113,113,0.10)" : isMid ? "rgba(251,191,36,0.10)" : G.primaryFaint;
  const border = isHigh ? "rgba(248,113,113,0.28)" : isMid ? "rgba(251,191,36,0.28)" : G.primaryBorder;

  return (
    <div style={{
      padding: "1rem 1.25rem",
      background: bg, borderRadius: "14px",
      border: `1px solid ${border}`,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      marginBottom: "1.2rem",
    }}>
      <div>
        <div style={{ fontSize: "0.7rem", fontWeight: 700, color: G.textMuted, textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: "4px" }}>
          Overall Risk
        </div>
        <div style={{ fontSize: "1.1rem", fontWeight: 700, color }}>
          {(risk || "low").replace("_", " ").toUpperCase()}
        </div>
      </div>
      <div style={{
        width: "44px", height: "44px", borderRadius: "50%",
        background: bg, border: `2px solid ${border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.3rem",
      }}
        className={isHigh ? "" : isMid ? "" : "rs-pulse"}
      >
        {isHigh ? "⚠️" : isMid ? "📊" : "✅"}
      </div>
    </div>
  );
}

export default function ResultScreen({ result, onReset, userEmail }) {
  // ✅ YAHAN HONA CHAHIYE — abhi missing hai
  const token    = useSelector((state) => state.auth.token);
  const authUser = useSelector((state) => state.auth.user);

  // ✅ Email — authUser se automatically lo
  const [email, setEmail] = useState("");
  
  // ✅ useEffect se email set karo
  useEffect(() => {
    const resolvedEmail = 
      typeof userEmail === "string" ? userEmail :
      userEmail?.email ||
      authUser?.email || "";
    setEmail(resolvedEmail);
  }, [userEmail, authUser]);

  const [sending,   setSending]   = useState(false);
  const [sent,      setSent]      = useState(false);
  const [showEmail, setShowEmail] = useState(false);

  const profile = result?.profile || {};
  const scores  = profile.riskScores || {};

  const handleSendEmail = async (emailToUse = email) => {
    if (!emailToUse) { alert("Email nahi mila!"); return; }
    if (!token) { alert("Login karke dobara try karo!"); return; }

    setSending(true);
    try {
      const res = await fetch("https://healthguide-backend.onrender.com/api/health/send-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({
          profileId:      profile._id,
          recipientEmail: emailToUse,
        }),
      });
      const data = await res.json();
      if (data.success) { setSent(true); setShowEmail(false); }
      else alert(data.message || "Email sending failed");
    } catch (err) {
      alert("Network error: " + err.message);
    } finally {
      setSending(false);
    }
  };
  return (
    <div className="rs-page" style={{
      minHeight: "100vh",
      background: G.bg,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2rem 1.2rem", position: "relative",
    }}>
      <GlobalStyles />

      {/* Background blobs */}
      <div className="rs-blob" style={{
        position: "fixed", top: "-15%", left: "-8%",
        width: "70%", height: "70%",
        background: "radial-gradient(circle, rgba(34,197,94,0.09) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none", zIndex: 0,
      }} />
      <div className="rs-blob" style={{
        position: "fixed", bottom: "-15%", right: "-8%",
        width: "70%", height: "70%",
        background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(90px)", pointerEvents: "none", zIndex: 0,
        animationDelay: "1.5s",
      }} />

      {/* Card */}
      <div className="rs-card" style={{
        width: "100%", maxWidth: "500px",
        background: G.card,
        backdropFilter: "blur(16px)",
        border: `1px solid ${G.primaryBorder}`,
        borderRadius: "28px",
        padding: "2.2rem 2rem",
        boxShadow: "0 28px 50px rgba(0,0,0,0.65), inset 0 1px 0 rgba(34,197,94,0.05)",
        position: "relative", zIndex: 2,
      }}>

        {/* Top glow */}
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0, height: "100px",
          background: "linear-gradient(180deg, rgba(34,197,94,0.05) 0%, transparent 100%)",
          borderRadius: "28px 28px 0 0", pointerEvents: "none",
        }} />

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "1.75rem", position: "relative", zIndex: 1 }}>
          <div style={{
            width: "60px", height: "60px", borderRadius: "50%",
            background: G.primaryFaint, border: `2px solid ${G.primaryBorder}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "1.6rem", margin: "0 auto 1rem",
          }}>
            📊
          </div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: G.primaryFaint, border: `1px solid ${G.primaryBorder}`,
            padding: "3px 12px", borderRadius: "40px", marginBottom: "0.75rem",
          }}>
            <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: G.primary, display: "inline-block" }} />
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: G.primary, letterSpacing: "0.06em" }}>
              ASSESSMENT COMPLETE
            </span>
          </div>
          <h2 style={{ color: G.textPrimary, fontSize: "1.45rem", fontWeight: 700, margin: "0 0 0.3rem", letterSpacing: "-0.02em" }}>
            Your Risk Analysis
          </h2>
          <p style={{ color: G.textFaint, fontSize: "0.78rem", margin: 0 }}>
            Personalized health risk breakdown
          </p>
        </div>

        {/* Overall badge */}
        <div style={{ position: "relative", zIndex: 1 }}>
          <OverallBadge risk={scores.overallRisk} />
        </div>

        {/* Individual risk cards */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {RISK_META.map(({ key, label, icon }) => {
            const val = scores[key] ?? 0;
            const pct = Math.round(val * 100);
            return (
              <div key={key} className="rs-risk-card">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "1rem" }}>{icon}</span>
                    <span style={{ color: G.textPrimary, fontWeight: 600, fontSize: "0.88rem" }}>{label}</span>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span style={{
                      fontSize: "1rem", fontWeight: 700, color: getRiskColor(val),
                    }}>{pct}%</span>
                    <div style={{
                      fontSize: "0.68rem", fontWeight: 600, marginTop: "1px",
                      color: getRiskColor(val), opacity: 0.8,
                    }}>
                      {getLabel(val)}
                    </div>
                  </div>
                </div>
                <RiskBar value={val} />
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{ borderTop: `1px solid rgba(34,197,94,0.08)`, margin: "1.2rem 0", position: "relative", zIndex: 1 }} />

        {/* Email share section */}
        <div style={{ position: "relative", zIndex: 1 }}>
          {sent ? (
            <div style={{
              padding: "0.9rem 1rem",
              background: G.primaryFaint,
              borderRadius: "12px",
              border: `1px solid ${G.primaryBorder}`,
              display: "flex", alignItems: "center", gap: "10px",
              marginBottom: "0.9rem",
            }}>
              <span style={{ fontSize: "1.1rem" }}>✅</span>
              <div>
                <div style={{ color: G.primary, fontSize: "0.88rem", fontWeight: 700 }}>Report sent successfully!</div>
                <div style={{ color: G.textFaint, fontSize: "0.72rem", marginTop: "2px" }}>Check your inbox</div>
              </div>
            </div>
          ) : showEmail ? (
            <div style={{
              marginBottom: "0.9rem", padding: "1.1rem",
              background: "rgba(5,18,8,0.9)",
              borderRadius: "14px", border: `1px solid ${G.inputBorder}`,
            }}>
              <p style={{ color: G.textMuted, fontSize: "0.78rem", margin: "0 0 0.75rem", lineHeight: 1.5 }}>
                Enter the email address to send the report to:
              </p>
           <input
  className="rs-email-input"
  type="email"
  value={email}
  onChange={e => setEmail(e.target.value)}
  placeholder="example@gmail.com"
  // ✅ Yeh add karo — agar userEmail hai toh readonly
  readOnly={!!userEmail}
  style={{
    opacity: userEmail ? 0.75 : 1,
    cursor: userEmail ? "not-allowed" : "text",
  }}
/>
              <div style={{ display: "flex", gap: "8px" }}>
                <button className="rs-cancel-btn" onClick={() => setShowEmail(false)}>
                  Cancel
                </button>
               <button
  className="rs-btn-outline-green"
  style={{ marginBottom: "0.75rem" }}
  onClick={() => userEmail ? handleSendEmail(userEmail) : setShowEmail(true)}
  disabled={sending}
>
  {sending ? "📤 Sending..." : "📧 Share Report via Email"}
</button>
                 
              </div>
            </div>
          ) : (
            <button className="rs-btn-outline-green" style={{ marginBottom: "0.75rem" }} onClick={() => setShowEmail(true)}>
              📧 Share Report via Email
            </button>
          )}

          <button className="rs-btn-ghost" onClick={onReset}>
            🔄 New Assessment
          </button>
        </div>

        {/* Footer */}
        <p style={{
          textAlign: "center", fontSize: "0.65rem",
          color: G.textFaint, marginTop: "1.2rem",
          position: "relative", zIndex: 1,
        }}>
          🔒 Your data is encrypted and used only for health analysis
        </p>
      </div>
    </div>
  );
}