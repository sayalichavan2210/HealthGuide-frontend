import { useEffect, useRef, useState } from "react";

// ── Green theme tokens ─────────────────────────────────────
const G = {
  primary:       "#22C55E",
  primaryMid:    "#16A34A",
  primaryDeep:   "#15803D",
  primaryFaint:  "rgba(34,197,94,0.07)",
  primaryBorder: "rgba(34,197,94,0.20)",
  primaryGlow:   "rgba(34,197,94,0.12)",
  bg:            "#050A05",
  card:          "rgba(6,14,6,0.95)",
  cardBorder:    "rgba(34,197,94,0.15)",
  inputBg:       "rgba(5,20,8,0.9)",
  textPrimary:   "#DCFCE7",
  textMuted:     "#4A8A5A",
  textFaint:     "#2A5A32",
  textSub:       "#6AAA7A",
};

// ── Animated counter hook ──────────────────────────────────
function useCounter(target, duration = 2000) {
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStarted(true); },
      { threshold: 0.3 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);

  return { count, ref };
}

// ── Global styles ──────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=DM+Sans:wght@300;400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .au-page {
      min-height: 100vh;
      background: ${G.bg};
      font-family: 'DM Sans', sans-serif;
      color: ${G.textPrimary};
      overflow-x: hidden;
    }

    @keyframes auFadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes auFloat {
      0%,100% { transform: translateY(0px); }
      50%      { transform: translateY(-10px); }
    }
    @keyframes auBlob {
      0%   { transform: translate(0,0) scale(1); }
      100% { transform: translate(3%,3%) scale(1.06); }
    }
    @keyframes auBlink {
      0%,100% { opacity:1; }
      50%      { opacity:0.3; }
    }
    @keyframes auPulse {
      0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.4); }
      50%      { box-shadow: 0 0 0 8px rgba(34,197,94,0); }
    }

    .au-f0 { animation: auFadeUp 0.6s ease both; }
    .au-f1 { animation: auFadeUp 0.6s ease 0.1s both; }
    .au-f2 { animation: auFadeUp 0.6s ease 0.2s both; }
    .au-f3 { animation: auFadeUp 0.6s ease 0.3s both; }
    .au-f4 { animation: auFadeUp 0.6s ease 0.4s both; }

    .au-blob { animation: auBlob 14s infinite alternate ease-in-out; }
    .au-blink { animation: auBlink 1.6s ease-in-out infinite; }
    .au-float { animation: auFloat 5s ease-in-out infinite; }

    .au-stat-card {
      background: ${G.card};
      border: 1px solid ${G.cardBorder};
      border-radius: 18px;
      padding: 1.5rem;
      position: relative;
      overflow: hidden;
      backdrop-filter: blur(12px);
      transition: border-color 0.2s, transform 0.2s;
    }
    .au-stat-card:hover { border-color: rgba(34,197,94,0.35); transform: translateY(-3px); }

    .au-team-card {
      background: ${G.card};
      border: 1px solid ${G.cardBorder};
      border-radius: 18px;
      padding: 1.5rem;
      backdrop-filter: blur(12px);
      transition: border-color 0.25s, transform 0.25s;
    }
    .au-team-card:hover { border-color: rgba(34,197,94,0.35); transform: translateY(-3px); }

    .au-value-card {
      display: flex; gap: 1rem;
      padding: 1.25rem 1.4rem;
      background: ${G.card};
      border: 1px solid ${G.cardBorder};
      border-radius: 16px;
      backdrop-filter: blur(10px);
      transition: border-color 0.2s, background 0.2s;
    }
    .au-value-card:hover { border-color: rgba(34,197,94,0.3); background: rgba(34,197,94,0.04); }

    .au-icon-chip {
      display: flex; flex-direction: column; align-items: center; gap: 8px;
      padding: 1.1rem 1.3rem;
      background: ${G.card};
      border: 1px solid ${G.cardBorder};
      border-radius: 18px;
      backdrop-filter: blur(10px);
      transition: border-color 0.2s, transform 0.3s;
    }
    .au-icon-chip:hover { border-color: rgba(34,197,94,0.35); }

    .au-btn-primary {
      padding: 0.85rem 1.75rem;
      background: linear-gradient(90deg, ${G.primaryDeep}, ${G.primaryMid}, ${G.primary});
      border: none; border-radius: 40px;
      color: #F0FFF4; font-size: 0.9rem; font-weight: 700;
      cursor: pointer; font-family: 'DM Sans', sans-serif;
      box-shadow: 0 4px 16px rgba(34,197,94,0.22);
      transition: opacity 0.2s, transform 0.15s;
      letter-spacing: 0.01em;
    }
    .au-btn-primary:hover { opacity: 0.88; transform: translateY(-2px); }

    .au-btn-ghost {
      padding: 0.85rem 1.75rem;
      background: rgba(5,20,8,0.9);
      border: 1px solid ${G.cardBorder};
      border-radius: 40px;
      color: ${G.textMuted}; font-size: 0.9rem; font-weight: 600;
      cursor: pointer; font-family: 'DM Sans', sans-serif;
      transition: border-color 0.2s, color 0.2s, transform 0.15s;
    }
    .au-btn-ghost:hover { border-color: ${G.primary}; color: ${G.primary}; transform: translateY(-2px); }

    .au-section-label {
      font-size: 0.65rem; font-weight: 700; letter-spacing: 0.12em;
      text-transform: uppercase; color: ${G.textFaint};
      display: flex; align-items: center; gap: 8px;
      margin-bottom: 0.75rem;
    }
    .au-section-label::before, .au-section-label::after {
      content: ''; flex: 0 0 24px; height: 1px;
      background: rgba(34,197,94,0.25);
    }

    .au-divider { height: 1px; background: rgba(34,197,94,0.08); margin: 0; }

    @media (max-width: 768px) {
      .au-hero-grid   { grid-template-columns: 1fr !important; }
      .au-stats-grid  { grid-template-columns: 1fr 1fr !important; }
      .au-team-grid   { grid-template-columns: 1fr !important; }
      .au-values-grid { grid-template-columns: 1fr !important; }
      .au-chips-row   { flex-wrap: wrap !important; }
    }
  `}</style>
);

// ── Sub-components ─────────────────────────────────────────
const LiveDot = () => (
  <span className="au-blink" style={{
    width: 6, height: 6, borderRadius: "50%",
    background: G.primary, boxShadow: `0 0 6px ${G.primary}`,
    display: "inline-block", flexShrink: 0,
  }} />
);

const Badge = ({ children }) => (
  <div style={{
    display: "inline-flex", alignItems: "center", gap: 7,
    padding: "5px 14px",
    background: G.primaryFaint, border: `1px solid ${G.primaryBorder}`,
    borderRadius: 40, marginBottom: "1.2rem",
  }}>
    <LiveDot />
    <span style={{ fontSize: "0.68rem", fontWeight: 700, color: G.primary, letterSpacing: "0.12em", textTransform: "uppercase" }}>
      {children}
    </span>
  </div>
);

function StatCard({ value, suffix, label, icon, delay }) {
  const { count, ref } = useCounter(value, 2000);
  return (
    <div ref={ref} className="au-stat-card" style={{ animationDelay: `${delay}ms` }}>
      <div style={{
        position: "absolute", top: -20, right: -20, width: 80, height: 80,
        background: "radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%)",
        borderRadius: "50%",
      }} />
      <div style={{
        width: 40, height: 40, borderRadius: 12, marginBottom: "1rem",
        background: G.primaryFaint, border: `1px solid ${G.primaryBorder}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: "1.2rem",
      }}>{icon}</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 2, marginBottom: 4 }}>
        <span style={{ fontSize: "2.2rem", fontWeight: 800, color: G.textPrimary, fontFamily: "'Syne', sans-serif", lineHeight: 1 }}>
          {count.toLocaleString()}
        </span>
        <span style={{ fontSize: "1.3rem", fontWeight: 700, color: G.primary }}>{suffix}</span>
      </div>
      <p style={{ fontSize: "0.78rem", color: G.textMuted, fontWeight: 500 }}>{label}</p>
    </div>
  );
}

