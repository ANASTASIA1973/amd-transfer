"use client";

import { useState } from "react";
import {
  WizardLayout,
  FormCard,
  Section,
} from "../components/BookingComponents";

export default function BookingWizard() {
  const [step, setStep] = useState(1);
  const totalSteps = 6;
  const titles = [
    "Abholort & Zielort",
    "Passagiere & Fahrzeug",
    "Fahrzeug wählen",
    "Kindersitze",
    "Weitere Extras",
    "Zusammenfassung & Buchung",
  ];

  const onNext = () => setStep((s) => Math.min(s + 1, totalSteps));
  const onBack = () => setStep((s) => Math.max(s - 1, 1));

  const renderContent = () => {
    switch (step) {
      case 1:
        return (
          <FormCard>
            {/* Schritt 1: Abholort & Zielort */}
            {/* hier dein Pickup/Dropoff-Markup einfügen */}
          </FormCard>
        );
      case 2:
        return (
          <FormCard>
            {/* Schritt 2: Passagiere & Fahrzeug */}
            {/* hier deinen Adults/Kids-Counter einfügen */}
          </FormCard>
        );
      case 3:
        return (
          <Section title="Fahrzeug wählen">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* hier deine Fahrzeuge mit <SelectableCard> mappen */}
            </div>
          </Section>
        );
      case 4:
        return (
          <Section title="Kindersitze">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* hier deine Kindersitz-Items mit <SelectableCard> mappen */}
            </div>
          </Section>
        );
      case 5:
        return (
          <Section title="Weitere Extras">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {/* hier deine Extras mit <SelectableCard> mappen */}
            </div>
          </Section>
        );
      case 6:
        return (
          <Section title="Zusammenfassung & Buchung">
            {/* Schritt 6: Buchungsübersicht und -buttons */}
          </Section>
        );
      default:
        return null;
    }
  };

  return (
    <WizardLayout step={step} totalSteps={totalSteps} title={titles[step - 1]}>
      {renderContent()}

      <div className="flex justify-between mt-6">
        <button
          onClick={onBack}
          disabled={step === 1}
          className="btn btn-secondary"
        >
          Zurück
        </button>
        <button onClick={onNext} className="btn btn-primary">
          {step === totalSteps ? "Buchen" : "Weiter"}
        </button>
      </div>
    </WizardLayout>
  );
}
