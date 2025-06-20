"use client";
// app/components/VehicleSelection.jsx

import React, { useEffect } from "react";
import t from "../i18n/translations";
import { useLocale } from "../context/LocaleContext";

const vehicles = [
  {
    key:           "economy",
    labelKey:      "vehicleEconomy",
    descriptionKey:"vehicleEconomyDesc",
    price:          0,
    imageUrl:      "/images/economy.jpg",
  },
  {
    key:           "familyVan",
    labelKey:      "vehicleFamilyVan",
    descriptionKey:"vehicleFamilyVanDesc",
    price:         50,
    imageUrl:      "/images/family-van.jpg",
  },
  {
    key:           "business",
    labelKey:      "vehicleBusiness",
    descriptionKey:"vehicleBusinessDesc",
    price:        100,
    imageUrl:      "/images/business.jpg",
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

  // Wenn mehr als 4 Personen, muss Family Van gewählt sein
  const lockBasic = adults + children > 4;
  useEffect(() => {
    if (lockBasic && vehicle !== "familyVan") {
      setVehicle("familyVan");
    }
  }, [lockBasic, vehicle, setVehicle]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h2 className="text-xl font-bold text-[#002147] mb-4">
        {L.vehicleTitle}
      </h2>

      <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-6">
          {vehicles.map((v) => {
            const isSelected = vehicle === v.key;
            const disabled   = v.key !== "familyVan" && lockBasic;

            return (
              <div
                key={v.key}
                className={`
                  flex flex-col items-center h-full border rounded-lg p-6
                  transition-shadow
                  ${isSelected ? "border-[#002147] shadow-md" : "hover:shadow-lg"}
                  ${disabled   ? "opacity-50 cursor-not-allowed" : ""}
                `}
              >
                {/* Bild */}
                <div className="w-full max-w-[180px] max-h-[120px] mb-4">
                  <img
                    src={v.imageUrl}
                    alt={L[v.labelKey]}
                    className="w-full h-full object-contain"
                    loading="lazy"
                  />
                </div>

                {/* Titel */}
                <h3 className="text-xl font-semibold text-[#C09743] mb-2">
                  {L[v.labelKey]}
                </h3>

                {/* Beschreibung */}
                <p className="text-gray-700 mb-auto text-center">
                  {L[v.descriptionKey]}
                </p>

                {/* Aufschlag */}
                <div className="mt-4 text-center">
                  <span className="block text-2xl font-bold">
                    {L.currencySymbol}{v.price}
                  </span>
                  <span className="block text-sm text-gray-600">
                    {v.price > 0 ? L.vehicleSurchargeLabel : L.vehicleNoSurcharge}
                  </span>
                </div>

                {/* Button */}
                <button
                  onClick={() => !disabled && setVehicle(v.key)}
                  disabled={disabled}
                  className={`
                    mt-6 w-full py-3 rounded-md text-white font-medium transition
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
        <div className="mt-auto flex justify-between pt-4 border-t">
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
