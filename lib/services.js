import {
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// Canonical service data in the Firestore document shape.
// Used to (a) seed the `services` collection (scripts/seed-services.mjs)
// and (b) provide the Home page's featured fallback so the 3-card grid
// always renders even before Firestore is seeded.
export const SEED_SERVICES = [
  {
    name: "Korean Glass Facial",
    description: "FYC Korean Glass Skin rice-water facial for a dewy, poreless glow.",
    durationMin: 60,
    category: "Facial",
    priceCad: 100,
    wasCad: 120,
    deal: "Save $20",
    isActive: true,
    sortOrder: 1,
  },
  {
    name: "June Glow Combination",
    description: "Dermaplaning + microdermabrasion + LED light therapy in one ultimate glow facial.",
    durationMin: 90,
    category: "Special",
    priceCad: 100,
    wasCad: 150,
    deal: "Combo",
    isActive: true,
    sortOrder: 2,
  },
  {
    name: "Pearl Facial",
    description: "Monthly skin-maintenance facial for brightening and smooth texture.",
    durationMin: 45,
    category: "Facial",
    priceCad: 50,
    wasCad: null,
    deal: null,
    isActive: true,
    sortOrder: 3,
  },
  {
    name: "Derma Peel",
    description: "Microdermabrasion paired with a chemical peel to resurface and renew.",
    durationMin: 60,
    category: "Advanced",
    priceCad: 100,
    wasCad: null,
    deal: null,
    isActive: true,
    sortOrder: 4,
  },
  {
    name: "Microneedling",
    description: "Innopen microneedling with red light therapy to boost collagen.",
    durationMin: 75,
    category: "Advanced",
    priceCad: 150,
    wasCad: null,
    deal: null,
    isActive: true,
    sortOrder: 5,
  },
  {
    name: "Glutathione Needling",
    description: "Microneedling with glutathione serum for radiance and even tone.",
    durationMin: 75,
    category: "Advanced",
    priceCad: 175,
    wasCad: null,
    deal: null,
    isActive: true,
    sortOrder: 6,
  },
  {
    name: "PRP Treatment",
    description: "Platelet-rich plasma treatment to rejuvenate and restore skin.",
    durationMin: 90,
    category: "Advanced",
    priceCad: 200,
    wasCad: null,
    deal: null,
    isActive: true,
    sortOrder: 7,
  },
  {
    name: "Hand Polish",
    description: "Elbow-to-palm treatment: tan pack, sugar scrub, and nourishing mask.",
    durationMin: 45,
    category: "Body",
    priceCad: 50,
    wasCad: null,
    deal: null,
    isActive: true,
    sortOrder: 8,
  },
  {
    name: "Back Polish Massage",
    description: "Gentle cleansing, exfoliation, and a relaxing back massage.",
    durationMin: 50,
    category: "Body",
    priceCad: 50,
    wasCad: null,
    deal: null,
    isActive: true,
    sortOrder: 9,
  },
  {
    name: "Birthday Glow-Up",
    description: "Birthday Bliss Blast — 25% off any service in your birthday month.",
    durationMin: 60,
    category: "Special",
    priceCad: 75,
    wasCad: null,
    deal: "25% Off",
    isActive: true,
    sortOrder: 10,
  },
];

// Map a Firestore/canonical service into the shape ServiceCard consumes,
// keeping BOTH field names (canonical + mockup aliases) so nothing downstream
// breaks: name/n, description/d, durationMin/dur, priceCad/price, wasCad/was,
// category/cat, deal.
export function mapService(data) {
  return {
    id: data.id ?? null,
    name: data.name,
    n: data.name,
    description: data.description,
    d: data.description,
    durationMin: data.durationMin,
    dur: data.durationMin,
    priceCad: data.priceCad,
    price: data.priceCad,
    wasCad: data.wasCad ?? null,
    was: data.wasCad ?? null,
    category: data.category,
    cat: data.category,
    deal: data.deal ?? null,
  };
}

// Read active services from Firestore, ordered by sortOrder.
// Note: isActive is filtered in JS (not in the query) on purpose — combining
// where("isActive","==",true) with orderBy("sortOrder") would require a
// composite index. At this catalog size a client-side filter is equivalent
// and avoids that one-time setup. Move it into the query + add the index if
// the catalog grows large.
export async function getServices() {
  const snap = await getDocs(query(collection(db, "services"), orderBy("sortOrder")));
  return snap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((s) => s.isActive === true)
    .map(mapService);
}

// Featured services for the Home page — first 3 of the seed data, mapped to
// the ServiceCard shape. Static so Home never depends on Firestore.
export const FEATURED_SERVICES = SEED_SERVICES.slice(0, 3).map(mapService);

// ---- Admin (authenticated as admin; gated by Firestore rules) ----

// All services (including hidden), ordered by sortOrder, in the raw Firestore
// shape the ServiceAdminTable expects ({ id, name, category, durationMin,
// priceCad, wasCad, isActive }).
export async function fetchAllServicesAdmin() {
  const snap = await getDocs(
    query(collection(db, "services"), orderBy("sortOrder"))
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function setServiceActive(id, isActive) {
  await updateDoc(doc(db, "services", id), { isActive });
}
