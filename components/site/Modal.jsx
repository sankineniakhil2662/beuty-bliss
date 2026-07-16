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
export default function Modal({
  onClose,
  labelledBy,
  returnFocusRef,
  dialogClassName,
  children,
}) {
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
    // preventScroll so focusing never nudges the page — critical on close, where
    // re-focusing the (possibly off-screen) trigger would otherwise scroll it
    // into view and override the restored scroll position.
    dialogRef.current?.focus({ preventScroll: true });

    const onKeyDown = (e) => {
      if (e.key === "Escape") requestCloseRef.current();
    };
    document.addEventListener("keydown", onKeyDown);

    // Scroll lock that holds on every engine, iOS Safari included. Pinning the
    // body with position:fixed (rather than overflow:hidden) is the only
    // approach that also blocks touch/overscroll on iOS and isn't defeated by
    // this app's `html { overflow-x: clip }` — which stops body's overflow from
    // propagating to the viewport, so overflow:hidden on body did nothing. While
    // pinned the document has no scrollable overflow, so wheel, touch, keyboard
    // (Space/PageUp/Down/Arrows) and overscroll all have nothing to move. The
    // negative top offset keeps the page visually in place; the padding replaces
    // the vanished scrollbar so nothing shifts sideways.
    const { body } = document;
    const scrollY = window.scrollY;
    const scrollbarW = window.innerWidth - document.documentElement.clientWidth;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    if (scrollbarW > 0) body.style.paddingRight = `${scrollbarW}px`;

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      body.style.paddingRight = prev.paddingRight;
      // Restore the exact pre-open scroll position in the same frame the pin is
      // removed, so there's no jump or flicker.
      // Force an instant jump back: the app sets `html { scroll-behavior:
      // smooth }`, which would otherwise animate this restore — unpinning drops
      // the page to the top for a frame and then smooth-scrolls down, a visible
      // flicker. Overriding scroll-behavior inline (rather than relying on
      // behavior:"instant") keeps it snap-exact on every browser.
      const html = document.documentElement;
      const prevScrollBehavior = html.style.scrollBehavior;
      html.style.scrollBehavior = "auto";
      window.scrollTo(0, scrollY);
      html.style.scrollBehavior = prevScrollBehavior;
      elementToRefocus?.focus?.({ preventScroll: true });
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
        className={"review-modal" + (dialogClassName ? ` ${dialogClassName}` : "")}
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
          <X size={18} strokeWidth={1.5} />
        </button>

        {/* Only this inner wrapper scrolls, so the close button above (pinned to
            the non-scrolling dialog box) never scrolls out of view. */}
        <div className="review-modal-scroll">{children}</div>
      </div>
    </div>,
    document.body
  );
}
