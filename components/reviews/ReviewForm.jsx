"use client";

import { useEffect, useMemo, useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AlertTriangle, Camera, CheckCircle2, X } from "lucide-react";
import StarPicker from "./StarPicker";
import { submitReview } from "@/lib/reviews";
import { getFirebaseStorage } from "@/lib/firebase";

const MAX_PHOTOS = 4;
// Matches the 5MB ceiling in storage.rules — checked here too so an oversized
// file fails with a clear message instead of an opaque Storage rejection.
const MAX_BYTES = 5 * 1024 * 1024;

// "Leave a review" form. Submits a real review (status: pending) that appears
// in the admin Reviews screen for approval. If an `onSubmit` prop is provided
// (the token flow later), it's used instead of the direct write.
//
// `bare` drops the .card wrapper for use inside <Modal>, which already draws
// the card — nesting them would double the border, padding and shadow.
export default function ReviewForm({ onSubmit, bare = false, titleId }) {
  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [files, setFiles] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  // Previews are derived from `files` rather than held as separate state, so
  // they can't drift out of sync; the cleanup revokes them so they don't leak.
  const previewUrls = useMemo(
    () => files.map((f) => URL.createObjectURL(f)),
    [files]
  );
  useEffect(() => {
    return () => previewUrls.forEach((u) => URL.revokeObjectURL(u));
  }, [previewUrls]);

  const onFiles = (e) => {
    const picked = [...e.target.files];
    // Reset the input so removing a photo and re-picking the same file still
    // fires a change event.
    e.target.value = "";
    const tooBig = picked.find((f) => f.size > MAX_BYTES);
    if (tooBig) {
      setError(`"${tooBig.name}" is larger than 5MB. Please pick a smaller image.`);
      return;
    }
    setError(null);
    setFiles((prev) => [...prev, ...picked].slice(0, MAX_PHOTOS));
  };

  const removePhoto = (i) => setFiles((p) => p.filter((_, idx) => idx !== i));

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Please add your name.");
      return;
    }
    if (!text.trim()) {
      setError("Please write a short review.");
      return;
    }
    setError(null);
    setSubmitting(true);

    try {
      // Upload first: a review should never be saved pointing at photos that
      // failed to upload.
      let photos = [];
      if (files.length) {
        const storage = getFirebaseStorage();
        if (!storage) throw new Error("Photo upload isn't available right now.");
        // The token flow uploads under review-uploads/{token}/. This form has no
        // token, so a random folder id keeps each submission's photos separate
        // while satisfying the same storage rule.
        const folder = `public-${crypto.randomUUID()}`;
        for (const [i, file] of files.entries()) {
          const r = ref(
            storage,
            `review-uploads/${folder}/${Date.now()}-${i}-${file.name}`
          );
          await uploadBytes(r, file);
          photos.push(await getDownloadURL(r));
        }
      }

      const review = { name, service, rating, text, photos };
      if (onSubmit) {
        onSubmit(review);
      } else {
        await submitReview(review);
      }
      setSubmitted(true);
    } catch (e) {
      setError(e.message || "Couldn't submit right now — please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={bare ? undefined : "card card-pad"}>
      <div
        style={{
          fontSize: 11,
          letterSpacing: "1.5px",
          textTransform: "uppercase",
          color: "var(--rose-deep)",
          fontWeight: 600,
          marginBottom: 6,
        }}
      >
        Completed a treatment?
      </div>
      <h3 id={titleId} className="serif" style={{ fontSize: 26, marginBottom: 6 }}>
        Leave a review
      </h3>
      <p style={{ fontSize: 13.5, color: "var(--muted)", marginBottom: 20 }}>
        Share your experience
        publicly.
      </p>

      {submitted ? (
        <div className="banner ok" style={{ fontSize: 13 }}>
          <CheckCircle2 size={16} /> Thank you! Your review has been submitted
          and appears once Sruthi approves it.
        </div>
      ) : (
        <>
          <div className="field">
            <label>
              Your name <span className="req">*</span>
            </label>
            <input
              placeholder="e.g. Priya S."
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Service you had</label>
            <input
              placeholder="e.g. Korean Glass Facial"
              value={service}
              onChange={(e) => setService(e.target.value)}
            />
          </div>

          <div className="field">
            <label>Your rating</label>
            <StarPicker value={rating} onChange={setRating} />
          </div>

          <div className="field">
            <label>
              Your review <span className="req">*</span>
            </label>
            <textarea
              rows="3"
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
                (optional — up to {MAX_PHOTOS})
              </span>
            </label>

            {/* A <label> around a hidden file input: keeps the dashed drop zone
                from the mockup while using a real file picker. */}
            {files.length < MAX_PHOTOS && (
              <label className="img-upload" style={{ cursor: "pointer" }}>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={onFiles}
                  disabled={submitting}
                  style={{ display: "none" }}
                />
                <div className="iu-ic">
                  <Camera size={26} strokeWidth={1.5} />
                </div>
                <b>Tap to add before / after photos</b>
                <span>JPG or PNG · up to {MAX_PHOTOS} images · max 5MB each</span>
              </label>
            )}

            {files.length > 0 && (
              <div className="img-previews">
                {previewUrls.map((url, i) => (
                  <div key={i} className="img-thumb">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={url} alt="" />
                    <div
                      className="rm"
                      role="button"
                      aria-label="Remove photo"
                      onClick={() => removePhoto(i)}
                    >
                      <X size={12} />
                    </div>
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
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting
              ? files.length
                ? "Uploading photos…"
                : "Submitting…"
              : "Submit for approval"}
          </button>

          <p className="hint" style={{ textAlign: "center", marginTop: 12 }}>
            Your review appears once Sruthi approves it.
          </p>
        </>
      )}
    </div>
  );
}
