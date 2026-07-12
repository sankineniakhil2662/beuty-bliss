"use client";

import { useState } from "react";
import { Star } from "lucide-react";

// Interactive 1–5 star rating. Controlled: `value` + `onChange(v)`.
export default function StarPicker({ value, onChange }) {
  const [hover, setHover] = useState(0);
  const active = hover || value;

  return (
    <div
      style={{ display: "inline-flex", gap: 6, cursor: "pointer" }}
      onMouseLeave={() => setHover(0)}
    >
      {[1, 2, 3, 4, 5].map((v) => (
        <Star
          key={v}
          data-v={v}
          size={30}
          color={v <= active ? "var(--gold)" : "#e0d6c8"}
          fill={v <= active ? "var(--gold)" : "none"}
          strokeWidth={v <= active ? 0 : 1.5}
          onMouseEnter={() => setHover(v)}
          onClick={() => onChange(v)}
        />
      ))}
    </div>
  );
}
