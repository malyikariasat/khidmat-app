export const CATEGORIES = [
  { slug: "plumber", label: "Plumber", icon: "🔧", emergency: true, description: "Leaks, blocked drains, tap & pipe fitting" },
  { slug: "electrician", label: "Electrician", icon: "⚡", emergency: true, description: "Wiring, short-circuits, switches, fittings" },
  { slug: "ac-technician", label: "AC Technician", icon: "❄️", emergency: true, description: "AC install, gas refill, servicing, repair" },
  { slug: "appliance-repair", label: "Appliance Repair", icon: "🧰", emergency: false, description: "Fridge, washing machine, microwave repair" },
  { slug: "carpenter", label: "Carpenter", icon: "🪚", emergency: false, description: "Furniture, doors, cabinets, fittings" },
  { slug: "painter", label: "Painter", icon: "🎨", emergency: false, description: "Interior & exterior painting, texture work" },
  { slug: "cleaner", label: "Home Cleaner", icon: "🧹", emergency: false, description: "Deep cleaning, move-in/out, sofa & carpet" },
  { slug: "tutor", label: "Home Tutor", icon: "📘", emergency: false, description: "O/A Level, Matric, university-level tuition" }
];

export function getCategory(slug) {
  return CATEGORIES.find((c) => c.slug === slug) || null;
}
