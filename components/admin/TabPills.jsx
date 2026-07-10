"use client";

// Generic `.tab-pills` switcher — controlled by the parent (matches the
// same controlled-component convention as components/services/ServiceFilters.jsx).
export default function TabPills({ tabs, active, onChange }) {
  return (
    <div className="tab-pills">
      {tabs.map((t) => (
        <button
          key={t.key}
          className={t.key === active ? "active" : undefined}
          onClick={() => onChange(t.key)}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}
