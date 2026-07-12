"use client";

import { useState } from "react";
import Image from "next/image";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { AlertTriangle, X } from "lucide-react";
import { CATEGORIES } from "@/lib/constants";
import { getFirebaseStorage } from "@/lib/firebase";

const EMPTY = {
  name: "",
  category: "Facial",
  durationMin: 60,
  priceCad: "",
  wasCad: "",
  deal: "",
  description: "",
  sortOrder: "",
  isActive: true,
  imageUrl: "",
};

// Add / edit a service. `initial` (a raw service doc) puts it in edit mode.
// `onSave(data)` receives the cleaned Firestore-shaped object.
export default function ServiceForm({ initial, onSave, onCancel, saving }) {
  const [f, setF] = useState(
    initial
      ? {
          name: initial.name ?? "",
          category: initial.category ?? "Facial",
          durationMin: initial.durationMin ?? 60,
          priceCad: initial.priceCad ?? "",
          wasCad: initial.wasCad ?? "",
          deal: initial.deal ?? "",
          description: initial.description ?? "",
          sortOrder: initial.sortOrder ?? "",
          isActive: initial.isActive ?? true,
          imageUrl: initial.imageUrl ?? "",
        }
      : EMPTY
  );
  const [err, setErr] = useState(null);
  const [uploading, setUploading] = useState(false);
  const set = (k, v) => setF((p) => ({ ...p, [k]: v }));

  const onImage = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setErr(null);
    setUploading(true);
    try {
      const storage = getFirebaseStorage();
      if (!storage) throw new Error("Storage isn't available.");
      const r = ref(storage, `beauty_bliss_Services/${Date.now()}-${file.name}`);
      await uploadBytes(r, file);
      set("imageUrl", await getDownloadURL(r));
    } catch {
      setErr("Image upload failed — please try again.");
    } finally {
      setUploading(false);
    }
  };

  const submit = (e) => {
    e.preventDefault();
    if (!f.name.trim()) {
      setErr("Name is required.");
      return;
    }
    onSave({
      name: f.name.trim(),
      category: f.category,
      durationMin: Number(f.durationMin) || 0,
      priceCad: Number(f.priceCad) || 0,
      wasCad: f.wasCad === "" || f.wasCad === null ? null : Number(f.wasCad),
      deal: f.deal.trim() ? f.deal.trim() : null,
      description: f.description.trim(),
      sortOrder: Number(f.sortOrder) || 0,
      isActive: !!f.isActive,
      imageUrl: f.imageUrl || null,
    });
  };

  return (
    <form className="card card-pad" onSubmit={submit} style={{ marginBottom: 18 }}>
      <h3 className="serif" style={{ fontSize: 20, marginBottom: 14 }}>
        {initial ? "Edit service" : "New service"}
      </h3>

      <div className="field">
        <label>
          Name <span className="req">*</span>
        </label>
        <input value={f.name} onChange={(e) => set("name", e.target.value)} placeholder="e.g. Korean Glass Facial" />
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: 14,
        }}
      >
        <div className="field">
          <label>Category</label>
          <select value={f.category} onChange={(e) => set("category", e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Duration (min)</label>
          <input type="number" value={f.durationMin} onChange={(e) => set("durationMin", e.target.value)} />
        </div>
        <div className="field">
          <label>Sort order</label>
          <input type="number" value={f.sortOrder} onChange={(e) => set("sortOrder", e.target.value)} placeholder="e.g. 11" />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
          gap: 14,
        }}
      >
        <div className="field">
          <label>Price (CAD)</label>
          <input type="number" value={f.priceCad} onChange={(e) => set("priceCad", e.target.value)} placeholder="100" />
        </div>
        <div className="field">
          <label>Was (CAD, optional)</label>
          <input type="number" value={f.wasCad} onChange={(e) => set("wasCad", e.target.value)} placeholder="120" />
        </div>
        <div className="field">
          <label>Deal badge (optional)</label>
          <input value={f.deal} onChange={(e) => set("deal", e.target.value)} placeholder="Save $20" />
        </div>
      </div>

      <div className="field">
        <label>Description</label>
        <textarea rows="2" value={f.description} onChange={(e) => set("description", e.target.value)} placeholder="Short description shown on the services page." />
      </div>

      <div className="field">
        <label>
          Image{" "}
          <span style={{ color: "var(--muted)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }}>
            (optional — falls back to the category emoji)
          </span>
        </label>
        {f.imageUrl && (
          <div className="img-previews" style={{ marginBottom: 10 }}>
            <div className="img-thumb">
              <Image src={f.imageUrl} alt="" fill style={{ objectFit: "cover" }} sizes="74px" />
              <div className="rm" onClick={() => set("imageUrl", "")}>
                <X size={12} />
              </div>
            </div>
          </div>
        )}
        <input type="file" accept="image/*" onChange={onImage} disabled={uploading} />
        {uploading && (
          <div className="hint" style={{ marginTop: 6 }}>Uploading…</div>
        )}
      </div>

      <label
        style={{ display: "flex", gap: 10, alignItems: "center", margin: "4px 0 8px", fontSize: 13, color: "#6f655c", cursor: "pointer" }}
      >
        <input type="checkbox" style={{ width: "auto" }} checked={f.isActive} onChange={(e) => set("isActive", e.target.checked)} />
        Visible on the site
      </label>

      {err && (
        <div className="banner err" style={{ fontSize: 12.5 }}>
          <AlertTriangle size={16} /> {err}
        </div>
      )}

      <div className="form-actions">
        <button type="button" className="btn-prev" onClick={onCancel} disabled={saving}>
          Cancel
        </button>
        <button type="submit" className="btn-next" disabled={saving || uploading}>
          {saving ? "Saving…" : "Save service"}
        </button>
      </div>
    </form>
  );
}
