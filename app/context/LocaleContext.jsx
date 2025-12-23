// app/context/LocaleContext.jsx
"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";

const LocaleContext = createContext(null);

const STORAGE_KEY = "amd_locale";

function normalizeLocale(value) {
  const s = String(value || "").toLowerCase().trim();
  const short = s.slice(0, 2);
  if (short === "de" || short === "en" || short === "ar") return short;
  return "de";
}

function getInitialLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return normalizeLocale(saved);
  } catch (_) {}

  // Browser-Sprache fallback (ohne SSR-Probleme: läuft nur client)
  if (typeof navigator !== "undefined") {
    return normalizeLocale(navigator.language);
  }
  return "de";
}

export function LocaleProvider({ children }) {
  const [locale, _setLocale] = useState("de");

  // initial laden (client)
  useEffect(() => {
    _setLocale(getInitialLocale());
  }, []);

  const setLocale = (next) => {
    const normalized = normalizeLocale(next);
    _setLocale(normalized);
    try {
      localStorage.setItem(STORAGE_KEY, normalized);
    } catch (_) {}
  };

  const value = useMemo(() => ({ locale, setLocale }), [locale]);

  return <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be inside LocaleProvider");
  return ctx;
}
