"use client";

import React from "react";
import { useLocale } from "../context/LocaleContext";
import t from "../i18n/translations";

function normalizeLocale(value) {
  const s = String(value || "de").toLowerCase().trim();
  const short = s.slice(0, 2);
  return short === "de" || short === "en" || short === "ar" ? short : "de";
}

export default function AmdFooter() {
  const { locale } = useLocale();

  const lang = normalizeLocale(locale); // immer de/en/ar
  const L = t[lang] || t.de;

  const F = L.footer || {};
  const FL = F.links || {};

  const isAr = lang === "ar";

// Legal-Seiten existieren pro Sprache unter /public/legal/{lang}/
const legal = {
  faq: `/legal/${lang}/faq.html`,
  about: `/legal/${lang}/about.html`,
  imprint: `/legal/${lang}/imprint.html`,
  datenschutz: `/legal/${lang}/datenschutz.html`,
  agbs: `/legal/${lang}/agbs.html`,
};

  // Website-Links (extern) mit Sprachpfad
  const siteBase = "https://www.amd-germancenter.com";
  const site = {
    carRental: `${siteBase}/${lang}/car-rental.html`,
    packageTours: `${siteBase}/${lang}/package-tours.html`,
  };

  return (
    <footer className="amd-footer" dir={isAr ? "rtl" : "ltr"}>
      <div className="footer-grid">
        {/* Left column */}
        <div className="footer-column footer-column--left">
          {F.colLeftTitle ? <p className="footer-title">{F.colLeftTitle}</p> : null}

          <ul className="footer-links">
            <li>
              <a href="https://amdtransfer.netlify.app/" target="_blank" rel="noopener">
                {FL.transfer || "Airport Transfer"}
              </a>
            </li>

            <li>
              <a href="https://amdtourbooking.netlify.app/" target="_blank" rel="noopener">
                {FL.tours || "Day tours"}
              </a>
            </li>

            <li>
              <a href={site.carRental} target="_blank" rel="noopener">
                {FL.carRental || "Car rental"}
              </a>
            </li>

            <li>
              <a href={site.packageTours} target="_blank" rel="noopener">
                {FL.packageTours || "Package tours"}
              </a>
            </li>

            <li>
              <a href="https://amd-tarifcheck.de/" target="_blank" rel="noopener">
                {FL.tarifcheck || "AMD Tarifcheck"}
              </a>
            </li>
          </ul>
        </div>

        {/* Center column */}
        <div className="footer-column footer-column--center">
          <p className="footer-title">{F.colCenterTitle || "Follow us on:"}</p>

          <div className="footer-social">
            <a href="https://wa.me/96181622668" target="_blank" rel="noopener" aria-label="WhatsApp">
              <img src="/images/icon-whatsapp.svg" alt="WhatsApp" />
            </a>

            <a
              href="https://www.instagram.com/amd.german.center/"
              target="_blank"
              rel="noopener"
              aria-label="Instagram"
            >
              <img src="/images/icon-instagram.svg" alt="Instagram" />
            </a>

            <a
              href="https://www.facebook.com/p/AMD-German-Center-61575238540217/"
              target="_blank"
              rel="noopener"
              aria-label="Facebook"
            >
              <img src="/images/icon-facebook.svg" alt="Facebook" />
            </a>

            <a
              href="https://www.tiktok.com/@amdgermancenter"
              target="_blank"
              rel="noopener"
              aria-label="TikTok"
            >
              <img src="/images/icon-tiktok.svg" alt="TikTok" />
            </a>
          </div>
        </div>

        {/* Right column */}
        <div className="footer-column footer-column--right">
          {F.colRightTitle ? <p className="footer-title">{F.colRightTitle}</p> : null}

       <ul className="footer-links">
  <li><a href={legal.faq}>{FL.faq || "Lebanon FAQ"}</a></li>
  <li><a href={legal.about}>{FL.about || "About us"}</a></li>
  <li><a href={legal.imprint}>{FL.imprint || "Imprint"}</a></li>
  <li><a href={legal.datenschutz}>{FL.datenschutz || "Privacy policy"}</a></li>
  <li><a href={legal.agbs}>{FL.agbs || "Terms & Conditions"}</a></li>
</ul>

        </div>
      </div>
    </footer>
  );
}
