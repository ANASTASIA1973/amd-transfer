// app/layout.tsx

import type { Metadata } from "next";
import { Geist } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { LocaleProvider } from "./context/LocaleContext";
import ClientWrapper from "./components/ClientWrapper";
import LanguageSwitcher from "./components/LanguageSwitcher";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Transfer & Tour-Service",
  description: "Buchen Sie Fahrten und individuelle Touren.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <head>
        {/* Google Maps API nur einmal laden, Key aus build-time ENV-Var */}
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
        {/* Hier kannst du weitere Meta-Tags, Styles oder Icon-Links hinzufügen */}
      </head>
      <body className={`${geistSans.variable} antialiased bg-white text-[#171717]`}>
        <LocaleProvider>
          <ClientWrapper>
            {/* ── HEADER mit Sticky-Navbar ───────────────────────── */}
            <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
              <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
                {/* Firmen-Logo links */}
                <img
                  src="/logo.png"
                  alt="AMD German Center Logo"
                  className="h-16 w-auto"
                />

                {/* Sprach-Auswahl rechts */}
                <LanguageSwitcher />
              </div>
            </header>

            {/* ── HAUPTINHALT ─────────────────────────────────────── */}
            <main className="max-w-3xl mx-auto p-8">{children}</main>
          </ClientWrapper>
        </LocaleProvider>
      </body>
    </html>
  );
}