function TeamCard({ name, role, bio, initials, gradient, delay }) {
  return (
    <div className="au-team-card" style={{ animationDelay: `${delay}ms` }}>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14, flexShrink: 0,
          background: gradient,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "1rem", fontWeight: 800, color: "#fff",
          fontFamily: "'Syne', sans-serif",
          boxShadow: "0 4px 12px rgba(34,197,94,0.2)",
        }}>{initials}</div>
        <div>
          <h3 style={{ fontWeight: 700, color: G.textPrimary, fontSize: "0.92rem", marginBottom: 2, fontFamily: "'Syne', sans-serif" }}>{name}</h3>
          <p style={{ fontSize: "0.72rem", color: G.primary, fontWeight: 600, letterSpacing: "0.03em" }}>{role}</p>
        </div>
      </div>
      <p style={{ fontSize: "0.8rem", color: G.textMuted, lineHeight: 1.7 }}>{bio}</p>
    </div>
  );
}

function ValueCard({ icon, title, desc }) {
  return (
    <div className="au-value-card">
      <div style={{ fontSize: "1.4rem", flexShrink: 0, marginTop: 2 }}>{icon}</div>
      <div>
        <h4 style={{ fontWeight: 700, color: G.textPrimary, fontSize: "0.88rem", marginBottom: 5, fontFamily: "'Syne', sans-serif" }}>{title}</h4>
        <p style={{ fontSize: "0.8rem", color: G.textMuted, lineHeight: 1.65 }}>{desc}</p>
      </div>
    </div>
  );
}

