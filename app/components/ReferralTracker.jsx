// app/components/ReferralTracker.jsx
"use client";
import { useEffect } from "react";

const REF_KEY = "referral_code";
const WRITE_FLAG = "referral_code_written"; // verhindert Mehrfach-Schreiben pro Session

function setCookie(name, value, days = 90) {
  try {
    const maxAge = days * 24 * 60 * 60;
    const secure = window.location.protocol === "https:" ? ";Secure" : "";
    document.cookie = `${name}=${encodeURIComponent(
      value
    )};path=/;max-age=${maxAge};SameSite=Lax${secure}`;
  } catch {
    /* ignore */
  }
}

export default function ReferralTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const url = new URL(window.location.href);
      const raw =
        url.searchParams.get("ref") || url.searchParams.get("utm_source");
      if (!raw || !raw.trim()) return;

      const normalized = raw.trim().toLowerCase();
      const safe = normalized.replace(/[^a-z0-9_-]/gi, "");
      if (!safe) return;

      if (sessionStorage.getItem(WRITE_FLAG) === "1") return;

      const existing = localStorage.getItem(REF_KEY);
      const cameWithExplicitRef =
        url.searchParams.has("ref") || url.searchParams.has("utm_source");

      if (!existing || cameWithExplicitRef) {
        localStorage.setItem(REF_KEY, safe);
        setCookie(REF_KEY, safe, 90);
        sessionStorage.setItem(WRITE_FLAG, "1");
      }
    } catch {
      // still render app if URL parsing fails
    }
  }, []);

  return null;
}
