import { Droplet } from "lucide-react";
import { ICONS } from "@/lib/constants";
import EmptyState from "./EmptyState";
import { FEATURED_LIMIT } from "@/lib/services";

// Picks which services appear in the Home page's "Loved by our clients" grid.
// Only active services are listed — a hidden service can't be shown on the
// home page, so offering it here would be a trap.
//
// `onToggle(service)` flips isFeatured. Once FEATURED_LIMIT are picked, the
// remaining buttons are disabled rather than silently dropping the extras:
// the grid only has room for three, and a card that quietly never appears is
// the confusing outcome we're avoiding.
export default function FeaturedPicker({ services, onToggle, busyId }) {
  const active = services.filter((s) => s.isActive);
  const featuredCount = active.filter((s) => s.isFeatured).length;
  const full = featuredCount >= FEATURED_LIMIT;

  if (!active.length) {
    return (
      <EmptyState
        icon={Droplet}
        title="No active services"
        message="Add a service under Services first, then pick your favourites here."
      />
    );
  }

  return (
    <div className="table-scroll">
      <table className="booking">
        <thead>
          <tr>
            <th>Service</th>
            <th>Price (CAD)</th>
            <th>On home page</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {active.map((s) => {
            const CatIcon = ICONS[s.category];
            const locked = full && !s.isFeatured;
            return (
              <tr key={s.id}>
                <td>
                  <div className="cust">
                    <div
                      className="av"
                      style={{
                        borderRadius: 9,
                        overflow: "hidden",
                        color: "var(--gold-light)",
                      }}
                    >
                      {s.imageUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={s.imageUrl}
                          alt=""
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                          }}
                        />
                      ) : (
                        CatIcon && <CatIcon size={18} strokeWidth={1.5} />
                      )}
                    </div>
                    <div>
                      <b>{s.name}</b>
                      <span>{s.category}</span>
                    </div>
                  </div>
                </td>
                <td>CA${Number(s.priceCad).toFixed(2)}</td>
                <td>
                  {s.isFeatured ? (
                    <span className="pill done">Featured</span>
                  ) : (
                    <span style={{ color: "var(--muted)", fontSize: 12 }}>—</span>
                  )}
                </td>
                <td>
                  <div className="row-act">
                    <button
                      onClick={() => onToggle(s)}
                      disabled={locked || busyId === s.id}
                      title={
                        locked
                          ? `You can feature ${FEATURED_LIMIT} services. Remove one first.`
                          : undefined
                      }
                      style={
                        locked ? { opacity: 0.45, cursor: "not-allowed" } : undefined
                      }
                    >
                      {s.isFeatured ? "Remove" : "Feature"}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
