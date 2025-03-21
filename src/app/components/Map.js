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
const KrishiMap = ({width, small, position}) => {
  const mapContainerRef = useRef();
  const mapRef = useRef();
  const drawRef = useRef();
  const markerRef = useRef(null);
  const [roundedArea, setRoundedArea] = useState();
  const [zoom, setZoom] = useState(12)

  useEffect(() => {
    if (small) {
        setZoom(mapRef.current.getZoom())
    }
    if (mapRef.current) {
      const timeout = setTimeout(() => {
        mapRef.current.flyTo({
          zoom: small ? zoom-0.5 : zoom,
          essential: true, // Ensures animation is visible to all users
          duration: 300, // Smooth animation over 5.3 seconds
          curve: 1.8
        });
      }, 300); // Delay of 1 second before flyTo is executed
  
      return () => clearTimeout(timeout); // Cleanup in case the component unmounts or `small` changes
    }
  }, [small]);

  useEffect(() => {
    if (!mapRef.current) { return }

    mapRef.current.flyTo({
        zoom: 12,
        essential: true, // Ensures animation is visible to all users
        duration: 3000, // Smooth animation over 5.3 seconds
        curve: 1.8,
        center: position
      });
  }, [position])

  useEffect(() => {
    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: position,
      zoom: small ? 11 : 12
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
    <div ref={mapContainerRef} id="map" style={{ height: '100%', width: width, transition: "all 0.3s ease-in-out"}}></div>
  );
};

export default KrishiMap;