"use client";

import { useState } from "react";
import AdminTopBar from "./AdminTopBar";
import ServiceAdminTable from "./ServiceAdminTable";
import Banner from "./Banner";
import { SEED_SERVICES } from "@/lib/services";

// Reuses the real SEED_SERVICES constant directly instead of a separate mock
// file — it already matches the mockup's service list. Local ids + marking
// the 10th service hidden (mirroring the mockup's own "Birthday Glow-Up"
// demo row) are added here only, without touching lib/services.js.
const INITIAL_SERVICES = SEED_SERVICES.map((s, i) => ({
  id: `mock-${i}`,
  ...s,
  isActive: i === 9 ? false : s.isActive,
}));

export default function ServicesView() {
  const [services, setServices] = useState(INITIAL_SERVICES);
  const [banner, setBanner] = useState(null);

  const handleToggle = (service) => {
    const nowActive = !service.isActive;
    setServices((prev) =>
      prev.map((s) => (s.id === service.id ? { ...s, isActive: nowActive } : s))
    );
    setBanner(
      nowActive
        ? `${service.name} is visible on the site again.`
        : `${service.name} is now hidden from the site.`
    );
  };

  return (
    <div>
      <AdminTopBar
        title="Services"
        subtitle="Add, edit, or hide treatments"
        action={
          <button
            className="btn-next"
            style={{ fontSize: 12, padding: "11px 20px" }}
            disabled
            title="Adding services lands in a later milestone"
          >
            + Add Service
          </button>
        }
      />

      <Banner type="ok" message={banner} onDismiss={() => setBanner(null)} />

      <div className="panel">
        <div className="panel-head">
          <h3>Your treatments</h3>
        </div>
        <ServiceAdminTable services={services} onToggle={handleToggle} />
      </div>
    </div>
  );
}
