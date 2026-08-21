import { getSector } from "./sectors";

// Small deterministic jitter so providers in the same sector don't sit on
// the exact same coordinate (purely cosmetic for the map/matching demo).
function jitter(lat, lng, seed) {
  const dx = ((seed * 37) % 10) / 4000;
  const dy = ((seed * 53) % 10) / 4000;
  return { lat: lat + dx, lng: lng + dy };
}

const RAW = [
  // Plumbers
  { id: "p1", name: "Imran Plumbing Services", category: "plumber", sector: "G-9", rateMin: 800, rateMax: 3500, responseMins: 25, rating: 4.7, reviews: 63, verified: true, verificationType: "CNIC verified", availableToday: true, phone: "923001234567", experience: "9 years", bio: "Specialist in leak repair, geyser fitting and bathroom pipe work across G/F sectors." },
  { id: "p2", name: "Rawal Fix Plumbers", category: "plumber", sector: "SATELLITE", rateMin: 600, rateMax: 3000, responseMins: 40, rating: 4.3, reviews: 41, verified: true, verificationType: "Reference verified", availableToday: true, phone: "923011234567", experience: "6 years", bio: "Same-day service in Satellite Town, Saddar and Westridge, Rawalpindi." },
  { id: "p3", name: "AK Water & Drain Solutions", category: "plumber", sector: "F-10", rateMin: 1000, rateMax: 5000, responseMins: 55, rating: 4.5, reviews: 28, verified: false, verificationType: null, availableToday: false, phone: "923021234567", experience: "4 years", bio: "Motor & tank fitting, drain unblocking, kitchen plumbing." },
  { id: "p4", name: "Bahria Home Plumbers", category: "plumber", sector: "BAHRIA-4", rateMin: 1200, rateMax: 6000, responseMins: 30, rating: 4.8, reviews: 54, verified: true, verificationType: "CNIC verified", availableToday: true, phone: "923031234567", experience: "11 years", bio: "Trusted by 50+ households in Bahria Town Phase 4 & 7." },

  // Electricians
  { id: "e1", name: "Bilal Electric Works", category: "electrician", sector: "G-10", rateMin: 700, rateMax: 4000, responseMins: 20, rating: 4.6, reviews: 77, verified: true, verificationType: "CNIC verified", availableToday: true, phone: "923041234567", experience: "10 years", bio: "Short-circuit diagnosis, DB fitting, home rewiring." },
  { id: "e2", name: "F-Sector Electric Care", category: "electrician", sector: "F-7", rateMin: 900, rateMax: 4500, responseMins: 35, rating: 4.4, reviews: 33, verified: true, verificationType: "Reference verified", availableToday: false, phone: "923051234567", experience: "7 years", bio: "UPS/inverter setup, switchboard repair, lighting install." },
  { id: "e3", name: "Twin City Power Fix", category: "electrician", sector: "SADDAR", rateMin: 500, rateMax: 3000, responseMins: 45, rating: 4.1, reviews: 19, verified: false, verificationType: null, availableToday: true, phone: "923061234567", experience: "3 years", bio: "Affordable emergency call-outs across Rawalpindi city." },
  { id: "e4", name: "Chaklala Electric Experts", category: "electrician", sector: "CHAKLALA", rateMin: 800, rateMax: 4000, responseMins: 28, rating: 4.7, reviews: 46, verified: true, verificationType: "CNIC verified", availableToday: true, phone: "923071234567", experience: "8 years", bio: "Cantt-area licensed electrician, industrial + residential." },

  // AC Technicians
  { id: "a1", name: "CoolAir Technicians", category: "ac-technician", sector: "G-8", rateMin: 1500, rateMax: 8000, responseMins: 50, rating: 4.5, reviews: 58, verified: true, verificationType: "CNIC verified", availableToday: true, phone: "923081234567", experience: "12 years", bio: "Split & inverter AC service, gas refill, installation." },
  { id: "a2", name: "Frost Line AC Care", category: "ac-technician", sector: "DHA-2", rateMin: 2000, rateMax: 9000, responseMins: 65, rating: 4.2, reviews: 22, verified: false, verificationType: null, availableToday: false, phone: "923091234567", experience: "5 years", bio: "DHA & Bahria coverage, annual maintenance contracts available." },
  { id: "a3", name: "Islamabad Climate Fix", category: "ac-technician", sector: "I-9", rateMin: 1200, rateMax: 7000, responseMins: 38, rating: 4.6, reviews: 40, verified: true, verificationType: "Reference verified", availableToday: true, phone: "923101234567", experience: "8 years", bio: "I-8 to I-10 coverage, PTCL colony & CDA sectors." },

  // Appliance repair
  { id: "ap1", name: "FixIt Appliance Care", category: "appliance-repair", sector: "G-11", rateMin: 500, rateMax: 3500, responseMins: 60, rating: 4.3, reviews: 31, verified: true, verificationType: "CNIC verified", availableToday: true, phone: "923111234567", experience: "6 years", bio: "Fridge, washing machine & microwave repair, spare parts on hand." },
  { id: "ap2", name: "Westridge Repair Hub", category: "appliance-repair", sector: "WESTRIDGE", rateMin: 400, rateMax: 3000, responseMins: 70, rating: 4.0, reviews: 15, verified: false, verificationType: null, availableToday: true, phone: "923121234567", experience: "4 years", bio: "Home-visit repair for all major appliance brands." },

  // Carpenters
  { id: "c1", name: "Wood Craft Carpentry", category: "carpenter", sector: "F-8", rateMin: 1000, rateMax: 15000, responseMins: 120, rating: 4.7, reviews: 37, verified: true, verificationType: "Reference verified", availableToday: false, phone: "923131234567", experience: "15 years", bio: "Custom furniture, wardrobe & kitchen cabinet work." },
  { id: "c2", name: "Rawalpindi Furniture Fix", category: "carpenter", sector: "SATELLITE", rateMin: 600, rateMax: 8000, responseMins: 90, rating: 4.2, reviews: 20, verified: false, verificationType: null, availableToday: true, phone: "923141234567", experience: "5 years", bio: "Door, lock and hinge repair specialist." },

  // Painters
  { id: "pa1", name: "Bright Wall Painters", category: "painter", sector: "G-6", rateMin: 3000, rateMax: 40000, responseMins: 180, rating: 4.5, reviews: 26, verified: true, verificationType: "CNIC verified", availableToday: false, phone: "923151234567", experience: "10 years", bio: "Full-house painting teams, texture & waterproofing." },
  { id: "pa2", name: "Twin City Colour Co.", category: "painter", sector: "BAHRIA-4", rateMin: 2500, rateMax: 35000, responseMins: 150, rating: 4.3, reviews: 18, verified: false, verificationType: null, availableToday: true, phone: "923161234567", experience: "6 years", bio: "Bahria & DHA houses, interior and exterior finishes." },

  // Cleaners
  { id: "cl1", name: "SparkleHome Cleaning", category: "cleaner", sector: "F-11", rateMin: 1500, rateMax: 6000, responseMins: 45, rating: 4.6, reviews: 62, verified: true, verificationType: "CNIC verified", availableToday: true, phone: "923171234567", experience: "7 years", bio: "Deep cleaning, move-in/out, sofa & carpet shampoo team." },
  { id: "cl2", name: "QuickClean Rawalpindi", category: "cleaner", sector: "CHAKLALA", rateMin: 1000, rateMax: 5000, responseMins: 55, rating: 4.1, reviews: 24, verified: false, verificationType: null, availableToday: true, phone: "923181234567", experience: "3 years", bio: "Same-day home & office cleaning crews." },

  // Tutors
  { id: "t1", name: "Ayesha Khan — Maths & Physics", category: "tutor", sector: "F-7", rateMin: 3000, rateMax: 12000, responseMins: 90, rating: 4.9, reviews: 45, verified: true, verificationType: "CNIC verified", availableToday: false, phone: "923191234567", experience: "9 years teaching", bio: "O/A Level Maths & Physics, home visits across F sectors." },
  { id: "t2", name: "Hamza Tutors — Matric/O-Level", category: "tutor", sector: "G-9", rateMin: 2000, rateMax: 8000, responseMins: 100, rating: 4.6, reviews: 33, verified: true, verificationType: "Reference verified", availableToday: true, phone: "923201234567", experience: "5 years teaching", bio: "All-subject Matric & O-Level home tutoring, exam prep focus." },
  { id: "t3", name: "Sana Academy — English & IELTS", category: "tutor", sector: "SADDAR", rateMin: 2500, rateMax: 9000, responseMins: 120, rating: 4.4, reviews: 21, verified: false, verificationType: null, availableToday: true, phone: "923211234567", experience: "6 years teaching", bio: "Spoken English, IELTS prep, home & online sessions." }
];

const SAMPLE_REVIEWS = [
  { author: "Sarah A.", rating: 5, text: "Came within 30 minutes, fixed the leak properly. Fair price.", date: "2026-08-10" },
  { author: "Usman R.", rating: 4, text: "Good work, slightly late but explained the delay in advance.", date: "2026-07-28" },
  { author: "Fatima N.", rating: 5, text: "Very professional, will call again for future work.", date: "2026-07-15" }
];

export const PROVIDERS = RAW.map((p, i) => {
  const sector = getSector(p.sector);
  const coords = sector ? jitter(sector.lat, sector.lng, i + 1) : { lat: 33.6844, lng: 73.0479 };
  return {
    ...p,
    lat: coords.lat,
    lng: coords.lng,
    city: sector ? sector.city : "Islamabad",
    sectorName: sector ? sector.name : p.sector,
    recentReviews: SAMPLE_REVIEWS.slice(0, (i % 3) + 1)
  };
});

export function getProvidersByCategory(slug) {
  return PROVIDERS.filter((p) => p.category === slug);
}

export function getProviderById(id) {
  return PROVIDERS.find((p) => p.id === id) || null;
}
