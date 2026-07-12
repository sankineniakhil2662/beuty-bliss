"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, RotateCw } from "lucide-react";

// Last-resort boundary for anything a page didn't catch itself (the data pages
// handle their own Firestore failures inline with <LoadError>).
export default function Error({ error, reset, unstable_retry }) {
  useEffect(() => {
    console.error("Unhandled route error:", error);
  }, [error]);

  const retry = unstable_retry ?? reset;

  return (
    <div className="wrap">
      <div className="section">
        <div className="empty">
          <div className="ic">
            <AlertTriangle size={48} strokeWidth={1.5} />
          </div>
          <h3>Something went wrong</h3>
          <p>
            The page couldn&apos;t load. This is usually a temporary connection
            problem — please try again.
          </p>
          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <button
              className="btn-gold"
              onClick={() => retry()}
              style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
            >
              <RotateCw size={16} />
              Try again
            </button>
            <Link className="btn-ghost" href="/">
              Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
