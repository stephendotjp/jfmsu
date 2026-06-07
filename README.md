# just fuck my shit up

> QB House Japan location ranker. Sorted by Google Maps rating — highest = least likely to ruin your life.

You go to QB House because it's cheap and quick. You've been burned before. This app ranks every QB House in your city so you can at least make an informed gamble.

---

## Setup

```bash
git clone <repo-url>
cd jfmsu
npm install
# add your API key to .env.local (see below)
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Mock data is used as fallback if the API key is missing** — the app works without a key for demo purposes (shows 10 hardcoded Osaka locations).

---

## Google Maps API setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project (or select an existing one)
3. Enable the **Places API (New)** — search for it in "APIs & Services → Library"
4. Go to "APIs & Services → Credentials" → Create Credentials → API Key
5. (Recommended) Restrict the key to the Places API (New) and your domain
6. Create `.env.local` in the project root:
   ```
   GOOGLE_MAPS_API_KEY=your_key_here
   ```

---

## Deploy to Vercel

1. Push this repo to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project → select your repo
3. In Vercel project settings → Environment Variables, add:
   - `GOOGLE_MAPS_API_KEY` = your key
4. Deploy — done.

---

*¥1,400 per regret · not affiliated with QB House*
