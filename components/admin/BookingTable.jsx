import StatusPill from "./StatusPill";
import EmptyState from "./EmptyState";

// Bookings store preferredDate as a "YYYY-MM-DD" string (see lib/bookings.js),
// so format it the same way StepConfirm.jsx formats it during checkout.
function formatDay(iso) {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-GB", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

// Row actions matching the mockup exactly, per status. They render as
// disabled for now — wiring them to real behavior is the Bookings UI
// milestone (P3.1), not this one.
function actionsFor(status) {
  if (status === "requested") {
    return [
      { label: "Confirm", cls: "primary" },
      { label: "Decline", cls: "danger" },
    ];
  }
  if (status === "confirmed") {
    return [
      { label: "Mark done", cls: "primary" },
      { label: "Cancel", cls: "danger" },
    ];
  }
  if (status === "completed") return [{ label: "Resend review link", cls: "" }];
  return [{ label: "Reopen", cls: "" }];
}

// `onAction(booking, actionLabel)` is optional. Omitted (Dashboard preview) →
// buttons render disabled. Provided (Bookings screen) → buttons are live.
export default function BookingTable({ bookings, onAction }) {
  if (!bookings.length) {
    return (
      <EmptyState
        icon="📋"
        title="No bookings yet"
        message="New requests will show up here."
      />
    );
  }

  return (
    <div className="table-scroll">
    <table className="booking">
      <thead>
        <tr>
          <th>Client</th>
          <th>Service</th>
          <th>Preferred Day</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {bookings.map((b) => (
          <tr key={b.id}>
            <td>
              <div className="cust">
                <div className="av">{b.name[0]}</div>
                <div>
                  <b>{b.name}</b>
                  <span>
                    {b.service.length > 22
                      ? b.service.slice(0, 22) + "…"
                      : b.service}
                  </span>
                </div>
              </div>
            </td>
            <td>{b.service}</td>
            <td>{formatDay(b.preferredDate)}</td>
            <td>
              <StatusPill status={b.status} />
            </td>
            <td>
              <div className="row-act">
                {actionsFor(b.status).map((a) =>
                  onAction ? (
                    <button
                      key={a.label}
                      className={a.cls || undefined}
                      onClick={() => onAction(b, a.label)}
                    >
                      {a.label}
                    </button>
                  ) : (
                    <button
                      key={a.label}
                      className={a.cls || undefined}
                      disabled
                      title="Manage this booking from the Bookings screen"
                    >
                      {a.label}
                    </button>
                  )
                )}
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
  );
}
