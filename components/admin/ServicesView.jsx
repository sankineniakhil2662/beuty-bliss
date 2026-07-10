"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "./AdminTopBar";
import ServiceAdminTable from "./ServiceAdminTable";
import Banner from "./Banner";
import EmptyState from "./EmptyState";
import { fetchAllServicesAdmin, setServiceActive } from "@/lib/services";

export default function ServicesView() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    fetchAllServicesAdmin()
      .then(setServices)
      .catch(() => setBanner("Couldn't load services — check you're signed in as admin."))
      .finally(() => setLoading(false));
  }, []);

  const handleToggle = async (service) => {
    const nowActive = !service.isActive;
    setServices((prev) =>
      prev.map((s) => (s.id === service.id ? { ...s, isActive: nowActive } : s))
    );
    try {
      await setServiceActive(service.id, nowActive);
    } catch {
      setServices((prev) =>
        prev.map((s) => (s.id === service.id ? { ...s, isActive: !nowActive } : s))
      );
      setBanner("Update failed — please try again.");
      return;
    }
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
        {loading ? (
          <EmptyState icon="⏳" title="Loading services…" message="One moment." />
        ) : (
          <ServiceAdminTable services={services} onToggle={handleToggle} />
        )}
      </div>
    </div>
  );
}
