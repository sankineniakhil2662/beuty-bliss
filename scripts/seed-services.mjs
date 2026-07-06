// Seed the Firestore `services` collection with the studio's 10 services.
//
// Run from the project root:
//   node --env-file=.env.local scripts/seed-services.mjs
//
// Requirements:
//   - .env.local filled with the NEXT_PUBLIC_FIREBASE_* values.
//   - Firestore rules must allow writes to `services` while seeding. If your
//     database is in "test mode" this already works. Otherwise temporarily add:
//       match /services/{id} { allow read, write: if true; }
//     run the seed, then tighten the rule back to read-only.
//
// Idempotent: each service is written with a deterministic doc id (slug of the
// name), so re-running updates in place instead of creating duplicates.
//
// NOTE: this data mirrors SEED_SERVICES in lib/services.js — keep them in sync.

import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";

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
    "Missing Firebase config. Run with:\n  node --env-file=.env.local scripts/seed-services.mjs\nand make sure .env.local has the NEXT_PUBLIC_FIREBASE_* values."
  );
  process.exit(1);
}

const SERVICES = [
  { name: "Korean Glass Facial", description: "FYC Korean Glass Skin rice-water facial for a dewy, poreless glow.", durationMin: 60, category: "Facial", priceCad: 100, wasCad: 120, deal: "Save $20", isActive: true, sortOrder: 1 },
  { name: "June Glow Combination", description: "Dermaplaning + microdermabrasion + LED light therapy in one ultimate glow facial.", durationMin: 90, category: "Special", priceCad: 100, wasCad: 150, deal: "Combo", isActive: true, sortOrder: 2 },
  { name: "Pearl Facial", description: "Monthly skin-maintenance facial for brightening and smooth texture.", durationMin: 45, category: "Facial", priceCad: 50, wasCad: null, deal: null, isActive: true, sortOrder: 3 },
  { name: "Derma Peel", description: "Microdermabrasion paired with a chemical peel to resurface and renew.", durationMin: 60, category: "Advanced", priceCad: 100, wasCad: null, deal: null, isActive: true, sortOrder: 4 },
  { name: "Microneedling", description: "Innopen microneedling with red light therapy to boost collagen.", durationMin: 75, category: "Advanced", priceCad: 150, wasCad: null, deal: null, isActive: true, sortOrder: 5 },
  { name: "Glutathione Needling", description: "Microneedling with glutathione serum for radiance and even tone.", durationMin: 75, category: "Advanced", priceCad: 175, wasCad: null, deal: null, isActive: true, sortOrder: 6 },
  { name: "PRP Treatment", description: "Platelet-rich plasma treatment to rejuvenate and restore skin.", durationMin: 90, category: "Advanced", priceCad: 200, wasCad: null, deal: null, isActive: true, sortOrder: 7 },
  { name: "Hand Polish", description: "Elbow-to-palm treatment: tan pack, sugar scrub, and nourishing mask.", durationMin: 45, category: "Body", priceCad: 50, wasCad: null, deal: null, isActive: true, sortOrder: 8 },
  { name: "Back Polish Massage", description: "Gentle cleansing, exfoliation, and a relaxing back massage.", durationMin: 50, category: "Body", priceCad: 50, wasCad: null, deal: null, isActive: true, sortOrder: 9 },
  { name: "Birthday Glow-Up", description: "Birthday Bliss Blast — 25% off any service in your birthday month.", durationMin: 60, category: "Special", priceCad: 75, wasCad: null, deal: "25% Off", isActive: true, sortOrder: 10 },
];

const slug = (n) =>
  n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

async function main() {
  const app = initializeApp(config);
  const db = getFirestore(app);

  for (const svc of SERVICES) {
    const id = slug(svc.name);
    await setDoc(doc(db, "services", id), svc);
    console.log(`✓ seeded services/${id}`);
  }

  console.log(`\nDone — seeded ${SERVICES.length} services.`);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err.message || err);
  process.exit(1);
});
