// app/components/ContactStep.jsx
"use client";

import { useState } from "react";
import t from "../i18n/translations";

export default function ContactStep({
  locale,
  orig,
  dest,
  adults,
  children,
  isReturn,
  vehicle,
  seatExtrasDetails = [],
  otherExtrasDetails = [],
  extrasSeatsCost,
  otherExtrasCost,
  freeSeatPrice,
  totalPrice,
  dateTime,
  flightNo,
  voucher,
  onBack,
}) {
  const L = t[locale] || t.de;

  // 4️⃣ Kunde gibt hier seine Kontaktdaten ein
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // 5️⃣ WhatsApp-Nummer des Chefs (immer ohne "+")
  const chefNumber = "961816226668";

  // Anfrage-Text
  const lines = [
    `Transferanfrage:`,
    `Name: ${name || "–"}`,
    `E-Mail: ${email || "–"}`,
    `Tel Kunde: ${phone || "–"}`,
    `Startort: ${orig || "–"}`,
    `Zielort: ${dest || "–"}`,
    `Datum & Uhrzeit: ${dateTime || "–"}`,
    `Flugnummer: ${flightNo || "–"}`,
    `Erwachsene: ${adults}`,
    `Kinder: ${children}`,
    `Rückfahrt: ${isReturn ? "Ja" : "Nein"}`,
    `Fahrzeug: ${vehicle}`,
    seatExtrasDetails.length
      ? `Kindersitze:\n${seatExtrasDetails.join("\n")}`
      : `Kindersitze: –`,
    otherExtrasDetails.length
      ? `Weitere Extras:\n${otherExtrasDetails.join("\n")}`
      : `Weitere Extras: –`,
    `Kosten Kindersitze: €${extrasSeatsCost.toFixed(2)}`,
    `Kosten Extras: €${otherExtrasCost.toFixed(2)}`,
    voucher ? `Gutschein: ${voucher}` : null,
    `Gesamtpreis: €${totalPrice.toFixed(2)}`,
  ]
    .filter(Boolean)
    .join("\n");

  // Mailto-Link
  const mailtoLink =
    `mailto:?subject=${encodeURIComponent("Transfer-Anfrage")}` +
    `&body=${encodeURIComponent(lines)}`;

  // wa.me-Link mit fester Chef-Nummer
  const whatsappLink = `https://wa.me/${chefNumber}?text=${encodeURIComponent(
    lines
  )}`;

  return (
    <div className="bg-white rounded-lg shadow-sm p-8 space-y-6">
      {/* Zurück */}
      <button
        onClick={onBack}
        className="border border-[#002147] text-[#002147] py-2 px-4 rounded-lg hover:bg-gray-100 transition"
      >
        {L.backBtn}
      </button>

      {/* Überschrift */}
      <h2 className="text-2xl font-bold text-[#002147]">{L.contactTitle}</h2>

      {/* Kontakt‐Eingaben */}
      <div className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={L.namePlaceholder}
          className="w-full border rounded-lg px-3 py-2"
        />
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={L.emailPlaceholder}
          className="w-full border rounded-lg px-3 py-2"
        />
        <input
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder={L.phonePlaceholder}
          className="w-full border rounded-lg px-3 py-2"
        />
      </div>

      {/* Aktion‐Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <a
          href={mailtoLink}
          className="flex-1 bg-[#002147] text-white text-center py-3 rounded-lg hover:bg-[#C09743] transition"
        >
          {L.emailBtn}
        </a>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 bg-green-600 text-white text-center py-3 rounded-lg hover:bg-green-700 transition"
        >
          {L.whatsappBtn}
        </a>
      </div>
    </div>
  );
}
