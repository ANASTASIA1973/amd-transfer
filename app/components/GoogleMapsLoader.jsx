"use client";
import { useEffect } from "react";


export default function GoogleMapsLoader() {
  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) {
      console.warn("GoogleMapsLoader: NEXT_PUBLIC_GOOGLE_MAPS_API_KEY fehlt");
      return;
    }

    if (window.google?.maps) return;

    const existing = document.querySelector('script[data-google-maps="1"]');
    if (existing) return;

    const script = document.createElement("script");
    script.setAttribute("data-google-maps", "1");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${key}&libraries=places`;
    script.async = true;
    script.defer = true;

    document.head.appendChild(script);
  }, []);

  return null;
}
