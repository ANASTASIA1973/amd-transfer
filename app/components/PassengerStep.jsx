"use client";
// app/components/PassengerStep.jsx

import React from "react";
import t from "../i18n/translations";
import { useLocale } from "../context/LocaleContext";
import { FaUser, FaChild } from "react-icons/fa";

export default function PassengerStep({
  adults,
  setAdults,
  children,
  setChildren,
  onNext,
  onBack,
}) {
  const { locale } = useLocale();
  const L = t[locale] || t.de;

  const maxPassengers = 8;
  const total = adults + children;

  // *** Block für mehr als 8 Fahrgäste: ***
  if (total > maxPassengers) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-[#002147] mb-6">
          {L.passengerTitle}
        </h1>
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="text-lg font-semibold text-red-600 mb-4">
            {L.vehicleTooManyPersons ||
              "Für Gruppen mit mehr als 8 Fahrgästen ist eine Online-Buchung nicht möglich."}
          </div>
          <div className="mb-6 text-gray-700">
            {L.useWhatsappTopRight ||
              "Bitte nutzen Sie den WhatsApp-Button oben rechts für eine individuelle Anfrage."}
          </div>
          <div className="mt-8">
            <button
              onClick={onBack}
              className="px-6 py-3 border border-[#002147] text-[#002147] rounded-lg hover:bg-[#002147] hover:text-white transition"
            >
              {L.backBtn}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // *** Ab hier das normale Formular für 1–8 Fahrgäste ***
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-[#002147] mb-6">
        {L.passengerTitle}
      </h1>

      <div className="bg-white rounded-lg shadow-md p-8 space-y-8">
        {/* Erwachsene */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            <FaUser className="inline-block mr-2 text-[#002147]" />
            {L.adultsLabel}
          </label>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setAdults(Math.max(1, adults - 1))}
              className="w-10 h-10 rounded-full bg-gray-100 text-xl text-[#002147] hover:bg-gray-200"
              aria-label="Erwachsene minus"
              disabled={adults <= 1}
            >
              −
            </button>
            <span className="text-lg font-semibold">{adults}</span>
            <button
              onClick={() => setAdults(adults + 1)}
              className="w-10 h-10 rounded-full bg-gray-100 text-xl text-[#002147] hover:bg-gray-200"
              aria-label="Erwachsene plus"
            >
              +
            </button>
          </div>
        </div>

        {/* Kinder */}
        <div>
          <label className="block text-gray-700 font-medium mb-2">
            <FaChild className="inline-block mr-2 text-[#002147]" />
            {L.childrenLabel}
          </label>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setChildren(Math.max(0, children - 1))}
              className="w-10 h-10 rounded-full bg-gray-100 text-xl text-[#002147] hover:bg-gray-200"
              aria-label="Kinder minus"
              disabled={children <= 0}
            >
              −
            </button>
            <span className="text-lg font-semibold">{children}</span>
            <button
              onClick={() => setChildren(children + 1)}
              className="w-10 h-10 rounded-full bg-gray-100 text-xl text-[#002147] hover:bg-gray-200"
              aria-label="Kinder plus"
            >
              +
            </button>
          </div>
        </div>

        {/* Hinweis, wenn genau 8 */}
        {total === maxPassengers && (
          <div className="mt-4 text-red-600 text-sm">
            {L.maxPassengersHint ||
              "Maximal 8 Fahrgäste pro Fahrzeug (der Fahrer zählt nicht dazu)."}
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="px-6 py-3 border border-[#002147] text-[#002147] rounded-lg hover:bg-[#002147] hover:text-white transition"
          >
            {L.backBtn}
          </button>
          <button
            onClick={onNext}
            className="px-6 py-3 bg-[#002147] text-white rounded-lg hover:bg-[#C09743] transition"
          >
            {L.nextBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
