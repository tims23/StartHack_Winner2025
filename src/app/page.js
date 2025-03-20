import Image from "next/image";
import Navbar from "./components/Navbar";
import CropsList from "./components/CropsList";
import KrishiMap from "./components/Map";

export default async function Home() {
  return ( 
    <main className="relative w-screen h-screen">

    <KrishiMap></KrishiMap>
    </main>
  );
}
