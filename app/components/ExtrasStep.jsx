"use client";
import React, { useState, useEffect } from "react";
import t from "../i18n/translations";
import { useLocale } from "../context/LocaleContext";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

/* ====== Preise für Extras ====== */
const priceMap = {
  redWine: 2.5,
  vodka: 2.5,
  whiteWine: 2.5,
  redbull: 6.0,
  beer: 3.5,
  saft: 2.0,
  tadybear: 25.0, // Teddy Bear neu mit Preis
  flowers: 35.0,
  pralinen: 12.0,
};

/* ====== Gruppen ====== */
const drinksKeys = ["redWine", "vodka", "whiteWine", "redbull", "beer", "saft"];
const treatsKeys = ["tadybear", "flowers", "pralinen"]; // Teddy Bear jetzt hier statt Obstbecher

/* ====== Card-Komponente ====== */
function Card({ k, count, onChange, L }) {
  return (
    <div
      className={`group bg-white rounded-lg p-4 flex flex-col items-center border ${
        count > 0
          ? "border-[#C09743] shadow-md"
          : "border-gray-200 hover:shadow-lg"
      }`}
    >
      <div className="w-full h-32 mb-2 overflow-hidden rounded transition-transform duration-200 group-hover:scale-105 flex items-center justify-center">
        <img
          src={`/extras/${k}.jpg`} // Bildname muss genau dem Key entsprechen!
          alt={L[k]}
          className="w-full h-full object-contain"
          loading="lazy"
        />
      </div>
      <p className="text-center font-medium text-gray-800 mb-1 min-h-[40px] flex items-center justify-center">
        {L[k]}
      </p>
      <p className="text-gray-700 text-sm mb-3">${priceMap[k].toFixed(2)}</p>
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onChange(k, -1)}
          disabled={count === 0}
          className="p-1 border rounded disabled:opacity-50"
          aria-label={`Weniger ${L[k]}`}
        >
          <MinusIcon className="w-4 h-4 text-blue-600" />
        </button>
        <span className="w-6 text-center font-medium">{count}</span>
        <button
          onClick={() => onChange(k, +1)}
          className="p-1 border rounded"
          aria-label={`Mehr ${L[k]}`}
        >
          <PlusIcon className="w-4 h-4 text-blue-600" />
        </button>
      </div>
    </div>
  );
}

/* ====== Hauptkomponente ====== */
export default function ExtrasStep({
  extrasCounts,
  setExtrasCounts,
  onNext,
  onBack,
}) {
  const { locale } = useLocale();
  const L = t[locale] || t.de;
  const [subTotal, setSubTotal] = useState(0);

  /* Zwischensumme berechnen */
  useEffect(() => {
    let sum = 0;
    [...drinksKeys, ...treatsKeys].forEach((k) => {
      sum += (extrasCounts[k] || 0) * priceMap[k];
    });
    setSubTotal(sum);
  }, [extrasCounts]);

  const handleChange = (key, delta) => {
    setExtrasCounts((prev) => {
      const newVal = Math.max(0, (prev[key] || 0) + delta);
      return { ...prev, [key]: newVal };
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold text-[#002147] mb-1">
        {L.extrasStepTitle}
      </h2>
      <p className="text-sm text-gray-600 mb-6">{L.extrasStepSubtitle}</p>

      <div className="bg-white rounded-lg shadow px-6 py-8 space-y-12">
        {/* Getränke */}
        <section className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-4">
            {L.extrasGroupDrinks}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {drinksKeys.map((k) => (
              <Card
                key={k}
                k={k}
                count={extrasCounts[k] || 0}
                onChange={handleChange}
                L={L}
              />
            ))}
          </div>
        </section>

        {/* Highlights (ehemals Zusatzangebote) */}
        <section className="bg-gray-50 border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-4">
            {L.extrasGroupTreats} {/* In den Translations z. B. "Highlights" */}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {treatsKeys.map((k) => (
              <Card
                key={k}
                k={k}
                count={extrasCounts[k] || 0}
                onChange={handleChange}
                L={L}
              />
            ))}
          </div>
        </section>

        {/* Summe */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between font-semibold text-gray-800">
          <span>{L.extrasTotalLabel}:</span>
          <span>${subTotal.toFixed(2)}</span>
        </div>

        {/* Navigation */}
        <div className="flex justify-between w-full gap-4">
          <button onClick={onBack} className="btn btn-secondary min-w-[120px]">
            {L.backBtn}
          </button>
          <button onClick={onNext} className="btn btn-primary min-w-[120px]">
            {L.nextBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
