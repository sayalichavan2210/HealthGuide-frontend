import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import { setCredentials } from "../Slice/authSlice";
import toast from "react-hot-toast";

export default function OAuthCallback() {
  const dispatch       = useDispatch();
  const navigate       = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token   = searchParams.get("token");
    const refresh = searchParams.get("refresh");
    const error   = searchParams.get("error");

    if (error) {
      toast.error("OAuth login failed. Try again.");
      navigate("/auth");
      return;
    }

    if (!token) {
      navigate("/auth");
      return;
    }

    // /me call karke real user info lo
    fetch("http://localhost:5000/api/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          dispatch(setCredentials({
            user:         data.user,
            accessToken:  token,
            refreshToken: refresh,
          }));
          toast.success(`Welcome, ${data.user.firstName}!`);
          navigate("/");
        } else {
          throw new Error("Failed to get user");
        }
      })
      .catch(() => {
        toast.error("Login failed. Try again.");
        navigate("/auth");
      });
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0A0A0A",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
    }}>
      <div style={{ textAlign: "center" }}>
        <div style={{
          width: "40px", height: "40px",
          border: "3px solid #4ADE80",
          borderTopColor: "transparent",
          borderRadius: "50%",
          animation: "spin 0.8s linear infinite",
          margin: "0 auto 16px",
        }} />
        <p style={{ color: "rgba(255,255,255,0.5)" }}>Logging you in...</p>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}