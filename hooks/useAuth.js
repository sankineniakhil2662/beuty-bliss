"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";

// Admin auth state. Returns the current Firebase user (or null), a loading flag
// while the initial auth state resolves, and a logout helper.
export function useAuth() {
  const [user, setUser] = useState(null);
  // Lazy initial value (not an effect-driven setState): if auth can't
  // initialize at all, we're already done loading — there's nothing to wait
  // for. If it can, start loading until onAuthStateChanged fires once.
  const [loading, setLoading] = useState(() => !!getFirebaseAuth());

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) return; // handled by the initial state above
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
