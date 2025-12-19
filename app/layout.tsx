// ❌ Kein "use client" hier oben!
import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Script from "next/script";
import ReferralTracker from "./components/ReferralTracker";
import { LocaleProvider } from "./context/LocaleContext";
import ClientWrapper from "./components/ClientWrapper";
import DebugKeyLogger from "./components/DebugKeyLogger";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AMD Transfer Booking",
  description: "Rechner für Flughafentransfers",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de">
      <head>
        <Script
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places`}
          strategy="beforeInteractive"
        />
      </head>

      {/* ✅ Theme-Scope hier */}
      <body data-app="amd-transfer" className={`${geistSans.variable} antialiased`}>
        <ReferralTracker />
        <LocaleProvider>
          <ClientWrapper>
            {children}
            <DebugKeyLogger />
          </ClientWrapper>
        </LocaleProvider>
      </body>
    </html>
  );
}
