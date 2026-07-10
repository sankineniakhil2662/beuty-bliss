// Status badge shared by Bookings and Reviews. Maps a canonical Firestore
// status word to the mockup's short CSS modifier + display label
// (`.pill.req/.conf/.done/.canc`). Review statuses reuse the same 3 colors
// (pending~req, approved~done, hidden~canc) rather than adding new CSS.
const STATUS = {
  // bookings
  requested: { label: "Requested", cls: "req" },
  confirmed: { label: "Confirmed", cls: "conf" },
  completed: { label: "Completed", cls: "done" },
  cancelled: { label: "Cancelled", cls: "canc" },
  // reviews
  pending: { label: "Pending", cls: "req" },
  approved: { label: "Approved", cls: "done" },
  hidden: { label: "Hidden", cls: "canc" },
  // services (reuses the "hidden" entry above too)
  active: { label: "Active", cls: "done" },
};

export default function StatusPill({ status }) {
  const s = STATUS[status] ?? { label: status, cls: "" };
  return <span className={"pill " + s.cls}>{s.label}</span>;
}
