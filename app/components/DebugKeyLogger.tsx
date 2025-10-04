"use client";
import { useEffect } from "react";

export default function DebugKeyLogger() {
  useEffect(() => {
    console.log("DEBUG API Key (Client):", process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);
  }, []);

  return null;
}
