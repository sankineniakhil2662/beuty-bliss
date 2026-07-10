"use client";

import { useEffect, useState } from "react";
import AdminTopBar from "./AdminTopBar";
import BookingTable from "./BookingTable";
import TabPills from "./TabPills";
import Banner from "./Banner";
import EmptyState from "./EmptyState";
import { fetchAllBookings, updateBookingStatus } from "@/lib/bookings";

const TABS = [
  { key: "all", label: "All" },
  { key: "requested", label: "Requested" },
  { key: "confirmed", label: "Confirmed" },
  { key: "completed", label: "Completed" },
  { key: "cancelled", label: "Cancelled" },
];

// Status transition + banner copy per action, matching the mockup's
// confirmBk/completeBk/cancelBk behavior exactly (client-side only).
const NEXT_STATUS = {
  Confirm: "confirmed",
  Decline: "cancelled",
  "Mark done": "completed",
  Cancel: "cancelled",
  Reopen: "requested",
};

const ACTION_MESSAGE = {
  Confirm: (name) => `${name} confirmed — customer notified by email & SMS.`,
  Decline: (name) => `${name}'s request declined.`,
  "Mark done": (name) => `${name} marked complete — thank-you + review link sent.`,
  Cancel: (name) => `${name}'s booking cancelled.`,
  Reopen: (name) => `${name}'s booking reopened.`,
  "Resend review link": (name) => `Review link resent to ${name}.`,
};

export default function BookingsView() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    fetchAllBookings()
      .then(setBookings)
      .catch(() => setBanner("Couldn't load bookings — check you're signed in as admin."))
      .finally(() => setLoading(false));
  }, []);

  const handleAction = async (booking, actionLabel) => {
    const nextStatus = NEXT_STATUS[actionLabel];
    if (nextStatus) {
      const prevStatus = booking.status;
      // optimistic update
      setBookings((prev) =>
        prev.map((b) => (b.id === booking.id ? { ...b, status: nextStatus } : b))
      );
      try {
        await updateBookingStatus(booking.id, nextStatus);
      } catch {
        // revert on failure
        setBookings((prev) =>
          prev.map((b) => (b.id === booking.id ? { ...b, status: prevStatus } : b))
        );
        setBanner("Update failed — please try again.");
        return;
      }
    }
    setBanner(ACTION_MESSAGE[actionLabel]?.(booking.name) ?? `${actionLabel} — ${booking.name}`);
  };

  const visible =
    activeTab === "all" ? bookings : bookings.filter((b) => b.status === activeTab);

  return (
    <div>
      <AdminTopBar
        title="Bookings"
        subtitle="Manage requests and update their status"
        searchPlaceholder="Search by name or service…"
      />

      <Banner type="ok" message={banner} onDismiss={() => setBanner(null)} />

      <div className="panel">
        <div className="panel-head">
          <TabPills tabs={TABS} active={activeTab} onChange={setActiveTab} />
        </div>
        {loading ? (
          <EmptyState icon="⏳" title="Loading bookings…" message="One moment." />
        ) : (
          <BookingTable bookings={visible} onAction={handleAction} />
        )}
      </div>
    </div>
  );
}
