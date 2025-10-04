"use client";
import { useEffect, useState } from "react";

export default function GoogleMapsLoader() {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Warten, bis window.__env existiert
    const key = window.__env?.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) return;

    setApiKey(key);
  }, []);

  useEffect(() => {
    if (!apiKey) return;

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
