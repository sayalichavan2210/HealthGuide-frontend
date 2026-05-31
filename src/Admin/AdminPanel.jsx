import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const G = {
  primary:       "#22C55E",
  primaryBorder: "rgba(34,197,94,0.22)",
  bg:            "#050A05",
  card:          "rgba(6,14,6,0.96)",
  textPrimary:   "#DCFCE7",
  textMuted:     "#4A8A5A",
  textFaint:     "#2A5A32",
  inputBg:       "rgba(5,20,8,0.95)",
  inputBorder:   "rgba(34,197,94,0.16)",
  danger:        "#F87171",
  dangerBg:      "rgba(248,113,113,0.10)",
  dangerBorder:  "rgba(248,113,113,0.30)",
};

export default function AdminPanel() {
  const token = useSelector((state) => state.auth.token);
  const user  = useSelector((state) => state.auth.user);

  const [tab,     setTab]     = useState("users");
  const [users,   setUsers]   = useState([]);
  const [stats,   setStats]   = useState(null);
  const [search,  setSearch]  = useState("");
  const [loading, setLoading] = useState(true);
  const [deleting,setDeleting]= useState(null);

  if (!user || user.role !== "admin") return <Navigate to="/home" replace />;

  const api = (path, options = {}) =>
    fetch(`${import.meta.env.VITE_API_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      ...options,
    }).then((r) => r.json());

  // ── Fetch Stats ──────────────────────────────────────────
  useEffect(() => {
    api("/api/admin/stats").then((d) => {
      setStats(d.stats);
      setLoading(false);
    });
  }, []);

  // ── Fetch Users ──────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    api(`/api/admin/users?search=${search}`)
      .then((d) => {
        setUsers(d.users || []);
        setLoading(false);
      });
  }, [search]);

  // ── Delete User ──────────────────────────────────────────
  const deleteUser = async (id, name) => {
    if (!confirm(`"${name}" ko delete karo?\nUske saare assessments bhi delete ho jayenge.`)) return;
    setDeleting(id);
    const d = await api(`/api/admin/users/${id}`, { method: "DELETE" });
    if (d.success) {
      setUsers((u) => u.filter((x) => x._id !== id));
      setStats((s) => s ? { ...s, totalUsers: s.totalUsers - 1 } : s);
    }
    setDeleting(null);
  };

  const filteredUsers = users.filter((u) =>
    `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: G.bg, color: G.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .admin-search { background: ${G.inputBg}; border: 1px solid ${G.inputBorder}; border-radius: 10px; padding: 10px 14px; color: ${G.textPrimary}; font-size: 0.9rem; outline: none; width: 100%; font-family: 'DM Sans', sans-serif; }
        .admin-search:focus { border-color: ${G.primary}; box-shadow: 0 0 0 3px rgba(34,197,94,0.10); }
        .admin-search::placeholder { color: ${G.textFaint}; }
        .del-btn { background: ${G.dangerBg}; border: 1px solid ${G.dangerBorder}; color: ${G.danger}; padding: 6px 14px; border-radius: 8px; cursor: pointer; font-size: 0.8rem; font-weight: 600; transition: all 0.2s; font-family: inherit; }
        .del-btn:hover { background: rgba(248,113,113,0.18); }
        .del-btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .tab-btn { padding: 8px 20px; border-radius: 20px; border: none; cursor: pointer; font-weight: 600; font-size: 0.85rem; transition: all 0.2s; font-family: inherit; }
        tr:hover td { background: rgba(34,197,94,0.03); }
      `}</style>

      {/* ── Navbar ───────────────────────────────────────── */}
      <div style={{
        background: G.card, borderBottom: `1px solid ${G.primaryBorder}`,
        padding: "1rem 2rem", display: "flex", alignItems: "center", gap: "1rem",
        position: "sticky", top: 0, zIndex: 10,
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}>
        <span style={{ fontWeight: 700, color: G.primary, fontSize: "1.15rem" }}>🛡️ Admin Panel</span>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span style={{ fontSize: "0.8rem", color: G.textMuted }}>
            👤 <span style={{ color: G.primary }}>{user.firstName}</span>
          </span>
          <a href="/home" style={{
            padding: "6px 16px", borderRadius: 20,
            border: `1px solid ${G.inputBorder}`,
            color: G.textMuted, fontSize: "0.82rem",
            textDecoration: "none", fontWeight: 600,
          }}>← Back</a>
        </div>
      </div>

      <div style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>

        {/* ── Stats Cards ────────────────────────────────── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1rem", marginBottom: "2rem" }}>
          {[
            { label: "Total Users",       value: stats?.totalUsers       ?? "—", icon: "👥", color: G.primary },
            { label: "Total Assessments", value: stats?.totalAssessments ?? "—", icon: "🩺", color: "#60A5FA" },
          ].map(({ label, value, icon, color }) => (
            <div key={label} style={{
              background: G.card, border: `1px solid ${G.primaryBorder}`,
              borderRadius: 16, padding: "1.5rem", textAlign: "center",
            }}>
              <div style={{ fontSize: "1.6rem", marginBottom: 8 }}>{icon}</div>
              <div style={{ fontSize: "2rem", fontWeight: 700, color }}>{value}</div>
              <div style={{ fontSize: "0.75rem", color: G.textMuted, marginTop: 4, textTransform: "uppercase", letterSpacing: "0.07em" }}>{label}</div>
            </div>
          ))}
        </div>

        {/* ── Users Section ──────────────────────────────── */}
        <div style={{
          background: G.card, border: `1px solid ${G.primaryBorder}`,
          borderRadius: 20, overflow: "hidden",
        }}>

          {/* Header */}
          <div style={{
            padding: "1.25rem 1.5rem",
            borderBottom: `1px solid ${G.primaryBorder}`,
            background: "linear-gradient(180deg, rgba(34,197,94,0.04) 0%, transparent 100%)",
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem",
            flexWrap: "wrap",
          }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700 }}>👥 Registered Users</h2>
              <p style={{ margin: "3px 0 0", fontSize: "0.78rem", color: G.textMuted }}>
                {filteredUsers.length} users found
              </p>
            </div>
            {/* Search */}
            <div style={{ width: "280px" }}>
              <input
                className="admin-search"
                placeholder="🔍 Search name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          {loading ? (
            <div style={{ padding: "3rem", textAlign: "center", color: G.textMuted }}>Loading users...</div>
          ) : filteredUsers.length === 0 ? (
            <div style={{ padding: "3rem", textAlign: "center", color: G.textMuted }}>
              {search ? "Koi user nahi mila" : "Koi user registered nahi hai"}
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: `1px solid ${G.primaryBorder}` }}>
                    {["#", "Name", "Email", "Provider", "Role", "Joined", "Action"].map((h) => (
                      <th key={h} style={{
                        padding: "10px 14px", textAlign: "left",
                        fontSize: "0.7rem", color: G.textMuted,
                        textTransform: "uppercase", letterSpacing: "0.08em",
                        fontWeight: 700, whiteSpace: "nowrap",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((u, i) => (
                    <tr key={u._id} style={{ borderBottom: `1px solid rgba(34,197,94,0.05)` }}>

                      {/* # */}
                      <td style={{ padding: "12px 14px", fontSize: "0.8rem", color: G.textFaint }}>{i + 1}</td>

                      {/* Name + Avatar */}
                      <td style={{ padding: "12px 14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                          <div style={{
                            width: 34, height: 34, borderRadius: "50%",
                            background: "rgba(34,197,94,0.12)", border: `1px solid ${G.primaryBorder}`,
                            display: "flex", alignItems: "center", justifyContent: "center",
                            fontSize: "0.85rem", fontWeight: 700, color: G.primary,
                            flexShrink: 0, overflow: "hidden",
                          }}>
                            {u.avatar
                              ? <img src={u.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                              : (u.firstName?.[0] || "?").toUpperCase()
                            }
                          </div>
                          <div>
                            <div style={{ fontSize: "0.9rem", fontWeight: 600, color: G.textPrimary }}>
                              {u.firstName} {u.lastName}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td style={{ padding: "12px 14px", fontSize: "0.83rem", color: G.textMuted }}>
                        {u.email}
                      </td>

                      {/* Provider */}
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{
                          background: u.authProvider === "google" ? "rgba(66,133,244,0.12)" :
                                      u.authProvider === "github" ? "rgba(255,255,255,0.08)" :
                                      "rgba(34,197,94,0.10)",
                          border: u.authProvider === "google" ? "1px solid rgba(66,133,244,0.3)" :
                                  u.authProvider === "github" ? "1px solid rgba(255,255,255,0.15)" :
                                  `1px solid ${G.primaryBorder}`,
                          color: u.authProvider === "google" ? "#60A5FA" :
                                 u.authProvider === "github" ? "#94A3B8" :
                                 G.primary,
                          padding: "3px 10px", borderRadius: 20,
                          fontSize: "0.72rem", fontWeight: 600,
                        }}>
                          {u.authProvider === "google" ? "🔵 Google" :
                           u.authProvider === "github" ? "⚫ GitHub" : "✉️ Email"}
                        </span>
                      </td>

                      {/* Role */}
                      <td style={{ padding: "12px 14px" }}>
                        <span style={{
                          background: u.role === "admin" ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
                          border: u.role === "admin" ? `1px solid ${G.primaryBorder}` : "1px solid rgba(255,255,255,0.08)",
                          color: u.role === "admin" ? G.primary : G.textMuted,
                          padding: "3px 10px", borderRadius: 20,
                          fontSize: "0.72rem", fontWeight: 700,
                        }}>
                          {u.role === "admin" ? "🛡️ Admin" : "👤 User"}
                        </span>
                      </td>

                      {/* Joined */}
                      <td style={{ padding: "12px 14px", fontSize: "0.8rem", color: G.textMuted, whiteSpace: "nowrap" }}>
                        {new Date(u.createdAt).toLocaleDateString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric"
                        })}
                      </td>

                      {/* Action */}
                      <td style={{ padding: "12px 14px" }}>
                        {u._id === user._id ? (
                          <span style={{ fontSize: "0.75rem", color: G.textFaint }}>You</span>
                        ) : (
                          <button
                            className="del-btn"
                            disabled={deleting === u._id}
                            onClick={() => deleteUser(u._id, `${u.firstName} ${u.lastName}`)}
                          >
                            {deleting === u._id ? "Deleting..." : "🗑 Delete"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}