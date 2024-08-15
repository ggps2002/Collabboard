import React, { forwardRef, useRef } from "react";
import ProfileIcon from "./ProfileIcon";

interface UserProfileProps {
  isOpen: boolean;
  toggleProfile: () => void;
}

const UserProfile = forwardRef<HTMLDivElement, UserProfileProps>(({ isOpen, toggleProfile }, ref) => {
  const profileRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={ref}
      className="relative flex items-center ml-auto"
    >
      {/* Profile Icon Button */}
      <ProfileIcon onClick={toggleProfile} />

      {/* Profile Dropdown */}
      <div
        ref={profileRef}
        className={`absolute right-0 top-full mt-2 bg-gray-100  shadow-lg p-4 rounded-lg w-80 ${isOpen ? "block" : "hidden"}`}
        onClick={(e) => e.stopPropagation()} // Prevent click inside from closing
      >
        <div className="flex flex-col items-start space-y-4">
          <div className="flex items-center space-x-4">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRAMh_SuFO3GQYFbivDLoBdV478E3H9QPePgQ&s" // Replace with your profile picture path
              alt="Profile"
              className="w-16 h-16 rounded-full"
            />
            <div>
              <p className="font-bold text-gray-800">User Name</p>
              <p className="text-gray-600">user@example.com</p>
            </div>
          </div>
          <ul className="space-y-2">
            <li><a href="/profile" className="text-blue-600 hover:underline">Profile</a></li>
            <li><button className="text-red-600 hover:underline" onClick={() => alert("Logged out")}>Logout</button></li>
          </ul>
        </div>
      </div>
    </div>
  );
});

export default UserProfile;
