"use client";
// app/components/GoogleMapsLoader.jsx
import { useEffect } from "react";

export default function GoogleMapsLoader() {
  // Stelle sicher, dass wir nur im Browser rendern
  if (typeof window === "undefined") return null;

  // API-Key aus public/env.js holen
  const apiKey = window.__env?.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";
  if (!apiKey) return null;

  useEffect(() => {
    // Google Maps Script dynamisch einfügen
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    document.head.appendChild(script);

    return () => {
      document.head.removeChild(script);
    };
  }, [apiKey]);

  return null;
}
