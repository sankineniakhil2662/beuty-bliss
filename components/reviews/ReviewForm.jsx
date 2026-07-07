"use client";

import { useState } from "react";
import StarPicker from "./StarPicker";

// Placeholder photo thumbnails (emoji), matching the mockup. Real image upload
// to Cloud Storage lands with the secure /review/[token] flow.
const PHOTO_ICONS = ["🧴", "✨", "🧖", "🌸"];

// The "Leave a review" form. On the public Reviews page it's a preview (no
// onSubmit → shows a pending-approval note). The /review/[token] page will pass
// a real onSubmit later.
export default function ReviewForm({ onSubmit, verifiedNote }) {
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [photos, setPhotos] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const addPhoto = () =>
    setPhotos((p) => (p.length >= 4 ? p : [...p, PHOTO_ICONS[p.length % PHOTO_ICONS.length]]));
  const removePhoto = (i) => setPhotos((p) => p.filter((_, idx) => idx !== i));

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit({ rating, text, photos });
      return;
    }
    setSubmitted(true); // public preview
  };

  return (
    <div className="card card-pad">
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
      <h3 className="serif" style={{ fontSize: 26, marginBottom: 6 }}>
        Leave a review
      </h3>
      <p style={{ fontSize: 13.5, color: "var(--muted)", marginBottom: 20 }}>
        This form opens from the secure link in your &ldquo;treatment
        complete&rdquo; email. Shown here for preview.
      </p>

      <div className="field">
        <label>Your rating</label>
        <StarPicker value={rating} onChange={setRating} />
      </div>

      <div className="field">
        <label>Your review</label>
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
          <div className="iu-ic">📷</div>
          <b>Tap to add before / after photos</b>
          <span>JPG or PNG · up to 4 images</span>
        </div>
        <div className="img-previews">
          {photos.map((p, i) => (
            <div key={i} className="img-thumb">
              {p}
              <div
                className="rm"
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(i);
                }}
              >
                ✕
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="banner ok" style={{ fontSize: 12.5 }}>
        🔒 {verifiedNote || "Verified as a real client — booking #BB-2026-0391 (Pearl Facial)"}
      </div>

      {submitted ? (
        <div className="banner ok" style={{ fontSize: 12.5 }}>
          ✓ Review submitted — it appears once Sruthi approves it.
        </div>
      ) : (
        <button
          className="btn-gold"
          style={{ width: "100%", justifyContent: "center" }}
          onClick={handleSubmit}
        >
          Submit for approval
        </button>
      )}

      <p className="hint" style={{ textAlign: "center", marginTop: 12 }}>
        Your review appears once Sruthi approves it.
      </p>
    </div>
  );
}
