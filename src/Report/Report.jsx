import { useState } from "react";
import { useGetHistoryQuery } from "../Api/healthApi";
import { useNavigate } from "react-router-dom";

// ── Helpers ───────────────────────────────────────────────
const getRiskColor = (v) => v > 0.6 ? "#F87171" : v > 0.35 ? "#FBBF24" : "#4ADE80";
const getRiskLabel = (v) => v > 0.6 ? "High" : v > 0.35 ? "Moderate" : "Low";
const getPct       = (v) => Math.round((v || 0) * 100);
const fmtDate      = (d) => new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });

// ── Mini Sparkline SVG ────────────────────────────────────
function Sparkline({ data, color }) {
  if (!data || data.length < 2) return null;
  const max = Math.max(...data, 0.01);
  const W = 80, H = 28;
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * W;
    const y = H - (v / max) * H;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={W} height={H} style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />
      <circle cx={parseFloat(pts.split(" ").at(-1)?.split(",")[0])} cy={parseFloat(pts.split(" ").at(-1)?.split(",")[1])} r="2.5" fill={color} />
    </svg>
  );
}

// ── Trend Badge ───────────────────────────────────────────
function TrendBadge({ values }) {
  if (!values || values.length < 2) return null;
  const diff = values.at(-1) - values.at(-2);
  if (Math.abs(diff) < 0.01) return <span style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.3)" }}>→ Stable</span>;
  const up = diff > 0;
  return (
    <span style={{ fontSize: "0.7rem", color: up ? "#F87171" : "#4ADE80", fontWeight: 600 }}>
      {up ? "↑" : "↓"} {getPct(Math.abs(diff))}%
    </span>
  );
}

