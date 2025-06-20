"use client";
// app/components/ExtrasStep.jsx

import React, { useState, useEffect } from "react";
import t from "../i18n/translations";
import { useLocale } from "../context/LocaleContext";

// Preise werden nur noch intern für die Berechnung benötigt
const priceMap = {
  flowers:     45,
  redWine:     20,
  whiteWine:   20,
  whiskey:     35,
  beer:         6,
  redbull:      8,
  obstbecher:  11,
  pralinen:    12,
  vodka:       20,
};

export default function ExtrasStep({
  extrasCounts,
  setExtrasCounts,
  onNext,
  onBack,
}) {
  const { locale } = useLocale();
  const L = t[locale] || t.de;
  const [subTotal, setSubTotal] = useState(0);

  // Zwischensumme berechnen
  useEffect(() => {
    const sum = Object.entries(priceMap).reduce(
      (acc, [key, price]) => acc + (extrasCounts[key] || 0) * price,
      0
    );
    setSubTotal(sum);
  }, [extrasCounts]);

  const handleChange = (key, value) => {
    setExtrasCounts((counts) => ({
      ...counts,
      [key]: Number(value),
    }));
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold text-[#002147] mb-6">
        {L.extrasStepTitle}
      </h2>

      <div className="bg-white rounded-lg shadow-sm p-8 mb-12 flex flex-col">
        {/* Grid der 9 Extras */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.keys(priceMap).map((key) => (
            <div key={key} className="flex flex-col items-center">
              <img
                src={`/extras/${key}.jpg`}
                alt={L[key]}
                className="w-24 h-24 object-cover rounded mb-4"
                loading="lazy"
              />
              {/* Übersetztes Label enthält jetzt schon den Preis */}
              <p className="font-medium text-gray-800 mb-4 text-center whitespace-nowrap">
                {L[key]}
              </p>
              <select
                value={extrasCounts[key] ?? 0}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-center mb-4"
              >
                <option value="0">{L.selectPrompt}</option>
                {[...Array(5)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>
                    {i + 1}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Zwischensumme */}
        <div className="bg-gray-50 border rounded-lg p-4 mb-6">
          <div className="flex justify-between font-semibold text-gray-900">
            <span>{L.extrasTotalLabel}:</span>
            <span>${subTotal}</span>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between">
          <button onClick={onBack} className="btn btn-secondary">
            {L.backBtn}
          </button>
          <button onClick={onNext} className="btn btn-primary">
            {L.nextBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
