# "Just Fuck My Shit Up" — Claude Code Prompt

## Project overview

Build a Next.js web app called **"Just Fuck My Shit Up"** — a QB House Japan location ranker that pulls real Google Maps ratings and sorts branches from safest to most likely to ruin your hair. The target user is an expat in Japan who goes to QB House out of habit/price but has been burned by inconsistent staff quality for years.

---

## Tech stack

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Data**: Google Maps Places API (via server-side route)
- **Deployment**: Vercel

---

## Brand & design

Use QB House's official brand colours:
- Primary navy: `#00004b`
- Mid navy (hover states): `#00006e`
- Light navy tint (backgrounds): `#e8e8f5`
- Pale navy (card backgrounds): `#f2f2fa`
- White: `#ffffff`
- Risk colours: green `#2a7a2a`, amber `#c07000`, red `#d0021b`, dark red `#7a0010`

The header/hero should mimic QB House's logo style: white "QB" mark in a navy square, "HOUSE" in spaced caps beside it, all on a `#00004b` background.

App title displayed prominently: **"just fuck my shit up"** (lowercase, irreverent).
Tagline: *"sorted by google maps rating · highest = least likely to ruin your life"*

---

## Core features

### 1. Location search
- Text input for city/area (default: Osaka)
- On submit, call the internal API route which queries Google Maps Places API for `QB House [city]`
- Return up to 20 results

### 2. Location cards
Each card displays:
- Rank number (#1, #2, etc.)
- Branch name
- Address
- Star rating (numeric + visual star string ★★★★☆)
- Total review count
- A horizontal rating bar (coloured by risk level)
- Risk pill badge: **safe zone** / **spicy** / **risky** / **rip 💀**

Risk thresholds:
```
≥ 4.3  → safe zone  (green)
≥ 4.0  → spicy      (amber)
≥ 3.7  → risky      (red)
< 3.7  → rip 💀     (dark red)
```

### 3. Sort controls
Three tabs to re-sort the list:
- Top rated (default)
- Most reviewed
- Highest risk (ascending rating = most dangerous first)

### 4. Area filter
Dropdown to filter by area/ward if multiple are returned (parse from address string).

### 5. Loading & error states
- Skeleton loader cards while fetching
- Friendly error state: *"Google Maps couldn't find any QB Houses here. You're on your own."*
- Empty state if no results

---

## API route

Create `app/api/locations/route.ts`:

```ts
// GET /api/locations?city=Osaka
// Calls Google Maps Places Text Search API
// Returns array of { name, address, rating, reviewCount, placeId, lat, lng }
// API key read from process.env.GOOGLE_MAPS_API_KEY
// Never expose the key to the client
```

Use the **Places API (New) Text Search** endpoint:
```
POST https://places.googleapis.com/v1/places:searchText
```

Request body:
```json
{
  "textQuery": "QB House {city}",
  "languageCode": "ja",
  "maxResultCount": 20
}
```

Required headers:
```
X-Goog-Api-Key: YOUR_KEY
X-Goog-FieldMask: places.displayName,places.formattedAddress,places.rating,places.userRatingCount,places.id,places.location
```

Map the response to your internal shape before returning to the client.

---

## Environment variables

```env
GOOGLE_MAPS_API_KEY=AIzaSyDqk0w60hR9fuKMuxK5PCii7PRXmh72T4I
```

Add to `.env.local` for development. Add to Vercel dashboard for production (Settings → Environment Variables).

> 🚨 **CRITICAL — DO NOT COMMIT THIS KEY TO GITHUB.** The `.env.local` file must be in `.gitignore` (Next.js does this by default, but double-check). Never hardcode the key anywhere in the source code. If it ends up in a commit, go to Google Cloud Console → Credentials and regenerate it immediately.

---

## File structure

```
/
├── app/
│   ├── page.tsx              # Main UI
│   ├── layout.tsx            # Root layout, metadata
│   └── api/
│       └── locations/
│           └── route.ts      # Server-side Places API call
├── components/
│   ├── LocationCard.tsx      # Individual branch card
│   ├── RatingBar.tsx         # Coloured progress bar
│   ├── RiskPill.tsx          # Badge component
│   ├── SortTabs.tsx          # Tab bar
│   └── SkeletonCard.tsx      # Loading placeholder
├── lib/
│   └── risk.ts               # getRisk(rating) helper
├── .env.local                # GOOGLE_MAPS_API_KEY (gitignored)
├── .gitignore
├── next.config.js
├── tailwind.config.js
└── README.md
```

---

## README must include

1. What the app does (keep the irreverent tone)
2. Setup instructions (clone, install, add API key, run)
3. Google Maps API setup steps (see below — copy verbatim into README)
4. Deploy to Vercel instructions
5. A note: *"Mock data is used as fallback if the API key is missing"* — implement a `MOCK_MODE` fallback with 8–10 hardcoded Osaka QB House locations so the app works without a key for demo purposes.

---

## Additional notes

- Mobile-first responsive layout
- No authentication required
- No database — purely API-driven, stateless
- `next/font` with a clean sans-serif (Inter or system font stack)
- Favicon: use a simple scissors emoji or SVG
- `<title>`: "just fuck my shit up | QB House ranker"
- The top-ranked card should have a subtle left border accent in `#00004b`
- Add a small footer: *"¥1,350 per regret · not affiliated with QB House"*
