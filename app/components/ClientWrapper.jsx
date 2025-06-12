// app/components/ClientWrapper.jsx
"use client";

import React, { useState } from "react";
import GoogleMapsLoader from "./GoogleMapsLoader";
import LanguageSwitcher from "./LanguageSwitcher";

export default function ClientWrapper({ children }) {
  const [locale, setLocale] = useState("de");

  return (
    <>
      {/* Initialisiert Google Maps (Client) */}
      <GoogleMapsLoader />

      {/* Einziger Sprachumschalter */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher locale={locale} setLocale={setLocale} />
      </div>

      {/* Alle Seiten bekommen locale als Prop */}
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(child, { locale })
          : child
      )}
    </>
  );
}
