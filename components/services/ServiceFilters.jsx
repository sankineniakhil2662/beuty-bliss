"use client";

// Category filter pills (presentational). Controlled by the parent:
// `active` is the selected category, `onSelect(category)` fires on click.
export default function ServiceFilters({ categories, active, onSelect }) {
  return (
    <div className="filters">
      {categories.map((c) => (
        <button
          key={c}
          className={c === active ? "active" : undefined}
          onClick={() => onSelect(c)}
        >
          {c}
        </button>
      ))}
    </div>
  );
}
