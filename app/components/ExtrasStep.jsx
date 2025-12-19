"use client";
import React, { useState, useEffect } from "react";
import t from "../i18n/translations";
import { useLocale } from "../context/LocaleContext";
import { PlusIcon, MinusIcon } from "@heroicons/react/24/outline";

/* ====== Preise für Extras ====== */
const priceMap = {
  redWine: 2.5,
  vodka: 2.5,
  whiteWine: 2.5,
  redbull: 6.0,
  beer: 3.5,
  saft: 2.0,
  tadybear: 25.0,
  flowers: 35.0,
  pralinen: 12.0,
};

/* ====== Gruppen ====== */
const drinksKeys = ["redWine", "vodka", "whiteWine", "redbull", "beer", "saft"];
const treatsKeys = ["tadybear", "flowers", "pralinen"];

/* ====== Lokale Tokens (weil App eigenständig) ====== */
const TOKENS = {
  ACCENT: "#1f6f3a", // Zedern-Grün (gedeckt)
  ACCENT_SOFT: "rgba(31,111,58,.10)",
  ACCENT_BORDER: "rgba(31,111,58,.20)",
  HEADING: "#0b1f3a",
  TEXT: "rgba(17,24,39,.72)",
  BORDER: "rgba(17,24,39,.10)",
  SHADOW: "0 18px 44px rgba(15,23,42,.10)",
  SHADOW_CARD: "0 14px 34px rgba(15,23,42,.08)",
  RADIUS: 22,
  RADIUS_INNER: 18,
};

/* ====== Premium Section Wrapper ====== */
function SectionBox({ title, children }) {
  return (
    <section
      className="relative overflow-hidden"
      style={{
        borderRadius: TOKENS.RADIUS_INNER,
        border: `1px solid ${TOKENS.BORDER}`,
        background: "linear-gradient(180deg, rgba(31,111,58,.06) 0%, rgba(255,255,255,1) 55%)",
        boxShadow: "0 12px 28px rgba(15,23,42,.06)",
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
          background: `linear-gradient(180deg, ${TOKENS.ACCENT} 0%, rgba(31,111,58,.35) 60%, rgba(31,111,58,.12) 100%)`,
        }}
      />
      <div style={{ padding: "1.4rem", paddingLeft: "1.6rem" }}>
        <div
          className="font-extrabold tracking-tight"
          style={{ color: TOKENS.HEADING, fontSize: "1.05rem" }}
        >
          {title}
        </div>
        <div
          aria-hidden="true"
          style={{
            height: 1,
            background: "rgba(17,24,39,.08)",
            marginTop: ".75rem",
            marginBottom: "1.05rem",
          }}
        />
        {children}
      </div>
    </section>
  );
}

