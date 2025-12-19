"use client";

import React from "react";
import t from "../i18n/translations";
import { useLocale } from "../context/LocaleContext";

import RouteStep from "../components/RouteStep";
import PassengerStep from "../components/PassengerStep";
import NewVehicleSelection from "../components/NewVehicleSelection";
import SeatExtras from "../components/SeatExtras";
import ExtrasStep from "../components/ExtrasStep";
import ContactStep from "../components/ContactStep";
import ScrollToTop from "../components/ScrollToTop";

import { WizardLayout } from "../components/BookingComponents";

/* ✅ Preise enthalten (Step 1) */
function PricesIncludeBlock({ L }) {
  const items = Array.isArray(L.pricesIncludeItems) ? L.pricesIncludeItems : [];
  if (!items.length) return null;

  return (
    <div className="w-full max-w-3xl mx-auto mb-6">
      <div
        className="bg-white rounded-2xl border px-5 sm:px-6 py-5"
        style={{
          borderColor: "var(--amd-border,#e5e7eb)",
          boxShadow: "var(--amd-shadow-card, 0 14px 30px rgba(15, 23, 42, 0.06))",
        }}
      >
        <div className="text-lg font-bold text-[#002147] text-center mb-4">
          {L.pricesIncludeTitle || "Preise enthalten"}
        </div>

        <div className="grid gap-3">
          {items.map((txt, i) => (
            <div key={i} className="flex items-start gap-3">
              {/* ✅ edler Check */}
              <span
                className="mt-0.5 inline-flex items-center justify-center w-7 h-7 rounded-full"
                style={{
                  // Ring + leichtes “Material”
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(23,111,75,.12) 0%, rgba(23,111,75,.06) 45%, rgba(255,255,255,0) 70%)",
                  border: "1px solid rgba(23,111,75,.32)",
                  boxShadow:
                    "inset 0 1px 0 rgba(255,255,255,.9), 0 8px 18px rgba(15,23,42,.08)",
                }}
                aria-hidden="true"
              >
                {/* SVG wirkt sofort hochwertiger als ✓ */}
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    stroke: "rgba(23,111,75,.95)",
                    strokeWidth: 2.6,
                    strokeLinecap: "round",
                    strokeLinejoin: "round",
                    filter: "drop-shadow(0 1px 0 rgba(255,255,255,.6))",
                  }}
                >
                  <path d="M20 6L9 17l-5-5" />
                </svg>
              </span>

              <span className="text-[#002147] text-base font-semibold leading-snug">
                {txt}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function BookingPage() {
  const { locale } = useLocale();
  const L = t[locale] || t.de;

  const totalSteps = 6;
  const [step, setStep] = React.useState(1);

  const next = () => {
    setStep((s) => Math.min(totalSteps, s + 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const back = () => {
    setStep((s) => Math.max(1, s - 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Form state
  const [orig, setOrig] = React.useState("");
  const [dest, setDest] = React.useState("");
  const [dateTime, setDateTime] = React.useState("");
  const [returnDateTime, setReturnDateTime] = React.useState("");
  const [flightNo, setFlightNo] = React.useState("");
  const [isReturn, setIsReturn] = React.useState(false);
  const [distance, setDistance] = React.useState(0);
  const [duration, setDuration] = React.useState("");

  const [returnOrig, setReturnOrig] = React.useState("");
  const [returnDest, setReturnDest] = React.useState("");
  const [returnDistance, setReturnDistance] = React.useState(0);
  const [returnDuration, setReturnDuration] = React.useState("");

  const [adults, setAdults] = React.useState(1);
  const [children, setChildren] = React.useState(0);
  const [vehicle, setVehicle] = React.useState("");

  const [seatExtrasCounts, setSeatExtrasCounts] = React.useState({ baby: 0, child: 0, booster: 0 });
  const [extrasCounts, setExtrasCounts] = React.useState({
    flowers: 0,
    redWine: 0,
    whiteWine: 0,
    saft: 0,
    beer: 0,
    redbull: 0,
    tadybear: 0,
    pralinen: 0,
    vodka: 0,
  });
  const [voucher, setVoucher] = React.useState("");

  // Pricing
  const priceMap = {
    flowers: 35,
    redWine: 2.5,
    whiteWine: 2.5,
    saft: 2,
    beer: 3.5,
    redbull: 6,
    tadybear: 25,
    pralinen: 12,
    vodka: 2.5,
  };
  const ratePerKm = 1.05;

  function singleFare(dist) {
    return dist > 0 ? Math.round(dist * ratePerKm * 100) / 100 : 0;
  }
  function singleSurcharge(dist) {
    return dist > 0 && dist < 30 ? 15 : 0;
  }

  const outwardFare = singleFare(distance) + singleSurcharge(distance);
  const returnFare = isReturn ? singleFare(returnDistance) + singleSurcharge(returnDistance) : 0;
  const ridePrice = outwardFare + returnFare;

  const vehicleSurcharge = vehicle === "familyVan" ? 50 : vehicle === "business" ? 100 : 0;

  const seatPrices = { baby: 6, child: 6, booster: 5 };
  const allSeats = Object.entries(seatExtrasCounts)
    .flatMap(([k, c]) => Array(c).fill(seatPrices[k]))
    .sort((a, b) => a - b);
  if (allSeats.length > 0) allSeats.shift();
  const extrasSeatsCost = allSeats.reduce((sum, p) => sum + p, 0);

  const otherExtrasCost = Object.entries(extrasCounts).reduce(
    (sum, [k, c]) => sum + (priceMap[k] || 0) * c,
    0
  );

  const returnDiscount = isReturn ? -10 : 0;
  const totalBeforeVoucher = ridePrice + vehicleSurcharge + extrasSeatsCost + otherExtrasCost + returnDiscount;

  const isVoucherValid = voucher.trim().toUpperCase() === "AMDGC2025";
  const voucherDiscount = isVoucherValid ? Math.floor(totalBeforeVoucher * 0.1 * 100) / 100 : 0;
  const totalPrice = Math.ceil(totalBeforeVoucher - voucherDiscount);

  const seatExtrasDetails = Object.entries(seatExtrasCounts)
    .filter(([, c]) => c > 0)
    .map(([k, c]) => ({ key: k, count: c, unit: seatPrices[k] }));
  const otherExtrasDetails = Object.entries(extrasCounts)
    .filter(([, c]) => c > 0)
    .map(([k, c]) => ({ key: k, count: c, unit: priceMap[k] }));

  // ✅ Step-Titel: vorhandene i18n Keys nutzen (statt bookingStepTitles)
  const titles = [
    L.routeTitle || "Abholung & Ziel",
    L.passengerTitle || "Passagiere & Fahrzeug",
    L.vehicleTitle || "Fahrzeug wählen",
    L.seatsTitle || "Kindersitze",
    L.extrasStepTitle || "Weitere Extras",
    L.checkoutTitle || "Übersicht & Buchen",
  ];

  // ✅ Step Indicator: vorhandenes Template nutzen
  const stepIndicatorText = (L.stepIndicator || "Schritt {step} von {total}")
    .replace("{step}", String(step))
    .replace("{total}", String(totalSteps));

  // ✅ Titel oben nur Step 1 und 6 anzeigen (keine Doppelüberschriften in Step 2–5)
 const showTitle = true;

  return (
 <WizardLayout
  step={step}
  totalSteps={totalSteps}
  title={titles[step - 1] || ""}
  stepLabel={L.stepLabel || "Schritt"}
  ofLabel={L.ofLabel || "von"}
  showTitle={showTitle}
>

      {step === 1 && <PricesIncludeBlock L={L} />}

      {step === 1 && (
        <RouteStep
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
          duration={duration}
          setDuration={setDuration}
          returnOrig={returnOrig}
          setReturnOrig={setReturnOrig}
          returnDest={returnDest}
          setReturnDest={setReturnDest}
          returnDistance={returnDistance}
          setReturnDistance={setReturnDistance}
          returnDuration={returnDuration}
          setReturnDuration={setReturnDuration}
          onNext={next}
          onBack={back}
        />
      )}

      {step === 2 && (
        <PassengerStep
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
        <NewVehicleSelection
          adults={adults}
          children={children}
          vehicle={vehicle}
          setVehicle={setVehicle}
          onNext={next}
          onBack={back}
        />
      )}

      {step === 4 && (
        <SeatExtras counts={seatExtrasCounts} setCounts={setSeatExtrasCounts} onNext={next} onBack={back} />
      )}

      {step === 5 && (
        <ExtrasStep extrasCounts={extrasCounts} setExtrasCounts={setExtrasCounts} onNext={next} onBack={back} />
      )}

      {step === 6 && (
        <ContactStep
          orig={orig}
          dest={dest}
          adults={adults}
          children={children}
          isReturn={isReturn}
          ridePrice={ridePrice}
          vehicle={vehicle}
          vehicleSurcharge={vehicleSurcharge}
          returnDiscount={returnDiscount}
          totalBeforeVoucher={totalBeforeVoucher}
          voucherDiscount={voucherDiscount}
          totalPrice={totalPrice}
          voucher={voucher}
          setVoucher={setVoucher}
          dateTime={dateTime}
          returnDateTime={returnDateTime}
          flightNo={flightNo}
          setFlightNo={setFlightNo}
          seatExtrasDetails={seatExtrasDetails}
          otherExtrasDetails={otherExtrasDetails}
          onBack={back}
          duration={duration}
          returnDuration={returnDuration}
          returnOrig={returnOrig}
          returnDest={returnDest}
          returnDistance={returnDistance}
          distance={distance}
          returnVehicle={vehicle}
        />
      )}

      <ScrollToTop />
    </WizardLayout>
  );
}
