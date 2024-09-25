'use client';

import { useEffect, useRef, useState } from 'react';
import Sidebar from './Sidebar';
import UserProfile from './UserProfile';
import MainGrid from './MainGrid';

interface DashboardProps {
  id: string;
  name: string;
  email: string;
}

const DashboardLayout: React.FC<DashboardProps> = ({ name, email ,id }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const [ sidebarActive, setSidebarActive ] = useState('home');
  const [viewProjectDetails, setViewProjectDetails] = useState('');

  const toggleViewProjectsDetails = (name: string) => {
    setViewProjectDetails(name);
  }

  const toggleSidebarActive = (active : string) => {
    setSidebarActive(active);
  }
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

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} ref={sidebarRef} sidebarActive={sidebarActive} toggleSidebarActive={toggleSidebarActive} toggleProjectDetails={toggleViewProjectsDetails}/>

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="flex items-center justify-between p-4 bg-[#030711] shadow-md relative">
          <button
            className="lg:hidden text-2xl text-gray-100"
            onClick={toggleSidebar}
          >
            ☰
          </button>
          <div className="flex flex-grow justify-end">
            <UserProfile name={name} email={email} />
          </div>
        </header>

        {/* Main Grid */}
        <main className="flex-1 p-4 bg-[#0f1421]">
          <MainGrid id={id} name={name} active={sidebarActive} projectDetails={viewProjectDetails} toggleProjectDetails={toggleViewProjectsDetails}/>
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
