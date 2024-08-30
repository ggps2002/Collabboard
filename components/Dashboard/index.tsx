'use client'

import { useEffect, useRef, useState } from "react";
import Sidebar from "./Sidebar";
import UserProfile from "./UserProfile";
import MainGrid from "./MainGrid";


export default function DashboardLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfile = () => {
    setIsProfileOpen(!isProfileOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target as Node)) {
        setIsSidebarOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} ref={sidebarRef} />

      {/* Main content */}
      <div className="flex flex-col flex-1 ">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-[#121723] shadow-md relative">
          <button
            className="lg:hidden text-2xl text-gray-100"
            onClick={toggleSidebar}
          >
            ☰
          </button>
          <div className="flex flex-grow justify-end">
            <UserProfile isOpen={isProfileOpen} toggleProfile={toggleProfile} ref={profileRef}/>
          </div>
        </header>

        {/* Main Grid */}
        <main className="flex-1 p-4 bg-[#1E232E]">
          <MainGrid />
        </main>
      </div>
    </div>
  );
}
