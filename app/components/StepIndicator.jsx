"use client";
// app/components/StepIndicator.jsx

import React from "react";
import t from "../i18n/translations";
import { useLocale } from "../context/LocaleContext";

export default function StepIndicator({ step, total }) {
  const { locale } = useLocale();
  const L = t[locale] || t.de;

  const text = L.stepIndicator
    .replace("{step}", step)
    .replace("{total}", total);

  return (
    <div className="flex items-center space-x-2 mb-6">
      <span className="w-8 h-8 flex items-center justify-center bg-[#002147] text-white rounded-full">
        {step}
      </span>
      <div className="flex-1 h-1 bg-gray-200 rounded-full" />
      <span className="text-gray-600">{text}</span>
    </div>
  );
}
