// Seed the Firestore `reviews` collection with the mockup's sample reviews
// (all pre-approved so they show on the public Reviews page).
//
//   node --env-file=.env.local scripts/seed-reviews.mjs
//
// Requires .env.local filled and Firestore rules allowing writes to `reviews`
// while seeding (test mode, or a temporary open rule). Idempotent: deterministic
// doc ids so re-running updates in place.

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc, serverTimestamp } from "firebase/firestore";

const config = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!config.apiKey || !config.projectId) {
  console.error(
    "Missing Firebase config. Run with:\n  node --env-file=.env.local scripts/seed-reviews.mjs"
  );
  process.exit(1);
}

const REVIEWS = [
  { name: "Aisha K.", service: "Korean Glass Facial", rating: 5, text: "My skin has never looked this dewy. Sruthi explained every step and the follow-up was so personal.", photos: ["✨", "🧖"], status: "approved" },
  { name: "Megan R.", service: "Microneedling", rating: 5, text: "Saw a real difference in my acne scars after just two sessions. Clean studio, gentle hands.", photos: ["🧴"], status: "approved" },
  { name: "Priya S.", service: "Pearl Facial", rating: 5, text: "Booked a day, got a call within the hour to confirm. Felt looked-after from start to finish.", photos: [], status: "approved" },
  { name: "Linda M.", service: "June Glow Combination", rating: 4, text: "Lovely combination facial and great value. Glow lasted well over a week.", photos: [], status: "approved" },
  { name: "Fatima A.", service: "Glutathione Needling", rating: 5, text: "My pigmentation has visibly faded. Honest advice, no upselling. Highly recommend.", photos: ["🌸", "✨"], status: "approved" },
  { name: "Chloe T.", service: "Back Polish Massage", rating: 5, text: "So relaxing and my back felt brand new. Already booked my next visit.", photos: [], status: "approved" },
];

const slug = (s) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function main() {
  const db = getFirestore(initializeApp(config));
  let i = 0;
  for (const rev of REVIEWS) {
    const id = `${slug(rev.name)}-${slug(rev.service)}`;
    // Stagger createdAt so newest-first ordering is stable across the seed set.
    await setDoc(doc(db, "reviews", id), { ...rev, createdAt: serverTimestamp() });
    console.log(`✓ seeded reviews/${id}`);
    i++;
  }
  console.log(`\nDone — seeded ${i} reviews.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err.message || err);
  process.exit(1);
});
