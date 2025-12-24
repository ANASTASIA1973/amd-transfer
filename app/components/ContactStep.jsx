// app/components/ContactStep.jsx
"use client";

import React, { useEffect, useMemo, useState } from "react";
import t from "../i18n/translations";
import { useLocale } from "../context/LocaleContext";

import {
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  ClockIcon,
  GiftIcon,
  CreditCardIcon,
  CheckCircleIcon,
  TicketIcon,
  EnvelopeIcon,
} from "@heroicons/react/24/outline";

import { FaCar, FaMobileAlt, FaWhatsapp, FaUser, FaChild } from "react-icons/fa";

/* ===================== Helpers ===================== */
function formatDurationText(duration, L, locale) {
  if (!duration) return "";

  let hours = 0;
  let minutes = 0;

  const hourMatch = String(duration).match(
    /(\d+)\s*(Stunde|Stunden|hour|hours|hr|hrs|ساعة|ساعات)/i
  );
  if (hourMatch) hours = parseInt(hourMatch[1], 10);

  const minMatch = String(duration).match(
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

  if (parts.length === 0 && minMatch) {
    parts.push(
      minutes + " " + (minutes === 1 ? L.minuteSingular : L.minutePlural)
    );
  }

  return parts.join(", ");
}

const ltr = (s) => `\u2066${s}\u2069`;

// Extras-Preise (in $) — Keys müssen exakt bleiben
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

const FIXED_VOUCHER_CODE = "AMD2026";

/* Referral-Code lesen (mobil/desktop tauglich) */
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

/* ✅ Robust: Vehicle label ohne [0].toUpperCase-Crash */
function getVehicleLabel(v, L) {
  const val = (v ?? "").toString().trim();
  if (!val) return L?.notSelected || "—";

  const key = "vehicle" + val.charAt(0).toUpperCase() + val.slice(1);
  return L && L[key] ? L[key] : val;
}

/* ===== Validation (pragmatisch) ===== */
const isValidEmail = (val) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(val || "").trim());
const onlyDigits = (val) => String(val || "").replace(/\D/g, "");
const isValidPhone = (val) => {
  const d = onlyDigits(val);
  return d.length >= 7; // wie in deiner Datei (funktioniert „locker“ auf Mobile)
};

