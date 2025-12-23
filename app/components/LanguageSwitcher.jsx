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

  const onPick = (code) => {
    // 1) sofort persistent machen (damit Legal-HTML es direkt lesen kann)
    try {
      localStorage.setItem("amd_locale", code);
    } catch (e) {}

    // 2) React Locale setzen
    setLocale(code);
  };

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
          onClick={() => onPick(it.code)}
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