// ── Bar Chart ─────────────────────────────────────────────
function BarChart({ profiles }) {
  const last8 = [...profiles].reverse().slice(0, 8);
  const keys  = [
    { k: "diabetes",     label: "Diabetes",    color: "#818CF8" },
    { k: "heartDisease", label: "Heart",        color: "#F87171" },
    { k: "hypertension", label: "Hypertension", color: "#FBBF24" },
  ];
  return (
    <div style={{ overflowX: "auto" }}>
      <div style={{ minWidth: "400px", padding: "0.5rem 0" }}>
        {last8.map((p, i) => {
          const s = p.riskScores || {};
          return (
            <div key={p._id} style={{ marginBottom: "1.1rem" }}>
              <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.3)", marginBottom: "5px", letterSpacing: "0.04em" }}>
                {fmtDate(p.createdAt)}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                {keys.map(({ k, label, color }) => {
                  const pct = getPct(s[k] || 0);
                  return (
                    <div key={k} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <span style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.35)", width: "72px", flexShrink: 0 }}>{label}</span>
                      <div style={{ flex: 1, height: "6px", background: "rgba(255,255,255,0.06)", borderRadius: "3px", overflow: "hidden" }}>
                        <div style={{ height: "100%", width: `${pct}%`, background: color, borderRadius: "3px", transition: "width 0.8s ease", boxShadow: `0 0 6px ${color}44` }} />
                      </div>
                      <span style={{ fontSize: "0.7rem", color, fontWeight: 600, width: "32px", textAlign: "right" }}>{pct}%</span>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Assessment Card ───────────────────────────────────────
function AssessmentCard({ profile, index }) {
  const [open, setOpen] = useState(false);
  const s = profile.riskScores || {};
  const overall = s.overallRisk || "low";
  const oColor  = ["high","very_high"].includes(overall) ? "#F87171" : overall === "moderate" ? "#FBBF24" : "#4ADE80";

  return (
    <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: "14px", marginBottom: "0.75rem", overflow: "hidden", transition: "border-color 0.2s" }}>
      {/* Row */}
      <div onClick={() => setOpen(o => !o)} style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem 1.25rem", cursor: "pointer" }}>
        <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "rgba(255,255,255,0.05)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.75rem", color: "rgba(255,255,255,0.4)", fontWeight: 600, flexShrink: 0 }}>
          #{index + 1}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "#fff", marginBottom: "3px" }}>{fmtDate(profile.createdAt)}</div>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
            {[
              { k: "diabetes",     l: "D" },
              { k: "heartDisease", l: "H" },
              { k: "hypertension", l: "BP" },
            ].map(({ k, l }) => (
              <span key={k} style={{ fontSize: "0.65rem", padding: "1px 6px", borderRadius: "4px", background: `${getRiskColor(s[k])}15`, color: getRiskColor(s[k]), fontWeight: 600 }}>
                {l}: {getPct(s[k])}%
              </span>
            ))}
          </div>
        </div>
        <div style={{ textAlign: "right", flexShrink: 0 }}>
          <div style={{ fontSize: "0.7rem", color: oColor, fontWeight: 700, textTransform: "capitalize", marginBottom: "2px" }}>{overall.replace("_", " ")}</div>
          <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)" }}>BMI: {profile.bmi || "—"}</div>
        </div>
        <div style={{ color: "rgba(255,255,255,0.2)", fontSize: "0.75rem", flexShrink: 0, transform: open ? "rotate(90deg)" : "none", transition: "transform 0.2s" }}>▶</div>
      </div>

      {/* Expanded */}
      {open && (
        <div style={{ padding: "0 1.25rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0.6rem", marginTop: "1rem" }}>
            {[
              { label: "Diabetes",    val: s.diabetes,     icon: "🩸" },
              { label: "Heart",       val: s.heartDisease, icon: "❤️" },
              { label: "Hypertension",val: s.hypertension, icon: "🩺" },
            ].map(({ label, val, icon }) => (
              <div key={label} style={{ padding: "0.75rem", background: "rgba(255,255,255,0.03)", borderRadius: "10px", border: `1px solid ${getRiskColor(val)}18`, textAlign: "center" }}>
                <div style={{ fontSize: "1rem", marginBottom: "4px" }}>{icon}</div>
                <div style={{ fontSize: "1.2rem", fontWeight: 700, color: getRiskColor(val) }}>{getPct(val)}%</div>
                <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.3)", marginTop: "2px" }}>{label}</div>
                <div style={{ height: "3px", background: "rgba(255,255,255,0.06)", borderRadius: "2px", marginTop: "6px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${getPct(val)}%`, background: getRiskColor(val), borderRadius: "2px" }} />
                </div>
              </div>
            ))}
          </div>

          {profile.symptoms?.length > 0 && (
            <div style={{ marginTop: "0.75rem" }}>
              <div style={{ fontSize: "0.65rem", color: "rgba(255,255,255,0.25)", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "6px" }}>Symptoms</div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {profile.symptoms.map(sym => (
                  <span key={sym} style={{ fontSize: "0.7rem", padding: "2px 8px", background: "rgba(255,255,255,0.05)", borderRadius: "20px", color: "rgba(255,255,255,0.45)" }}>
                    {sym.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────
export default function ReportPage() {
  const [page, setPage]     = useState(1);
  const [tab, setTab]       = useState("history"); // "history" | "trends"
  const navigate            = useNavigate();

  const { data, isLoading, isError } = useGetHistoryQuery({ page, limit: 10 });

  const profiles = data?.profiles || [];
  const total    = data?.total    || 0;
  const pages    = data?.pages    || 1;

  // Trend data — latest 8, oldest first
  const trendData = [...profiles].reverse();
  const diaVals   = trendData.map(p => p.riskScores?.diabetes     || 0);
  const htVals    = trendData.map(p => p.riskScores?.heartDisease || 0);
  const bpVals    = trendData.map(p => p.riskScores?.hypertension || 0);

  // Summary stats
  const avgDia = diaVals.length ? diaVals.reduce((a,b) => a+b,0)/diaVals.length : 0;
  const avgHt  = htVals.length  ? htVals.reduce((a,b) => a+b,0)/htVals.length   : 0;
  const avgBp  = bpVals.length  ? bpVals.reduce((a,b) => a+b,0)/bpVals.length   : 0;
  const highRiskCount = profiles.filter(p => ["high","very_high"].includes(p.riskScores?.overallRisk)).length;

  return (
    <div style={{ minHeight: "100vh", background: "#080808", fontFamily: "'DM Sans', system-ui, sans-serif", color: "#fff", position: "relative", overflow: "hidden" }}>
      {/* Background glows */}
      <div style={{ position:"fixed", top:"-10%", left:"-5%", width:"500px", height:"500px", background:"radial-gradient(circle, rgba(74,222,128,0.03) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />
      <div style={{ position:"fixed", bottom:"-10%", right:"-5%", width:"400px", height:"400px", background:"radial-gradient(circle, rgba(129,140,248,0.02) 0%, transparent 70%)", pointerEvents:"none", zIndex:0 }} />

      <div style={{ maxWidth: "680px", margin: "0 auto", padding: "2rem 1rem", position: "relative", zIndex: 1 }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "2rem" }}>
          <div>
            <div style={{ display:"flex", alignItems:"center", gap:"8px", marginBottom:"4px" }}>
              <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#4ADE80", boxShadow:"0 0 8px #4ADE8099" }} />
              <span style={{ fontSize:"0.65rem", color:"#4ADE80", fontWeight:600, letterSpacing:"0.12em", textTransform:"uppercase" }}>Health Reports</span>
            </div>
            <h1 style={{ margin:0, fontSize:"1.6rem", fontWeight:700, letterSpacing:"-0.02em" }}>Your Health History</h1>
            <p style={{ margin:"4px 0 0", fontSize:"0.8rem", color:"rgba(255,255,255,0.3)" }}>{total} assessment{total !== 1 ? "s" : ""} recorded</p>
          </div>
          <button onClick={() => navigate("/risk")} style={{ padding:"0.65rem 1.1rem", background:"#4ADE80", border:"none", borderRadius:"10px", color:"#000", fontSize:"0.82rem", fontWeight:700, cursor:"pointer", fontFamily:"inherit", whiteSpace:"nowrap" }}>
            + New Assessment
          </button>
        </div>

        {/* Summary Cards */}
        {profiles.length > 0 && (
          <div style={{ display:"grid", gridTemplateColumns:"repeat(4, 1fr)", gap:"0.6rem", marginBottom:"1.5rem" }}>
            {[
              { label:"Total", value:total, color:"#fff", icon:"📋" },
              { label:"High Risk", value:highRiskCount, color:"#F87171", icon:"⚠️" },
              { label:"Avg Diabetes", value:`${getPct(avgDia)}%`, color:"#818CF8", icon:"🩸" },
              { label:"Avg Heart", value:`${getPct(avgHt)}%`, color:"#F87171", icon:"❤️" },
            ].map(({ label, value, color, icon }) => (
              <div key={label} style={{ padding:"0.85rem 0.75rem", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"12px", textAlign:"center" }}>
                <div style={{ fontSize:"1.1rem", marginBottom:"4px" }}>{icon}</div>
                <div style={{ fontSize:"1.1rem", fontWeight:700, color, marginBottom:"2px" }}>{value}</div>
                <div style={{ fontSize:"0.62rem", color:"rgba(255,255,255,0.3)", fontWeight:600, letterSpacing:"0.04em" }}>{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Tabs */}
        <div style={{ display:"flex", gap:"4px", marginBottom:"1.5rem", background:"rgba(255,255,255,0.03)", borderRadius:"10px", padding:"4px" }}>
          {[["history","📋 History"],["trends","📈 Trends"]].map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)} style={{ flex:1, padding:"0.55rem", borderRadius:"7px", border:"none", fontFamily:"inherit", fontSize:"0.82rem", fontWeight:600, cursor:"pointer", transition:"all 0.2s",
              background: tab === t ? "rgba(74,222,128,0.12)" : "transparent",
              color: tab === t ? "#4ADE80" : "rgba(255,255,255,0.35)",
            }}>{label}</button>
          ))}
        </div>

        {/* Loading */}
        {isLoading && (
          <div style={{ textAlign:"center", padding:"4rem", color:"rgba(255,255,255,0.3)" }}>
            <div style={{ width:"32px", height:"32px", border:"2px solid rgba(74,222,128,0.3)", borderTopColor:"#4ADE80", borderRadius:"50%", animation:"spin 0.8s linear infinite", margin:"0 auto 1rem" }} />
            Loading...
          </div>
        )}

        {/* Error */}
        {isError && (
          <div style={{ textAlign:"center", padding:"3rem", background:"rgba(248,113,113,0.05)", border:"1px solid rgba(248,113,113,0.15)", borderRadius:"14px" }}>
            <div style={{ fontSize:"2rem", marginBottom:"0.75rem" }}>⚠️</div>
            <div style={{ color:"#F87171", fontWeight:600 }}>Data load nahi hua</div>
            <div style={{ color:"rgba(255,255,255,0.3)", fontSize:"0.82rem", marginTop:"4px" }}>Backend check karo</div>
          </div>
        )}

        {/* No data */}
        {!isLoading && !isError && profiles.length === 0 && (
          <div style={{ textAlign:"center", padding:"4rem 2rem", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"16px" }}>
            <div style={{ fontSize:"3rem", marginBottom:"1rem" }}>🏥</div>
            <div style={{ fontSize:"1.1rem", fontWeight:600, marginBottom:"0.5rem" }}>Koi assessment nahi mili</div>
            <div style={{ color:"rgba(255,255,255,0.35)", fontSize:"0.85rem", marginBottom:"1.5rem" }}>Pehla assessment karo apni health risk jaanne ke liye</div>
            <button onClick={() => navigate("/risk")} style={{ padding:"0.75rem 1.5rem", background:"#4ADE80", border:"none", borderRadius:"10px", color:"#000", fontWeight:700, fontSize:"0.9rem", cursor:"pointer", fontFamily:"inherit" }}>
              Start Assessment →
            </button>
          </div>
        )}

        {/* History Tab */}
        {!isLoading && !isError && profiles.length > 0 && tab === "history" && (
          <>
            {profiles.map((p, i) => <AssessmentCard key={p._id} profile={p} index={(page - 1) * 10 + i} />)}

            {/* Pagination */}
            {pages > 1 && (
              <div style={{ display:"flex", justifyContent:"center", gap:"0.5rem", marginTop:"1.5rem" }}>
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  style={{ padding:"0.55rem 1rem", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"8px", color: page === 1 ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)", cursor: page === 1 ? "not-allowed" : "pointer", fontSize:"0.82rem", fontFamily:"inherit" }}>
                  ← Prev
                </button>
                <div style={{ padding:"0.55rem 1rem", background:"rgba(74,222,128,0.08)", border:"1px solid rgba(74,222,128,0.2)", borderRadius:"8px", color:"#4ADE80", fontSize:"0.82rem", fontWeight:600 }}>
                  {page} / {pages}
                </div>
                <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
                  style={{ padding:"0.55rem 1rem", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.08)", borderRadius:"8px", color: page === pages ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.6)", cursor: page === pages ? "not-allowed" : "pointer", fontSize:"0.82rem", fontFamily:"inherit" }}>
                  Next →
                </button>
              </div>
            )}
          </>
        )}

        {/* Trends Tab */}
        {!isLoading && !isError && profiles.length > 0 && tab === "trends" && (
          <div>
            {/* Trend summary cards */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:"0.75rem", marginBottom:"1.5rem" }}>
              {[
                { label:"Diabetes",    vals:diaVals, color:"#818CF8", icon:"🩸", avg:avgDia },
                { label:"Heart",       vals:htVals,  color:"#F87171", icon:"❤️", avg:avgHt },
                { label:"Hypertension",vals:bpVals,  color:"#FBBF24", icon:"🩺", avg:avgBp },
              ].map(({ label, vals, color, icon, avg }) => (
                <div key={label} style={{ padding:"1rem", background:"rgba(255,255,255,0.02)", border:`1px solid ${color}18`, borderRadius:"14px" }}>
                  <div style={{ fontSize:"0.65rem", color:"rgba(255,255,255,0.28)", fontWeight:600, letterSpacing:"0.06em", textTransform:"uppercase", marginBottom:"4px" }}>{icon} {label}</div>
                  <div style={{ fontSize:"1.4rem", fontWeight:700, color, marginBottom:"4px" }}>{getPct(avg)}%</div>
                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                    <TrendBadge values={vals} />
                    <Sparkline data={vals} color={color} />
                  </div>
                </div>
              ))}
            </div>

            {/* Bar chart */}
            <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"16px", padding:"1.5rem" }}>
              <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.3)", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"1.25rem" }}>
                Assessment wise breakdown
              </div>
              <BarChart profiles={profiles} />

              {/* Legend */}
              <div style={{ display:"flex", gap:"1rem", marginTop:"1rem", flexWrap:"wrap" }}>
                {[["#818CF8","Diabetes"],["#F87171","Heart"],["#FBBF24","Hypertension"]].map(([c,l]) => (
                  <div key={l} style={{ display:"flex", alignItems:"center", gap:"5px" }}>
                    <div style={{ width:"8px", height:"8px", borderRadius:"50%", background:c }} />
                    <span style={{ fontSize:"0.7rem", color:"rgba(255,255,255,0.35)" }}>{l}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Risk distribution */}
            <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"16px", padding:"1.5rem", marginTop:"0.75rem" }}>
              <div style={{ fontSize:"0.72rem", color:"rgba(255,255,255,0.3)", fontWeight:600, letterSpacing:"0.08em", textTransform:"uppercase", marginBottom:"1.25rem" }}>
                Risk distribution
              </div>
              {[["low","Low Risk","#4ADE80"],["moderate","Moderate","#FBBF24"],["high","High Risk","#F87171"],["very_high","Very High","#EF4444"]].map(([key, label, color]) => {
                const count = profiles.filter(p => p.riskScores?.overallRisk === key).length;
                const pct   = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={key} style={{ display:"flex", alignItems:"center", gap:"0.75rem", marginBottom:"0.75rem" }}>
                    <span style={{ fontSize:"0.78rem", color, fontWeight:600, width:"72px", flexShrink:0 }}>{label}</span>
                    <div style={{ flex:1, height:"8px", background:"rgba(255,255,255,0.05)", borderRadius:"4px", overflow:"hidden" }}>
                      <div style={{ height:"100%", width:`${pct}%`, background:color, borderRadius:"4px", boxShadow:`0 0 6px ${color}44` }} />
                    </div>
                    <span style={{ fontSize:"0.75rem", color:"rgba(255,255,255,0.4)", width:"44px", textAlign:"right" }}>{count} ({pct}%)</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <p style={{ textAlign:"center", fontSize:"0.68rem", color:"rgba(255,255,255,0.15)", marginTop:"2rem", lineHeight:1.6 }}>
          ⚠️ Sirf informational purposes ke liye. Health decisions ke liye doctor se milein.
        </p>
      </div>

      <style>{`
        @keyframes spin { to { transform:rotate(360deg); } }
        @keyframes hup  { from { opacity:0; transform:translateY(12px); } to { opacity:1; transform:translateY(0); } }
        select option { background:#111; color:#fff; }
      `}</style>
    </div>
  );
}