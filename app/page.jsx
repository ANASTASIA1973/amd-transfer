"use client";
// app/page.jsx

import React from "react";
import t from "./i18n/translations";
import { useLocale } from "./context/LocaleContext";
import StepIndicator from "./components/StepIndicator";
import RouteStep from "./components/RouteStep";
import PassengerStep from "./components/PassengerStep";
import VehicleSelection from "./components/VehicleSelection";
import SeatExtras from "./components/SeatExtras";
import ExtrasStep from "./components/ExtrasStep";
import ContactStep from "./components/ContactStep";
import GoogleMapsLoader from "./components/GoogleMapsLoader";
import Map from "./components/Map";

export default function Home() {
  const { locale } = useLocale();
  const L = t[locale] || t.de;

  // Schritt Navigation
  const [step, setStep] = React.useState(1);
  const next = () => setStep(s => Math.min(6, s + 1));
  const back = () => setStep(s => Math.max(1, s - 1));

  // Form States
  const [orig, setOrig] = React.useState("");
  const [dest, setDest] = React.useState("");
  const [dateTime, setDateTime] = React.useState("");
  const [returnDateTime, setReturnDateTime] = React.useState("");
  const [flightNo, setFlightNo] = React.useState("");
  const [isReturn, setIsReturn] = React.useState(false);
  const [distance, setDistance] = React.useState(0);
  const [adults, setAdults] = React.useState(1);
  const [children, setChildren] = React.useState(0);
  const [vehicle, setVehicle] = React.useState("");
  const [seatExtrasCounts, setSeatExtrasCounts] = React.useState({ baby: 0, child: 0, booster: 0 });
  const [extrasCounts, setExtrasCounts] = React.useState({
    flowers: 0,
    redWine: 0,
    whiteWine: 0,
    whiskey: 0,
    beer: 0,
    redbull: 0,
    obstbecher: 0,
    pralinen: 0,
    vodka: 0
  });
  const [voucher, setVoucher] = React.useState("");

  // Preisberechnung
  const ratePerKm = 1.6;
  const rideDistance = distance * (isReturn ? 2 : 1);
  const ridePrice = distance > 0
    ? rideDistance <= 31
      ? 20 * (isReturn ? 2 : 1)
      : Number((rideDistance * ratePerKm).toFixed(2))
    : 0;
  const vehicleSurcharge = vehicle === "familyVan" ? 50 : vehicle === "business" ? 100 : 0;
  const seatPrices = { baby: 6, child: 6, booster: 5 };
  const allSeats = Object.entries(seatExtrasCounts)
    .flatMap(([k, c]) => Array(c).fill(seatPrices[k]))
    .sort((a, b) => a - b);
  allSeats.shift(); // günstigster gratis
  const extrasSeatsCost = allSeats.reduce((sum, p) => sum + p, 0);
  const extraPrices = { flowers: 45, redWine: 20, whiteWine: 20, whiskey: 35, beer: 6, redbull: 8, obstbecher: 11, pralinen: 12, vodka: 20 };
  const otherExtrasCost = Object.entries(extrasCounts).reduce(
    (sum, [k, c]) => sum + c * extraPrices[k],
    0
  );
  const returnDiscount = isReturn ? -10 : 0;
  const totalBeforeVoucher = ridePrice + vehicleSurcharge + extrasSeatsCost + otherExtrasCost + returnDiscount;
  const isVoucherValid = voucher.trim().toUpperCase() === "AMDGC2025";
  const voucherDiscount = isVoucherValid
    ? Math.floor(totalBeforeVoucher * 0.1 * 100) / 100
    : 0;
  const totalPrice = Math.ceil(totalBeforeVoucher - voucherDiscount);
  const seatExtrasDetails = Object.entries(seatExtrasCounts)
    .filter(([, c]) => c > 0)
    .map(([k, c]) => ({ key: k, count: c, unit: seatPrices[k] }));
  const otherExtrasDetails = Object.entries(extrasCounts)
    .filter(([, c]) => c > 0)
    .map(([k, c]) => ({ key: k, count: c, unit: extraPrices[k] }));

  return (
    <>
      {/* Google API und Karte */}
      <GoogleMapsLoader />
      <Map height="300px" />

      <div className="max-w-3xl mx-auto p-8 space-y-6">
        <h1 className="text-3xl font-bold text-[#002147]">{L.bookingTitle}</h1>
        <StepIndicator step={step} total={6} />

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
          <VehicleSelection
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
            counts={seatExtrasCounts}
            setCounts={setSeatExtrasCounts}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 5 && (
          <ExtrasStep
            extrasCounts={extrasCounts}
            setExtrasCounts={setExtrasCounts}
            onNext={next}
            onBack={back}
          />
        )}
        {step === 6 && (
          <ContactStep
            orig={orig}
            dest={dest}
            adults={adults}
            children={children}
            isReturn={isReturn}
            ridePrice={ridePrice}
            vehicleSurcharge={vehicleSurcharge}
            extrasSeatsCost={extrasSeatsCost}
            otherExtrasCost={otherExtrasCost}
            returnDiscount={returnDiscount}
            totalBeforeVoucher={totalBeforeVoucher}
            voucherDiscount={voucherDiscount}
            totalPrice={totalPrice}
            voucher={voucher}
            setVoucher={setVoucher}
            dateTime={dateTime}
            returnDateTime={returnDateTime}
            flightNo={flightNo}
            seatExtrasDetails={seatExtrasDetails}
            otherExtrasDetails={otherExtrasDetails}
            onBack={back}
          />
        )}
      </div>
    </>
  );
}
