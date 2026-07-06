"use client";

import DayPicker from "./DayPicker";

// Step 3: pick a preferred day. Month is fixed to July 2026 (mockup); the
// arrows are decorative for now.
export default function StepDay({
  selectedDate,
  onSelectDate,
  showError,
  onBack,
  onReview,
}) {
  return (
    <div>
      <h2 className="serif" style={{ fontSize: 30, marginBottom: 6 }}>
        Choose your preferred day
      </h2>
      <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 8 }}>
        Pick the day that works for you. Sruthi will call to lock in the exact
        time.
      </p>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          margin: "18px 0 4px",
        }}
      >
        <button className="btn-prev" style={{ padding: "8px 14px", fontSize: 12 }}>
          ‹
        </button>
        <b className="serif" style={{ fontSize: 22 }}>
          July 2026
        </b>
        <button className="btn-prev" style={{ padding: "8px 14px", fontSize: 12 }}>
          ›
        </button>
      </div>

      <DayPicker selectedDate={selectedDate} onSelect={onSelectDate} />

      <div
        style={{
          display: "flex",
          gap: 18,
          marginTop: 16,
          fontSize: 11.5,
          color: "var(--muted)",
        }}
      >
        <span>🟡 Selected</span>
        <span>⚪ Available</span>
        <span>❌ Closed (Sun/Mon)</span>
      </div>

      {showError && (
        <div className="banner err" style={{ marginTop: 16 }}>
          ⚠ Please select a day to continue.
        </div>
      )}

      <div className="form-actions">
        <button className="btn-prev" onClick={onBack}>
          ← Back
        </button>
        <button className="btn-next" onClick={onReview}>
          Review Request →
        </button>
      </div>
    </div>
  );
}
