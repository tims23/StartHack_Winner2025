"use client";

import { useState } from "react";
import KrishiMap from "./Map";
import Sidebar from "./Sidebar";
import MonthSlider from "./MonthSlider";

export default function Navbar({children}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState("category1"); // Default category is 'category1'
  const [position, setPosition] = useState([77.214430, 28.600417]); 
  const [dragedMapPosition, setDragedMap] = useState([])
  const [selectedMonth, setSelectedMonth] = useState("-")

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
      <div className="pt-16 transition-all duration-5300 bg-base-200">
        <div className="h-[calc(100vh-2rem)] w-full overflow-hidden relative"
        style={{marginLeft: isDrawerOpen ? "620px" : "0", transition: "all 0.3s ease-in-out"}}>
         <KrishiMap width={isDrawerOpen ? "calc(100% - 620px)" : "100%"} small={isDrawerOpen} position={position} setDragedMap={setDragedMap}></KrishiMap>
      <MonthSlider isDrawerOpen={isDrawerOpen} 
      setSelectedMonth={setSelectedMonth}></MonthSlider>
        </div>
      </div>

            <Sidebar handleCategoryClick={handleCategoryClick} 
            isDrawerOpen={isDrawerOpen} 
            activeCategory={activeCategory}
            setPosition={setPosition}
            dragedMapPosition={dragedMapPosition}
            selectedMonth={selectedMonth}
            ></Sidebar>
    </div>
  );
}
