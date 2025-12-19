"use client";

import React from "react";

export default function StepIndicator({ step, totalSteps }) {
  const progress = Math.max(0, Math.min(100, (step / totalSteps) * 100));

  return (
    <div className="w-full">
      {/* progress row */}
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-[color:var(--amd-heading,#111827)]">
          Schritt {step} von {totalSteps}
        </span>

        <span className="text-xs font-semibold text-gray-500">
          {step}/{totalSteps}
        </span>
      </div>

      <div className="mt-2 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-200"
          style={{
            width: `${progress}%`,
            background: "var(--amd-primary, #c1272d)", // AMD Rot
          }}
        />
      </div>

      {/* subtle accent line (optional, very light) */}
      <div
        className="mt-4 h-px w-full"
        style={{ background: "rgba(27,111,90,0.18)" }} // Zedern-Grün, sehr dezent
      />
    </div>
  );
}
