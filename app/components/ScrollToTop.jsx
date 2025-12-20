import { useEffect } from "react";

export default function ScrollToTop({ trigger }) {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // iOS/Safari: smooth scroll kann ruckeln/ignoriert werden.
    // Strategie: 1) sofort auf 0 setzen, 2) im nächsten Frame nochmal erzwingen.
    const doInstant = () => {
      try {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      } catch {}
    };

    const doSmooth = () => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
      } catch {
        doInstant();
      }
    };

    // Erst smooth versuchen, dann fallback + frame-assert
    doSmooth();
    doInstant();
    requestAnimationFrame(() => doInstant());
  }, [trigger]);

  return null;
}
