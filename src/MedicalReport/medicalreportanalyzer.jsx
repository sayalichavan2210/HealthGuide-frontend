import { useState, useRef } from "react";

const API_BASE = "https://healthguide-backend.onrender.com";

// ── Green theme tokens ─────────────────────────────────────
const G = {
  primary:       "#22C55E",
  primaryMid:    "#16A34A",
  primaryDeep:   "#15803D",
  primaryGlow:   "rgba(34,197,94,0.18)",
  primaryFaint:  "rgba(34,197,94,0.07)",
  primaryBorder: "rgba(34,197,94,0.22)",
  bg:            "#050A05",
  card:          "rgba(6,14,6,0.96)",
  cardBorder:    "rgba(34,197,94,0.15)",
  inputBg:       "rgba(5,20,8,0.95)",
  inputBorder:   "rgba(34,197,94,0.16)",
  textPrimary:   "#DCFCE7",
  textMuted:     "#4A8A5A",
  textFaint:     "#2A5A32",
  // severity
  dangerBg:      "#1a0808",
  dangerBorder:  "#3a1212",
  dangerText:    "#f87171",
  warnBg:        "#1a1505",
  warnBorder:    "#3a2e08",
  warnText:      "#fbbf24",
  okBg:          "rgba(34,197,94,0.07)",
  okBorder:      "rgba(34,197,94,0.22)",
  okText:        "#22C55E",
};

// ── Helpers ────────────────────────────────────────────────
const getSeverityClass = (s = "") => {
  const v = s.toLowerCase();
  if (v === "high" || v === "critical") return "danger";
  if (v === "medium" || v === "moderate") return "caution";
  return "normal";
};
const getSeverityLabel = (s = "") => {
  const v = s.toLowerCase();
  if (v === "high" || v === "critical") return "Risky";
  if (v === "medium" || v === "moderate") return "Pay Attention.";
  return "Normal";
};

const SEV = {
  danger:  { bg: G.dangerBg, border: G.dangerBorder, text: G.dangerText, iconBg: "#2a0e0e", icon: "⚠" },
  caution: { bg: G.warnBg,   border: G.warnBorder,   text: G.warnText,   iconBg: "#261e05", icon: "◈" },
  normal:  { bg: G.okBg,     border: G.okBorder,     text: G.okText,     iconBg: "rgba(34,197,94,0.10)", icon: "✓" },
};

// ── Sub-components ─────────────────────────────────────────
const SeverityBadge = ({ severity }) => {
  const cls = getSeverityClass(severity);
  const s   = SEV[cls];
  return (
    <span style={{
      background: s.bg, color: s.text, border: `1px solid ${s.border}`,
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 9px", borderRadius: 20,
      fontSize: 10, fontWeight: 700, letterSpacing: "0.05em",
    }}>
      <span>{s.icon}</span>
      {getSeverityLabel(severity).toUpperCase()}
    </span>
  );
};

const SummaryCard = ({ count, label, type }) => {
  const s = SEV[type];
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 12, padding: "14px 16px", textAlign: "center", flex: 1,
    }}>
      <div style={{ fontSize: 26, fontWeight: 700, color: s.text, lineHeight: 1 }}>{count}</div>
      <div style={{ fontSize: 11, color: s.text, opacity: 0.75, marginTop: 5, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
        <span>{s.icon}</span>{label}
      </div>
    </div>
  );
};

