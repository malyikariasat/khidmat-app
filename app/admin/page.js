"use client";

import { useEffect, useState } from "react";
import { getAllReviewsForModeration, setReviewStatus } from "@/lib/reviews";
import { getProviderById } from "@/data/providers";
import { isFirebaseConfigured } from "@/lib/firebase";

export default function AdminPage() {
  const [unlocked, setUnlocked] = useState(false);
  const [password, setPassword] = useState("");
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const expected = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || "khidmat-admin";

  async function loadReviews() {
    setLoading(true);
    const all = await getAllReviewsForModeration();
    setReviews(all.sort((a, b) => (a.status === "pending" ? -1 : 1)));
    setLoading(false);
  }

  useEffect(() => {
    if (unlocked) loadReviews();
  }, [unlocked]);

  async function updateStatus(id, status) {
    await setReviewStatus(id, status);
    loadReviews();
  }

  if (!unlocked) {
    return (
      <div className="max-w-sm mx-auto px-5 py-16">
        <h1 className="font-display font-bold text-xl text-ink mb-2">Admin — moderation lite</h1>
        <p className="text-sm text-ink/70 mb-4">
          MVP-only password gate. Not a substitute for real auth — swap in Firebase Auth + admin
          claims before real launch.
        </p>
        <input
          type="password"
          placeholder="Admin password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-line rounded-md px-3 py-2 w-full bg-white mb-3"
        />
        <button
          onClick={() => setUnlocked(password === expected)}
          className="bg-ink text-paper rounded-md px-4 py-2.5 w-full font-medium hover:bg-signal-dark"
        >
          Enter
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-5 py-10">
      <h1 className="font-display font-bold text-2xl text-ink mb-1">Review moderation</h1>
      <p className="text-sm text-ink/70 mb-6">
        {isFirebaseConfigured ? "Connected to Firestore." : "Demo mode — reading from this browser's localStorage."}
      </p>

      {loading && <p className="text-ink/60">Loading…</p>}

      <div className="grid gap-3">
        {reviews.map((r) => {
          const provider = getProviderById(r.providerId);
          return (
            <div key={r.id} className="border border-line rounded-lg p-4 bg-white/60">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <p className="font-medium text-ink">
                  {provider ? provider.name : r.providerId} — {r.rating}★
                </p>
                <span
                  className={`text-xs font-medium rounded-full px-2 py-0.5 ${
                    r.status === "approved"
                      ? "bg-signal-light text-signal-dark"
                      : r.status === "rejected"
                      ? "bg-brick-light text-brick"
                      : "bg-caution-light text-caution-dark"
                  }`}
                >
                  {r.status}
                </span>
              </div>
              <p className="text-sm text-ink/80 mt-1">{r.text}</p>
              <p className="text-xs text-ink/50 mt-1">by {r.author}</p>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={() => updateStatus(r.id, "approved")}
                  className="text-xs font-medium rounded-md px-3 py-1.5 bg-signal text-white hover:bg-signal-dark"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(r.id, "rejected")}
                  className="text-xs font-medium rounded-md px-3 py-1.5 bg-brick text-white hover:bg-brick/90"
                >
                  Reject / flag as fake
                </button>
              </div>
            </div>
          );
        })}
        {!loading && reviews.length === 0 && (
          <p className="text-ink/60">No reviews submitted yet.</p>
        )}
      </div>
    </div>
  );
}
