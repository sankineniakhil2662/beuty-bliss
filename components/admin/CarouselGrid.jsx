import Image from "next/image";
import { Eye, EyeOff, ImageIcon, Trash2 } from "lucide-react";
import EmptyState from "./EmptyState";

// Grid of uploaded hero-carousel images. `onToggle`/`onRemove` are optional —
// omitted renders read-only tiles (not currently used, but keeps the
// component consistent with ServiceAdminTable/BookingTable's convention).
export default function CarouselGrid({ images, onToggle, onRemove }) {
  if (!images.length) {
    return (
      <EmptyState
        icon={ImageIcon}
        title="No carousel images yet"
        message="Upload a photo above to start the home-page carousel."
      />
    );
  }

  return (
    <div className="carousel-admin-grid">
      {images.map((img) => (
        <div key={img.id} className={"carousel-admin-tile" + (img.isActive ? "" : " hidden")}>
          <div className="cat-img">
            <Image src={img.imageUrl} alt={img.alt || ""} fill sizes="220px" style={{ objectFit: "cover" }} />
          </div>
          <div className="cat-body">
            <span className="cat-alt">{img.alt || "Untitled slide"}</span>
            <div className="cat-actions">
              <button onClick={() => onToggle(img)} title={img.isActive ? "Hide from carousel" : "Show in carousel"}>
                {img.isActive ? <Eye size={14} /> : <EyeOff size={14} />}
                {img.isActive ? "Visible" : "Hidden"}
              </button>
              <button className="danger" onClick={() => onRemove(img)} title="Remove">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
