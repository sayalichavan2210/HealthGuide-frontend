import { useState } from "react";
import Navbar  from "./Navbar";
// import Sidebar from "./Sidebar";

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div style={{ minHeight: "100vh", background: "#0A0A0A" }}>
      <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

      {/* <Sidebar isOpen={sidebarOpen} /> */}

      {/* Main content */}
      <main style={{
        marginLeft: sidebarOpen ? "220px" : "0px",
        marginTop:  "60px",
        padding:    "2rem",
        transition: "margin-left 0.3s ease",
        minHeight:  "calc(100vh - 60px)",
      }}>
        {children}
      </main>
    </div>
  );
}