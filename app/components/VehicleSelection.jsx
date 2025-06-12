// app/components/VehicleSelection.jsx
"use client";

import { useEffect } from "react";
import t from "../i18n/translations";

const vehicles = [
  {
    key: "economy",
    labelKey: "vehicleEconomy",
    descriptionKey: "vehicleEconomyDesc",
    price: 0,
    imageUrl: "/images/economy.jpg",
  },
  {
    key: "familyVan",
    labelKey: "vehicleFamilyVan",
    descriptionKey: "vehicleFamilyVanDesc",
    price: 50,
    imageUrl: "/images/family-van.jpg",
  },
  {
    key: "business",
    labelKey: "vehicleBusiness",
    descriptionKey: "vehicleBusinessDesc",
    price: 100,
    imageUrl: "/images/business.jpg",
  },
];

export default function VehicleSelection({
  locale,
  adults,
  children,
  vehicle,
  setVehicle,
  onNext,
  onBack,
}) {
  const L = t[locale] || t.de;
  const total = adults + children;
  const lockBasic = total > 4;

  // Automatisch Family Van wählen, wenn über 4 Personen
  useEffect(() => {
    if (lockBasic && vehicle !== "familyVan") {
      setVehicle("familyVan");
    }
  }, [lockBasic, vehicle, setVehicle]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="flex items-center space-x-2 mb-6">
        <span className="w-8 h-8 flex items-center justify-center bg-[#002147] text-white rounded-full">
          3
        </span>
        <div className="flex-1 h-1 bg-gray-200 rounded-full" />
        <span className="text-gray-600">
          {L.stepIndicator.replace("{step}", "3").replace("{total}", "6")}
        </span>
      </div>

      {/* Headline & Subtitle */}
      <h2 className="text-3xl font-bold text-[#002147] mb-2">
        3. {L.vehicleTitle}
      </h2>
      <p className="text-gray-600 mb-6">{L.vehicleSubtitle}</p>

      {/* Card Container */}
      <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col">
        {/* Vehicle Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 auto-rows-fr gap-8 mb-6">
          {vehicles.map((v) => {
            const isSelected = vehicle === v.key;
            const disabled = v.key !== "familyVan" && lockBasic;

            return (
              <div
                key={v.key}
                className={`flex flex-col h-full items-center bg-white border rounded-lg p-6 transition-shadow
                  ${
                    isSelected
                      ? "border-[#002147] shadow-md"
                      : "hover:shadow-lg"
                  }
                  ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                <img
                  src={v.imageUrl}
                  alt={L[v.labelKey]}
                  className="w-full h-40 object-cover rounded mb-4"
                  loading="lazy"
                />

                <h3 className="text-xl font-semibold text-[#C09743] mb-2">
                  {L[v.labelKey]}
                </h3>
                <p className="text-gray-700 mb-4 text-center">
                  {L[v.descriptionKey]}
                </p>
                <div className="font-medium text-gray-800 mb-4 whitespace-nowrap text-center">
                  {L.currencySymbol}
                  {v.price}{" "}
                  {v.price > 0 ? L.vehicleSurchargeLabel : L.vehicleNoSurcharge}
                </div>

                {disabled && (
                  <p className="text-xs text-red-600 text-center mb-4">
                    {L.vehicleDisabledHint}
                  </p>
                )}

                <button
                  onClick={() => !disabled && setVehicle(v.key)}
                  disabled={disabled}
                  className={`mt-auto w-full py-3 rounded-md text-white font-medium transition
                    ${
                      isSelected
                        ? "bg-[#C09743]"
                        : "bg-[#002147] hover:bg-[#C09743]"
                    }
                    ${disabled ? "cursor-not-allowed" : ""}`}
                >
                  {isSelected ? L.selectedLabel : L.selectVehicleBtn}
                </button>
              </div>
            );
          })}
        </div>

        {/* Footer Navigation */}
        <div className="mt-auto flex justify-between pt-4 border-t">
          <button
            onClick={onBack}
            className="border border-[#002147] text-[#002147] py-3 px-6 rounded-lg hover:bg-gray-100 transition"
          >
            {L.backBtn}
          </button>
          <button
            onClick={onNext}
            className="bg-[#002147] text-white py-3 px-6 rounded-lg hover:bg-[#C09743] transition"
          >
            {L.nextBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