const FindingCard = ({ condition }) => {
  const cls = getSeverityClass(condition.severity);
  const s   = SEV[cls];
  return (
    <div style={{
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 12, padding: "14px 16px",
      display: "flex", alignItems: "flex-start", gap: 12,
      transition: "border-color 0.2s",
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: "50%",
        background: s.iconBg, border: `1px solid ${s.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, color: s.text, flexShrink: 0,
      }}>
        {s.icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 5 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: G.textPrimary }}>{condition.name}</span>
          {condition.value && (
            <span style={{
              fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 6,
              background: s.iconBg, border: `1px solid ${s.border}`, color: s.text,
            }}>{condition.value}</span>
          )}
          <SeverityBadge severity={condition.severity} />
        </div>
        <p style={{ fontSize: 12, color: G.textMuted, margin: 0, lineHeight: 1.65 }}>{condition.detail}</p>
      </div>
    </div>
  );
};

const Loader = () => (
  <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "6px 0" }}>
    <div style={{ display: "flex", gap: 5 }}>
      {[0, 0.15, 0.3].map((d, i) => (
        <span key={i} style={{
          width: 7, height: 7, borderRadius: "50%",
          background: G.primary, display: "inline-block",
          animation: "raLoaderPulse 1.4s ease-in-out infinite",
          animationDelay: `${d}s`,
        }} />
      ))}
    </div>
    <span style={{ fontSize: 13, color: G.primary, fontWeight: 500 }}>
     Your report is being scanned by AI…
    </span>
  </div>
);

const SectionLabel = ({ children }) => (
  <div style={{
    fontSize: 10, fontWeight: 700, color: G.textFaint,
    letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 10,
  }}>{children}</div>
);

// ── Main Component ─────────────────────────────────────────
export default function ReportAnalyzer() {
  const [file,     setFile]     = useState(null);
  const [b64,      setB64]      = useState(null);
  const [mimeType, setMimeType] = useState(null);
  const [preview,  setPreview]  = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [result,   setResult]   = useState(null);
  const [error,    setError]    = useState("");
  const inputRef = useRef();

  function loadFile(f) {
    if (!f) return;
    if (f.size > 20 * 1024 * 1024) { alert("Max file size 20 MB hai."); return; }
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf"];
    if (!allowed.includes(f.type)) { alert("Sirf JPG, PNG, WEBP ya PDF upload karo."); return; }
    setFile(f); setResult(null); setError(""); setMimeType(f.type);
    const reader = new FileReader();
    reader.onload = ev => {
      setB64(ev.target.result.split(",")[1]);
      setPreview(f.type.startsWith("image/") ? ev.target.result : null);
    };
    reader.readAsDataURL(f);
  }

  function removeFile() {
    setFile(null); setB64(null); setPreview(null);
    setMimeType(null); setResult(null); setError("");
    if (inputRef.current) inputRef.current.value = "";
  }

  async function analyze() {
    if (!file || !b64) return;
    setLoading(true); setResult(null); setError("");
    try {
      const res  = await fetch(`${API_BASE}/api/gemini-report`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ base64: b64, mimeType }),
      });
      const data = await res.json();
      if (!res.ok || data.error) throw new Error(data.error || "Server error");
      setResult(data);
    } catch (err) {
      setError(err.message || "Analysis fail ho gayi. Dobara try karein.");
    }
    setLoading(false);
  }

  const conditions  = result?.conditions || [];
  const risky       = conditions.filter(c => getSeverityClass(c.severity) === "danger");
  const caution     = conditions.filter(c => getSeverityClass(c.severity) === "caution");
  const normal      = conditions.filter(c => getSeverityClass(c.severity) === "normal");
  const sortedConds = [...risky, ...caution, ...normal];
  const hasResult   = result && result.reportType !== "Not a medical report";

  const canAnalyze  = !!file && !loading;

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      minHeight: "100vh",
      background: G.bg,
      padding: "2.5rem 1rem",
      position: "relative",
      overflow: "hidden",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');

        @keyframes raLoaderPulse {
          0%,80%,100% { opacity:0.2; transform:scale(0.8); }
          40%         { opacity:1;   transform:scale(1); }
        }
        @keyframes raFadeUp {
          from { opacity:0; transform:translateY(14px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes raBlob {
          0%   { transform: translate(0,0) scale(1); }
          100% { transform: translate(2%,2%) scale(1.05); }
        }

        .ra-blob { animation: raBlob 12s infinite alternate; will-change: transform; }
        .ra-fade  { animation: raFadeUp 0.45s ease both; }
        .ra-fade2 { animation: raFadeUp 0.45s ease 0.1s both; }
        .ra-fade3 { animation: raFadeUp 0.45s ease 0.18s both; }

        .ra-drop { transition: all 0.2s ease; }
        .ra-drop:hover {
          border-color: ${G.primary} !important;
          background: rgba(5,20,8,0.98) !important;
        }

        .ra-analyze-btn:hover:not(:disabled) {
          opacity: 0.88 !important;
          transform: translateY(-1px) !important;
          box-shadow: 0 8px 22px rgba(34,197,94,0.28) !important;
        }
        .ra-analyze-btn:active:not(:disabled) { transform: scale(0.98) !important; }

        .ra-remove-btn:hover { color: #f87171 !important; }

        .ra-finding:hover { border-color: rgba(34,197,94,0.28) !important; }

        * { box-sizing: border-box; }
      `}</style>

      {/* Background blobs */}
      <div className="ra-blob" style={{
        position: "fixed", top: "-15%", left: "-8%",
        width: "65%", height: "65%",
        background: "radial-gradient(circle, rgba(34,197,94,0.09) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none", zIndex: 0,
      }} />
      <div className="ra-blob" style={{
        position: "fixed", bottom: "-15%", right: "-8%",
        width: "65%", height: "65%",
        background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)",
        borderRadius: "50%", filter: "blur(90px)", pointerEvents: "none", zIndex: 0,
        animationDelay: "1.5s",
      }} />

      <div style={{ maxWidth: 660, margin: "0 auto", position: "relative", zIndex: 2 }}>

        {/* ── Header ── */}
        <div className="ra-fade" style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            height: 3, width: 44, margin: "0 auto 20px",
            background: `linear-gradient(90deg, ${G.primaryDeep}, ${G.primary})`,
            borderRadius: 2,
          }} />
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 54, height: 54, borderRadius: 16, marginBottom: 14,
            background: G.primaryFaint, border: `1px solid ${G.primaryBorder}`,
          }}>
            <span style={{ fontSize: 26 }}>🛡️</span>
          </div>
          <h1 style={{
            fontSize: 24, fontWeight: 700, color: G.textPrimary,
            margin: "0 0 6px", letterSpacing: "-0.02em",
          }}>
            Medical Report Analyzer
          </h1>
          <p style={{ fontSize: 13, color: G.textFaint, margin: 0 }}>
           Upload your lab report or scan — AI will identify what is normal and what may be risky.
          </p>
        </div>

        {/* ── Upload Card ── */}
        <div className="ra-fade2" style={{
          background: G.card,
          border: `1px solid ${G.cardBorder}`,
          borderRadius: 20, padding: 24, marginBottom: 16,
          backdropFilter: "blur(14px)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
        }}>
          {/* Dropzone */}
          {!file ? (
            <div
              className="ra-drop"
              onClick={() => inputRef.current.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); loadFile(e.dataTransfer.files[0]); }}
              style={{
                border: `1.5px dashed ${dragging ? G.primary : G.inputBorder}`,
                borderRadius: 12, padding: "2.5rem 1.5rem", textAlign: "center",
                cursor: "pointer",
                background: dragging ? "rgba(34,197,94,0.05)" : G.inputBg,
              }}
            >
              <div style={{ fontSize: 34, marginBottom: 12 }}>📋</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: G.textPrimary, marginBottom: 5 }}>
                Drop your medical report here.
              </div>
              <div style={{ fontSize: 12, color: G.textFaint, marginBottom: 14 }}>
               Or click here to browse.
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                {["JPG", "PNG", "WEBP", "PDF"].map(t => (
                  <span key={t} style={{
                    padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 700,
                    background: G.primaryFaint, color: G.primary,
                    border: `1px solid ${G.primaryBorder}`, letterSpacing: "0.05em",
                  }}>{t}</span>
                ))}
                <span style={{
                  padding: "3px 10px", borderRadius: 6, fontSize: 11,
                  background: "rgba(5,20,8,0.8)", color: G.textFaint,
                  border: `1px solid ${G.inputBorder}`,
                }}>Max 20 MB</span>
              </div>
            </div>
          ) : (
            /* File preview row */
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 14px", borderRadius: 10,
              border: `1px solid ${G.inputBorder}`, background: G.inputBg,
            }}>
              {preview ? (
                <img src={preview} alt="preview" style={{
                  width: 50, height: 50, borderRadius: 8,
                  objectFit: "cover", border: `1px solid ${G.inputBorder}`,
                }} />
              ) : (
                <div style={{
                  width: 50, height: 50, borderRadius: 8,
                  background: G.primaryFaint, border: `1px solid ${G.primaryBorder}`,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                }}>📄</div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13, fontWeight: 600, color: G.textPrimary,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{file.name}</div>
                <div style={{ fontSize: 11, color: G.textFaint, marginTop: 3 }}>
                  {(file.size / 1024).toFixed(1)} KB &nbsp;·&nbsp;
                  <span style={{ color: G.primary, fontWeight: 600 }}>Ready to Analyze.</span>
                </div>
              </div>
              <button
                className="ra-remove-btn"
                onClick={removeFile}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 18, color: G.textFaint, padding: 4,
                  transition: "color 0.15s", lineHeight: 1,
                }}
              >✕</button>
            </div>
          )}

          <input
            ref={inputRef} type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            style={{ display: "none" }}
            onChange={e => loadFile(e.target.files[0])}
          />

          {/* Analyze button */}
          <button
            className="ra-analyze-btn"
            onClick={analyze}
            disabled={!canAnalyze}
            style={{
              marginTop: 14, width: "100%", padding: "12px 24px",
              borderRadius: 40, border: "none",
              cursor: canAnalyze ? "pointer" : "not-allowed",
              background: canAnalyze
                ? `linear-gradient(90deg, ${G.primaryDeep}, ${G.primaryMid}, ${G.primary})`
                : "rgba(5,20,8,0.8)",
              color: canAnalyze ? "#F0FFF4" : G.textFaint,
              fontSize: 14, fontWeight: 700,
              transition: "all 0.2s ease",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              opacity: canAnalyze ? 1 : 0.5,
              boxShadow: canAnalyze ? "0 4px 14px rgba(34,197,94,0.22)" : "none",
              letterSpacing: "0.01em",
            }}
          >
            {loading ? (
              <><span>⏳</span> Analyzing...</>
            ) : (
              <><span>🔬</span> Analyze the Report.</>
            )}
          </button>
        </div>

        {/* ── Results ── */}
        {(loading || result || error) && (
          <div className="ra-fade3" style={{
            background: G.card,
            border: `1px solid ${G.cardBorder}`,
            borderRadius: 20, overflow: "hidden",
            marginBottom: 16,
            backdropFilter: "blur(14px)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
          }}>
            {/* Green top line */}
            <div style={{ height: 2, background: `linear-gradient(90deg, ${G.primaryDeep}, ${G.primary})` }} />

            {/* Result header */}
            <div style={{
              padding: "12px 22px",
              background: G.inputBg, borderBottom: `1px solid ${G.inputBorder}`,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ color: G.primary, fontSize: 13 }}>✦</span>
              <span style={{ fontSize: 13, fontWeight: 700, color: G.textPrimary, letterSpacing: "0.02em" }}>
                AI Analysis
              </span>
              {result && hasResult && (
                <span style={{
                  marginLeft: "auto", fontSize: 10, fontWeight: 700,
                  background: G.primaryFaint, color: G.primary,
                  border: `1px solid ${G.primaryBorder}`,
                  padding: "3px 10px", borderRadius: 20, letterSpacing: "0.06em",
                }}>✓ COMPLETE</span>
              )}
            </div>

            <div style={{ padding: "20px 22px" }}>

              {/* Loading */}
              {loading && <Loader />}

              {/* Error */}
              {error && (
                <div style={{
                  display: "flex", gap: 12, padding: "12px 14px",
                  borderRadius: 10, background: G.dangerBg, border: `1px solid ${G.dangerBorder}`,
                }}>
                  <span style={{ fontSize: 18 }}>⚠️</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: G.dangerText, marginBottom: 3 }}>
                      Analysis Fail Ho Gayi
                    </div>
                    <div style={{ fontSize: 12, color: "#e05555" }}>{error}</div>
                  </div>
                </div>
              )}

              {/* Not medical */}
              {result && result.reportType === "Not a medical report" && (
                <div style={{
                  display: "flex", gap: 12, padding: "12px 14px",
                  borderRadius: 10, background: G.warnBg, border: `1px solid ${G.warnBorder}`,
                }}>
                  <span style={{ fontSize: 18 }}>📄</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: G.warnText, marginBottom: 3 }}>
                     Medical Report Not Found.
                    </div>
                    <div style={{ fontSize: 12, color: "#b09030" }}>
                     Please upload the lab report, blood test result, or medical scan.
                    </div>
                  </div>
                </div>
              )}

              {/* Full result */}
              {hasResult && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                  {/* Report type tag */}
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    padding: "5px 12px", borderRadius: 8,
                    background: G.primaryFaint, border: `1px solid ${G.primaryBorder}`,
                    alignSelf: "flex-start",
                  }}>
                    <span style={{ fontSize: 13 }}>📑</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: G.primary }}>{result.reportType}</span>
                  </div>

                  {/* Summary cards */}
                  <div>
                    <SectionLabel>Quick Summary</SectionLabel>
                    <div style={{ display: "flex", gap: 10 }}>
                      <SummaryCard count={risky.length}   label="Risky items" type="danger"  />
                      <SummaryCard count={caution.length} label="Pay Attention."    type="caution" />
                      <SummaryCard count={normal.length}  label="Normal"  type="normal"  />
                    </div>
                  </div>

                  {/* Findings */}
                  <div>
                    <SectionLabel>What Was Found in the Report?</SectionLabel>
                    {sortedConds.length > 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {sortedConds.map((c, i) => (
                          <div key={i} className="ra-finding">
                            <FindingCard condition={c} />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{
                        display: "flex", gap: 12, padding: "12px 14px",
                        borderRadius: 10, background: G.okBg, border: `1px solid ${G.okBorder}`,
                      }}>
                        <span style={{ fontSize: 18 }}>✅</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700, color: G.primary, marginBottom: 3 }}>
                           Everything is normal.
                          </div>
                          <div style={{ fontSize: 12, color: G.textMuted }}>
                           No abnormalities were found in this report.
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Key findings */}
                  {result.keyFindings?.length > 0 && (
                    <div>
                      <SectionLabel>Key Findings</SectionLabel>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {result.keyFindings.map((f, i) => (
                          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <div style={{
                              width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                              background: G.primaryFaint, border: `1px solid ${G.primaryBorder}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 10, color: G.primary, fontWeight: 700, marginTop: 2,
                            }}>{i + 1}</div>
                            <span style={{ fontSize: 13, color: G.textMuted, lineHeight: 1.65 }}>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recommendation */}
                  {result.recommendation && (
                    <div style={{
                      padding: "14px 16px", borderRadius: 12,
                      background: G.inputBg, border: `1px solid ${G.inputBorder}`,
                      display: "flex", gap: 12, alignItems: "flex-start",
                    }}>
                      <span style={{ fontSize: 20 }}>🩺</span>
                      <div>
                        <SectionLabel>Doctor’s Advice.</SectionLabel>
                        <p style={{ fontSize: 13, color: G.textMuted, margin: 0, lineHeight: 1.7 }}>
                          {result.recommendation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Green bottom line */}
            <div style={{ height: 2, background: `linear-gradient(90deg, ${G.primaryDeep}, ${G.primary})` }} />
          </div>
        )}

        {/* ── Disclaimer ── */}
        <div style={{
          padding: "10px 16px", borderRadius: 12,
          background: G.inputBg, border: `1px solid ${G.inputBorder}`,
          display: "flex", gap: 8, alignItems: "flex-start",
          fontSize: 12, color: G.textFaint, lineHeight: 1.6,
        }}>
          <span style={{ flexShrink: 0 }}>⚠️</span>
          <span>
            This AI analysis is for informational purposes only. Please consult your doctor for any health-related decisions.
          </span>
        </div>

      </div>
    </div>
  );
}