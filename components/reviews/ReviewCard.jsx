import { Check } from "lucide-react";
import ReviewPhoto from "./ReviewPhoto";
import StarRating from "./StarRating";

// A single public review card. `review` uses the mockup aliases: nm, svc, r, t,
// photos (optional).
export default function ReviewCard({ review: r }) {
  return (
    <div className="rev-card">
      <span className="verified">
        <Check size={12} /> Verified
      </span>
      <div className="stars">
        <StarRating rating={r.r} />
      </div>
      <p>&ldquo;{r.t}&rdquo;</p>
      {r.photos && r.photos.length > 0 && (
        <div className="rphotos">
          {r.photos.map((p, i) => (
            <ReviewPhoto key={i} photo={p} />
          ))}
        </div>
      )}
      <div className="who">
        <div className="av">{r.nm[0]}</div>
        <div>
          <b>{r.nm}</b>
          <span>{r.svc}</span>
        </div>
      </div>
    </div>
  );
}
