// app/page.jsx
"use client";

import { useState } from "react";
import t from "./i18n/translations";

import RouteStep from "./components/RouteStep";
import PassengerStep from "./components/PassengerStep";
import VehicleSelection from "./components/VehicleSelection";
import SeatExtras from "./components/SeatExtras";
import ExtrasStep from "./components/ExtrasStep";
import ContactStep from "./components/ContactStep";

export default function Home({ locale }) {
  const L = t[locale] || t.de;

  // Schritt‐Navigation
  const [step, setStep] = useState(1);
  const next = () => setStep((s) => s + 1);
  const back = () => setStep((s) => s - 1);

  // ── Form‐States ──────────────────────────
  const [orig, setOrig] = useState("");
  const [dest, setDest] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [returnDateTime, setReturnDateTime] = useState("");
  const [flightNo, setFlightNo] = useState("");
  const [isReturn, setIsReturn] = useState(false);
  const [distance, setDistance] = useState(0);
  const [adults, setAdults] = useState(1);
  const [children, setChildren] = useState(0);
  const [vehicle, setVehicle] = useState("");
  const [seatExtrasCounts, setSeatExtrasCounts] = useState({
    baby: 0,
    child: 0,
    booster: 0,
  });
  const [extrasCounts, setExtrasCounts] = useState({
    flowers: 0,
    wine: 0,
    whiskey: 0,
    beer: 0,
    redbull: 0,
    obstplatte: 0,
    pralinen: 0,
    vodka: 0,
  });
  const [voucher, setVoucher] = useState("");

  // ── Preisberechnung ─────────────────────
  const ratePerKm = 1.6;
  const rideDistance = distance * (isReturn ? 2 : 1);
  const ridePrice =
    distance > 0
      ? rideDistance <= 31
        ? 20 * (isReturn ? 2 : 1)
        : Number((rideDistance * ratePerKm).toFixed(2))
      : 0;
  const vehicleSurcharge =
    vehicle === "familyVan" ? 50 : vehicle === "business" ? 100 : 0;
  const seatPrices = { baby: 5, child: 6, booster: 4 };
  const seatEntries = Object.entries(seatExtrasCounts);
  const allSeats = seatEntries
    .flatMap(([key, count]) => Array(count).fill(seatPrices[key]))
    .sort((a, b) => a - b);
  const freeSeatPrice = allSeats.shift() || 0;
  const extrasSeatsCost = allSeats.reduce((sum, p) => sum + p, 0);
  const extraPrices = {
    flowers: 35,
    wine: 39,
    whiskey: 60,
    beer: 9,
    redbull: 7,
    obstplatte: 22,
    pralinen: 14,
    vodka: 50,
  };
  const otherExtrasCost = Object.entries(extrasCounts).reduce(
    (sum, [key, count]) => sum + count * extraPrices[key],
    0
  );
  const returnDiscount = isReturn ? -10 : 0;
  const subtotalBeforeVoucher =
    ridePrice +
    vehicleSurcharge +
    extrasSeatsCost +
    otherExtrasCost +
    returnDiscount;
  const isVoucherValid = voucher.trim().toUpperCase() === "AMDGC2025";
  const voucherDiscount = isVoucherValid
    ? Math.floor(subtotalBeforeVoucher * 0.1)
    : 0;
  const totalRaw = subtotalBeforeVoucher - voucherDiscount;
  const totalPrice = Math.ceil(totalRaw / 10) * 10;

  // ── Detail‐Arrays für ContactStep ─────────
  const seatExtrasDetails = seatEntries
    .filter(([_, count]) => count > 0)
    .map(([key, count]) => `• ${L[key + "Label"] || key} ×${count}`);
  const otherExtrasDetails = Object.entries(extrasCounts)
    .filter(([_, count]) => count > 0)
    .map(([key, count]) => `• ${L[key] || key} ×${count}`);

  // ── Render ────────────────────────────────
  return (
    <div className="max-w-3xl mx-auto p-8 space-y-8">
      <h1 className="text-3xl font-bold text-[#002147]">{L.bookingTitle}</h1>
      <p className="text-gray-600">{L.bookingSubtitle}</p>

      {step === 1 && (
        <RouteStep
          locale={locale}
          orig={orig}
          setOrig={setOrig}
          dest={dest}
          setDest={setDest}
          dateTime={dateTime}
          setDateTime={setDateTime}
          returnDateTime={returnDateTime}
          setReturnDateTime={setReturnDateTime}
          flightNo={flightNo}
          setFlightNo={setFlightNo}
          isReturn={isReturn}
          setIsReturn={setIsReturn}
          distance={distance}
          setDistance={setDistance}
          onNext={next}
        />
      )}

      {step === 2 && (
        <PassengerStep
          locale={locale}
          adults={adults}
          setAdults={setAdults}
          children={children}
          setChildren={setChildren}
          vehicle={vehicle}
          setVehicle={setVehicle}
          onNext={next}
          onBack={back}
        />
      )}

      {step === 3 && (
        <VehicleSelection
          locale={locale}
          adults={adults}
          children={children}
          vehicle={vehicle}
          setVehicle={setVehicle}
          onNext={next}
          onBack={back}
        />
      )}

      {step === 4 && (
        <SeatExtras
          locale={locale}
          counts={seatExtrasCounts}
          setCounts={setSeatExtrasCounts}
          onNext={next}
          onBack={back}
        />
      )}

      {step === 5 && (
        <ExtrasStep
          locale={locale}
          extrasCounts={extrasCounts}
          setExtrasCounts={setExtrasCounts}
          onNext={next}
          onBack={back}
        />
      )}

      {step === 6 && (
        <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
          <h2 className="text-2xl font-bold text-[#002147]">
            {L.checkoutTitle}
          </h2>

          <button
            onClick={back}
            className="border border-[#002147] text-[#002147] py-2 px-4 rounded-lg hover:bg-gray-100 transition"
          >
            {L.backBtn}
          </button>

          <div className="space-y-2">
            {distance > 0 && rideDistance <= 31 && (
              <p className="text-sm text-gray-600">
                {L.minimumFareLabel}: €20.00
              </p>
            )}
            {distance > 0 && (
              <p className="text-sm text-gray-600">
                {L.ridePriceLabel}: €{ridePrice.toFixed(2)}
              </p>
            )}
            <p className="text-sm text-gray-600">
              {L.vehicleSurchargeLabel}: €{vehicleSurcharge.toFixed(2)}
            </p>
            <p className="text-sm text-gray-600">
              {L.extrasTotalLabel}: €
              {(extrasSeatsCost + otherExtrasCost).toFixed(2)}
            </p>
            {isReturn && (
              <p className="text-sm text-gray-600">
                {L.returnDiscountLabel}: -€10.00
              </p>
            )}
            {isVoucherValid && (
              <p className="text-sm text-green-600">
                {L.voucherLabel}: -€{voucherDiscount}
              </p>
            )}
            <hr />
            <p className="text-xl font-bold">
              {L.totalLabel}: €{totalPrice}
            </p>
          </div>

          <div className="space-y-1">
            <label className="font-medium">{L.voucherLabel}</label>
            <input
              type="text"
              value={voucher}
              onChange={(e) => setVoucher(e.target.value)}
              placeholder={L.voucherPlaceholder}
              className="w-full border rounded-lg px-3 py-2"
            />
          </div>

          <ContactStep
            locale={locale}
            orig={orig}
            dest={dest}
            adults={adults}
            children={children}
            isReturn={isReturn}
            vehicle={vehicle}
            seatExtrasDetails={seatExtrasDetails}
            otherExtrasDetails={otherExtrasDetails}
            extrasSeatsCost={extrasSeatsCost}
            otherExtrasCost={otherExtrasCost}
            freeSeatPrice={freeSeatPrice}
            totalPrice={totalPrice}
            dateTime={dateTime}
            flightNo={flightNo}
            voucher={voucher}
            onBack={back}
          />
        </div>
      )}
    </div>
  );
}
