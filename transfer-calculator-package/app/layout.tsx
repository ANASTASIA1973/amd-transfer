import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { LocaleProvider } from "./context/LocaleContext";
import ClientWrapper from "./components/ClientWrapper";

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
      <head />
      <body className={`${geistSans.variable} antialiased`}>
        {/* Sprache per Context verfügbar machen */}
        <LocaleProvider>
          {/* ClientWrapper lädt u.a. Google Maps */}
          <ClientWrapper>
            {children}
          </ClientWrapper>
        </LocaleProvider>
      </body>
    </html>
  );
}
