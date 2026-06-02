import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser, logout } from "../Slice/authSlice";

// ── Helpers ────────────────────────────────────────────────
function getInitials(name = "") {
  return (
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2) || "U"
  );
}

function getRiskColor(pct) {
  if (pct > 60) return { text: "#f87171", bar: "#ef4444", bg: "rgba(239,68,68,0.10)" };
  if (pct > 35) return { text: "#fbbf24", bar: "#f59e0b", bg: "rgba(245,158,11,0.10)" };
  return { text: "#22c55e", bar: "#22c55e", bg: "rgba(34,197,94,0.10)" };
}

// ── Global styles ──────────────────────────────────────────
const Css = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');

    .pp-wrap * { box-sizing: border-box; font-family: 'DM Sans', sans-serif; }

    @keyframes ppPopIn {
      from { opacity: 0; transform: scale(0.93) translateY(-8px); }
      to   { opacity: 1; transform: scale(1)    translateY(0);    }
    }
    @keyframes ppBlink { 0%,100% { opacity:1; } 50% { opacity:0.3; } }

    .pp-avatar-btn {
      transition: transform 0.18s;
    }
    .pp-avatar-btn:hover { transform: scale(1.06); }

    .pp-popup {
      animation: ppPopIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both;
    }

    .pp-tab-btn {
      transition: background 0.15s, color 0.15s;
    }

    .pp-menu-btn {
      transition: background 0.12s, color 0.12s;
    }
    .pp-menu-btn:hover {
      background: rgba(34,197,94,0.07) !important;
      color: #22c55e !important;
    }
    .pp-menu-btn.danger:hover {
      background: rgba(239,68,68,0.08) !important;
      color: #f87171 !important;
    }

    .pp-info-row:hover {
      border-color: rgba(34,197,94,0.25) !important;
    }

    .pp-online-dot {
      animation: ppBlink 2s ease-in-out infinite;
    }
  `}</style>
);

// ── Sub-components ─────────────────────────────────────────
export function Avatar({ name, size = 36, onClick, active = false }) {
  const initials = getInitials(name);
  return (
    <div
      onClick={onClick}
      className="pp-avatar-btn"
      style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        background: "linear-gradient(135deg, #15803D, #22C55E)",
        border: active ? "2px solid #22C55E" : "2px solid rgba(34,197,94,0.35)",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.34, fontWeight: 700, color: "#F0FFF4",
        cursor: onClick ? "pointer" : "default",
        boxShadow: active ? "0 0 0 4px rgba(34,197,94,0.15)" : "none",
        userSelect: "none",
      }}
    >
      {initials}
    </div>
  );
}

function MenuBtn({ icon, label, onClick, danger = false }) {
  return (
    <button
      onClick={onClick}
      className={`pp-menu-btn${danger ? " danger" : ""}`}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        padding: "8px 12px", borderRadius: 10, border: "none",
        background: "transparent",
        color: danger ? "#ef4444" : "#4A8A5A",
        fontSize: 13, fontWeight: 500, fontFamily: "inherit",
        cursor: "pointer", textAlign: "left",
      }}
    >
      <span style={{ fontSize: 15, flexShrink: 0 }}>{icon}</span>
      {label}
    </button>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="pp-info-row" style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "9px 11px", borderRadius: 10, marginBottom: 6,
      background: "rgba(5,20,8,0.85)",
      border: "1px solid rgba(34,197,94,0.13)",
      transition: "border-color 0.15s",
    }}>
      <span style={{ fontSize: 14, flexShrink: 0, color: "#4A8A5A" }}>{icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 10, color: "#2A5A32", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: 12, color: "#DCFCE7", fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {value}
        </div>
      </div>
    </div>
  );
}

function RiskRow({ icon, label, pctRaw }) {
  const pct = pctRaw != null ? Math.round(pctRaw * 100) : null;
  const col = pct != null ? getRiskColor(pct) : null;
  return (
    <div style={{
      padding: "9px 11px", borderRadius: 10, marginBottom: 6,
      background: "rgba(5,20,8,0.85)",
      border: "1px solid rgba(34,197,94,0.13)",
    }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 14, flexShrink: 0, marginRight: 8, color: "#4A8A5A" }}>{icon}</span>
        <span style={{ fontSize: 12, color: "#4A8A5A", flex: 1 }}>{label}</span>
        <span style={{
          fontSize: 12, fontWeight: 700,
          color: col ? col.text : "#2A5A32",
        }}>
          {pct != null ? `${pct}%` : "—"}
        </span>
      </div>
      <div style={{ height: 3, borderRadius: 2, background: "rgba(34,197,94,0.10)", overflow: "hidden" }}>
        {pct != null && (
          <div style={{ height: 3, borderRadius: 2, width: `${pct}%`, background: col.bar, transition: "width 0.6s ease" }} />
        )}
      </div>
    </div>
  );
}

// ── Main ───────────────────────────────────────────────────
export default function ProfilePopup() {
  const [open, setOpen] = useState(false);
  const [tab,  setTab]  = useState("profile");
  const popupRef        = useRef(null);
  const user            = useSelector(selectCurrentUser);
  const dispatch        = useDispatch();
  const navigate        = useNavigate();

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    function handleClick(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    function handleKey(e) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  function handleLogout() {
    dispatch(logout());
    navigate("/login");
    setOpen(false);
  }

  const name     = user?.name || user?.fullName || "User";
  const email    = user?.email || "—";
  const joinedAt = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "—";
  const provider = user?.provider === "google" ? "Google OAuth"
    : user?.provider === "github" ? "GitHub OAuth"
    : "Email & Password";

  const lastRisk = user?.lastRisk || {};
  const overallRisk = (lastRisk.overall || "—").replace("_", " ").toUpperCase();
  const overallColor = overallRisk.includes("HIGH") ? "#f87171" : overallRisk === "MODERATE" ? "#fbbf24" : "#22c55e";

  return (
    <div ref={popupRef} className="pp-wrap" style={{ position: "relative", display: "inline-block" }}>
      <Css />

      {/* Avatar trigger */}
      <Avatar name={name} size={36} onClick={() => setOpen(o => !o)} active={open} />

      {/* Popup panel */}
      {open && (
        <div className="pp-popup" style={{
          position: "absolute", top: "calc(100% + 12px)", right: 0,
          width: 300, zIndex: 9999,
          background: "rgba(6,14,6,0.98)",
          border: "1px solid rgba(34,197,94,0.22)",
          borderRadius: 20,
          boxShadow: "0 24px 48px rgba(0,0,0,0.75), inset 0 1px 0 rgba(34,197,94,0.05)",
          overflow: "hidden",
        }}>

          {/* Top glow strip */}
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 90, background: "linear-gradient(180deg, rgba(34,197,94,0.06) 0%, transparent 100%)", pointerEvents: "none" }} />

          {/* ── Header ── */}
          <div style={{ padding: "18px 18px 14px", position: "relative", borderBottom: "1px solid rgba(34,197,94,0.09)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <Avatar name={name} size={48} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#DCFCE7", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {name}
                </div>
                <div style={{ fontSize: 11, color: "#4A8A5A", marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {email}
                </div>
              </div>
              {/* Online dot */}
              <div className="pp-online-dot" style={{ width: 8, height: 8, borderRadius: "50%", background: "#22c55e", boxShadow: "0 0 5px #22c55e", flexShrink: 0 }} />
            </div>

            {/* Member since badge */}
            <div style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "3px 10px", background: "rgba(34,197,94,0.07)", border: "1px solid rgba(34,197,94,0.18)", borderRadius: 20 }}>
              <span style={{ fontSize: 11 }}>📅</span>
              <span style={{ fontSize: 11, color: "#4A8A5A", fontWeight: 500 }}>Member since {joinedAt}</span>
            </div>
          </div>

          {/* ── Tab switcher ── */}
          <div style={{ display: "flex", gap: 4, margin: "12px 14px 0", background: "rgba(5,18,8,0.9)", border: "1px solid rgba(34,197,94,0.13)", borderRadius: 10, padding: 3 }}>
            {[
              { id: "profile", icon: "👤", label: "Profile" },
              { id: "health",  icon: "📊", label: "Health"  },
            ].map(t => (
              <button
                key={t.id}
                className="pp-tab-btn"
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1, padding: "7px 0", border: "none", borderRadius: 8,
                  cursor: "pointer", fontSize: 12, fontWeight: 600,
                  fontFamily: "inherit",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                  background: tab === t.id ? "linear-gradient(135deg, #15803D, #16A34A)" : "transparent",
                  color: tab === t.id ? "#F0FFF4" : "#2A5A32",
                  boxShadow: tab === t.id ? "0 2px 8px rgba(34,197,94,0.18)" : "none",
                }}
              >
                <span style={{ fontSize: 12 }}>{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── Tab content ── */}
          <div style={{ padding: "12px 14px" }}>

            {/* Profile tab */}
            {tab === "profile" && (
              <>
                <InfoRow icon="👤" label="Full name"    value={name}     />
                <InfoRow icon="📧" label="Email"        value={email}    />
                <InfoRow icon="🔐" label="Account type" value={provider} />
              </>
            )}

          
          </div>

          {/* ── Divider ── */}
          <div style={{ height: 1, background: "rgba(34,197,94,0.08)", margin: "0 14px" }} />

          {/* ── Menu ── */}
          <div style={{ padding: "8px 8px 4px" }}>
            <MenuBtn icon="✏️" label="Edit Profile"     onClick={() => { navigate("/edit-profile"); setOpen(false); }} />
            <MenuBtn icon="📋" label="My Reports"       onClick={() => { navigate("/report");  setOpen(false); }} />
            <MenuBtn icon="🔬" label="New Assessment"   onClick={() => { navigate("/risk");    setOpen(false); }} />
            <MenuBtn icon="📄" label="Analyze Report"   onClick={() => { navigate("/medicalreportanalyzer"); setOpen(false); }} />

            <div style={{ height: 1, background: "rgba(34,197,94,0.06)", margin: "6px 4px" }} />

            <MenuBtn icon="🚪" label="Logout" onClick={handleLogout} danger />
          </div>

          {/* ── Footer ── */}
          <div style={{ padding: "10px 14px", borderTop: "1px solid rgba(34,197,94,0.06)", display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}>
            <span style={{ fontSize: 10 }}>🔒</span>
            <span style={{ fontSize: 10, color: "#2A5A32" }}>Secured by VitaRisk · Data encrypted</span>
          </div>
        </div>
      )}
    </div>
  );
}