import Image from "next/image";

// Renders one review photo tile. Real uploads are URLs → show as an
// optimized <Image fill>; the older emoji placeholders (seed/mock data) →
// show as text. Sized by the parent's `.rp` CSS (48-54px, position:relative)
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
        photo
      )}
    </div>
  );
}
