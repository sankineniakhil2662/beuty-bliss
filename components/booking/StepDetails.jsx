"use client";

import ConsultationForm from "./ConsultationForm";

// fieldState[x] is one of: undefined/null (untouched), "ok", "error".
function fieldClass(state) {
  return "field" + (state === "error" ? " error" : state === "ok" ? " ok" : "");
}

// Step 2: contact details + the consultation form. All values live in
// BookingWizard.
export default function StepDetails({
  details,
  onDetailChange,
  fieldState,
  consultation,
  onConsultChange,
  onToggleConcern,
  consultOpen,
  onToggleConsult,
  onBack,
  onContinue,
}) {
  return (
    <div>
      <h2 className="serif" style={{ fontSize: 30, marginBottom: 6 }}>
        Your details
      </h2>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>
        We&apos;ll use this to confirm your appointment and follow up on timing.
      </p>

      <div className={fieldClass(fieldState.name)}>
        <label>
          Full Name <span className="req">*</span>
        </label>
        <input
          placeholder="e.g. Priya Sharma"
          value={details.name}
          onChange={(e) => onDetailChange("name", e.target.value)}
        />
        <div className="errmsg">⚠ Please enter your full name</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 90px", gap: 14 }}>
        <div className={fieldClass(fieldState.email)}>
          <label>
            Email <span className="req">*</span>
          </label>
          <input
            placeholder="you@email.com"
            value={details.email}
            onChange={(e) => onDetailChange("email", e.target.value)}
          />
          <div className="errmsg">⚠ Enter a valid email</div>
        </div>
        <div className={fieldClass(fieldState.phone)}>
          <label>
            Phone <span className="req">*</span>
          </label>
          <input
            placeholder="306-000-0000"
            value={details.phone}
            onChange={(e) => onDetailChange("phone", e.target.value)}
          />
          <div className="errmsg">⚠ Enter a valid phone</div>
        </div>
        <div className="field">
          <label>Age</label>
          <input
            placeholder="--"
            value={details.age}
            onChange={(e) => onDetailChange("age", e.target.value)}
          />
        </div>
      </div>

      <div
        className={"consult-toggle" + (consultOpen ? " open" : "")}
        onClick={onToggleConsult}
      >
        <div>
          <b>✨ Facial Consultation Form</b>
          <span style={{ display: "block" }}>
            Helps Sruthi tailor your treatment safely. Takes ~1 minute.
          </span>
        </div>
        <div className="chev">▾</div>
      </div>

      {consultOpen && (
        <ConsultationForm
          value={consultation}
          onChange={onConsultChange}
          onToggleConcern={onToggleConcern}
        />
      )}

      <div className="form-actions">
        <button className="btn-prev" onClick={onBack}>
          ← Back
        </button>
        <button className="btn-next" onClick={onContinue}>
          Continue →
        </button>
      </div>
    </div>
  );
}
