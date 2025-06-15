"use client";
// app/components/PassengerStep.jsx

import React, { useEffect } from "react";
import t from "../i18n/translations";
import { useLocale } from "../context/LocaleContext";

export default function PassengerStep({
  adults,
  setAdults,
  children,
  setChildren,
  vehicle,
  setVehicle,
  onNext,
  onBack,
}) {
  const { locale } = useLocale();
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
      {/* Überschrift */}
      <h1 className="text-3xl font-bold text-[#002147] mb-6">
        {L.passengerTitle}
      </h1>

      <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
        {/* Erwachsene */}
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

        {/* Kinder */}
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

        {/* Fahrzeug */}
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
          <p className="text-sm text-gray-500 mb-6">
            {L.vehicleDisabledHint}
          </p>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
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
