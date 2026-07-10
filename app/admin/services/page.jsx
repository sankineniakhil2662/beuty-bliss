import ServicesView from "@/components/admin/ServicesView";

// Server component wrapper, mirroring app/admin/bookings/page.jsx and
// app/admin/reviews/page.jsx. Mock data today; Phase 4 makes this async and
// passes real Firestore data into ServicesView as a prop.
export default function AdminServicesPage() {
  return <ServicesView />;
}
