"use client";
// app/components/PassengerStep.jsx

import React from "react";
import t from "../i18n/translations";
import { useLocale } from "../context/LocaleContext";
import { FaUser, FaChild } from "react-icons/fa";

// Edel-Zedern-Grün (gedeckt, nicht bunt)
const GREEN = "#1f6f3a";
const GREEN_DARK = "#16552c";
const GREEN_SOFT = "rgba(31,111,58,.10)";
const GREEN_SOFT2 = "rgba(31,111,58,.06)";
const GREEN_BORDER = "rgba(31,111,58,.22)";
const GREEN_LINE = "rgba(31,111,58,.35)";

function CounterRow({ icon, label, value, onMinus, onPlus, minusDisabled }) {
  return (
    <div className="w-full flex items-center justify-between gap-4 py-3">
      <div className="flex items-center gap-3 min-w-0">
        <span
          className="inline-flex items-center justify-center w-9 h-9 rounded-xl border"
          style={{
            background: "rgba(0,33,71,.03)",
            borderColor: "rgba(17,24,39,.10)",
          }}
          aria-hidden="true"
        >
          {/* Icon: default dunkelblau, mit leichtem Grün-Touch über Container */}
          <span style={{ color: "rgba(11,31,58,.95)" }}>{icon}</span>
        </span>

        <div className="font-semibold text-[color:var(--amd-heading,#111827)] truncate">
          {label}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMinus}
          disabled={minusDisabled}
          className={[
            "w-11 h-11 rounded-full border",
            "inline-flex items-center justify-center text-xl",
            "transition",
            "focus:outline-none focus:ring-4",
            minusDisabled
              ? "opacity-40 cursor-not-allowed"
              : "hover:shadow-sm",
          ].join(" ")}
          style={{
            background: "#fff",
            borderColor: minusDisabled ? "var(--amd-border,#e5e7eb)" : "rgba(17,24,39,.14)",
            color: "rgba(11,31,58,.95)",
            // Hover/Focus grün – aber nur dezent
            boxShadow: "0 0 0 0 rgba(0,0,0,0)",
          }}
          onMouseEnter={(e) => {
            if (minusDisabled) return;
            e.currentTarget.style.borderColor = GREEN_BORDER;
          }}
          onMouseLeave={(e) => {
            if (minusDisabled) return;
            e.currentTarget.style.borderColor = "rgba(17,24,39,.14)";
          }}
          onFocus={(e) => {
            if (minusDisabled) return;
            e.currentTarget.style.boxShadow = `0 0 0 6px ${GREEN_SOFT}`;
            e.currentTarget.style.borderColor = GREEN_BORDER;
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = "0 0 0 0 rgba(0,0,0,0)";
            if (!minusDisabled) e.currentTarget.style.borderColor = "rgba(17,24,39,.14)";
          }}
          aria-label="minus"
        >
          −
        </button>

        <div
          className="min-w-[2.2rem] text-center text-lg font-bold tabular-nums"
          style={{ color: "var(--amd-heading,#111827)" }}
        >
          {value}
        </div>

        <button
          type="button"
          onClick={onPlus}
          className="w-11 h-11 rounded-full border inline-flex items-center justify-center text-xl transition hover:shadow-sm focus:outline-none focus:ring-4"
          style={{
            background: "#fff",
            borderColor: "rgba(17,24,39,.14)",
            color: "rgba(11,31,58,.95)",
            boxShadow: "0 0 0 0 rgba(0,0,0,0)",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = GREEN_BORDER;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(17,24,39,.14)";
          }}
          onFocus={(e) => {
            e.currentTarget.style.boxShadow = `0 0 0 6px ${GREEN_SOFT}`;
            e.currentTarget.style.borderColor = GREEN_BORDER;
          }}
          onBlur={(e) => {
            e.currentTarget.style.boxShadow = "0 0 0 0 rgba(0,0,0,0)";
            e.currentTarget.style.borderColor = "rgba(17,24,39,.14)";
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

  // Block wenn mehr als 8
  if (total > maxPassengers) {
    return (
      <div className="w-full">
        <div
          className="rounded-2xl border p-5 sm:p-6"
          style={{
            background: "rgba(15,23,42,.02)", // neutral, edel
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
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            borderColor: "var(--amd-border,#e5e7eb)",
            background: "#fff",
            boxShadow: "0 14px 34px rgba(15,23,42,.06)",
          }}
        >
          {/* Links: dezente grüne Accent-Leiste (wie bei Cards) */}
          <div
            aria-hidden="true"
            style={{
              height: 1,
              background: "transparent",
            }}
          />
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

        {/* Navigation */}
        <div className="mt-2 flex flex-col sm:flex-row sm:justify-end gap-3">
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
