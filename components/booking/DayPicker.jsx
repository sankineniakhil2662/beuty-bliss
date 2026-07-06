"use client";

// July 2026 calendar grid. Sundays & Mondays are closed (off). Day 9 is
// flagged "today" to match the mockup. Selection state lives in BookingWizard.
const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export default function DayPicker({ selectedDate, onSelect }) {
  const cells = [];

  DOW.forEach((d) => cells.push(<div key={"h-" + d} className="dh">{d}</div>));

  // July 1, 2026 falls on a Wednesday → 3 leading blanks (Su, Mo, Tu).
  for (let i = 0; i < 3; i++) cells.push(<div key={"blank-" + i}></div>);

  for (let d = 1; d <= 31; d++) {
    const dow = new Date(2026, 6, d).getDay();
    const off = dow === 0 || dow === 1;
    const cls =
      "day" +
      (off ? " off" : "") +
      (d === 9 ? " today" : "") +
      (selectedDate === d ? " sel" : "");
    cells.push(
      <div
        key={d}
        className={cls}
        onClick={off ? undefined : () => onSelect(d)}
      >
        {d}
      </div>
    );
  }

  return <div className="daygrid">{cells}</div>;
}
