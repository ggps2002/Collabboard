'use client'

import React, { useEffect, useRef, useState } from "react";
import NewProjectDiv from "./NewProjectDiv";

const MainGrid: React.FC = () => {
  const [create , setCreate] = useState(false)
  const createRef = useRef<HTMLDivElement>(null)
  const toggleCreateProject = () => {
    setCreate((prev)=>(
      !prev
    ))
  }
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (createRef.current && !createRef.current.contains(event.target as Node)) {
        setCreate(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [create]);
  return (
    <div className="grid grid-cols-1 lg:ml-64  gap-4">
      {/* New Project Card */}
      <div className=" p-6 rounded-lg shadow-md">
        <div className="flex justify-end">
          <button onClick={toggleCreateProject} className="px-4 py-2 bg-blue-600 text-white rounded-md">
            New Project
          </button>
        </div>
        <NewProjectDiv/>
        <NewProjectDiv/>
        <NewProjectDiv/>
        {create && <div ref={createRef} className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[24rem] bg-white shadow-lg p-5 rounded-lg">
            <form action="/create" method="post">
            <input name="projectName" type="text" placeholder="Enter Project Name" className="w-full h-10 pl-2 bg-slate-100 text-black"/>
            <div className="flex justify-end mt-7">
            <button type="submit" className="h-10 p-2 bg-blue-500" onClick={(e)=>(e.preventDefault())}>Create</button>
            </div>
            </form>
        </div>}
      </div>
    </div>
  );
};

export default MainGrid;
