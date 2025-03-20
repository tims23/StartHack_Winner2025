import Image from "next/image";
import { supabase } from "@/lib/supabase"; // Import Supabase client
import Navbar from "./components/Navbar";

async function getCrops() {
  const { data, error } = await supabase.from("Crop").select("*");
  if (error) {
    throw new Error(error.message);
  }
  console.log("test", data);
  return data;
}

export default async function Home() {
  const crops = await getCrops();
  // DO NOT CHANGE THIS FILE
  return;
}
