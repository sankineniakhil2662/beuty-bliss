"use client";

import { useEffect, useState } from "react";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "./useAuth";

// Live counts for the sidebar badges: bookings still awaiting a response, and
// reviews still awaiting approval.
//
// onSnapshot rather than a one-off read on purpose — the badge is a to-do
// counter, so it has to fall the moment a booking is confirmed on another
// screen, and rise when a new request lands while Sruthi is elsewhere in the
// admin. A fetch-once count would sit there stale until a full reload.
//
// Both queries are a single equality filter, so neither needs a composite index.
export function useAdminCounts() {
  const { user } = useAuth();
  const [counts, setCounts] = useState({ bookings: 0, reviews: 0 });

  useEffect(() => {
    // Firestore rules reject these reads for anyone who isn't an admin, so
    // don't even subscribe until we have a signed-in user.
    if (!user) {
      setCounts({ bookings: 0, reviews: 0 });
      return;
    }

    const watch = (key, path, status) =>
      onSnapshot(
        query(collection(db, path), where("status", "==", status)),
        (snap) => setCounts((c) => ({ ...c, [key]: snap.size })),
        // Offline or permission-denied: show no badge rather than a wrong one.
        // The screens themselves surface the real error.
        () => setCounts((c) => ({ ...c, [key]: 0 }))
      );

    const unsubs = [
      watch("bookings", "bookings", "requested"),
      watch("reviews", "reviews", "pending"),
    ];
    return () => unsubs.forEach((unsub) => unsub());
  }, [user]);

  return counts;
}
