// app/components/PassengerStep.jsx
"use client";

import { useEffect } from "react";
import t from "../i18n/translations";

export default function PassengerStep({
  locale,
  adults,
  setAdults,
  children,
  setChildren,
  vehicle,
  setVehicle,
  onNext,
  onBack,
}) {
  const L = t[locale] || t.de;
  const total = adults + children;
  const lockVehicle = total > 4;

  useEffect(() => {
    if (lockVehicle && vehicle !== "familyVan") {
      setVehicle("familyVan");
    }
  }, [lockVehicle, vehicle, setVehicle]);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {/* Progress Bar */}
      <div className="flex items-center space-x-2 mb-6">
        <span className="w-8 h-8 flex items-center justify-center bg-[#002147] text-white rounded-full">
          2
        </span>
        <div className="flex-1 h-1 bg-gray-200 rounded-full" />
        <span className="text-gray-600">
          {L.stepIndicator.replace("{step}", "2").replace("{total}", "6")}
        </span>
      </div>

      {/* Headline & Subtitle */}
      <h1 className="text-3xl font-bold text-[#002147] mb-2">
        2. {L.passengerTitle}
      </h1>
      <p className="text-gray-600 mb-6">{L.passengerSubtitle}</p>

      <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
        {/* Adults */}
        <label className="block mb-1 font-medium text-gray-700">
          {L.adultsLabel}
        </label>
        <input
          type="number"
          min={1}
          value={adults}
          onChange={(e) => setAdults(Math.max(1, Number(e.target.value)))}
          className="w-24 mb-4 border rounded-lg px-3 py-2"
        />

        {/* Children */}
        <label className="block mb-1 font-medium text-gray-700">
          {L.childrenLabel}
        </label>
        <input
          type="number"
          min={0}
          value={children}
          onChange={(e) => setChildren(Math.max(0, Number(e.target.value)))}
          className="w-24 mb-6 border rounded-lg px-3 py-2"
        />

        {/* Vehicle Selection */}
        <label className="block mb-1 font-medium text-gray-700">
          {L.vehicleLabel}
        </label>
        <select
          value={vehicle}
          onChange={(e) => setVehicle(e.target.value)}
          disabled={lockVehicle}
          className={`w-full mb-6 border rounded-lg px-3 py-2 ${
            lockVehicle ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
        >
          <option value="economy">{L.vehicleEconomy}</option>
          <option value="business">{L.vehicleBusiness}</option>
          <option value="familyVan">{L.vehicleFamilyVan}</option>
        </select>

        {lockVehicle && (
          <p className="text-sm text-gray-500 mb-6">{L.vehicleDisabledHint}</p>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="py-3 px-6 border border-[#002147] text-[#002147] rounded-lg hover:bg-gray-100 transition"
          >
            {L.backBtn}
          </button>
          <button
            onClick={onNext}
            className="py-3 px-6 bg-[#002147] text-white rounded-lg hover:bg-[#C09743] transition"
          >
            {L.nextBtn}
          </button>
        </div>
      </div>
    </div>
  );
}
