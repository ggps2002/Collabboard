import React, { forwardRef } from "react";

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}
 
const Sidebar = forwardRef<HTMLDivElement, SidebarProps>(({ isOpen, toggleSidebar }, ref) => {
  return (
    <div
      ref={ref}
      className={`fixed inset-y-0 left-0 w-64 bg-gray-900 shadow-lg text-white transform ${
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
          <li className="p-4 hover:bg-gray-700">Home</li>
          <li className="p-4 hover:bg-gray-700">Projects</li>
          <li className="p-4 hover:bg-gray-700">Settings</li>
        </ul>
      </nav>
    </div>
  );
});

export default Sidebar;
