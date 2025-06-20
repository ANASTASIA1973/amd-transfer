"use client";
// app/components/ContactStep.jsx

import React, { useState } from "react";
import t from "../i18n/translations";
import { useLocale } from "../context/LocaleContext";

export default function ContactStep({
  orig,
  dest,
  adults,
  children,
  isReturn,
  ridePrice,
  vehicle = "",             // Default-Wert
  vehicleSurcharge = 0,     // Default-Wert
  returnDiscount,
  totalBeforeVoucher,
  voucherDiscount,
  totalPrice,
  voucher,
  setVoucher,
  dateTime,
  returnDateTime,
  flightNo,
  seatExtrasDetails = [],
  otherExtrasDetails = [],
  onBack,
}) {
  const { locale } = useLocale();
  const L = t[locale] || t.de;

  // Firmendaten
  const firmEmail      = "info@amd-germancenter.com";
  const whatsappFull   = "+96181622668";
  const whatsappManual = "81 622 668";

  // Form-State
  const [firstName,     setFirstName]     = useState("");
  const [lastName,      setLastName]      = useState("");
  const [email,         setEmail]         = useState("");
  const [phone,         setPhone]         = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showWhishQr,   setShowWhishQr]   = useState(true);

  const fmt = dt => dt ? new Date(dt).toLocaleString() : "";

  // Nachricht-Zeilen für Mail/WhatsApp
  const lines = [
    L.emailGreeting,
    `${L.firstNameLabel}: ${firstName} ${lastName}`,
    `${L.emailLabel}: ${email}`,
    `${L.phoneLabel}: ${phone}`,
    `${L.pickupLabel}: ${orig}`,
    `${L.destinationLabel}: ${dest}`,
    `${L.dateTimeLabel}: ${fmt(dateTime)}`,
    ...(isReturn ? [`${L.returnDateTimeLabel}: ${fmt(returnDateTime)}`] : []),
    ...(flightNo  ? [`${L.flightNoLabel}: ${flightNo}`] : []),
    `${L.adultsLabel}: ${adults}`,
    `${L.childrenLabel}: ${children}`,
    ...(vehicle
      ? [`${L.vehicleLabel}: ${
          L["vehicle" + vehicle.charAt(0).toUpperCase() + vehicle.slice(1)]
        }`]
      : []),
    `${L.ridePriceLabel}: $${ridePrice.toFixed(2)}`,
    `${L.vehicleSurchargeLabel}: $${vehicleSurcharge.toFixed(2)}`,
    `${L.paymentTitle}: ${
      paymentMethod === "card"    ? L.creditCardBtn
      : paymentMethod === "whish" ? L.whishBtn
      :                             L.cashBtn
    }`,
  ];

  // Kindersitze
  if (seatExtrasDetails.length) {
    lines.push(`${L.seatsTitle}:`);
    const cheapestKey = seatExtrasDetails.reduce((a, b) => a.unit < b.unit ? a : b, seatExtrasDetails[0]).key;
    seatExtrasDetails.forEach(({ key, count, unit }) => {
      if (!count) return;
      const cost = key === cheapestKey
        ? Math.max(0, (count - 1) * unit).toFixed(2)
        : (count * unit).toFixed(2);
      const note = key === cheapestKey ? ` (${L.freeBadgeText})` : "";
      lines.push(`• ${L[key + "Label"]} ×${count}: $${cost}${note}`);
    });
  }

  // Sonstige Extras
  if (otherExtrasDetails.length) {
    lines.push("Extras:");
    otherExtrasDetails.forEach(({ key, count, unit }) => {
      if (!count) return;
      lines.push(`• ${L[key]} ×${count}: $${(count * unit).toFixed(2)}`);
    });
  }

  // Rabatte & Summen
  if (isReturn)        lines.push(`${L.returnDiscountLabel}: -$${Math.abs(returnDiscount).toFixed(2)}`);
  if (voucherDiscount) lines.push(`${L.voucherLabel}: -$${voucherDiscount.toFixed(2)}`);
  lines.push(`${L.minimumFareLabel}: $${totalBeforeVoucher.toFixed(2)}`);
  lines.push(`${L.totalLabel}: $${totalPrice.toFixed(2)}`);

  const body         = encodeURIComponent(lines.join("\n"));
  const mailtoLink   = `mailto:${firmEmail}?subject=${encodeURIComponent(L.emailSubject)}&body=${body}`;
  const whatsappLink = `https://wa.me/${whatsappFull.replace(/\D/g, "")}?text=${body}`;

  const canSubmit = firstName && lastName && email && phone;

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
      <h2 className="text-2xl font-bold text-[#002147]">{L.checkoutTitle}</h2>

      {/* Vorschau */}
      <pre
        className="bg-gray-100 p-4 rounded whitespace-pre-wrap"
        style={{
          direction: locale === "ar" ? "ltr" : undefined,
          unicodeBidi: locale === "ar" ? "embed" : undefined
        }}
      >
        {lines.join("\n")}
      </pre>

      {/* Gutschein */}
      <div>
        <label className="block mb-1 font-medium">{L.voucherLabel}</label>
        <input
          type="text"
          value={voucher}
          onChange={e => setVoucher(e.target.value)}
          placeholder={L.voucherPlaceholder}
          className="border rounded px-3 py-2 w-full mb-4"
        />
      </div>

      {/* Kontaktdaten */}
      <div className="grid grid-cols-2 gap-4">
        <input
          type="text"
          placeholder={L.firstNameLabel}
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          className="border rounded px-3 py-2"
        />
        <input
          type="text"
          placeholder={L.lastNameLabel}
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          className="border rounded px-3 py-2"
        />
      </div>
      <input
        type="email"
        placeholder={L.emailLabel}
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full border rounded px-3 py-2"
      />
      <input
        type="tel"
        placeholder={L.phoneLabel}
        value={phone}
        onChange={e => setPhone(e.target.value)}
        className="w-full border rounded px-3 py-2"
        style={{
          direction: locale === "ar" ? "ltr" : undefined,
          unicodeBidi: locale === "ar" ? "embed" : undefined
        }}
      />

      {/* Zahlungsmethoden */}
      <div className="space-y-4">
        <div className="font-medium">{L.paymentTitle}</div>
        <div className="flex gap-6">
          {["card","whish","cash"].map(m => (
            <label key={m} className="inline-flex items-center">
              <input
                type="radio"
                name="payment"
                value={m}
                checked={paymentMethod === m}
                onChange={() => setPaymentMethod(m)}
                className="mr-2"
              />
              {m === "card"    ? L.creditCardBtn
               : m === "whish" ? L.whishBtn
               :                   L.cashBtn}
            </label>
          ))}
        </div>

        {/* WHISH-Anleitung */}
        {paymentMethod === "whish" && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded space-y-3">
            <p className="font-medium">{L.whishInfoTitle}</p>
            <ol className="list-decimal list-inside text-sm">
              <li>{L.whishStep1}</li>
              <li>{L.whishStep2}</li>
              <li>{L.whishStep3.replace("{number}", whatsappManual)}</li>
              <li>{L.whishStep4}</li>
            </ol>
            <button
              type="button"
              onClick={() => setShowWhishQr(!showWhishQr)}
              className="text-sm underline"
            >
              {showWhishQr ? L.whishToggleToText.qr : L.whishToggleToText.text}
            </button>
            {showWhishQr && (
              <div className="flex justify-center mt-2">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(whatsappManual)}`}
                  alt="WHISH QR Code"
                  className="border rounded"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Aktionen */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button onClick={onBack} className="btn btn-secondary flex-1">
          {L.backBtn}
        </button>
        <a
          href={mailtoLink}
          target="_blank" rel="noopener noreferrer"
          className={`btn btn-primary flex-1 text-center ${!canSubmit && "opacity-50 cursor-not-allowed"}`}
          onClick={e => !canSubmit && e.preventDefault()}
        >
          {L.sendBtn}
        </a>
        <a
          href={whatsappLink}
          target="_blank" rel="noopener noreferrer"
          className={`btn btn-primary flex-1 text-center ${!canSubmit && "opacity-50 cursor-not-allowed"}`}
          onClick={e => !canSubmit && e.preventDefault()}
        >
          {L.whatsappBtn}
        </a>
      </div>
    </div>
  );
}