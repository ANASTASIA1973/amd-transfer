"use client";
// app/components/PassengerStep.jsx

import React from "react";
import t from "../i18n/translations";
import { useLocale } from "../context/LocaleContext";
import { FaUser, FaChild } from "react-icons/fa";

/* Edel-Zedern-Grün (gedeckt, nicht bunt) */
const GREEN = "#1f6f3a";
const GREEN_DARK = "#16552c";
const GREEN_SOFT = "rgba(31,111,58,.10)";
const GREEN_SOFT2 = "rgba(31,111,58,.06)";
const GREEN_BORDER = "rgba(31,111,58,.22)";
const GREEN_LINE = "rgba(31,111,58,.35)";

function CounterRow({ icon, label, value, onMinus, onPlus, minusDisabled }) {
  return (
    <div className="w-full flex items-center justify-between gap-4 py-3">
      {/* Label */}
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl border ios-fix"
          style={{
            background: "rgba(0,33,71,.03)",
            borderColor: "rgba(17,24,39,.10)",
          }}
          aria-hidden="true"
        >
          <span style={{ color: "rgba(11,31,58,.95)" }}>{icon}</span>
        </span>

        <div className="font-semibold text-[color:var(--amd-heading,#111827)] truncate">
          {label}
        </div>
      </div>

      {/* Counter */}
      <div className="flex items-center gap-3">
        {/* Minus */}
        <button
          type="button"
          onClick={onMinus}
          disabled={minusDisabled}
          className={[
           "w-11 h-11 rounded-full ios-fix counter-pill",
            "inline-flex items-center justify-center text-xl",
            "transition focus:outline-none",
            minusDisabled ? "opacity-40 cursor-not-allowed" : "hover:shadow-sm",
          ].join(" ")}
          style={{
            background: "#fff",
            color: "rgba(11,31,58,.95)",
            boxShadow: minusDisabled
              ? "inset 0 0 0 1px var(--amd-border,#e5e7eb)"
              : "inset 0 0 0 1px rgba(17,24,39,.14)",
            WebkitTapHighlightColor: "transparent",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
          onFocus={(e) => {
            if (minusDisabled) return;
            e.currentTarget.style.boxShadow =
              `inset 0 0 0 1px ${GREEN_BORDER}, 0 0 0 4px ${GREEN_SOFT}`;

          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = minusDisabled
              ? "inset 0 0 0 1px var(--amd-border,#e5e7eb)"
              : "inset 0 0 0 1px rgba(17,24,39,.14)";
          }}
          aria-label="minus"
        >
          −
        </button>

        {/* Value */}
        <div
          className="min-w-[2.2rem] text-center text-lg font-bold tabular-nums"
          style={{ color: "var(--amd-heading,#111827)" }}
        >
          {value}
        </div>

        {/* Plus */}
        <button
          type="button"
          onClick={onPlus}
          className="w-11 h-11 rounded-full ios-fix counter-pill inline-flex items-center justify-center text-xl transition hover:shadow-sm focus:outline-none"
          style={{
            background: "#fff",
            color: "rgba(11,31,58,.95)",
            boxShadow: "inset 0 0 0 1px rgba(17,24,39,.14)",
            WebkitTapHighlightColor: "transparent",
            transform: "translateZ(0)",
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow =
              `inset 0 0 0 1px ${GREEN_BORDER}, 0 0 0 4px ${GREEN_SOFT}`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow =
              "inset 0 0 0 1px rgba(17,24,39,.14)";
          }}
          aria-label="plus"
        >
          +
        </button>
      </div>
    </div>
  );
}

export default function PassengerStep({
  adults,
  setAdults,
  children,
  setChildren,
  onNext,
  onBack,
}) {
  const { locale } = useLocale();
  const L = t[locale] || t.de;

  const maxPassengers = 8;
  const total = Number(adults || 0) + Number(children || 0);

  /* Block bei >8 */
  if (total > maxPassengers) {
    return (
      <div className="w-full">
        <div
          className="rounded-2xl border p-5 sm:p-6 ios-fix"
          style={{
            background: "rgba(15,23,42,.02)",
            borderColor: "rgba(15,23,42,.10)",
            boxShadow: "0 14px 34px rgba(15,23,42,.06)",
          }}
        >
          <div className="text-base sm:text-lg font-bold" style={{ color: "#0b1f3a" }}>
            {L.vehicleTooManyPersons ||
              "Für Gruppen mit mehr als 8 Fahrgästen ist eine Online-Buchung nicht möglich."}
          </div>

          <div className="mt-2 text-sm sm:text-base text-[color:var(--amd-text,#111827)] opacity-90">
            {L.useWhatsappTopRight ||
              "Bitte nutzen Sie den WhatsApp-Button oben rechts für eine individuelle Anfrage."}
          </div>

          <div className="mt-6 flex justify-end">
            <button type="button" onClick={onBack} className="btn btn-secondary">
              {L.backBtn}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="space-y-4">
        {/* Card */}
     <div
  className="rounded-2xl border"
  style={{
    borderColor: "var(--amd-border,#e5e7eb)",
    background: "#fff",
    boxShadow: "0 14px 34px rgba(15,23,42,.06)",
  }}
>
  {/* iOS Clip Wrapper */}
  <div className="amd-card-clip">
    <div style={{ display: "grid", gridTemplateColumns: "6px 1fr" }}>
      <div
        aria-hidden="true"
        style={{
          background: `linear-gradient(180deg, ${GREEN_LINE} 0%, rgba(31,111,58,.10) 55%, rgba(31,111,58,0) 100%)`,
        }}
      />
      <div className="px-5 sm:px-6 py-4 sm:py-5">
        <CounterRow
          icon={<FaUser />}
          label={L.adultsLabel}
          value={adults}
          onMinus={() => setAdults(Math.max(1, adults - 1))}
          onPlus={() => setAdults(adults + 1)}
          minusDisabled={adults <= 1}
        />

        <div style={{ height: 1, background: "rgba(17,24,39,.06)" }} />

        <CounterRow
          icon={<FaChild />}
          label={L.childrenLabel}
          value={children}
          onMinus={() => setChildren(Math.max(0, children - 1))}
          onPlus={() => setChildren(children + 1)}
          minusDisabled={children <= 0}
        />

        {total === maxPassengers && (
          <div
            className="mt-3 text-sm"
            style={{
              color: GREEN_DARK,
              fontWeight: 700,
              background: GREEN_SOFT2,
              border: `1px solid ${GREEN_BORDER}`,
              padding: ".55rem .75rem",
              borderRadius: "12px",
            }}
          >
            {L.maxPassengersHint ||
              "Maximal 8 Fahrgäste pro Fahrzeug (der Fahrer zählt nicht dazu)."}
          </div>
        )}
      </div>
    </div>
  </div>
</div>


        {/* Navigation */}
      <div className="mt-2 amd-step-actions">

          <button type="button" onClick={onBack} className="btn btn-secondary">
            {L.backBtn}
          </button>
          <button type="button" onClick={onNext} className="btn btn-primary">
            {L.nextBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
