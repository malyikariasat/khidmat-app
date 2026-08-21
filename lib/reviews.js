import { db, isFirebaseConfigured } from "./firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
  updateDoc,
  doc
} from "firebase/firestore";

const LOCAL_KEY = "khidmat_local_reviews";

function readLocal() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(LOCAL_KEY) || "[]");
  } catch {
    return [];
  }
}

function writeLocal(reviews) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(LOCAL_KEY, JSON.stringify(reviews));
}

export async function submitReview({ providerId, author, rating, text, photoUrl }) {
  const entry = {
    providerId,
    author: author || "Anonymous",
    rating,
    text,
    photoUrl: photoUrl || null,
    status: "pending", // MVP-lite moderation: admin approves before public display
    createdAt: new Date().toISOString()
  };

  if (isFirebaseConfigured) {
    await addDoc(collection(db, "reviews"), { ...entry, createdAt: serverTimestamp() });
    return entry;
  }

  const all = readLocal();
  all.unshift({ ...entry, id: `local_${Date.now()}` });
  writeLocal(all);
  return entry;
}

export async function getReviewsForProvider(providerId) {
  if (isFirebaseConfigured) {
    const q = query(
      collection(db, "reviews"),
      where("providerId", "==", providerId),
      where("status", "==", "approved"),
      orderBy("createdAt", "desc")
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return readLocal().filter((r) => r.providerId === providerId && r.status !== "rejected");
}

export async function getAllReviewsForModeration() {
  if (isFirebaseConfigured) {
    const snap = await getDocs(collection(db, "reviews"));
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
  }
  return readLocal();
}

export async function setReviewStatus(reviewId, status) {
  if (isFirebaseConfigured) {
    await updateDoc(doc(db, "reviews", reviewId), { status });
    return;
  }
  const all = readLocal();
  const updated = all.map((r) => (r.id === reviewId ? { ...r, status } : r));
  writeLocal(updated);
}
