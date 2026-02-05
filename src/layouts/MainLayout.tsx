import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Header } from "../components/layout/Header";
import { Sidebar } from "../components/layout/Sidebar";

export const MainLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="h-screen flex flex-col bg-gray-100">
      <Header onMenuClick={toggleSidebar} />

      <div className="flex flex-grow overflow-hidden">
        <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
        <main className="flex-grow p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
