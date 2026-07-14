"use client";

import { useState } from "react";
import { AlertTriangle, Camera, CheckCircle2, ImageIcon, X } from "lucide-react";
import StarPicker from "./StarPicker";
import { submitReview } from "@/lib/reviews";

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
  const [photos, setPhotos] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const addPhoto = () =>
    setPhotos((p) => (p.length >= 4 ? p : [...p, "placeholder"]));
  const removePhoto = (i) => setPhotos((p) => p.filter((_, idx) => idx !== i));

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
    const review = { name, service, rating, text, photos };
    if (onSubmit) {
      onSubmit(review);
      setSubmitted(true);
      return;
    }
    setSubmitting(true);
    try {
      await submitReview(review);
      setSubmitted(true);
    } catch {
      setError("Couldn't submit right now — please try again.");
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
        Share your experience — Sruthi checks each review before it appears
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
                (optional — show your results)
              </span>
            </label>
            <div className="img-upload" onClick={addPhoto}>
              <div className="iu-ic">
                <Camera size={26} strokeWidth={1.5} />
              </div>
              <b>Tap to add before / after photos</b>
              <span>JPG or PNG · up to 4 images</span>
            </div>
            <div className="img-previews">
              {photos.map((p, i) => (
                <div key={i} className="img-thumb">
                  <ImageIcon size={26} strokeWidth={1.5} />
                  <div
                    className="rm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(i);
                    }}
                  >
                    <X size={12} />
                  </div>
                </div>
              ))}
            </div>
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
            {submitting ? "Submitting…" : "Submit for approval"}
          </button>

          <p className="hint" style={{ textAlign: "center", marginTop: 12 }}>
            Your review appears once Sruthi approves it.
          </p>
        </>
      )}
    </div>
  );
}
