"use client";
// app/page.jsx

import React from "react";
import t from "./i18n/translations";
import { useLocale } from "./context/LocaleContext";
import LanguageSwitcher from "./components/LanguageSwitcher";
import StepIndicator from "./components/StepIndicator";
import RouteStep from "./components/RouteStep";
import PassengerStep from "./components/PassengerStep";
import NewVehicleSelection from "./components/NewVehicleSelection";
import SeatExtras from "./components/SeatExtras";
import ExtrasStep from "./components/ExtrasStep";
import ContactStep from "./components/ContactStep";
import ScrollToTop from "./components/ScrollToTop";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { motion } from "framer-motion";

// Stylisher, moderner Benefits-Block wie im dunkleren Mock-Up
function PricesIncludeBlock({ L }) {
  if (!L.pricesIncludeTitle || !Array.isArray(L.pricesIncludeItems)) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className="bg-white/90 border border-[#EDD7B1] shadow-[0_4px_24px_0_rgba(200,151,67,0.10)] rounded-2xl px-7 py-5 max-w-xl mx-auto mb-4"
      style={{ backdropFilter: "blur(1.5px)" }}
    >
      <div className="font-bold text-xl text-[#002147] text-center mb-4 tracking-tight">
        {L.pricesIncludeTitle}
      </div>
      <div className="flex flex-col gap-3">
        {L.pricesIncludeItems.map((item, i) => (
          <div key={i} className="flex items-start gap-3">
            {/* dunkelgoldener Gradient-Kreis mit weißem Haken */}
            <span className="self-start flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-[#C09743] to-[#EDD7B1] shadow text-white border border-[#EDD7B1]">
              <CheckCircleIcon className="w-5 h-5" />
            </span>
            <span className="text-[#002147] text-base font-medium">{item}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

export default function Home() {
  const { locale } = useLocale();
  const L = t[locale] || t.de;

  // --- Step state ---
  const [step, setStep] = React.useState(1);
  const next = () => {
    setStep((s) => Math.min(6, s + 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const back = () => {
    setStep((s) => Math.max(1, s - 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- Form state ---
  const [orig, setOrig] = React.useState("");
  const [dest, setDest] = React.useState("");
  const [originCoords, setOriginCoords] = React.useState(null);
  const [destinationCoords, setDestinationCoords] = React.useState(null);
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

  // --- Pricing logic ---
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

  return (
    <div className="bg-[#F9F7F2] min-h-screen flex flex-col">
      {/* Lokal: LanguageSwitcher im Page-Content */}
      <div className="py-4 flex justify-center bg-[#F9F7F2]">
        <LanguageSwitcher />
      </div>

      {/* Main Form Container */}
      <main className="flex-grow flex items-start justify-center py-12 px-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden">
          {/* Goldener Titelbereich */}
          <div className="bg-[#C09743] py-8 px-6">
            <h1 className="text-3xl font-bold text-[#002147] text-center">
              {L.title}
            </h1>
          </div>

          {/* Formularinhalt */}
          <div className="p-6 space-y-5">
            <StepIndicator step={step} total={6} />

            {step === 1 && <PricesIncludeBlock L={L} />}
            {step === 1 && (
              <RouteStep
                orig={orig} setOrig={setOrig}
                dest={dest} setDest={setDest}
                dateTime={dateTime} setDateTime={setDateTime}
                returnDateTime={returnDateTime} setReturnDateTime={setReturnDateTime}
                flightNo={flightNo} setFlightNo={setFlightNo}
                isReturn={isReturn} setIsReturn={setIsReturn}
                distance={distance} setDistance={setDistance}
                duration={duration} setDuration={setDuration}
                returnOrig={returnOrig} setReturnOrig={setReturnOrig}
                returnDest={returnDest} setReturnDest={setReturnDest}
                returnDistance={returnDistance} setReturnDistance={setReturnDistance}
                returnDuration={returnDuration} setReturnDuration={setReturnDuration}
                onNext={next}
              />
            )}
            {step === 2 && (
              <PassengerStep
                adults={adults} setAdults={setAdults}
                children={children} setChildren={setChildren}
                vehicle={vehicle} setVehicle={setVehicle}
                onNext={next} onBack={back}
              />
            )}
            {step === 3 && (
              <NewVehicleSelection
                adults={adults} children={children}
                vehicle={vehicle} setVehicle={setVehicle}
                onNext={next} onBack={back}
              />
            )}
            {step === 4 && (
              <SeatExtras
                counts={seatExtrasCounts} setCounts={setSeatExtrasCounts}
                onNext={next} onBack={back}
              />
            )}
            {step === 5 && (
              <ExtrasStep
                extrasCounts={extrasCounts} setExtrasCounts={setExtrasCounts}
                onNext={next} onBack={back}
              />
            )}
            {step === 6 && (
              <ContactStep
                orig={orig} dest={dest}
                adults={adults} children={children}
                isReturn={isReturn} ridePrice={ridePrice}
                vehicle={vehicle} vehicleSurcharge={vehicleSurcharge}
                returnDiscount={returnDiscount}
                totalBeforeVoucher={totalBeforeVoucher}
                voucherDiscount={voucherDiscount} totalPrice={totalPrice}
                voucher={voucher} setVoucher={setVoucher}
                dateTime={dateTime} returnDateTime={returnDateTime}
                flightNo={flightNo} setFlightNo={setFlightNo}
                seatExtrasDetails={seatExtrasDetails}
                otherExtrasDetails={otherExtrasDetails}
                onBack={back} duration={duration}
                returnDuration={returnDuration}
                returnOrig={returnOrig} returnDest={returnDest}
                returnDistance={returnDistance} distance={distance}
                returnVehicle={vehicle}
              />
            )}
            <ScrollToTop />
          </div>
        </div>
      </main>
    </div>
  );
}
