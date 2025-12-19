// app/impressum/page.jsx
"use client";

import React from "react";
import Link from "next/link";
import t from "../i18n/translations";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useLocale } from "../context/LocaleContext";

export default function ImpressumPage() {
  const { locale } = useLocale();
  const L0 = t[locale] || t.de;

  // Nimm die zentralen Übersetzungen aus translations.js (falls vorhanden),
  // fallback auf alte Keys, damit nichts leer ist.
  const L = L0.impressum || {};
  const TXT = {
    back: L.back || (locale === "ar" ? "رجوع" : locale === "en" ? "Back" : "Zurück"),
    title: L.title || "Impressum & Unternehmensangaben",
    lead: L.lead || "AMD German Center – offiziell registriertes Unternehmen für Tourismus & Transfers.",
    reg: L.reg || "Handelsregister Saida, Nr. 158686 · Ort: Tyre, Libanon",
    owner: L.owner || "Inhaber: Ali Mohsen Ahmad",
    scope: L.scope || "Geschäftsbereich: Tourismus, Transfers & begleitende Dienstleistungen",
    quality: L.quality || "Deutscher Qualitätsanspruch, lokale Expertise.",
    contactTitle: L.contactTitle || "Kontakt",
    phoneLabel: L.phoneLabel || "Telefon",
    emailLabel: L.emailLabel || "E-Mail",
    webLabel: L.webLabel || "Web",
    certTitle: L.certTitle || "Zertifikat",
    certNote:
      L.certNote ||
      "Auszug/Bestätigung aus dem Handelsregister – Nachweis der offiziellen Registrierung.",
    download: L.download || "Zertifikat öffnen",
    legalTitle: L.legalTitle || "Hinweis",
    legalNote:
      L.legalNote ||
      "Diese Website dient der Information und Buchung privater Transfers/Touren. Preise können je nach Route und Verfügbarkeit variieren.",
    show: (L.show || L0.show) || (locale === "ar" ? "عرض" : locale === "en" ? "show" : "anzeigen"),
    hide: (L.hide || L0.hide) || (locale === "ar" ? "إخفاء" : locale === "en" ? "hide" : "ausblenden"),
  };

  const phone = "+961 81 622 668";
  const email = "info@amd-germancenter.com";
  const web = "www.amd-germancenter.com";

  // Wenn du willst, dass es standardmäßig offen ist: true statt false
  const [showCert, setShowCert] = React.useState(false);

  const isAr = locale === "ar";

  return (
    <div
      dir={isAr ? "rtl" : "ltr"}
      className="min-h-screen w-full"
      style={{
        background:
          "radial-gradient(circle at top, rgba(255,255,255,1) 0%, rgba(246,247,250,1) 55%, rgba(246,247,250,1) 100%)",
      }}
    >
      {/* Topbar – im Transfer-Stil */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <Link
            href="/"
            className="inline-flex items-center h-10 px-4 rounded-2xl border border-gray-200 bg-white text-sm font-semibold"
            style={{ color: "var(--amd-heading,#111827)" }}
          >
            <span dir="ltr">← {TXT.back}</span>
          </Link>

          <div className="shrink-0">
            <LanguageSwitcher />
          </div>
        </div>
      </div>

      <main className="max-w-5xl mx-auto px-4 py-6 sm:py-8">
        {/* Card im gleichen Look wie WizardLayout */}
        <div
          className="w-full overflow-hidden"
          style={{
            background: "var(--amd-card-bg,#ffffff)",
            border: "1px solid var(--amd-border,#e5e7eb)",
            borderRadius: "var(--amd-radius-lg,18px)",
            boxShadow: "var(--amd-shadow-card, 0 14px 30px rgba(15, 23, 42, 0.06))",
          }}
        >
          <div className="px-5 sm:px-7 py-6 sm:py-8">
            <h1
              className="text-2xl sm:text-3xl font-extrabold"
              style={{ color: "var(--amd-heading,#111827)" }}
            >
              {TXT.title}
            </h1>

            <div className="mt-3 text-sm sm:text-base leading-relaxed" style={{ color: "var(--amd-text,#111827)" }}>
              <p className="opacity-95">{TXT.lead}</p>
              <p className="opacity-85 mt-2">{TXT.reg}</p>
              <p className="opacity-85 mt-1">{TXT.owner}</p>
              <p className="opacity-85 mt-1">{TXT.scope}</p>
              <p className="opacity-85 mt-1">{TXT.quality}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-10 mt-7">
              {/* Kontakt */}
              <section>
                <h2 className="text-lg sm:text-xl font-semibold" style={{ color: "var(--amd-heading,#111827)" }}>
                  {TXT.contactTitle}
                </h2>

                <div
                  className="mt-3 rounded-2xl border p-4 sm:p-5"
                  style={{
                    borderColor: "var(--amd-border,#e5e7eb)",
                    background: "rgba(17,24,39,.02)",
                  }}
                >
                  <div className="text-sm sm:text-base break-words" style={{ color: "var(--amd-text,#111827)" }}>
                    <div className="mb-2">
                      <span className="font-semibold">{TXT.phoneLabel}:</span>{" "}
                      <a
                        href={`tel:${phone.replace(/\s+/g, "")}`}
                        className="underline"
                        style={{ color: "var(--amd-primary,#c1272d)" }}
                      >
                        <span dir="ltr" className="inline-block">
                          {phone}
                        </span>
                      </a>
                    </div>

                    <div className="mb-2">
                      <span className="font-semibold">{TXT.emailLabel}:</span>{" "}
                      <a
                        href={`mailto:${email}`}
                        className="underline break-all"
                        style={{ color: "var(--amd-primary,#c1272d)" }}
                      >
                        {email}
                      </a>
                    </div>

                    <div>
                      <span className="font-semibold">{TXT.webLabel}:</span>{" "}
                      <a
                        href={`https://${web}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline break-all"
                        style={{ color: "var(--amd-primary,#c1272d)" }}
                      >
                        {web}
                      </a>
                    </div>
                  </div>
                </div>

                <div
                  className="mt-4 rounded-2xl border p-4 text-xs sm:text-sm"
                  style={{
                    borderColor: "var(--amd-border,#e5e7eb)",
                    background: "rgba(17,24,39,.02)",
                    color: "var(--amd-text-muted,#6b7280)",
                  }}
                >
                  <div className="font-semibold mb-1" style={{ color: "var(--amd-heading,#111827)" }}>
                    {TXT.legalTitle}
                  </div>
                  <div className="break-words">{TXT.legalNote}</div>
                </div>
              </section>

              {/* Zertifikat */}
              <section>
                <div className="flex items-center justify-between gap-3">
                  <h2 className="text-lg sm:text-xl font-semibold" style={{ color: "var(--amd-heading,#111827)" }}>
                    {TXT.certTitle}
                  </h2>

                  <button
                    type="button"
                    onClick={() => setShowCert((v) => !v)}
                    className="text-sm sm:text-base font-semibold underline"
                    style={{ color: "var(--amd-primary,#c1272d)" }}
                  >
                    {showCert ? TXT.hide : TXT.show}
                  </button>
                </div>

                <p className="mt-2 text-xs sm:text-sm" style={{ color: "var(--amd-text-muted,#6b7280)" }}>
                  {TXT.certNote}
                </p>

                {showCert && (
                  <>
                    <div
                      className="mt-4 rounded-2xl overflow-hidden border bg-white"
                      style={{ borderColor: "var(--amd-border,#e5e7eb)" }}
                    >
                      <img
                        src="/images/certificate.jpg"
                        alt="Company registration certificate"
                        className="w-full h-auto object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <a
                      href="/images/certificate.jpg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-sm sm:text-base font-semibold underline"
                      style={{ color: "var(--amd-primary,#c1272d)" }}
                    >
                      {TXT.download}
                    </a>
                  </>
                )}
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
