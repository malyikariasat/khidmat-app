"use client";

import { useMemo, useState, useEffect } from "react";
import { getCategory } from "@/data/categories";
import { getProvidersByCategory } from "@/data/providers";
import { SECTORS } from "@/data/sectors";
import ProviderCard from "@/components/ProviderCard";
import { notFound } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

export default function CategoryPage({ params }) {
  const slug = params?.slug;
  const category = getCategory(slug);

  const [area, setArea] = useState("all");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("rating");

  const [firebaseProviders, setFirebaseProviders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchFirebaseProviders() {
      if (!slug) return;
      try {
        setLoading(true);
        const q = query(
          collection(db, "providers"),
          where("category", "==", slug)
        );
        const querySnapshot = await getDocs(q);

        const list = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            name: data.name || "Service Provider",
            sector: data.sector || "all",
            rating: data.rating || 5.0,
            rateMin: Number(data.hourlyRate) || 1000,
            availableToday: data.availableToday ?? true,
            responseMins: data.responseMins || 15,
            phone: data.phone || "",
            bio: data.bio || "",
            category: slug,
            ...data,
          };
        });

        setFirebaseProviders(list);
      } catch (error) {
        console.error("Error fetching firebase providers:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchFirebaseProviders();
  }, [slug]);

  const all = useMemo(() => {
    if (!slug) return [];
    const localList = getProvidersByCategory(slug);
    return [...firebaseProviders, ...localList];
  }, [slug, firebaseProviders]);

  const filtered = useMemo(() => {
    let list = [...all];
    if (area !== "all") list = list.filter((p) => p.sector === area);
    if (availableOnly) list = list.filter((p) => p.availableToday);
    if (minRating > 0) list = list.filter((p) => p.rating >= minRating);
    if (maxPrice) list = list.filter((p) => p.rateMin <= Number(maxPrice));

    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    if (sort === "price") list.sort((a, b) => a.rateMin - b.rateMin);
    if (sort === "response") list.sort((a, b) => a.responseMins - b.responseMins);

    return list;
  }, [all, area, availableOnly, minRating, maxPrice, sort]);

  if (!category) return notFound();

  return (
    <div className="max-w-6xl mx-auto px-5 py-10">
      <p className="mono-tag text-xs text-signal-dark uppercase tracking-widest mb-1">
        {category.icon} Category
      </p>
      <h1 className="font-display font-bold text-3xl text-ink mb-1">
        {category.label}s in the twin cities
      </h1>
      <p className="text-ink/70 mb-8">{category.description}</p>

      <div className="grid gap-4 sm:grid-cols-4 mb-8 bg-white/60 border border-line rounded-lg p-4">
        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Area
          <select
            value={area}
            onChange={(e) => setArea(e.target.value)}
            className="border border-line rounded-md px-2 py-2 bg-white"
          >
            <option value="all">All areas</option>
            {SECTORS.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Min rating
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="border border-line rounded-md px-2 py-2 bg-white"
          >
            <option value={0}>Any</option>
            <option value={4}>4.0+</option>
            <option value={4.5}>4.5+</option>
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Max starting price (Rs)
          <input
            type="number"
            placeholder="e.g. 2000"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="border border-line rounded-md px-2 py-2 bg-white"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Sort by
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="border border-line rounded-md px-2 py-2 bg-white"
          >
            <option value="rating">Top rated</option>
            <option value="price">Lowest price</option>
            <option value="response">Fastest response</option>
          </select>
        </label>

        <label className="flex items-center gap-2 text-sm font-medium text-ink sm:col-span-4">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
          />
          Available today only
        </label>
      </div>

      {loading ? (
        <p className="text-ink/70">Loading verified providers...</p>
      ) : filtered.length === 0 ? (
        <p className="text-ink/70">
          No providers match these filters yet. Try loosening a filter.
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((p) => (
            <ProviderCard key={p.id} provider={p} />
          ))}
        </div>
      )}
    </div>
  );
}