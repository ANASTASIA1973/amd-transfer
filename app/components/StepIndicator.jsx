"use client";
// app/components/StepIndicator.jsx

import React from "react";
import t from "../i18n/translations";
import { useLocale } from "../context/LocaleContext";

export default function StepIndicator({ step = 1, total = 6 }) {
  const { locale } = useLocale();
  const L = t[locale] || t.de;

  // Fallback-Label falls key fehlt
  const raw = L.stepIndicator || "Schritt {step} von {total}";
  const label = raw.replace("{step}", step).replace("{total}", total);

  // 0–100% Fortschritt (Schritt 1 = 0%)
  const percent =
    total > 1 ? Math.max(0, Math.min(100, ((step - 1) / (total - 1)) * 100)) : 100;

  const isRTL = locale === "ar";

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="w-full mb-6">
      {/* 3‑Spalten‑Grid: Label | Progress | Counter */}
      <div className="grid grid-cols-[auto,1fr,auto] items-center gap-2 px-3 sm:px-0 min-w-0">
        {/* Label */}
        <span className="text-sm sm:text-base font-medium text-[#002147] truncate min-w-0">
          {label}
        </span>

        {/* Progressbar mittig, overflow-sicher */}
        <div className="h-1.5 bg-[#ead9b7] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#C09743] transition-[width] duration-300 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Zähler rechts */}
        <span className="text-sm text-[#002147] whitespace-nowrap">
          {step}/{total}
        </span>
      </div>
    </div>
  );
}
