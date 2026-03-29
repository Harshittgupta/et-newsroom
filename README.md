# Deployed Link 

https://et-newsroom-woad.vercel.app/

# ET Newsroom — Production-Ready AI News Platform

Full-stack Next.js 14 app with **Supabase** (auth + database), **NewsData.io** (real news), and **Groq** (free AI).

---

## Architecture

```
Browser → Next.js App (Vercel)
              ├── Supabase  → Auth (email + Google OAuth)
              │              → Database (profiles, bookmarks, watchlist, briefing history)
              ├── NewsData.io → Real Indian business news (cached 15 min)
              └── Groq API    → AI chat, video scripts, vernacular translation (free)
```

---

## Setup — 3 Services to Configure

### Service 1 — Supabase (Database + Auth)

**Step 1.1 — Create project**
1. Go to **https://supabase.com** → Sign up free
2. Click **"New project"** → give it a name → choose a region (ap-south-1 for India) → set a database password → Create

**Step 1.2 — Get your API keys**
1. In your project: **Settings** (gear icon) → **API**
2. Copy **Project URL** → this is your `NEXT_PUBLIC_SUPABASE_URL`
3. Copy **anon / public** key → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`

**Step 1.3 — Run the database schema**
1. In Supabase: click **SQL Editor** (left sidebar) → **New query**
2. Open the file `supabase/schema.sql` from this project
3. Paste the entire contents → click **Run**
4. You should see "Success. No rows returned"

**Step 1.4 — Enable Google OAuth (optional)**
1. Supabase → **Authentication** → **Providers** → **Google** → Enable
2. Go to **https://console.cloud.google.com** → APIs & Services → Credentials
3. Create OAuth 2.0 Client ID → Web application
4. Authorized redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`
5. Copy Client ID and Secret back into Supabase Google provider settings

**Step 1.5 — Set Site URL**
1. Supabase → **Authentication** → **URL Configuration**
2. Site URL: `http://localhost:3000` (change to your Vercel URL after deploying)
3. Add Redirect URL: `http://localhost:3000/**`

---

### Service 2 — Groq (Free AI)

1. Go to **https://console.groq.com** → Sign up (no credit card)
2. **API Keys** → **Create API Key** → copy it (starts with `gsk_`)

Free tier: **14,400 requests/day**, 30 requests/minute — more than enough.

---

### Service 3 — NewsData.io (Real News)

1. Go to **https://newsdata.io** → Sign up free
2. **Dashboard** → copy your API key (starts with `pub_`)

Free tier: **200 requests/day**. The app caches results for 15 minutes, so 200 calls covers ~50 hours of usage. Without this key, the app uses built-in mock news — everything still works.

---

## Installation

```bash
# 1. Unzip and enter project
unzip et-newsroom.zip
cd et-newsroom

# 2. Install dependencies
npm install

# 3. Create env file
cp .env.example .env.local
```

Open `.env.local` and fill in your 4 values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...your_anon_key
GROQ_API_KEY=gsk_abc123...your_groq_key
NEWSDATA_API_KEY=pub_abc123...your_newsdata_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

```bash
# 4. Start the app
npm run dev
```

Open **http://localhost:3000**

---

## What Each Feature Does Now (Production)

| Feature | Auth Required | Database Used | Real Data |
|---------|:---:|:---:|:---:|
| **Homepage** | No | No | No |
| **My ET** | ✅ Yes | Bookmarks, Watchlist, Profile | ✅ NewsData.io |
| **News Navigator** | ✅ Yes | Briefing History saved | Mock briefing |
| **AI Video Studio** | ✅ Yes | No | Groq AI |
| **Story Arc** | ✅ Yes | No | Mock data |
| **Vernacular Engine** | ✅ Yes | No | Groq AI |
| **Settings** | ✅ Yes | Profile updates | No |

---

## Database Tables

| Table | What it stores |
|-------|---------------|
| `profiles` | Name, persona (investor/founder/etc), interests — auto-created on signup |
| `bookmarks` | Saved articles per user (article ID, title, URL, category) |
| `watchlist` | Stock symbols per user — seeded with 5 defaults on signup |
| `briefing_history` | Saved Navigator Q&A conversations per user |

All tables use **Row Level Security** — users can only access their own data.

---

## Project Structure

```
et-newsroom/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                    # Homepage
│   ├── login/page.tsx              # Email + Google login
│   ├── signup/page.tsx             # 2-step signup with persona
│   ├── settings/page.tsx           # Profile settings
│   ├── my-et/page.tsx              # Real news + real bookmarks/watchlist
│   ├── navigator/page.tsx          # AI briefings saved to Supabase
│   ├── video-studio/page.tsx       # Article → video script (Groq)
│   ├── story-arc/page.tsx          # Story timeline tracker
│   ├── vernacular/page.tsx         # Language adaptor (Groq)
│   └── api/
│       ├── auth/signout/route.ts   # Sign out endpoint
│       ├── chat/route.ts           # Navigator AI chat (Groq)
│       ├── news/route.ts           # Fetch news + bookmark CRUD
│       ├── profile/route.ts        # Get + update user profile
│       ├── translate/route.ts      # Vernacular translation (Groq)
│       ├── video/route.ts          # Video script generation (Groq)
│       └── watchlist/route.ts      # Add/remove watchlist stocks
├── auth/callback/route.ts          # OAuth redirect handler
├── components/
│   ├── Navigation.tsx              # Auth-aware nav with user menu
│   └── ui/animated-gradient-background.tsx
├── lib/
│   ├── groq.ts                     # Groq API helper
│   ├── news.ts                     # NewsData.io fetcher + cache + fallback
│   ├── database.types.ts           # TypeScript types for Supabase tables
│   ├── supabase/
│   │   ├── client.ts               # Browser Supabase client
│   │   └── server.ts               # Server Supabase client (API routes)
│   └── utils.ts                    # Mock data + utilities
├── middleware.ts                   # Route protection + session refresh
├── supabase/
│   └── schema.sql                  # Full DB schema — run in Supabase SQL editor
└── .env.example                    # Template for environment variables
```

---

## Deploying to Vercel (Free)

```bash
npm install -g vercel
vercel
```

After deploying:
1. Go to Vercel dashboard → your project → **Settings** → **Environment Variables**
2. Add all 5 variables from your `.env.local`
3. Update `NEXT_PUBLIC_APP_URL` to your Vercel URL
4. Update Supabase **Site URL** and **Redirect URLs** to your Vercel URL
5. Redeploy: `vercel --prod`

---

## Troubleshooting

**"Invalid API key" from Supabase**
→ Double-check you copied the **anon/public** key, not the service role key.

**Login redirects to wrong URL**
→ Check Supabase → Authentication → URL Configuration → matches your actual URL.

**No news articles showing**
→ NewsData.io key not set — app falls back to mock data automatically.

**AI features not working**
→ Check GROQ_API_KEY starts with `gsk_` and has remaining quota at console.groq.com.

**Rate limit on news**
→ NewsData.io free tier is 200/day. The 15-min cache means ~13 unique fetches use your daily quota. Fine for development.

**Google OAuth not working**
→ Check the redirect URI in Google Cloud Console exactly matches `https://YOUR_PROJECT.supabase.co/auth/v1/callback`.
