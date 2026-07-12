"use client";

import { AlertTriangle } from "lucide-react";
import ServicePickRow from "./ServicePickRow";

// Step 1: multi-service picker. All cart state lives in BookingWizard.
export default function StepServices({
  services,
  cart,
  onAdd,
  onInc,
  onDec,
  showError,
  onContinue,
}) {
  return (
    <div>
      <h2 className="serif" style={{ fontSize: 30, marginBottom: 6 }}>
        Choose your treatments
      </h2>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 22 }}>
        Add one or more services. Use + and − to set how many of each you&apos;d
        like.
      </p>

      <div className="svc-pick">
        {services.map((s) => (
          <ServicePickRow
            key={s.id ?? s.n}
            service={s}
            qty={cart[s.n] || 0}
            onAdd={onAdd}
            onInc={onInc}
            onDec={onDec}
          />
        ))}
      </div>

      {showError && (
        <div className="banner err" style={{ marginTop: 14 }}>
          <AlertTriangle size={16} /> Please add at least one service to
          continue.
        </div>
      )}

      <div className="form-actions">
        <span></span>
        <button className="btn-next" onClick={onContinue}>
          Continue →
        </button>
      </div>
    </div>
  );
}
