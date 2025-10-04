// app/impressum/page.jsx
"use client";

import React from "react";
import Link from "next/link";
import LanguageSwitcher from "../components/LanguageSwitcher";
import { useLocale } from "../context/LocaleContext";

export default function ImpressumPage() {
  const { locale } = useLocale();

  const dict = {
    de: {
      back: "Zurück",
      title: "Impressum & Unternehmensangaben",
      lead:
        "AMD German Center – offiziell registriertes Unternehmen für Tourismus & Transfers.",
      reg: "Handelsregister Saida, Nr. 158686 · Ort: Tyre, Libanon",
      owner: "Inhaber: Ali Mohsen Ahmad",
      scope:
        "Geschäftsbereich: Tourismus, Transfers & begleitende Dienstleistungen",
      quality: "Deutscher Qualitätsanspruch, lokale Expertise.",
      contactTitle: "Kontakt",
      phoneLabel: "Telefon",
      emailLabel: "E-Mail",
      webLabel: "Web",
      certTitle: "Zertifikat",
      certNote:
        "Auszug/Bestätigung aus dem Handelsregister – Nachweis der offiziellen Registrierung.",
      download: "Zertifikat öffnen",
      legalTitle: "Hinweis",
      legalNote:
        "Diese Website dient der Information und Buchung privater Transfers/Touren. Preise können je nach Route und Verfügbarkeit variieren.",
      show: "anzeigen",
      hide: "ausblenden",
    },
    en: {
      back: "Back",
      title: "Imprint & Company Details",
      lead:
        "AMD German Center – officially registered for tourism & transfer services.",
      reg: "Saida Commercial Register No. 158686 · Location: Tyre, Lebanon",
      owner: "Owner: Ali Mohsen Ahmad",
      scope: "Business scope: Tourism, transfers & related services",
      quality: "German quality standards with local expertise.",
      contactTitle: "Contact",
      phoneLabel: "Phone",
      emailLabel: "Email",
      webLabel: "Web",
      certTitle: "Certificate",
      certNote:
        "Extract/confirmation from the Commercial Register – proof of official registration.",
      download: "Open certificate",
      legalTitle: "Notice",
      legalNote:
        "This website provides information and bookings for private transfers/tours. Prices may vary by route and availability.",
      show: "show",
      hide: "hide",
    },
    ar: {
      back: "رجوع",
      title: "البيانات القانونية ومعلومات الشركة",
      lead:
        "مركز AMD الألماني – شركة مسجّلة رسميًا لخدمات السياحة والنقل.",
      reg: "السجل التجاري في صيدا رقم 158686 · الموقع: صور، لبنان",
      owner: "المالك: علي محسن أحمد",
      scope: "مجال العمل: السياحة، النقل والخدمات المرافقة",
      quality: "معايير جودة ألمانية وخبرة محلية.",
      contactTitle: "التواصل",
      phoneLabel: "الهاتف",
      emailLabel: "البريد الإلكتروني",
      webLabel: "الموقع",
      certTitle: "الشهادة",
      certNote:
        "مقتطف/تأكيد من السجل التجاري — لإثبات التسجيل الرسمي.",
      download: "فتح الشهادة",
      legalTitle: "ملاحظة",
      legalNote:
        "هذا الموقع مخصص للمعلومات وحجوزات النقل/الجولات الخاصة. قد تختلف الأسعار حسب المسار والتوافر.",
      show: "عرض",
      hide: "إخفاء",
    },
  };

  const L = dict[locale] || dict.de;

  const phone = "+961 81 622 668";
  const email = "info@amd-germancenter.com";
  const web = "www.amd-germancenter.com";

  // Zertifikat erst auf Klick anzeigen
  const [showCert, setShowCert] = React.useState(false);

  return (
    <div dir={locale === "ar" ? "rtl" : "ltr"} className="min-h-screen bg-[#F9F7F2]">
      {/* Kopfzeile mit Zurück + Sprachen, mobil symmetrisch */}
      <div className="mx-auto max-w-3xl px-4 pt-4 flex items-center justify-between gap-3">
        <Link
          href="/"
          scroll
          className="h-10 px-3 rounded-lg border border-[#EDD7B1] bg-white/90 text-sm text-[#002147] hover:opacity-80 inline-flex items-center"
        >
          <span dir="ltr">← {L.back}</span>
        </Link>
        <div className="shrink-0">
          <LanguageSwitcher />
        </div>
      </div>

      {/* Inhalt */}
      <main className="flex-grow flex items-start justify-center py-6 px-4">
        <div className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden border border-[#EDD7B1]">
          <div className="p-6 md:p-8">
            <h1 className="text-2xl md:text-3xl font-bold text-[#002147] mb-3">
              {L.title}
            </h1>

            <div className="text-[#002147]/90 text-sm md:text-base space-y-1 break-words">
              <p>{L.lead}</p>
              <p>{L.reg}</p>
              <p>{L.owner}</p>
              <p>{L.scope}</p>
              <p>{L.quality}</p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 md:gap-10 mt-6 md:mt-8">
              {/* Kontakt */}
              <section className="space-y-4">
                <h2 className="text-lg md:text-xl font-semibold text-[#002147]">
                  {L.contactTitle}
                </h2>

                <div className="rounded-xl border border-[#EDD7B1] bg-white/90 p-4 shadow-[0_4px_24px_rgba(200,151,67,0.10)]">
                  <div className="text-sm md:text-base break-words">
                    <div className="mb-2">
                      <span className="font-medium">{L.phoneLabel}:</span>{" "}
                      <a
                        href={`tel:${phone.replace(/\s+/g, "")}`}
                        className="underline text-[#C09743] hover:opacity-80"
                      >
                        <span dir="ltr" className="inline-block">
                          {phone}
                        </span>
                      </a>
                    </div>
                    <div className="mb-2">
                      <span className="font-medium">{L.emailLabel}:</span>{" "}
                      <a
                        href={`mailto:${email}`}
                        className="underline text-[#C09743] hover:opacity-80 break-all"
                      >
                        {email}
                      </a>
                    </div>
                    <div>
                      <span className="font-medium">{L.webLabel}:</span>{" "}
                      <a
                        href={`https://${web}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline text-[#C09743] hover:opacity-80 break-all"
                      >
                        {web}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-[#EEE] p-4 text-xs md:text-sm text-[#002147]/70">
                  <div className="font-semibold text-[#002147] mb-1">
                    {L.legalTitle}
                  </div>
                  <div className="break-words">{L.legalNote}</div>
                </div>
              </section>

              {/* Zertifikat – einklappbar */}
              <section>
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg md:text-xl font-semibold text-[#002147]">
                    {L.certTitle}
                  </h2>
                  <button
                    onClick={() => setShowCert((v) => !v)}
                    className="text-[#C09743] underline text-sm md:text-base hover:opacity-80"
                  >
                    {showCert ? L.hide : L.show}
                  </button>
                </div>

                {showCert && (
                  <>
                    <div className="rounded-2xl overflow-hidden border border-[#EDD7B1] bg-white">
                      <img
                        src="/images/certificate.jpg"
                        alt="Company registration certificate"
                        className="w-full h-auto object-cover"
                        loading="lazy"
                        decoding="async"
                      />
                    </div>

                    <p className="text-xs md:text-sm text-[#002147]/70 mt-3">
                      {L.certNote}
                    </p>

                    <a
                      href="/images/certificate.jpg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-block mt-3 underline text-[#C09743] hover:opacity-80 text-sm md:text-base"
                    >
                      {L.download}
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
