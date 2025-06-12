// app/components/SeatExtras.jsx
"use client";

import t from "../i18n/translations";

const seatTypes = [
  { key: "baby", labelKey: "babyLabel", price: 5 },
  { key: "child", labelKey: "childLabel", price: 6 },
  { key: "booster", labelKey: "boosterLabel", price: 4 },
];

export default function SeatExtras({
  locale,
  counts,
  setCounts,
  onNext,
  onBack,
}) {
  const L = t[locale] || t.de;
  const currencySymbol = L.currencySymbol || "$";

  // Helfer: max 3 pro Kategorie
  const change = (key, delta) => {
    setCounts((prev) => {
      const newCount = Math.max(0, Math.min(3, (prev[key] || 0) + delta));
      return { ...prev, [key]: newCount };
    });
  };

  // Gratis-Sitz und Kosten berechnen
  const pricesList = Object.entries(counts)
    .flatMap(([k, c]) =>
      Array(c).fill(seatTypes.find((s) => s.key === k).price)
    )
    .sort((a, b) => a - b);
  const freePrice = pricesList[0] || 0;
  const totalCost = pricesList.slice(1).reduce((sum, p) => sum + p, 0);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="flex items-center space-x-2 mb-6">
        <span className="w-8 h-8 flex items-center justify-center bg-[#002147] text-white rounded-full">
          4
        </span>
        <div className="flex-1 h-1 bg-gray-200 rounded-full" />
        <span className="text-gray-600">
          {L.stepIndicator.replace("{step}", "4").replace("{total}", "6")}
        </span>
      </div>

      {/* Headline & Subtitle */}
      <h2 className="text-3xl font-bold text-[#002147] mb-2">
        4. {L.seatsTitle}
      </h2>
      <p className="text-gray-600 mb-6">{L.seatsSubtitle}</p>

      {/* Card Container */}
      <div className="bg-white rounded-lg shadow-sm p-8 mb-12 flex flex-col">
        {/* Seat Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-6 auto-rows-fr">
          {seatTypes.map(({ key, labelKey, price }) => {
            const count = counts[key] || 0;
            const isFree = count > 0 && price === freePrice;
            const canIncrement = count < 3;
            return (
              <div
                key={key}
                className={`relative flex flex-col h-full items-center bg-white border rounded-lg p-6 transition-shadow ${
                  isFree ? "border-[#C09743] shadow-md" : "hover:shadow-lg"
                }`}
              >
                {isFree && (
                  <span className="absolute top-2 right-2 bg-[#C09743]/20 text-[#C09743] text-xs font-semibold px-2 py-1 rounded">
                    {L.freeBadgeText}
                  </span>
                )}
                <img
                  src={`/seats/${key}-seat.jpg`}
                  alt={L[labelKey]}
                  className="w-24 h-24 object-cover rounded mb-4"
                  loading="lazy"
                />
                <div className="text-center font-medium mb-2 text-gray-800">
                  {L[labelKey]} {currencySymbol}
                  {price}
                </div>
                <div className="flex items-center space-x-2 mb-4">
                  <button
                    onClick={() => change(key, -1)}
                    className="w-8 h-8 flex items-center justify-center bg-[#002147] text-white rounded hover:bg-[#C09743] transition"
                    disabled={count === 0}
                  >
                    –
                  </button>
                  <span className="text-gray-700">{count}</span>
                  <button
                    onClick={() => change(key, 1)}
                    className="w-8 h-8 flex items-center justify-center bg-[#002147] text-white rounded hover:bg-[#C09743] transition"
                    disabled={!canIncrement}
                  >
                    +
                  </button>
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  {count === 0
                    ? L.selectPrompt
                    : `${currencySymbol}${price * count}`}
                </div>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="bg-gray-50 border rounded-lg p-4 mb-6">
          <div className="flex justify-between font-semibold text-gray-900">
            <span>{L.extrasTotalLabel}:</span>
            <span>
              {currencySymbol}
              {totalCost}
            </span>
          </div>
        </div>

        {/* Footer Navigation */}
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
