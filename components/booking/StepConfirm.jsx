"use client";

import { Fragment } from "react";

// Step 4: review & confirm. Derives display strings from props; the consent
// checkbox and submit gating are owned by BookingWizard.
export default function StepConfirm({
  details,
  lines,
  total,
  selectedDate,
  agree,
  onAgreeChange,
  showError,
  onBack,
  onSubmit,
}) {
  const dayLabel =
    selectedDate != null
      ? new Date(2026, 6, selectedDate).toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "";

  return (
    <div>
      <h2 className="serif" style={{ fontSize: 30, marginBottom: 6 }}>
        Review &amp; confirm
      </h2>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>
        Check the details below, then send your request.
      </p>

      <div
        style={{
          background: "#fdfbf7",
          border: "1px solid var(--line)",
          borderRadius: 14,
          padding: 20,
          marginBottom: 18,
        }}
      >
        <div className="ss-line">
          <span>Name</span>
          <b>{details.name}</b>
        </div>
        <div className="ss-line">
          <span>Contact</span>
          <b>
            {details.email} · {details.phone}
          </b>
        </div>
        <div className="ss-line" style={{ alignItems: "flex-start" }}>
          <span>Services</span>
          <b style={{ textAlign: "right" }}>
            {lines.map((l, i) => (
              <Fragment key={l.name}>
                {l.name}
                {l.qty > 1 ? ` ×${l.qty}` : ""}
                {i < lines.length - 1 ? <br /> : null}
              </Fragment>
            ))}
          </b>
        </div>
        <div className="ss-line">
          <span>Preferred day</span>
          <b>{dayLabel}</b>
        </div>
        <div
          className="ss-line"
          style={{
            borderTop: "1px solid var(--line)",
            marginTop: 6,
            paddingTop: 12,
          }}
        >
          <span>Estimated total</span>
          <b style={{ color: "var(--rose-deep)", fontSize: 18 }}>CA${total}</b>
        </div>
      </div>

      <div className="pay-note">
        💳{" "}
        <div>
          <b>Payment after service.</b> Nothing is charged now. You&apos;ll pay
          in person once your treatment is complete.
        </div>
      </div>

      <label
        style={{
          display: "flex",
          gap: 10,
          alignItems: "flex-start",
          margin: "18px 0",
          fontSize: 13,
          color: "#6f655c",
          cursor: "pointer",
        }}
      >
        <input
          type="checkbox"
          style={{ width: "auto", marginTop: 3 }}
          checked={agree}
          onChange={(e) => onAgreeChange(e.target.checked)}
        />{" "}
        I understand Sruthi will contact me to confirm the exact appointment
        time.
      </label>

      {showError && (
        <div className="banner err">
          ⚠ Please confirm you understand the follow-up step.
        </div>
      )}

      <div className="form-actions">
        <button className="btn-prev" onClick={onBack}>
          ← Back
        </button>
        <button className="btn-next" onClick={onSubmit}>
          Send Request
        </button>
      </div>
    </div>
  );
}