/* ====== Card-Komponente (Premium) ====== */
function Card({ k, count, onChange, L }) {
  const active = count > 0;

  return (
    <div
      className="group relative overflow-hidden"
      style={{
        borderRadius: 18,
        border: `1px solid ${active ? TOKENS.ACCENT_BORDER : TOKENS.BORDER}`,
        background: "#fff",
        boxShadow: active ? "0 18px 40px rgba(15,23,42,.10)" : "0 12px 26px rgba(15,23,42,.06)",
        transform: active ? "translateY(-1px)" : "none",
        transition: "all .16s ease",
      }}
    >
      {/* tiny top line */}
      <div
        aria-hidden="true"
        style={{
          height: 1,
          background: active
            ? "linear-gradient(90deg, rgba(31,111,58,.22), rgba(31,111,58,0))"
            : "linear-gradient(90deg, rgba(17,24,39,.08), rgba(17,24,39,0))",
        }}
      />

      <div className="p-4 flex flex-col items-center text-center">
        {/* Count badge */}
        {active && (
          <span
            className="absolute top-3 right-3 text-xs font-semibold px-2 py-1 rounded-full"
            style={{
              background: TOKENS.ACCENT_SOFT,
              color: TOKENS.ACCENT,
              border: `1px solid ${TOKENS.ACCENT_BORDER}`,
            }}
          >
            {count}×
          </span>
        )}

        {/* Image frame – clean + consistent */}
        <div
          className="w-full rounded-xl border overflow-hidden flex items-center justify-center"
          style={{
            borderColor: "rgba(17,24,39,.08)",
            background: "#fbfbfc",
            height: 132,
          }}
        >
          <img
            src={`/extras/${k}.jpg`}
            alt={L[k]}
            className="max-h-[96px] w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]"
            loading="lazy"
            decoding="async"
          />
        </div>

        <div className="mt-4 min-h-[44px] flex items-center justify-center">
          <p className="font-extrabold leading-snug" style={{ color: TOKENS.HEADING }}>
            {L[k]}
          </p>
        </div>

        <p className="text-sm font-semibold" style={{ color: TOKENS.TEXT }}>
          ${priceMap[k].toFixed(2)}
        </p>

        {/* Counter – premium outline */}
        <div className="mt-4 flex items-center gap-3">
          <button
            onClick={() => onChange(k, -1)}
            disabled={count === 0}
            type="button"
            className="w-10 h-10 rounded-full border inline-flex items-center justify-center transition"
            style={{
              background: "#fff",
              borderColor: count === 0 ? "rgba(17,24,39,.10)" : "rgba(17,24,39,.16)",
              opacity: count === 0 ? 0.45 : 1,
              cursor: count === 0 ? "not-allowed" : "pointer",
            }}
            onMouseEnter={(e) => {
              if (count === 0) return;
              e.currentTarget.style.borderColor = TOKENS.ACCENT_BORDER;
              e.currentTarget.style.boxShadow = `0 0 0 6px ${TOKENS.ACCENT_SOFT}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(17,24,39,.16)";
              e.currentTarget.style.boxShadow = "none";
            }}
            aria-label={`Weniger ${L[k]}`}
          >
            <MinusIcon style={{ width: 18, height: 18, color: TOKENS.HEADING }} />
          </button>

          <span className="w-7 text-center font-extrabold tabular-nums" style={{ color: TOKENS.HEADING }}>
            {count}
          </span>

          <button
            onClick={() => onChange(k, +1)}
            type="button"
            className="w-10 h-10 rounded-full border inline-flex items-center justify-center transition"
            style={{
              background: "#fff",
              borderColor: "rgba(17,24,39,.16)",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = TOKENS.ACCENT_BORDER;
              e.currentTarget.style.boxShadow = `0 0 0 6px ${TOKENS.ACCENT_SOFT}`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(17,24,39,.16)";
              e.currentTarget.style.boxShadow = "none";
            }}
            aria-label={`Mehr ${L[k]}`}
          >
            <PlusIcon style={{ width: 18, height: 18, color: TOKENS.HEADING }} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ====== Hauptkomponente ====== */
export default function ExtrasStep({ extrasCounts, setExtrasCounts, onNext, onBack }) {
  const { locale } = useLocale();
  const L = t[locale] || t.de;
  const [subTotal, setSubTotal] = useState(0);

  /* Zwischensumme berechnen */
  useEffect(() => {
    let sum = 0;
    [...drinksKeys, ...treatsKeys].forEach((k) => {
      sum += (extrasCounts[k] || 0) * priceMap[k];
    });
    setSubTotal(sum);
  }, [extrasCounts]);

  const handleChange = (key, delta) => {
    setExtrasCounts((prev) => {
      const newVal = Math.max(0, (prev[key] || 0) + delta);
      return { ...prev, [key]: newVal };
    });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Titel NICHT hier – WizardLayout zeigt "Weitere Extras" oben bereits */}
      <p className="text-sm mb-6" style={{ color: TOKENS.TEXT }}>
        {L.extrasStepSubtitle || "Wählen Sie Extras aus."}
      </p>

      {/* Outer premium container */}
      <div
        className="bg-white border px-6 sm:px-7 py-7 sm:py-8 space-y-8"
        style={{
          borderColor: TOKENS.BORDER,
          borderRadius: TOKENS.RADIUS,
          boxShadow: TOKENS.SHADOW,
        }}
      >
        {/* Getränke */}
        <SectionBox title={L.extrasGroupDrinks || "Getränke"}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {drinksKeys.map((k) => (
              <Card key={k} k={k} count={extrasCounts[k] || 0} onChange={handleChange} L={L} />
            ))}
          </div>
        </SectionBox>

        {/* Highlights */}
        <SectionBox title={L.extrasGroupTreats || "Highlights"}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {treatsKeys.map((k) => (
              <Card key={k} k={k} count={extrasCounts[k] || 0} onChange={handleChange} L={L} />
            ))}
          </div>
        </SectionBox>

        {/* Summe – premium summary */}
        <div
          className="border rounded-xl p-4 flex justify-between font-semibold"
          style={{
            borderColor: TOKENS.BORDER,
            background: "#fff",
            boxShadow: "0 12px 28px rgba(15,23,42,.06)",
            color: TOKENS.HEADING,
          }}
        >
          <span>{L.extrasTotalLabel || "Extras gesamt"}:</span>
          <span>${subTotal.toFixed(2)}</span>
        </div>

        {/* Navigation */}
        <div className="flex justify-between w-full gap-4">
          <button onClick={onBack} className="btn btn-secondary min-w-[120px]" type="button">
            {L.backBtn}
          </button>
          <button onClick={onNext} className="btn btn-primary min-w-[120px]" type="button">
            {L.nextBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
