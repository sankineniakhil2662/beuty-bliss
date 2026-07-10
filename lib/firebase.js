import { initializeApp, getApps, getApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Reuse the existing app across hot reloads / repeated imports instead of
// re-initializing (which throws "Firebase App named '[DEFAULT]' already exists").
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getFirestore(app);

// Lazy, resilient auth accessor. getAuth() throws on an invalid/empty apiKey,
// and lib/firebase is imported by server code too — so we must NOT initialize
// auth at module load (that would 500 every page when config is missing).
// Returns null if auth can't initialize; callers treat that as "logged out".
let _auth;
export function getFirebaseAuth() {
  if (_auth !== undefined) return _auth;
  try {
    _auth = getAuth(app);
  } catch {
    _auth = null;
  }
  return _auth;
}

// Lazy Cloud Storage accessor (same resilient pattern as auth).
let _storage;
export function getFirebaseStorage() {
  if (_storage !== undefined) return _storage;
  try {
    _storage = getStorage(app);
  } catch {
    _storage = null;
  }
  return _storage;
}

export default app;
