"use client";

import { useState } from "react";
import AdminTopBar from "./AdminTopBar";
import BookingTable from "./BookingTable";
import TabPills from "./TabPills";
import Banner from "./Banner";
import { MOCK_BOOKINGS } from "@/lib/mock/bookings";

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

// `bookings` defaults to the shared mock dataset so this component can be
// swapped to real Firestore data in Phase 4 by simply passing a real prop.
export default function BookingsView({ bookings: initialBookings = MOCK_BOOKINGS }) {
  const [bookings, setBookings] = useState(initialBookings);
  const [activeTab, setActiveTab] = useState("all");
  const [banner, setBanner] = useState(null);

  const handleAction = (booking, actionLabel) => {
    const nextStatus = NEXT_STATUS[actionLabel];
    if (nextStatus) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === booking.id ? { ...b, status: nextStatus } : b
        )
      );
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
        <BookingTable bookings={visible} onAction={handleAction} />
      </div>
    </div>
  );
}
