import { NextResponse } from "next/server";

export async function GET(req) {
    const { searchParams } = new URL(req.url);
  const query = searchParams.get("query");
  const sessionToken = searchParams.get("session_token"); // Get session token from client

  if (!query || !sessionToken) {
    return NextResponse.json({ error: "Missing query or session token" }, { status: 400 });
  }

  const MAPBOX_ACCESS_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const url = `https://api.mapbox.com/search/searchbox/v1/suggest?q=${query}&session_token=${sessionToken}&access_token=${MAPBOX_ACCESS_TOKEN}&limit=1`;

  try {
    /*const response = await fetch(url);
    const data = await response.json();
    console.log("tsets",data)
    if (!data) {return NextResponse.json(data);}
    const mapbox_id = data["suggestions"][0]["mapbox_id"]

    const retrieveURL = `https://api.mapbox.com/search/searchbox/v1/retrieve/${mapbox_id}&session_token=${sessionToken}&access_token=${MAPBOX_ACCESS_TOKEN}`
    const responseRetrieve = await fetch(retrieveURL);
    const dataRetrieve = await responseRetrieve.json();
    console.log("dataRetrieve", retrieveURL, dataRetrieve)
    return NextResponse.json(dataRetrieve); 
    */
   return NextResponse.json({
    "position": [77.701762, 24.400239],
    "name": "Kolua"
   })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch suggestions" }, { status: 500 });
  }
}