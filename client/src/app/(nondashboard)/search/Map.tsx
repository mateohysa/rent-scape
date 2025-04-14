"use client";
import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useAppSelector } from "@/state/redux";
import { useGetPropertiesQuery } from "@/state/api";
import { Property } from "@/types/prismaTypes";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN as string;

// Coordinates for Tirana, Albania
const TIRANA_COORDINATES: [number, number] = [19.8187, 41.3275];

const Map = () => {
  const mapContainerRef = useRef(null);
  const filters = useAppSelector((state) => state.global.filters);
  const {
    data: properties,
    isLoading,
    isError,
  } = useGetPropertiesQuery(filters);

  useEffect(() => {
    if (isLoading || isError || !properties) return;

    let mapInstance: mapboxgl.Map | null = null;
    
    try {
      // Use Tirana coordinates if no coordinates in filters
      // Use a standard Mapbox style that's guaranteed to exist
      mapInstance = new mapboxgl.Map({
        container: mapContainerRef.current!,
        style: "mapbox://styles/mapbox/streets-v12", // Standard style that won't 404
        center: filters.coordinates?.length === 2 
          ? [filters.coordinates[0], filters.coordinates[1]] as [number, number]
          : TIRANA_COORDINATES,
        zoom: 9,
      });

      properties.forEach((property) => {
        if (mapInstance) {
          const marker = createPropertyMarker(property, mapInstance);
          const markerElement = marker.getElement();
          const path = markerElement.querySelector("path[fill='#3FB1CE']");
          if (path) path.setAttribute("fill", "#000000");
        }
      });

      // Fix map resize timing issue with safety checks
      const resizeMap = () => {
        if (mapInstance && !mapInstance._removed) {
          setTimeout(() => {
            try {
              mapInstance?.resize();
            } catch (e) {
              console.error("Error resizing map:", e);
            }
          }, 700);
        }
      };
      
      resizeMap();
    } catch (error) {
      console.error("Error initializing map:", error);
    }

    return () => {
      if (mapInstance && !mapInstance._removed) {
        try {
          mapInstance.remove();
        } catch (e) {
          console.error("Error removing map:", e);
        }
      }
    };
  }, [isLoading, isError, properties, filters.coordinates]);

  if (isLoading) return <>Loading...</>;
  if (isError || !properties) return <div>Failed to fetch properties</div>;

  return (
    <div className="basis-5/12 grow relative rounded-xl">
      <div
        className="map-container rounded-xl"
        ref={mapContainerRef}
        style={{
          height: "100%",
          width: "100%",
        }}
      />
    </div>
  );
};

const createPropertyMarker = (property: Property, map: mapboxgl.Map) => {
  const marker = new mapboxgl.Marker()
    .setLngLat([
      property.location.coordinates.longitude,
      property.location.coordinates.latitude,
    ])
    .setPopup(
      new mapboxgl.Popup().setHTML(
        `
        <div class="marker-popup">
          <div class="marker-popup-image"></div>
          <div>
            <a href="/search/${property.id}" target="_blank" class="marker-popup-title">${property.name}</a>
            <p class="marker-popup-price">
              $${property.pricePerMonth.toFixed(0)}
              <span class="marker-popup-price-unit"> / month</span>
            </p>
          </div>
        </div>
        `
      )
    )
    .addTo(map);
  return marker;
};

export default Map;