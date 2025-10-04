"use client";

// app/components/SeatExtras.jsx

import React from "react";
import t from "../i18n/translations";
import { useLocale } from "../context/LocaleContext";

const seatTypes = [
  { key: "baby", labelKey: "babyLabel", price: 6 },
  { key: "child", labelKey: "childLabel", price: 6 },
  { key: "booster", labelKey: "boosterLabel", price: 5 },
];

export default function SeatExtras({ counts, setCounts, onNext, onBack }) {
  const { locale } = useLocale();
  const L = t[locale] || t.de;
  const currencySymbol = L.currencySymbol || "$";

  const occupied = seatTypes.filter(s => counts[s.key] > 0);
  const cheapest = occupied.length
    ? occupied.reduce((a, b) => (a.price <= b.price ? a : b))
    : null;

  const costFor = (type) => {
    const c = counts[type.key];
    if (!c) return 0;
    return type.key === cheapest?.key
      ? Math.max(0, (c - 1) * type.price)
      : c * type.price;
  };

  const totalCost = seatTypes.map(costFor).reduce((sum, v) => sum + v, 0);

  const change = (key, delta) =>
    setCounts(prev => {
      const v = Math.max(0, Math.min(3, prev[key] + delta));
      return { ...prev, [key]: v };
    });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold text-[#002147] mb-6">
        {L.seatsTitle}
      </h2>

      <div className="bg-white rounded-lg shadow-sm p-8 mb-12 flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
          {seatTypes.map(type => {
            const count = counts[type.key];
            const isCheapest = type.key === cheapest?.key;

            return (
              <div
                key={type.key}
                className={`
                  relative flex flex-col items-center justify-between
                  border rounded-lg p-4 h-[320px]
                  ${isCheapest ? "border-[#C09743] shadow-md" : "hover:shadow-lg"}
                `}
              >
                {isCheapest && (
                  <span className="absolute top-2 right-2 bg-[#C09743]/20 text-[#C09743] text-xs font-semibold px-2 py-1 rounded">
                    {L.freeBadgeText}
                  </span>
                )}

                <img
                  src={`/seats/${type.key}-seat.jpg`}
                  alt={L[type.labelKey]}
                  className="w-20 h-20 object-contain mb-3"
                />

                <div className="text-gray-800 font-medium text-center leading-snug break-words mb-3">
                  <span className="block">{L[type.labelKey]}</span>
                  <span>{currencySymbol}{type.price}</span>
                </div>

                <div className="flex items-center space-x-2 mb-3">
                  <button
                    onClick={() => change(type.key, -1)}
                    disabled={count === 0}
                    className="w-8 h-8 bg-[#002147] text-white rounded"
                  >–</button>
                  <span>{count}</span>
                  <button
                    onClick={() => change(type.key, 1)}
                    disabled={count === 3}
                    className="w-8 h-8 bg-[#002147] text-white rounded"
                  >+</button>
                </div>

                <div className="text-sm text-gray-600">
                  {count
                    ? `${currencySymbol}${costFor(type).toFixed(2)}`
                    : L.selectPrompt}
                </div>
              </div>
            );
          })}
        </div>

        <div className="bg-gray-50 border rounded-lg p-4 mb-6">
          <div className="flex justify-between font-semibold text-gray-900">
            <span>{L.extrasTotalLabel}:</span>
            <span>{currencySymbol}{totalCost.toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-8 flex justify-between gap-4">
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
