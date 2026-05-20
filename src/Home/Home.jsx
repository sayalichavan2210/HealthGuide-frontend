import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

/* ─── Theme tokens ──────────────────────────────────────── */
const T = {
  bg:       '#050A05',
  card:     'rgba(6,16,6,0.95)',
  border:   'rgba(34,197,94,0.18)',
  borderHi: 'rgba(34,197,94,0.38)',
  g1:       '#22C55E',
  g2:       '#16A34A',
  g3:       '#15803D',
  gFaint:   'rgba(34,197,94,0.07)',
  gGlow:    'rgba(34,197,94,0.14)',
  text:     '#DCFCE7',
  muted:    '#4A8A5A',
  faint:    '#2A5A32',
};

/* ─── Global CSS ────────────────────────────────────────── */
const Css = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .hp-root {
      min-height: 100vh;
      background: ${T.bg};
      font-family: 'DM Sans', sans-serif;
      color: ${T.text};
      overflow-x: hidden;
      position: relative;
    }

    /* ── blobs ── */
    @keyframes hpBlob {
      0%   { transform: translate(0,0)    scale(1); }
      100% { transform: translate(4%,4%)  scale(1.07); }
    }
    .hp-blob { animation: hpBlob 16s infinite alternate ease-in-out; will-change: transform; }

    /* ── noise grain overlay ── */
    .hp-grain::before {
      content: '';
      position: fixed; inset: 0;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.035'/%3E%3C/svg%3E");
      pointer-events: none; z-index: 0;
    }

    /* ── fade-up animations ── */
    @keyframes hpFadeUp {
      from { opacity:0; transform: translateY(28px); }
      to   { opacity:1; transform: translateY(0);    }
    }
    @keyframes hpFadeIn {
      from { opacity:0; }
      to   { opacity:1; }
    }
    @keyframes hpFloat {
      0%,100% { transform: translateY(0px);   }
      50%      { transform: translateY(-8px);  }
    }
    @keyframes hpPulse {
      0%,100% { box-shadow: 0 0 0 0   rgba(34,197,94,0.5); }
      50%      { box-shadow: 0 0 0 8px rgba(34,197,94,0);   }
    }
    @keyframes hpBlink { 0%,100% { opacity:1; } 50% { opacity:0.25; } }
    @keyframes hpScanline {
      0%   { transform: translateY(-100%); }
      100% { transform: translateY(100%);  }
    }
    @keyframes hpBarFill {
      from { width: 0; }
    }
    @keyframes hpCount {
      from { opacity:0; transform: scale(0.8); }
      to   { opacity:1; transform: scale(1);   }
    }

    .hp-f0 { animation: hpFadeUp 0.7s ease both; }
    .hp-f1 { animation: hpFadeUp 0.7s ease 0.1s both; }
    .hp-f2 { animation: hpFadeUp 0.7s ease 0.2s both; }
    .hp-f3 { animation: hpFadeUp 0.7s ease 0.3s both; }
    .hp-f4 { animation: hpFadeUp 0.7s ease 0.4s both; }
    .hp-f5 { animation: hpFadeUp 0.7s ease 0.5s both; }

    .hp-float { animation: hpFloat 5s ease-in-out infinite; }
    .hp-blink { animation: hpBlink 1.8s ease-in-out infinite; }
    .hp-bar-fill { animation: hpBarFill 1.4s cubic-bezier(0.4,0,0.2,1) 0.6s both; }

    /* ── layout ── */
    .hp-container {
      max-width: 1100px;
      margin: 0 auto;
      padding: 0 1.5rem;
      position: relative; z-index: 2;
    }

    /* ── eyebrow ── */
    .hp-eyebrow {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 5px 14px;
      background: ${T.gFaint};
      border: 1px solid ${T.border};
      border-radius: 40px;
      font-size: 11px; font-weight: 700;
      color: ${T.g1};
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-bottom: 1.4rem;
    }

    /* ── hero headline ── */
    .hp-h1 {
      font-family: 'Instrument Serif', serif;
      font-size: clamp(2.8rem, 6vw, 4.6rem);
      font-weight: 400;
      line-height: 1.05;
      letter-spacing: -0.02em;
      color: ${T.text};
      margin-bottom: 1.25rem;
    }
    .hp-h1 em {
      font-style: italic;
      background: linear-gradient(135deg, ${T.g1} 0%, ${T.g2} 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
    }
    .hp-h2 {
      font-family: 'Instrument Serif', serif;
      font-size: clamp(1.8rem, 3.5vw, 2.6rem);
      font-weight: 400;
      letter-spacing: -0.02em;
      color: ${T.text};
    }

    /* ── body copy ── */
    .hp-body {
      font-size: 0.97rem;
      color: ${T.muted};
      line-height: 1.8;
    }

    /* ── primary button ── */
    .hp-btn-primary {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 0.88rem 1.9rem;
      background: linear-gradient(90deg, ${T.g3}, ${T.g2}, ${T.g1});
      border: none; border-radius: 40px;
      color: #F0FFF4; font-size: 0.9rem; font-weight: 700;
      cursor: pointer; font-family: 'DM Sans', sans-serif;
      box-shadow: 0 4px 20px rgba(34,197,94,0.25);
      transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
      letter-spacing: 0.01em;
      text-decoration: none;
      white-space: nowrap;
    }
    .hp-btn-primary:hover {
      opacity: 0.88; transform: translateY(-2px);
      box-shadow: 0 10px 30px rgba(34,197,94,0.32);
    }

    /* ── ghost button ── */
    .hp-btn-ghost {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 0.88rem 1.6rem;
      background: rgba(5,18,8,0.9);
      border: 1px solid ${T.border};
      border-radius: 40px;
      color: ${T.muted}; font-size: 0.9rem; font-weight: 600;
      cursor: pointer; font-family: 'DM Sans', sans-serif;
      transition: border-color 0.2s, color 0.2s, transform 0.15s;
      white-space: nowrap;
    }
    .hp-btn-ghost:hover { border-color: ${T.g1}; color: ${T.g1}; transform: translateY(-2px); }

    /* ── trust strip ── */
    .hp-trust { display: flex; gap: 1.5rem; flex-wrap: wrap; margin-top: 2rem; }
    .hp-trust-item {
      display: flex; align-items: center; gap: 7px;
      font-size: 12px; font-weight: 600; color: ${T.faint};
    }
    .hp-trust-item i { color: ${T.g1}; font-size: 14px; }

    /* ── risk meter card ── */
    .hp-meter-card {
      background: ${T.card};
      border: 1px solid ${T.border};
      border-radius: 20px;
      padding: 1.5rem;
      backdrop-filter: blur(14px);
      position: relative; overflow: hidden;
    }
    .hp-meter-card::before {
      content:''; position:absolute; top:0; left:0; right:0; height:90px;
      background: linear-gradient(180deg, ${T.gGlow} 0%, transparent 100%);
      pointer-events:none;
    }

    /* ── stat card ── */
    .hp-stat-card {
      display: flex; align-items: center; gap: 1rem;
      padding: 1.1rem 1.3rem;
      background: ${T.card};
      border: 1px solid ${T.border};
      border-radius: 16px;
      backdrop-filter: blur(10px);
      transition: border-color 0.2s, transform 0.2s;
    }
    .hp-stat-card:hover { border-color: ${T.borderHi}; transform: translateY(-2px); }
    .hp-stat-icon {
      width: 42px; height: 42px; border-radius: 12px; flex-shrink:0;
      background: ${T.gFaint}; border: 1px solid ${T.border};
      display:flex; align-items:center; justify-content:center;
      color: ${T.g1}; font-size: 1.1rem;
    }
    .hp-stat-label { font-size: 11px; font-weight: 700; color: ${T.faint}; text-transform: uppercase; letter-spacing: 0.07em; margin-bottom: 4px; }
    .hp-stat-val   { font-family: 'Instrument Serif', serif; font-size: 1.55rem; color: ${T.text}; line-height: 1; }
    .hp-stat-tag   { display: inline-flex; align-items: center; gap: 4px; font-size: 11px; font-weight: 700; color: ${T.g1}; background: ${T.gFaint}; border: 1px solid ${T.border}; border-radius: 20px; padding: 2px 9px; margin-left: 8px; vertical-align: middle; font-family: 'DM Sans', sans-serif; }

    /* ── badge ── */
    .hp-badge {
      display: inline-flex; align-items: center; gap: 5px;
      font-size: 11px; font-weight: 700;
      padding: 3px 10px; border-radius: 20px;
    }
    .hp-badge-green { background: rgba(34,197,94,0.12); color: ${T.g1}; border: 1px solid rgba(34,197,94,0.28); }
    .hp-badge-amber { background: rgba(251,191,36,0.10); color: #fbbf24; border: 1px solid rgba(251,191,36,0.28); }
    .hp-badge-red   { background: rgba(248,113,113,0.10); color: #f87171; border: 1px solid rgba(248,113,113,0.28); }

    /* ── feature card ── */
    .hp-feat-card {
      padding: 1.75rem 1.5rem;
      background: ${T.card};
      border: 1px solid ${T.border};
      border-radius: 20px;
      backdrop-filter: blur(10px);
      transition: border-color 0.25s, transform 0.25s;
      position: relative; overflow: hidden;
    }
    .hp-feat-card:hover { border-color: ${T.borderHi}; transform: translateY(-4px); }
    .hp-feat-card::after {
      content:''; position:absolute; bottom:0; left:0; right:0; height:2px;
      background: linear-gradient(90deg, transparent, ${T.g1}, transparent);
      opacity:0; transition: opacity 0.3s;
    }
    .hp-feat-card:hover::after { opacity:1; }
    .hp-feat-icon {
      width: 48px; height: 48px; border-radius: 14px; margin-bottom: 1.25rem;
      background: ${T.gFaint}; border: 1px solid ${T.border};
      display:flex; align-items:center; justify-content:center;
      font-size: 1.3rem;
    }
    .hp-feat-title {
      font-family: 'Instrument Serif', serif;
      font-size: 1.2rem; font-weight: 400;
      color: ${T.text}; margin-bottom: 0.6rem;
    }
    .hp-feat-desc { font-size: 0.85rem; color: ${T.muted}; line-height: 1.75; }

    /* ── section label ── */
    .hp-section-label {
      display: flex; align-items: center; gap: 12px;
      font-size: 10px; font-weight: 700; color: ${T.faint};
      letter-spacing: 0.12em; text-transform: uppercase;
      margin-bottom: 1rem;
    }
    .hp-section-label::before, .hp-section-label::after {
      content:''; flex: 0 0 30px; height: 1px; background: rgba(34,197,94,0.18);
    }

    /* ── divider ── */
    .hp-divider { height: 1px; background: rgba(34,197,94,0.07); margin: 4rem 0; }

    /* ── progress bar ── */
    .hp-bar-track { height: 6px; background: rgba(34,197,94,0.10); border-radius: 4px; overflow: hidden; }
    .hp-bar-amber { height: 100%; border-radius: 4px; background: linear-gradient(90deg, #b45309, #fbbf24); }
    .hp-bar-green { height: 100%; border-radius: 4px; background: linear-gradient(90deg, ${T.g3}, ${T.g1}); }

    /* ── number ticker ── */
    .hp-ticker { font-variant-numeric: tabular-nums; }

    /* ── scanline effect on meter ── */
    .hp-scanline {
      position: absolute; inset: 0; pointer-events: none; overflow: hidden; border-radius: 20px;
    }
    .hp-scanline::after {
      content:''; position:absolute; left:0; right:0; height:2px;
      background: linear-gradient(90deg, transparent, rgba(34,197,94,0.15), transparent);
      animation: hpScanline 3s linear infinite;
    }

    /* responsive */
    @media (max-width: 768px) {
      .hp-hero-grid  { grid-template-columns: 1fr !important; }
      .hp-feat-grid  { grid-template-columns: 1fr !important; }
      .hp-stats-col  { flex-direction: row !important; flex-wrap: wrap; }
    }
  `}</style>
);

/* ─── Animated counter ──────────────────────────────────── */
function useCounter(target, duration = 1800) {
  const [val, setVal] = useState(0);
  const [started, setStarted] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true); }, { threshold: 0.3 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!started) return;
    let start = null;
    const step = ts => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const e = 1 - Math.pow(1 - p, 3);
      setVal(Math.floor(e * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [started, target, duration]);
  return { val, ref };
}

/* ─── Sub-components ────────────────────────────────────── */
const LiveDot = () => (
  <span className="hp-blink" style={{ width: 6, height: 6, borderRadius: '50%', background: T.g1, boxShadow: `0 0 6px ${T.g1}`, display: 'inline-block', flexShrink: 0 }} />
);

function StatCard({ icon, label, value, tag, delay = '0s' }) {
  return (
    <div className="hp-stat-card" style={{ animationDelay: delay }}>
      <div className="hp-stat-icon">{icon}</div>
      <div>
        <div className="hp-stat-label">{label}</div>
        <div className="hp-stat-val hp-ticker">
          {value}
          {tag && <span className="hp-stat-tag">✦ {tag}</span>}
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, number, title, desc, delay }) {
  return (
    <div className="hp-feat-card" style={{ animationDelay: delay }}>
      <div className="hp-feat-icon">{icon}</div>
      <div style={{ fontSize: 10, fontWeight: 700, color: T.faint, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 8 }}>
        0{number}
      </div>
      <h3 className="hp-feat-title">{title}</h3>
      <p className="hp-feat-desc">{desc}</p>
    </div>
  );
}

/* ─── Main ──────────────────────────────────────────────── */
const HomePage = () => {
  const navigate = useNavigate();
  const assessCount = useCounter(12480, 1800);
  const userCount   = useCounter(50000, 2000);

  return (
    <div className="hp-root hp-grain">
      <Css />

      {/* Background blobs */}
      <div className="hp-blob" style={{ position:'fixed', top:'-10%', left:'-5%', width:'55%', height:'55%', background:'radial-gradient(circle, rgba(34,197,94,0.09) 0%, transparent 70%)', borderRadius:'50%', filter:'blur(80px)', pointerEvents:'none', zIndex:0 }} />
      <div className="hp-blob" style={{ position:'fixed', bottom:'-10%', right:'-5%', width:'55%', height:'55%', background:'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)', borderRadius:'50%', filter:'blur(90px)', pointerEvents:'none', zIndex:0, animationDelay:'2s' }} />
      <div style={{ position:'fixed', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'40%', height:'40%', background:'radial-gradient(circle, rgba(34,197,94,0.03) 0%, transparent 70%)', borderRadius:'50%', filter:'blur(100px)', pointerEvents:'none', zIndex:0 }} />

      {/* ══════════════════════════════════════════
          HERO
      ══════════════════════════════════════════ */}
      <section style={{ paddingTop: '5rem', paddingBottom: '2rem' }}>
        <div className="hp-container">
          <div className="hp-hero-grid" style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'3rem', alignItems:'center' }}>

            {/* LEFT */}
            <div>
              <div className="hp-f0">
                <div className="hp-eyebrow">
                  <LiveDot />
                  AI Health Intelligence
                </div>
              </div>

              <h1 className="hp-h1 hp-f1">
                Know Your Risks.<br />
                <em>Stay Ahead.</em>
              </h1>

              <p className="hp-body hp-f2" style={{ maxWidth: 440, marginBottom: '2rem' }}>
                Precision-powered health risk assessment. Get real-time insights,
                actionable reports, and personalised health scores in minutes.
              </p>

              <div className="hp-f3" style={{ display:'flex', gap:'0.85rem', flexWrap:'wrap' }}>
                <button className="hp-btn-primary" onClick={() => navigate('/risk')}>
                  Start Assessment →
                </button>
                <button className="hp-btn-ghost" onClick={() => navigate('/home')}>
                  View Dashboard
                </button>
              </div>

              {/* Trust strip */}
              <div className="hp-trust hp-f4">
                {[
                  { icon: '🛡️', label: 'HIPAA Compliant' },
                  { icon: '👥', label: '50K+ Users'      },
                  { icon: '⭐', label: '4.9 Rating'      },
                ].map(({ icon, label }) => (
                  <div key={label} className="hp-trust-item">
                    <span style={{ fontSize: 14 }}>{icon}</span>
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — cards stack */}
            <div className="hp-stats-col hp-f5" style={{ display:'flex', flexDirection:'column', gap:'0.9rem' }}>

              {/* Risk meter */}
              <div className="hp-meter-card hp-float" style={{ animationDelay: '0.3s' }}>
                <div className="hp-scanline" />
                {/* header */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.85rem', position:'relative' }}>
                  <span style={{ fontSize:11, fontWeight:700, color:T.faint, textTransform:'uppercase', letterSpacing:'0.09em' }}>
                    Overall Risk Score
                  </span>
                  <span style={{ fontFamily:"'Instrument Serif', serif", fontSize:'1.4rem', color:T.g1, lineHeight:1 }}>72</span>
                </div>
                {/* bar */}
                <div className="hp-bar-track" style={{ marginBottom:'0.85rem' }}>
                  <div className="hp-bar-amber hp-bar-fill" style={{ width:'72%' }} />
                </div>
                {/* badges */}
                <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
                  <span className="hp-badge hp-badge-green">♥ Heart: Low</span>
                  <span className="hp-badge hp-badge-amber">⚡ Diabetes: Moderate</span>
                  <span className="hp-badge hp-badge-green">💧 BP: Normal</span>
                </div>
              </div>

              {/* Stat cards */}
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'0.9rem' }}>
                <div className="hp-stat-card hp-float" style={{ animationDelay:'0.8s', flexDirection:'column', alignItems:'flex-start' }}>
                  <div className="hp-stat-icon" style={{ marginBottom:'0.75rem' }}>📋</div>
                  <div className="hp-stat-label">Assessments</div>
                  <div className="hp-stat-val hp-ticker" ref={assessCount.ref}>
                    {assessCount.val.toLocaleString()}
                  </div>
                  <div style={{ marginTop:5 }}><span className="hp-stat-tag">This Month</span></div>
                </div>

                <div className="hp-stat-card hp-float" style={{ animationDelay:'1.1s', flexDirection:'column', alignItems:'flex-start' }}>
                  <div className="hp-stat-icon" style={{ marginBottom:'0.75rem' }}>🎯</div>
                  <div className="hp-stat-label">Accuracy Rate</div>
                  <div className="hp-stat-val hp-ticker">98.4%</div>
                  <div style={{ marginTop:5 }}><span className="hp-stat-tag">Verified</span></div>
                </div>

                <div className="hp-stat-card hp-float" style={{ animationDelay:'1.4s', flexDirection:'column', alignItems:'flex-start', gridColumn:'span 2' }}>
                  <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', width:'100%', marginBottom:8 }}>
                    <div>
                      <div className="hp-stat-label">Happy Users</div>
                      <div className="hp-stat-val hp-ticker" ref={userCount.ref}>
                        {userCount.val.toLocaleString()}+
                      </div>
                    </div>
                    <div className="hp-stat-icon">💚</div>
                  </div>
                  <div className="hp-bar-track" style={{ width:'100%' }}>
                    <div className="hp-bar-green hp-bar-fill" style={{ width:'82%' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FEATURES
      ══════════════════════════════════════════ */}
      <section style={{ paddingTop:'4rem', paddingBottom:'5rem' }}>
        <div className="hp-container">
          <div className="hp-divider" style={{ margin:'0 0 4rem' }} />

          {/* section head */}
          <div style={{ textAlign:'center', marginBottom:'3rem' }}>
            <div className="hp-section-label" style={{ justifyContent:'center' }}>What We Offer</div>
            <h2 className="hp-h2" style={{ marginBottom:'0.75rem' }}>
              Everything You Need to{' '}
              <span style={{ background:`linear-gradient(135deg, ${T.g1}, ${T.g2})`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                Stay Healthy
              </span>
            </h2>
            <p className="hp-body" style={{ maxWidth:480, margin:'0 auto' }}>
              Comprehensive tools built for proactive health management — from assessment to action.
            </p>
          </div>

          <div className="hp-feat-grid" style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' }}>
            <FeatureCard
              number={1} icon="🔬"
              title="Risk Assessment"
              desc="AI-powered questionnaire that maps your personal health risks in under 5 minutes with clinical-grade precision."
              delay="0s"
            />
            <FeatureCard
              number={2} icon="📊"
              title="Live Dashboard"
              desc="Track all your health metrics in one place with real-time updates, trends, and personalised recommendations."
              delay="0.1s"
            />
            <FeatureCard
              number={3} icon="📄"
              title="Detailed Reports"
              desc="Download PDF reports with doctor-friendly summaries, risk breakdowns, and actionable next steps."
              delay="0.2s"
            />
          </div>

          {/* Bottom CTA row */}
          <div style={{ marginTop:'3.5rem', display:'flex', justifyContent:'center', alignItems:'center', gap:'1.5rem', flexWrap:'wrap' }}>
            <button className="hp-btn-primary" onClick={() => navigate('/risk')} style={{ padding:'1rem 2.5rem', fontSize:'1rem' }}>
              Get Your Free Assessment →
            </button>
            <span className="hp-body" style={{ fontSize:'0.85rem' }}>
              No sign-up required &nbsp;·&nbsp; Results in 5 minutes
            </span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;