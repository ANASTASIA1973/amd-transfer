"use client";
import React from "react";
import { useLocale } from "../context/LocaleContext";

export default function LanguageSwitcher({ className = "" }) {
  const { locale, setLocale } = useLocale();

  const items = [
    { code: "de", label: "DE", flag: "/images/flag-de.svg" },
    { code: "ar", label: "AR", flag: "/images/flag-lb.svg" },
    { code: "en", label: "EN", flag: "/images/flag-us.svg" },
  ];

  return (
    <div
      className={`amd-flag-switcher ${className}`}
      role="group"
      aria-label="Sprache wählen"
    >
      {items.map((it) => (
        <button
          key={it.code}
          type="button"
          onClick={() => setLocale(it.code)}
          aria-pressed={locale === it.code}
          className="amd-flag-pill"
        >
          <img src={it.flag} alt="" className="amd-flag-icon" />
          <span className="amd-flag-label">{it.label}</span>
        </button>
      ))}
    </div>
  );
}
