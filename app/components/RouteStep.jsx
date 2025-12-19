// app/components/RouteStep.jsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import Link from "next/link";
import t from "../i18n/translations";
import { useLocale } from "../context/LocaleContext";
import { MapPinIcon, CalendarIcon, ClockIcon } from "@heroicons/react/24/outline";
import DatePicker, { registerLocale } from "react-datepicker";
import { de } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("de", de);

function localizeDuration(duration, L) {
  if (!duration) return "";

  let hours = 0;
  let minutes = 0;

  const hourMatch = duration.match(/(\d+)\s*(Stunde|Stunden|hour|hours|hr|hrs|ساعة|ساعات)/i);
  if (hourMatch) hours = parseInt(hourMatch[1], 10);

  const minMatch = duration.match(/(\d+)\s*(Minute|Minuten|minutes|min|دقيقة|دقائق)/i);
  if (minMatch) minutes = parseInt(minMatch[1], 10);

  const parts = [];
  if (hours > 0) parts.push(hours + " " + (hours === 1 ? L.hourSingular : L.hourPlural));
  if (minutes > 0) parts.push(minutes + " " + (minutes === 1 ? L.minuteSingular : L.minutePlural));

  if (parts.length === 0 && minMatch) {
    parts.push(minutes + " " + (minutes === 1 ? L.minuteSingular : L.minutePlural));
  }

  return parts.join(", ");
}

