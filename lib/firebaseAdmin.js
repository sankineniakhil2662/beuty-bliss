// Firebase Admin SDK — SERVER ONLY. Never import this from a Client Component
// or any file that ends up in the browser bundle: it uses the service-account
// private key. Used by server components / route handlers (admin data reads,
// status updates, review tokens).
//
// Lazy, resilient accessors — same pattern as lib/firebase.js's
// getFirebaseAuth()/getFirebaseStorage(). Initializing eagerly at module load
// would throw whenever the service-account env vars are missing, which
// crashes `next build` itself (it statically imports every route module to
// collect page data), not just the routes that actually use it.
import { initializeApp, getApps, getApp, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

let _adminApp;
function getAdminApp() {
  if (_adminApp !== undefined) return _adminApp;
  const {
    FIREBASE_ADMIN_PROJECT_ID: projectId,
    FIREBASE_ADMIN_CLIENT_EMAIL: clientEmail,
    FIREBASE_ADMIN_PRIVATE_KEY: privateKey,
  } = process.env;
  if (!projectId || !clientEmail || !privateKey) {
    _adminApp = null;
    return _adminApp;
  }
  try {
    _adminApp = getApps().length
      ? getApp()
      : initializeApp({
          credential: cert({
            projectId,
            clientEmail,
            // In .env the private key is a single line with literal "\n" — restore newlines.
            privateKey: privateKey.replace(/\\n/g, "\n"),
          }),
        });
  } catch {
    _adminApp = null;
  }
  return _adminApp;
}

let _adminAuth;
export function getAdminAuth() {
  if (_adminAuth !== undefined) return _adminAuth;
  const app = getAdminApp();
  _adminAuth = app ? getAuth(app) : null;
  return _adminAuth;
}

let _adminDb;
export function getAdminDb() {
  if (_adminDb !== undefined) return _adminDb;
  const app = getAdminApp();
  _adminDb = app ? getFirestore(app) : null;
  return _adminDb;
}
