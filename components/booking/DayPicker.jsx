"use client";

const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// Renders the calendar grid for the given year/month (0-indexed, same as
// Date). Sundays, Mondays, and any day already in the past are disabled.
// Selection state lives in BookingWizard.
export default function DayPicker({ year, month, selectedDate, onSelect }) {
  const cells = [];
  const now = new Date();
  const isCurrentMonth = year === now.getFullYear() && month === now.getMonth();
  const todayDate = now.getDate();

  DOW.forEach((d) => cells.push(<div key={"h-" + d} className="dh">{d}</div>));

  const firstWeekday = new Date(year, month, 1).getDay();
  for (let i = 0; i < firstWeekday; i++) cells.push(<div key={"blank-" + i}></div>);

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= daysInMonth; d++) {
    const dow = new Date(year, month, d).getDay();
    const isPast = isCurrentMonth && d < todayDate;
    const off = dow === 0 || dow === 1 || isPast;
    const isToday = isCurrentMonth && d === todayDate;
    const cls =
      "day" +
      (off ? " off" : "") +
      (isToday ? " today" : "") +
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
