import Link from "next/link";
import AdminTopBar from "./AdminTopBar";
import KpiCard from "./KpiCard";
import BookingTable from "./BookingTable";
import { MOCK_BOOKINGS } from "@/lib/mock/bookings";

// Dashboard: KPIs + latest requests. KPI figures are the mockup's demo numbers.
// The latest-requests table is preview-only (no onAction → disabled buttons,
// per BookingTable's own convention); full management lives on /admin/bookings.
export default function DashboardView() {
  const latest = MOCK_BOOKINGS.filter((b) => b.status === "requested").slice(0, 3);

  return (
    <div>
      <AdminTopBar
        title="Good evening, Sruthi"
        subtitle="Sunday, 28 June 2026 · Here's your studio at a glance"
        searchPlaceholder="Search bookings, clients…"
      />

      <div className="kpi-row">
        <KpiCard
          label="🔥 New Requests"
          value="5"
          delta="▲ 2 since yesterday"
          deltaType="up"
        />
        <KpiCard label="✅ Confirmed" value="8" delta="This week" deltaType="flat" />
        <KpiCard
          label="⭐ Pending Reviews"
          value="3"
          delta="Awaiting approval"
          deltaType="up"
        />
        <KpiCard
          label="💰 Est. Week Revenue"
          value="$1,150"
          delta="collected in person"
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
