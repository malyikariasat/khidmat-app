// wa.me links require no API key or paid service — they simply open
// WhatsApp with a prefilled message to the provider's number.
export function buildWhatsAppLink(provider, details = {}) {
  const lines = [
    `Hi ${provider.name}, I found you on Khidmat.`,
    details.category ? `Service needed: ${details.category}` : null,
    details.sectorName ? `Location: ${details.sectorName}` : null,
    details.urgency ? `Urgency: ${details.urgency}` : null,
    details.budget ? `Budget: Rs ${details.budget}` : null,
    details.notes ? `Notes: ${details.notes}` : null,
    "Please let me know your availability."
  ].filter(Boolean);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${provider.phone}?text=${text}`;
}
