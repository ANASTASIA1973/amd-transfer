"use client";
import { useEffect } from "react";

export default function GoogleMapsLoaderClient() {
  const apiKey = typeof window !== "undefined"
    ? window.__env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    : "";

  useEffect(() => {
    if (!apiKey) return;
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    document.head.appendChild(script);
  }, [apiKey]);

  return null;
}
