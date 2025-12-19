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
  bankName: "Byblos Bank S.A.L.",
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

/* ===================== */
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
  partnerId: _ignored,
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
  const [paymentMethod, setPaymentMethod] = useState("whish");
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

    const referral = getReferralCode();

    let lines = [
      L.emailGreeting,
      `${L.firstNameLabel}: ${firstName} ${lastName}`,
      `${L.emailLabel}: ${email}`,
      `${L.phoneLabel}: ${phone}`,
      ...(referral ? [`Ref: ${referral}`] : []),
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

  /* ===================== Premium tokens (nur Styles) ===================== */
  const ACCENT = "#1f6f3a";
  const ACCENT_SOFT = "rgba(31,111,58,.10)";
  const ACCENT_BORDER = "rgba(31,111,58,.20)";
  const HEADING = "#0b1f3a";
  const TEXT = "rgba(17,24,39,.74)";
  const BORDER = "rgba(17,24,39,.10)";
  const SHADOW = "0 20px 52px rgba(15,23,42,.12)";
  const BOX_SHADOW = "0 14px 34px rgba(15,23,42,.08)";
  const RADIUS = 24;

  const Section = ({ icon, title, children, tone = "white" }) => {
    const bg =
      tone === "white"
        ? "#fff"
        : tone === "warm"
        ? "linear-gradient(180deg, rgba(192,151,67,.10) 0%, rgba(255,255,255,1) 65%)"
        : "linear-gradient(180deg, rgba(31,111,58,.06) 0%, rgba(255,255,255,1) 60%)";

    return (
      <div
        className="relative overflow-hidden"
        style={{
          borderRadius: 18,
          border: `1px solid ${BORDER}`,
          background: bg,
          boxShadow: BOX_SHADOW,
        }}
      >
        {/* left accent stripe */}
        <div
          aria-hidden="true"
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 4,
            background: `linear-gradient(180deg, ${ACCENT} 0%, rgba(31,111,58,.35) 60%, rgba(31,111,58,.10) 100%)`,
          }}
        />
        <div style={{ padding: "1.1rem 1.1rem 1.15rem 1.45rem" }}>
          <div className="flex items-center font-extrabold mb-2" style={{ color: HEADING }}>
            <span className="mr-2" style={{ color: "#C09743" }}>{icon}</span>
            {title}
          </div>
          <div
            aria-hidden="true"
            style={{ height: 1, background: "rgba(17,24,39,.08)", marginBottom: ".75rem" }}
          />
          {children}
        </div>
      </div>
    );
  };

  /* ===================== Render ===================== */
  return (
    <div
      className="p-6 space-y-6 w-full mx-auto max-w-[680px] sm:max-w-[720px] box-border overflow-hidden bg-white"
      style={{
        borderRadius: RADIUS,
        border: `1px solid ${BORDER}`,
        boxShadow: SHADOW,
      }}
    >
      {/* WARENKORB / BUCHUNGS-ÜBERSICHT */}
      <div className="space-y-4">
        {/* Hin- und Rückfahrt Übersicht */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Hinfahrt */}
          <Section
            icon={<FaCar className="w-5 h-5" />}
            title={L.outwardTripTitle || "Hinfahrt"}
            tone="green"
          >
            <div className="flex flex-col gap-1" style={{ color: "rgba(17,24,39,.86)" }}>
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
                <CheckCircleIcon className="w-4 h-4 mr-1 shrink-0" style={{ color: ACCENT }} />
                <span className="truncate">
                  {L["vehicle" + vehicle[0].toUpperCase() + vehicle.slice(1)] ||
                    vehicle}
                </span>
              </div>
            </div>
          </Section>

          {/* Rückfahrt */}
          {isReturn && (
            <Section
              icon={<FaCar className="w-5 h-5" />}
              title={L.returnTripLabel}
              tone="green"
            >
              <div className="flex flex-col gap-1" style={{ color: "rgba(17,24,39,.86)" }}>
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
                  <CheckCircleIcon className="w-4 h-4 mr-1 shrink-0" style={{ color: ACCENT }} />
                  <span className="truncate">
                    {L[
                      "vehicle" +
                        returnVehicle[0].toUpperCase() +
                        returnVehicle.slice(1)
                    ] || returnVehicle}
                  </span>
                </div>
              </div>
            </Section>
          )}
        </div>

        {/* Passagiere & Fahrzeug */}
        <Section
          icon={<UsersIcon className="w-5 h-5" />}
          title={L.passengersVehicleTitle || "Passagiere & Fahrzeug"}
          tone="white"
        >
          <div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-2">
            <div className="flex items-center gap-2">
              <UsersIcon className="w-5 h-5" style={{ color: "#C09743" }} />
              <span className="font-semibold" style={{ color: HEADING }}>
                {adults} {L.adultsLabel}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <UserIcon className="w-5 h-5" style={{ color: "#C09743" }} />
              <span className="font-semibold" style={{ color: HEADING }}>
                {children} {L.childrenLabel}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FaCar className="w-5 h-5" style={{ color: "#C09743" }} />
              <span className="font-semibold" style={{ color: HEADING }}>
                {L["vehicle" + vehicle[0].toUpperCase() + vehicle.slice(1)] ||
                  vehicle}
              </span>
            </div>
          </div>
        </Section>

        {/* Extras */}
        {(renderSeatExtras(seatExtrasDetails).length > 0 ||
          renderOtherExtras(otherExtrasDetails).length > 0) && (
          <Section icon={<GiftIcon className="w-5 h-5" />} title={L.extrasStepTitle} tone="green">
            <ul className="ml-5 space-y-1" style={{ color: "rgba(17,24,39,.86)", listStyleType: "disc" }}>
              {renderSeatExtras(seatExtrasDetails).map((x, i) => (
                <li key={"seat" + i} style={{ markerColor: ACCENT }}>
                  <span>{x}</span>
                </li>
              ))}
              {renderOtherExtras(otherExtrasDetails).map((x, i) => (
                <li key={"extra" + i}>
                  <span>{x}</span>
                </li>
              ))}
            </ul>
            <div className="font-extrabold mt-3" style={{ color: HEADING }}>
              {L.extrasTotalLabel}: $
              {calcExtrasTotal(seatExtrasDetails, otherExtrasDetails).toFixed(2)}
            </div>
          </Section>
        )}

        {/* Preisübersicht */}
        <Section
          icon={<CreditCardIcon className="w-5 h-5" />}
          title={L.priceOverviewTitle || "Preisübersicht"}
          tone="warm"
        >
          <div className="space-y-1" style={{ color: "rgba(17,24,39,.86)" }}>
            <div className="flex justify-between">
              <span style={{ color: TEXT }}>{L.ridePriceLabel}:</span>
              <span className="font-semibold">${ridePrice?.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: TEXT }}>{L.vehicleSurchargeLabel}:</span>
              <span className="font-semibold">${vehicleSurcharge?.toFixed(2)}</span>
            </div>
            {isReturn && (
              <div className="flex justify-between">
                <span style={{ color: TEXT }}>{L.returnDiscountLabel}:</span>
                <span className="font-semibold" style={{ color: ACCENT }}>
                  -${Math.abs(returnDiscount).toFixed(2)}
                </span>
              </div>
            )}
            {voucherDiscount > 0 && (
              <div className="flex justify-between">
                <span style={{ color: TEXT }}>{L.voucherLabel}:</span>
                <span className="font-semibold" style={{ color: ACCENT }}>
                  -${voucherDiscount.toFixed(2)}
                </span>
              </div>
            )}
            <div className="flex justify-between">
              <span style={{ color: TEXT }}>{L.extrasTotalLabel}:</span>
              <span className="font-semibold">
                $
                {calcExtrasTotal(seatExtrasDetails, otherExtrasDetails).toFixed(2)}
              </span>
            </div>

            <div
              className="pt-3 mt-2 flex justify-between text-lg font-extrabold"
              style={{ borderTop: "1px solid rgba(17,24,39,.10)", color: HEADING }}
            >
              <span>{L.totalLabel}:</span> <span>${totalPrice}</span>
            </div>
          </div>
        </Section>
      </div>

      {/* Gutschein */}
      <div>
        <label className="block mb-1 font-semibold" style={{ color: HEADING }}>
          {L.voucherLabel}
        </label>
        <input
          type="text"
          value={voucher}
          onChange={(e) => setVoucher(e.target.value)}
          placeholder={L.voucherPlaceholder}
          className="border rounded-xl px-3 py-2 w-full"
          style={{
            borderColor: BORDER,
            boxShadow: "0 10px 22px rgba(15,23,42,.04)",
          }}
        />
      </div>

      {/* Kontaktdaten */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block mb-1 font-semibold" style={{ color: HEADING }}>
            {L.firstNameLabel}
          </label>
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="border rounded-xl px-3 py-2 w-full"
            style={{ borderColor: BORDER }}
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold" style={{ color: HEADING }}>
            {L.lastNameLabel}
          </label>
          <input
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="border rounded-xl px-3 py-2 w-full"
            style={{ borderColor: BORDER }}
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold" style={{ color: HEADING }}>
            {L.emailLabel}
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border rounded-xl px-3 py-2 w-full break-words"
            style={{ borderColor: BORDER }}
            autoComplete="off"
          />
        </div>
        <div>
          <label className="block mb-1 font-semibold" style={{ color: HEADING }}>
            {L.phoneLabel}
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="border rounded-xl px-3 py-2 w-full"
            style={{ borderColor: BORDER }}
            dir="ltr"
            autoComplete="off"
          />
        </div>
      </div>

      {/* Flugnummer – jetzt vor Reisebüro-ID */}
      <div>
        <label className="block mb-1 font-semibold" style={{ color: HEADING }}>
          {L.flightNoLabel}
        </label>
        <input
          type="text"
          value={flightNo}
          onChange={(e) => setFlightNo(e.target.value)}
          placeholder={L.flightNoPlaceholder}
          className="border rounded-xl px-3 py-2 w-full break-words"
          style={{ borderColor: BORDER }}
          autoComplete="off"
        />
      </div>

      {/* Reisebüro-ID – nach Flugnummer */}
      <div>
        <label className="block mb-1 font-semibold" style={{ color: HEADING }}>
          {L.partnerIdLabel || "Reisebüro-ID (optional)"}
        </label>
        <input
          type="text"
          value={partnerId}
          onChange={(e) => setPartnerId(e.target.value.trim().toUpperCase())}
          placeholder={L.partnerIdPlaceholder || "z. B. RB01"}
          className="border rounded-xl px-3 py-2 w-full uppercase tracking-wider"
          style={{ borderColor: BORDER }}
          dir="ltr"
          inputMode="latin"
          autoCapitalize="characters"
          maxLength={16}
          autoComplete="off"
        />
      </div>

      {/* Zahlungsarten */}
<div>
  <label className="block mb-2 font-semibold" style={{ color: HEADING }}>
    {L.paymentTitle}
  </label>

  <div className="flex flex-wrap items-center gap-2">
    {[
      { key: "whish", label: L.whishBtn },
      { key: "cash", label: L.cashBtn },
      { key: "bank", label: L.bankBtn || "Banküberweisung" },
    ].map((m) => {
      const active = paymentMethod === m.key;

      return (
        <button
          key={m.key}
          type="button"
          onClick={() => setPaymentMethod(m.key)}
          className="px-3 py-2 rounded-xl border font-semibold transition
                     focus:outline-none focus-visible:outline-none focus:ring-0 focus-visible:ring-0"
          style={{
            background: active ? "var(--amd-primary,#c1272d)" : "#fff",
            color: active ? "#fff" : HEADING,
            borderColor: active ? "rgba(193,39,45,.55)" : BORDER,
            boxShadow: active
              ? "0 10px 22px rgba(193,39,45,.14)"
              : "none",
            outline: "none",
            WebkitTapHighlightColor: "transparent",
          }}
          onMouseEnter={(e) => {
            if (active) return;
            e.currentTarget.style.borderColor = ACCENT_BORDER;
            e.currentTarget.style.boxShadow = `0 0 0 6px ${ACCENT_SOFT}`;
          }}
          onMouseLeave={(e) => {
            if (active) return;
            e.currentTarget.style.borderColor = BORDER;
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          {m.label}
        </button>
      );
    })}
  </div>
</div>

      {/* Buttons (mobile-first, kompakt) */}
      <div className="mt-6">
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 items-stretch">
          {/* Zurück */}
          <button
            onClick={onBack}
            type="button"
            className="col-span-2 sm:col-auto border rounded-xl font-semibold transition"
            style={{
              borderColor: BORDER,
              background: "#fff",
              color: HEADING,
              padding: "12px 14px",
              fontSize: 14,
              boxShadow: "0 12px 24px rgba(15,23,42,.06)",
            }}
          >
            {L.backBtn}
          </button>

          {/* WhatsApp */}
          <a
            href={whatsappLink}
            className="col-span-1 sm:flex-1 rounded-xl font-semibold transition inline-flex items-center justify-center"
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={canSubmit ? 0 : -1}
            aria-disabled={!canSubmit}
            style={{
              background: "var(--amd-primary,#c1272d)",
              color: "#fff",
              padding: "12px 14px",
              fontSize: 14,
              opacity: canSubmit ? 1 : 0.55,
              pointerEvents: canSubmit ? "auto" : "none",
              boxShadow: "0 14px 30px rgba(193,39,45,.18)",
            }}
          >
            <FaWhatsapp className="mr-2" />
            {L.whatsappBtn}
          </a>

          {/* Email */}
          <a
            href={mailtoLink}
            className="col-span-1 sm:flex-1 rounded-xl font-semibold transition inline-flex items-center justify-center"
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={canSubmit ? 0 : -1}
            aria-disabled={!canSubmit}
            style={{
              background: "var(--amd-primary,#c1272d)",
              color: "#fff",
              padding: "12px 14px",
              fontSize: 14,
              opacity: canSubmit ? 1 : 0.55,
              pointerEvents: canSubmit ? "auto" : "none",
              boxShadow: "0 14px 30px rgba(193,39,45,.18)",
            }}
          >
            <EnvelopeIcon className="w-5 h-5 mr-2" />
            {L.emailBtn}
          </a>

          {/* Jetzt anrufen */}
          <a
            href={`tel:${whatsappFull}`}
            className="col-span-2 sm:flex-1 rounded-xl font-semibold transition inline-flex items-center justify-center"
            style={{
              background: "var(--amd-primary,#c1272d)",
              color: "#fff",
              padding: "12px 14px",
              fontSize: 14,
              boxShadow: "0 14px 30px rgba(193,39,45,.18)",
            }}
          >
            <FaMobileAlt className="mr-2" />
            {L.callNowBtn}
          </a>
        </div>
      </div>
    </div>
  );
}
