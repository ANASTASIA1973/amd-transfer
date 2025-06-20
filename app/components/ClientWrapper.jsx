// app/components/ClientWrapper.jsx
"use client";

import React from "react";
import GoogleMapsLoader from "./GoogleMapsLoader";
import LanguageSwitcher from "./LanguageSwitcher";
import t from "../i18n/translations";
import { useLocale } from "../context/LocaleContext";

export default function ClientWrapper({ children }) {
  const { locale, setLocale } = useLocale();
  const L = t[locale] || t.de;

  const handleTourRequest = () => {
    const message = L.tourRequestBtn;
    const whatsappNumber = "96181622668";
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
  };

  return (
    <>
      {/* WhatsApp-Touranfrage */}
      <button
        onClick={handleTourRequest}
        className="fixed bottom-4 right-4 bg-[#002147] p-3 flex items-center space-x-2 rounded-full text-white z-40 hover:bg-[#00152f] shadow-lg"
      >
        <span className="text-lg">📱</span>
        <span>{L.tourRequestBtn}</span>
      </button>

      {/* Google Maps laden */}
      <GoogleMapsLoader />

      {/* Sprachumschalter */}
      <div className="absolute top-4 right-4 z-50">
        <LanguageSwitcher locale={locale} setLocale={setLocale} />
      </div>

      {children}
    </>
  );
}
