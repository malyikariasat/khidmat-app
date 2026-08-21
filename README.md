# Khidmat — Twin Cities Local Services Directory & AI Matcher

Verified plumbers, electricians, AC technicians, tutors and more for
Islamabad & Rawalpindi. Search or browse, or use the built-in matcher
to get your top 3 providers with a plain-English explanation of why
each one was picked — then contact them straight on WhatsApp.

**Stack — 100% free tier:**
- **Next.js 14** (App Router) — deploys natively on **Vercel's free plan**
- **Tailwind CSS** — styling
- **Firebase Firestore (Spark/free plan)** — *optional*, for real review
  storage. Without it, the app runs fully on seed data + the browser's
  localStorage, so it works out of the box with **zero configuration**
- **Rule-based matching engine** (see `lib/matcher.js`) instead of a paid
  AI API — it's a transparent weighted scoring system (proximity,
  availability, budget fit, rating, verification, response time), so
  there's no OpenAI/Gemini bill and the "why this match" reasoning is
  fully explainable. You can bolt on a free-tier LLM re-ranker later if
  you want (see "Optional: adding a free AI layer" below).
- **wa.me WhatsApp links** — no WhatsApp Business API needed, no cost

---

## 1. What's included

```
app/
  page.js                  Home page (hero + AI matcher + category grid)
  match/page.js             Standalone AI matcher page
  category/[slug]/page.js   Browse + filter providers by category
  provider/[id]/page.js     Provider profile, reviews, WhatsApp contact
  emergency/page.js         SOS quick-list for urgent categories
  admin/page.js             Lite review moderation (approve/reject)
components/                 UI building blocks
lib/
  matcher.js                 The "AI recommender" scoring engine
  haversine.js               Distance calculation
  whatsapp.js                 Builds prefilled wa.me contact links
  firebase.js / reviews.js    Optional Firestore, with localStorage fallback
data/
  providers.js, categories.js, sectors.js   Seed directory data
scripts/seed.mjs             Optional: push seed data into Firestore
```

---

## 2. Run it locally

You need **Node.js 18+** installed.

```bash
cd khidmat
npm install
npm run dev
```

Open **http://localhost:3000** — the whole app works immediately, no
API keys required. Reviews you submit are saved to your browser only
until you connect Firebase (step 4).

---

## 3. Deploy to Vercel (step by step)

**Option A — via GitHub (recommended):**

1. Create a new GitHub repository and push this project to it:
   ```bash
   cd khidmat
   git init
   git add .
   git commit -m "Initial commit — Khidmat MVP"
   git branch -M main
   git remote add origin https://github.com/<your-username>/khidmat.git
   git push -u origin main
   ```
2. Go to **https://vercel.com** → sign up/log in free with your GitHub
   account.
3. Click **"Add New" → "Project"**, select your `khidmat` repo.
4. Vercel auto-detects Next.js — leave build settings as default
   (`next build`, output handled automatically).
5. If you're using Firebase (step 4), add the env vars from
   `.env.example` under **"Environment Variables"** before deploying.
   Otherwise skip — the app runs fine with none set.
6. Click **Deploy**. In ~1–2 minutes you'll get a live URL like
   `khidmat.vercel.app`.
7. Every future `git push` to `main` auto-redeploys.

**Option B — via Vercel CLI (no GitHub needed):**

```bash
npm install -g vercel
cd khidmat
vercel login
vercel        # deploys a preview
vercel --prod # promotes to your production URL
```

Both options are on Vercel's **free Hobby plan** — no card required for
a project like this.

---

## 4. Optional: connect Firebase (free) for real review storage

Without this, reviews save to `localStorage` (per-browser only) — fine
for a demo/pitch, not for a real multi-user launch.

1. Go to **https://console.firebase.google.com** → **Add project** →
   name it (e.g. `khidmat-twin-cities`) → keep Google Analytics off
   (not needed) → Create.
