"use client";

import React from "react";

interface WizardLayoutProps {
  step: number;
  totalSteps: number;
  title: string;
  stepLabel: string;
  ofLabel: string;
  showTitle?: boolean;
  children: React.ReactNode;
}

export function WizardLayout({
  step,
  totalSteps,
  title,
  stepLabel,
  ofLabel,
  showTitle = true,
  children,
}: WizardLayoutProps) {
  const progress = Math.max(0, Math.min(100, (step / totalSteps) * 100));

  // ✅ Fallbacks, damit nie "leer" gerendert wird
  const SL = (stepLabel ?? "").trim() ? stepLabel.trim() : "Schritt";
  const OL = (ofLabel ?? "").trim() ? ofLabel.trim() : "von";

  return (
    // ✅ Wichtig: z-Index hoch, damit Google Map NICHT unter dem Hero-Overlay liegt
    <div className="relative z-20 w-full max-w-3xl mx-auto px-3 sm:px-4 pt-8 sm:pt-10 pb-10">
      {/* Header + Progress */}
      <div className="mb-6">
        {showTitle ? (
          <h2
            className="text-xl sm:text-2xl font-semibold"
            style={{ color: "var(--amd-heading,#111827)" }}
          >
            {title}
          </h2>
        ) : (
          <div className="h-2" />
        )}

        <div className="mt-2 flex items-center justify-between text-sm font-semibold">
          <span style={{ color: "var(--amd-text,#111827)" }}>
            {SL} {step} {OL} {totalSteps}
          </span>

          <span className="tabular-nums" style={{ color: "var(--amd-text-muted,#6b7280)" }}>
            {step}/{totalSteps}
          </span>
        </div>

        {/* Progress bar */}
        <div
          className="mt-2 h-[10px] rounded-full overflow-hidden"
          style={{
            background: "rgba(17,24,39,.08)",
            border: "1px solid var(--amd-border,#e5e7eb)",
            boxShadow: "inset 0 1px 2px rgba(15,23,42,.08)",
          }}
          aria-label="progress"
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${progress}%`,
              background: "var(--amd-primary,#c1272d)",
              boxShadow: "0 10px 20px rgba(193,39,45,.22)",
            }}
          />
        </div>
      </div>

      {/* Content Card */}
      <div
        className="relative w-full max-w-3xl mx-auto box-border overflow-hidden"
        style={{
          background: "var(--amd-card-bg,#ffffff)",
          border: "1px solid var(--amd-border,#e5e7eb)",
          borderRadius: "var(--amd-radius-lg,18px)",
          boxShadow: "var(--amd-shadow-card, 0 14px 30px rgba(15, 23, 42, 0.06))",
        }}
      >
        {/* Accent-Detail links */}
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 h-full w-[4px]"
          style={{
            background:
              "linear-gradient(180deg, rgba(193,39,45,.95) 0%, rgba(193,39,45,.55) 45%, rgba(193,39,45,.15) 100%)",
          }}
        />

        <div className="px-4 sm:px-6 py-6 sm:py-8">{children}</div>
      </div>
    </div>
  );
}

interface FormCardProps {
  children: React.ReactNode;
  className?: string;
}

export function FormCard({ children, className = "" }: FormCardProps) {
  return (
    <div
      className={["relative z-20 w-full max-w-3xl mx-auto box-border overflow-hidden", className].join(" ")}
      style={{
        background: "var(--amd-card-bg,#ffffff)",
        border: "1px solid var(--amd-border,#e5e7eb)",
        borderRadius: "var(--amd-radius-lg,18px)",
        boxShadow: "var(--amd-shadow-card, 0 14px 30px rgba(15, 23, 42, 0.06))",
      }}
    >
      <div className="px-4 sm:px-6 py-6 sm:py-8">{children}</div>
    </div>
  );
}

interface SectionProps {
  title?: string;
  children: React.ReactNode;
}

export function Section({ title, children }: SectionProps) {
  return (
    <section className="mb-8 w-full">
      {title && (
        <h3
          className="text-lg font-semibold pb-2 mb-4 text-center sm:text-left"
          style={{
            color: "var(--amd-heading,#111827)",
            borderBottom: "1px solid rgba(17,24,39,.10)",
          }}
        >
          {title}
        </h3>
      )}

      <div className="grid justify-items-center sm:justify-items-stretch gap-4">{children}</div>
    </section>
  );
}

interface SelectableCardProps {
  isSelected?: boolean;
  onClick?: () => void;
  className?: string;
  children: React.ReactNode;
}

export function SelectableCard({
  isSelected = false,
  onClick,
  className = "",
  children,
}: SelectableCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      className={[
        "w-full bg-white p-4",
        "flex flex-col items-center",
        "transition-all duration-200 cursor-pointer",
        "box-border overflow-hidden",
        className,
      ].join(" ")}
      style={{
        borderRadius: "var(--amd-radius-md,12px)",
        border: `1px solid ${
          isSelected ? "rgba(193,39,45,.35)" : "var(--amd-border,#e5e7eb)"
        }`,
        boxShadow: isSelected
          ? "0 18px 40px rgba(15, 23, 42, 0.10)"
          : "0 10px 24px rgba(15, 23, 42, 0.06)",
        transform: isSelected ? "translateY(-1px)" : "none",
      }}
    >
      {children}
    </div>
  );
}
