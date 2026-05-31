import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export default function AdminPanel() {
  const token   = useSelector((state) => state.auth.token);
  const user    = useSelector((state) => state.auth.user);
  const [stats,   setStats]   = useState(null);
  const [users,   setUsers]   = useState([]);
  const [tab,     setTab]     = useState("dashboard");
  const [loading, setLoading] = useState(true);

  // ✅ Sirf admin access
  if (!user || user.role !== "admin") {
    return <Navigate to="/home" replace />;
  }

  const api = (path) =>
    fetch(`${import.meta.env.VITE_API_URL}${path}`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((r) => r.json());

  useEffect(() => {
    api("/api/admin/stats").then((d) => {
      setStats(d.stats);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (tab === "users") {
      api("/api/admin/users").then((d) => setUsers(d.users || []));
    }
  }, [tab]);

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;
    await fetch(`${import.meta.env.VITE_API_URL}/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    setUsers((u) => u.filter((x) => x._id !== id));
  };

  if (loading) return (
    <div style={{ minHeight: "100vh", background: "#050A05", display: "flex", alignItems: "center", justifyContent: "center", color: "#22C55E" }}>
      Loading...
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: "#050A05", color: "#DCFCE7", fontFamily: "DM Sans, sans-serif" }}>

      {/* Navbar */}
      <div style={{ background: "rgba(6,14,6,0.96)", borderBottom: "1px solid rgba(34,197,94,0.15)", padding: "1rem 2rem", display: "flex", gap: "1rem", alignItems: "center" }}>
        <span style={{ fontWeight: 700, color: "#22C55E", fontSize: "1.1rem" }}>🛡️ Admin Panel</span>
        {["dashboard", "users", "assessments"].map((t) => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: "6px 16px", borderRadius: 20, border: "none", cursor: "pointer",
            background: tab === t ? "#22C55E" : "transparent",
            color: tab === t ? "#000" : "#4A8A5A",
            fontWeight: 600, fontSize: "0.85rem",
          }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      <div style={{ padding: "2rem", maxWidth: 1100, margin: "0 auto" }}>

        {/* Dashboard Tab */}
        {tab === "dashboard" && stats && (
          <div>
            <h2 style={{ marginBottom: "1.5rem" }}>Dashboard</h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
              {[
                { label: "Total Users",       value: stats.totalUsers },
                { label: "Total Assessments", value: stats.totalAssessments },
              ].map(({ label, value }) => (
                <div key={label} style={{
                  background: "rgba(6,14,6,0.96)", border: "1px solid rgba(34,197,94,0.22)",
                  borderRadius: 16, padding: "1.5rem", textAlign: "center",
                }}>
                  <div style={{ fontSize: "2rem", fontWeight: 700, color: "#22C55E" }}>{value}</div>
                  <div style={{ fontSize: "0.8rem", color: "#4A8A5A", marginTop: 4 }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {tab === "users" && (
          <div>
            <h2 style={{ marginBottom: "1.5rem" }}>Users ({users.length})</h2>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid rgba(34,197,94,0.15)" }}>
                    {["Name", "Email", "Role", "Joined", "Action"].map((h) => (
                      <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: "0.75rem", color: "#4A8A5A", textTransform: "uppercase", letterSpacing: "0.07em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} style={{ borderBottom: "1px solid rgba(34,197,94,0.06)" }}>
                      <td style={{ padding: "12px", fontSize: "0.9rem" }}>{u.firstName} {u.lastName}</td>
                      <td style={{ padding: "12px", fontSize: "0.85rem", color: "#4A8A5A" }}>{u.email}</td>
                      <td style={{ padding: "12px" }}>
                        <span style={{
                          background: u.role === "admin" ? "rgba(34,197,94,0.15)" : "rgba(255,255,255,0.05)",
                          color: u.role === "admin" ? "#22C55E" : "#4A8A5A",
                          padding: "3px 10px", borderRadius: 20, fontSize: "0.75rem", fontWeight: 600,
                        }}>{u.role}</span>
                      </td>
                      <td style={{ padding: "12px", fontSize: "0.8rem", color: "#4A8A5A" }}>
                        {new Date(u.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <button onClick={() => deleteUser(u._id)} style={{
                          background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)",
                          color: "#F87171", padding: "5px 12px", borderRadius: 8,
                          cursor: "pointer", fontSize: "0.8rem",
                        }}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}