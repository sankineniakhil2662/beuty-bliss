import StarRating from "./StarRating";

// The "4.9 ★★★★★ / Based on N verified reviews" block on the Reviews page.
export default function RatingSummary({
  score = "4.9",
  sub = "Based on 87 verified reviews",
}) {
  return (
    <div className="rating-summary">
      <div>
        <div className="big">{score}</div>
        <div className="rs-stars">
          <StarRating rating={5} size={22} />
        </div>
        <div className="rs-sub">{sub}</div>
      </div>
    </div>
  );
}
