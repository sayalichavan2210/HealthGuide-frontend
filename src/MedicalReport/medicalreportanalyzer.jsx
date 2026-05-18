import { useState, useRef } from "react";

const API_BASE = "http://localhost:5000";

// ── Helpers ───────────────────────────────────────────────────────────────────
const getSeverityClass = (s = "") => {
  const v = s.toLowerCase();
  if (v === "high" || v === "critical") return "danger";
  if (v === "medium" || v === "moderate") return "caution";
  return "normal";
};

const getSeverityLabel = (s = "") => {
  const v = s.toLowerCase();
  if (v === "high" || v === "critical") return "Risky";
  if (v === "medium" || v === "moderate") return "Dhyan do";
  return "Normal";
};

// ── Sub-components ────────────────────────────────────────────────────────────
const SeverityBadge = ({ severity }) => {
  const cls = getSeverityClass(severity);
  const label = getSeverityLabel(severity);
  const styles = {
    danger:  { background: "#2a0e0e", color: "#f87171", border: "0.5px solid #4a1a1a" },
    caution: { background: "#1e1a08", color: "#e6b84a", border: "0.5px solid #3a3010" },
    normal:  { background: "#081e14", color: "#4ade80", border: "0.5px solid #0f3a24" },
  };
  const icons = { danger: "⚠", caution: "◈", normal: "✓" };
  return (
    <span style={{
      ...styles[cls],
      display: "inline-flex", alignItems: "center", gap: 5,
      padding: "3px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 600, letterSpacing: "0.04em",
    }}>
      <span>{icons[cls]}</span>
      {label.toUpperCase()}
    </span>
  );
};

