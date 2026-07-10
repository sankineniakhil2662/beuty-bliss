import Link from "next/link";
import AdminTopBar from "@/components/admin/AdminTopBar";
import KpiCard from "@/components/admin/KpiCard";
import BookingTable from "@/components/admin/BookingTable";
import { MOCK_BOOKINGS } from "@/lib/mock/bookings";

export default function AdminDashboardPage() {
  const latestRequests = MOCK_BOOKINGS.filter(
    (b) => b.status === "requested"
  ).slice(0, 3);

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
        <KpiCard label="⭐ Pending Reviews" value="3" delta="Awaiting approval" />
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
            style={{ padding: "8px 16px", fontSize: 12 }}
            href="/admin/bookings"
          >
            View all →
          </Link>
        </div>
        <BookingTable bookings={latestRequests} />
      </div>
    </div>
  );
}
