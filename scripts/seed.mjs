// Optional: pushes data/providers.js into a Firestore "providers" collection.
// Only needed once you've connected Firebase and want providers to live in
// the database instead of the static seed file. Run locally with:
//   node scripts/seed.mjs
// Requires the same NEXT_PUBLIC_FIREBASE_* vars as your .env.local, and
// requires Firestore rules to temporarily allow writes (see README).

import { initializeApp } from "firebase/app";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import "dotenv/config";
import { PROVIDERS } from "../data/providers.js";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

if (!firebaseConfig.apiKey) {
  console.error("Missing Firebase env vars. Copy .env.example to .env.local and fill it in first.");
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const run = async () => {
  for (const provider of PROVIDERS) {
    await setDoc(doc(collection(db, "providers"), provider.id), provider);
    console.log(`Seeded ${provider.id} — ${provider.name}`);
  }
  console.log(`Done. Seeded ${PROVIDERS.length} providers.`);
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
