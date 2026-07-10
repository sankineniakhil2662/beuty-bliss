import { ICONS } from "@/lib/constants";
import StatusPill from "./StatusPill";
import EmptyState from "./EmptyState";

// `onToggle(service)` flips isActive locally. "Edit" has no backing behavior
// anywhere in the mockup either (a dead button even in the source HTML) and
// building a full edit form is out of scope here, so it stays disabled.
export default function ServiceAdminTable({ services, onToggle }) {
  if (!services.length) {
    return (
      <EmptyState
        icon="🧴"
        title="No services yet"
        message="Add your first treatment to get started."
      />
    );
  }

  return (
    <table className="booking">
      <thead>
        <tr>
          <th>Service</th>
          <th>Duration</th>
          <th>Price (CAD)</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {services.map((s) => (
          <tr key={s.id}>
            <td>
              <div className="cust">
                <div className="av" style={{ borderRadius: 9 }}>
                  {ICONS[s.category]}
                </div>
                <div>
                  <b>{s.name}</b>
                  <span>{s.category}</span>
                </div>
              </div>
            </td>
            <td>{s.durationMin} min</td>
            <td>
              CA${s.priceCad.toFixed(2)}
              {s.wasCad && (
                <span
                  style={{
                    color: "#b3a99f",
                    textDecoration: "line-through",
                    fontSize: 11,
                    marginLeft: 6,
                  }}
                >
                  CA${s.wasCad}
                </span>
              )}
            </td>
            <td>
              <StatusPill status={s.isActive ? "active" : "hidden"} />
            </td>
            <td>
              <div className="row-act">
                <button disabled title="Editing services lands in a later milestone">
                  Edit
                </button>
                <button onClick={() => onToggle(s)}>
                  {s.isActive ? "Hide" : "Show"}
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
