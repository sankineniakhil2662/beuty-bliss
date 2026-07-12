import { Star } from "lucide-react";

// Shared 5-star rating display (gold filled up to `rating`, outline for the
// rest). Used anywhere a review/rating score is rendered — replaces the old
// "★".repeat()/"☆".repeat() text-glyph pattern with real icons.
export default function StarRating({ rating = 0, size = 16 }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star
          key={n}
          size={size}
          fill={n <= rating ? "currentColor" : "none"}
          strokeWidth={n <= rating ? 0 : 1.5}
        />
      ))}
    </span>
  );
}