const SummaryCard = ({ count, label, type }) => {
  const styles = {
    danger:  { bg: "#2a0e0e", border: "#4a1a1a", num: "#f87171", lbl: "#e05555" },
    caution: { bg: "#1e1a08", border: "#3a3010", num: "#e6b84a", lbl: "#c9953c" },
    normal:  { bg: "#081e14", border: "#0f3a24", num: "#4ade80", lbl: "#38bb6a" },
  };
  const icons = { danger: "⚠", caution: "◈", normal: "✓" };
  const s = styles[type];
  return (
    <div style={{
      background: s.bg, border: `0.5px solid ${s.border}`,
      borderRadius: 12, padding: "14px 16px", textAlign: "center", flex: 1,
    }}>
      <div style={{ fontSize: 28, fontWeight: 500, color: s.num, lineHeight: 1 }}>{count}</div>
      <div style={{ fontSize: 11, color: s.lbl, marginTop: 5, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
        <span>{icons[type]}</span>{label}
      </div>
    </div>
  );
};

const FindingCard = ({ condition }) => {
  const cls = getSeverityClass(condition.severity);
  const styles = {
    danger:  { bg: "#2a0e0e", border: "#4a1a1a", icon: "#f87171", iconBg: "#3a1010" },
    caution: { bg: "#1e1a08", border: "#3a3010", icon: "#e6b84a", iconBg: "#2a2008" },
    normal:  { bg: "#081e14", border: "#0f3a24", icon: "#4ade80", iconBg: "#0a2418" },
  };
  const icons = { danger: "⚠", caution: "◈", normal: "✓" };
  const s = styles[cls];
  return (
    <div style={{
      background: s.bg, border: `0.5px solid ${s.border}`,
      borderRadius: 12, padding: "14px 16px",
      display: "flex", alignItems: "flex-start", gap: 12,
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: "50%",
        background: s.iconBg, border: `0.5px solid ${s.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 15, color: s.icon, flexShrink: 0,
      }}>
        {icons[cls]}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 5 }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: "#eee8d0" }}>{condition.name}</span>
          {condition.value && (
            <span style={{
              fontSize: 12, fontWeight: 500, padding: "2px 8px", borderRadius: 6,
              background: s.iconBg, border: `0.5px solid ${s.border}`, color: s.icon,
            }}>{condition.value}</span>
          )}
          <SeverityBadge severity={condition.severity} />
        </div>
        <p style={{ fontSize: 12, color: "#6a7a9a", margin: 0, lineHeight: 1.6 }}>{condition.detail}</p>
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
          background: "#c9a84c", display: "inline-block",
          animation: "hgPulse 1.4s ease-in-out infinite",
          animationDelay: `${d}s`,
        }} />
      ))}
    </div>
    <span style={{ fontSize: 13, color: "#c9a84c", fontWeight: 500 }}>
      Report scan ho rahi hai AI se…
    </span>
  </div>
);

// ── Main Component ────────────────────────────────────────────────────────────
export default function ReportAnalyzer() {
  const [file, setFile]         = useState(null);
  const [b64, setB64]           = useState(null);
  const [mimeType, setMimeType] = useState(null);
  const [preview, setPreview]   = useState(null);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [result, setResult]     = useState(null);
  const [error, setError]       = useState("");
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
      const res = await fetch(`${API_BASE}/api/gemini-report`, {
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

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
      minHeight: "100vh",
      background: "#0b0f1e",
      padding: "2.5rem 1rem",
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600&display=swap');
        @keyframes hgPulse { 0%,80%,100%{opacity:0.2;transform:scale(0.8)} 40%{opacity:1;transform:scale(1)} }
        @keyframes hgFadeUp { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:translateY(0)} }
        .hg-drop:hover { border-color: #c9a84c !important; background: #0e1020 !important; }
        .hg-btn:hover:not(:disabled) { background: #252510 !important; }
        .hg-btn:active:not(:disabled) { transform: scale(0.98); }
        .hg-fcard { transition: border-color 0.15s; }
        .hg-fcard:hover { border-color: #2a2a4a !important; }
        .hg-remove:hover { color: #f87171 !important; }
        * { box-sizing: border-box; }
      `}</style>

      <div style={{ maxWidth: 660, margin: "0 auto" }}>

        {/* ── Header ── */}
        <div style={{ textAlign: "center", marginBottom: "2rem", animation: "hgFadeUp 0.5s ease both" }}>
          {/* Gold top line */}
          <div style={{ height: 3, background: "#c9a84c", borderRadius: 2, width: 48, margin: "0 auto 20px" }} />
          <div style={{
            display: "inline-flex", alignItems: "center", justifyContent: "center",
            width: 52, height: 52, borderRadius: 14, marginBottom: 12,
            background: "#1a1a08", border: "0.5px solid #3a3010",
          }}>
            <span style={{ fontSize: 24 }}>🛡️</span>
          </div>
          <h1 style={{
            fontSize: 24, fontWeight: 600, color: "#eee8d0",
            margin: "0 0 6px", letterSpacing: "-0.02em",
          }}>
            Medical Report Analyzer
          </h1>
          <p style={{ fontSize: 13, color: "#3d4d70", margin: 0 }}>
            Lab report ya scan upload karo — AI batayega kya normal hai aur kya risky
          </p>
        </div>

        {/* ── Upload Card ── */}
        <div style={{
          background: "#0f1628", border: "0.5px solid #1e2a4a",
          borderRadius: 18, padding: 24, marginBottom: 16,
          animation: "hgFadeUp 0.5s ease 0.1s both",
        }}>

          {/* Drop zone */}
          {!file ? (
            <div
              className="hg-drop"
              onClick={() => inputRef.current.click()}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={e => { e.preventDefault(); setDragging(false); loadFile(e.dataTransfer.files[0]); }}
              style={{
                border: `1.5px dashed ${dragging ? "#c9a84c" : "#1e2a4a"}`,
                borderRadius: 12, padding: "2.5rem 1.5rem", textAlign: "center",
                cursor: "pointer",
                background: dragging ? "#0e1020" : "#0a0e1c",
                transition: "all 0.2s ease",
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "#d4c490", marginBottom: 5 }}>
                Apni medical report yahan drop karo
              </div>
              <div style={{ fontSize: 12, color: "#3d4d70", marginBottom: 14 }}>
                ya click karke browse karo
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "center" }}>
                {["JPG", "PNG", "WEBP", "PDF"].map(t => (
                  <span key={t} style={{
                    padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 600,
                    background: "#1a1a08", color: "#c9a84c",
                    border: "0.5px solid #3a3010", letterSpacing: "0.05em",
                  }}>{t}</span>
                ))}
                <span style={{
                  padding: "3px 10px", borderRadius: 6, fontSize: 11,
                  background: "#0a0e1c", color: "#3d4d70", border: "0.5px solid #1a2340",
                }}>Max 20 MB</span>
              </div>
            </div>
          ) : (
            /* File preview */
            <div style={{
              display: "flex", alignItems: "center", gap: 12,
              padding: "12px 14px", borderRadius: 10,
              border: "0.5px solid #1e2a4a", background: "#0a0e1c",
            }}>
              {preview ? (
                <img src={preview} alt="preview" style={{
                  width: 50, height: 50, borderRadius: 8,
                  objectFit: "cover", border: "0.5px solid #1e2a4a",
                }} />
              ) : (
                <div style={{
                  width: 50, height: 50, borderRadius: 8,
                  background: "#1a1a08", border: "0.5px solid #3a3010",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
                }}>📄</div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 13, fontWeight: 600, color: "#d4c490",
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{file.name}</div>
                <div style={{ fontSize: 11, color: "#3d4d70", marginTop: 3 }}>
                  {(file.size / 1024).toFixed(1)} KB &nbsp;·&nbsp;
                  <span style={{ color: "#4ade80", fontWeight: 500 }}>Analyze karne ke liye taiyaar</span>
                </div>
              </div>
              <button
                className="hg-remove"
                onClick={removeFile}
                style={{
                  background: "none", border: "none", cursor: "pointer",
                  fontSize: 18, color: "#2a3a5a", padding: 4, transition: "color 0.15s", lineHeight: 1,
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
            className="hg-btn"
            onClick={analyze}
            disabled={!file || loading}
            style={{
              marginTop: 14, width: "100%", padding: "12px 24px",
              borderRadius: 10, border: "0.5px solid #c9a84c", cursor: (!file || loading) ? "not-allowed" : "pointer",
              background: (!file || loading) ? "#0a0e1c" : "#1a1a08",
              color: (!file || loading) ? "#2a3a5a" : "#c9a84c",
              fontSize: 14, fontWeight: 600,
              transition: "all 0.2s ease",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              opacity: (!file || loading) ? 0.5 : 1,
            }}
          >
            {loading ? (
              <><span>⏳</span> Analyzing...</>
            ) : (
              <><span>🔬</span> Report Analyze Karo</>
            )}
          </button>
        </div>

        {/* ── Results ── */}
        {(loading || result || error) && (
          <div style={{
            background: "#0f1628", border: "0.5px solid #1e2a4a",
            borderRadius: 18, overflow: "hidden",
            animation: "hgFadeUp 0.4s ease both", marginBottom: 16,
          }}>
            {/* Gold top line */}
            <div style={{ height: 2, background: "#c9a84c" }} />

            {/* Result header */}
            <div style={{
              padding: "12px 22px",
              background: "#0a0e1c", borderBottom: "0.5px solid #1a2340",
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ fontSize: 14 }}>✦</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#d4c490", letterSpacing: "0.02em" }}>
                AI Analysis
              </span>
              {result && hasResult && (
                <span style={{
                  marginLeft: "auto", fontSize: 11, fontWeight: 600,
                  background: "#1a1a08", color: "#c9a84c",
                  border: "0.5px solid #3a3010",
                  padding: "3px 10px", borderRadius: 20, letterSpacing: "0.05em",
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
                  borderRadius: 10, background: "#2a0e0e", border: "0.5px solid #4a1a1a",
                }}>
                  <span style={{ fontSize: 18 }}>⚠️</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#f87171", marginBottom: 3 }}>Analysis Fail Ho Gayi</div>
                    <div style={{ fontSize: 12, color: "#e05555" }}>{error}</div>
                  </div>
                </div>
              )}

              {/* Not a medical report */}
              {result && result.reportType === "Not a medical report" && (
                <div style={{
                  display: "flex", gap: 12, padding: "12px 14px",
                  borderRadius: 10, background: "#1e1a08", border: "0.5px solid #3a3010",
                }}>
                  <span style={{ fontSize: 18 }}>📄</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#e6b84a", marginBottom: 3 }}>Medical Report Nahi Mili</div>
                    <div style={{ fontSize: 12, color: "#b09030" }}>Kripya lab report, blood test result, ya medical scan upload karein.</div>
                  </div>
                </div>
              )}

              {/* Full result */}
              {hasResult && (
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

                  {/* Report type tag */}
                  <div style={{
                    display: "inline-flex", alignItems: "center", gap: 7,
                    padding: "6px 14px", borderRadius: 8,
                    background: "#1a1a08", border: "0.5px solid #3a3010",
                    alignSelf: "flex-start",
                  }}>
                    <span style={{ fontSize: 13 }}>📑</span>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#c9a84c" }}>{result.reportType}</span>
                  </div>

                  {/* ── Summary cards ── */}
                  <div>
                    <div style={{
                      fontSize: 11, fontWeight: 600, color: "#3d4d70",
                      letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 10,
                    }}>Quick Summary</div>
                    <div style={{ display: "flex", gap: 10 }}>
                      <SummaryCard count={risky.length}   label="Risky items"  type="danger"  />
                      <SummaryCard count={caution.length} label="Dhyan do"     type="caution" />
                      <SummaryCard count={normal.length}  label="Normal hai"   type="normal"  />
                    </div>
                  </div>

                  {/* ── Findings ── */}
                  <div>
                    <div style={{
                      fontSize: 11, fontWeight: 600, color: "#3d4d70",
                      letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 10,
                    }}>Report Mein Kya Mila</div>

                    {sortedConds.length > 0 ? (
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {sortedConds.map((c, i) => <FindingCard key={i} condition={c} />)}
                      </div>
                    ) : (
                      <div style={{
                        display: "flex", gap: 12, padding: "12px 14px",
                        borderRadius: 10, background: "#081e14", border: "0.5px solid #0f3a24",
                      }}>
                        <span style={{ fontSize: 18 }}>✅</span>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#4ade80", marginBottom: 3 }}>Sab Kuch Normal Hai</div>
                          <div style={{ fontSize: 12, color: "#38a860" }}>Is report mein koi abnormality nahi mili.</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ── Key findings ── */}
                  {result.keyFindings?.length > 0 && (
                    <div>
                      <div style={{
                        fontSize: 11, fontWeight: 600, color: "#3d4d70",
                        letterSpacing: "0.09em", textTransform: "uppercase", marginBottom: 10,
                      }}>Key Findings</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                        {result.keyFindings.map((f, i) => (
                          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                            <div style={{
                              width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                              background: "#1a1a08", border: "0.5px solid #3a3010",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 10, color: "#c9a84c", fontWeight: 700, marginTop: 2,
                            }}>{i + 1}</div>
                            <span style={{ fontSize: 13, color: "#6a7a9a", lineHeight: 1.65 }}>{f}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Recommendation ── */}
                  {result.recommendation && (
                    <div style={{
                      padding: "14px 16px", borderRadius: 10,
                      background: "#0a0e1c", border: "0.5px solid #1e2a4a",
                      display: "flex", gap: 12, alignItems: "flex-start",
                    }}>
                      <span style={{ fontSize: 20 }}>🩺</span>
                      <div>
                        <div style={{
                          fontSize: 11, fontWeight: 600, color: "#3d4d70",
                          textTransform: "uppercase", letterSpacing: "0.07em", marginBottom: 6,
                        }}>Doctor Ki Salah</div>
                        <p style={{ fontSize: 13, color: "#6a7a9a", margin: 0, lineHeight: 1.7 }}>
                          {result.recommendation}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Gold bottom line */}
            <div style={{ height: 2, background: "#c9a84c" }} />
          </div>
        )}

        {/* ── Disclaimer ── */}
        <div style={{
          padding: "10px 14px", borderRadius: 10,
          background: "#0f1628", border: "0.5px solid #1a2340",
          display: "flex", gap: 8, alignItems: "flex-start",
          fontSize: 12, color: "#2a3a5a", lineHeight: 1.6,
        }}>
          <span style={{ flexShrink: 0 }}>⚠️</span>
          <span>Yeh AI analysis sirf jaankari ke liye hai. Kisi bhi health decision ke liye apne doctor se zaroor milein.</span>
        </div>

      </div>
    </div>
  );
}