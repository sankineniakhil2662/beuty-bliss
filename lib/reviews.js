import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
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
// Constrained to status == "approved" (single-field filter, no composite index)
// so it satisfies the public read rule; sorted by createdAt in JS.
export async function getApprovedReviews() {
  const snap = await getDocs(
    query(collection(db, "reviews"), where("status", "==", "approved"))
  );
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .sort((a, b) => (b.createdAt?.seconds ?? 0) - (a.createdAt?.seconds ?? 0))
    .map(mapReview);
}

// ---- Admin (authenticated as admin; gated by Firestore rules) ----

// All reviews for moderation, newest-first, mapped to the ReviewModeration
// table shape ({ id, name, service, rating, text, photos, ref, status, date }).
export async function fetchAllReviewsForAdmin() {
  const snap = await getDocs(
    query(collection(db, "reviews"), orderBy("createdAt", "desc"))
  );
  return snap.docs.map((d) => {
    const r = d.data();
    return {
      id: d.id,
      name: r.name,
      service: r.service,
      rating: r.rating,
      text: r.text,
      photos: r.photos && r.photos.length ? r.photos : null,
      ref: r.ref ?? r.bookingRef ?? "",
      status: r.status,
      date: r.createdAt?.toDate
        ? r.createdAt.toDate().toISOString().slice(0, 10)
        : "",
    };
  });
}

export async function setReviewStatus(id, status) {
  await updateDoc(doc(db, "reviews", id), { status });
}

export async function removeReview(id) {
  await deleteDoc(doc(db, "reviews", id));
}
