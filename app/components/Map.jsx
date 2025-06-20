"use client";

import { useEffect, useRef } from "react";

export default function Map({
  center = { lat: 33.8938, lng: 35.5018 }, // Standard: Beirut
  zoom = 12,
  width = "100%",
  height = "400px",
}) {
  const mapRef = useRef(null);

  useEffect(() => {
    // erst im Browser und nachdem das API-Script geladen ist
    if (typeof window === "undefined" || !window.google?.maps) return;

    // Map-Instanz erstellen
    new window.google.maps.Map(mapRef.current, {
      center,
      zoom,
    });
  }, [center, zoom]);

  // Div, in dem die Karte gerendert wird
  return (
    <div
      ref={mapRef}
      style={{ width, height }}
      className="rounded-lg shadow-sm mb-8"
    />
  );
}
