import React from 'react';


const HomePage = () => {
  return (
    <>
   

      <div className="vr-page">
        <div className="vr-container">

          {/* ── HERO SECTION ── */}
          <section className="vr-section" style={{ paddingTop: '3rem' }}>
            <div className="vr-grid-2 vr-gap-lg" style={{ alignItems: 'center' }}>

              {/* Left: Text */}
              <div>
                <div className="vr-eyebrow">
                  <span className="vr-live-dot" />
                  AI Health Intelligence
                </div>

                <h1 className="vr-h1" style={{ marginBottom: '1rem' }}>
                  Know Your Risks. <br />
                  <span className="vr-accent">Stay Ahead.</span>
                </h1>

                <p className="vr-muted" style={{ fontSize: '0.95rem', lineHeight: 1.7, maxWidth: 440, marginBottom: '1.75rem' }}>
                  Precision-powered health risk assessment. Get real-time insights,
                  actionable reports, and personalised health scores in minutes.
                </p>

                <div className="vr-flex vr-gap-sm">
                  <button className="bg-[#2BBA68] py-2 rounded-xl px-2 text-green-900 font-bold">
                    Start Assessment →
                  </button>
                  <button className="vr-btn vr-btn-secondary vr-btn-lg">
                    View Dashboard
                  </button>
                </div>

                {/* Trust row */}
                <div className="vr-trust-row">
                  <div className="vr-trust-item">
                    <svg viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    HIPAA Compliant
                  </div>
                  <div className="vr-trust-item">
                    <svg viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
                    50K+ Users
                  </div>
                  <div className="vr-trust-item">
                    <svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
                    4.9 Rating
                  </div>
                </div>
              </div>

              {/* Right: Stats */}
              <div className="vr-flex-col vr-gap-sm">

                {/* Risk meter card */}
                <div className="vr-meter">
                  <div className="vr-meter__header">
                    <span className="vr-label">Overall Risk Score</span>
                    <span className="vr-accent" style={{ fontWeight: 700 }}>72 / 100</span>
                  </div>
                  <div className="vr-meter__track">
                    <div className="vr-meter__fill amber" style={{ width: '72%' }} />
                  </div>
                  <div className="vr-meter__tags">
                    <span className="vr-badge vr-badge-green">Heart: Low</span>
                    <span className="vr-badge vr-badge-amber">Diabetes: Moderate</span>
                    <span className="vr-badge vr-badge-green">BP: Normal</span>
                  </div>
                </div>

                {/* Stat cards */}
                <div className="vr-stat-card">
                  <div className="vr-stat-icon">
                    <svg viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>
                  </div>
                  <div>
                    <div className="vr-stat-label">Assessments Done</div>
                    <div className="vr-stat-value">
                      12,480
                      <span className="vr-stat-tag">This Month</span>
                    </div>
                  </div>
                </div>

                <div className="vr-stat-card">
                  <div className="vr-stat-icon">
                    <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2 4-4"/></svg>
                  </div>
                  <div>
                    <div className="vr-stat-label">Accuracy Rate</div>
                    <div className="vr-stat-value">
                      98.4%
                      <span className="vr-stat-tag">Verified</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <div className="vr-divider" />

          {/* ── FEATURES SECTION ── */}
          <section className="vr-section">
            <div className="vr-section-head">
              <div className="vr-eyebrow">What We Offer</div>
              <h2 className="vr-h2" style={{ marginBottom: '0.75rem' }}>
                Everything You Need to <span className="vr-accent">Stay Healthy</span>
              </h2>
              <p className="vr-muted">Comprehensive tools built for proactive health management.</p>
            </div>

            <div className="vr-grid-3 vr-gap-md">
              {[
                { title: 'Risk Assessment',  desc: 'AI-powered questionnaire that maps your personal health risks in under 5 minutes.' },
                { title: 'Live Dashboard',   desc: 'Track all your health metrics in one place with real-time updates and trends.' },
                { title: 'Detailed Reports', desc: 'Download PDF reports with doctor-friendly summaries and actionable next steps.' },
              ].map((f) => (
                <div key={f.title} className="vr-card">
                  <div className="vr-icon-box vr-icon-box-green" style={{ marginBottom: '1rem' }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="2" strokeLinecap="round">
                      <path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/>
                    </svg>
                  </div>
                  <h3 className="vr-h3" style={{ marginBottom: '0.5rem' }}>{f.title}</h3>
                  <p className="vr-muted" style={{ fontSize: '0.875rem' }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </section>

        </div>
      </div>
    </>
  );
};

export default HomePage;