import DashboardView from "@/components/admin/DashboardView";

// Server component wrapper, mirroring app/admin/bookings|reviews|services.
// Mock data today; Phase 4 makes this async and passes real Firestore data.
export default function AdminDashboardPage() {
  return <DashboardView />;
}
