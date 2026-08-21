import { distanceKm } from "./haversine";
import { getProvidersByCategory } from "@/data/providers";

/**
 * Rule-based recommender. Deliberately NOT dependent on any paid LLM API —
 * this is a transparent, explainable weighted-scoring engine, which is both
 * free to run and easier for users to trust ("why was this recommended?").
 *
 * If you later want to layer an LLM re-ranker on top (e.g. a free-tier
 * Groq/Gemini call) you can pass the top ~10 results from this function
 * into a prompt and ask it to re-order/annotate them — see README.
 */
export function matchProviders({
  category,
  userLat,
  userLng,
  urgency = "today", // "now" | "today" | "flexible"
  budgetMin = 0,
  budgetMax = Infinity,
  minRating = 0
}) {
  const pool = getProvidersByCategory(category);

  const scored = pool.map((provider) => {
    const distance = distanceKm(userLat, userLng, provider.lat, provider.lng);
    const reasons = [];

    // 1. Proximity — closer providers score higher, capped contribution.
    const distanceScore = Math.max(0, 35 - distance * 3.5);
    if (distance < 3) reasons.push(`Only ~${distance.toFixed(1)} km away`);
    else if (distance < 8) reasons.push(`~${distance.toFixed(1)} km from your location`);

    // 2. Availability vs urgency.
    let availabilityScore = 8; // baseline for flexible requests
    if (urgency === "now") {
      availabilityScore = provider.availableToday ? 28 : 2;
      if (provider.availableToday) reasons.push("Available right now");
    } else if (urgency === "today") {
      availabilityScore = provider.availableToday ? 22 : 6;
      if (provider.availableToday) reasons.push("Available today");
    }

    // 3. Rating quality.
    const ratingScore = (provider.rating / 5) * 20;
    if (provider.rating >= 4.5) reasons.push(`Highly rated (${provider.rating}★, ${provider.reviews} reviews)`);

    // 4. Budget fit.
    let priceFitScore = 0;
    const overlaps = provider.rateMin <= budgetMax && provider.rateMax >= budgetMin;
    if (overlaps) {
      priceFitScore = 16;
      reasons.push(`Rate range (Rs ${provider.rateMin}–${provider.rateMax}) fits your budget`);
    } else {
      const gap =
        budgetMax < provider.rateMin ? provider.rateMin - budgetMax : provider.rateMin - budgetMax;
      priceFitScore = -Math.min(15, Math.abs(gap) / 300);
    }

    // 5. Verified trust bonus.
    const verifiedScore = provider.verified ? 10 : 0;
    if (provider.verified) reasons.push(`Verified provider (${provider.verificationType})`);

    // 6. Response time.
    const responseScore = Math.max(0, 10 - provider.responseMins / 15);
    if (provider.responseMins <= 30) reasons.push(`Fast average response (~${provider.responseMins} min)`);

    // Rating floor filter (soft — excluded entirely if below minimum).
    if (provider.rating < minRating) {
      return null;
    }

    const total =
      distanceScore + availabilityScore + ratingScore + priceFitScore + verifiedScore + responseScore;

    return {
      provider,
      distanceKm: distance,
      score: Math.round(total * 10) / 10,
      reasons: reasons.slice(0, 3)
    };
  });

  return scored
    .filter(Boolean)
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
}
