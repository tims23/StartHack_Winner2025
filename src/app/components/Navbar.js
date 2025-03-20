"use client";

import { useState } from "react";
import KrishiMap from "./Map";
import Category1 from "./Category1";
import Category2 from "./Category2";
import Category3 from "./Category3";

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

      {/* Sidebar */}
      <div
        className={`fixed top-[4rem] left-0 h-[calc(100vh-4rem)] w-[620px] bg-base-200 shadow-lg transition-transform duration-300 z-50 flex ${
          isDrawerOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Left Sidebar (80px) */}
        <div className="w-[80px] bg-base-300 flex flex-col items-center p-6">
          {/* Button 1 */}
          <button
            className={`mb-4 p-2 ${activeCategory === "category1" ? "text-green-300" : "text-white"}`}
            onClick={() => handleCategoryClick("category1")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path d="M6 3a3 3 0 0 0-3 3v1.5a.75.75 0 0 0 1.5 0V6A1.5 1.5 0 0 1 6 4.5h1.5a.75.75 0 0 0 0-1.5H6ZM16.5 3a.75.75 0 0 0 0 1.5H18A1.5 1.5 0 0 1 19.5 6v1.5a.75.75 0 0 0 1.5 0V6a3 3 0 0 0-3-3h-1.5ZM12 8.25a3.75 3.75 0 1 0 0 7.5 3.75 3.75 0 0 0 0-7.5ZM4.5 16.5a.75.75 0 0 0-1.5 0V18a3 3 0 0 0 3 3h1.5a.75.75 0 0 0 0-1.5H6A1.5 1.5 0 0 1 4.5 18v-1.5ZM21 16.5a.75.75 0 0 0-1.5 0V18a1.5 1.5 0 0 1-1.5 1.5h-1.5a.75.75 0 0 0 0 1.5H18a3 3 0 0 0 3-3v-1.5Z" />
            </svg>
          </button>

          {/* Button 2 */}
          <button
            className={`mb-4 p-2 ${activeCategory === "category2" ? "text-green-300" : "text-white"}`}
            onClick={() => handleCategoryClick("category2")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M2.25 13.5a8.25 8.25 0 0 1 8.25-8.25.75.75 0 0 1 .75.75v6.75H18a.75.75 0 0 1 .75.75 8.25 8.25 0 0 1-16.5 0Z"
                clipRule="evenodd"
              />
              <path
                fillRule="evenodd"
                d="M12.75 3a.75.75 0 0 1 .75-.75 8.25 8.25 0 0 1 8.25 8.25.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75V3Z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {/* Button 3 */}
          <button
            className={`mb-4 p-2 ${activeCategory === "category3" ? "text-green-300" : "text-white"}`}
            onClick={() => handleCategoryClick("category3")}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>

        {/* Right Sidebar content */}
        <div className="flex-1 p-6 bg-base-200">
          {activeCategory === "category1" && <Category1 />}
          {activeCategory === "category2" && <Category2 />}
          {activeCategory === "category3" && <Category3 />}
        </div>
      </div>
    </div>
  );
}
