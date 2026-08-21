import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDTH0t174bbJ4fmMf7lJVU-4tZmbITLN0E",
  authDomain: "khidmat-app-1d312.firebaseapp.com",
  projectId: "khidmat-app-1d312",
  storageBucket: "khidmat-app-1d312.firebasestorage.app",
  messagingSenderId: "1035163110772",
  appId: "1:1035163110772:web:eb4fe1a9abde785365f02",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});