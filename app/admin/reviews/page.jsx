import ReviewsView from "@/components/admin/ReviewsView";

// Server component wrapper, mirroring app/admin/bookings/page.jsx →
// BookingsView. Mock data today; Phase 4 makes this async and passes real
// Firestore data into ReviewsView as a prop.
export default function AdminReviewsPage() {
  return <ReviewsView />;
}
