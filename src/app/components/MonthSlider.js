'use client'

import { useEffect, useState } from "react";

export default function MonthSlider({isDrawerOpen, setSelectedMonth}) {
    const [rangeValue, setRangeValue] = useState(1); // State to hold the range value

    const mapMonth = (mNumber) => {
        const monthNumber = parseInt(mNumber, 10); // Convert string to number
        switch (monthNumber) {
            case 1:
                return "January";
            case 2:
                return "February";
            case 3:
                return "March";
            case 4:
                return "April";
            case 5:
                return "May";
            case 6:
                return "June";
            case 7:
                return "July";
            case 8:
                return "August";
            case 9:
                return "September";
            case 10:
                return "October";
            case 11:
                return "November";
            case 12:
                return "December";
            default:
                return "Invalid month number";
        }
    }

    useEffect(()=>{
        setSelectedMonth(mapMonth(1))
    }, [])

    const handleRangeChange = (event) => {
        setRangeValue(event.target.value); // Update the state when the range value changes
        setSelectedMonth(mapMonth(event.target.value))
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
              <h3 className="font-bold">{mapMonth(rangeValue)}</h3>
              <div className="text-xs">
                Please select the time you want to start growing your crops.
              </div>
            </div>
          </div>

          {/* Range input */}
          <input
            type="range"
            min={1}
            max={12}
            value={rangeValue}
            className="range range-lg range-success absolute bottom-12 [--range-bg:white] [--range-fill:0]"
            style={{
              left: isDrawerOpen ? "calc(42% - 310px)" : "42%",
              transition: "all 0.3s ease-in-out",
            }}
            onChange={handleRangeChange}
          />
        </div>
    )
}