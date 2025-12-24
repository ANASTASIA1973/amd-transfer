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

/**
 * ✅ Deine echten Bilder liegen laut dir unter /public/images
 * In Next.js sind die dann per "/images/..." erreichbar.
 * Falls ein Bild nicht gefunden wird, fällt es automatisch auf den alten /seats/... Pfad zurück.
 */
const seatImageMap = {
  baby: "/images/babyschale.jpg",
  child: "/images/kindersitz.jpg",
  booster: "/images/sitzerhoehung.jpg",
};

export default function SeatExtras({ counts, setCounts, onNext, onBack }) {
  const { locale } = useLocale();
  const L = t[locale] || t.de;
  const currencySymbol = L.currencySymbol || "$";

  const costFor = (type) => {
    const c = counts?.[type.key] || 0;
    if (!c) return 0;
    return c * type.price;
  };

  const totalCost = seatTypes.map(costFor).reduce((sum, v) => sum + v, 0);

  const change = (key, delta) =>
    setCounts((prev) => {
      const cur = prev?.[key] || 0;
      const v = Math.max(0, Math.min(3, cur + delta));
      return { ...prev, [key]: v };
    });

  // ===== Main-page look tokens (lokal, weil Transfer-App eigenständig) =====
  const ACCENT = "#1f6f3a"; // zedern-grün (gedeckt)
  const ACCENT_SOFT = "rgba(31,111,58,.10)";
  const ACCENT_BORDER = "rgba(31,111,58,.20)";
  const HEADING = "#0b1f3a";
  const TEXT = "rgba(17,24,39,.72)";
  const BORDER = "rgba(17,24,39,.10)";
  const SHADOW = "0 14px 34px rgba(15,23,42,.08)";
  const CARD_RADIUS = 18;

  const getSeatImageSrc = (key) => seatImageMap[key] || `/seats/${key}-seat.jpg`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div
        className="bg-white border p-7 sm:p-8 mb-12 flex flex-col"
        style={{
          borderColor: BORDER,
          borderRadius: 22,
          boxShadow: SHADOW,
        }}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {seatTypes.map((type) => {
            const count = counts?.[type.key] || 0;
            const isActive = count > 0;

            return (
              <div
                key={type.key}
                className="relative overflow-hidden"
                style={{
                  border: `1px solid ${BORDER}`,
                  borderRadius: CARD_RADIUS,
                  background: "#fff",
                  boxShadow: isActive
                    ? "0 18px 40px rgba(15,23,42,.10)"
                    : "0 12px 28px rgba(15,23,42,.06)",
                  transform: isActive ? "translateY(-1px)" : "none",
                  transition: "all .16s ease",
                }}
              >
                {/* Left accent stripe */}
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: 4,
                    background: `linear-gradient(180deg, ${ACCENT} 0%, rgba(31,111,58,.40) 55%, rgba(31,111,58,.12) 100%)`,
                    opacity: 0.95,
                  }}
                />

                {/* Top hairline */}
                <div
                  aria-hidden="true"
                  style={{
                    height: 1,
                    background:
                      "linear-gradient(90deg, rgba(31,111,58,.18), rgba(31,111,58,0))",
                    marginLeft: 4,
                  }}
                />

                <div className="p-5 flex flex-col items-center text-center" style={{ paddingLeft: 22 }}>
                  {/* Image frame */}
                  <div
                    className="w-full rounded-xl border overflow-hidden flex items-center justify-center"
                    style={{
                      borderColor: "rgba(17,24,39,.08)",
                      background: "#fbfbfc",
                      minHeight: 132,
                    }}
                  >
                    <img
                      src={getSeatImageSrc(type.key)}
                      alt={L[type.labelKey]}
                      className="max-h-[96px] w-auto object-contain"
                      loading="lazy"
                      decoding="async"
                      onError={(e) => {
                        // Fallback: alter Pfad, falls /images/... nicht existiert
                        const fallback = `/seats/${type.key}-seat.jpg`;
                        if (e.currentTarget.src.endsWith(fallback)) return;
                        e.currentTarget.src = fallback;
                      }}
                    />
                  </div>

                  <div className="mt-4">
                    <div className="font-extrabold" style={{ color: HEADING }}>
                      {L[type.labelKey]}
                    </div>
                    <div className="mt-1 text-sm font-semibold" style={{ color: TEXT }}>
                      {currencySymbol}
                      {type.price}
                    </div>
                  </div>

                  {/* Counter */}
                  <div className="mt-5 flex items-center gap-3">
                    <button
                      onClick={() => change(type.key, -1)}
                      disabled={count === 0}
                      type="button"
                      className="w-10 h-10 rounded-full border inline-flex items-center justify-center text-lg font-semibold transition"
                      style={{
                        background: "#fff",
                        borderColor:
                          count === 0 ? "rgba(17,24,39,.10)" : "rgba(17,24,39,.16)",
                        color: HEADING,
                        opacity: count === 0 ? 0.45 : 1,
                        cursor: count === 0 ? "not-allowed" : "pointer",
                      }}
                      onMouseEnter={(e) => {
                        if (count === 0) return;
                        e.currentTarget.style.borderColor = ACCENT_BORDER;
                        e.currentTarget.style.boxShadow = `0 0 0 6px ${ACCENT_SOFT}`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(17,24,39,.16)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      –
                    </button>

                    <span
                      className="min-w-[2.2rem] text-center text-base font-extrabold tabular-nums"
                      style={{ color: HEADING }}
                    >
                      {count}
                    </span>

                    <button
                      onClick={() => change(type.key, 1)}
                      disabled={count === 3}
                      type="button"
                      className="w-10 h-10 rounded-full border inline-flex items-center justify-center text-lg font-semibold transition"
                      style={{
                        background: "#fff",
                        borderColor:
                          count === 3 ? "rgba(17,24,39,.10)" : "rgba(17,24,39,.16)",
                        color: HEADING,
                        opacity: count === 3 ? 0.45 : 1,
                        cursor: count === 3 ? "not-allowed" : "pointer",
                      }}
                      onMouseEnter={(e) => {
                        if (count === 3) return;
                        e.currentTarget.style.borderColor = ACCENT_BORDER;
                        e.currentTarget.style.boxShadow = `0 0 0 6px ${ACCENT_SOFT}`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(17,24,39,.16)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      +
                    </button>
                  </div>

                  <div className="mt-4 text-sm" style={{ color: TEXT }}>
                    {count ? (
                      <span className="font-semibold">
                        {currencySymbol}
                        {costFor(type).toFixed(2)}
                      </span>
                   ) : (
  L.selectPrompt
)}

                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Total summary */}
        <div
          className="border rounded-xl p-4 mb-2"
          style={{
            borderColor: BORDER,
            background: "#fff",
            boxShadow: "0 12px 28px rgba(15,23,42,.06)",
          }}
        >
          <div className="flex justify-between font-semibold" style={{ color: HEADING }}>
            <span>{L.extrasTotalLabel}:</span>
            <span>
              {currencySymbol}
              {totalCost.toFixed(2)}
            </span>
          </div>
        </div>

       <div className="mt-7 amd-step-actions">
  <button onClick={onBack} className="btn btn-secondary" type="button">
    {L.backBtn}
  </button>
  <button onClick={onNext} className="btn btn-primary" type="button">
    {L.nextBtn}
  </button>
</div>

      </div>
    </div>
  );
}
