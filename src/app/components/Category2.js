import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // Import Supabase client

const getCrops = async () => {
  const { data, error } = await supabase.from("Crop").select("label");

  if (error) {
    throw new Error("Failed to read crop data from database");
  } else {
    return data;
  }
};

const APIkey = process.env.CE_HISTORICAL_API_KEY;

const getCropData = async (imCropName) =>
  new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("Crop")
      .select()
      .eq("label", imCropName)
      .limit(1);

    if (error) {
      reject("Failed to read crop data from database");
    } else {
      resolve(data);
    }
  });

const getAPIFieldData = async (
  imLongitude,
  imLatitude,
  imStartDate,
  imEndDate,
) =>
  new Promise(async (resolve, reject) => {
    const requestPayload = {
      units: {
        temperature: "C",
        velocity: "km/h",
        length: "metric",
        energy: "watts",
      },
      geometry: {
        type: "Point",
        coordinates: [imLongitude, imLatitude, 0],
      },
      format: "json",
      timeIntervals: [
        imStartDate + "T00:00+00+00/" + imEndDate + "T01:00+00+00",
      ],
      queries: [
        {
          domain: "ERA5T",
          gapFillDomain: null,
          timeResolution: "daily",
          codes: [
            { code: 11, level: "2 m above gnd", aggregation: "mean" }, // Temp
            { code: 11, level: "2 m above gnd", aggregation: "min" }, // Temp
            { code: 11, level: "2 m above gnd", aggregation: "max" }, // Temp
            { code: 85, level: "0-7 cm down", aggregation: "mean" }, // Soil Temp
            { code: 61, level: "sfc", aggregation: "sum" }, // Precipation
            { code: 261, level: "sfc" }, // Evaporation
            { code: 144, level: "0-7 cm down", aggregation: "mean" }, // Soil moisture
          ],
          transformations: [
            {
              type: "aggregateMonthly",
              aggregation: "mean",
            },
          ],
        },
        /*{
                domain: "WISE30",
                gapFillDomain: null,
                timeResolution: "daily",
                codes: [
                    //{ code: 812, level: "0 cm", aggregation: "mean"}          
                    { code: 817, level: "0-20 cm", aggregation: "mean"}
                ],
                transformations: [
                    {
                        type: "aggregateMonthly",
                        aggregation: "mean"
                    }
                ]
            }*/
      ],
    };

    const result = await fetch(
      "http://my.meteoblue.com/dataset/query?apikey=" + APIkey,
      {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestPayload),
      },
    );

    resolve(await result.json());
  });

const getFieldData = async (imLongitude, imLatitude, imTargetMonth) =>
  new Promise(async (resolve, reject) => {
    const { data, error } = await supabase
      .from("Field")
      .select()
      .eq("longitude", imLongitude)
      .eq("latitude", imLatitude)
      .eq("month", imTargetMonth)
      .eq("year", "2024")
      .limit(1);

    if (data === null || data.length == 0) {
      // if data is not yet in database

      const rawData = await getAPIFieldData(
        imLongitude,
        imLatitude,
        "2024-01-01",
        "2024-12-31",
      );

      // lets reformat data into database ready
      let dataToBeInserted = [];
      for (let i = 0; i < rawData[0].timeIntervals[0].length; i++) {
        dataToBeInserted.push({
          longitude: imLongitude,
          latitude: imLatitude,
          month: i + 1,
          year: "2024",
          temp_min: Math.round(
            rawData[0].codes[0].dataPerTimeInterval[0].data[0][i],
          ),
          temp_max: Math.round(
            rawData[0].codes[1].dataPerTimeInterval[0].data[0][i],
          ),
          temp_avg: Math.round(
            rawData[0].codes[2].dataPerTimeInterval[0].data[0][i],
          ),
          soil_temp_avg: Math.round(
            rawData[0].codes[3].dataPerTimeInterval[0].data[0][i],
          ),
          precipitation: Math.round(
            rawData[0].codes[4].dataPerTimeInterval[0].data[0][i],
          ),
          evaporation: Math.round(
            rawData[0].codes[5].dataPerTimeInterval[0].data[0][i],
          ),
          soil_moisture: Math.round(
            rawData[0].codes[5].dataPerTimeInterval[0].data[0][i],
          ),
          //nitrogen: rawData[0].codes[0].data[0][0],
          //ph: rawData[0].codes[0].data[0][0]
        });

        const { error } = await supabase.from("Field").insert(dataToBeInserted);

        if (error) {
          console.log("Database Error Occured" + error);
          reject();
        } else {
          const { insertedData, error } = await supabase
            .from("Field")
            .select()
            .eq("longitude", imLongitude)
            .eq("latitude", imLatitude)
            .eq("month", imTargetMonth)
            .eq("year", "2024")
            .limit(1);

          if (error) {
            console.log("Database Select after insert Error Occured" + error);
            reject();
          } else {
            resolve(insertedData);
          }
        }
      }
    } else {
      resolve(data);
    }
  });

