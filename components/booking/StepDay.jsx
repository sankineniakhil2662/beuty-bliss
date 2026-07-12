"use client";

import { AlertTriangle, ChevronLeft, ChevronRight, Circle, X } from "lucide-react";
import DayPicker from "./DayPicker";

// Step 3: pick a preferred day within the current month. The prev/next
// arrows are decorative — this is a single-month view by design.
export default function StepDay({
  year,
  month,
  selectedDate,
  onSelectDate,
  showError,
  onBack,
  onReview,
}) {
  const monthLabel = new Date(year, month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

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
          <ChevronLeft size={14} />
        </button>
        <b className="serif" style={{ fontSize: 22 }}>
          {monthLabel}
        </b>
        <button className="btn-prev" style={{ padding: "8px 14px", fontSize: 12 }}>
          <ChevronRight size={14} />
        </button>
      </div>

      <DayPicker
        year={year}
        month={month}
        selectedDate={selectedDate}
        onSelect={onSelectDate}
      />

      <div
        style={{
          display: "flex",
          gap: 18,
          marginTop: 16,
          fontSize: 11.5,
          color: "var(--muted)",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Circle size={10} fill="var(--gold)" color="var(--gold)" /> Selected
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Circle size={10} color="#cabfb3" /> Available
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <X size={12} color="#cabfb3" /> Closed (Sun/Mon)
        </span>
      </div>

      {showError && (
        <div className="banner err" style={{ marginTop: 16 }}>
          <AlertTriangle size={16} /> Please select a day to continue.
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
