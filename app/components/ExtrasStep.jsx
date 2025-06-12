// app/components/ExtrasStep.jsx
"use client";

import { useState, useEffect } from "react";
import t from "../i18n/translations";

const priceMap = {
  flowers: 35,
  wine: 39,
  whiskey: 60,
  beer: 9,
  redbull: 7,
  obstplatte: 22,
  pralinen: 14,
  vodka: 50,
};

export default function ExtrasStep({
  locale,
  extrasCounts,
  setExtrasCounts,
  onNext,
  onBack,
}) {
  const L = t[locale] || t.de;
  const [subTotal, setSubTotal] = useState(0);

  // Zwischensumme berechnen
  useEffect(() => {
    let sum = 0;
    for (const key in priceMap) {
      sum += (extrasCounts[key] || 0) * priceMap[key];
    }
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
      {/* Progress Bar */}
      <div className="flex items-center space-x-2 mb-6">
        <span className="w-8 h-8 flex items-center justify-center bg-[#002147] text-white rounded-full">
          5
        </span>
        <div className="flex-1 h-1 bg-gray-200 rounded-full" />
        <span className="text-gray-600">
          {L.stepIndicator.replace("{step}", "5").replace("{total}", "6")}
        </span>
      </div>

      {/* Headline & Subtitle */}
      <h2 className="text-3xl font-bold text-[#002147] mb-2">
        5. {L.extrasStepTitle}
      </h2>
      <p className="text-gray-600 mb-6">{L.extrasStepSubtitle}</p>

      {/* Card Container */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-12 flex flex-col">
        {/* Extras Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {Object.keys(priceMap).map((key) => (
            <div key={key} className="flex flex-col items-center">
              <img
                src={`/extras/${key}.jpg`}
                alt={L[key]}
                className="w-24 h-24 object-cover rounded mb-4"
                loading="lazy"
              />
              <p className="font-medium text-gray-800 mb-4 text-center whitespace-nowrap">
                {L[key]} {L.currencySymbol}
                {priceMap[key]}
              </p>
              <select
                value={extrasCounts[key] ?? 0}
                onChange={(e) => handleChange(key, e.target.value)}
                className="w-full border rounded-lg px-3 py-2 text-center mb-4"
              >
                <option value="0">{L.selectPrompt}</option>
                {[1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>
                    {n} {L.item}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>

        {/* Extras Subtotal */}
        <div className="bg-gray-50 border rounded-lg p-4 mb-6">
          <div className="flex justify-between font-semibold text-gray-900">
            <span>{L.extrasTotalLabel}:</span>
            <span>
              {L.currencySymbol}
              {subTotal}
            </span>
          </div>
        </div>

        {/* Sticky Footer Navigation */}
        <div className="mt-auto sticky bottom-0 bg-white pt-4 border-t flex justify-between">
          <button
            onClick={onBack}
            className="border border-[#002147] text-[#002147] py-3 px-6 rounded-lg hover:bg-gray-100 transition"
          >
            {L.backBtn}
          </button>
          <button
            onClick={onNext}
            className="bg-[#002147] text-white py-3 px-6 rounded-lg hover:bg-[#C09743] transition"
          >
            {L.nextBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
