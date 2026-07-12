"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import ReviewPhoto from "./ReviewPhoto";
import StarRating from "./StarRating";
import ReviewModal from "./ReviewModal";

// A single public review card. `review` uses the mockup aliases: nm, svc, r, t,
// photos (optional), date (optional). The review text is CSS-clamped to a
// fixed number of lines so every card renders at the same height regardless
// of review length; "Read More" only appears when that clamp actually cuts
// text off (detected via the paragraph's scrollHeight, not a length guess),
// and opens the full review in a modal.
export default function ReviewCard({ review: r }) {
  const textRef = useRef(null);
  const triggerRef = useRef(null);
  const [truncated, setTruncated] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const el = textRef.current;
    if (!el) return;
    const check = () => setTruncated(el.scrollHeight > el.clientHeight + 1);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div className="rev-card">
      <span className="verified">
        <Check size={12} /> Verified
      </span>
      <div className="stars">
        <StarRating rating={r.r} />
      </div>
      <p ref={textRef} className="rev-text">
        &ldquo;{r.t}&rdquo;
      </p>
      {truncated && (
        <button
          type="button"
          ref={triggerRef}
          className="read-more"
          onClick={() => setOpen(true)}
        >
          Read More
        </button>
      )}
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

      {open && (
        <ReviewModal
          review={r}
          onClose={() => setOpen(false)}
          returnFocusRef={triggerRef}
        />
      )}
    </div>
  );
}
