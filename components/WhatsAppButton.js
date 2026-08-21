"use client";

import { buildWhatsAppLink } from "@/lib/whatsapp";

export default function WhatsAppButton({ provider, details, className = "" }) {
  const link = buildWhatsAppLink(provider, details);
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center justify-center gap-2 font-medium rounded-md px-4 py-2.5 bg-signal text-white hover:bg-signal-dark transition-colors ${className}`}
    >
      💬 Contact on WhatsApp
    </a>
  );
}
