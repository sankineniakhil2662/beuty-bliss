"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

const CLOSE_ANIM_MS = 180;

// Modal shell: portal (so it isn't clipped by a card grid or an overflow
// ancestor), click-outside and Escape to close, body scroll lock, and focus
// returned to whatever opened it. Closing plays a short fade/scale-out via the
// `closing` class before the parent unmounts it.
//
// Extracted from ReviewModal so the "read a review" popup and the "leave a
// review" form popup share one implementation of this behaviour.
export default function Modal({ onClose, labelledBy, returnFocusRef, children }) {
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
        aria-labelledby={labelledBy}
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

        {children}
      </div>
    </div>,
    document.body
  );
}
