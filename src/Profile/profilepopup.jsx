import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectCurrentUser, logout } from "../Slice/authSlice";

// ── Green theme (matches your app) ───────────────────────────────────────────
const G = {
  primary:       "#22C55E",
  primaryMid:    "#16A34A",
  primaryDeep:   "#15803D",
  primaryGlow:   "rgba(34,197,94,0.18)",
  primaryFaint:  "rgba(34,197,94,0.07)",
  primaryBorder: "rgba(34,197,94,0.22)",
  bg:            "#050A05",
  card:          "rgba(6,14,6,0.97)",
  inputBg:       "rgba(5,20,8,0.95)",
  inputBorder:   "rgba(34,197,94,0.16)",
  textPrimary:   "#DCFCE7",
  textMuted:     "#4A8A5A",
  textFaint:     "#2A5A32",
};

// ── Helper — initials from name ───────────────────────────────────────────────
function getInitials(name = "") {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";
}

// ── Menu item ─────────────────────────────────────────────────────────────────
function MenuItem({ icon, label, onClick, danger = false }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 10,
        padding: "9px 14px", borderRadius: 10, border: "none", cursor: "pointer",
        background: hovered
          ? danger ? "rgba(239,68,68,0.08)" : G.primaryFaint
          : "transparent",
        color: hovered
          ? danger ? "#f87171" : G.primary
          : danger ? "#ef4444" : G.textMuted,
        fontSize: 13, fontWeight: 500, fontFamily: "inherit",
        transition: "all 0.15s ease", textAlign: "left",
      }}
    >
      <span style={{ fontSize: 15, flexShrink: 0 }}>{icon}</span>
      {label}
    </button>
  );
}