export default function RouteStep({
  orig,
  setOrig,
  dest,
  setDest,
  dateTime,
  setDateTime,
  isReturn,
  setIsReturn,
  distance,
  setDistance,
  duration,
  setDuration,
  returnDateTime,
  setReturnDateTime,
  returnOrig,
  setReturnOrig,
  returnDest,
  setReturnDest,
  returnDistance,
  setReturnDistance,
  returnDuration,
  setReturnDuration,
  onNext,
  onBack,
}) {
  const { locale } = useLocale();
  const L = t[locale] || t.de;

  const pickupRef = useRef(null);
  const destRef = useRef(null);
  const returnPickupRef = useRef(null);
  const returnDestRef = useRef(null);

  const mapRef = useRef(null);

  const [map, setMap] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);

    update();
    if (mq.addEventListener) mq.addEventListener("change", update);
    else mq.addListener(update);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", update);
      else mq.removeListener(update);
    };
  }, []);

  // Map initialisieren
  useEffect(() => {
    if (!window.google?.maps || !mapRef.current) return;
    if (map) return;

    const _map = new window.google.maps.Map(mapRef.current, {
      center: { lat: 33.8886, lng: 35.4955 },
      zoom: 11,
      disableDefaultUI: true,
      zoomControl: true,
    });

    setMap(_map);
  }, [map]);

  // DirectionsRenderer an Map hängen
  useEffect(() => {
    if (!map) return;

    if (!directionsRenderer) {
      const dr = new window.google.maps.DirectionsRenderer({
        map,
        suppressMarkers: true,
        polylineOptions: {
          // ✅ FIX: Google Maps kann keine CSS-Variablen auswerten
          strokeColor: "#c1272d",
          strokeOpacity: 0.9,
          strokeWeight: 6,
        },
      });
      setDirectionsRenderer(dr);
      return;
    }

    directionsRenderer.setMap(map);
  }, [map, directionsRenderer]);

  // Hinfahrt: Autocomplete + Distanz/Dauer + Route
  useEffect(() => {
    if (!window.google?.maps?.places) return;
    if (!pickupRef.current || !destRef.current) return;

    const pickupAC = new window.google.maps.places.Autocomplete(pickupRef.current, {
      componentRestrictions: { country: "lb" },
    });
    const destAC = new window.google.maps.places.Autocomplete(destRef.current, {
      componentRestrictions: { country: "lb" },
    });

    const calcDistance = () => {
      const o = pickupRef.current?.value || "";
      const d = destRef.current?.value || "";

      setOrig(o);
      setDest(d);

      if (!o || !d) return;

      new window.google.maps.DistanceMatrixService().getDistanceMatrix(
        { origins: [o], destinations: [d], travelMode: "DRIVING" },
        (resp, status) => {
          const el = resp?.rows?.[0]?.elements?.[0];
          if (status === "OK" && el?.status === "OK") {
            setDistance(Number((el.distance.value / 1000).toFixed(1)));
            setDuration(el.duration.text);
          }
        }
      );

      if (!map) return;

      const ds = new window.google.maps.DirectionsService();
      ds.route(
        { origin: o, destination: d, travelMode: window.google.maps.TravelMode.DRIVING },
        (res, stat) => {
          if (stat === "OK") directionsRenderer?.setDirections(res);
        }
      );
    };

    pickupAC.addListener("place_changed", calcDistance);
    destAC.addListener("place_changed", calcDistance);

    return () => {
      window.google.maps.event.clearInstanceListeners(pickupAC);
      window.google.maps.event.clearInstanceListeners(destAC);
    };
  }, [map, directionsRenderer, setOrig, setDest, setDistance, setDuration]);

  // Rückfahrt: Autocomplete + Distanz/Dauer
  useEffect(() => {
    if (!isReturn) return;
    if (!window.google?.maps?.places) return;
    if (!returnPickupRef.current || !returnDestRef.current) return;

    const pickupAC = new window.google.maps.places.Autocomplete(returnPickupRef.current, {
      componentRestrictions: { country: "lb" },
    });
    const destAC = new window.google.maps.places.Autocomplete(returnDestRef.current, {
      componentRestrictions: { country: "lb" },
    });

    const calcReturnDistance = () => {
      const o = returnPickupRef.current?.value || "";
      const d = returnDestRef.current?.value || "";

      setReturnOrig(o);
      setReturnDest(d);

      if (!o || !d) return;

      new window.google.maps.DistanceMatrixService().getDistanceMatrix(
        { origins: [o], destinations: [d], travelMode: "DRIVING" },
        (resp, status) => {
          const el = resp?.rows?.[0]?.elements?.[0];
          if (status === "OK" && el?.status === "OK") {
            setReturnDistance(Number((el.distance.value / 1000).toFixed(1)));
            setReturnDuration(el.duration.text);
          }
        }
      );
    };

    pickupAC.addListener("place_changed", calcReturnDistance);
    destAC.addListener("place_changed", calcReturnDistance);

    return () => {
      window.google.maps.event.clearInstanceListeners(pickupAC);
      window.google.maps.event.clearInstanceListeners(destAC);
    };
  }, [isReturn, setReturnOrig, setReturnDest, setReturnDistance, setReturnDuration]);

  const dt = dateTime ? new Date(dateTime) : new Date();
  const rdt = returnDateTime ? new Date(returnDateTime) : new Date();

  const onChangeDateTime = (d) => {
    const isoDate = d.toISOString().slice(0, 10);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(Math.round(d.getMinutes() / 10) * 10).padStart(2, "0");
    setDateTime(`${isoDate}T${hh}:${mm}`);
  };

  const onChangeReturnDateTime = (d) => {
    const isoDate = d.toISOString().slice(0, 10);
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(Math.round(d.getMinutes() / 10) * 10).padStart(2, "0");
    setReturnDateTime(`${isoDate}T${hh}:${mm}`);
  };

  return (
    <div className="bg-white rounded-3xl border border-gray-200 shadow-lg p-5 md:p-8 mb-12">
      {/* Trust / Company box */}
      <div className="mb-6 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm break-words">
        <div className="text-sm md:text-base text-gray-700 leading-snug">
          <span className="font-semibold text-[#002147]">AMD German Center</span> — {L.trustLine1}
        </div>
        <div className="text-sm md:text-base text-gray-700 mt-1 leading-snug">{L.trustLine2}</div>
        <div className="mt-2 text-sm md:text-base">
          <Link
            href={{ pathname: "/impressum", query: { lang: locale } }}
            className="underline font-medium text-[#002147]"
            prefetch
          >
            {L.moreLink}
          </Link>
        </div>
      </div>

      {/* Pickup */}
      <label className="flex items-center mb-1 font-semibold text-[color:var(--amd-heading,#111827)]">
        <MapPinIcon className="w-4 h-4 mr-1 text-[color:rgba(17,24,39,0.55)]" /> {L.pickupLabel}
      </label>
      <input
        ref={pickupRef}
        type="text"
        value={orig}
        onChange={(e) => setOrig(e.target.value)}
        placeholder={L.pickupPlaceholder}
        className="w-full mb-4 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgba(193,39,45,0.22)]"
        dir="auto"
        enterKeyHint="next"
      />

      {/* Destination */}
      <label className="flex items-center mb-1 font-semibold text-[color:var(--amd-heading,#111827)]">
        <MapPinIcon className="w-4 h-4 mr-1 text-[color:rgba(17,24,39,0.55)] rotate-180" />{" "}
        {L.destinationLabel}
      </label>
      <input
        ref={destRef}
        type="text"
        value={dest}
        onChange={(e) => setDest(e.target.value)}
        placeholder={L.destinationPlaceholder}
        className="w-full mb-4 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgba(193,39,45,0.22)]"
        dir="auto"
        enterKeyHint="next"
      />

      {/* Map */}
      <div className="w-full mb-6">
        <div ref={mapRef} className="w-full rounded-2xl border border-gray-200 h-48 md:h-56 overflow-hidden" />
      </div>

      {/* DateTime */}
      <label className="flex items-center mb-1 font-semibold text-[color:var(--amd-heading,#111827)]">
        <CalendarIcon className="w-5 h-5 mr-2 text-[color:rgba(17,24,39,0.55)]" /> {L.dateTimeLabel}
      </label>
      <div className="mb-4">
        <DatePicker
          selected={dt}
          onChange={onChangeDateTime}
          showTimeSelect
          timeIntervals={10}
          timeFormat="HH:mm"
          dateFormat="dd.MM.yyyy HH:mm"
          locale="de"
          className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgba(193,39,45,0.22)]"
          placeholderText="TT.MM.JJJJ HH:mm"
          withPortal={isMobile}
        />
      </div>

      {/* Return toggle */}
      <label className="flex items-center mb-5">
        <input
          type="checkbox"
          checked={isReturn}
          onChange={(e) => setIsReturn(e.target.checked)}
          className="mr-2"
        />
        <span className="font-semibold text-[color:var(--amd-heading,#111827)]">{L.returnTripLabel}</span>
      </label>

      {/* Distance / Duration */}
      {distance > 0 && (
        <div className="bg-[#f9fafb] p-4 rounded-2xl border border-gray-200 mb-6 space-y-2">
          <div className="flex items-center space-x-2">
            <MapPinIcon className="w-4 h-4" style={{ color: "var(--amd-accent,#176f4b)" }} />
            <span className="font-semibold text-[color:var(--amd-heading,#111827)]">
              {L.distanceLabel.replace("{km}", distance.toFixed(1))}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <ClockIcon className="w-5 h-5" style={{ color: "var(--amd-primary,#c1272d)" }} />
            <span className="font-semibold text-[color:var(--amd-heading,#111827)]">
              {localizeDuration(duration, L)}
            </span>
          </div>
        </div>
      )}

      {/* Return section */}
      {isReturn && (
        <div className="bg-white p-5 rounded-2xl border border-gray-200 mb-6 space-y-4 shadow-sm">
          <div className="font-semibold text-[color:var(--amd-heading,#111827)]">{L.returnTripLabel}</div>

          <label className="flex items-center mb-1 font-semibold text-[color:var(--amd-heading,#111827)]">
            <MapPinIcon className="w-4 h-4 mr-1 text-[color:rgba(17,24,39,0.55)]" /> {L.pickupLabel}
          </label>
          <input
            ref={returnPickupRef}
            type="text"
            value={returnOrig}
            onChange={(e) => setReturnOrig(e.target.value)}
            placeholder={L.pickupPlaceholder}
            className="w-full mb-3 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgba(193,39,45,0.22)]"
            dir="auto"
            enterKeyHint="next"
          />

          <label className="flex items-center mb-1 font-semibold text-[color:var(--amd-heading,#111827)]">
            <MapPinIcon className="w-4 h-4 mr-1 text-[color:rgba(17,24,39,0.55)] rotate-180" />{" "}
            {L.destinationLabel}
          </label>
          <input
            ref={returnDestRef}
            type="text"
            value={returnDest}
            onChange={(e) => setReturnDest(e.target.value)}
            placeholder={L.destinationPlaceholder}
            className="w-full mb-3 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgba(193,39,45,0.22)]"
            dir="auto"
            enterKeyHint="next"
          />

          <label className="flex items-center mb-1 font-semibold text-[color:var(--amd-heading,#111827)]">
            <CalendarIcon className="w-5 h-5 mr-2 text-[color:rgba(17,24,39,0.55)]" /> {L.dateTimeLabel}
          </label>
          <DatePicker
            selected={rdt}
            onChange={onChangeReturnDateTime}
            showTimeSelect
            timeIntervals={10}
            timeFormat="HH:mm"
            dateFormat="dd.MM.yyyy HH:mm"
            locale="de"
            className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[rgba(193,39,45,0.22)]"
            placeholderText="TT.MM.JJJJ HH:mm"
            withPortal={isMobile}
          />

          {returnDistance > 0 && (
            <div className="flex items-center space-x-2">
              <MapPinIcon className="w-4 h-4" style={{ color: "var(--amd-accent,#176f4b)" }} />
              <span className="font-semibold text-[color:var(--amd-heading,#111827)]">
                {L.distanceLabel.replace("{km}", returnDistance.toFixed(1))}
              </span>
            </div>
          )}

          {returnDuration && (
            <div className="flex items-center space-x-2">
              <ClockIcon className="w-5 h-5" style={{ color: "var(--amd-primary,#c1272d)" }} />
              <span className="font-semibold text-[color:var(--amd-heading,#111827)]">
                {localizeDuration(returnDuration, L)}
              </span>
            </div>
          )}
        </div>
      )}

      {/* Buttons */}
      <div className="mt-8 flex flex-col md:flex-row md:justify-end gap-3">
        {typeof onBack === "function" && (
          <button onClick={onBack} className="btn btn-secondary md:mr-2">
            {L.backBtn}
          </button>
        )}
        {typeof onNext === "function" && (
          <button onClick={onNext} className="btn btn-primary">
            {L.nextBtn}
          </button>
        )}
      </div>
    </div>
  );
}
