"use client";

import { useState } from "react";
import ServiceCard from "./ServiceCard";
import ServiceFilters from "./ServiceFilters";
import { CATEGORIES } from "@/lib/constants";

// Client wrapper that owns the active-category state and renders the filter
// pills + service grid + empty state. Services are fetched on the server and
// passed in as a prop so the list is present in the initial HTML.
export default function ServicesBrowser({ services }) {
  const [active, setActive] = useState("All");
  const categories = ["All", ...CATEGORIES];

  const list =
    active === "All" ? services : services.filter((s) => s.cat === active);

  return (
    <>
      <ServiceFilters
        categories={categories}
        active={active}
        onSelect={setActive}
      />
      {list.length ? (
        <div className="svc-grid">
          {list.map((s) => (
            <ServiceCard key={s.id ?? s.n} service={s} withBook />
          ))}
        </div>
      ) : (
        <div className="empty" style={{ gridColumn: "1/-1" }}>
          <div className="ic">🔍</div>
          <h3>No services here yet</h3>
          <p>Try another category — new treatments are added often.</p>
        </div>
      )}
    </>
  );
}