// ── Avatar component (reusable) ───────────────────────────────────────────────
export function Avatar({ name, size = 36, onClick, pulse = false }) {
  const initials = getInitials(name);
  return (
    <div
      onClick={onClick}
      style={{
        width: size, height: size, borderRadius: "50%", flexShrink: 0,
        background: `linear-gradient(135deg, ${G.primaryDeep}, ${G.primary})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: size * 0.35, fontWeight: 700, color: "#052008",
        cursor: onClick ? "pointer" : "default",
        border: `2px solid ${G.primaryBorder}`,
        boxShadow: pulse ? `0 0 0 4px ${G.primaryFaint}` : "none",
        transition: "box-shadow 0.2s, transform 0.2s",
        userSelect: "none",
      }}
      onMouseEnter={e => { if (onClick) e.currentTarget.style.transform = "scale(1.05)"; }}
      onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
    >
      {initials}
    </div>
  );
}

// ── Main ProfilePopup component ───────────────────────────────────────────────
export default function ProfilePopup() {
  const [open, setOpen]   = useState(false);
  const [tab, setTab]     = useState("profile"); // "profile" | "health"
  const popupRef          = useRef(null);
  const user              = useSelector(selectCurrentUser);
  const dispatch          = useDispatch();
  const navigate          = useNavigate();

  // Close on outside click
  useEffect(() => {
    function handleClick(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
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

  const name      = user?.name  || user?.fullName || "User";
  const email     = user?.email || "—";
  const joinedAt  = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "long", year: "numeric" })
    : "—";

  return (
    <div ref={popupRef} style={{ position: "relative", display: "inline-block" }}>

      {/* ── Navbar Avatar trigger ── */}
      <Avatar name={name} size={36} onClick={() => setOpen(o => !o)} pulse={open} />

      {/* ── Popup ── */}
      {open && (
        <div
          style={{
            position: "absolute", top: "calc(100% + 12px)", right: 0,
            width: 300, zIndex: 9999,
            background: G.card,
            border: `1px solid ${G.primaryBorder}`,
            borderRadius: 20,
            boxShadow: "0 24px 48px rgba(0,0,0,0.7), 0 0 0 1px rgba(34,197,94,0.05)",
            overflow: "hidden",
            animation: "popIn 0.2s cubic-bezier(0.34,1.56,0.64,1)",
          }}
        >
          <style>{`
            @keyframes popIn {
              from { opacity: 0; transform: scale(0.92) translateY(-8px); }
              to   { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>

          {/* Top glow */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 80,
            background: "linear-gradient(180deg, rgba(34,197,94,0.06) 0%, transparent 100%)",
            pointerEvents: "none",
          }} />

          {/* ── Header — avatar + name ── */}
          <div style={{ padding: "20px 20px 14px", position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Avatar name={name} size={48} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{
                  fontSize: 15, fontWeight: 700, color: G.textPrimary,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{name}</div>
                <div style={{
                  fontSize: 11, color: G.textMuted, marginTop: 2,
                  overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>{email}</div>
              </div>
              {/* Online dot */}
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: G.primary, flexShrink: 0,
                boxShadow: `0 0 6px ${G.primary}`,
              }} />
            </div>

            {/* Joined badge */}
            <div style={{
              marginTop: 12, display: "inline-flex", alignItems: "center", gap: 6,
              padding: "4px 10px", borderRadius: 20,
              background: G.primaryFaint, border: `1px solid ${G.primaryBorder}`,
            }}>
              <span style={{ fontSize: 11 }}>📅</span>
              <span style={{ fontSize: 11, color: G.textMuted, fontWeight: 500 }}>
                Member since {joinedAt}
              </span>
            </div>
          </div>

          {/* ── Tab switcher ── */}
          <div style={{
            display: "flex", margin: "0 14px 10px",
            background: "rgba(5,18,8,0.9)",
            borderRadius: 10, padding: 3,
            border: `1px solid ${G.inputBorder}`,
          }}>
            {[
              { id: "profile", label: "👤 Profile" },
              { id: "health",  label: "📊 Health"  },
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  flex: 1, padding: "6px 0", border: "none", borderRadius: 8,
                  cursor: "pointer", fontSize: 12, fontWeight: 600,
                  fontFamily: "inherit", transition: "all 0.15s",
                  background: tab === t.id
                    ? `linear-gradient(135deg, ${G.primaryDeep}, ${G.primaryMid})`
                    : "transparent",
                  color: tab === t.id ? "#F0FFF4" : G.textFaint,
                  boxShadow: tab === t.id ? "0 2px 8px rgba(34,197,94,0.2)" : "none",
                }}
              >{t.label}</button>
            ))}
          </div>

          {/* ── Tab content ── */}
          <div style={{ padding: "0 14px", minHeight: 120 }}>

            {/* Profile tab */}
            {tab === "profile" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {[
                  { icon: "👤", label: "Full name",  value: name  },
                  { icon: "📧", label: "Email",       value: email },
                  { icon: "🔐", label: "Account type", value: user?.provider === "google" ? "Google OAuth" : user?.provider === "github" ? "GitHub OAuth" : "Email & Password" },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={{
                    display: "flex", alignItems: "center", gap: 10,
                    padding: "9px 12px", borderRadius: 10,
                    background: "rgba(5,18,8,0.8)",
                    border: `1px solid ${G.inputBorder}`,
                  }}>
                    <span style={{ fontSize: 14, flexShrink: 0 }}>{icon}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 10, color: G.textFaint, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</div>
                      <div style={{
                        fontSize: 12, color: G.textPrimary, fontWeight: 500,
                        marginTop: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                      }}>{value}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Health tab */}
            {tab === "health" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                <div style={{
                  padding: "10px 12px", borderRadius: 10,
                  background: G.primaryFaint, border: `1px solid ${G.primaryBorder}`,
                  display: "flex", alignItems: "center", gap: 8, marginBottom: 2,
                }}>
                  <span style={{ fontSize: 14 }}>ℹ️</span>
                  <span style={{ fontSize: 11, color: G.textMuted, lineHeight: 1.5 }}>
                    Complete a risk assessment to see your health summary here.
                  </span>
                </div>
                {[
                  { icon: "🩸", label: "Diabetes Risk",     value: user?.lastRisk?.diabetes     || "—" },
                  { icon: "❤️", label: "Heart Disease Risk", value: user?.lastRisk?.heartDisease || "—" },
                  { icon: "🩺", label: "Hypertension Risk",  value: user?.lastRisk?.hypertension || "—" },
                ].map(({ icon, label, value }) => (
                  <div key={label} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "9px 12px", borderRadius: 10,
                    background: "rgba(5,18,8,0.8)", border: `1px solid ${G.inputBorder}`,
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 14 }}>{icon}</span>
                      <span style={{ fontSize: 12, color: G.textMuted }}>{label}</span>
                    </div>
                    <span style={{
                      fontSize: 12, fontWeight: 700,
                      color: value === "—" ? G.textFaint : G.primary,
                    }}>{value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Divider ── */}
          <div style={{ height: 1, background: `rgba(34,197,94,0.08)`, margin: "14px 0 6px" }} />

          {/* ── Menu items ── */}
          <div style={{ padding: "0 6px 6px" }}>
            <MenuItem icon="✏️" label="Edit Profile"     onClick={() => { navigate("/profile"); setOpen(false); }} />
            <MenuItem icon="📋" label="My Reports"       onClick={() => { navigate("/report");  setOpen(false); }} />
            <MenuItem icon="🔬" label="New Assessment"   onClick={() => { navigate("/risk");    setOpen(false); }} />
            <MenuItem icon="📄" label="Analyze Report"   onClick={() => { navigate("/medicalreportanalyzer"); setOpen(false); }} />

            {/* Divider */}
            <div style={{ height: 1, background: `rgba(34,197,94,0.06)`, margin: "6px 8px" }} />

            <MenuItem icon="🚪" label="Logout" onClick={handleLogout} danger />
          </div>

          {/* ── Footer ── */}
          <div style={{
            padding: "10px 14px",
            borderTop: `1px solid rgba(34,197,94,0.06)`,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          }}>
            <span style={{ fontSize: 10 }}>🔒</span>
            <span style={{ fontSize: 10, color: G.textFaint }}>
              Secured by VitaRisk · Data encrypted
            </span>
          </div>
        </div>
      )}
    </div>
  );
}