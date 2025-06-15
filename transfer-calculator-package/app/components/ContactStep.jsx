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
  vehicle,
  vehicleSurcharge,
  extrasSeatsCost,
  otherExtrasCost,
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

  const firmEmail = "info@amd-finanz.de";
  const whatsappNumber = "96181622668";

  const [firstName, setFirstName]         = useState("");
  const [lastName,  setLastName]          = useState("");
  const [email,     setEmail]             = useState("");
  const [phone,     setPhone]             = useState("");
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [showWishQr,   setShowWishQr]     = useState(true);

  const fmt = dt => dt ? new Date(dt).toLocaleString() : "";

  // Nachricht-Zeilen
  const lines = [
    L.emailGreeting,
    `${L.firstNameLabel}: ${firstName} ${lastName}`,
    `${L.emailLabel}: ${email}`,
    `${L.phoneLabel}: ${phone}`,
    `${L.pickupLabel}: ${orig}`,
    `${L.destinationLabel}: ${dest}`,
    `${L.dateTimeLabel}: ${fmt(dateTime)}`,
    ...(isReturn ? [`${L.returnDateTimeLabel}: ${fmt(returnDateTime)}`] : []),
    ...(flightNo ? [`${L.flightNoLabel}: ${flightNo}`] : []),
    `${L.adultsLabel}: ${adults}`,
    `${L.childrenLabel}: ${children}`,
    `${L.vehicleLabel}: ${L["vehicle" + vehicle.charAt(0).toUpperCase() + vehicle.slice(1)]}`,
    `${L.ridePriceLabel}: $${ridePrice.toFixed(2)}`,
    `${L.vehicleSurchargeLabel}: $${vehicleSurcharge.toFixed(2)}`,
    `${L.paymentTitle}: ${
      paymentMethod === "card"
        ? L.creditCardBtn
        : paymentMethod === "wish"
        ? L.wishBtn
        : L.cashBtn
    }`,
  ];

  // Kindersitze
  if (seatExtrasDetails.length) {
    lines.push(`${L.seatsTitle}:`);
    const cheapestKey = seatExtrasDetails.reduce(
      (a, b) => (a.unit < b.unit ? a : b),
      seatExtrasDetails[0]
    ).key;
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
  if (isReturn)      lines.push(`${L.returnDiscountLabel}: -$${Math.abs(returnDiscount).toFixed(2)}`);
  if (voucherDiscount) lines.push(`${L.voucherLabel}: -$${voucherDiscount.toFixed(2)}`);
  lines.push(`${L.minimumFareLabel}: $${totalBeforeVoucher.toFixed(2)}`);
  lines.push(`${L.totalLabel}: $${totalPrice.toFixed(2)}`);

  const body = encodeURIComponent(lines.join("\n"));
  const mailtoLink = `mailto:${firmEmail}?subject=${encodeURIComponent(L.emailSubject)}&body=${body}`;
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=${body}`;

  const canSubmit = firstName && lastName && email && phone;

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
      <h2 className="text-2xl font-bold text-[#002147]">{L.checkoutTitle}</h2>

      <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap">
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
      />

      {/* Zahlungsmethode */}
      <div className="space-y-2">
        <div className="font-medium">{L.paymentTitle}</div>
        <div className="flex gap-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="payment"
              value="card"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
              className="mr-2"
            />
            {L.creditCardBtn}
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="payment"
              value="wish"
              checked={paymentMethod === "wish"}
              onChange={() => setPaymentMethod("wish")}
              className="mr-2"
            />
            {L.wishBtn}
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="payment"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={() => setPaymentMethod("cash")}
              className="mr-2"
            />
            {L.cashBtn}
          </label>
        </div>

        {/* Kreditkarte: vorbereitet, deaktiviert */}
        {paymentMethod === "card" && (
          <div className="p-4 bg-gray-100 rounded border border-gray-300 space-y-4">
            <p className="text-sm text-gray-700">Kreditkartenzahlung demnächst verfügbar.</p>
            <input
              type="text"
              placeholder="Kartennummer"
              disabled
              className="w-full border rounded px-3 py-2 bg-gray-200 cursor-not-allowed"
            />
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="MM/YY"
                disabled
                className="flex-1 border rounded px-3 py-2 bg-gray-200 cursor-not-allowed"
              />
              <input
                type="text"
                placeholder="CVC"
                disabled
                className="w-24 border rounded px-3 py-2 bg-gray-200 cursor-not-allowed"
              />
            </div>
          </div>
        )}

        {/* WISH-Anleitung */}
        {paymentMethod === "wish" && (
          <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded space-y-3">
            <p className="font-medium">{L.wishInfoTitle}</p>
            <ol className="list-decimal list-inside text-sm">
              <li>{L.wishStep1}</li>
              <li>{L.wishStep2}</li>
              <li>{L.wishStep3.replace("{number}", whatsappNumber)}</li>
              <li>{L.wishStep4}</li>
            </ol>
            <button
              type="button"
              onClick={() => setShowWishQr(!showWishQr)}
              className="text-sm underline"
            >
              {showWishQr ? L.wishToggleToText.qr : L.wishToggleToText.text}
            </button>
            {showWishQr && (
              <div className="flex justify-center mt-2">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=+${whatsappNumber}`}
                  alt="WISH QR Code"
                  className="border rounded"
                />
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action-Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button onClick={onBack} className="btn btn-secondary flex-1">
          {L.backBtn}
        </button>
        <a
          href={mailtoLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn btn-primary flex-1 text-center ${
            canSubmit ? "" : "opacity-50 cursor-not-allowed"
          }`}
          onClick={e => !canSubmit && e.preventDefault()}
        >
          {L.sendBtn}
        </a>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className={`btn btn-primary flex-1 text-center ${
            canSubmit ? "" : "opacity-50 cursor-not-allowed"
          }`}
          onClick={e => !canSubmit && e.preventDefault()}
        >
          {L.whatsappBtn}
        </a>
      </div>
    </div>
  );
}
