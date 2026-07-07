"use client";

import { useState } from "react";

// Interactive 1–5 star rating. Controlled: `value` + `onChange(v)`.
export default function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div
      style={{ fontSize: 30, letterSpacing: 6, color: "var(--gold)", cursor: "pointer" }}
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((v) => (
        <span
          key={v}
          data-v={v}
          style={{ color: v <= active ? "var(--gold)" : "#e0d6c8" }}
          onMouseEnter={() => setHover(v)}
          onClick={() => onChange(v)}
        >
          ★
        </span>
      ))}
    </div>
  );
}
