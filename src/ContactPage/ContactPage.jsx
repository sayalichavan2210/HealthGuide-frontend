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

export default function ContactPage() {
  const [form, setForm]       = useState(INITIAL);
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState(false);
  const [focused, setFocused] = useState("");
  const formRef               = useRef(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Name, email aur message required hai!"); return;
    }
    setLoading(true);
    try {
      const r = await fetch("http://localhost:5000/api/contact", {
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

  // ── Input style ───────────────────────────────────────
  const inp = (k) => ({
    width: "100%", padding: "0.85rem 1rem",
    background: focused === k ? "rgba(74,222,128,0.04)" : "rgba(255,255,255,0.03)",
    border: `1px solid ${focused === k ? "rgba(74,222,128,0.35)" : "rgba(255,255,255,0.07)"}`,
    borderRadius: "12px", color: "#fff", fontSize: "0.92rem",
    outline: "none", boxSizing: "border-box", fontFamily: "inherit",
    transition: "all 0.25s",
  });

  const label = {
    display: "block", fontSize: "0.68rem", fontWeight: 700,
    color: "rgba(255,255,255,0.35)", textTransform: "uppercase",
    letterSpacing: "0.1em", marginBottom: "0.45rem",
  };

  // ── Success screen ────────────────────────────────────
  if (done) return (
    <div style={page}>
      <Glow />
      <div style={{ ...card, textAlign: "center", padding: "4rem 2.5rem", animation: "fadeUp 0.6s ease" }}>
        <div style={{ width: "80px", height: "80px", margin: "0 auto 1.5rem", background: "rgba(74,222,128,0.08)", border: "2px solid rgba(74,222,128,0.3)", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "2rem", animation: "pop 0.5s cubic-bezier(0.34,1.56,0.64,1)" }}>✅</div>
        <h2 style={{ color: "#fff", fontSize: "1.8rem", fontWeight: 700, margin: "0 0 0.75rem", letterSpacing: "-0.02em" }}>Message Sent!</h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "0.95rem", lineHeight: 1.7, margin: "0 0 0.5rem" }}>
          Aapka message humein mil gaya hai. Confirmation email bhi bhej diya gaya.
        </p>
        <p style={{ color: "rgba(74,222,128,0.6)", fontSize: "0.82rem", margin: "0 0 2rem" }}>Hum 24–48 hours mein reply karenge.</p>

        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <button onClick={() => setDone(false)} style={btnOutline}>Send Another</button>
          <button onClick={() => window.location.href = "/home"} style={btnPrimary}>Go Home →</button>
        </div>
      </div>
      <Css />
    </div>
  );

  return (
    <div style={page}>
      <Glow />
      <div style={{ maxWidth: "980px", margin: "0 auto", padding: "3rem 1.25rem", position: "relative", zIndex: 1 }}>

        {/* Page header */}
        <div style={{ textAlign: "center", marginBottom: "3.5rem", animation: "fadeUp 0.5s ease" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 14px", background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.2)", borderRadius: "20px", marginBottom: "1.25rem" }}>
            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ADE80", boxShadow: "0 0 8px #4ADE80" }} />
            <span style={{ fontSize: "0.68rem", color: "#4ADE80", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>Get In Touch</span>
          </div>
          <h1 style={{ color: "#fff", fontSize: "clamp(2rem, 5vw, 3rem)", fontWeight: 700, margin: "0 0 1rem", letterSpacing: "-0.03em", lineHeight: 1.1 }}>
            Koi sawaal hai?<br />
            <span style={{ color: "#4ADE80" }}>Hum yahan hain.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.35)", fontSize: "1rem", maxWidth: "480px", margin: "0 auto", lineHeight: 1.7 }}>
            Health concerns ho ya technical issue — apna message bhejo. Hum jald hi reply karenge.
          </p>
        </div>

        {/* 2-col grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.6fr", gap: "1.5rem", alignItems: "start" }}>

          {/* LEFT — Info cards */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", animation: "fadeUp 0.5s ease 0.1s both" }}>
            {[
              { icon: "📧", label: "Email", value: "sayalic106@gmail.com", sub: "24–48 hrs mein reply" },
              { icon: "📍", label: "Location", value: "Pune, Maharashtra", sub: "India" },
              { icon: "⏰", label: "Working Hours", value: "Mon – Sat", sub: "9:00 AM – 6:00 PM IST" },
            ].map(({ icon, label: l, value, sub }) => (
              <div key={l} style={{ padding: "1.25rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", display: "flex", gap: "1rem", alignItems: "flex-start", transition: "border-color 0.2s" }}>
                <div style={{ width: "40px", height: "40px", background: "rgba(74,222,128,0.07)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: "10px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.1rem", flexShrink: 0 }}>{icon}</div>
                <div>
                  <p style={{ margin: "0 0 3px", fontSize: "0.68rem", color: "rgba(255,255,255,0.28)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em" }}>{l}</p>
                  <p style={{ margin: "0 0 2px", fontSize: "0.9rem", fontWeight: 600, color: "#e0e8f0" }}>{value}</p>
                  <p style={{ margin: 0, fontSize: "0.75rem", color: "rgba(255,255,255,0.3)" }}>{sub}</p>
                </div>
              </div>
            ))}

            {/* Response promise */}
            <div style={{ padding: "1.25rem", background: "rgba(74,222,128,0.04)", border: "1px solid rgba(74,222,128,0.15)", borderRadius: "14px" }}>
              <p style={{ margin: "0 0 8px", fontSize: "0.78rem", fontWeight: 700, color: "#4ADE80" }}>🛡️ Our Promise</p>
              <p style={{ margin: 0, fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>
                Aapka data secure hai. Hum kabhi spam nahi karte aur sirf reply ke liye contact karte hain.
              </p>
            </div>
          </div>

          {/* RIGHT — Form */}
          <div style={{ ...card, animation: "fadeUp 0.5s ease 0.2s both" }}>
            <div style={{ marginBottom: "1.75rem" }}>
              <h2 style={{ color: "#fff", fontSize: "1.25rem", fontWeight: 700, margin: "0 0 4px", letterSpacing: "-0.01em" }}>Send a Message</h2>
              <p style={{ color: "rgba(255,255,255,0.3)", fontSize: "0.82rem", margin: 0 }}>Hum personally review karke reply karenge</p>
            </div>

            <form ref={formRef} onSubmit={handleSubmit}>
              {/* Name + Email */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div>
                  <label style={label}>Full Name *</label>
                  <input type="text" placeholder="Sayali Chavan" style={inp("name")}
                    value={form.name} onChange={e => set("name", e.target.value)}
                    onFocus={() => setFocused("name")} onBlur={() => setFocused("")} />
                </div>
                <div>
                  <label style={label}>Email *</label>
                  <input type="email" placeholder="you@example.com" style={inp("email")}
                    value={form.email} onChange={e => set("email", e.target.value)}
                    onFocus={() => setFocused("email")} onBlur={() => setFocused("")} />
                </div>
              </div>

              {/* Phone + Subject */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <div>
                  <label style={label}>Phone (optional)</label>
                  <input type="tel" placeholder="+91 98765 43210" style={inp("phone")}
                    value={form.phone} onChange={e => set("phone", e.target.value)}
                    onFocus={() => setFocused("phone")} onBlur={() => setFocused("")} />
                </div>
                <div>
                  <label style={label}>Subject</label>
                  <select style={{ ...inp("subject"), cursor: "pointer" }}
                    value={form.subject} onChange={e => set("subject", e.target.value)}
                    onFocus={() => setFocused("subject")} onBlur={() => setFocused("")}>
                    <option value="">Select subject</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Message */}
              <div style={{ marginBottom: "1.5rem" }}>
                <label style={label}>Message *</label>
                <textarea placeholder="Apna sawaal ya concern yahan likhein..." rows={5}
                  style={{ ...inp("message"), resize: "vertical", minHeight: "120px", lineHeight: 1.6 }}
                  value={form.message} onChange={e => set("message", e.target.value)}
                  onFocus={() => setFocused("message")} onBlur={() => setFocused("")} />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "4px" }}>
                  <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.2)" }}>{form.message.length}/1000</span>
                </div>
              </div>

              {/* Submit */}
              <button type="submit" disabled={loading} style={{
                width: "100%", padding: "1rem",
                background: loading ? "rgba(74,222,128,0.4)" : "#4ADE80",
                border: "none", borderRadius: "12px", color: "#000",
                fontSize: "0.95rem", fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "inherit", transition: "all 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
              }}>
                {loading ? (
                  <>
                    <div style={{ width: "16px", height: "16px", border: "2px solid rgba(0,0,0,0.3)", borderTopColor: "#000", borderRadius: "50%", animation: "spin 0.7s linear infinite" }} />
                    Sending...
                  </>
                ) : "📨 Send Message"}
              </button>

              <p style={{ textAlign: "center", fontSize: "0.72rem", color: "rgba(255,255,255,0.2)", marginTop: "1rem", lineHeight: 1.6 }}>
                Submit karte hi aapko aur humein dono ko email milega. 🔒 Data secure hai.
              </p>
            </form>
          </div>
        </div>

        {/* FAQ section */}
        <div style={{ marginTop: "3rem", animation: "fadeUp 0.5s ease 0.3s both" }}>
          <h2 style={{ color: "#fff", fontSize: "1.3rem", fontWeight: 700, margin: "0 0 1.25rem", textAlign: "center", letterSpacing: "-0.01em" }}>
            Frequently Asked Questions
          </h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem" }}>
            {[
              ["Kya assessment free hai?", "Haan, basic health risk assessment bilkul free hai. Koi hidden charges nahi."],
              ["Mera data safe hai?", "Haan, aapka data encrypted aur secure hai. Hum kabhi third-party ko share nahi karte."],
              ["Doctor replace kar sakta hai?", "Nahi, ye sirf informational tool hai. Medical decisions ke liye doctor se milein."],
              ["Reply kitne time mein milega?", "Hum typically 24-48 working hours mein reply karte hain."],
            ].map(([q, a]) => (
              <div key={q} style={{ padding: "1.25rem", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "12px" }}>
                <p style={{ margin: "0 0 8px", fontSize: "0.85rem", fontWeight: 600, color: "#c8d8f0" }}>❓ {q}</p>
                <p style={{ margin: 0, fontSize: "0.8rem", color: "rgba(255,255,255,0.4)", lineHeight: 1.6 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
      <Css />
    </div>
  );
}

// ── Sub-components ────────────────────────────────────────
const Glow = () => (
  <>
    <div style={{ position:"fixed", top:"-10%", left:"-5%", width:"500px", height:"500px", background:"radial-gradient(circle, rgba(74,222,128,0.04) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />
    <div style={{ position:"fixed", bottom:"-10%", right:"-5%", width:"400px", height:"400px", background:"radial-gradient(circle, rgba(74,222,128,0.025) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />
  </>
);

const Css = () => (
  <style>{`
    @keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
    @keyframes pop    { 0%{transform:scale(0)} 70%{transform:scale(1.1)} 100%{transform:scale(1)} }
    @keyframes spin   { to { transform:rotate(360deg); } }
    textarea::placeholder, input::placeholder { color:rgba(255,255,255,0.2); }
    select option { background:#0d1225; color:#fff; }
    @media (max-width:680px) {
      div[style*="gridTemplateColumns: 1fr 1.6fr"] { grid-template-columns:1fr !important; }
      div[style*="gridTemplateColumns: 1fr 1fr"]   { grid-template-columns:1fr !important; }
    }
  `}</style>
);

// ── Shared styles ─────────────────────────────────────────
const page = {
  minHeight: "100vh",
  background: "#080c18",
  fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
  color: "#fff",
  position: "relative",
  overflow: "hidden",
};

const card = {
  background: "rgba(13,18,37,0.95)",
  border: "1px solid rgba(255,255,255,0.07)",
  borderRadius: "18px",
  padding: "2rem",
  boxShadow: "0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.04)",
};

const btnPrimary = {
  padding: "0.75rem 1.5rem",
  background: "#4ADE80", border: "none",
  borderRadius: "10px", color: "#000",
  fontSize: "0.88rem", fontWeight: 700,
  cursor: "pointer", fontFamily: "inherit",
};

const btnOutline = {
  padding: "0.75rem 1.5rem",
  background: "rgba(255,255,255,0.05)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: "10px", color: "rgba(255,255,255,0.6)",
  fontSize: "0.88rem", cursor: "pointer", fontFamily: "inherit",
};