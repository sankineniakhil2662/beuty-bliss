import { Search } from "lucide-react";

// Reusable `.admin-top` heading + a single right-hand slot, shared across
// every admin screen. That slot is either a search box (Dashboard/Bookings/
// Reviews) or a custom `action` node (Services' "+ Add Service" button) —
// the mockup never shows both at once, so `action` takes priority when
// given. Search is presentational only (the mockup wires no filtering
// behavior to its search inputs either).
export default function AdminTopBar({ title, subtitle, searchPlaceholder, action }) {
  return (
    <div className="admin-top">
      <h1>
        {title}
        {subtitle && <small>{subtitle}</small>}
      </h1>
      {action
        ? action
        : searchPlaceholder && (
            <div className="admin-search">
              <Search size={14} /> <input placeholder={searchPlaceholder} />
            </div>
          )}
    </div>
  );
}
