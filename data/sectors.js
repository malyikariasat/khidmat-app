// Approximate sector/area centroids for Islamabad & Rawalpindi.
// Coordinates are approximate — good enough for relative proximity
// matching in the MVP, not for turn-by-turn navigation.
export const SECTORS = [
  { code: "G-6", name: "G-6, Islamabad", city: "Islamabad", lat: 33.7095, lng: 73.0692 },
  { code: "G-7", name: "G-7, Islamabad", city: "Islamabad", lat: 33.705, lng: 73.065 },
  { code: "G-8", name: "G-8, Islamabad", city: "Islamabad", lat: 33.697, lng: 73.05 },
  { code: "G-9", name: "G-9, Islamabad", city: "Islamabad", lat: 33.6926, lng: 73.0339 },
  { code: "G-10", name: "G-10, Islamabad", city: "Islamabad", lat: 33.679, lng: 73.013 },
  { code: "G-11", name: "G-11, Islamabad", city: "Islamabad", lat: 33.67, lng: 72.995 },
  { code: "F-6", name: "F-6, Islamabad", city: "Islamabad", lat: 33.726, lng: 73.063 },
  { code: "F-7", name: "F-7, Islamabad", city: "Islamabad", lat: 33.722, lng: 73.053 },
  { code: "F-8", name: "F-8, Islamabad", city: "Islamabad", lat: 33.71, lng: 73.033 },
  { code: "F-10", name: "F-10, Islamabad", city: "Islamabad", lat: 33.698, lng: 73.013 },
  { code: "F-11", name: "F-11, Islamabad", city: "Islamabad", lat: 33.687, lng: 72.995 },
  { code: "I-8", name: "I-8, Islamabad", city: "Islamabad", lat: 33.665, lng: 73.07 },
  { code: "I-9", name: "I-9, Islamabad", city: "Islamabad", lat: 33.655, lng: 73.05 },
  { code: "I-10", name: "I-10, Islamabad", city: "Islamabad", lat: 33.645, lng: 73.03 },
  { code: "BAHRIA-4", name: "Bahria Town Phase 4, Rawalpindi", city: "Rawalpindi", lat: 33.5285, lng: 73.1259 },
  { code: "DHA-2", name: "DHA Phase 2, Islamabad", city: "Islamabad", lat: 33.556, lng: 73.1 },
  { code: "SATELLITE", name: "Satellite Town, Rawalpindi", city: "Rawalpindi", lat: 33.625, lng: 73.045 },
  { code: "SADDAR", name: "Saddar, Rawalpindi", city: "Rawalpindi", lat: 33.5975, lng: 73.0479 },
  { code: "CHAKLALA", name: "Chaklala, Rawalpindi", city: "Rawalpindi", lat: 33.5989, lng: 73.07 },
  { code: "WESTRIDGE", name: "Westridge, Rawalpindi", city: "Rawalpindi", lat: 33.585, lng: 73.03 }
];

export function getSector(code) {
  return SECTORS.find((s) => s.code === code) || null;
}
