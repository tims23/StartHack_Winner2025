"use client";

import { useState } from "react";
import KrishiMap from "./Map";
import Sidebar from "./Sidebar";

export default function Navbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [rangeValue, setRangeValue] = useState(60); // State to hold the range value
  const [activeCategory, setActiveCategory] = useState("category1"); // Default category is 'category1'

  const handleRangeChange = (event) => {
    setRangeValue(event.target.value); // Update the state when the range value changes
  };

  const handleCategoryClick = (category) => {
    setActiveCategory(category); // Set the active category
  };

  return (
    <div className="relative">
      {/* Navbar */}
      <div className="navbar bg-base-100 shadow-sm fixed top-0 left-0 w-full z-50 flex items-center p-2">
        <button
          className="p-2 rounded-md flex items-center justify-center ml-4"
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
          <KrishiMap
            isDrawerOpen={isDrawerOpen}
            className="rounded-lg transition-all duration-300 object-cover"
            style={{
              width: isDrawerOpen ? "calc(100% - 620px)" : "100%", // Shrinks the map when sidebar is open
              marginLeft: isDrawerOpen ? "620px" : "0", // Moves the map to the right when sidebar opens
              transition: "all 0.3s ease-in-out",
            }}
          />

          {/* Range description */}
          <div
            role="alert"
            className="alert alert-vertical alert-success sm:alert-horizontal absolute bottom-22 w-full"
            style={{
              left: isDrawerOpen ? "calc(42% + 310px)" : "42%",
              transition: "all 0.3s ease-in-out",
              maxWidth: "320px",
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              className="stroke-black h-6 w-6 shrink-0"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              ></path>
            </svg>
            <div>
              <h3 className="font-bold">September</h3>
              <div className="text-xs">
                Please select the time you want to start growing your crops.
              </div>
            </div>
          </div>

          {/* Range input */}
          <input
            type="range"
            min={0}
            max="100"
            value={rangeValue}
            className="range range-lg range-success absolute bottom-12"
            style={{
              left: isDrawerOpen ? "calc(42% + 310px)" : "42%",
              transition: "all 0.3s ease-in-out",
            }}
            onChange={handleRangeChange}
          />
        </div>
      </div>

            <Sidebar handleCategoryClick={handleCategoryClick} isDrawerOpen={isDrawerOpen} activeCategory={activeCategory}></Sidebar>
    </div>
  );
}
