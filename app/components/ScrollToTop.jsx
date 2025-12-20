"use client";

import { useEffect } from "react";

export default function ScrollToTop({ trigger }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const forceTop = () => {
      try {
        // window
        window.scrollTo(0, 0);
        // iOS Fallbacks
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      } catch {}
    };

    // 1) sofort
    forceTop();

    // 2) iOS/Safari: nach Frames erzwingen (Adressleiste / Sticky Timing)
    requestAnimationFrame(() => {
      forceTop();
      requestAnimationFrame(() => {
        forceTop();
      });
    });

    // 3) Falls Wizard-Container existiert: sichtbar nach oben holen
    try {
      const el = document.querySelector("[data-wizard-scroll]");
      if (el) el.scrollIntoView({ block: "start" });
    } catch {}
  }, [trigger]);

  return null;
}
