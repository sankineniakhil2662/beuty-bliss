import BookingsView from "@/components/admin/BookingsView";

// Server component wrapper, mirroring the app/services/page.jsx →
// ServicesBrowser pattern. Mock data today; Phase 4 makes this async and
// passes real Firestore data into BookingsView as a prop.
export default function AdminBookingsPage() {
  return <BookingsView />;
}
