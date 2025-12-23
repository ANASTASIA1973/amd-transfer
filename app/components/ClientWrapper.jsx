"use client";

// app/components/ClientWrapper.jsx

import React, { useEffect } from "react";
import GoogleMapsLoader from "./GoogleMapsLoader";
import LanguageSwitcher from "./LanguageSwitcher";
import { useLocale } from "../context/LocaleContext";
import t from "../i18n/translations";
import { MAIN_SITE_BASE } from "../config/mainSite";
import AmdFooter from "./AmdFooter";

export default function ClientWrapper({ children }) {
  const { locale } = useLocale();

  useEffect(() => {
    try {
      localStorage.setItem("amd_locale", locale);
    } catch (e) {}
  }, [locale]);

  const L = t[locale] || t.de;

  // ✅ Theme-Scope zuverlässig setzen (damit globals.css greift)
  useEffect(() => {
    document.body.setAttribute("data-app", "amd-transfer");
  }, []);

  const whatsappNumber = "+96181622668";
  const whatsappLink = `https://wa.me/${whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent(
    L.whatsappText
  )}`;

  return (
    <>
      <GoogleMapsLoader />

      {/* HEADER */}
      <div className="w-full bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3">
          {/* Row 1: Logo + Language pills (always same line on mobile) */}
          <div className="flex items-center justify-between gap-3">
            {/* Logo */}
            <a href="/" className="flex items-center min-w-0 shrink-0">
              <img
                src="/logo.png"
                alt="AMD German Center Logo"
                className="h-10 sm:h-14 w-auto object-contain"
                style={{ maxWidth: "52vw" }}
              />
            </a>

            {/* Pills: keep in one line */}
            <div className="shrink-0" style={{ whiteSpace: "nowrap" }}>
              <LanguageSwitcher />
            </div>
          </div>

          {/* Row 2: CTA (mobile below, desktop can sit right but below is fine) */}
          <div className="mt-3 sm:mt-0 sm:flex sm:justify-end">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="amd-whatsapp-cta inline-flex w-full sm:w-auto items-center justify-center gap-2 font-semibold rounded-2xl px-4 sm:px-6 py-2 transition shadow-lg text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-offset-2"
              style={{
                background: "var(--amd-primary, #002147)",
                color: "#ffffff",
                boxShadow: "0 14px 28px rgba(0,0,0,0.18)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.filter = "brightness(0.95)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.filter = "none";
              }}
            >
              📱 {L.tourRequestBtn}
            </a>
          </div>
        </div>
      </div>

      {/* PAGE BACKGROUND */}
      <div
        className="min-h-screen w-full font-sans relative"
        style={{
          background:
            "radial-gradient(circle at top, rgba(255,255,255,1) 0%, rgba(246,247,250,1) 55%, rgba(246,247,250,1) 100%)",
        }}
      >
        {/* HERO */}
        <section className="w-full">
          <div className="max-w-5xl mx-auto px-4 pt-5 sm:pt-7">
            <div className="relative overflow-hidden rounded-3xl border border-gray-200 shadow-[0_18px_50px_rgba(2,6,23,.14)]">
              <div
                className="h-[200px] sm:h-[260px] md:h-[300px] bg-cover"
                style={{
                  backgroundImage: "url('/images/transfer-fahrer.jpg')",
                  backgroundPosition: "30% 50%",
                }}
                aria-hidden="true"
              />

              {/* Overlay */}
              <div
                className="absolute inset-0"
                aria-hidden="true"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(0,33,71,.62) 0%, rgba(0,33,71,.22) 58%, rgba(0,33,71,0) 100%)",
                }}
              />

              {/* Hero Text */}
              <div className="absolute inset-0 flex items-end pb-6 sm:pb-8 pt-14 sm:pt-0">
                <div className="p-5 sm:p-7">
                  <div
                    className="inline-block rounded-2xl px-4 py-3 sm:px-5 sm:py-4 text-white drop-shadow-[0_8px_22px_rgba(0,0,0,.55)]"
                    style={{
                      background: "rgba(0,33,71,.42)",
                      backdropFilter: "blur(3px)",
                    }}
                  >
                    <a
                      href={`${MAIN_SITE_BASE}/${locale}/index.html`}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold mb-2"
                      style={{
                        color: "#ffffff",
                        textDecoration: "none",
                        opacity: 0.95,
                        textShadow: "0 2px 8px rgba(0,0,0,.70)",
                      }}
                    >
                      ← {L.backToMainLabel || "Zurück zur Hauptseite"}
                    </a>

                    <h1 className="!text-white text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight mt-1">
                      {L.transferHeroTitle || "Airport Transfer im Libanon"}
                    </h1>

                    <p className="!text-white text-sm sm:text-base opacity-95 mt-2 max-w-xl">
                      {L.transferHeroSub ||
                        "Zuverlässige Abholung. Klare Kommunikation. Deutschsprachiger Service."}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CONTENT */}
        <main className="w-full flex flex-col items-center justify-start px-2 pb-10">
          <div className="w-full mt-6 sm:mt-8">{children}</div>
        </main>

        <AmdFooter />
      </div>

      <style jsx global>{`
        a:focus-visible {
          outline: none;
          box-shadow: 0 0 0 4px rgba(27, 111, 90, 0.22),
            0 14px 28px rgba(0, 0, 0, 0.18);
        }

        /* Mobile: prevent pills from blowing up */
        .amd-flag-switcher {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }
        .amd-flag-pill {
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 12px;
          line-height: 1;
        }
        .amd-flag-icon {
          width: 16px;
          height: 16px;
        }
      `}</style>
    </>
  );
}
