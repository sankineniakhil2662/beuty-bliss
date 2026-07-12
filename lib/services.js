import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { withTimeout } from "./withTimeout";

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
    isFeatured: data.isFeatured === true,
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
    imageUrl: data.imageUrl ?? null,
  };
}

// Read active services from Firestore, ordered by sortOrder.
// Note: isActive is filtered in JS (not in the query) on purpose — combining
// where("isActive","==",true) with orderBy("sortOrder") would require a
// composite index. At this catalog size a client-side filter is equivalent
// and avoids that one-time setup. Move it into the query + add the index if
// the catalog grows large.
export async function getServices() {
  const snap = await withTimeout(
    getDocs(query(collection(db, "services"), orderBy("sortOrder"))),
    7000,
    "Loading services"
  );
  return snap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((s) => s.isActive === true)
    .map(mapService);
}

// How many cards the Home page's "Loved by our clients" grid shows.
export const FEATURED_LIMIT = 3;

// Offline fallback only — used when Firestore can't be reached, so the Home
// page still renders 3 cards instead of a gap. The real list is admin-picked.
export const FEATURED_SERVICES = SEED_SERVICES.slice(0, FEATURED_LIMIT).map(mapService);

// The Home page's featured cards. Featuring is a flag on the service itself
// (not a separate collection), so a price/photo edited under Admin → Services
// is automatically the same one shown on the Home page — no second copy to
// keep in sync.
//
// Falls back to the first few active services when nothing has been featured
// yet (fresh database, or docs seeded before this flag existed), so the grid
// is never empty.
export async function getFeaturedServices() {
  const snap = await withTimeout(
    getDocs(query(collection(db, "services"), orderBy("sortOrder"))),
    7000,
    "Loading featured services"
  );
  const active = snap.docs
    .map((doc) => ({ id: doc.id, ...doc.data() }))
    .filter((s) => s.isActive === true);

  const featured = active.filter((s) => s.isFeatured === true);
  const list = featured.length ? featured : active;
  return list.slice(0, FEATURED_LIMIT).map(mapService);
}

// ---- Admin (authenticated as admin; gated by Firestore rules) ----

// All services (including hidden), ordered by sortOrder, in the raw Firestore
// shape the ServiceAdminTable expects ({ id, name, category, durationMin,
// priceCad, wasCad, isActive }).
export async function fetchAllServicesAdmin() {
  const snap = await withTimeout(
    getDocs(query(collection(db, "services"), orderBy("sortOrder"))),
    7000,
    "Loading services"
  );
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function setServiceActive(id, isActive) {
  await updateDoc(doc(db, "services", id), { isActive });
}

// Pin/unpin a service to the Home page's "Loved by our clients" grid.
export async function setServiceFeatured(id, isFeatured) {
  await updateDoc(doc(db, "services", id), { isFeatured });
}

// Create a new service. `data` is the raw Firestore shape (name, description,
// durationMin, category, priceCad, wasCad, deal, isActive, sortOrder).
export async function createService(data) {
  const ref = await addDoc(collection(db, "services"), data);
  return { id: ref.id, ...data };
}

export async function updateService(id, data) {
  await updateDoc(doc(db, "services", id), data);
}
