"use client";

// app/components/RouteStep.jsx

import React, { useRef, useEffect } from "react";
import t from "../i18n/translations";
import { useLocale } from "../context/LocaleContext";

export default function RouteStep({
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
  onBack,
}) {
  const { locale } = useLocale();
  const L = t[locale] || t.de;

  const pickupRef = useRef(null);
  const destRef = useRef(null);

  useEffect(() => {
    // erst im Browser
    if (typeof window === "undefined" || !window.google?.maps?.places) return;

    const pickupInput = pickupRef.current;
    const destInput = destRef.current;
    if (!pickupInput || !destInput) return;

    // Autocomplete initialisieren
    const pickupAC = new window.google.maps.places.Autocomplete(pickupInput, {
      componentRestrictions: { country: locale === 'ar' ? 'lb' : 'lb' }
    });
    const destAC = new window.google.maps.places.Autocomplete(destInput, {
      componentRestrictions: { country: locale === 'ar' ? 'lb' : 'lb' }
    });

    const calcDistance = () => {
      const o = pickupInput.value;
      const d = destInput.value;
      setOrig(o);
      setDest(d);
      if (!o || !d) return;
      new window.google.maps.DistanceMatrixService().getDistanceMatrix(
        { origins: [o], destinations: [d], travelMode: 'DRIVING' },
        (resp, status) => {
          if (status === 'OK') {
            const km = resp.rows[0].elements[0].distance.value / 1000;
            setDistance(Number(km.toFixed(1)));
          }
        }
      );
    };

    // Event-Listener
    pickupAC.addListener('place_changed', calcDistance);
    destAC.addListener('place_changed', calcDistance);

    // Cleanup
    return () => {
      window.google.maps.event.clearInstanceListeners(pickupAC);
      window.google.maps.event.clearInstanceListeners(destAC);
    };
  }, [setOrig, setDest, setDistance, locale]);

  const dt = dateTime ? new Date(dateTime) : new Date();
  const dateValue = dt.toISOString().slice(0, 10);
  const hourValue = String(dt.getHours()).padStart(2, '0');
  const minuteValue = String(dt.getMinutes()).padStart(2, '0');

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 mb-12">
      <label className="block mb-1 font-medium text-gray-700">
        {L.pickupLabel}
      </label>
      <input
        type="text"
        ref={pickupRef}
        value={orig}
        onChange={e => setOrig(e.target.value)}
        placeholder={L.pickupPlaceholder}
        className="w-full mb-4 border rounded-lg px-3 py-2"
      />

      <label className="block mb-1 font-medium text-gray-700">
        {L.destinationLabel}
      </label>
      <input
        type="text"
        ref={destRef}
        value={dest}
        onChange={e => setDest(e.target.value)}
        placeholder={L.destinationPlaceholder}
        className="w-full mb-4 border rounded-lg px-3 py-2"
      />

      <label className="block mb-1 font-medium text-gray-700">
        {L.dateTimeLabel}
      </label>
      <input
        type="date"
        value={dateValue}
        onChange={e => setDateTime(`${e.target.value}T${hourValue}:${minuteValue}`)}
        className="w-full mb-2 border rounded-lg px-3 py-2"
      />
      <div className="flex items-center gap-2 mb-4">
        <select
          value={hourValue}
          onChange={e => setDateTime(`${dateValue}T${e.target.value}:${minuteValue}`)}
          className="border rounded-lg px-3 py-2"
        >
          {Array.from({ length: 24 }, (_, i) => (
            <option key={i} value={String(i).padStart(2, '0')}>{String(i).padStart(2, '0')}</option>
          ))}
        </select>
        <span>:</span>
        <select
          value={minuteValue}
          onChange={e => setDateTime(`${dateValue}T${hourValue}:${e.target.value}`)}
          className="border rounded-lg px-3 py-2"
        >
          {['00', '15', '30', '45'].map(m => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
      </div>

      <label className="block mb-1 font-medium text-gray-700">
        {L.flightNoLabel}
      </label>
      <input
        type="text"
        value={flightNo}
        onChange={e => setFlightNo(e.target.value)}
        placeholder={L.flightNoPlaceholder}
        className="w-full mb-4 border rounded-lg px-3 py-2"
      />

      <label className="flex items-center mb-4">
        <input
          type="checkbox"
          checked={isReturn}
          onChange={e => setIsReturn(e.target.checked)}
          className="mr-2"
        />
        <span className="text-gray-700">
          {L.returnTripLabel}
        </span>
      </label>

      {isReturn && (
        <>
          <label className="block mb-1 font-medium text-gray-700">
            {L.returnDateTimeLabel}
          </label>
          <input
            type="date"
            value={returnDateTime ? new Date(returnDateTime).toISOString().slice(0, 10) : dateValue}
            onChange={e => {
              const [h, m] = returnDateTime
                ? [
                    String(new Date(returnDateTime).getHours()).padStart(2, '0'),
                    String(new Date(returnDateTime).getMinutes()).padStart(2, '0')
                  ]
                : ['00', '00'];
              setReturnDateTime(`${e.target.value}T${h}:${m}`);
            }}
            className="w-full mb-2 border rounded-lg px-3 py-2"
          />
          <div className="flex items-center gap-2 mb-4">
            <select
              value={String(new Date(returnDateTime || Date.now()).getHours()).padStart(2, '0')}
              onChange={e => {
                const dt = new Date(returnDateTime || Date.now());
                dt.setHours(Number(e.target.value));
                setReturnDateTime(dt.toISOString().slice(0, 16));
              }}
              className="border rounded-lg px-3 py-2"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={String(i).padStart(2, '0')}>{String(i).padStart(2, '0')}</option>
              ))}
            </select>
            <span>:</span>
            <select
              value={String(new Date(returnDateTime || Date.now()).getMinutes()).padStart(2, '0')}
              onChange={e => {
                const dt = new Date(returnDateTime || Date.now());
                dt.setMinutes(Number(e.target.value));
                setReturnDateTime(dt.toISOString().slice(0, 16));
              }}
              className="border rounded-lg px-3 py-2"
            >
              {['00', '15', '30', '45'].map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </>
      )}

      {distance > 0 && (
        <p className="mb-4 font-medium text-gray-700">
          {L.distanceLabel.replace('{km}', String(distance * (isReturn ? 2 : 1)))}
        </p>
      )}

      <div className="flex justify-end">
        <button onClick={onNext} className="btn btn-primary">
          {L.nextBtn}
        </button>
      </div>
    </div>
  );
}
