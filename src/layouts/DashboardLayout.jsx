// renderer/src/layouts/DashboardLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import { useState } from "react";

export default function DashboardLayout() {
 const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);

  return (
    <div className="app-container">
       {sidebarOpen && <Sidebar isOpen={sidebarOpen} closeSidebar={() => setSidebarOpen(false)} />}

      <div className="main-area">
        
        <Header isSidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}/>
        <main className="main-content">
          <Outlet /> 
        </main>
      </div>
    </div>
  );
}
