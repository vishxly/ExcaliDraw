/* eslint-disable no-undef */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { BsLayoutTextSidebar } from "react-icons/bs";

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSidebarClick = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div
      className={`absolute top-0 left-0 z-10 h-full py-2 ${
        sidebarOpen ? "w-20" : "w-28"
      } transition-all duration-300 ease-in-out bg-gray-200`}
    >
      <div
        className={`flex flex-col justify-start items-center gap-3 py-2 px-3 mx-auto border shadow-lg rounded-lg cursor-pointer ${
          sidebarOpen ? "w-16" : "w-28"
        }`}
      >
        <div
          className="mt-4 hover:bg-violet-100 cursor-pointer"
          onClick={handleSidebarClick}
          onDoubleClick={() => setSidebarOpen(false)}
        >
          <BsLayoutTextSidebar size={30} />
        </div>
        {sidebarOpen && (
          <>
            <div
              className="mt-4  cursor-pointer hover:bg-violet-200"
              onClick={() =>
                // eslint-disable-next-line no-undef
                setAction(action === ACTIONS.SELECT ? null : ACTIONS.SELECT)
              }
              onDoubleClick={() => setAction(null)}
            >
              <div>
                <Link
                  to="/login"
                  className="mt-4 cursor-pointer hover:bg-violet-200"
                >
                  Sign Up
                </Link>
              </div>
            </div>
            <div
              className="mt-4  cursor-pointer hover:bg-violet-200"
              onClick={() => console.log("Theme")}
              onDoubleClick={() => console.log("Theme")}
            >
              Theme
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
