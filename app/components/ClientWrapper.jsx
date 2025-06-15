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
      {/* Tour-Anfrage per WhatsApp */}
      <button
        onClick={handleTourRequest}
        className="fixed top-4 left-4 bg-green-500 p-2 flex items-center space-x-2 rounded-full text-white z-50 hover:bg-green-600"
      >
        {/* Icon */}
        <span className="text-lg">📱</span>
        {/* Übersetztes Label */}
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
