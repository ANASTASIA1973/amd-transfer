"use client";
// app/components/LanguageSwitcher.jsx

import React from "react";
import { useLocale } from "../context/LocaleContext";

const LANGS = [
  { code: "de", label: "Deutsch" },
  { code: "en", label: "English" },
  { code: "ar", label: "العربية" },
];

export default function LanguageSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div className="flex justify-center mb-4">
      <div className="inline-flex gap-2 items-center rounded-xl border-2 border-[#002147] bg-white shadow px-4 py-2">
        <span className="mr-2 text-xl" role="img" aria-label="Sprache">🌐</span>
        {LANGS.map(l => (
          <button
            key={l.code}
            className={`
              font-bold px-3 py-1 rounded-lg transition
              ${locale === l.code 
                ? "bg-[#002147] text-white shadow" 
                : "text-[#002147] hover:bg-[#e0e7ef]"
              }
            `}
            style={{ minWidth: 80 }}
            onClick={() => setLocale(l.code)}
            aria-current={locale === l.code ? "page" : undefined}
            type="button"
          >
            {l.label}
          </button>
        ))}
      </div>
    </div>
  );
}
