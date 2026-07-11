// Renders one review photo tile. Real uploads are URLs → show as an <img>;
// the older emoji placeholders (seed/mock data) → show as text. Sized by the
// parent's `.rp` CSS in both the public card and the admin moderation row.
export default function ReviewPhoto({ photo }) {
  const isImage = typeof photo === "string" && photo.startsWith("http");
  return (
    <div className="rp" style={isImage ? { overflow: "hidden", padding: 0 } : undefined}>
      {isImage ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={photo}
          alt=""
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      ) : (
        photo
      )}
    </div>
  );
}
