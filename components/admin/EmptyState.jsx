// Reusable `.empty` block, matching the pattern already used inline in
// components/services/ServicesBrowser.jsx and app/reviews/page.jsx.
export default function EmptyState({ icon = "📋", title, message }) {
  return (
    <div className="empty">
      <div className="ic">{icon}</div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
    </div>
  );
}
