import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase"; // Import Supabase client

// Fetch crops data from Supabase
const getCrops = async () => {
  const { data, error } = await supabase.from("Crop").select("label");
  if (error) throw new Error("Failed to read crop data from database");
  return data;
};

// Fetch crop data from Supabase by name
const getCropData = async (cropName) => {
  const { data, error } = await supabase
    .from("Crop")
    .select()
    .eq("label", cropName)
    .limit(1);

  if (error) throw new Error("Failed to read crop data from database");
  return data;
};

// Fetch weather field data from API
const getAPIFieldData = async (longitude, latitude, startDate, endDate) => {
  const requestPayload = {
    units: {
      temperature: "C",
      velocity: "km/h",
      length: "metric",
      energy: "watts",
    },
    geometry: { type: "Point", coordinates: [longitude, latitude, 0] },
    format: "json",
    timeIntervals: [`${startDate}T00:00+00+00/${endDate}T01:00+00+00`],
    queries: [
      {
        domain: "ERA5T",
        timeResolution: "daily",
        codes: [
          { code: 11, level: "2 m above gnd", aggregation: "mean" }, // Temp
          { code: 11, level: "2 m above gnd", aggregation: "min" }, // Temp
          { code: 11, level: "2 m above gnd", aggregation: "max" }, // Temp
          { code: 85, level: "0-7 cm down", aggregation: "mean" }, // Soil Temp
          { code: 61, level: "sfc", aggregation: "sum" }, // Precipitation
          { code: 261, level: "sfc" }, // Evaporation
          { code: 144, level: "0-7 cm down", aggregation: "mean" }, // Soil moisture
        ],
      },
    ],
  };

  const result = await fetch(
    `http://my.meteoblue.com/dataset/query?apikey=${process.env.CE_HISTORICAL_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestPayload),
    },
  );

  const data = await result.json();
  return data;
};

// Fetch field data from Supabase or external API
const getFieldData = async (longitude, latitude, targetMonth) => {
  const { data, error } = await supabase
    .from("Field")
    .select()
    .eq("longitude", longitude)
    .eq("latitude", latitude)
    .eq("month", targetMonth)
    .eq("year", "2024")
    .limit(1);

  if (data && data.length > 0) return data;

  const rawData = await getAPIFieldData(
    longitude,
    latitude,
    "2024-01-01",
    "2024-12-31",
  );

  const dataToBeInserted = rawData[0].timeIntervals[0].map((_, i) => ({
    longitude,
    latitude,
    month: i + 1,
    year: "2024",
    temp_min: Math.round(rawData[0].codes[0].dataPerTimeInterval[0].data[0][i]),
    temp_max: Math.round(rawData[0].codes[1].dataPerTimeInterval[0].data[0][i]),
    temp_avg: Math.round(rawData[0].codes[2].dataPerTimeInterval[0].data[0][i]),
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
  }));

  const { error: insertError } = await supabase
    .from("Field")
    .insert(dataToBeInserted);
  if (insertError) throw new Error("Database insert error");

  const { data: insertedData, error: selectError } = await supabase
    .from("Field")
    .select()
    .eq("longitude", longitude)
    .eq("latitude", latitude)
    .eq("month", targetMonth)
    .eq("year", "2024")
    .limit(1);

  if (selectError) throw new Error("Failed to retrieve inserted data");

  return insertedData;
};

// Calculate match information based on field and crop data
const getMatchInformation = async (
  longitude,
  latitude,
  cropName,
  targetMonth,
) => {
  const fieldData = await getFieldData(longitude, latitude, targetMonth);
  const cropData = await getCropData(cropName);

  const heatStress =
    fieldData[0].temp_max <= cropData[0].temperature_optimum
      ? 0.0
      : fieldData[0].temp_max > cropData[0].temperature_max
        ? 9
        : (fieldData[0].temp_max - cropData[0].temperature_optimum) /
          (fieldData[0].temperature_max - cropData[0].temperature_optimum);

  const length_crop =
    ((cropData[0].temperature_max - cropData[0].temperature_optimum) / 50) *
    100;
  const start_crop = (cropData[0].temperature_optimum / 50) * 100;
  const status_field = (fieldData[0].temp_avg / 50) * 100;

  console.log("temperature_max", cropData[0].temperature_max);
  console.log("plant_temp_optimum", cropData[0].plant_temp_optimum);
  console.log("temp_avg", fieldData[0].temp_avg);
  console.log("length_crop", length_crop);
  console.log("start_crop", start_crop);
  console.log("status_field", status_field);

  return {
    heatStress,
    field_temp_avg: fieldData[0].temp_avg,
    plant_temp_optimum: cropData[0].temperature_optimum,
    plant_temp_max: cropData[0].temperature_max,
    length_crop,
    start_crop,
    status_field,
  };
};

export default function Suggestions({selectedMonth}) {
  const [cropData, setCropData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [matchInformation, setMatchInformation] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const crops = await getCrops();
        const matchInfo = await getMatchInformation(10, 50, "CORN", 5);
        setCropData(crops);
        setMatchInformation(matchInfo);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCropSelect = (crop) => {
    setSelectedCrop(crop);
    setIsDropdownOpen(false);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen((prevState) => !prevState);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col items-center justify-center transition-all duration-300">
      <div className="mb-6 mt-6">
        <h3 className="text-xl font-semibold mb-4 text-green-300">
          Optimal Product Recommendations
        </h3>
        <p>
          Based on your location and date, get tailored crop suggestions to maximize
          yields. Simply select your land on the map, and receive personalized
          recommendations for a successful harvest.
        </p>
        <br></br>
        <p>You will see suggestions for {selectedMonth}</p>
        <div className="relative">
          {/* Changed div to a button for proper accessibility */}
          <button className="btn m-1 btn-wide-4" onClick={toggleDropdown}>
            {selectedCrop ? selectedCrop : "Select a crop"}{" "}
            {/* Display the selected crop */}
          </button>

          {isDropdownOpen && (
            <ul
              className="dropdown-content menu bg-white text-black rounded-box z-10 mt-2 shadow-sm absolute ml-1"
              style={{ width: "500px" }}
            >
              {cropData.map((crop) => (
                <li
                  style={{ flexDirection: "initial" }}
                  key={crop.label}
                  onClick={() => handleCropSelect(crop.label)}
                >
                  <a
                    className="ml-4 mr-4"
                    style={{
                      display: "flex",
                      justifyContent: "space-around",
                      width: "100%",
                      padding: "5px",
                      margin: 0,
                      textAlign: "center",
                    }}
                  >
                    <span
                      style={{
                        flex: 1,
                        margin: 0,
                        padding: 0,
                        lineHeight: 0.5,
                      }}
                    >
                      🌽 {crop.label}
                    </span>
                    <span
                      style={{
                        flex: 1,
                        margin: 0,
                        padding: 0,
                        lineHeight: 0.5,
                      }}
                    >
                      Value Potential:{" "}
                      <span className="text-green-500">60%</span>
                    </span>
                    <span
                      style={{
                        flex: 1,
                        margin: 0,
                        padding: 0,
                        lineHeight: 0.5,
                      }}
                    >
                      Very good
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div
          className={`transition-all duration-300 ${isDropdownOpen ? "mt-24" : ""}`}
        >
          <div className="flex w-full flex-col">
            <h3 className="text-xl font-semibold mt-8 text-green-300">
              Statistics
            </h3>
            <div
              className="divider"
              style={{
                marginTop: "5px",
              }}
            ></div>
          </div>

          {/* Temperature */}
          <h5
            className="text-xl mt-0 mb-4 text-center"
            style={{
              marginTop: "-10px",
              marginBottom: "-5px",
            }}
          >
            Temperature
          </h5>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "-20px",
            }}
          >
            <p
              className="text-sd mt-0 mb-4 text-center text-gray-500"
              style={{
                marginTop: "-10px",
              }}
            >
              -10°C
            </p>
            <p
              className="text-sd mt-0 mb-4 text-center text-gray-500"
              style={{
                marginTop: "-10px",
              }}
            >
              40°C
            </p>
          </div>
          <div
            className="w-full h-4 bg-gray-300 mt-4 rounded-lg relative"
            style={{
              height: "20px",
            }}
          >
            <div
              className="absolute top-0 h-full bg-green-500 rounded-lg"
              style={{
                marginLeft: `${matchInformation.start_crop}%`,
                width: `${matchInformation.length_crop}%`,
                border: "1px solid lightgray",
              }}
            ></div>
            <div
              className="absolute top-0 h-full bg-green-700 rounded-lg"
              style={{
                marginLeft: `${matchInformation.status_field}%`,
                width: `4%`,
                border: "1px solid lightgray",
              }}
            ></div>
          </div>
          <div>
            <div className="flex justify-center">
              <div
                className="mt-4 mr-4"
                style={{
                  display: "flex",
                }}
              >
                <div
                  className="rounded-xs"
                  style={{
                    backgroundColor: "green",
                    width: "15px",
                    height: "15px",
                  }}
                ></div>
                <p
                  style={{
                    marginTop: "-5px",
                    marginLeft: "10px",
                  }}
                >
                  <span className="text-gray-300 mr-2">Your Field:</span>
                  {matchInformation.field_temp_avg}°C
                </p>
              </div>
              <div
                className="mt-4 ml-4"
                style={{
                  display: "flex",
                }}
              >
                <div
                  className="rounded-xs"
                  style={{
                    backgroundColor: "lightgreen",
                    width: "15px",
                    height: "15px",
                  }}
                ></div>
                <p
                  style={{
                    marginTop: "-5px",
                    marginLeft: "10px",
                  }}
                >
                  <span className="text-gray-300 mr-2">Optimal Range:</span>
                  {matchInformation.plant_temp_optimum}°C –{" "}
                  {matchInformation.plant_temp_max}°C
                </p>
              </div>
            </div>
          </div>

          {/* Soil pH-Value */}
          <h5
            className="text-xl mt-0 mb-4 text-center"
            style={{
              marginTop: "30px",
              marginBottom: "-5px",
            }}
          >
            Soil pH-Value
          </h5>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginBottom: "-20px",
            }}
          >
            <p
              className="text-sd mt-0 mb-4 text-center text-gray-500"
              style={{
                marginTop: "-10px",
              }}
            >
              pH 0
            </p>
            <p
              className="text-sd mt-0 mb-4 text-center text-gray-500"
              style={{
                marginTop: "-10px",
              }}
            >
              pH 14
            </p>
          </div>
          <div
            className="w-full h-4 bg-gray-300 mt-4 rounded-lg relative"
            style={{
              height: "20px",
            }}
          >
            <div
              className="absolute top-0 h-full bg-green-500 rounded-lg"
              style={{
                marginLeft: `10%`,
                width: `40%`,
                border: "1px solid lightgray",
              }}
            ></div>
            <div
              className="absolute top-0 h-full bg-green-700 rounded-lg"
              style={{
                marginLeft: `30%`,
                width: `4%`,
                border: "1px solid lightgray",
              }}
            ></div>
          </div>
          <div>
            <div className="flex justify-center">
              <div
                className="mt-4 mr-4"
                style={{
                  display: "flex",
                }}
              >
                <div
                  className="rounded-xs"
                  style={{
                    backgroundColor: "green",
                    width: "15px",
                    height: "15px",
                  }}
                ></div>
                <p
                  style={{
                    marginTop: "-5px",
                    marginLeft: "10px",
                  }}
                >
                  <span className="text-gray-300 mr-2">Your Field:</span>
                  pH 5.5
                </p>
              </div>
              <div
                className="mt-4 ml-4"
                style={{
                  display: "flex",
                }}
              >
                <div
                  className="rounded-xs"
                  style={{
                    backgroundColor: "lightgreen",
                    width: "15px",
                    height: "15px",
                  }}
                ></div>
                <p
                  style={{
                    marginTop: "-5px",
                    marginLeft: "10px",
                  }}
                >
                  <span className="text-gray-300 mr-2">Optimal Range:</span>
                  pH 2.0 – pH 7.0
                </p>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col">
            <h3 className="text-xl font-semibold mt-8 text-green-300">
              Recommentation
            </h3>
            <div
              className="divider"
              style={{
                marginTop: "5px",
              }}
            ></div>

            <div className="flex flex-wrap gap-6">
              <div className="card bg-base-100 w-60 shadow-sm">
                <figure>
                  <img
                    className="h-40 object-cover"
                    src="https://www.syngenta.co.in/sites/g/files/kgtney376/files/styles/syngenta_large_4_3/public/media/image/2021/03/19/banner_2_48546calaris.jpeg?itok=alnxj2wb"
                    alt="Calaris Xtra"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">
                  Calaris Xtra
                    <div className="badge badge-success ml-10">NEW</div>
                  </h2>
                  <p>
                  Presenting Calaris Xtra, India&apos;s first pre-mix herbicide: Inspired by nature to deliver better and long duration control of grass weeds and broad leaf weeds.
                  </p>
                  <div className="card-actions justify-end mt-8">
                    <button className="btn btn-dash btn-success">
                      <a href="https://www.syngenta.co.in/calaris-xtra">More Information</a>
                    </button>
                  </div>
                </div>
              </div>

              <div className="card bg-base-100 w-60 shadow-sm">
                <figure>
                  <img
                    className="h-40 object-cover w-full"
                    src="https://www.syngenta.co.in/sites/g/files/kgtney376/files/styles/syn_full_width_scale/public/media/image/2022/04/12/sugar_75_edit.jpg?itok=C6fhU1b8"
                    alt="Sugar 75"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">Sugar 75
                  </h2>
                  <p>
                  High-yield hybrid seed with robust pest resistance, adaptable across India, and optimized for efficiency.
                  </p>
                  <div className="card-actions justify-end mt-8">
                    <button className="btn btn-dash btn-success">
                      <a href="https://www.syngenta.co.in/product/seed/sweetcorn/sugar-75">More Information</a>
                    </button>
                  </div>
                </div>
              </div>

              <div className="card bg-base-100 w-60 shadow-sm">
                <figure>
                  <img
                    className="h-40 object-cover"
                    src="https://www.syngenta.co.in/sites/g/files/kgtney376/files/styles/syngenta_large_4_3/public/media/image/2022/05/24/riffut_plus.png?itok=ri7Zzbh9"
                    alt="Rifit Plus"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">
                  Rifit Plus
                  </h2>
                  <p>
                  Rifit Plus is an excellent weedicide for planted paddy with improved formula and high-quality spreaders.
                  </p>
                  <div className="card-actions justify-end mt-8">
                    <button className="btn btn-dash btn-success">
                      <a href="https://www.syngenta.co.in/rifit-plus">More Information</a>
                    </button>
                  </div>
                </div>
              </div>

              <div className="card bg-base-100 w-60 shadow-sm">
                <figure>
                  <img
                    className="h-40 object-cover"
                    src="https://www.syngenta.co.in/sites/g/files/kgtney376/files/styles/syngenta_large_4_3/public/media/image/2022/04/26/half_new_isabion.jpg?itok=2lHRMXrt"
                    alt="Isabion"
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">
                  Isabion
                    <div className="badge badge-success ml-10">SALE</div>
                  </h2>
                  <p>
                  Isabion, enables the plant to increase yield and quality of produce naturally. 
                  </p>
                  <div className="card-actions justify-end mt-8">
                    <button className="btn btn-dash btn-success">
                      <a href="https://www.syngenta.co.in/isabion">More Information</a>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
