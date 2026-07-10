import StatusPill from "./StatusPill";
import EmptyState from "./EmptyState";

function formatDate(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// Actions vary by status, same convention as BookingTable's actionsFor().
// "Remove" is always available; "Approve"/"Hide" only make sense when the
// review isn't already in that state.
function actionsFor(status) {
  if (status === "pending") {
    return [
      { label: "Approve", cls: "b-approve" },
      { label: "Hide", cls: "b-reject" },
      { label: "Remove", cls: "b-reject" },
    ];
  }
  if (status === "approved") {
    return [
      { label: "Hide", cls: "b-reject" },
      { label: "Remove", cls: "b-reject" },
    ];
  }
  // hidden
  return [
    { label: "Approve", cls: "b-approve" },
    { label: "Remove", cls: "b-reject" },
  ];
}

// `onAction(review, actionLabel)` — same shape as BookingTable's onAction.
export default function ReviewModeration({ reviews, onAction }) {
  if (!reviews.length) {
    return (
      <EmptyState icon="⭐" title="No reviews here" message="Try a different filter." />
    );
  }

  return (
    <div className="modlist">
      {reviews.map((r) => (
        <div className="modrow" key={r.id}>
          <div>
            <div className="stars">
              {"★".repeat(r.rating)}
              {"☆".repeat(5 - r.rating)}
            </div>
            <div className="rtext">&ldquo;{r.text}&rdquo;</div>
            {r.photos && r.photos.length > 0 && (
              <div className="rphotos">
                {r.photos.map((p, i) => (
                  <div className="rp" key={i}>
                    {p}
                  </div>
                ))}
              </div>
            )}
            <div className="rmeta">
              <span>
                <b>{r.name}</b> · {r.service}
              </span>
              <span className="vchip">✓ Verified {r.ref}</span>
              {r.photos && r.photos.length > 0 && (
                <span style={{ color: "var(--muted)" }}>
                  📷 {r.photos.length} photo{r.photos.length > 1 ? "s" : ""}
                </span>
              )}
              <StatusPill status={r.status} />
              <span style={{ color: "var(--muted)" }}>{formatDate(r.date)}</span>
            </div>
          </div>
          <div className="modact">
            {actionsFor(r.status).map((a) => (
              <button
                key={a.label}
                className={a.cls}
                onClick={() => onAction(r, a.label)}
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
