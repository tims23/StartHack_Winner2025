'use client'

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import * as turf from '@turf/turf';

import 'mapbox-gl/dist/mapbox-gl.css';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';

const paragraphStyle = {
  fontFamily: 'Open Sans',
  margin: 0,
  fontSize: 13
};

const KrishiMap = ({ isDrawerOpen }) => {
  const mapContainerRef = useRef();
  const mapRef = useRef();
  const drawRef = useRef();
  const markerRef = useRef(null);
  const [roundedArea, setRoundedArea] = useState();

  useEffect(() => {
    mapboxgl.accessToken = 'pk.eyJ1IjoidGltc2EyMyIsImEiOiJjbThocDQxdGcwM3FqMmpzZjFueDdpN2owIn0.fA1ZEFy3uX0k8pKH8cxVsg';

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [-91.874, 42.76],
      zoom: 12
    });

    const draw = new MapboxDraw({
      displayControlsDefault: false,
      controls: {
        polygon: true,
        trash: true
      },
      defaultMode: 'draw_polygon'
    });

    mapRef.current.addControl(draw);
    drawRef.current = draw;

    mapRef.current.on('draw.create', handleNewPolygon);
    mapRef.current.on('draw.update', handleNewPolygon);
  }, []);

  /** Ensures only one polygon exists at a time */
  function handleNewPolygon() {
    const data = drawRef.current.getAll();

    if (data.features.length > 1) {
      drawRef.current.deleteAll();
      drawRef.current.add(data.features[data.features.length - 1]);
    }

    const updatedData = drawRef.current.getAll();
    if (updatedData.features.length > 0) {
      calculateCentroidAndArea(updatedData.features[0]);
      updatePolygonLayer(updatedData.features[0]);
    } else {
      setRoundedArea(null);
    }
  }

  /** Computes centroid and area */
  function calculateCentroidAndArea(polygon) {
    const area = turf.area(polygon);
    setRoundedArea(Math.round(area * 100) / 100);

    const centroid = turf.centroid(polygon);
    const [lng, lat] = centroid.geometry.coordinates;

    if (markerRef.current) markerRef.current.remove();

    markerRef.current = new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .addTo(mapRef.current);
  }

  /** Adds polygon to the map with an animated fill */
  function updatePolygonLayer(polygon) {
    const polygonId = 'animated-polygon';

    if (mapRef.current.getSource(polygonId)) {
      mapRef.current.getSource(polygonId).setData(polygon);
    } else {
      mapRef.current.addSource(polygonId, { type: 'geojson', data: polygon });

      mapRef.current.addLayer({
        id: polygonId,
        type: 'fill',
        source: polygonId,
        paint: { 'fill-color': '#ff0000', 'fill-opacity': 0 } // Start transparent
      });
    }

    animateFillOpacity(polygonId);
  }

  /** Animates the polygon fill opacity */
  function animateFillOpacity(layerId) {
    let opacity = 0;
    function step() {
      if (opacity < 0.5) {
        opacity += 0.02;
        mapRef.current.setPaintProperty(layerId, 'fill-opacity', opacity);
        requestAnimationFrame(step);
      }
    }
    step();
  }

  return (
  <div
    ref={mapContainerRef}
    id="map"
    className="rounded-lg transition-all duration-300 object-cover"
    style={{
      width: isDrawerOpen ? "calc(100% - 620px)" : "100%", // Shrinks the map when sidebar is open
      height: '100%',
      marginLeft: isDrawerOpen ? "620px" : "0", // Moves the map to the right when sidebar opens
      transition: "all 0.3s ease-in-out",
    }}
  ></div>
);
};

export default KrishiMap;