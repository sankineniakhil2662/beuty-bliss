"use client";

import Modal from "@/components/site/Modal";
import ReviewPhoto from "./ReviewPhoto";
import StarRating from "./StarRating";

// Full-review popup opened from a card's "Read More". Only mounted while open
// (see ReviewCard) so it costs nothing when closed. The portal, Escape/
// click-outside handling, scroll lock and focus return all live in <Modal>.
export default function ReviewModal({ review: r, onClose, returnFocusRef }) {
  const formattedDate = r.date
    ? new Date(r.date).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <Modal
      onClose={onClose}
      returnFocusRef={returnFocusRef}
      labelledBy="review-modal-name"
    >
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
    </Modal>
  );
}
