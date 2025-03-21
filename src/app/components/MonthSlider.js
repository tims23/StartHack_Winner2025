'use client'

import { useState } from "react";

export default function MonthSlider({isDrawerOpen}) {
    const [rangeValue, setRangeValue] = useState(60); // State to hold the range value

    const handleRangeChange = (event) => {
        setRangeValue(event.target.value); // Update the state when the range value changes
      };

    return (
        <div>
                      {/* Range description */}
          <div
            role="alert"
            className="alert alert-vertical alert-success sm:alert-horizontal absolute bottom-22 w-full"
            style={{
              left: isDrawerOpen ? "calc(42% - 310px)" : "42%",
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
              left: isDrawerOpen ? "calc(42% - 310px)" : "42%",
              transition: "all 0.3s ease-in-out",
            }}
            onChange={handleRangeChange}
          />
        </div>
    )
}