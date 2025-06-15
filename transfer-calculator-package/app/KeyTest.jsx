"use client";
import { useEffect } from "react";

export default function KeyTest() {
  useEffect(() => {
    console.log(
      "CLIENT MAPS_KEY:",
      process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    );
  }, []);

  return (
    <div className="p-4 bg-yellow-50 border border-yellow-300">
      <p>Schau in die Konsole, ob Dein API-Key kommt.</p>
    </div>
  );
}
