// A single public review card. `review` uses the mockup aliases: nm, svc, r, t,
// photos (optional).
export default function ReviewCard({ review: r }) {
  return (
    <div className="rev-card">
      <span className="verified">✓ Verified</span>
      <div className="stars">
        {"★".repeat(r.r)}
        {"☆".repeat(5 - r.r)}
      </div>
      <p>&ldquo;{r.t}&rdquo;</p>
      {r.photos && r.photos.length > 0 && (
        <div className="rphotos">
          {r.photos.map((p, i) => (
            <div key={i} className="rp">
              {p}
            </div>
          ))}
        </div>
      )}
      <div className="who">
        <div className="av">{r.nm[0]}</div>
        <div>
          <b>{r.nm}</b>
          <span>{r.svc}</span>
        </div>
      </div>
    </div>
  );
}