// ── Main Component ─────────────────────────────────────────
export default function AboutUs() {
  return (
    <div className="au-page">
      <GlobalStyles />

      {/* ── Background blobs ── */}
      <div className="au-blob" style={{ position: "fixed", top: "-10%", left: "-5%", width: "50%", height: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.07) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />
      <div className="au-blob" style={{ position: "fixed", bottom: "-10%", right: "-5%", width: "50%", height: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.05) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(90px)", pointerEvents: "none", zIndex: 0, animationDelay: "2s" }} />

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section style={{ position: "relative", zIndex: 2, padding: "5rem 1.5rem 4rem", textAlign: "center" }}>
        <div style={{ maxWidth: 760, margin: "0 auto" }}>
          <div className="au-f0"><Badge>Our Story</Badge></div>

          <h1 className="au-f1" style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(2.4rem, 6vw, 4rem)",
            fontWeight: 800, color: G.textPrimary,
            lineHeight: 1.08, letterSpacing: "-0.03em",
            marginBottom: "1.25rem",
          }}>
            Health clarity,{" "}
            <span style={{
              background: `linear-gradient(135deg, ${G.primary}, ${G.primaryMid})`,
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
            }}>powered by AI</span>
          </h1>

          <p className="au-f2" style={{ fontSize: "1rem", color: G.textMuted, maxWidth: 560, margin: "0 auto 2.5rem", lineHeight: 1.8 }}>
            VitaRisk was built with one belief: everyone deserves to understand their health.
            We combine cutting-edge AI with medical knowledge to make lab reports readable — for anyone.
          </p>

          <div className="au-f3" style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap", marginBottom: "3.5rem" }}>
            <button className="au-btn-primary">Try New Assessment</button>
            <button className="au-btn-ghost">Meet the team ↓</button>
          </div>

          {/* Floating health icons */}
          <div className="au-f4 au-chips-row" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.9rem", flexWrap: "wrap" }}>
            {[
              { icon: "🫀", label: "Heart health",  delay: "0s"   },
              { icon: "🩸", label: "Blood sugar",   delay: "0.5s" },
              { icon: "🧬", label: "Lab reports",   delay: "1s"   },
              { icon: "📊", label: "Analytics",     delay: "1.5s" },
              { icon: "🔬", label: "AI analysis",   delay: "2s"   },
            ].map(({ icon, label, delay }) => (
              <div key={label} className="au-icon-chip au-float" style={{ animationDelay: delay }}>
                <span style={{ fontSize: "1.8rem" }}>{icon}</span>
                <span style={{ fontSize: "0.68rem", fontWeight: 600, color: G.textMuted, whiteSpace: "nowrap" }}>{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="au-divider" />

      {/* ══════════════════════════════════════════
          STATS
      ══════════════════════════════════════════ */}
      <section style={{ position: "relative", zIndex: 2, maxWidth: 1020, margin: "0 auto", padding: "5rem 1.5rem" }}>
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div className="au-section-label" style={{ justifyContent: "center" }}>By the numbers</div>
          <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, color: G.textPrimary, letterSpacing: "-0.02em" }}>
            Trusted by patients &amp; doctors
          </h2>
        </div>
        <div className="au-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
          <StatCard value={10000} suffix="+" label="Reports analyzed"    icon="📋" delay={0}   />
          <StatCard value={98}    suffix="%" label="Analysis accuracy"   icon="🎯" delay={100} />
          <StatCard value={50}    suffix="+" label="Conditions detected" icon="🔬" delay={200} />
          <StatCard value={4800}  suffix="+" label="Happy users"         icon="💚" delay={300} />
        </div>
      </section>

      <div className="au-divider" />

      {/* ══════════════════════════════════════════
          MISSION BANNER
      ══════════════════════════════════════════ */}
      <section style={{ position: "relative", zIndex: 2, padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{
            background: G.card,
            border: `1px solid ${G.primaryBorder}`,
            borderRadius: 28,
            padding: "3.5rem 3rem",
            textAlign: "center",
            position: "relative", overflow: "hidden",
            backdropFilter: "blur(16px)",
            boxShadow: "0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(34,197,94,0.06)",
          }}>
            {/* top glow */}
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 120, background: "linear-gradient(180deg, rgba(34,197,94,0.06) 0%, transparent 100%)", borderRadius: "28px 28px 0 0", pointerEvents: "none" }} />
            {/* dot grid */}
            <div style={{ position: "absolute", inset: 0, opacity: 0.04, backgroundImage: "radial-gradient(circle, #22C55E 1px, transparent 1px)", backgroundSize: "28px 28px", borderRadius: 28, pointerEvents: "none" }} />

            <div style={{ position: "relative" }}>
              <div style={{ marginBottom: "1.5rem" }}><Badge>Our Mission</Badge></div>
              <blockquote style={{
                fontFamily: "'Syne', sans-serif",
                fontSize: "clamp(1.2rem, 2.5vw, 1.65rem)",
                fontWeight: 700, color: G.textPrimary,
                lineHeight: 1.5, letterSpacing: "-0.02em",
                marginBottom: "2rem",
              }}>
                "We believe health intelligence should be universal — not just available to those with medical degrees or expensive consultations."
              </blockquote>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "0.85rem" }}>
                <div style={{ width: 42, height: 42, borderRadius: "50%", background: `linear-gradient(135deg, ${G.primaryDeep}, ${G.primary})`, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, color: "#F0FFF4", fontSize: "1rem", fontFamily: "'Syne', sans-serif" }}>A</div>
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontWeight: 700, color: G.textPrimary, fontSize: "0.88rem", marginBottom: 2 }}>Ananya Sharma</p>
                  <p style={{ fontSize: "0.72rem", color: G.primary, fontWeight: 600 }}>Co-founder &amp; CEO, VitaRisk</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="au-divider" />

      {/* ══════════════════════════════════════════
          VALUES
      ══════════════════════════════════════════ */}
      <section style={{ position: "relative", zIndex: 2, maxWidth: 1020, margin: "0 auto", padding: "5rem 1.5rem" }}>
        <div className="au-values-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3.5rem", alignItems: "center" }}>
          <div>
            <div className="au-section-label">Why we exist</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, color: G.textPrimary, letterSpacing: "-0.02em", lineHeight: 1.2, marginBottom: "1rem" }}>
              Built on principles<br />that matter
            </h2>
            <p style={{ fontSize: "0.88rem", color: G.textMuted, lineHeight: 1.8 }}>
              Every decision we make — from the AI models we choose to the way we display results —
              is guided by a core set of values rooted in trust, accessibility, and care.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <ValueCard icon="🔒" title="Privacy First"       desc="Your health data never leaves your device without consent. We take HIPAA principles seriously — always." />
            <ValueCard icon="⚡" title="Speed & Accuracy"    desc="AI-powered analysis in seconds, with clinical-grade precision backed by medical literature." />
            <ValueCard icon="🌍" title="Accessible to All"   desc="No medical degree required. We translate complex reports into plain language everyone understands." />
            <ValueCard icon="💡" title="Continuous Learning" desc="Our models are constantly updated with the latest research to keep your insights cutting-edge." />
          </div>
        </div>
      </section>

      <div className="au-divider" />

      {/* ══════════════════════════════════════════
          TEAM
      ══════════════════════════════════════════ */}
      <section id="team" style={{ position: "relative", zIndex: 2, padding: "5rem 1.5rem" }}>
        <div style={{ maxWidth: 1020, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <div className="au-section-label" style={{ justifyContent: "center" }}>The humans behind the AI</div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.2rem)", fontWeight: 800, color: G.textPrimary, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>
              Meet our team
            </h2>
            <p style={{ fontSize: "0.88rem", color: G.textMuted, maxWidth: 460, margin: "0 auto", lineHeight: 1.75 }}>
              A passionate group of engineers, doctors, and designers on a mission to democratize health understanding.
            </p>
          </div>

          <div className="au-team-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
            <TeamCard name="Ananya Sharma"  role="Co-founder & CEO"        bio="Ex-Google Health. 8 years in medical AI research. Believes AI should be a health equalizer, not a luxury."           initials="AS" gradient={`linear-gradient(135deg, ${G.primaryDeep}, ${G.primary})`}          delay={0}   />
            <TeamCard name="Rohan Mehta"    role="Co-founder & CTO"        bio="Full-stack engineer with a background in NLP. Built the core report-parsing engine from scratch."                      initials="RM" gradient="linear-gradient(135deg, #065F46, #059669)"                           delay={80}  />
            <TeamCard name="Dr. Priya Nair" role="Chief Medical Officer"   bio="MBBS, MD (Pathology). Ensures every AI output is clinically validated and medically sound."                           initials="PN" gradient="linear-gradient(135deg, #14532D, #16A34A)"                           delay={160} />
            <TeamCard name="Kiran Desai"    role="Head of Design"          bio="Former Figma designer. Obsessed with making complex medical data feel warm, human, and clear."                         initials="KD" gradient="linear-gradient(135deg, #166534, #22C55E)"                           delay={240} />
            <TeamCard name="Aditya Kulkarni" role="AI/ML Engineer"         bio="PhD in Computer Vision. Leads the multimodal model pipeline for scan and report analysis."                            initials="AK" gradient="linear-gradient(135deg, #064E3B, #10B981)"                           delay={320} />
            <TeamCard name="Sneha Patil"    role="Growth & Partnerships"   bio="Healthcare startup veteran. Connecting VitaRisk with clinics, labs, and wellness platforms across India."             initials="SP" gradient="linear-gradient(135deg, #15803D, #4ADE80)"                           delay={400} />
          </div>
        </div>
      </section>

      <div className="au-divider" />

      {/* ══════════════════════════════════════════
          CTA BANNER
      ══════════════════════════════════════════ */}
      <section style={{ position: "relative", zIndex: 2, maxWidth: 1020, margin: "0 auto", padding: "5rem 1.5rem" }}>
        <div style={{
          background: G.card,
          border: `1px solid ${G.primaryBorder}`,
          borderRadius: 28,
          padding: "4rem 3rem",
          textAlign: "center",
          position: "relative", overflow: "hidden",
          backdropFilter: "blur(16px)",
          boxShadow: "0 30px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(34,197,94,0.06)",
        }}>
          {/* grid pattern */}
          <div style={{ position: "absolute", inset: 0, opacity: 0.035, backgroundImage: "linear-gradient(rgba(34,197,94,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,197,94,0.5) 1px, transparent 1px)", backgroundSize: "32px 32px", borderRadius: 28, pointerEvents: "none" }} />
          {/* top glow */}
          <div style={{ position: "absolute", top: -40, left: "50%", transform: "translateX(-50%)", width: 300, height: 150, background: `radial-gradient(ellipse, rgba(34,197,94,0.14) 0%, transparent 70%)`, filter: "blur(30px)", pointerEvents: "none" }} />

          <div style={{ position: "relative" }}>
            <div style={{ marginBottom: "1rem" }}><Badge>Get Started Today</Badge></div>
            <h2 style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(1.6rem, 3vw, 2.4rem)", fontWeight: 800, color: G.textPrimary, letterSpacing: "-0.02em", marginBottom: "0.9rem" }}>
              Understand your health, finally.
            </h2>
            <p style={{ fontSize: "0.9rem", color: G.textMuted, maxWidth: 460, margin: "0 auto 2.25rem", lineHeight: 1.8 }}>
              Upload your first report in seconds. No sign-up required. AI analysis — completely free.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button className="au-btn-primary">Analyze a report →</button>
              <button className="au-btn-ghost">Check vitals</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}