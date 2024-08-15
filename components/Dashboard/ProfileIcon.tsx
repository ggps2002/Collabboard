import React from "react";

const ProfileIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="w-[5rem] h-[5rem] flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300"
  >
    {/* Example SVG for a person icon */}
    <img
      src="https://i.pinimg.com/736x/0d/64/98/0d64989794b1a4c9d89bff571d3d5842.jpg" // Replace with your image path
      alt="Profile"
      className="w-full h-full rounded-full"
    />
  </button>
);

export default ProfileIcon;
