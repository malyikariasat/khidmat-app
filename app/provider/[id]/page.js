"use client";

import { useEffect, useState } from "react";
import { getProviderById } from "@/data/providers";
import { getReviewsForProvider } from "@/lib/reviews";
import StarRating from "@/components/StarRating";
import VerifiedBadge from "@/components/VerifiedBadge";
import WhatsAppButton from "@/components/WhatsAppButton";
import ReviewForm from "@/components/ReviewForm";
import { notFound } from "next/navigation";

export default function ProviderPage({ params }) {
  const provider = getProviderById(params.id);
  const [liveReviews, setLiveReviews] = useState([]);

  useEffect(() => {
    if (!provider) return;
    getReviewsForProvider(provider.id).then(setLiveReviews);
  }, [provider]);

  if (!provider) return notFound();

  const allReviews = [...liveReviews, ...provider.recentReviews];

  return (
    <div className="max-w-3xl mx-auto px-5 py-10">
      <div className="border border-line rounded-xl p-6 bg-white/60">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h1 className="font-display font-bold text-2xl text-ink">{provider.name}</h1>
            <p className="mono-tag text-sm text-ink/70 mt-1">{provider.sectorName}</p>
          </div>
          {provider.availableToday ? (
            <span className="text-xs font-medium text-signal-dark bg-signal-light rounded-full px-3 py-1">
              ● Available today
            </span>
          ) : (
            <span className="text-xs font-medium text-ink/60 bg-line/40 rounded-full px-3 py-1">
              Not available today
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap mt-3">
          <StarRating rating={provider.rating} reviews={provider.reviews} />
          <VerifiedBadge type={provider.verified ? provider.verificationType : null} />
          <span className="text-sm text-ink/70">{provider.experience} experience</span>
        </div>

        <p className="mt-4 text-ink/80">{provider.bio}</p>

        <div className="grid sm:grid-cols-2 gap-3 mt-5 text-sm">
          <div className="border border-line rounded-md px-3 py-2">
            <p className="text-ink/60">Typical rate range</p>
            <p className="font-mono font-medium text-ink">Rs {provider.rateMin} – {provider.rateMax}</p>
          </div>
          <div className="border border-line rounded-md px-3 py-2">
            <p className="text-ink/60">Average response time</p>
            <p className="font-mono font-medium text-ink">~{provider.responseMins} minutes</p>
          </div>
        </div>

        <WhatsAppButton
          provider={provider}
          details={{ category: provider.category, sectorName: provider.sectorName }}
          className="mt-6 w-full sm:w-auto"
        />
      </div>

      <section className="mt-8">
        <h2 className="font-display font-bold text-xl text-ink mb-3">Reviews</h2>
        <div className="grid gap-3 mb-6">
          {allReviews.map((r, i) => (
            <div key={r.id || i} className="border border-line rounded-lg p-4 bg-white/60">
              <div className="flex items-center justify-between">
                <p className="font-medium text-ink">{r.author}</p>
                <StarRating rating={r.rating} />
              </div>
              <p className="text-sm text-ink/80 mt-1">{r.text}</p>
              {r.date && <p className="text-xs text-ink/50 mt-1">{r.date}</p>}
            </div>
          ))}
        </div>
        <ReviewForm providerId={provider.id} />
      </section>
    </div>
  );
}
