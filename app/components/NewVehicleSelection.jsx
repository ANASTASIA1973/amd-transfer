"use client";
import React, { useEffect } from "react";
import t from "../i18n/translations";
import { useLocale } from "../context/LocaleContext";
import { MdPersonOutline, MdLuggage } from "react-icons/md";

/** Optional: dezenter Tooltip (wirkt edler als dark-blue bubble) */
function Tooltip({ text, children }) {
  const [show, setShow] = React.useState(false);
  return (
    <div
      className="relative inline-flex"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {children}
      {show && (
        <div
          className="absolute z-20 -top-2 left-1/2 -translate-x-1/2 -translate-y-full px-2 py-1 rounded-lg text-xs whitespace-nowrap"
          style={{
            background: "rgba(17,24,39,.92)",
            color: "#fff",
            boxShadow: "0 12px 28px rgba(0,0,0,.25)",
          }}
        >
          {text}
        </div>
      )}
    </div>
  );
}

const vehicles = [
  {
    key: "economy",
    labelKey: "vehicleEconomy",
    descriptionKey: "vehicleEconomyDesc",
    seats: 3,
    medium: 3,
    small: 2,
    price: 0,
    imageUrl: "/images/economy.jpg",
  },
  {
    key: "familyVan",
    labelKey: "vehicleFamilyVan",
    descriptionKey: "vehicleFamilyVanDesc",
    seats: 8,
    medium: 6,
    small: 6,
    price: 50,
    imageUrl: "/images/van.jpg",
  },
  {
    key: "business",
    labelKey: "vehicleBusiness",
    descriptionKey: "vehicleBusinessDesc",
    seats: 4,
    medium: 4,
    small: 2,
    price: 100,
    imageUrl: "/images/business.jpg",
  },
];

