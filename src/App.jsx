import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsAuth } from "./Slice/authSlice";
import { Toaster } from "react-hot-toast";
import OAuthCallback  from "./Home/OAuthCallback";
import HealthFormPage from "./Risk/risk";
import AuthPage       from "./Home/signin";
import Home           from "./Pages/Home";
import Navbar         from "./Navbar/Navbar";
import MedicalReport from "./MedicalReport/medicalreportanalyzer"
import ReportPage from "./Report/Report";
import ContactPage from "./ContactPage/ContactPage";
function ProtectedRoute({ children }) {
  const isAuth = useSelector(selectIsAuth);
  return isAuth ? children : <Navigate to="/login" replace />;
}

export default function App() {
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
        {/* Public routes */}
        <Route path="/login"    element={<AuthPage />} />
        <Route path="/register" element={<AuthPage />} />

        {/* OAuth callback — Google/GitHub redirect yahan aata hai */}
        <Route path="/auth/callback" element={<OAuthCallback />} />

        {/* Protected routes */}
        <Route path="/home" element={
          <ProtectedRoute><Home /></ProtectedRoute>
        }/>
        <Route path="/risk" element={
          <ProtectedRoute><HealthFormPage /></ProtectedRoute>
        }/>
        <Route path="/medicalreportanalyzer" element={
          <ProtectedRoute><MedicalReport /></ProtectedRoute>
        }/>
         <Route path="/report" element={
          <ProtectedRoute><ReportPage /></ProtectedRoute>
        }/>
         <Route path="/contact" element={
          <ProtectedRoute><ContactPage /></ProtectedRoute>
        }/>

        {/* Default — login hai toh home, nahi toh login */}
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="*" element={<Navigate to="/home" replace />} />
      </Routes>
    </BrowserRouter>
  );
}