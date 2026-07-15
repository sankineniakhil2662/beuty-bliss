"use client";

import { useRef, useState } from "react";
import { PenLine } from "lucide-react";
import Modal from "@/components/site/Modal";
import ReviewForm from "./ReviewForm";

// "Drop a review" call-to-action that opens the review form in a popup.
// The form is only mounted while the modal is open, so its state resets between
// openings — a half-filled abandoned form doesn't reappear later.
export default function ReviewFormModal() {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef(null);

  return (
    <div className="review-cta">
      <span className="eyebrow">Completed a treatment?</span>
      <h3 className="serif">Tell us how it went</h3>
      <p>
        Share your experience
      </p>
      <button
        ref={triggerRef}
        type="button"
        className="btn-gold"
        onClick={() => setOpen(true)}
      >
        <PenLine size={16} />
        Drop a review
      </button>

      {open && (
        <Modal
          onClose={() => setOpen(false)}
          returnFocusRef={triggerRef}
          labelledBy="review-form-title"
        >
          <ReviewForm bare titleId="review-form-title" />
        </Modal>
      )}
    </div>
  );
}
