"use client";

import { useState } from "react";
import { submitReview } from "@/lib/reviews";
import { isFirebaseConfigured } from "@/lib/firebase";

export default function ReviewForm({ providerId, onSubmitted }) {
  const [author, setAuthor] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");
  const [status, setStatus] = useState("idle");

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("saving");
    await submitReview({ providerId, author, rating, text, photoUrl });
    setStatus("saved");
    setText("");
    setPhotoUrl("");
    if (onSubmitted) onSubmitted();
  }

  return (
    <form onSubmit={handleSubmit} className="border border-line rounded-lg p-4 bg-white/60 grid gap-3">
      <h3 className="font-display font-bold text-ink">Leave a review</h3>
      {!isFirebaseConfigured && (
        <p className="text-xs text-caution-dark bg-caution-light rounded px-2 py-1">
          Running in demo mode — this review is saved to your browser only, until Firebase is
          connected (see README).
        </p>
      )}
      <div className="grid sm:grid-cols-2 gap-3">
        <input
          type="text"
          placeholder="Your name (optional)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          className="border border-line rounded-md px-3 py-2 bg-white"
        />
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="border border-line rounded-md px-3 py-2 bg-white"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {n} star{n > 1 ? "s" : ""}
            </option>
          ))}
        </select>
      </div>
      <textarea
        required
        placeholder="How was the job done?"
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="border border-line rounded-md px-3 py-2 bg-white min-h-[80px]"
      />
      <input
        type="url"
        placeholder="Photo URL (optional)"
        value={photoUrl}
        onChange={(e) => setPhotoUrl(e.target.value)}
        className="border border-line rounded-md px-3 py-2 bg-white"
      />
      <button
        type="submit"
        disabled={status === "saving"}
        className="bg-ink text-paper font-medium rounded-md px-4 py-2.5 hover:bg-signal-dark transition-colors disabled:opacity-60"
      >
        {status === "saving" ? "Submitting..." : "Submit review"}
      </button>
      {status === "saved" && (
        <p className="text-sm text-signal-dark">
          Thanks! Your review is pending admin approval before it appears publicly.
        </p>
      )}
    </form>
  );
}
