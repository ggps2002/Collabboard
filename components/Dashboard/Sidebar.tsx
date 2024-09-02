'use client'

import React, { forwardRef, useState } from "react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  sidebarActive: string;
  toggleSidebarActive: (active: string) => void;
  toggleProjectDetails: (projectId: string) => void;
}
 
const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(({ isOpen, toggleSidebar ,sidebarActive ,toggleSidebarActive ,toggleProjectDetails }, ref) => {
  return (
    <div
      ref={ref}
      className={`fixed inset-y-0 left-0 w-64 bg-[#030711] shadow-lg text-white transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } lg:translate-x-0 transition-transform duration-300 ease-in-out z-50`}
    >
      <button
        className="lg:hidden absolute top-4 right-4 text-white text-2xl"
        onClick={toggleSidebar}
      >
        ×
      </button>
      <nav className="flex flex-col h-full">
        <div className="p-4 text-lg font-bold">Dashboard</div>
        <ul className="flex-1">
          <li onClick={() => {
            toggleSidebarActive('home');
            toggleProjectDetails('');
          }} className={`cursor-default p-4 ${ sidebarActive == 'home' ? 'bg-primary' : 'hover:bg-gray-700'} rounded-lg mx-2`}>Home</li>
          <li onClick={() => {
            toggleSidebarActive('projects');
            toggleProjectDetails('');
          }} className={`cursor-default p-4 ${ sidebarActive == 'projects' ? 'bg-primary' : 'hover:bg-gray-700'} rounded-lg mx-2 my-2`}>Projects</li>
          <li onClick={() => {
            toggleSidebarActive('settings');
            toggleProjectDetails('');
          }} className={`cursor-default p-4 ${ sidebarActive == 'settings' ? 'bg-primary' : 'hover:bg-gray-700'} mx-2 rounded-lg`}>Settings</li>
        </ul>
      </nav>
    </div>
  );
});

export default Sidebar;
