// Temporary mock data for the admin dashboard/bookings UI (Phase 1-3).
// Shape intentionally mirrors the real `bookings` Firestore doc closely
// (see lib/bookings.js) so swapping this out in Phase 4 is a small change.
// Status values use the same full words as the real write path
// ("requested" — see createBooking()), not the mockup's short codes,
// so no translation layer is needed once Firestore is wired up.
export const MOCK_BOOKINGS = [
  { id: "mock-1", name: "Priya Sharma", service: "Korean Glass Facial", preferredDate: "2026-07-09", status: "requested" },
  { id: "mock-2", name: "Megan Reilly", service: "Microneedling", preferredDate: "2026-07-10", status: "requested" },
  { id: "mock-3", name: "Aisha Khan", service: "Pearl Facial", preferredDate: "2026-07-11", status: "confirmed" },
  { id: "mock-4", name: "Linda Moore", service: "June Glow Combination", preferredDate: "2026-07-14", status: "confirmed" },
  { id: "mock-5", name: "Fatima Ali", service: "Glutathione Needling", preferredDate: "2026-07-15", status: "completed" },
  { id: "mock-6", name: "Chloe Tan", service: "Back Polish Massage", preferredDate: "2026-07-07", status: "cancelled" },
  { id: "mock-7", name: "Sara Lopez", service: "Derma Peel", preferredDate: "2026-07-16", status: "requested" },
];