2. In the project, click **Build → Firestore Database → Create
   database** → start in **test mode** for now (tighten rules before
   real launch — see step 5) → choose a region close to Pakistan (e.g.
   `asia-south1`).
3. Click the **gear icon → Project settings → General**, scroll to
   "Your apps" → click the **`</>` (Web) icon** → register an app
   (nickname anything, no hosting needed) → copy the `firebaseConfig`
   values.
4. Create a `.env.local` file in the project root (copy from
   `.env.example`) and paste in those values:
   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```
5. Add the same variables in **Vercel → your project → Settings →
   Environment Variables**, then redeploy.
6. (Optional) Run `npm run seed` locally to push `data/providers.js`
   into a Firestore `providers` collection instead of relying on the
   static seed file.

**Before a real public launch**, tighten Firestore rules so only
approved fields can be written by users (test mode allows anyone to
write anything). A reasonable starting rule for the `reviews`
collection:

```
match /reviews/{reviewId} {
  allow read: if resource.data.status == "approved";
  allow create: if request.resource.data.status == "pending";
  allow update, delete: if false; // only via Firebase console/admin SDK
}
```

Firebase's free **Spark plan** covers roughly 50K reads/20K writes per
day — far more than a launch-stage directory needs.

> **Note:** the first time `getReviewsForProvider` runs against real
> Firestore, the console will show an error with a link to
> auto-create the required composite index (providerId + status +
> createdAt). Click that link once — it's free, takes ~1 minute to
> build, and only needs doing once per project.

---

## 5. Editing the provider directory

For the MVP, providers live in `data/providers.js` as a plain
JavaScript array — edit it directly to add/remove/adjust providers,
rates, sectors, verification status, etc. No database needed until
you're ready to onboard real providers at scale (at which point,
migrate this into Firestore using `scripts/seed.mjs` as a starting
point, and build a simple provider self-signup form).

Areas/sectors are defined in `data/sectors.js` with approximate
coordinates — add more Islamabad/Rawalpindi sectors or other cities
there when you're ready to expand.

---

## 6. Optional: adding a free AI layer later

The matcher in `lib/matcher.js` is intentionally rule-based (free,
fast, explainable). If you later want an LLM to re-rank or add richer
natural-language reasoning:

- **Groq** (free tier, very fast open-weight models) or **Google
  Gemini API** (free tier) both offer no-cost API keys for
  moderate usage.
- Pattern: run `matchProviders()` to get the top ~10 candidates
  cheaply, then send just those 10 (not your whole database) to the
  LLM with the user's request, asking it to re-rank and explain in
  natural language. This keeps token usage — and cost — minimal even
  on a free tier.
- Store the API key as a **server-only** env var (no `NEXT_PUBLIC_`
  prefix) and call it from a Next.js **Route Handler**
  (`app/api/match/route.js`), never directly from the browser.

---

## 7. What's MVP-lite vs. production-ready

Being upfront about what's simplified for the MVP:

- **Admin login** (`/admin`) is a single shared password in an env
  var — fine for you moderating alone, not real multi-admin auth.
  Replace with Firebase Auth + custom claims before opening it up.
- **Provider verification** is manual/self-declared in the seed data —
  a real launch needs an actual CNIC/reference upload + review flow.
- **Booking/availability** is a simple boolean (`availableToday`), not
  a real calendar — fine for MVP, upgrade later if bookings need
  scheduling.
- **Distance matching** uses approximate sector centroids, not live
  GPS or a mapping API — accurate enough for "which sector is closer"
  but not turn-by-turn.

---

## 8. Quick pitch/demo checklist

- Home page: try the matcher with "Plumber, G-9, Urgent, Rs 2000–4000"
- `/emergency`: show the SOS list for a live-audience wow moment
- A provider profile: show verified badge, reviews, WhatsApp button
- `/admin`: show the moderation flow (password: `khidmat-admin` unless
  you changed `NEXT_PUBLIC_ADMIN_PASSWORD`)
