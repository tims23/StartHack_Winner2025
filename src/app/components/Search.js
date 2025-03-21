'use client'

import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid"; // Import UUID to generate session tokens

export default function Search({setPosition}) {
  const [query, setQuery] = useState("");
  const [sessionToken, setSessionToken] = useState("");

  const fetchSuggestions = async () => {
    if (!query) return;

    const res = await fetch(`/api/mapbox?query=${query}&session_token=${sessionToken}`);
    const data = await res.json();
    setQuery(data["name"] || query)
    setPosition(data["position"] || []);
  };

  useEffect(() => {
    setSessionToken(uuidv4());
  }, []);

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="mb-6 mt-6">
        <h3 className="text-xl font-semibold mb-4 text-green-300">
          Search your land
        </h3>
        <p>
          Enter your farm&apos;s location to quickly find it on the map. Provide
          coordinates or the name, and get tailored agricultural insights and
          resources for your area.
        </p>
      </div>
      <div className="w-full max-w-md mt-12">
        <fieldset className="fieldset">
          <input type="text" className="input w-full" placeholder="Type here" value={query} onChange={(e) => setQuery(e.target.value)} />
          <p className="fieldset-label">Location</p>
        </fieldset>
      </div>
      <button className="btn btn-dash btn-success" onClick={fetchSuggestions}>Search</button>
    </div>
  );
}
