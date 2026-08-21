import React from 'react';

export default function ProviderCard({ provider }) {
  const textMessage = encodeURIComponent(
    `Hello ${provider.name}, main Khidmat app se aap ki service (${provider.category}) ke silsile me contact kar raha hoon. Sector: ${provider.sector}.`
  );

  const whatsappUrl = provider.phone
    ? `https://wa.me/${provider.phone.replace(/[^0-9]/g, '')}?text=${textMessage}`
    : '#';

  return (
    <div className="border border-line rounded-xl p-5 bg-white shadow-sm flex flex-col justify-between gap-3">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-ink">{provider.name}</h3>
          <span className="text-xs font-semibold px-2.5 py-1 bg-signal/10 text-signal-dark rounded-md capitalize">
            {provider.category}
          </span>
        </div>
        <p className="text-xs text-ink/70 mt-2">📍 Sector / Area: {provider.sector}</p>
        <p className="text-xs text-ink/70 mt-0.5">💰 Rate: PKR {provider.rateMin || provider.hourlyRate}/hr</p>
        <p className="text-xs text-ink/70 mt-0.5">⭐ Rating: {provider.rating || 5.0} / 5.0</p>
        {provider.bio && <p className="text-xs text-ink/60 italic mt-2">"{provider.bio}"</p>}
      </div>

      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full text-center text-xs font-bold py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M12.012 2c-5.506 0-9.989 4.478-9.99 9.984 0 1.762.459 3.48 1.332 5.002l-1.416 5.175 5.297-1.389c1.474.802 3.136 1.226 4.774 1.227h.004c5.505 0 9.988-4.478 9.989-9.985 0-2.668-1.037-5.176-2.925-7.063a9.923 9.923 0 0 0-7.065-2.951zm0 18.28h-.003a8.312 8.312 0 0 1-4.238-1.163l-.304-.18-3.151.826.84-3.071-.198-.315a8.303 8.303 0 0 1-1.272-4.391c0-4.578 3.726-8.303 8.308-8.303 2.218 0 4.303.865 5.871 2.434a8.26 8.26 0 0 1 2.43 5.873c0 4.58-3.726 8.304-8.283 8.304z" />
        </svg>
        Contact on WhatsApp
      </a>
    </div>
  );
}