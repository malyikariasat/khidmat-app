"use client";

import { useState } from "react";
import { CATEGORIES } from "@/data/categories";
import { SECTORS } from "@/data/sectors";
import { matchProviders } from "@/lib/matcher";
import MatchResults from "./MatchResults";

const URGENCY_OPTIONS = [
  { value: "now", label: "Urgent — right now" },
  { value: "today", label: "Today" },
  { value: "flexible", label: "Flexible / this week" }
];

export default function MatcherForm() {
  const [category, setCategory] = useState(CATEGORIES[0].slug);
  const [sectorCode, setSectorCode] = useState(SECTORS[0].code);
  const [urgency, setUrgency] = useState("now");
  const [budgetMin, setBudgetMin] = useState(1000);
  const [budgetMax, setBudgetMax] = useState(4000);
  const [notes, setNotes] = useState("");
  const [results, setResults] = useState(null);

  function handleSubmit(e) {
    e.preventDefault();
    const sector = SECTORS.find((s) => s.code === sectorCode);
    const matches = matchProviders({
      category,
      userLat: sector.lat,
      userLng: sector.lng,
      urgency,
      budgetMin: Number(budgetMin) || 0,
      budgetMax: Number(budgetMax) || Infinity
    });
    setResults({ matches, sector, category, urgency, budget: `${budgetMin}-${budgetMax}`, notes });
  }

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="bg-white/70 border border-line rounded-xl p-5 sm:p-6 grid gap-4 sm:grid-cols-2"
      >
        <div className="sm:col-span-2">
          <p className="mono-tag text-xs text-signal-dark uppercase tracking-wide mb-1">Service request</p>
          <h2 className="font-display font-bold text-xl text-ink">
            Tell us what you need — we'll find your top 3
          </h2>
        </div>

        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-line rounded-md px-3 py-2 bg-white"
          >
            {CATEGORIES.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.icon} {c.label}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Area / Sector
          <select
            value={sectorCode}
            onChange={(e) => setSectorCode(e.target.value)}
            className="border border-line rounded-md px-3 py-2 bg-white"
          >
            {SECTORS.map((s) => (
              <option key={s.code} value={s.code}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        <fieldset className="sm:col-span-2">
          <legend className="text-sm font-medium text-ink mb-1">Urgency</legend>
          <div className="flex flex-wrap gap-2">
            {URGENCY_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className={`cursor-pointer text-sm px-3 py-2 rounded-md border ${
                  urgency === opt.value
                    ? "bg-caution text-white border-caution"
                    : "border-line text-ink bg-white"
                }`}
              >
                <input
                  type="radio"
                  name="urgency"
                  value={opt.value}
                  checked={urgency === opt.value}
                  onChange={(e) => setUrgency(e.target.value)}
                  className="sr-only"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>

        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Budget min (Rs)
          <input
            type="number"
            min="0"
            value={budgetMin}
            onChange={(e) => setBudgetMin(e.target.value)}
            className="border border-line rounded-md px-3 py-2 bg-white"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-ink">
          Budget max (Rs)
          <input
            type="number"
            min="0"
            value={budgetMax}
            onChange={(e) => setBudgetMax(e.target.value)}
            className="border border-line rounded-md px-3 py-2 bg-white"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm font-medium text-ink sm:col-span-2">
          Notes (optional)
          <input
            type="text"
            placeholder="e.g. leaking tap under kitchen sink"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="border border-line rounded-md px-3 py-2 bg-white"
          />
        </label>

        <button
          type="submit"
          className="sm:col-span-2 bg-ink text-paper font-medium rounded-md px-4 py-3 hover:bg-signal-dark transition-colors"
        >
          Find my top 3 matches
        </button>
      </form>

      {results && <MatchResults {...results} />}
    </div>
  );
}
