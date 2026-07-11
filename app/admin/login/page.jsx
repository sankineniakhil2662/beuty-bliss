"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase";
import { useAuth } from "@/hooks/useAuth";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  // Already signed in → go to the dashboard.
  useEffect(() => {
    if (!loading && user) router.replace("/admin");
  }, [loading, user, router]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        setError("Auth isn't configured yet. Add Firebase config to .env.local.");
        return;
      }
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.replace("/admin");
    } catch {
      setError("Invalid email or password.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--cream2)",
        padding: 22,
      }}
    >
      <div className="card card-pad" style={{ width: "100%", maxWidth: 400 }}>
        <div
          className="brand"
          style={{ marginBottom: 18, justifyContent: "center" }}
        >
          <Image
            src="/BB.jpeg"
            alt="Beauty Bliss by Sruthi"
            width={162}
            height={108}
            style={{ height: 44, width: "auto" }}
          />
          <div className="bn">
            <b>Beauty Bliss</b>
            <span>Admin</span>
          </div>
        </div>
        <h2
          className="serif"
          style={{ fontSize: 24, marginBottom: 6, textAlign: "center" }}
        >
          Sign in
        </h2>
        <p
          style={{
            color: "var(--muted)",
            fontSize: 13.5,
            textAlign: "center",
            marginBottom: 22,
          }}
        >
          Studio owner access only.
        </p>

        <form onSubmit={onSubmit}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              autoComplete="username"
            />
          </div>
          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
            />
          </div>
          {error && (
            <div className="banner err" style={{ fontSize: 12.5 }}>
              ⚠ {error}
            </div>
          )}
          <button
            className="btn-gold"
            type="submit"
            disabled={submitting}
            style={{ width: "100%", justifyContent: "center" }}
          >
            {submitting ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}
