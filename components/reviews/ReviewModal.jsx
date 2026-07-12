"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import ReviewPhoto from "./ReviewPhoto";
import StarRating from "./StarRating";

const CLOSE_ANIM_MS = 180;

// Full-review popup opened from a card's "Read More". Rendered via a portal
// so it isn't clipped by the card grid, and only mounted while open (see
// ReviewCard) so it costs nothing when closed. Closing plays a short
// fade/scale-out (via the `closing` class) before the parent actually
// unmounts it, and returns focus to whatever opened it.
export default function ReviewModal({ review: r, onClose, returnFocusRef }) {
  const [closing, setClosing] = useState(false);
  const dialogRef = useRef(null);

  function requestClose() {
    setClosing(true);
    setTimeout(onClose, CLOSE_ANIM_MS);
  }
  // Kept current after every render (in an effect, not render itself) so the
  // mount-only effect below can always call the latest close logic without
  // needing to re-run on every render.
  const requestCloseRef = useRef(requestClose);
  useEffect(() => {
    requestCloseRef.current = requestClose;
  });

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const elementToRefocus = returnFocusRef?.current ?? previouslyFocused;
    dialogRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === "Escape") requestCloseRef.current();
    };
    document.addEventListener("keydown", onKeyDown);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
      elementToRefocus?.focus?.();
    };
  }, [returnFocusRef]);

  const formattedDate = r.date
    ? new Date(r.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return createPortal(
    <div
      className={"review-modal-overlay" + (closing ? " closing" : "")}
      onClick={(e) => {
        if (e.target === e.currentTarget) requestClose();
      }}
    >
      <div
        className="review-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="review-modal-name"
        ref={dialogRef}
        tabIndex={-1}
      >
        <button
          type="button"
          className="review-modal-close"
          onClick={requestClose}
          aria-label="Close"
        >
          <X size={18} />
        </button>

        <div className="stars">
          <StarRating rating={r.r} size={18} />
        </div>

        <p className="review-modal-text">&ldquo;{r.t}&rdquo;</p>

        {r.photos && r.photos.length > 0 && (
          <div className="rphotos review-modal-photos">
            {r.photos.map((p, i) => (
              <ReviewPhoto key={i} photo={p} />
            ))}
          </div>
        )}

        <div className="who">
          <div className="av">{r.nm[0]}</div>
          <div>
            <b id="review-modal-name">{r.nm}</b>
            <span>{r.svc}</span>
          </div>
        </div>

        {formattedDate && <div className="review-modal-date">{formattedDate}</div>}
      </div>
    </div>,
    document.body
  );
}
