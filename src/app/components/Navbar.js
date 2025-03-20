"use client";

import { useState } from "react";

export default function Navbar() {
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
      <div className="pt-16 transition-all duration-300 bg-base-200">
        <div className="h-[calc(100vh-4rem)] w-full overflow-hidden relative">
          <img
            src="https://images.unsplash.com/photo-1553080608-195dfe15293c?q=80&w=2581&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Landscape"
            className="rounded-lg transition-all duration-300 object-cover"
            style={{
              width: isDrawerOpen ? "calc(100% - 620px)" : "100%",
              marginLeft: isDrawerOpen ? "620px" : "0",
              transition: "all 0.3s ease-in-out",
            }}
          />
        </div>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-[4rem] left-0 h-[calc(100vh-4rem)] w-[620px] bg-base-200 shadow-lg transition-transform duration-300 z-50 flex ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
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
