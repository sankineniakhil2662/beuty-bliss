"use client";

import { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AlertTriangle, Upload } from "lucide-react";
import { getFirebaseStorage } from "@/lib/firebase";

// Add-a-slide form: pick an image, optionally caption it, upload to Cloud
// Storage, then hand the resulting URL to `onAdd({ imageUrl, alt })`.
export default function CarouselUploadForm({ onAdd, disabled }) {
  const [file, setFile] = useState(null);
  const [alt, setAlt] = useState("");
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    if (!file) {
      setErr("Choose an image first.");
      return;
    }
    setErr(null);
    setUploading(true);
    try {
      const storage = getFirebaseStorage();
      if (!storage) throw new Error("Storage isn't available.");
      const r = ref(storage, `beauty_bliss_Carousel/${Date.now()}-${file.name}`);
      await uploadBytes(r, file);
      const imageUrl = await getDownloadURL(r);
      await onAdd({ imageUrl, alt: alt.trim() });
      setFile(null);
      setAlt("");
      e.target.reset();
    } catch {
      setErr("Upload failed — please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <form className="card card-pad" onSubmit={submit} style={{ marginBottom: 18 }}>
      <h3 className="serif" style={{ fontSize: 20, marginBottom: 14 }}>
        Add a carousel image
      </h3>

      <div className="field">
        <label>
          Image <span className="req">*</span>
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          disabled={uploading || disabled}
        />
      </div>

      <div className="field">
        <label>
          Caption{" "}
          <span style={{ color: "var(--muted)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
            (optional — used as image alt text)
          </span>
        </label>
        <input
          value={alt}
          onChange={(e) => setAlt(e.target.value)}
          placeholder="e.g. Studio interior"
          disabled={uploading || disabled}
        />
      </div>

      {err && (
        <div className="banner err" style={{ fontSize: 12.5 }}>
          <AlertTriangle size={16} /> {err}
        </div>
      )}

      <button
        className="btn-next"
        type="submit"
        disabled={uploading || disabled}
        style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
      >
        <Upload size={14} /> {uploading ? "Uploading…" : "Add to carousel"}
      </button>
    </form>
  );
}
