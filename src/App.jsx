import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuth, selectCurrentUser } from "./Slice/authSlice";
import { Toaster } from "react-hot-toast";

import OAuthCallback  from "./Home/OAuthCallback";
import HealthFormPage from "./Risk/risk";
import AuthPage       from "./Home/signin";
import Home           from "./Pages/Home";
import Navbar         from "./Navbar/Navbar";
import MedicalReport  from "./MedicalReport/medicalreportanalyzer";
import ReportPage     from "./Report/Report";
import ContactPage    from "./ContactPage/ContactPage";
import AboutUs        from "./Aboutus/AboutUs";
import ProfilePopup from "./Profile/profilepopup";
import AdminPanel from "./Admin/AdminPanel";
function ProtectedRoute({ children }) {
  const isAuth = useSelector(selectIsAuth);
  return isAuth ? children : <Navigate to="/login" replace />;
}

// ── Auth route — already logged in hai toh /home ──────────────────────────────
function AuthRoute({ children }) {
  const isAuth = useSelector(selectIsAuth);
  return isAuth ? <Navigate to="/home" replace /> : children;
}

// ── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const user      = useSelector(selectCurrentUser);
  const userEmail = user?.email || "";

  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1a1a1a",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.1)",
          },
        }}
      />

      <Routes>

        {/* ── Default — seedha /login ── */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* ── Auth routes — logged in hai toh /home redirect ── */}
        <Route path="/login"    element={<AuthRoute><AuthPage /></AuthRoute>} />
        <Route path="/register" element={<AuthRoute><AuthPage /></AuthRoute>} />

        {/* ── OAuth callback ── */}
        <Route path="/auth/callback" element={<OAuthCallback />} />

        {/* ── Protected routes — sab ke liye login zaroori ── */}
        <Route path="/home" element={
          <ProtectedRoute><Home /></ProtectedRoute>
        }/>

        <Route path="/risk" element={
          <ProtectedRoute>
            <HealthFormPage userEmail={userEmail} />
          </ProtectedRoute>
        }/>

        <Route path="/medicalreportanalyzer" element={
          <ProtectedRoute><MedicalReport /></ProtectedRoute>
        }/>
         <Route path="/profile" element={
          <ProtectedRoute><ProfilePopup /></ProtectedRoute>
        }/>

        <Route path="/report" element={
          <ProtectedRoute><ReportPage /></ProtectedRoute>
        }/>

        <Route path="/contact" element={
          <ProtectedRoute><ContactPage /></ProtectedRoute>
        }/>

        <Route path="/about" element={
          <ProtectedRoute><AboutUs /></ProtectedRoute>
        }/>
        <Route path="/admin" element={
          <ProtectedRoute><AdminPanel /></ProtectedRoute>
        }/>

        {/* ── Fallback ── */}
        <Route path="*" element={<Navigate to="/login" replace />} />

      </Routes>
    </BrowserRouter>
  );
}