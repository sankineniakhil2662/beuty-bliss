"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import AdminTopBar from "./AdminTopBar";
import ServiceAdminTable from "./ServiceAdminTable";
import ServiceForm from "./ServiceForm";
import Banner from "./Banner";
import EmptyState from "./EmptyState";
import {
  createService,
  fetchAllServicesAdmin,
  setServiceActive,
  updateService,
} from "@/lib/services";

export default function ServicesView() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState(null);
  const [editing, setEditing] = useState(null); // null | "new" | serviceObject
  const [saving, setSaving] = useState(false);

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

  const handleSave = async (data) => {
    setSaving(true);
    try {
      if (editing === "new") {
        const created = await createService(data);
        setServices((prev) =>
          [...prev, created].sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        );
        setBanner(`${data.name} added.`);
      } else {
        await updateService(editing.id, data);
        setServices((prev) =>
          prev
            .map((s) => (s.id === editing.id ? { ...s, ...data } : s))
            .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
        );
        setBanner(`${data.name} updated.`);
      }
      setEditing(null);
    } catch {
      setBanner("Couldn't save — please try again.");
    } finally {
      setSaving(false);
    }
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
            onClick={() => setEditing("new")}
          >
            + Add Service
          </button>
        }
      />

      <Banner type="ok" message={banner} onDismiss={() => setBanner(null)} />

      {editing && (
        <ServiceForm
          initial={editing === "new" ? undefined : editing}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
          saving={saving}
        />
      )}

      <div className="panel">
        <div className="panel-head">
          <h3>Your treatments</h3>
        </div>
        {loading ? (
          <EmptyState icon={Loader2} spin title="Loading services…" message="One moment." />
        ) : (
          <ServiceAdminTable
            services={services}
            onToggle={handleToggle}
            onEdit={(s) => setEditing(s)}
          />
        )}
      </div>
    </div>
  );
}
