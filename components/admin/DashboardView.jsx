"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, DollarSign, Flame, Loader2, Star } from "lucide-react";
import AdminTopBar from "./AdminTopBar";
import KpiCard from "./KpiCard";
import BookingTable from "./BookingTable";
import Banner from "./Banner";
import EmptyState from "./EmptyState";
import { fetchAllBookings } from "@/lib/bookings";
import { fetchAllReviewsForAdmin } from "@/lib/reviews";

// Dashboard: KPIs + latest requests, computed from live Firestore data.
// The latest-requests table is preview-only (no onAction → disabled buttons);
// full management lives on /admin/bookings.
export default function DashboardView() {
  const [bookings, setBookings] = useState([]);
  const [pendingReviews, setPendingReviews] = useState(0);
  const [loading, setLoading] = useState(true);
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setBanner(null);

    Promise.all([fetchAllBookings(), fetchAllReviewsForAdmin()])
      .then(([bs, rs]) => {
        if (cancelled) return;
        setBookings(bs);
        setPendingReviews(rs.filter((r) => r.status === "pending").length);
      })
      .catch(() => {
        if (cancelled) return;
        setBanner(
          "Couldn't reach the server — figures below may be out of date. Check your connection and reload."
        );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const requested = bookings.filter((b) => b.status === "requested");
  const confirmed = bookings.filter((b) => b.status === "confirmed").length;
  const revenue = bookings
    .filter((b) => b.status === "confirmed" || b.status === "completed")
    .reduce((sum, b) => sum + (b.total || 0), 0);
  const latest = requested.slice(0, 3);

  // Dashes rather than zeros while loading — a real "0 new requests" and an
  // unfinished fetch must not look identical.
  const kpi = (value) => (loading ? "—" : value);

  return (
    <div>
      <AdminTopBar
        title="Good evening, Sruthi"
        subtitle="Here's your studio at a glance"
        searchPlaceholder="Search bookings, clients…"
      />

      <Banner type="err" message={banner} onDismiss={() => setBanner(null)} />

      <div className="kpi-row">
        <KpiCard
          icon={Flame}
          label="New Requests"
          value={kpi(String(requested.length))}
          delta="Awaiting your response"
          deltaType="up"
        />
        <KpiCard
          icon={CheckCircle2}
          label="Confirmed"
          value={kpi(String(confirmed))}
          delta="Upcoming"
          deltaType="flat"
        />
        <KpiCard
          icon={Star}
          label="Pending Reviews"
          value={kpi(String(pendingReviews))}
          delta="Awaiting approval"
          deltaType="up"
        />
        <KpiCard
          icon={DollarSign}
          label="Est. Revenue"
          value={kpi(`$${revenue.toLocaleString()}`)}
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
        {loading ? (
          <EmptyState
            icon={Loader2}
            spin
            title="Loading your studio…"
            message="One moment."
          />
        ) : (
          <BookingTable bookings={latest} />
        )}
      </div>
    </div>
  );
}
