"use client";

/* =========================================================================
 * TEMPORARY — Facebook review migration date picker.
 *
 * Lets an admin backfill the *original* date of a review being imported
 * from Facebook (rather than the date it happens to be entered on this
 * site). Delete this file once the migration is finished — nothing else
 * depends on it. Its only other touch points are the clearly-marked TEMP
 * blocks in ReviewForm.jsx and lib/reviews.js.
 * ========================================================================= */

import { useEffect, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
// How many years back the picker offers. Facebook business pages rarely
// predate this — bump it if an older backlog needs importing.
const YEARS_BACK = 25;

function sameDay(a, b) {
  return (
    !!a && !!b &&
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// value/onChange carry plain Date objects at local midnight — simple to
// compare for the calendar UI. lib/reviews.js re-anchors it to UTC when
// writing to Firestore so the picked day survives timezone conversion.
export default function TempReviewDatePicker({ value, onChange }) {
  const today = new Date();
  const initial = value || today;
  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const wrapRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    function onDocClick(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    }
    function onKeyDown(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onDocClick);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const isCurrentYear = viewYear === today.getFullYear();
  const maxMonth = isCurrentYear ? today.getMonth() : 11;
  const years = Array.from({ length: YEARS_BACK + 1 }, (_, i) => today.getFullYear() - i);
  const months = MONTHS.map((m, i) => ({ label: m, value: i })).filter(
    (m) => m.value <= maxMonth
  );

  function goPrevMonth() {
    if (viewMonth === 0) {
      setViewYear((y) => y - 1);
      setViewMonth(11);
    } else {
      setViewMonth((m) => m - 1);
    }
  }
  function goNextMonth() {
    if (viewMonth === 11) {
      setViewYear((y) => y + 1);
      setViewMonth(0);
    } else {
      setViewMonth((m) => m + 1);
    }
  }
  const canGoNext = viewYear < today.getFullYear() || viewMonth < maxMonth;

  function pickYear(y) {
    setViewYear(y);
    if (y === today.getFullYear() && viewMonth > today.getMonth()) {
      setViewMonth(today.getMonth());
    }
  }

  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  function selectDay(d) {
    onChange(new Date(viewYear, viewMonth, d));
    setOpen(false);
  }

  const label = value
    ? value.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
    : "Select a date";

  return (
    <div className="temp-date-field" ref={wrapRef}>
      <button
        type="button"
        className={"temp-date-trigger" + (open ? " open" : "")}
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="dialog"
        aria-expanded={open}
      >
        <Calendar size={16} strokeWidth={1.5} />
        <span className={value ? undefined : "temp-date-placeholder"}>{label}</span>
      </button>

      {open && (
        <div className="temp-date-pop" role="dialog" aria-label="Choose a review date">
          <div className="temp-date-nav">
            <button
              type="button"
              className="temp-date-arrow"
              onClick={goPrevMonth}
              aria-label="Previous month"
            >
              <ChevronLeft size={14} />
            </button>
            <div className="temp-date-selects">
              <select
                value={viewMonth}
                onChange={(e) => setViewMonth(Number(e.target.value))}
                aria-label="Month"
              >
                {months.map((m) => (
                  <option key={m.value} value={m.value}>{m.label}</option>
                ))}
              </select>
              <select
                value={viewYear}
                onChange={(e) => pickYear(Number(e.target.value))}
                aria-label="Year"
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>
            <button
              type="button"
              className="temp-date-arrow"
              onClick={goNextMonth}
              disabled={!canGoNext}
              aria-label="Next month"
            >
              <ChevronRight size={14} />
            </button>
          </div>

          <div className="daygrid">
            {DOW.map((d) => (
              <div key={d} className="dh">{d}</div>
            ))}
            {cells.map((d, i) => {
              if (d === null) return <div key={"b" + i} />;
              const cellDate = new Date(viewYear, viewMonth, d);
              const future = cellDate > today;
              const cls =
                "day" +
                (future ? " off" : "") +
                (sameDay(cellDate, today) ? " today" : "") +
                (sameDay(cellDate, value) ? " sel" : "");
              return (
                <div
                  key={d}
                  className={cls}
                  onClick={future ? undefined : () => selectDay(d)}
                >
                  {d}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
