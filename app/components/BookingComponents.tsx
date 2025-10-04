"use client";
import React from "react";

/* =========================
   WizardLayout
   ========================= */
interface WizardLayoutProps {
  step: number;
  totalSteps: number;
  title: string;
  children: React.ReactNode;
}
export function WizardLayout({
  step,
  totalSteps,
  title,
  children,
}: WizardLayoutProps) {
  const progress = (step / totalSteps) * 100;
  return (
    <div className="w-full max-w-3xl mx-auto px-3 sm:px-4 py-4">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-[#002147]">{title}</h2>
        <div className="h-1 bg-gray-200 rounded overflow-hidden mt-2">
          <div
            className="h-full bg-[#C09743] transition-all duration-200"
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="text-sm text-gray-500 mt-1 block">
          Schritt {step} von {totalSteps}
        </span>
      </div>

      {/* Weißes Innen-Panel, mobil zentriert & overflow-sicher */}
      <div className="w-full max-w-3xl mx-auto bg-white rounded-2xl shadow px-4 sm:px-6 py-6 sm:py-8 box-border overflow-hidden">
        {children}
      </div>
    </div>
  );
}

/* =========================
   FormCard
   ========================= */
interface FormCardProps {
  children: React.ReactNode;
  className?: string;
}
export function FormCard({ children, className = "" }: FormCardProps) {
  return (
    <div
      className={[
        "w-full max-w-3xl mx-auto",
        "bg-white rounded-2xl shadow-md border border-gray-200",
        "px-4 sm:px-6 py-6 sm:py-8",
        "box-border overflow-hidden",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}

/* =========================
   Section
   ========================= */
interface SectionProps {
  title?: string;
  children: React.ReactNode;
}
export function Section({ title, children }: SectionProps) {
  return (
    <section className="mb-8 w-full">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 border-b pb-1 mb-4 text-center sm:text-left">
          {title}
        </h3>
      )}

      {/* Wichtig für Mobile: Inhalte mittig, ab sm normal strecken */}
      <div className="grid justify-items-center sm:justify-items-stretch gap-4">
        {children}
      </div>
    </section>
  );
}

/* =========================
   SelectableCard
   ========================= */
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
      onClick={onClick}
      className={[
        "w-full",
        "group bg-white rounded-lg p-4",
        "flex flex-col items-center",
        "border transition-shadow duration-200 cursor-pointer",
        isSelected ? "border-[#C09743] shadow-md" : "border-gray-200 hover:shadow-lg",
        "box-border overflow-hidden",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}