const round2 = (n) => Math.round((Number(n || 0) + Number.EPSILON) * 100) / 100;

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
  voucherDiscount, // bleibt als Prop drin, wird aber für Anzeige „tour-only“ überschrieben
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
  totalBeforeVoucher, // bleibt drin
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

  // ✅ Gutschein fest setzen (nur einmal) + nicht editierbar
  useEffect(() => {
    if (typeof setVoucher === "function" && String(voucher || "").trim() !== FIXED_VOUCHER_CODE) {
      setVoucher(FIXED_VOUCHER_CODE);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* ---------- Extras ---------- */
function renderSeatExtras(seatDetails) {
  const list = Array.isArray(seatDetails) ? seatDetails : [];
  if (!list.length) return [];

  return list
    .map(({ key, count, unit }) => ({ key, count, unit }))
    .filter(({ count }) => Number(count) > 0)
    .sort((a, b) => (a.unit || 0) - (b.unit || 0))
    .map(({ key, count, unit }) => {
      const qty = Number(count) || 0;
      const u = Number(unit) || 0;
      const label = L[seatLabelMap[key]] || key;
      const total = qty * u;
      return { label, qty, total };
    });
}

  function renderOtherExtras(details) {
  const list = Array.isArray(details) ? details : [];
  return list
    .filter(({ count }) => Number(count) > 0)
    .map(({ key, count }) => {
      const qty = Number(count) || 0;
      const label = L[key] || key;
      const price = Number(priceMap[key] || 0);
      const total = qty * price;
      return { label, qty, total };
    });
}


  function calcExtrasTotal(seatDetails, otherDetails) {
    const seatList = Array.isArray(seatDetails) ? seatDetails : [];
    const otherList = Array.isArray(otherDetails) ? otherDetails : [];

    const seatSum = seatList.reduce((sum, { count, unit }) => {
      const c = Number(count) || 0;
      const u = Number(unit) || 0;
      return sum + c * u;
    }, 0);

    const otherSum = otherList.reduce((sum, { key, count }) => {
      const c = Number(count) || 0;
      const price = Number(priceMap[key] || 0);
      return sum + price * c;
    }, 0);

    return seatSum + otherSum;
  }

  const extrasTotal = useMemo(
    () => round2(calcExtrasTotal(seatExtrasDetails, otherExtrasDetails)),
    [seatExtrasDetails, otherExtrasDetails]
  );

  /* ---------- ✅ Rabatt nur auf Tour (ohne Extras) ---------- */
  const tourBase = useMemo(() => {
    const base =
      Number(ridePrice || 0) +
      Number(vehicleSurcharge || 0) -
      (isReturn ? Math.abs(Number(returnDiscount || 0)) : 0);
    return round2(Math.max(0, base));
  }, [ridePrice, vehicleSurcharge, isReturn, returnDiscount]);

  const voucherIsActive = String(voucher || "").trim().toUpperCase() === FIXED_VOUCHER_CODE;

  // 10% nur auf tourBase (ohne Extras)
  const tourOnlyVoucherDiscount = useMemo(() => {
    if (!voucherIsActive) return 0;
    return round2(tourBase * 0.10);
  }, [voucherIsActive, tourBase]);

  // Anzeige: wenn Prop „voucherDiscount“ abweicht, zeig trotzdem tour-only (damit UI stimmt)
  const displayVoucherDiscount = voucherIsActive ? tourOnlyVoucherDiscount : 0;

  /* ---------- Validation ---------- */
  const emailOk = isValidEmail(email);
  const phoneOk = isValidPhone(phone);
  const canSubmit = Boolean(firstName && lastName && emailOk && phoneOk);

  const copy = async (text, which) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(which);
      setTimeout(() => setCopied(""), 1200);
    } catch {
      // ignore
    }
  };

  /* ---------- Mail/WA-Text (nutzt tour-only Rabatt) ---------- */
  function buildBookingText() {
    const partnerLabel = (L.partnerIdLabel || "Partner ID").replace(/\s*\(.*\)/, "");
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
      `${L.vehicleLabel}: ${getVehicleLabel(vehicle, L)}`,
      `${L.pickupLabel}: ${orig}`,
      `${L.destinationLabel}: ${dest}`,
      `${L.dateTimeLabel}: ${fmt(dateTime)}`,
      `${L.ridePriceLabel}: $${Number(ridePrice || 0).toFixed(2)}`,
      `${L.vehicleSurchargeLabel}: $${Number(vehicleSurcharge || 0).toFixed(2)}`,
      `${
        L.streckeLabel
          ? L.streckeLabel.replace("{km}", distance?.toFixed?.(1) || "")
          : (L.distanceLabel || "").replace("{km}", distance?.toFixed?.(1) || "")
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
        `${L.vehicleLabel}: ${getVehicleLabel(returnVehicle, L)}`,
        `${L.pickupLabel}: ${returnOrig}`,
        `${L.destinationLabel}: ${returnDest}`,
        `${L.returnDateTimeLabel}: ${fmt(returnDateTime)}`,
        `${
          L.streckeLabel
            ? L.streckeLabel.replace("{km}", returnDistance?.toFixed?.(1) || "")
            : (L.distanceLabel || "").replace("{km}", returnDistance?.toFixed?.(1) || "")
        }`,
        `${L.durationLabel}: ${formatDurationText(returnDuration, L, locale)}`,
      ]);
    }

    const seatList = renderSeatExtras(seatExtrasDetails);
    const otherList = renderOtherExtras(otherExtrasDetails);

    if (seatList.length || otherList.length) {
      lines.push("", (L.extrasStepTitle || "Extras") + ":");
     seatList.forEach((x) => lines.push(`- ${x.label} x${x.qty}: $${Number(x.total).toFixed(2)}`));
otherList.forEach((x) => lines.push(`- ${x.label} x${x.qty}: $${Number(x.total).toFixed(2)}`));

      lines.push(`${L.extrasTotalLabel}: $${extrasTotal.toFixed(2)}`);
    }

    if (isReturn) {
      lines.push(`${L.returnDiscountLabel}: -$${Math.abs(Number(returnDiscount || 0)).toFixed(2)}`);
    }

    if (displayVoucherDiscount > 0) {
      lines.push(`${L.voucherLabel}: -$${displayVoucherDiscount.toFixed(2)} (${L?.voucherTourOnlyNote || "nur Tour"})`);
    }

    lines.push(`${L.totalLabel}: $${totalPrice}`);
    return lines.join("\n");
  }

  const body = encodeURIComponent(buildBookingText());
  const subject = L.emailSubject || "Booking request";
  const mailtoLink = `mailto:${firmEmail}?subject=${encodeURIComponent(subject)}&body=${body}`;
  const whatsappLink = `https://wa.me/${whatsappFull.replace(/\D/g, "")}?text=${body}`;

  /* ===================== Styles (wie in deiner Datei) ===================== */
  const ACCENT = "#1f6f3a";
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
            <span className="mr-2" style={{ color: HEADING }}>{icon}</span>
            {title}
          </div>
          <div aria-hidden="true" style={{ height: 1, background: "rgba(17,24,39,.08)", marginBottom: ".75rem" }} />
          {children}
        </div>
      </div>
    );
  };

  return (
    <div
      className="p-6 space-y-6 w-full mx-auto max-w-[680px] sm:max-w-[720px] box-border overflow-hidden bg-white"
      style={{ borderRadius: RADIUS, border: `1px solid ${BORDER}`, boxShadow: SHADOW }}
    >
      {/* ÜBERSICHT */}
      <div className="space-y-4">
        <div className="grid md:grid-cols-2 gap-4">
          <Section icon={<FaCar className="w-5 h-5" />} title={L.outwardTripTitle || "Hinfahrt"} tone="green">
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
                <span className="truncate">{formatDurationText(duration, L, locale)}</span>
              </div>
              <div className="flex items-center min-w-0">
                <span className="w-4 h-4 mr-1 shrink-0">📏</span>
                <span className="truncate">
                  {(L.streckeLabel ? L.streckeLabel : L.distanceLabel || "").replace("{km}", distance?.toFixed?.(1) || "")}
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
                <span className="truncate">{getVehicleLabel(vehicle, L)}</span>
              </div>
            </div>
          </Section>

          {isReturn && (
            <Section icon={<FaCar className="w-5 h-5" />} title={L.returnTripLabel} tone="green">
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
                  <span className="truncate">{formatDurationText(returnDuration, L, locale)}</span>
                </div>
                <div className="flex items-center min-w-0">
                  <span className="w-4 h-4 mr-1 shrink-0">📏</span>
                  <span className="truncate">
                    {(L.streckeLabel ? L.streckeLabel : L.distanceLabel || "").replace(
                      "{km}",
                      returnDistance?.toFixed?.(1) || ""
                    )}
                  </span>
                </div>
                <div className="flex items-center min-w-0">
                  <CheckCircleIcon className="w-4 h-4 mr-1 shrink-0" style={{ color: ACCENT }} />
                  <span className="truncate">{getVehicleLabel(returnVehicle, L)}</span>
                </div>
              </div>
            </Section>
          )}
        </div>

        {/* Passagiere & Fahrzeug */}
        {(() => {
          const IconBadge = ({ children: ch }) => (
            <span
              className="inline-flex items-center justify-center w-9 h-9 rounded-xl border ios-fix shrink-0"
              style={{
                background: "rgba(0,33,71,.03)",
                borderColor: "rgba(17,24,39,.10)",
                color: "rgba(11,31,58,.95)",
                boxShadow: "inset 0 0 0 1px rgba(17,24,39,.06)",
              }}
              aria-hidden="true"
            >
              <span className="text-[18px] leading-none">{ch}</span>
            </span>
          );

          return (
            <Section icon={<UsersIcon className="w-5 h-5" style={{ color: HEADING }} />} title={L.passengersVehicleTitle || "Passagiere & Fahrzeug"} tone="white">
              <div className="flex flex-col md:flex-row md:items-center md:gap-8 gap-3">
                <div className="flex items-center gap-3">
                  <IconBadge><FaUser /></IconBadge>
                  <span className="font-semibold" style={{ color: HEADING }}>
                    {adults} {L.adultsLabel}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <IconBadge><FaChild /></IconBadge>
                  <span className="font-semibold" style={{ color: HEADING }}>
                    {children} {L.childrenLabel}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <IconBadge><FaCar /></IconBadge>
                  <span className="font-semibold" style={{ color: HEADING }}>
                    {getVehicleLabel(vehicle, L)}
                  </span>
                </div>
              </div>
            </Section>
          );
        })()}

  {/* Extras */}
{(renderSeatExtras(seatExtrasDetails).length > 0 ||
  renderOtherExtras(otherExtrasDetails).length > 0) && (
  <Section
    icon={<GiftIcon className="w-5 h-5" />}
    title={L.extrasStepTitle || "Weitere Extras"}
    tone="green"
  >
    <ul className="mt-1 space-y-2" style={{ color: "rgba(17,24,39,.86)" }}>
      {[
        ...renderSeatExtras(seatExtrasDetails),
        ...renderOtherExtras(otherExtrasDetails),
      ].map((it, i) => (
        <li key={i} className="flex items-center justify-between gap-3">
          <div className="min-w-0 flex items-center gap-2">
            <span
              className="truncate font-semibold"
              style={{ color: "rgba(11,31,58,.95)" }}
            >
              {it.label}
            </span>

            <span
              className="shrink-0 w-6 h-6 rounded-full text-xs font-extrabold inline-flex items-center justify-center"
              style={{
                border: "1px solid rgba(17,24,39,.14)",
                background: "rgba(17,24,39,.04)",
                color: "rgba(17,24,39,.70)",
              }}
            >
              {it.qty}
            </span>
          </div>

          <span
            className="shrink-0 tabular-nums font-semibold"
            style={{ color: "rgba(11,31,58,.95)" }}
          >
            ${Number(it.total || 0).toFixed(2)}
          </span>
        </li>
      ))}
    </ul>

    <div className="font-extrabold mt-3" style={{ color: HEADING }}>
      {L.extrasTotalLabel || "Extras gesamt"}: ${extrasTotal.toFixed(2)}
    </div>
  </Section>
)}


        {/* Preisübersicht */}
        <Section icon={<CreditCardIcon className="w-5 h-5" />} title={L.priceOverviewTitle || "Preisübersicht"} tone="warm">
          <div className="space-y-1" style={{ color: "rgba(17,24,39,.86)" }}>
            <div className="flex justify-between">
              <span style={{ color: TEXT }}>{L.ridePriceLabel}:</span>
              <span className="font-semibold">${Number(ridePrice || 0).toFixed(2)}</span>
            </div>

            <div className="flex justify-between">
              <span style={{ color: TEXT }}>{L.vehicleSurchargeLabel}:</span>
              <span className="font-semibold">${Number(vehicleSurcharge || 0).toFixed(2)}</span>
            </div>

            {isReturn && (
              <div className="flex justify-between">
                <span style={{ color: TEXT }}>{L.returnDiscountLabel}:</span>
                <span className="font-semibold" style={{ color: ACCENT }}>
                  -${Math.abs(Number(returnDiscount || 0)).toFixed(2)}
                </span>
              </div>
            )}

            {displayVoucherDiscount > 0 && (
              <div className="flex justify-between">
                <span style={{ color: TEXT }}>{L.voucherLabel}:</span>
              <span
  className="font-semibold"
  style={{
    color: ACCENT,
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    lineHeight: 1.15,
  }}
>
  <span>-${displayVoucherDiscount.toFixed(2)}</span>
</span>

              </div>
            )}

            <div className="flex justify-between">
              <span style={{ color: TEXT }}>{L.extrasTotalLabel}:</span>
              <span className="font-semibold">${extrasTotal.toFixed(2)}</span>
            </div>

            <div
              className="pt-3 mt-2 flex justify-between text-lg font-extrabold"
              style={{ borderTop: "1px solid rgba(17,24,39,.10)", color: HEADING }}
            >
              <span>{L.totalLabel}:</span>
              <span>${totalPrice}</span>
            </div>
          </div>
        </Section>
      </div>

      {/* ✅ Gutschein (grau + gesperrt) */}
      <div>
        <label className="block mb-1 font-semibold" style={{ color: HEADING }}>
          {L.voucherLabel}
        </label>

        <input
          type="text"
          value={FIXED_VOUCHER_CODE}
          readOnly
          disabled
          className="border rounded-xl px-3 py-2 w-full"
          style={{
            borderColor: BORDER,
            background: "rgba(17,24,39,.06)",
            color: "rgba(17,24,39,.65)",
            cursor: "not-allowed",
            boxShadow: "0 10px 22px rgba(15,23,42,.04)",
          }}
        />
         {voucherIsActive && (
  <div className="mt-0 text-xs" style={{ color: "rgba(17,24,39,.55)" }}>
    {L.voucherTourOnlyHelper || "Gutschein-Rabatt gilt nur für die Fahrt (ohne Extras)."}
  </div>
)}
      </div>




      {/* Kontaktdaten (so wie deine Datei -> iPhone klickt sauber) */}
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
            autoComplete="given-name"
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
            autoComplete="family-name"
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
            style={{ borderColor: email && !emailOk ? "rgba(220,38,38,.55)" : BORDER }}
            autoComplete="email"
            inputMode="email"
          />
          {email && !emailOk ? (
            <div className="mt-1 text-xs" style={{ color: "rgba(220,38,38,.92)" }}>
              {L.invalidEmail}
            </div>
          ) : null}
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
            style={{ borderColor: phone && !phoneOk ? "rgba(220,38,38,.55)" : BORDER }}
            dir="ltr"
            inputMode="tel"
            autoComplete="tel"
          />
          {phone && !phoneOk ? (
            <div className="mt-1 text-xs" style={{ color: "rgba(220,38,38,.92)" }}>
              {L.invalidPhone}
            </div>
          ) : null}
        </div>
      </div>

      {/* Flugnummer */}
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

      {/* Reisebüro-ID */}
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
                className="px-3 py-2 rounded-xl border font-semibold transition"
                style={{
                  background: active ? "var(--amd-primary,#c1272d)" : "#fff",
                  color: active ? "#fff" : HEADING,
                  borderColor: active ? "rgba(193,39,45,.55)" : BORDER,
                }}
              >
                {m.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Whish-Details */}
      {paymentMethod === "whish" && (
        <div
          className="rounded-2xl p-4 sm:p-5 my-4 overflow-hidden w-full max-w-full"
          style={{
            border: "1px solid rgba(31,111,58,.28)",
            background: "linear-gradient(180deg, rgba(31,111,58,.08) 0%, rgba(255,255,255,1) 62%)",
            boxShadow: "0 14px 34px rgba(15,23,42,.08)",
          }}
        >
          <div className="mb-2 font-semibold" style={{ color: "#0b1f3a" }}>
            {L.whishInfoTitle}
          </div>

          <div className="mb-2 text-sm break-words [word-break:anywhere]" style={{ color: "rgba(17,24,39,.80)" }}>
            {L.whishStep1}
            <br />
            {L.whishStep2}
          </div>

          <div className="flex flex-wrap items-center gap-4 min-w-0 w-full max-w-full">
            <span className="font-bold font-mono break-words [word-break:anywhere]" dir="ltr" style={{ color: "#0b1f3a" }}>
              {L.whishStep3.replace("{number}", ltr(whatsappDisplayCondensed))}
            </span>

            <button
              type="button"
              className="text-xs font-semibold shrink-0 rounded-lg px-2 py-1"
              onClick={() => setShowWhishQr((v) => !v)}
              style={{
                border: "1px solid rgba(31,111,58,.22)",
                color: "rgba(31,111,58,.95)",
                background: "rgba(31,111,58,.08)",
              }}
            >
              {showWhishQr
                ? (L.whishToggleToText?.qr || "Einfacher Modus")
                : (L.whishToggleToText?.text || "QR-Code anzeigen")}
            </button>
          </div>

          {showWhishQr && (
            <div className="mt-4 flex flex-col items-center">
              <div
                style={{
                  borderRadius: 16,
                  border: "1px solid rgba(31,111,58,.22)",
                  background: "#fff",
                  padding: 10,
                  boxShadow: "0 10px 24px rgba(15,23,42,.08)",
                }}
              >
                <img src={WHISH_QR_SRC} alt="Whish QR" style={{ width: 130, height: 130, objectFit: "contain" }} />
              </div>

              <div
                className="text-xs mt-2 font-mono text-center break-words [word-break:anywhere]"
                dir="ltr"
                style={{ color: "rgba(17,24,39,.58)" }}
              >
                {L.whishStep3.replace("{number}", ltr(whatsappDisplayCondensed))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bank-Details */}
      {paymentMethod === "bank" && (
        <div
          className="rounded-2xl p-4 sm:p-5 my-4 space-y-2 overflow-hidden"
          style={{
            border: "1px solid rgba(31,111,58,.28)",
            background: "linear-gradient(180deg, rgba(31,111,58,.06) 0%, rgba(255,255,255,1) 70%)",
            boxShadow: "0 14px 34px rgba(15,23,42,.08)",
          }}
        >
          <div className="font-semibold" style={{ color: "#0b1f3a" }}>
            {L.bankInfoTitle || "Bankdaten für Überweisung"}
          </div>

          <div className="grid md:grid-cols-2 gap-3 text-sm" style={{ color: "rgba(17,24,39,.82)" }}>
            <div>
              <span className="font-medium">{L.accountName || "Kontoinhaber"}:</span> {BANK.accountName}
            </div>

            <div>
              <span className="font-medium">{L.bankName || "Bank"}:</span> {BANK.bankName}
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <span className="font-medium shrink-0">{L.iban || "IBAN"}:</span>

              <span
                className="font-mono overflow-x-auto block md:[letter-spacing:0.02em]"
                dir="ltr"
                translate="no"
                title={BANK.ibanRaw}
                style={{
                  padding: "6px 10px",
                  borderRadius: 12,
                  border: "1px solid rgba(31,111,58,.18)",
                  background: "rgba(31,111,58,.06)",
                  maxWidth: "100%",
                }}
              >
                {BANK.ibanRaw}
              </span>

              <button
                type="button"
                className="text-xs font-semibold shrink-0 rounded-lg px-2 py-1"
                onClick={() => copy(BANK.ibanRaw, "iban")}
                style={{
                  border: "1px solid rgba(31,111,58,.22)",
                  color: "rgba(31,111,58,.95)",
                  background: "rgba(31,111,58,.08)",
                }}
              >
                {copied === "iban" ? (L.copied || "Kopiert!") : (L.copy || "Kopieren")}
              </button>
            </div>

            <div className="flex items-center gap-2 min-w-0">
              <span className="font-medium shrink-0">{L.bic || "BIC"}:</span>

              <span
                className="font-mono overflow-x-auto block"
                dir="ltr"
                translate="no"
                title={BANK.bic}
                style={{
                  padding: "6px 10px",
                  borderRadius: 12,
                  border: "1px solid rgba(31,111,58,.18)",
                  background: "rgba(31,111,58,.06)",
                  maxWidth: "100%",
                }}
              >
                {BANK.bic}
              </span>

              <button
                type="button"
                className="text-xs font-semibold shrink-0 rounded-lg px-2 py-1"
                onClick={() => copy(BANK.bic, "bic")}
                style={{
                  border: "1px solid rgba(31,111,58,.22)",
                  color: "rgba(31,111,58,.95)",
                  background: "rgba(31,111,58,.08)",
                }}
              >
                {copied === "bic" ? (L.copied || "Kopiert!") : (L.copy || "Kopieren")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Buttons */}
      <div className="mt-6">
        <div className="grid grid-cols-2 sm:flex sm:flex-row gap-3 items-stretch">
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
