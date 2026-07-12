"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { WifiOff, RotateCw } from "lucide-react";

// Shown when a Firestore read fails/times out — distinct from an "empty"
// result, so a connection problem never masquerades as "there's nothing here".
export default function LoadError({
  title = "Couldn't load this",
  message = "We couldn't reach the server. Check your internet connection and try again.",
}) {
  const router = useRouter();
  const [retrying, setRetrying] = useState(false);

  const retry = () => {
    setRetrying(true);
    router.refresh();
    setTimeout(() => setRetrying(false), 1500);
  };

  return (
    <div className="empty">
      <div className="ic">
        <WifiOff size={48} strokeWidth={1.5} />
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
      <button
        className="btn-gold"
        onClick={retry}
        disabled={retrying}
        style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
      >
        <RotateCw size={16} className={retrying ? "spin" : undefined} />
        {retrying ? "Retrying…" : "Retry"}
      </button>
    </div>
  );
}