const getMatchInformation = async (
  imLongitude,
  imLatitude,
  imCropName,
  imTargetMonth,
) =>
  new Promise(async (resolve, reject) => {
    const fieldData = await getFieldData(
      imLongitude,
      imLatitude,
      imTargetMonth,
    );
    const cropData = await getCropData(imCropName);

    let heatStress = 0.0;
    if (fieldData[0].temp_max <= cropData[0].temperature_optimum) {
      heatStress = 0.0;
    } else if (fieldData[0].temp_max > cropData[0].temperature_max) {
      heatStress = 9;
    } else {
      heatStress =
        (fieldData[0].temp_max - cropData[0].temperature_optimum) /
        (fieldData[0].temperature_max - cropData[0].temperature_optimum);
    }

    const minTemp = -20.0;
    const maxTemp = 60.0;
    const ratio_crop =
      80 / (cropData[0].temperature_max - cropData[0].temperature_optimum);
    const offset_crop =
      ((cropData[0].temperature_optimum - minTemp) / (maxTemp - minTemp)) * 100;
    const offset_field =
      ((fieldData[0].temp_avg - minTemp) / (maxTemp - minTemp)) * 100;

    resolve({
      heatStress: heatStress,
      field_temp_avg: fieldData[0].temp_max,
      plant_temp_min: cropData[0].temperature_optimum,
      plant_temp_max: cropData[0].temperature_max,
      ratio_crop: ratio_crop,
      offset_crop: offset_crop,
      offset_field: offset_field,
    });
  });

export default function Category2() {
  const [cropData, setCropData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(""); // Variable to store the selected crop
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // Track dropdown open/close state
  const [matchInformation, setMatchInformation] = useState({});

  useEffect(() => {
    const fetchCrops = async () => {
      const test = await getMatchInformation(10, 50, "CORN", 5);
      console.log(JSON.stringify(test));
      try {
        const data = await getCrops();
        const sample = await getMatchInformation(10, 50, "CORN", 5);
        setCropData(data);
        setMatchInformation(sample);
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
          <button className="btn m-1 btn-wide-4" onClick={toggleDropdown}>
            {selectedCrop ? selectedCrop : "Select a crop"}{" "}
            {/* Display the selected crop */}
          </button>

          {/* Conditionally render dropdown menu */}
          {isDropdownOpen && (
            <ul className="dropdown-content menu bg-base-100 rounded-box z-10 w-52 p-2 shadow-sm mt-2 absolute">
              {cropData.map((crop) => (
                <li
                  key={crop.label}
                  onClick={() => handleCropSelect(crop.label)}
                >
                  <a>{crop.label}</a>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Add dynamic margin-top based on dropdown state */}
        <div
          className={`transition-all duration-300 ${isDropdownOpen ? "mt-32" : ""}`}
        >
          <h5 className="text-md font-semibold mb-4 text-green-300">
            Heat Stress
          </h5>

          <div className="w-full h-4 bg-gray-300 mt-4 rounded-lg relative">
            {/* First Division (Blue) */}
            <div
              className="absolute top-0 h-full bg-blue-400 rounded-lg"
              style={{
                marginLeft: `${matchInformation.offset_crop}%`,
                width: `${matchInformation.ratio_crop}%`,
              }}
            ></div>

            {/* Second Division (Green) */}
            <div
              className="absolute top-0 h-full bg-green-400 rounded-lg"
              style={{
                marginLeft: `${matchInformation.offset_field}%`,
                width: `4%`,
              }}
            ></div>

            <div
              className="absolute text-xs bg-black px-1 py-0.5 rounded shadow-md"
              style={{
                top: "-18px", // Moves label above the green div
                left: `calc(${matchInformation.offset_field}% + 3.5%)`, // Position relative to green div
                transform: "translateX(-50%)", // Centers it above the div
              }}
            >
              Field Temperature: {matchInformation.field_temp_avg}°
            </div>
          </div>
        </div>
        <p>Heat Stress: {matchInformation.heatStress}</p>
      </div>
    </div>
  );
}
