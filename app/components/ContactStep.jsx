// app/components/ContactStep.jsx
"use client";
import React, { useState } from "react";
import t from "../i18n/translations";
import { useLocale } from "../context/LocaleContext";
import {
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  UsersIcon,
  ClockIcon,
  GiftIcon,
  CreditCardIcon,
  CheckCircleIcon,
  TicketIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";
import { FaCar, FaMobileAlt, FaWhatsapp } from "react-icons/fa";

/* ===================== Helpers ===================== */
function formatDurationText(duration, L, locale) {
  if (!duration) return "";
  let hours = 0,
    minutes = 0;
  const hourMatch = duration.match(
    /(\d+)\s*(Stunde|Stunden|hour|hours|hr|hrs|ساعة|ساعات)/i
  );
  if (hourMatch) hours = parseInt(hourMatch[1], 10);
  const minMatch = duration.match(
    /(\d+)\s*(Minute|Minuten|minutes|min|دقيقة|دقائق)/i
  );
  if (minMatch) minutes = parseInt(minMatch[1], 10);
  const parts = [];
  if (hours > 0)
    parts.push(hours + " " + (hours === 1 ? L.hourSingular : L.hourPlural));
  if (minutes > 0)
    parts.push(
      minutes + " " + (minutes === 1 ? L.minuteSingular : L.minutePlural)
    );
  if (parts.length === 0 && minMatch)
    parts.push(
      minutes + " " + (minutes === 1 ? L.minuteSingular : L.minutePlural)
    );
  return parts.join(", ");
}

const ltr = (s) => `\u2066${s}\u2069`;

const priceMap = {
  flowers: 35,
  redWine: 2.5,
  whiteWine: 2.5,
  saft: 2.0,
  beer: 3.5,
  redbull: 6.0,
  tadybear: 25.0,
  obstbecher: 25.0,
  pralinen: 12.0,
  vodka: 2.5,
};

const seatLabelMap = {
  baby: "babyLabel",
  child: "childLabel",
  booster: "boosterLabel",
};

const WHISH_QR_SRC = "/images/payments/whish-qr.png";

/* --- Bankdaten --- */
const BANK = {
  accountName: "AMD German Center",
  bankName: "Byblos Bank S.A.L.", // <<< Beirut entfernt
  ibanRaw: "LB11003900000003703571387001",
  bic: "BYBALBBX",
};

/* [NEU] Referral-Code lesen (mobil/desktop tauglich) */
function getReferralCode() {
  if (typeof window === "undefined") return null;
  try {
    const ls = window.localStorage.getItem("referral_code");
    if (ls && ls.trim()) return ls;
    const m = document.cookie.match(/(?:^|;\s*)referral_code=([^;]+)/);
    return m ? decodeURIComponent(m[1]) : null;
  } catch {
    return null;
  }
}

export default function ContactStep({
  orig,
  dest,
  adults,
  children,
  isReturn,
  ridePrice,
  vehicle,
  vehicleSurcharge,
  returnDiscount,
  voucherDiscount,
  voucher,
  setVoucher,
  dateTime,
  returnDateTime,
  flightNo,
  setFlightNo,
  seatExtrasDetails = [],
  otherExtrasDetails = [],
  onBack,
  duration,
  returnOrig,
  returnDest,
  returnDistance,
  returnDuration,
  distance,
  totalBeforeVoucher,
  totalPrice,
  returnVehicle = "",
  partnerId: _ignored, // wir nutzen lokalen State unten
}) {
  const { locale } = useLocale();
  const L = t[locale] || t.de;

  // Lokale Labels
  L.hourSingular = { de: "Stunde", en: "hour", ar: "ساعة" }[locale];
  L.hourPlural = { de: "Stunden", en: "hours", ar: "ساعات" }[locale];
  L.minuteSingular = { de: "Minute", en: "minute", ar: "دقيقة" }[locale];
  L.minutePlural = { de: "Minuten", en: "minutes", ar: "دقائق" }[locale];

  // Firmendaten
  const firmEmail = "info@amd-germancenter.com";
  const whatsappFull = "+96181622668";
  const whatsappDisplay = "+961 81 622 668";
  const whatsappDisplayCondensed = "+96181622668";

  // Form-State
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [partnerId, setPartnerId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("whish"); // 'whish' | 'cash' | 'bank'
  const [showWhishQr, setShowWhishQr] = useState(false);
  const [copied, setCopied] = useState("");

  const fmt = (dt) => (dt ? new Date(dt).toLocaleString(locale) : "");

  /* ---------- Extras ---------- */
  function renderSeatExtras(seatDetails) {
    if (!seatDetails.length) return [];
    const all = seatDetails
      .map(({ key, count, unit }) => ({ key, count, unit }))
      .filter(({ count }) => count > 0)
      .sort((a, b) => a.unit - b.unit);
    if (!all.length) return [];
    const items = [];
    let freeGiven = false;
    all.forEach(({ key, count, unit }) => {
      let label = `${L[seatLabelMap[key]]} x${count}`;
      if (!freeGiven) {
        if (count === 1) {
          label += ` (${L.freeBadgeText}): $0.00`;
          freeGiven = true;
        } else if (count > 1) {
          label += `: $${((count - 1) * unit).toFixed(2)} (${L.freeBadgeText})`;
          freeGiven = true;
        }
      } else {
        label += `: $${(count * unit).toFixed(2)}`;
      }
      items.push(label);
    });
    return items;
  }
  function renderOtherExtras(details) {
    return details
      .filter(({ count }) => count > 0)
      .map(
        ({ key, count }) =>
          `${L[key]} x${count}: $${((priceMap[key] || 0) * count).toFixed(2)}`
      );
  }
  function calcExtrasTotal(seatDetails, otherDetails) {
    let seats = seatDetails
      .map(({ count, unit }) => Array(count).fill(unit))
      .flat()
      .sort((a, b) => a - b);
    if (seats.length > 0) seats.shift(); // erster Sitz kostenlos
    const seatSum = seats.reduce((a, b) => a + b, 0);
    const otherSum = otherDetails.reduce(
      (sum, { key, count }) => sum + (priceMap[key] || 0) * count,
      0
    );
    return seatSum + otherSum;
  }

  /* ---------- Mail/WA-Text ---------- */
  function buildBookingText() {
    const partnerLabel =
      (L.partnerIdLabel || "Partner ID").replace(/\s*\(.*\)/, "");

    /* [NEU] Referral aus Storage/Cookie holen */
    const referral = getReferralCode();

    let lines = [
      L.emailGreeting,
      `${L.firstNameLabel}: ${firstName} ${lastName}`,
      `${L.emailLabel}: ${email}`,
      `${L.phoneLabel}: ${phone}`,
      ...(referral ? [`Ref: ${referral}`] : []), // [NEU] Hier klar sichtbar
      ...(partnerId ? [`${partnerLabel}: ${partnerId}`] : []),
      `${L.paymentTitle}: ${
        paymentMethod === "whish"
          ? L.whishBtn
          : paymentMethod === "cash"
          ? L.cashBtn
          : L.bankBtn || "Banküberweisung"
      }`,
      `${L.vehicleLabel}: ${
        L["vehicle" + vehicle[0].toUpperCase() + vehicle.slice(1)] || vehicle
      }`,
      `${L.pickupLabel}: ${orig}`,
      `${L.destinationLabel}: ${dest}`,
      `${L.dateTimeLabel}: ${fmt(dateTime)}`,
      `${L.ridePriceLabel}: $${ridePrice?.toFixed(2)}`,
      `${L.vehicleSurchargeLabel}: $${vehicleSurcharge?.toFixed(2)}`,
      `${
        L.streckeLabel
          ? L.streckeLabel.replace("{km}", distance?.toFixed(1) || "")
          : (L.distanceLabel || "").replace("{km}", distance?.toFixed(1) || "")
      }`,
      `${L.durationLabel}: ${formatDurationText(duration, L, locale)}`,
      ...(flightNo ? [`${L.flightNoLabel}: ${flightNo}`] : []),
      `${L.adultsLabel}: ${adults}`,
      `${L.childrenLabel}: ${children}`,
    ];
    if (isReturn) {
      lines = lines.concat([
        "",
        "----",
        `${L.returnTripLabel}:`,
        `${L.vehicleLabel}: ${
          L[
            "vehicle" + returnVehicle[0].toUpperCase() + returnVehicle.slice(1)
          ] || returnVehicle
        }`,
        `${L.pickupLabel}: ${returnOrig}`,
        `${L.destinationLabel}: ${returnDest}`,
        `${L.returnDateTimeLabel}: ${fmt(returnDateTime)}`,
        `${
          L.streckeLabel
            ? L.streckeLabel.replace("{km}", returnDistance?.toFixed(1) || "")
            : (L.distanceLabel || "").replace(
                "{km}",
                returnDistance?.toFixed(1) || ""
              )
        }`,
        `${L.durationLabel}: ${formatDurationText(returnDuration, L, locale)}`,
      ]);
    }
    const seatList = renderSeatExtras(seatExtrasDetails);
    const otherList = renderOtherExtras(otherExtrasDetails);
    if (seatList.length || otherList.length) {
      lines.push("", L.extrasStepTitle + ":");
      seatList.forEach((x) => lines.push("- " + x));
      otherList.forEach((x) => lines.push("- " + x));
      lines.push(
        `${L.extrasTotalLabel}: $${calcExtrasTotal(
          seatExtrasDetails,
          otherExtrasDetails
        ).toFixed(2)}`
      );
    }
    if (isReturn)
      lines.push(
        `${L.returnDiscountLabel}: -$${Math.abs(returnDiscount).toFixed(2)}`
      );
    if (voucherDiscount)
      lines.push(`${L.voucherLabel}: -$${voucherDiscount.toFixed(2)}`);
    lines.push(`${L.totalLabel}: $${totalPrice}`);
    return lines.join("\n");
  }

  const body = encodeURIComponent(buildBookingText());
  const mailtoLink = `mailto:${firmEmail}?subject=${encodeURIComponent(
    L.emailSubject
  )}&body=${body}`;
  const whatsappLink = `https://wa.me/${whatsappFull.replace(/\D/g, "")}?text=${body}`;

  const canSubmit = firstName && lastName && email && phone;

  const copy = async (text, which) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(""), 1200);
    } catch {
      /* ignore */
    }
  };

  /* ===================== Render ===================== */
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 w-full mx-auto max-w-[680px] sm:max-w-[720px] box-border overflow-hidden">
      {/* WARENKORB / BUCHUNGS-ÜBERSICHT */}
      <div className="space-y-4">
        {/* Hin- und Rückfahrt Übersicht */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Hinfahrt */}
          <div className="bg-gray-50 rounded-xl p-4 shadow flex-1 overflow-hidden">
            <div className="flex items-center font-semibold mb-2 text-[#002147]">
              <FaCar className="w-5 h-5 mr-2 text-[#C09743]" />
              {L.outwardTripTitle || "Hinfahrt"}
            </div>
            <div className="flex flex-col gap-1 text-gray-800">
              <div className="flex items-center min-w-0">
                <MapPinIcon className="w-4 h-4 mr-1 shrink-0" />
                <span className="truncate">{orig}</span>
              </div>
              <div className="flex items-center min-w-0">
                <MapPinIcon className="w-4 h-4 mr-1 rotate-180 shrink-0" />
                <span className="truncate">{dest}</span>
              </div>
              <div className="flex items-center min-w-0">
                <CalendarIcon className="w-4 h-4 mr-1 shrink-0" />
                <span className="truncate">{fmt(dateTime)}</span>
              </div>
              <div className="flex items-center min-w-0">
                <ClockIcon className="w-4 h-4 mr-1 shrink-0" />
                <span className="truncate">
                  {formatDurationText(duration, L, locale)}
                </span>
              </div>
              <div className="flex items-center min-w-0">
                <span className="w-4 h-4 mr-1 shrink-0">📏</span>
                <span className="truncate">
                  {(L.streckeLabel ? L.streckeLabel : L.distanceLabel || "").replace(
                    "{km}",
                    distance?.toFixed(1) || ""
                  )}
                </span>
              </div>
              {flightNo && (
                <div className="flex items-center min-w-0">
                  <TicketIcon className="w-4 h-4 mr-1 shrink-0" />
                  <span className="truncate">{flightNo}</span>
                </div>
              )}
              <div className="flex items-center min-w-0">
                <CheckCircleIcon className="w-4 h-4 mr-1 text-green-700 shrink-0" />
                <span className="truncate">
                  {L["vehicle" + vehicle[0].toUpperCase() + vehicle.slice(1)] ||
                    vehicle}
                </span>
              </div>
            </div>
          </div>

          {/* Rückfahrt */}
          {isReturn && (
            <div className="bg-blue-50 rounded-xl p-4 shadow flex-1 overflow-hidden">
              <div className="flex items-center font-semibold mb-2 text-[#002147]">
                <FaCar className="w-5 h-5 mr-2 text-[#C09743]" />
                {L.returnTripLabel}
              </div>
              <div className="flex flex-col gap-1 text-gray-800">
                <div className="flex items-center min-w-0">
                  <MapPinIcon className="w-4 h-4 mr-1 shrink-0" />
                  <span className="truncate">{returnOrig}</span>
                </div>
                <div className="flex items-center min-w-0">
                  <MapPinIcon className="w-4 h-4 mr-1 rotate-180 shrink-0" />
                  <span className="truncate">{returnDest}</span>
                </div>
                <div className="flex items-center min-w-0">
                  <CalendarIcon className="w-4 h-4 mr-1 shrink-0" />
                  <span className="truncate">{fmt(returnDateTime)}</span>
                </div>
                <div className="flex items-center min-w-0">
                  <ClockIcon className="w-4 h-4 mr-1 shrink-0" />
                  <span className="truncate">
                    {formatDurationText(returnDuration, L, locale)}
                  </span>
                </div>
                <div className="flex items-center min-w-0">
                  <span className="w-4 h-4 mr-1 shrink-0">📏</span>
                  <span className="truncate">
                    {(L.streckeLabel ? L.streckeLabel : L.distanceLabel || "").replace(
                      "{km}",
                      returnDistance?.toFixed(1) || ""
                    )}
                  </span>
                </div>
                <div className="flex items-center min-w-0">
                  <CheckCircleIcon className="w-4 h-4 mr-1 text-green-700 shrink-0" />
                  <span className="truncate">
                    {L[
                      "vehicle" +
                        returnVehicle[0].toUpperCase() +
                        returnVehicle.slice(1)
                    ] || returnVehicle}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Passagiere & Fahrzeug */}
        <div className="bg-gray-50 rounded-xl p-4 shadow flex flex-col md:flex-row md:items-center md:gap-8 overflow-hidden">
          <div className="flex items-center gap-2 mb-2 md:mb-0">
            <UsersIcon className="w-5 h-5 text-[#C09743]" />
            <span className="font-medium">
              {adults} {L.adultsLabel}
            </span>
          </div>
          <div className="flex items-center gap-2 mb-2 md:mb-0">
            <UserIcon className="w-5 h-5 text-[#C09743]" />
            <span className="font-medium">
              {children} {L.childrenLabel}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <FaCar className="w-5 h-5 text-[#C09743]" />
            <span className="font-medium">
              {L["vehicle" + vehicle[0].toUpperCase() + vehicle.slice(1)] ||
                vehicle}
            </span>
          </div>
        </div>

        {/* Extras */}
        {(renderSeatExtras(seatExtrasDetails).length > 0 ||
          renderOtherExtras(otherExtrasDetails).length > 0) && (
          <div className="bg-gray-50 rounded-xl p-4 shadow overflow-hidden">
            <div className="flex items-center font-semibold mb-2 text-[#002147]">
              <GiftIcon className="w-5 h-5 mr-2 text-[#C09743]" />
              {L.extrasStepTitle}
            </div>
            <ul className="list-disc ml-6 text-gray-800">
              {renderSeatExtras(seatExtrasDetails).map((x, i) => (
                <li key={"seat" + i}>{x}</li>
              ))}
              {renderOtherExtras(otherExtrasDetails).map((x, i) => (
                <li key={"extra" + i}>{x}</li>
              ))}
            </ul>
            <div className="font-bold mt-2">
              {L.extrasTotalLabel}: $
              {calcExtrasTotal(seatExtrasDetails, otherExtrasDetails).toFixed(
                2
              )}
            </div>
          </div>
        )}

        {/* Preisübersicht */}
        <div className="bg-yellow-50 rounded-xl p-4 shadow overflow-hidden">
          <div className="flex items-center font-semibold mb-2 text-[#A47119]">
            <CreditCardIcon className="w-5 h-5 mr-2" />
            {L.priceOverviewTitle || "Preisübersicht"}
          </div>
          <div className="text-gray-800 space-y-1">
            <div className="flex justify-between">
              <span>{L.ridePriceLabel}:</span>
              <span>${ridePrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>{L.vehicleSurchargeLabel}:</span>
              <span>${vehicleSurcharge?.toFixed(2)}</span>
            </div>
            {isReturn && (
              <div className="flex justify-between">
                <span>{L.returnDiscountLabel}:</span>
                <span className="text-green-700">
                  -${Math.abs(returnDiscount).toFixed(2)}
                </span>
              </div>
            )}
            {voucherDiscount > 0 && (
              <div className="flex justify-between">
                <span>{L.voucherLabel}:</span>
                <span className="text-green-700">
                  -${voucherDiscount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span>{L.extrasTotalLabel}:</span>
              <span>
                $
                {calcExtrasTotal(
                  seatExtrasDetails,
                  otherExtrasDetails
                ).toFixed(2)}
              </span>
            </div>
            <div className="border-t pt-2 flex justify-between text-lg font-bold">
              <span>{L.totalLabel}:</span> <span>${totalPrice}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Gutschein */}
      <div>
        <label className="block mb-1 font-medium">{L.voucherLabel}</label>
        <input
          type="text"
          value={voucher}
          onChange={(e) => setVoucher(e.target.value)}
          placeholder={L.voucherPlaceholder}
          className="border rounded px-3 py-2 w-full"
        />
      </div>

      {/* Kontaktdaten */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-medium">{L.firstNameLabel}</label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">{L.lastNameLabel}</label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">{L.emailLabel}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded px-3 py-2 w-full break-words"
            autoComplete="off"
          />
        </div>
        <div>
          <label className="block mb-1 font-medium">{L.phoneLabel}</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border rounded px-3 py-2 w-full"
            dir="ltr"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Flugnummer – jetzt vor Reisebüro-ID */}
      <div>
        <label className="block mb-1 font-medium">{L.flightNoLabel}</label>
        <input
          type="text"
          value={flightNo}
          onChange={(e) => setFlightNo(e.target.value)}
          placeholder={L.flightNoPlaceholder}
          className="border rounded px-3 py-2 w-full break-words"
          autoComplete="off"
        />
      </div>

      {/* Reisebüro-ID – nach Flugnummer */}
      <div>
        <label className="block mb-1 font-medium">
          {L.partnerIdLabel || "Reisebüro-ID (optional)"}
        </label>
        <input
          type="text"
          value={partnerId}
          onChange={(e) => setPartnerId(e.target.value.trim().toUpperCase())}
          placeholder={L.partnerIdPlaceholder || "z. B. RB01"}
          className="border rounded px-3 py-2 w-full uppercase tracking-wider"
          dir="ltr"
          inputMode="latin"
          autoCapitalize="characters"
          maxLength={16}
          autoComplete="off"
        />
      </div>

      {/* Zahlungsarten */}
      <div>
        <label className="block mb-1 font-medium">{L.paymentTitle}</label>
        <div className="flex flex-wrap items-center gap-3">
          <button
            className={`rounded px-4 py-2 font-medium transition border-2 ${
              paymentMethod === "whish"
                ? "bg-[#002147] text-white border-[#002147]"
                : "bg-white text-[#002147] border-gray-300"
            }`}
            onClick={() => setPaymentMethod("whish")}
          >
            {L.whishBtn}
          </button>
          <button
            className={`rounded px-4 py-2 font-medium transition border-2 ${
              paymentMethod === "cash"
                ? "bg-[#002147] text-white border-[#002147]"
                : "bg-white text-[#002147] border-gray-300"
            }`}
            onClick={() => setPaymentMethod("cash")}
          >
            {L.cashBtn}
          </button>
          <button
            className={`rounded px-4 py-2 font-medium transition border-2 ${
              paymentMethod === "bank"
                ? "bg-[#002147] text-white border-[#002147]"
                : "bg-white text-[#002147] border-gray-300"
            }`}
            onClick={() => setPaymentMethod("bank")}
          >
            {L.bankBtn || "Banküberweisung"}
          </button>
        </div>
      </div>

      {/* Whish-QR/Text */}
      {paymentMethod === "whish" && (
        <div className="bg-[#f7fafc] border border-[#c0b090] rounded-xl p-4 my-4 overflow-hidden w-full max-w-full">
          <div className="mb-2 font-semibold">{L.whishInfoTitle}</div>
          <div className="mb-2 text-sm break-words [word-break:anywhere]">
            {L.whishStep1}
            <br />
            {L.whishStep2}
          </div>
          <div className="flex flex-wrap items-center gap-4 min-w-0 w-full max-w-full">
            <span
              className="text-[#002147] font-bold font-mono break-words [word-break:anywhere]"
              dir="ltr"
            >
              {L.whishStep3.replace("{number}", ltr(whatsappDisplayCondensed))}
            </span>
            <button
              className="text-xs underline text-[#C09743] font-semibold shrink-0"
              onClick={() => setShowWhishQr((v) => !v)}
            >
              {showWhishQr ? L.whishToggleToText.qr : L.whishToggleToText.text}
            </button>
          </div>
          {showWhishQr && (
            <div className="mt-4 flex flex-col items-center">
              <img
                src={WHISH_QR_SRC}
                alt="Whish QR"
                className="rounded-lg border bg-white"
                style={{ width: 120, height: 120, objectFit: "contain" }}
              />
              <div
                className="text-xs mt-2 text-gray-500 font-mono text-center break-words [word-break:anywhere]"
                dir="ltr"
              >
                {L.whishStep3.replace("{number}", ltr(whatsappDisplayCondensed))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Banküberweisung Details */}
      {paymentMethod === "bank" && (
        <div className="bg-[#f7fafc] border border-[#c0b090] rounded-xl p-4 my-4 space-y-2 overflow-hidden">
          <div className="font-semibold">
            {L.bankInfoTitle || "Bankdaten für Überweisung"}
          </div>
          <div className="grid md:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="font-medium">
                {L.accountName || "Kontoinhaber"}:
              </span>{" "}
              {BANK.accountName}
            </div>
            <div>
              <span className="font-medium">{L.bankName || "Bank"}:</span>{" "}
              {BANK.bankName}
            </div>

            {/* IBAN */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-medium shrink-0">
                {L.iban || "IBAN"}:
              </span>
              <span
                className="font-mono overflow-x-auto block md:[letter-spacing:0.02em]"
                dir="ltr"
                translate="no"
                title={BANK.ibanRaw}
              >
                {BANK.ibanRaw}
              </span>
              <button
                className="text-xs underline text-[#C09743] shrink-0"
                onClick={() => copy(BANK.ibanRaw, "iban")}
              >
                {copied === "iban" ? L.copied || "Kopiert!" : L.copy || "Kopieren"}
              </button>
            </div>

            {/* BIC */}
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-medium shrink-0">{L.bic || "BIC"}:</span>
              <span
                className="font-mono overflow-x-auto block"
                dir="ltr"
                translate="no"
                title={BANK.bic}
              >
                {BANK.bic}
              </span>
              <button
                className="text-xs underline text-[#C09743] shrink-0"
                onClick={() => copy(BANK.bic, "bic")}
              >
                {copied === "bic" ? L.copied || "Kopiert!" : L.copy || "Kopieren"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="mt-6 flex flex-col sm:flex-row justify-between gap-4 items-stretch">
        <button onClick={onBack} className="btn btn-secondary sm:order-1">
          {L.backBtn}
        </button>

        {/* Aktionen: WhatsApp, Email, Call */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1 sm:order-2">
          {/* 1) WhatsApp */}
          <a
            href={whatsappLink}
            className="btn btn-primary flex items-center justify-center flex-1"
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={canSubmit ? 0 : -1}
            aria-disabled={!canSubmit}
          >
            <FaWhatsapp className="mr-2" />
            {L.whatsappBtn}
          </a>

          {/* 2) Email */}
          <a
            href={mailtoLink}
            className="btn btn-primary flex items-center justify-center flex-1"
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={canSubmit ? 0 : -1}
            aria-disabled={!canSubmit}
          >
            <EnvelopeIcon className="w-5 h-5 mr-2" />
            {L.emailBtn}
          </a>

          {/* 3) Jetzt anrufen */}
          <a
            href={`tel:${whatsappFull}`}
            className="btn btn-primary flex items-center justify-center flex-1"
          >
            <FaMobileAlt className="mr-2" />
            {L.callNowBtn}
          </a>
        </div>
      </div>
    </div>
  );
}
