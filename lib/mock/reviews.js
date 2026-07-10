// Temporary mock data for the admin Reviews moderation screen (Phase 1-3).
// Shape mirrors the real `reviews` Firestore doc closely (see lib/reviews.js)
// so swapping this out in Phase 4 is a small change. `date` stands in for
// Firestore's `createdAt` timestamp. `name`/`service`/`rating`/`text`/`photos`
// reuse the same field names as SEED_REVIEWS in lib/reviews.js.
export const MOCK_REVIEWS = [
  { id: "mock-1", ref: "#BB-2026-0388", name: "Aisha K.", service: "Korean Glass Facial", rating: 5, text: "My skin has never looked this dewy. Sruthi explained every step beautifully.", photos: ["✨", "🧖"], date: "2026-06-20", status: "approved" },
  { id: "mock-2", ref: "#BB-2026-0390", name: "Megan R.", service: "Microneedling", rating: 5, text: "Real difference in my acne scars after two sessions. Clean, gentle, professional.", photos: ["🧴"], date: "2026-06-22", status: "approved" },
  { id: "mock-3", ref: "#BB-2026-0393", name: "David P.", service: "Hand Polish", rating: 2, text: "Service was fine but I waited a while past my time. Hoping for better scheduling.", date: "2026-06-24", status: "pending" },
  { id: "mock-4", ref: "#BB-2026-0396", name: "Priya S.", service: "Pearl Facial", rating: 5, text: "Booked a day, got a call within the hour to confirm. Felt looked-after from start to finish.", date: "2026-06-25", status: "pending" },
  { id: "mock-5", ref: "#BB-2026-0381", name: "Linda M.", service: "June Glow Combination", rating: 4, text: "Lovely combination facial and great value. Glow lasted well over a week.", date: "2026-06-18", status: "approved" },
  { id: "mock-6", ref: "#BB-2026-0399", name: "Chloe T.", service: "Back Polish Massage", rating: 1, text: "Not what I expected — wouldn't book this particular service again.", date: "2026-06-27", status: "hidden" },
  { id: "mock-7", ref: "#BB-2026-0384", name: "Fatima A.", service: "Glutathione Needling", rating: 5, text: "My pigmentation has visibly faded. Honest advice, no upselling. Highly recommend.", date: "2026-06-19", status: "pending" },
];
