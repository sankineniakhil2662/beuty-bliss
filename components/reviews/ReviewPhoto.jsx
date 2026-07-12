import Image from "next/image";
import { ImageIcon } from "lucide-react";

// Renders one review photo tile. Real uploads are URLs → show as an
// optimized <Image fill>; placeholder entries (seed/mock data, or photos
// added in the review form before real upload wiring) → show a generic
// image icon. Sized by the parent's `.rp` CSS (48-54px, position:relative)
// in both the public card and the admin moderation row.
export default function ReviewPhoto({ photo }) {
  const isImage = typeof photo === "string" && photo.startsWith("http");
  return (
    <div className="rp">
      {isImage ? (
        <Image
          src={photo}
          alt=""
          fill
          style={{ objectFit: "cover" }}
          sizes="60px"
        />
      ) : (
        <ImageIcon size={20} strokeWidth={1.5} />
      )}
    </div>
  );
}
