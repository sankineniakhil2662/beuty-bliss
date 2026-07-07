import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "./firebase";

// Canonical review data (Firestore shape). Mirrors the mockup's sample reviews
// and is used by scripts/seed-reviews.mjs.
export const SEED_REVIEWS = [
  {
    name: "Aisha K.",
    service: "Korean Glass Facial",
    rating: 5,
    text: "My skin has never looked this dewy. Sruthi explained every step and the follow-up was so personal.",
    photos: ["✨", "🧖"],
    status: "approved",
  },
  {
    name: "Megan R.",
    service: "Microneedling",
    rating: 5,
    text: "Saw a real difference in my acne scars after just two sessions. Clean studio, gentle hands.",
    photos: ["🧴"],
    status: "approved",
  },
  {
    name: "Priya S.",
    service: "Pearl Facial",
    rating: 5,
    text: "Booked a day, got a call within the hour to confirm. Felt looked-after from start to finish.",
    photos: [],
    status: "approved",
  },
  {
    name: "Linda M.",
    service: "June Glow Combination",
    rating: 4,
    text: "Lovely combination facial and great value. Glow lasted well over a week.",
    photos: [],
    status: "approved",
  },
  {
    name: "Fatima A.",
    service: "Glutathione Needling",
    rating: 5,
    text: "My pigmentation has visibly faded. Honest advice, no upselling. Highly recommend.",
    photos: ["🌸", "✨"],
    status: "approved",
  },
  {
    name: "Chloe T.",
    service: "Back Polish Massage",
    rating: 5,
    text: "So relaxing and my back felt brand new. Already booked my next visit.",
    photos: [],
    status: "approved",
  },
];

// Map a Firestore/canonical review into the shape ReviewCard consumes, keeping
// both field names: name/nm, service/svc, rating/r, text/t, photos.
export function mapReview(data) {
  return {
    id: data.id ?? null,
    name: data.name,
    nm: data.name,
    service: data.service,
    svc: data.service,
    rating: data.rating,
    r: data.rating,
    text: data.text,
    t: data.text,
    photos: data.photos && data.photos.length ? data.photos : null,
    status: data.status,
  };
}

// Read approved reviews, newest first.
// Note: status is filtered in JS (not the query) to avoid a composite index,
// same approach as getServices().
export async function getApprovedReviews() {
  const snap = await getDocs(
    query(collection(db, "reviews"), orderBy("createdAt", "desc"))
  );
  return snap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((r) => r.status === "approved")
    .map(mapReview);
}
