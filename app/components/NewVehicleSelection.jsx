"use client";
import React, { useEffect } from "react";
import t from "../i18n/translations";
import { useLocale } from "../context/LocaleContext";
import { MdPersonOutline, MdLuggage } from "react-icons/md";

// Tooltip für Labels (optional)
function Tooltip({ text, children }) {
  const [show, setShow] = React.useState(false);
  return (
    <div className="relative flex flex-col items-center">
      <div
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="flex flex-col items-center"
      >
        {children}
      </div>
      {show && (
        <div className="absolute z-20 bottom-full mb-2 px-2 py-1 rounded bg-[#002147] text-white text-xs whitespace-nowrap shadow-lg">
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
  const total = adults + children;

  // Sperrlogik: Nur bei zu VIELEN gesperrt!
  const isEconomyDisabled = total > 3;
  const isBusinessDisabled = total > 4;
  const isFamilyVanDisabled = total > 8;

  // Automatische Vorauswahl NUR wenn KEIN Fahrzeug gewählt!
  useEffect(() => {
    if (!vehicle || !vehicles.some(v => v.key === vehicle && !(
      (v.key === "economy"   && isEconomyDisabled) ||
      (v.key === "business"  && isBusinessDisabled) ||
      (v.key === "familyVan" && isFamilyVanDisabled)
    ))) {
      // Fallback-Vorauswahl nach Reihenfolge
      if (!isEconomyDisabled) setVehicle("economy");
      else if (!isBusinessDisabled) setVehicle("business");
      else if (!isFamilyVanDisabled) setVehicle("familyVan");
      // Wenn alle gesperrt, bleibt Auswahl leer
    }
  // eslint-disable-next-line
  }, [total]);

  const tooltipLabels = [
    L.passengerLabel || "Passagiere",
    L.mediumLabel || "M-Gepäck",
    L.smallLabel || "S-Gepäck",
  ];

  return (
    <div className="max-w-3xl mx-auto px-2 py-6">
      <h2 className="text-2xl font-bold text-[#002147] mb-6">
        {L.vehicleTitle}
      </h2>
      <div className="bg-white rounded-lg shadow-sm p-2 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {vehicles.map((v) => {
            let disabled = false;
            if (v.key === "economy" && isEconomyDisabled) disabled = true;
            if (v.key === "business" && isBusinessDisabled) disabled = true;
            if (v.key === "familyVan" && isFamilyVanDisabled) disabled = true;
            const isSelected = vehicle === v.key;
            const values = [v.seats, v.medium, v.small];
            return (
              <div
                key={v.key}
                className={`
                  flex flex-col items-center text-center
                  border rounded-lg p-3 sm:p-6 transition-transform
                  ${isSelected
                    ? "border-[#C09743] shadow-lg"
                    : "shadow-sm hover:shadow-lg hover:scale-105"}
                  ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                <img
                  src={v.imageUrl}
                  alt={L[v.labelKey]}
                  className="w-full h-28 object-contain mb-3"
                  loading="lazy"
                />
                <h3 className="text-xl font-semibold text-[#C09743] mb-1">
                  {L[v.labelKey]}
                </h3>
                <p className="text-gray-700 mb-2 text-sm">
                  {L[v.descriptionKey]}
                </p>
                <div className="flex items-end justify-center gap-2 mb-2">
                  <Tooltip text={tooltipLabels[0]}>
                    <div className="flex flex-col items-center">
                      <MdPersonOutline className="w-6 h-6" color="#C09743" />
                      <span className="font-medium text-xs text-[#C09743] mt-0.5">{values[0]}</span>
                    </div>
                  </Tooltip>
                  <Tooltip text={tooltipLabels[1]}>
                    <div className="flex flex-col items-center">
                      <MdLuggage className="w-6 h-6" color="#C09743" />
                      <span className="font-medium text-xs text-[#C09743] mt-0.5">{values[1]}</span>
                    </div>
                  </Tooltip>
                  <Tooltip text={tooltipLabels[2]}>
                    <div className="flex flex-col items-center">
                      <MdLuggage className="w-5 h-5 opacity-80" color="#C09743" />
                      <span className="font-medium text-xs text-[#C09743] mt-0.5">{values[2]}</span>
                    </div>
                  </Tooltip>
                </div>
                <div className="mb-3">
                  <span className="block text-2xl font-bold">
                    {L.currencySymbol}{v.price}
                  </span>
                  <span className="text-xs text-gray-600 block mt-1">
                    {v.price > 0
                      ? L.vehicleSurchargeLabel
                      : L.vehicleNoSurcharge}
                  </span>
                </div>
                <button
                  onClick={() => !disabled && setVehicle(v.key)}
                  disabled={disabled}
                  className={`
                    w-full py-2 rounded text-white font-medium text-base
                    ${isSelected
                      ? "bg-[#C09743]"
                      : "bg-[#002147] hover:bg-[#C09743]"}
                    ${disabled ? "cursor-not-allowed" : ""}
                  `}
                >
                  {isSelected ? L.selectedLabel : L.selectVehicleBtn}
                </button>
              </div>
            );
          })}
        </div>
        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t mt-6">
          <button onClick={onBack} className="btn btn-secondary">
            {L.backBtn}
          </button>
          <button onClick={onNext} className="btn btn-primary">
            {L.nextBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
