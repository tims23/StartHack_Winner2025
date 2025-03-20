'use client'

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

export default function CropsList() {
    const [data, setData] = useState([]);
    
      const fetchData = async () => {
        const { data, error } = await supabase.from('Crop').select('*');
        if (error) {
          throw new Error(error.message);
        }
        console.log("fetched", data)
        setData(data)
      }

      useEffect(() => {
fetchData()
      }, []);

    return (
        <ul onClick={fetchData}>
            {data.map((crop) => (
      <li key={crop.label}>{crop.label}</li>
    ))}
        </ul>
    )
}