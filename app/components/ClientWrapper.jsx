"use client";

// app/components/ClientWrapper.jsx

import React from "react";
import GoogleMapsLoader from "./GoogleMapsLoader";
import { useLocale } from "../context/LocaleContext";
import t from "../i18n/translations";

export default function ClientWrapper({ children }) {
  const { locale } = useLocale();
  const L = t[locale] || t.de;

  const whatsappNumber = "+96181622668";
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(L.whatsappText)}`;

  return (
    <>
      {/* Google Maps laden */}
      <GoogleMapsLoader />

      {/* HEADER (Logo + Button) */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <img
            src="/logo.png"
            alt="AMD German Center Logo"
            className="h-16 w-auto"
          />
          <a
            href={whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="
              flex items-center gap-2
              bg-[#002147] hover:bg-[#233e69]
              text-white font-semibold rounded-2xl shadow-lg
              px-6 py-2 transition
              focus:outline-none focus:ring-2 focus:ring-[#C6882C]
              text-base
            "
          >
            📱 {L.tourRequestBtn}
          </a>
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen w-full bg-[#FAFAF9] font-sans relative">
        <main className="w-full flex flex-col items-center justify-center px-2">
          {children}
        </main>
      </div>
    </>
  );
}
