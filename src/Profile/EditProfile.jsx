import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCredentials } from "../Slice/authSlice";
import toast from "react-hot-toast";

const G = {
  primary:       "#22C55E",
  primaryMid:    "#16A34A",
  primaryDeep:   "#15803D",
  primaryFaint:  "rgba(34,197,94,0.07)",
  primaryBorder: "rgba(34,197,94,0.22)",
  bg:            "#050A05",
  card:          "rgba(6,14,6,0.96)",
  inputBg:       "rgba(5,20,8,0.95)",
  inputBorder:   "rgba(34,197,94,0.16)",
  textPrimary:   "#DCFCE7",
  textMuted:     "#4A8A5A",
  textFaint:     "#2A5A32",
};

export default function EditProfile() {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const token     = useSelector((state) => state.auth.token);
  const authUser  = useSelector((state) => state.auth.user);

  const [form, setForm] = useState({
    firstName: "",
    lastName:  "",
    phone:     "",
  });
  const [loading,  setLoading]  = useState(false);
  const [fetching, setFetching] = useState(true);

  // Password change state
  const [pwdForm, setPwdForm] = useState({
    currentPassword: "",
    newPassword:     "",
    confirmPassword: "",
  });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [showPwd,    setShowPwd]    = useState(false);

  // ── Fetch current profile ────────────────────────────────
  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          setForm({
            firstName: d.user.firstName || "",
            lastName:  d.user.lastName  || "",
            phone:     d.user.phone     || "",
          });
        }
        setFetching(false);
      });
  }, []);

  const set    = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const setPwd = (k, v) => setPwdForm((f) => ({ ...f, [k]: v }));

  // ── Update Profile ───────────────────────────────────────
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!form.firstName) { toast.error("First name required"); return; }
    setLoading(true);
    try {
      const r = await fetch(`${import.meta.env.VITE_API_URL}/api/user/profile`, {
        method:  "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body:    JSON.stringify(form),
      });
      const d = await r.json();
      if (d.success) {
        dispatch(setCredentials({ user: d.user, accessToken: token }));
        toast.success("Profile updated!");
        navigate("/home");
      } else {
        toast.error(d.message || "Update failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  };

  // ── Change Password ──────────────────────────────────────
  const handlePassword = async (e) => {
    e.preventDefault();
    if (!pwdForm.currentPassword || !pwdForm.newPassword) {
      toast.error("All fields required"); return;
    }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      toast.error("Passwords don't match"); return;
    }
    if (pwdForm.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters"); return;
    }
    setPwdLoading(true);
    try {
      const r = await fetch(`${import.meta.env.VITE_API_URL}/api/user/change-password`, {
        method:  "PATCH",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body:    JSON.stringify({
          currentPassword: pwdForm.currentPassword,
          newPassword:     pwdForm.newPassword,
        }),
      });
      const d = await r.json();
      if (d.success) {
        toast.success("Password changed!");
        setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        toast.error(d.message || "Failed");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setPwdLoading(false);
    }
  };

  if (fetching) return (
    <div style={{ minHeight: "100vh", background: G.bg, display: "flex", alignItems: "center", justifyContent: "center", color: G.primary }}>
      Loading...
    </div>
  );

  return (
    <div style={{ minHeight: "100vh", background: G.bg, color: G.textPrimary, fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
        .ep-input {
          width: 100%; padding: 11px 14px;
          background: ${G.inputBg}; border: 1px solid ${G.inputBorder};
          border-radius: 12px; color: ${G.textPrimary};
          font-size: 0.9rem; outline: none;
          font-family: 'DM Sans', sans-serif;
          transition: border-color 0.2s, box-shadow 0.2s;
          box-sizing: border-box;
        }
        .ep-input:focus { border-color: ${G.primary}; box-shadow: 0 0 0 3px rgba(34,197,94,0.10); }
        .ep-input::placeholder { color: ${G.textFaint}; }
        .ep-input:disabled { opacity: 0.6; cursor: not-allowed; }
        .ep-btn {
          width: 100%; padding: 12px;
          background: linear-gradient(90deg, ${G.primaryDeep}, ${G.primaryMid}, ${G.primary});
          border: none; border-radius: 12px;
          color: #F0FFF4; font-size: 0.95rem; font-weight: 700;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: opacity 0.2s, transform 0.15s;
          box-shadow: 0 4px 16px rgba(34,197,94,0.22);
        }
        .ep-btn:hover:not(:disabled) { opacity: 0.88; transform: translateY(-1px); }
        .ep-btn:disabled { opacity: 0.6; cursor: not-allowed; }
        .ep-ghost {
          width: 100%; padding: 12px;
          background: transparent; border: 1px solid ${G.inputBorder};
          border-radius: 12px; color: ${G.textMuted};
          font-size: 0.9rem; font-weight: 600;
          cursor: pointer; font-family: 'DM Sans', sans-serif;
          transition: all 0.2s;
        }
        .ep-ghost:hover { border-color: ${G.primary}; color: ${G.primary}; }
        .ep-label {
          display: block; font-size: 0.7rem; font-weight: 700;
          color: ${G.textMuted}; text-transform: uppercase;
          letter-spacing: 0.08em; margin-bottom: 6px;
        }
        @keyframes epBlob {
          0% { transform: scale(1); }
          100% { transform: scale(1.05) translate(2%, 2%); }
        }
        .ep-blob { animation: epBlob 10s infinite alternate ease-in-out; }
      `}</style>

      {/* Background blobs */}
      <div className="ep-blob" style={{ position: "fixed", top: "-10%", left: "-5%", width: "50%", height: "50%", background: "radial-gradient(circle, rgba(34,197,94,0.08) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(80px)", pointerEvents: "none", zIndex: 0 }} />
      <div className="ep-blob" style={{ position: "fixed", bottom: "-10%", right: "-5%", width: "50%", height: "50%", background: "radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)", borderRadius: "50%", filter: "blur(90px)", pointerEvents: "none", zIndex: 0, animationDelay: "1.5s" }} />

      {/* ── Navbar ─────────────────────────────────────── */}
      <div style={{ background: G.card, borderBottom: `1px solid ${G.primaryBorder}`, padding: "1rem 2rem", display: "flex", alignItems: "center", justifyContent: "space-between", position: "sticky", top: 0, zIndex: 10 }}>
        <span style={{ fontWeight: 700, color: G.primary, fontSize: "1.1rem" }}>✏️ Edit Profile</span>
        <button className="ep-ghost" style={{ width: "auto", padding: "6px 18px" }} onClick={() => navigate("/home")}>
          ← Back
        </button>
      </div>

      <div style={{ maxWidth: 600, margin: "0 auto", padding: "2.5rem 1.5rem", position: "relative", zIndex: 2 }}>

        {/* ── Avatar Section ──────────────────────────────── */}
        <div style={{ textAlign: "center", marginBottom: "2rem" }}>
          <div style={{
            width: 90, height: 90, borderRadius: "50%", margin: "0 auto 1rem",
            background: G.primaryFaint, border: `2px solid ${G.primaryBorder}`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: "2.2rem", overflow: "hidden",
          }}>
            {authUser?.avatar
              ? <img src={authUser.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              : (authUser?.firstName?.[0] || "?").toUpperCase()
            }
          </div>
          <p style={{ margin: 0, fontSize: "1.1rem", fontWeight: 700, color: G.textPrimary }}>
            {authUser?.firstName} {authUser?.lastName}
          </p>
          <p style={{ margin: "4px 0 0", fontSize: "0.82rem", color: G.textMuted }}>{authUser?.email}</p>
          <span style={{
            display: "inline-block", marginTop: 8,
            background: G.primaryFaint, border: `1px solid ${G.primaryBorder}`,
            borderRadius: 20, padding: "3px 12px",
            fontSize: "0.72rem", color: G.primary, fontWeight: 600,
          }}>
            {authUser?.authProvider === "google" ? "🔵 Google" : authUser?.authProvider === "github" ? "⚫ GitHub" : "✉️ Email"} Account
          </span>
        </div>

        {/* ── Profile Form ────────────────────────────────── */}
        <div style={{ background: G.card, border: `1px solid ${G.primaryBorder}`, borderRadius: 20, padding: "2rem", marginBottom: "1.5rem", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 80, background: "linear-gradient(180deg, rgba(34,197,94,0.05) 0%, transparent 100%)", borderRadius: "20px 20px 0 0", pointerEvents: "none" }} />

          <h3 style={{ margin: "0 0 1.5rem", fontSize: "1rem", fontWeight: 700, color: G.textPrimary }}>
            👤 Personal Information
          </h3>

          <form onSubmit={handleUpdate}>
            {/* Name fields */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1rem" }}>
              <div>
                <label className="ep-label">First Name *</label>
                <input className="ep-input" type="text" placeholder="Sayali" value={form.firstName} onChange={(e) => set("firstName", e.target.value)} disabled={loading} />
              </div>
              <div>
                <label className="ep-label">Last Name</label>
                <input className="ep-input" type="text" placeholder="Chavan" value={form.lastName} onChange={(e) => set("lastName", e.target.value)} disabled={loading} />
              </div>
            </div>

            {/* Email — readonly */}
            <div style={{ marginBottom: "1rem" }}>
              <label className="ep-label">Email Address</label>
              <input className="ep-input" type="email" value={authUser?.email || ""} disabled style={{ opacity: 0.5, cursor: "not-allowed" }} />
              <p style={{ margin: "5px 0 0", fontSize: "0.72rem", color: G.textFaint }}>Email change nahi ho sakta</p>
            </div>

            {/* Phone */}
            <div style={{ marginBottom: "1.5rem" }}>
              <label className="ep-label">Phone Number</label>
              <input className="ep-input" type="tel" placeholder="+91 98765 43210" value={form.phone} onChange={(e) => set("phone", e.target.value)} disabled={loading} />
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: "0.75rem" }}>
              <button type="button" className="ep-ghost" onClick={() => navigate("/home")}>
                Cancel
              </button>
              <button type="submit" className="ep-btn" disabled={loading}>
                {loading ? "Saving..." : "💾 Save Changes"}
              </button>
            </div>
          </form>
        </div>

        {/* ── Change Password ──────────────────────────────── */}
        {authUser?.authProvider === "local" && (
          <div style={{ background: G.card, border: `1px solid ${G.primaryBorder}`, borderRadius: 20, padding: "2rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: showPwd ? "1.5rem" : 0 }}>
              <h3 style={{ margin: 0, fontSize: "1rem", fontWeight: 700, color: G.textPrimary }}>🔒 Change Password</h3>
              <button className="ep-ghost" style={{ width: "auto", padding: "6px 16px", fontSize: "0.82rem" }} onClick={() => setShowPwd(!showPwd)}>
                {showPwd ? "Cancel" : "Change"}
              </button>
            </div>

            {showPwd && (
              <form onSubmit={handlePassword}>
                <div style={{ marginBottom: "1rem" }}>
                  <label className="ep-label">Current Password</label>
                  <input className="ep-input" type="password" placeholder="••••••••" value={pwdForm.currentPassword} onChange={(e) => setPwd("currentPassword", e.target.value)} disabled={pwdLoading} />
                </div>
                <div style={{ marginBottom: "1rem" }}>
                  <label className="ep-label">New Password</label>
                  <input className="ep-input" type="password" placeholder="Min 8 characters" value={pwdForm.newPassword} onChange={(e) => setPwd("newPassword", e.target.value)} disabled={pwdLoading} />
                </div>
                <div style={{ marginBottom: "1.5rem" }}>
                  <label className="ep-label">Confirm New Password</label>
                  <input className="ep-input" type="password" placeholder="••••••••" value={pwdForm.confirmPassword} onChange={(e) => setPwd("confirmPassword", e.target.value)} disabled={pwdLoading} />
                </div>
                <button type="submit" className="ep-btn" disabled={pwdLoading}>
                  {pwdLoading ? "Changing..." : "🔐 Change Password"}
                </button>
              </form>
            )}
          </div>
        )}

        {/* OAuth user message */}
        {authUser?.authProvider !== "local" && (
          <div style={{ background: G.primaryFaint, border: `1px solid ${G.primaryBorder}`, borderRadius: 16, padding: "1rem 1.25rem", textAlign: "center" }}>
            <p style={{ margin: 0, fontSize: "0.85rem", color: G.textMuted }}>
              🔒 Password change available only for email accounts. You're logged in with {authUser?.authProvider}.
            </p>
          </div>
        )}

      </div>
    </div>
  );
}