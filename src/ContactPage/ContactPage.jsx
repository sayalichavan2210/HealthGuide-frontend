import { useState, useRef } from "react";
import toast from "react-hot-toast";

const SUBJECTS = [
  "General Inquiry",
  "Technical Support",
  "Health Assessment Query",
  "Report Issue",
  "Partnership",
  "Other",
];

const INITIAL = { name: "", email: "", phone: "", subject: "", message: "" };

// ── Green theme tokens ─────────────────────────────────────
const G = {
  primary:       "#22C55E",
  primaryMid:    "#16A34A",
  primaryDeep:   "#15803D",
  primaryFaint:  "rgba(34,197,94,0.07)",
  primaryBorder: "rgba(34,197,94,0.22)",
  primaryGlow:   "rgba(34,197,94,0.12)",
  bg:            "#050A05",
  card:          "rgba(6,14,6,0.95)",
  inputBg:       "rgba(5,20,8,0.9)",
  inputBorder:   "rgba(34,197,94,0.15)",
  textPrimary:   "#DCFCE7",
  textMuted:     "#4A8A5A",
  textFaint:     "#2A5A32",
};

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Syne:wght@700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .cp-page {
      min-height: 100vh;
      background: ${G.bg};
      font-family: 'DM Sans', sans-serif;
      color: ${G.textPrimary};
      position: relative;
      overflow-x: hidden;
    }

    /* blobs */
    @keyframes cpFloat {
      0%   { transform: translate(0,0) scale(1); }
      100% { transform: translate(3%,3%) scale(1.06); }
    }
    .cp-blob { animation: cpFloat 14s infinite alternate ease-in-out; will-change: transform; }

    /* fade-up stagger */
    @keyframes cpFadeUp {
      from { opacity: 0; transform: translateY(22px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .cp-f0 { animation: cpFadeUp 0.55s ease both; }
    .cp-f1 { animation: cpFadeUp 0.55s ease 0.1s both; }
    .cp-f2 { animation: cpFadeUp 0.55s ease 0.18s both; }
    .cp-f3 { animation: cpFadeUp 0.55s ease 0.26s both; }

    /* pop */
    @keyframes cpPop {
      0%   { transform: scale(0.6); opacity: 0; }
      70%  { transform: scale(1.08); }
      100% { transform: scale(1); opacity: 1; }
    }
    .cp-pop { animation: cpPop 0.55s cubic-bezier(0.34,1.56,0.64,1) both; }

    @keyframes cpSpin { to { transform: rotate(360deg); } }
    .cp-spin { animation: cpSpin 0.75s linear infinite; }

    @keyframes cpBlink {
      0%,100% { opacity: 1; }
      50%      { opacity: 0.3; }
    }
    .cp-blink { animation: cpBlink 1.6s ease-in-out infinite; }

    /* inputs */
    .cp-input, .cp-select, .cp-textarea {
      width: 100%;
      padding: 0.85rem 1rem;
      background: ${G.inputBg};
      border: 1px solid ${G.inputBorder};
      border-radius: 12px;
      color: ${G.textPrimary};
      font-size: 0.9rem;
      outline: none;
      font-family: 'DM Sans', sans-serif;
      transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
    }
    .cp-input::placeholder,
    .cp-textarea::placeholder { color: ${G.textFaint}; }
    .cp-input:focus,
    .cp-select:focus,
    .cp-textarea:focus {
      border-color: ${G.primary};
      box-shadow: 0 0 0 3px rgba(34,197,94,0.10);
      background: rgba(34,197,94,0.04);
    }
    .cp-select { cursor: pointer; appearance: none; }
    .cp-select option { background: #060E06; color: ${G.textPrimary}; }
    .cp-textarea { resize: vertical; min-height: 130px; line-height: 1.65; }

    /* info card hover */
    .cp-info-card {
      transition: border-color 0.2s, transform 0.2s;
    }
    .cp-info-card:hover {
      border-color: rgba(34,197,94,0.3) !important;
      transform: translateY(-2px);
    }

    /* FAQ card hover */
    .cp-faq-card {
      transition: border-color 0.2s, background 0.2s;
    }
    .cp-faq-card:hover {
      border-color: rgba(34,197,94,0.25) !important;
      background: rgba(34,197,94,0.04) !important;
    }

    /* submit btn */
    .cp-submit {
      width: 100%;
      padding: 1rem;
      background: linear-gradient(90deg, ${G.primaryDeep}, ${G.primaryMid}, ${G.primary});
      border: none; border-radius: 12px;
      color: #F0FFF4; font-size: 0.95rem; font-weight: 700;
      cursor: pointer; font-family: 'DM Sans', sans-serif;
      transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
      display: flex; align-items: center; justify-content: center; gap: 8px;
      box-shadow: 0 4px 16px rgba(34,197,94,0.22);
      letter-spacing: 0.01em;
    }
    .cp-submit:hover:not(:disabled) {
      opacity: 0.88;
      transform: translateY(-2px);
      box-shadow: 0 10px 26px rgba(34,197,94,0.3);
    }
    .cp-submit:disabled { opacity: 0.6; cursor: not-allowed; }

    .cp-btn-outline {
      padding: 0.78rem 1.6rem;
      background: rgba(5,20,8,0.9);
      border: 1px solid ${G.inputBorder};
      border-radius: 40px;
      color: ${G.textMuted}; font-size: 0.88rem; font-weight: 600;
      cursor: pointer; font-family: 'DM Sans', sans-serif;
      transition: all 0.2s;
    }
    .cp-btn-outline:hover { border-color: ${G.primary}; color: ${G.primary}; transform: translateY(-1px); }

    .cp-btn-primary {
      padding: 0.78rem 1.6rem;
      background: linear-gradient(90deg, ${G.primaryDeep}, ${G.primary});
      border: none; border-radius: 40px;
      color: #F0FFF4; font-size: 0.88rem; font-weight: 700;
      cursor: pointer; font-family: 'DM Sans', sans-serif;
      transition: all 0.2s;
      box-shadow: 0 4px 14px rgba(34,197,94,0.22);
    }
    .cp-btn-primary:hover { opacity: 0.88; transform: translateY(-1px); }

    /* label */
    .cp-label {
      display: block;
      font-size: 0.68rem; font-weight: 700;
      color: ${G.textMuted}; text-transform: uppercase;
      letter-spacing: 0.09em; margin-bottom: 0.45rem;
    }

    /* select arrow wrapper */
    .cp-select-wrap { position: relative; }
    .cp-select-wrap::after {
      content: '▾';
      position: absolute; right: 12px; top: 50%;
      transform: translateY(-50%);
      color: ${G.textMuted}; pointer-events: none; font-size: 12px;
    }

    /* char count */
    .cp-charcount {
      display: flex; justify-content: flex-end;
      margin-top: 5px; font-size: 0.68rem; color: ${G.textFaint};
    }

    @media (max-width: 700px) {
      .cp-grid-main  { grid-template-columns: 1fr !important; }
      .cp-grid-2col  { grid-template-columns: 1fr !important; }
      .cp-grid-faq   { grid-template-columns: 1fr !important; }
    }
  `}</style>
);

// ── Sub-components ─────────────────────────────────────────
const LiveDot = () => (
  <span className="cp-blink" style={{
    width: 7, height: 7, borderRadius: "50%",
    background: G.primary,
    boxShadow: `0 0 8px ${G.primary}`,
    display: "inline-block", flexShrink: 0,
  }} />
);

const SectionDivider = ({ label }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "1.75rem 0 1.5rem" }}>
    <div style={{ flex: 1, height: 1, background: "rgba(34,197,94,0.08)" }} />
    <span style={{ fontSize: "0.65rem", fontWeight: 700, color: G.textFaint, letterSpacing: "0.1em", textTransform: "uppercase", whiteSpace: "nowrap" }}>{label}</span>
    <div style={{ flex: 1, height: 1, background: "rgba(34,197,94,0.08)" }} />
  </div>
);

const InfoCard = ({ icon, label, value, sub }) => (
  <div className="cp-info-card" style={{
    padding: "1.1rem 1.25rem",
    background: G.card,
    border: `1px solid ${G.primaryBorder}`,
    borderRadius: 16,
    display: "flex", gap: "1rem", alignItems: "flex-start",
    backdropFilter: "blur(10px)",
  }}>
    <div style={{
      width: 42, height: 42, flexShrink: 0,
      background: G.primaryFaint, border: `1px solid ${G.primaryBorder}`,
      borderRadius: 12,
      display: "flex", alignItems: "center", justifyContent: "center",
      fontSize: "1.1rem",
    }}>{icon}</div>
    <div>
      <p style={{ margin: "0 0 3px", fontSize: "0.65rem", fontWeight: 700, color: G.textFaint, textTransform: "uppercase", letterSpacing: "0.09em" }}>{label}</p>
      <p style={{ margin: "0 0 2px", fontSize: "0.9rem", fontWeight: 600, color: G.textPrimary }}>{value}</p>
      <p style={{ margin: 0, fontSize: "0.75rem", color: G.textMuted }}>{sub}</p>
    </div>
  </div>
);

// ── Main Component ─────────────────────────────────────────
export default function ContactPage() {
  const [form,    setForm]    = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [done,    setDone]    = useState(false);
  const formRef               = useRef(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("name email & message is required"); return;
    }
    setLoading(true);
    try {
      const r = await fetch(`${import.meta.env.VITE_API_URL}/api/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (d.success) { setDone(true); setForm(INITIAL); }
      else toast.error(d.message || "Something went wrong");
    } catch { toast.error("Network error. Try again."); }
    finally { setLoading(false); }
  };

  // ── Success screen ────────────────────────────────────────
  if (done) return (
    <div className="cp-page">
      <GlobalStyles />
      <Blobs />
      <div style={{
        minHeight: "100vh",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "2rem",
      }}>
        <div className="cp-pop" style={{
          background: G.card,
          border: `1px solid ${G.primaryBorder}`,
          borderRadius: 28,
          padding: "4rem 3rem",
          maxWidth: 480, width: "100%",
          textAlign: "center",
          backdropFilter: "blur(16px)",
          boxShadow: "0 40px 80px rgba(0,0,0,0.6), inset 0 1px 0 rgba(34,197,94,0.05)",
        }}>
          {/* Top glow */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 100,
            background: "linear-gradient(180deg, rgba(34,197,94,0.06) 0%, transparent 100%)",
            borderRadius: "28px 28px 0 0", pointerEvents: "none",
          }} />
          <div style={{
            width: 80, height: 80, margin: "0 auto 1.5rem",
            background: G.primaryFaint, border: `2px solid ${G.primaryBorder}`,
            borderRadius: "50%",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2rem",
            position: "relative",
          }}>✅</div>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            background: G.primaryFaint, border: `1px solid ${G.primaryBorder}`,
            padding: "3px 12px", borderRadius: 40, marginBottom: "1rem",
          }}>
            <LiveDot />
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: G.primary, letterSpacing: "0.08em" }}>MESSAGE DELIVERED</span>
          </div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", color: G.textPrimary, fontSize: "2rem", fontWeight: 800, margin: "0 0 0.75rem", letterSpacing: "-0.02em" }}>
            Message Sent!
          </h2>
          <p style={{ color: G.textMuted, fontSize: "0.92rem", lineHeight: 1.7, margin: "0 0 0.4rem" }}>
            Your message has been received. A confirmation email has been sent to you.
          </p>
          <p style={{ color: G.primary, fontSize: "0.8rem", margin: "0 0 2.25rem", opacity: 0.8 }}>
            We'll get back to you within 24–48 hours.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
            <button className="cp-btn-outline" onClick={() => setDone(false)}>Send Another</button>
            <button className="cp-btn-primary" onClick={() => window.location.href = "/home"}>Go Home →</button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="cp-page">
      <GlobalStyles />
      <Blobs />

      <div style={{ maxWidth: 1020, margin: "0 auto", padding: "3.5rem 1.5rem", position: "relative", zIndex: 2 }}>

        {/* ── Page Header ──────────────────────────────── */}
        <div className="cp-f0" style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "5px 14px",
            background: G.primaryFaint, border: `1px solid ${G.primaryBorder}`,
            borderRadius: 40, marginBottom: "1.4rem",
          }}>
            <LiveDot />
            <span style={{ fontSize: "0.68rem", fontWeight: 700, color: G.primary, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Get In Touch
            </span>
          </div>

          <h1 style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
            fontWeight: 800,
            color: G.textPrimary,
            margin: "0 0 1rem",
            letterSpacing: "-0.03em",
            lineHeight: 1.1,
          }}>
            Have a question?<br />
            <span style={{
              background: `linear-gradient(135deg, ${G.primary}, ${G.primaryMid})`,
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>We're here to help.</span>
          </h1>
          <p style={{ color: G.textMuted, fontSize: "0.98rem", maxWidth: 460, margin: "0 auto", lineHeight: 1.75 }}>
            Whether it's a health concern or a technical issue — send us a message and we'll get back to you shortly.
          </p>
        </div>

        {/* ── Main 2-col grid ───────────────────────────── */}
        <div className="cp-grid-main" style={{ display: "grid", gridTemplateColumns: "1fr 1.65fr", gap: "1.5rem", alignItems: "start" }}>

          {/* LEFT — Info panel */}
          <div className="cp-f1" style={{ display: "flex", flexDirection: "column", gap: "0.8rem" }}>

            <InfoCard icon="📧" label="Email" value="healthguard@org.com" sub="Reply within 24–48 hrs" />
            <InfoCard icon="📍" label="Location" value="Pune, Maharashtra" sub="India" />
            <InfoCard icon="⏰" label="Working Hours" value="Mon – Sat" sub="9:00 AM – 6:00 PM IST" />

            {/* Promise card */}
            <div style={{
              padding: "1.2rem 1.25rem",
              background: G.primaryFaint,
              border: `1px solid ${G.primaryBorder}`,
              borderRadius: 16,
              position: "relative", overflow: "hidden",
            }}>
              <div style={{
                position: "absolute", top: -20, right: -20, width: 80, height: 80,
                background: "radial-gradient(circle, rgba(34,197,94,0.15) 0%, transparent 70%)",
                borderRadius: "50%",
              }} />
              <p style={{ margin: "0 0 8px", fontSize: "0.8rem", fontWeight: 700, color: G.primary, display: "flex", alignItems: "center", gap: 6 }}>
                <span>🛡️</span> Our Promise
              </p>
              <p style={{ margin: 0, fontSize: "0.8rem", color: G.textMuted, lineHeight: 1.65 }}>
                Your data is fully secure. We never spam and only contact you to respond to your inquiry.
              </p>
            </div>

            {/* Quick stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.6rem" }}>
              {[
                { num: "< 48h", label: "Response Time" },
                { num: "100%", label: "Data Secure" },
              ].map(({ num, label }) => (
                <div key={label} style={{
                  padding: "1rem",
                  background: G.card,
                  border: `1px solid ${G.primaryBorder}`,
                  borderRadius: 12, textAlign: "center",
                  backdropFilter: "blur(8px)",
                }}>
                  <div style={{ fontSize: "1.3rem", fontWeight: 700, color: G.primary, fontFamily: "'Syne', sans-serif" }}>{num}</div>
                  <div style={{ fontSize: "0.68rem", fontWeight: 600, color: G.textFaint, marginTop: 3, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Form card */}
          <div className="cp-f2" style={{
            background: G.card,
            border: `1px solid ${G.primaryBorder}`,
            borderRadius: 24,
            padding: "2.25rem 2rem",
            backdropFilter: "blur(16px)",
            boxShadow: "0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(34,197,94,0.05)",
            position: "relative", overflow: "hidden",
          }}>
            {/* corner glow */}
            <div style={{
              position: "absolute", top: 0, left: 0, right: 0, height: 100,
              background: "linear-gradient(180deg, rgba(34,197,94,0.05) 0%, transparent 100%)",
              borderRadius: "24px 24px 0 0", pointerEvents: "none",
            }} />

            <div style={{ marginBottom: "1.75rem", position: "relative" }}>
              <h2 style={{
                fontFamily: "'Syne', sans-serif",
                color: G.textPrimary, fontSize: "1.3rem", fontWeight: 800,
                margin: "0 0 5px", letterSpacing: "-0.01em",
              }}>Send a Message</h2>
              <p style={{ color: G.textFaint, fontSize: "0.82rem", margin: 0 }}>
                We personally review every message and respond promptly
              </p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit} style={{ position: "relative" }}>

              {/* Name + Email */}
              <div className="cp-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div>
                  <label className="cp-label">Full Name *</label>
                  <input className="cp-input" type="text" placeholder="Sayali Chavan"
                    value={form.name} onChange={e => set("name", e.target.value)} />
                </div>
                <div>
                  <label className="cp-label">Email *</label>
                  <input className="cp-input" type="email" placeholder="you@example.com"
                    value={form.email} onChange={e => set("email", e.target.value)} />
                </div>
              </div>

              {/* Phone + Subject */}
              <div className="cp-grid-2col" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div>
                  <label className="cp-label">Phone (optional)</label>
                  <input className="cp-input" type="tel" placeholder="+91 98765 43210"
                    value={form.phone} onChange={e => set("phone", e.target.value)} />
                </div>
                <div>
                  <label className="cp-label">Subject</label>
                  <div className="cp-select-wrap">
                    <select className="cp-select cp-input"
                      value={form.subject} onChange={e => set("subject", e.target.value)}>
                      <option value="">Select subject</option>
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Message */}
              <div style={{ marginBottom: "1.6rem" }}>
                <label className="cp-label">Message *</label>
                <textarea className="cp-textarea"
                  placeholder="Write your question or concern here..."
                  value={form.message} onChange={e => set("message", e.target.value.slice(0, 1000))} />
                <div className="cp-charcount">
                  <span style={{ color: form.message.length > 900 ? G.primary : G.textFaint }}>
                    {form.message.length} / 1000
                  </span>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} className="cp-submit">
                {loading ? (
                  <>
                    <span className="cp-spin" style={{
                      width: 16, height: 16,
                      border: "2px solid rgba(240,255,244,0.3)",
                      borderTopColor: "#F0FFF4",
                      borderRadius: "50%", display: "inline-block",
                    }} />
                    Sending...
                  </>
                ) : (
                  <>📨 Send Message</>
                )}
              </button>

              <p style={{ textAlign: "center", fontSize: "0.7rem", color: G.textFaint, marginTop: "1rem", lineHeight: 1.6 }}>
                🔒 You'll receive a confirmation email upon submission. Your data is fully secure.
              </p>
            </form>
          </div>
        </div>

        {/* ── FAQ section ───────────────────────────────── */}
        <div className="cp-f3" style={{ marginTop: "3.5rem" }}>
          <SectionDivider label="Frequently Asked Questions" />

          <div className="cp-grid-faq" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {[
              ["Is the assessment free?",        "Yes, the basic health risk assessment is completely free. No hidden charges."],
              ["Is my data safe?",                "Yes, your data is encrypted and secure. We never share it with any third party."],
              ["Can it replace a doctor?",        "No, this is an informational tool only. Always consult a doctor for medical decisions."],
              ["How soon will I get a reply?",    "We typically respond within 24–48 working hours."],
            ].map(([q, a]) => (
              <div key={q} className="cp-faq-card" style={{
                padding: "1.3rem 1.4rem",
                background: G.card,
                border: `1px solid ${G.primaryBorder}`,
                borderRadius: 16,
                backdropFilter: "blur(8px)",
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 8 }}>
                  <span style={{ color: G.primary, fontSize: "0.9rem", flexShrink: 0, marginTop: 1 }}>❓</span>
                  <p style={{ margin: 0, fontSize: "0.88rem", fontWeight: 600, color: G.textPrimary, lineHeight: 1.45 }}>{q}</p>
                </div>
                <p style={{ margin: 0, fontSize: "0.8rem", color: G.textMuted, lineHeight: 1.65, paddingLeft: "1.35rem" }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Background blobs ──────────────────────────────────────
const Blobs = () => (
  <>
    <div className="cp-blob" style={{
      position: "fixed", top: "-12%", left: "-6%",
      width: "55%", height: "55%",
      background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)",
      borderRadius: "50%", filter: "blur(80px)",
      pointerEvents: "none", zIndex: 0,
    }} />
    <div className="cp-blob" style={{
      position: "fixed", bottom: "-12%", right: "-6%",
      width: "55%", height: "55%",
      background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)",
      borderRadius: "50%", filter: "blur(90px)",
      pointerEvents: "none", zIndex: 0,
      animationDelay: "1.8s",
    }} />
    <div style={{
      position: "fixed", top: "50%", left: "50%",
      transform: "translate(-50%,-50%)",
      width: "40%", height: "40%",
      background: "radial-gradient(circle, rgba(34,197,94,0.03) 0%, transparent 70%)",
      borderRadius: "50%", filter: "blur(100px)",
      pointerEvents: "none", zIndex: 0,
    }} />
  </>
);