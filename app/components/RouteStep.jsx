"use client";

import { useRef, useEffect } from "react";
import t from "../i18n/translations";

export default function RouteStep({
  locale,
  orig,
  setOrig,
  dest,
  setDest,
  dateTime,
  setDateTime,
  flightNo,
  setFlightNo,
  isReturn,
  setIsReturn,
  distance,
  setDistance,
  returnDateTime,
  setReturnDateTime,
  onNext,
}) {
  const L = t[locale] || t.de;
  const pickupRef = useRef(null);
  const destRef = useRef(null);

  useEffect(() => {
    if (!window.google?.maps?.places) return;

    const pickupAC = new window.google.maps.places.Autocomplete(
      pickupRef.current,
      { componentRestrictions: { country: "lb" } }
    );
    const destAC = new window.google.maps.places.Autocomplete(destRef.current, {
      componentRestrictions: { country: "lb" },
    });

    const calcDistance = () => {
      const o = pickupRef.current.value;
      const d = destRef.current.value;
      setOrig(o);
      setDest(d);
      if (!o || !d) return;

      new window.google.maps.DistanceMatrixService().getDistanceMatrix(
        { origins: [o], destinations: [d], travelMode: "DRIVING" },
        (resp, status) => {
          if (status === "OK") {
            const km = resp.rows[0].elements[0].distance.value / 1000;
            setDistance(Number(km.toFixed(1)));
          }
        }
      );
    };

    pickupAC.addListener("place_changed", calcDistance);
    destAC.addListener("place_changed", calcDistance);
  }, [setOrig, setDest, setDistance]);

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
      {/* Abholort */}
      <label className="block mb-1 font-medium text-gray-700">
        {L.pickupLabel}
      </label>
      <input
        type="text"
        ref={pickupRef}
        value={orig}
        onChange={(e) => setOrig(e.target.value)}
        placeholder={L.pickupPlaceholder}
        className="w-full mb-4 border rounded-lg px-3 py-2"
      />

      {/* Zielort */}
      <label className="block mb-1 font-medium text-gray-700">
        {L.destinationLabel}
      </label>
      <input
        type="text"
        ref={destRef}
        value={dest}
        onChange={(e) => setDest(e.target.value)}
        placeholder={L.destinationPlaceholder}
        className="w-full mb-4 border rounded-lg px-3 py-2"
      />

      {/* Datum & Uhrzeit Hin */}
      <label className="block mb-1 font-medium text-gray-700">
        {L.dateTimeLabel}
      </label>
      <input
        type="datetime-local"
        value={dateTime}
        onChange={(e) => setDateTime(e.target.value)}
        className="w-full mb-4 border rounded-lg px-3 py-2"
      />

      {/* Flugnummer */}
      <label className="block mb-1 font-medium text-gray-700">
        {L.flightNoLabel}
      </label>
      <input
        type="text"
        value={flightNo}
        onChange={(e) => setFlightNo(e.target.value)}
        placeholder={L.flightNoPlaceholder}
        className="w-full mb-4 border rounded-lg px-3 py-2"
      />

      {/* Rückfahrt-Checkbox */}
      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={isReturn}
          onChange={(e) => setIsReturn(e.target.checked)}
          className="mr-2"
        />
        <span className="text-gray-700">{L.returnTripLabel}</span>
      </label>

      {/* Rückfahrt Datum & Uhrzeit */}
      {isReturn && (
        <>
          <label className="block mb-1 font-medium text-gray-700">
            {L.returnDateTimeLabel}
          </label>
          <input
            type="datetime-local"
            value={returnDateTime}
            onChange={(e) => setReturnDateTime(e.target.value)}
            className="w-full mb-4 border rounded-lg px-3 py-2"
          />
        </>
      )}

      {/* Distanz-Anzeige */}
      {distance > 0 && (
        <p className="mb-4 font-medium text-gray-700">
          {L.distanceLabel.replace(
            "{km}",
            String(distance * (isReturn ? 2 : 1))
          )}
        </p>
      )}

      {/* Weiter-Button */}
      <div className="flex justify-end">
        <button
          onClick={onNext}
          className="bg-[#002147] hover:bg-[#C09743] text-white font-medium py-3 px-6 rounded-lg transition"
        >
          {L.nextBtn}
        </button>
      </div>
    </div>
  );
}
