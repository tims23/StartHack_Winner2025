import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // Import Supabase client

const getCrops = async () => {
  const { data, error } = await supabase
    .from("Crop")
    .select("label");

  if (error) {
    throw new Error("Failed to read crop data from database");
  } else {
    return data;
  }
};

export default function Category2() {
  const [cropData, setCropData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(""); // Variable to store the selected crop
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track dropdown open/close state

  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const data = await getCrops();
        setCropData(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCrops();
  }, []);

  const handleCropSelect = (crop) => {
    setSelectedCrop(crop); // Update selected crop on selection
    setIsDropdownOpen(false); // Close the dropdown after selection
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center transition-all duration-300">
      <div className="mb-6 mt-6">
        <h3 className="text-xl font-semibold mb-4 text-green-300">
          Optimal Crop Recommendations
        </h3>
        <p>
          Based on your location, get tailored crop suggestions to maximize
          yields. Simply select your land on the map, and receive personalized
          recommendations for a successful harvest.
        </p>
        <div className="relative">
          {/* Changed div to a button for proper accessibility */}
          <button
            className="btn m-1"
            onClick={toggleDropdown}
          >
            {selectedCrop ? selectedCrop : "Select a crop"} {/* Display the selected crop */}
          </button>

          {/* Conditionally render dropdown menu */}
          {isDropdownOpen && (
            <ul 
              className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm mt-2 absolute"
            >
              {cropData.map((crop) => (
                <li key={crop.label} onClick={() => handleCropSelect(crop.label)}>
                  <a>{crop.label}</a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add dynamic margin-top based on dropdown state */}
        <div className={`transition-all duration-300 ${isDropdownOpen ? "mt-32" : ""}`}>
          <h5 className="text-md font-semibold mb-4 text-green-300">Statistics</h5>
          <p>
            View detailed statistics on temperature, rainfall, and other key
            factors to optimize crop growth.
          </p>

          <div className="w-full h-4 bg-gray-300 mt-4 rounded-lg">
            <div 
              className="w-2/5 h-full bg-blue-400 rounded-lg" 
              style={{ marginLeft: "20%" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
