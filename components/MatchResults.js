import { getCategory } from "@/data/categories";
import ProviderCard from "./ProviderCard";
import WhatsAppButton from "./WhatsAppButton";

export default function MatchResults({ matches, sector, category, urgency, budget, notes }) {
  const cat = getCategory(category);

  if (!matches || matches.length === 0) {
    return (
      <div className="mt-6 border border-line rounded-lg p-5 bg-white/60">
        <p className="text-ink">
          No {cat?.label.toLowerCase()} providers matched near {sector.name} yet. Try widening your
          budget or checking a nearby sector.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-6">
      <p className="mono-tag text-xs text-signal-dark uppercase tracking-wide mb-3">
        Top {matches.length} matches near {sector.name}
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {matches.map(({ provider, reasons, score }, i) => (
          <div key={provider.id} className="relative">
            <span className="absolute -top-2 -left-2 z-10 mono-tag text-xs font-bold bg-ink text-paper rounded-full w-7 h-7 flex items-center justify-center">
              {i + 1}
            </span>
            <ProviderCard provider={provider} matchReasons={reasons} />
            <WhatsAppButton
              provider={provider}
              details={{
                category: cat?.label,
                sectorName: sector.name,
                urgency,
                budget,
                notes
              }}
              className="w-full mt-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
