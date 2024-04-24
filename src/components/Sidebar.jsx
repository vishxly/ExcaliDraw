import React, { useState } from "react";
import { BsLayoutTextSidebar } from "react-icons/bs";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Controls */}
      <div className="absolute top-0 z-10 w-full py-2">
        <div className="flex justify-start items-center gap-3 py-2 px-3 mx-auto border shadow-lg rounded-lg">
          <div
            className="mt-8 ml-6 cursor-pointer"
            onClick={handleSidebarClick}
            onDoubleClick={() => setSidebarOpen(false)}
          >
            <BsLayoutTextSidebar />
          </div>
          <button
            className="p-1 hover:bg-violet-100 rounded"
            onClick={() => console.log("Clicked")}
          ></button>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`absolute top-0 left-0 h-full bg-gray-200 w-48 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out`}
      >
        {/* Your sidebar content goes here */}
      </div>
    </div>
  );
};

export default Sidebar;
