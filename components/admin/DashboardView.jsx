"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, DollarSign, Flame, Star } from "lucide-react";
import AdminTopBar from "./AdminTopBar";
import KpiCard from "./KpiCard";
import BookingTable from "./BookingTable";
import { fetchAllBookings } from "@/lib/bookings";
import { fetchAllReviewsForAdmin } from "@/lib/reviews";

// Dashboard: KPIs + latest requests, computed from live Firestore data.
// The latest-requests table is preview-only (no onAction → disabled buttons);
// full management lives on /admin/bookings.
export default function DashboardView() {
  const [bookings, setBookings] = useState([]);
  const [pendingReviews, setPendingReviews] = useState(0);

  useEffect(() => {
    fetchAllBookings().then(setBookings).catch(() => {});
    fetchAllReviewsForAdmin()
      .then((rs) => setPendingReviews(rs.filter((r) => r.status === "pending").length))
      .catch(() => {});
  }, []);

  const requested = bookings.filter((b) => b.status === "requested");
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const revenue = bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + (b.total || 0), 0);
  const latest = requested.slice(0, 3);

  return (
    <div>
      <AdminTopBar
        title="Good evening, Sruthi"
        subtitle="Here's your studio at a glance"
        searchPlaceholder="Search bookings, clients…"
      />

      <div className="kpi-row">
        <KpiCard
          icon={Flame}
          label="New Requests"
          value={String(requested.length)}
          delta="Awaiting your response"
          deltaType="up"
        />
        <KpiCard
          icon={CheckCircle2}
          label="Confirmed"
          value={String(confirmed)}
          delta="Upcoming"
          deltaType="flat"
        />
        <KpiCard
          icon={Star}
          label="Pending Reviews"
          value={String(pendingReviews)}
          delta="Awaiting approval"
          deltaType="up"
        />
        <KpiCard
          icon={DollarSign}
          label="Est. Revenue"
          value={`$${revenue.toLocaleString()}`}
          delta="confirmed + completed"
          accent
        />
      </div>

      <div className="panel">
        <div className="panel-head">
          <h3>Latest requests</h3>
          <Link
            className="btn-prev"
            href="/admin/bookings"
            style={{ padding: "8px 16px", fontSize: 12 }}
          >
            View all →
          </Link>
        </div>
        <BookingTable bookings={latest} />
      </div>
    </div>
  );
}
