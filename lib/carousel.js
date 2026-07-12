import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { db } from "./firebase";

// Home-hero carousel images, admin-managed via Cloud Storage + the
// `carousel` Firestore collection (see app/admin/carousel).
// Doc shape: { imageUrl, alt, sortOrder, isActive, createdAt }.

// Public: active slides, in display order. Hero.jsx falls back to the
// static logo when this is empty (unconfigured Firebase, or none uploaded
// yet) — same resilience pattern as getServices()/getApprovedReviews().
// Only plain-serializable fields are returned: this crosses the Server
// Component → Client Component (HeroCarousel) boundary, which can't carry
// the raw Firestore Timestamp on `createdAt` (it has a toJSON method, not a
// plain object).
export async function getCarouselImages() {
  const snap = await getDocs(query(collection(db, "carousel"), orderBy("sortOrder")));
  return snap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((s) => s.isActive === true)
    .map((s) => ({ id: s.id, imageUrl: s.imageUrl, alt: s.alt || "" }));
}

// ---- Admin (authenticated as admin; gated by Firestore rules) ----

export async function fetchAllCarouselImagesAdmin() {
  const snap = await getDocs(query(collection(db, "carousel"), orderBy("sortOrder")));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// `sortOrder` is assigned as "append to the end" — the admin grid has no
// drag-reorder yet, just add/remove.
export async function addCarouselImage({ imageUrl, alt, sortOrder }) {
  const ref = await addDoc(collection(db, "carousel"), {
    imageUrl,
    alt: alt || "",
    sortOrder,
    isActive: true,
    createdAt: serverTimestamp(),
  });
  return { id: ref.id };
}

export async function setCarouselImageActive(id, isActive) {
  await updateDoc(doc(db, "carousel", id), { isActive });
}

export async function deleteCarouselImage(id) {
  await deleteDoc(doc(db, "carousel", id));
}
