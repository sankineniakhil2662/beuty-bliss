"use client";

import { AlertTriangle, CheckCircle2, X } from "lucide-react";

// Reusable `.banner.ok`/`.banner.err` with a dismiss ×, matching the mockup's
// #bkBanner/#revBanner pattern. Renders nothing when there's no message —
// visibility is owned by the parent's state.
export default function Banner({ type = "ok", message, onDismiss }) {
  if (!message) return null;
  return (
    <div className={"banner " + type}>
      {type === "ok" ? <CheckCircle2 size={16} /> : <AlertTriangle size={16} />}{" "}
      <span>{message}</span>
      {onDismiss && (
        <span className="x" onClick={onDismiss}>
          <X size={14} />
        </span>
      )}
    </div>
  );
}
