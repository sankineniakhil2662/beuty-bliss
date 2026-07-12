"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AlertTriangle, Check, CheckCircle2, Lock } from "lucide-react";
import StarPicker from "./StarPicker";
import { getFirebaseStorage } from "@/lib/firebase";

// Secure one-time review flow. Validates the token via the server route, then
// lets the verified client submit a review + upload photos to Cloud Storage.
export default function TokenReview({ token }) {
  const [status, setStatus] = useState("loading"); // loading | valid | invalid | done
  const [info, setInfo] = useState(null);
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`/api/review/${token}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.valid) {
          setInfo(d);
          setStatus("valid");
        } else {
          setStatus("invalid");
        }
      })
      .catch(() => setStatus("invalid"));
  }, [token]);

  const onFiles = (e) => setFiles([...e.target.files].slice(0, 4));

  // Object URLs are derived from `files`, not separate state — computed once
  // per selection change (not on every unrelated re-render), with a
  // cleanup-only effect to revoke them so they don't leak.
  const previewUrls = useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files]
  );
  useEffect(() => {
    return () => previewUrls.forEach((u) => URL.revokeObjectURL(u));
  }, [previewUrls]);

  const submit = async () => {
    if (!text.trim()) {
      setError("Please write a review.");
      return;
    }
    setError(null);
    setSubmitting(true);
    try {
      let photoUrls = [];
      if (files.length) {
        const storage = getFirebaseStorage();
        if (!storage) throw new Error("Photo upload isn't available right now.");
        for (const [i, file] of files.entries()) {
          const r = ref(storage, `review-uploads/${token}/${Date.now()}-${i}-${file.name}`);
          await uploadBytes(r, file);
          photoUrls.push(await getDownloadURL(r));
        }
      }
      const res = await fetch(`/api/review/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, text, photoUrls }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Submission failed.");
      }
      setStatus("done");
    } catch (e) {
      setError(e.message || "Couldn't submit — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--cream2)",
        padding: "40px 22px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div style={{ width: "100%", maxWidth: 560 }}>
        <div className="brand" style={{ justifyContent: "center", marginBottom: 24 }}>
          <Image
            src="/BB.jpeg"
            alt="Beauty Bliss by Sruthi"
            width={162}
            height={108}
            style={{ height: 48, width: "auto" }}
          />
          <div className="bn">
            <b>Beauty Bliss</b>
            <span>by Sruthi</span>
          </div>
        </div>

        {status === "loading" && (
          <div className="card card-pad" style={{ textAlign: "center", color: "var(--muted)" }}>
            Checking your link…
          </div>
        )}

        {status === "invalid" && (
          <div className="card card-pad" style={{ textAlign: "center" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                color: "var(--rose-deep)",
                marginBottom: 10,
              }}
            >
              <Lock size={40} strokeWidth={1.5} />
            </div>
            <h3 className="serif" style={{ fontSize: 24, marginBottom: 8 }}>
              Link not valid
            </h3>
            <p style={{ color: "var(--muted)" }}>
              This review link is invalid or has already been used. If you
              completed a treatment, ask Sruthi for a fresh link.
            </p>
          </div>
        )}

        {status === "done" && (
          <div className="card card-pad">
            <div className="success-box">
              <div className="circle">
                <CheckCircle2 size={44} strokeWidth={1.5} />
              </div>
              <h2>Thank you!</h2>
              <p>
                Your review has been submitted. It appears on the site once
                Sruthi approves it.
              </p>
            </div>
          </div>
        )}

        {status === "valid" && (
          <div className="card card-pad">
            <div
              style={{
                fontSize: 11,
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                color: "var(--rose-deep)",
                fontWeight: 600,
                marginBottom: 6,
                display: "flex",
                alignItems: "center",
                gap: 5,
              }}
            >
              <Check size={13} /> Verified client
              {info.ref ? ` · ${info.ref}` : ""}
            </div>
            <h3 className="serif" style={{ fontSize: 26, marginBottom: 6 }}>
              Leave your review
            </h3>
            <p style={{ fontSize: 13.5, color: "var(--muted)", marginBottom: 20 }}>
              Hi {info.name || "there"} — how was your {info.service || "treatment"}?
            </p>

            <div className="field">
              <label>Your rating</label>
              <StarPicker value={rating} onChange={setRating} />
            </div>

            <div className="field">
              <label>Your review</label>
              <textarea
                rows="4"
                placeholder="Tell others about your experience…"
                value={text}
                onChange={(e) => setText(e.target.value)}
              />
            </div>

            <div className="field">
              <label>
                Add photos{" "}
                <span
                  style={{
                    color: "var(--muted)",
                    fontWeight: 400,
                    textTransform: "none",
                    letterSpacing: 0,
                  }}
                >
                  (optional — up to 4)
                </span>
              </label>
              <input type="file" accept="image/*" multiple onChange={onFiles} />
              {files.length > 0 && (
                <div className="img-previews">
                  {previewUrls.map((url, i) => (
                    <div key={i} className="img-thumb">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={url} alt="" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && (
              <div className="banner err" style={{ fontSize: 12.5 }}>
                <AlertTriangle size={16} /> {error}
              </div>
            )}

            <button
              className="btn-gold"
              style={{ width: "100%", justifyContent: "center" }}
              onClick={submit}
              disabled={submitting}
            >
              {submitting ? "Submitting…" : "Submit review"}
            </button>
            <p className="hint" style={{ textAlign: "center", marginTop: 12 }}>
              Your review appears once Sruthi approves it.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
