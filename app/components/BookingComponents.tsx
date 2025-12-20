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
 onStepChange?: (n: number) => void;   // ✅ NEU
  stepTitles?: string[];                // ✅ NEU
}

export function WizardLayout({
  step,
  totalSteps,
  title,
  stepLabel,
  ofLabel,
  showTitle = true,
  children,
  onStepChange,       // ✅ NEU
  stepTitles,         // ✅ NEU
}: WizardLayoutProps) {

  const progress = Math.max(0, Math.min(100, (step / totalSteps) * 100));

  const SL = (stepLabel ?? "").trim() ? stepLabel.trim() : "Schritt";
const OL = (ofLabel ?? "").trim() ? ofLabel.trim() : "von";

const canJump = typeof onStepChange === "function" && totalSteps > 1;

const [open, setOpen] = React.useState(false);

React.useEffect(() => {
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape") setOpen(false);
  };
  const onClick = () => setOpen(false);
  if (open) {
    window.addEventListener("keydown", onKey);
    window.addEventListener("click", onClick);
  }
  return () => {
    window.removeEventListener("keydown", onKey);
    window.removeEventListener("click", onClick);
  };
}, [open]);
React.useEffect(() => {
  if (typeof window === "undefined") return;
  const onScroll = () => setOpen(false);
  window.addEventListener("scroll", onScroll, { passive: true });
  return () => window.removeEventListener("scroll", onScroll);
}, []);


  return (
    <div className="relative z-20 w-full max-w-3xl mx-auto px-3 sm:px-4 pt-8 sm:pt-10 pb-10">
      {/* Header + Progress */}
<div
  className="mb-6 relative z-40 sticky top-0"
style={{
  background: "var(--amd-bg,#f6f7fa)",
  paddingTop: "0.65rem",
  paddingBottom: "0.65rem",
  paddingLeft: "0.25rem",
  paddingRight: "0.25rem",
  borderBottom: "1px solid rgba(17,24,39,.08)",
  boxShadow: "0 10px 22px rgba(15,23,42,.05)",
}}

>

{/* spacer moved below sticky header */}




        {showTitle ? (
          <h2 className="text-xl sm:text-2xl font-semibold" style={{ color: "var(--amd-heading,#111827)" }}>
            {title}
          </h2>
        ) : (
          <div className="h-2" />
        )}
<div className="mt-2 flex items-start sm:items-center justify-between gap-3">
  <span
    className="text-sm font-semibold"
    style={{ color: "var(--amd-text,#111827)" }}
  >
    {SL} {step} {OL} {totalSteps}
  </span>

  <div className="flex items-center gap-2">
    <span
      className="tabular-nums text-sm font-semibold"
      style={{ color: "var(--amd-text-muted,#6b7280)" }}
    >
      {step}/{totalSteps}
    </span>

{canJump && (
  <div className="relative">
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        setOpen((v) => !v);
      }}
      className={[
        "inline-flex items-center gap-2",
        "rounded-full",
        "px-3.5 py-1.5",
        "text-sm font-semibold",
        "transition",
        "select-none",
        "border",
        "bg-white/70",
        "backdrop-blur",
        "hover:bg-white",
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-offset-2",
      ].join(" ")}
      style={{
        color: "var(--amd-heading,#111827)",
        borderColor: "rgba(17,24,39,.10)",
        boxShadow: "0 10px 22px rgba(15, 23, 42, 0.07)",
      }}
      aria-haspopup="menu"
      aria-expanded={open}
      aria-label="Schritt wählen"
    >
      <span className="tabular-nums" style={{ color: "var(--amd-text-muted,#6b7280)" }}>
        {step}/{totalSteps}
      </span>

      <span className="hidden sm:inline" style={{ color: "var(--amd-heading,#111827)" }}>
        {stepTitles?.[step - 1] ? stepTitles[step - 1] : `${step}. Schritt`}
      </span>

      <span aria-hidden="true" className="ml-0.5">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" style={{ opacity: 0.7 }}>
          <path
            d="M7 10l5 5 5-5"
            stroke="currentColor"
            strokeWidth="2.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </button>

    {open && (
      <div
        role="menu"
        onClick={(e) => e.stopPropagation()}
       className="absolute right-0 mt-2 w-[280px] rounded-2xl overflow-hidden border bg-white shadow-lg z-[9999]"

      style={{
  background: "#ffffff",
  borderColor: "rgba(17,24,39,.10)",
  boxShadow: "0 20px 50px rgba(15,23,42,.18)",
}}

      >
        <div
          className="px-3 py-2 text-xs font-semibold"
          style={{
            color: "var(--amd-text-muted,#6b7280)",
            background: "rgba(17,24,39,.03)",
            borderBottom: "1px solid rgba(17,24,39,.06)",
          }}
        >
          Schritt auswählen
        </div>

        <div className="max-h-[320px] overflow-auto">
          {Array.from({ length: totalSteps }, (_, i) => {
            const n = i + 1;
            const label = stepTitles?.[i] ? `${n}. ${stepTitles[i]}` : `${n}. Schritt`;
            const active = n === step;

            return (
              <button
                key={n}
                type="button"
                role="menuitem"
                onClick={() => {
                  setOpen(false);
                  onStepChange?.(n); // ✅ überall springen
                }}
                className="w-full text-left px-3.5 py-2.5 text-sm font-semibold transition"
                style={{
                  background: active ? "rgba(193,39,45,.08)" : "transparent",
                  color: "var(--amd-heading,#111827)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget.style.background =
                    active ? "rgba(193,39,45,.10)" : "rgba(17,24,39,.04)");
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget.style.background =
                    active ? "rgba(193,39,45,.08)" : "transparent");
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>
    )}
  </div>
)}

  </div>
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

      {/* Spacer: verhindert, dass Content “unter” Sticky klebt */}
      <div aria-hidden="true" className="h-3 sm:h-4" />

      {/* Content Card */}
      <div
       className="relative w-full max-w-3xl mx-auto box-border overflow-visible"

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
        border: `1px solid ${isSelected ? "rgba(193,39,45,.35)" : "var(--amd-border,#e5e7eb)"}`,
        boxShadow: isSelected ? "0 18px 40px rgba(15, 23, 42, 0.10)" : "0 10px 24px rgba(15, 23, 42, 0.06)",
        transform: isSelected ? "translateY(-1px)" : "none",
      }}
    >
      {children}
    </div>
  );
}