export default function VehicleSelection({
  adults,
  children,
  vehicle,
  setVehicle,
  onNext,
  onBack,
}) {
  const { locale } = useLocale();
  const L = t[locale] || t.de;

  const total = (adults || 0) + (children || 0);

  // Sperrlogik: nur wenn zu viele Personen
  const isEconomyDisabled = total > 3;
  const isBusinessDisabled = total > 4;
  const isFamilyVanDisabled = total > 8;

  // Auto-Vorauswahl: nur wenn nichts gewählt ODER gewähltes Fahrzeug nicht mehr erlaubt
  useEffect(() => {
    const isChosenValid =
      vehicle === "economy"
        ? !isEconomyDisabled
        : vehicle === "business"
        ? !isBusinessDisabled
        : vehicle === "familyVan"
        ? !isFamilyVanDisabled
        : false;

    if (vehicle && isChosenValid) return;

    if (!isEconomyDisabled) setVehicle("economy");
    else if (!isBusinessDisabled) setVehicle("business");
    else if (!isFamilyVanDisabled) setVehicle("familyVan");
    else setVehicle("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [total]);

  const tooltipLabels = [
    L.passengerLabel || "Passagiere",
    L.mediumLabel || "M-Gepäck",
    L.smallLabel || "S-Gepäck",
  ];

  const currency = L.currencySymbol || "$";

  // ====== Edel-Zedern-Grün (nicht zu knallig) ======
  // Tipp: wenn du später eine globale Variable hast, hier auf var(--amd-accent-green) umstellen.
  const GREEN = "#1f6f3a"; // zedern-grün (gedeckt)
  const GREEN_DARK = "#16552c";
  const GREEN_SOFT = "rgba(31,111,58,.12)";
  const GREEN_SOFT2 = "rgba(31,111,58,.06)";
  const GREEN_LINE = "rgba(31,111,58,.18)";

  return (
    <div className="w-full">
      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {vehicles.map((v) => {
          const disabled =
            (v.key === "economy" && isEconomyDisabled) ||
            (v.key === "business" && isBusinessDisabled) ||
            (v.key === "familyVan" && isFamilyVanDisabled);

          const selected = vehicle === v.key;

          return (
            <button
              key={v.key}
              type="button"
              disabled={disabled}
              onClick={() => !disabled && setVehicle(v.key)}
              className="text-left bg-white rounded-2xl overflow-hidden"
              style={{
                border: selected
                  ? `1px solid rgba(31,111,58,.40)`
                  : "1px solid var(--amd-border,#e5e7eb)",
                boxShadow: selected
                  ? "0 22px 48px rgba(15,23,42,.12)"
                  : "0 14px 34px rgba(15,23,42,.08)",
                transform: selected ? "translateY(-2px)" : "none",
                transition: "all .18s ease",
                opacity: disabled ? 0.55 : 1,
                cursor: disabled ? "not-allowed" : "pointer",
              }}
            >
              {/* Accent line (immer grün, selected etwas kräftiger) */}
              <div
                aria-hidden="true"
                className="h-[6px] w-full"
                style={{
                  background: selected
                    ? `linear-gradient(90deg, rgba(31,111,58,.92) 0%, rgba(31,111,58,.32) 70%, rgba(31,111,58,0) 100%)`
                    : `linear-gradient(90deg, ${GREEN_LINE} 0%, rgba(31,111,58,0) 100%)`,
                }}
              />

              <div className="p-5">
                {/* Image frame – macht PNG/JPG Ränder egal */}
                <div
                  className="rounded-xl border overflow-hidden"
                  style={{
                    borderColor: selected ? "rgba(31,111,58,.18)" : "rgba(17,24,39,.10)",
                    background: "#fbfbfc",
                  }}
                >
                  <div className="aspect-[16/9] flex items-center justify-center">
                    <img
                      src={v.imageUrl}
                      alt={L[v.labelKey] || v.key}
                      className="max-h-[120px] w-auto object-contain"
                      loading="lazy"
                      decoding="async"
                    />
                  </div>
                </div>

                {/* Title + Desc */}
                <div className="mt-4 text-center">
                  <div className="text-lg font-extrabold" style={{ color: "#0b1f3a" }}>
                    {L[v.labelKey]}
                  </div>
                  <div className="mt-1 text-sm" style={{ color: "rgba(17,24,39,.65)" }}>
                    {L[v.descriptionKey]}
                  </div>

                  {/* Icons row */}
                  <div className="mt-4 flex items-end justify-center gap-4">
                    <Tooltip text={tooltipLabels[0]}>
                      <div className="flex flex-col items-center">
                        <MdPersonOutline
                          className="w-6 h-6"
                          style={{
                            color: selected ? "rgba(31,111,58,.55)" : "rgba(17,24,39,.55)",
                          }}
                        />
                        <span className="mt-1 text-sm font-semibold" style={{ color: "#0b1f3a" }}>
                          {v.seats}
                        </span>
                      </div>
                    </Tooltip>

                    <Tooltip text={tooltipLabels[1]}>
                      <div className="flex flex-col items-center">
                        <MdLuggage
                          className="w-6 h-6"
                          style={{
                            color: selected ? "rgba(31,111,58,.55)" : "rgba(17,24,39,.55)",
                          }}
                        />
                        <span className="mt-1 text-sm font-semibold" style={{ color: "#0b1f3a" }}>
                          {v.medium}
                        </span>
                      </div>
                    </Tooltip>

                    <Tooltip text={tooltipLabels[2]}>
                      <div className="flex flex-col items-center">
                        <MdLuggage
                          className="w-5 h-5"
                          style={{
                            color: selected ? "rgba(31,111,58,.45)" : "rgba(17,24,39,.45)",
                          }}
                        />
                        <span className="mt-1 text-sm font-semibold" style={{ color: "#0b1f3a" }}>
                          {v.small}
                        </span>
                      </div>
                    </Tooltip>
                  </div>

                  {/* Price */}
                  <div className="mt-4">
                    <div className="text-2xl font-extrabold" style={{ color: "#0b1f3a" }}>
                      {currency}
                      {v.price}
                    </div>
                    <div className="text-sm" style={{ color: "rgba(17,24,39,.65)" }}>
                      {v.price > 0 ? L.vehicleSurchargeLabel : L.vehicleNoSurcharge}
                    </div>
                  </div>
                </div>

                {/* Select indicator */}
                <div className="mt-5">
                  <div
                    className="w-full text-center rounded-xl py-3 font-semibold"
                    style={{
                      border: selected
                        ? "1px solid rgba(31,111,58,.35)"
                        : "1px solid var(--amd-border,#e5e7eb)",
                      background: selected ? GREEN_SOFT2 : "#fff",
                      color: selected ? GREEN_DARK : "rgba(17,24,39,.75)",
                      boxShadow: selected
                        ? `0 10px 22px ${GREEN_SOFT}`
                        : "0 10px 22px rgba(15,23,42,.06)",
                    }}
                  >
                    {selected ? L.selectedLabel : L.selectVehicleBtn}
                  </div>

                  {disabled && (
                    <div className="mt-2 text-xs text-center" style={{ color: "rgba(17,24,39,.55)" }}>
                      {L.vehicleNotAvailable ||
                        (locale === "ar"
                          ? "غير متاح لهذا العدد"
                          : locale === "en"
                          ? "Not available for this group size"
                          : "Für diese Personenzahl nicht verfügbar")}
                    </div>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Bottom Navigation */}
    <div className="mt-8 amd-step-actions">

        <button onClick={onBack} className="btn btn-secondary">
          {L.backBtn}
        </button>

        <button
          onClick={onNext}
          className="btn btn-primary"
          disabled={!vehicle}
          style={{ opacity: vehicle ? 1 : 0.6, cursor: vehicle ? "pointer" : "not-allowed" }}
        >
          {L.nextBtn}
        </button>
      </div>
    </div>
  );
}
