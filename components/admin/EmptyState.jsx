import { ClipboardList } from "lucide-react";

// Reusable `.empty` block, matching the pattern already used inline in
// components/services/ServicesBrowser.jsx and app/reviews/page.jsx.
// `icon` is a lucide-react icon component, not an emoji/string. `spin` adds
// the rotating-loader animation (used for "Loading…" states).
export default function EmptyState({ icon: Icon = ClipboardList, title, message, spin = false }) {
  return (
    <div className="empty">
      <div className="ic">
        <Icon size={48} strokeWidth={1.5} className={spin ? "spin" : undefined} />
      </div>
      <h3>{title}</h3>
      {message && <p>{message}</p>}
    </div>
  );
}
