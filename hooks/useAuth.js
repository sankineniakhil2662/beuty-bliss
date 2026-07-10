"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

// Admin auth state. Returns the current Firebase user (or null), a loading flag
// while the initial auth state resolves, and a logout helper.
export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      setLoading(false); // auth not configured → treat as logged out
      return;
    }
    const unsub = onAuthStateChanged(
      auth,
      (u) => {
        setUser(u);
        setLoading(false);
      },
      () => setLoading(false) // error (e.g. misconfig) → treat as logged out
    );
    return unsub;
  }, []);

  const logout = () => {
    const auth = getFirebaseAuth();
    return auth ? signOut(auth) : Promise.resolve();
  };

  // Whether Firebase Auth could initialize at all (false when config is missing).
  const configured = !!getFirebaseAuth();

  return { user, loading, logout, configured };
}
