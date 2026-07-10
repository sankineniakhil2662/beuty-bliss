"use client";

// Reusable `.banner.ok`/`.banner.err` with a dismiss ×, matching the mockup's
// #bkBanner/#revBanner pattern. Renders nothing when there's no message —
// visibility is owned by the parent's state.
export default function Banner({ type = "ok", message, onDismiss }) {
  if (!message) return null;
  return (
    <div className={"banner " + type}>
      {type === "ok" ? "✅" : "⚠"} <span>{message}</span>
      {onDismiss && (
        <span className="x" onClick={onDismiss}>
          ×
        </span>
      )}
    </div>
  );
}
