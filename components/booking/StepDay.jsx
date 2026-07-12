"use client";

import { AlertTriangle, ChevronLeft, ChevronRight, Circle } from "lucide-react";
import DayPicker from "./DayPicker";

// Step 3: pick a preferred day. The prev/next arrows page the single-month
// view backward/forward; navigating past months is blocked since a past day
// can't be booked.
export default function StepDay({
  year,
  month,
  selectedDate,
  onSelectDate,
  onPrevMonth,
  onNextMonth,
  canGoPrevMonth,
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
      <h2 className="step-head">
        Choose your preferred day
      </h2>
      <p className="step-sub" style={{ marginBottom: 8 }}>
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
        <button
          type="button"
          className="btn-prev"
          style={{ padding: "8px 14px", fontSize: 12 }}
          onClick={onPrevMonth}
          disabled={!canGoPrevMonth}
          aria-label="Previous month"
        >
          <ChevronLeft size={14} />
        </button>
        <b className="serif" style={{ fontSize: 22 }}>
          {monthLabel}
        </b>
        <button
          type="button"
          className="btn-prev"
          style={{ padding: "8px 14px", fontSize: 12 }}
          onClick={onNextMonth}
          aria-label="Next month"
        >
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
          Continue →
        </button>
      </div>
    </div>
  );
}
