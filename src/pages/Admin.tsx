import { useState } from "react";
import { Outlet } from "react-router-dom";
import Header from "../layout/Header";
import Sidebar from "../layout/Sidebar";

function Admin() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans antialiased text-slate-900">
      <Header onToggleMobileSidebar={() => setIsMobileSidebarOpen(true)} />
      
      <div className="flex flex-col md:flex-row flex-1 w-full relative">
        <Sidebar 
          isMobileOpen={isMobileSidebarOpen} 
          onCloseMobile={() => setIsMobileSidebarOpen(false)} 
        />

        <main className="flex-1 p-4 md:p-6 lg:p-8 max-w-7xl w-full mx-auto overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Admin;

