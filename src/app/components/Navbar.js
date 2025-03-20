"use client";

import { useState } from "react";
import KrishiMap from "./Map";

export default function Navbar({children}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  return (
    <div className="relative">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-sm fixed top-0 left-0 w-full z-50 flex items-center p-2">
        <button
          className="p-2 rounded-md flex items-center justify-center ml-4" // Add ml-4 here
          onClick={() => {
            setIsDrawerOpen(!isDrawerOpen);
            console.log("Sidebar-Toggle:", !isDrawerOpen);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h7"
            />
          </svg>
        </button>

        <div className="navbar-center absolute left-1/2 transform -translate-x-1/2">
          <a className="btn-ghost text-xl">syngenta krishi</a>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-16 transition-all duration-5300 bg-base-200">
        <div className="h-[calc(100vh-4rem)] w-full overflow-hidden relative"
        style={{marginLeft: isDrawerOpen ? "620px" : "0", transition: "all 0.3s ease-in-out"}}>
´          <KrishiMap width={isDrawerOpen ? "calc(100% - 620px)" : "100%"} small={isDrawerOpen} ></KrishiMap>
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-[4rem] left-0 h-[calc(100vh-4rem)] w-[620px] bg-base-200 shadow-lg transition-transform duration-300 ease-in-out z-50 flex`}
        style={{transition: "all 0.3s ease-in-out", transform: isDrawerOpen ? "translateX(0px)" : "translateX(-100%)"}}
      >
        {/* Linke Leiste (80px) */}
        <div className="w-[80px] bg-base-300 flex flex-col items-center p-4">
          <button className="mb-4">🔍</button>
          <button className="mb-4">📂</button>
          <button className="mb-4">⚙️</button>
        </div>

        {/* Rechte Leiste (540px) */}
        <div className="w-[540px] p-4">
          <ul className="menu">
            <li>
              <a>Item 1</a>
            </li>
            <li>
              <a>Item 2</a>
            </li>
            <li>
              <a>Item 3</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
