# TrendPulse — Social Trend Intelligence & Creator Discovery Platform

**Live App:** https://trendpulse-platform.vercel.app
**GitHub:** https://github.com/Arushisingh-10/trendpulse-platform

TrendPulse is a full-stack web platform that helps creators, marketers, startups and researchers
discover which social-media and web topics are genuinely emerging, not just already popular. It was
built as a 15-day Full Stack Development Internship project for **PranavX Labs**.

---

## Features

- **Authentication** — email/password signup & login via Supabase Auth, protected dashboard routes
- **Trend Discovery** — search, category filters, sorting by growth/score/name
- **Trend Detail Page** — historical chart, velocity, related topics, keywords, data source & timestamp
- **Trend Velocity** — a documented, explainable classification (Rising / Stable / Declining / Trending)
- **Historical Analytics** — comparison chart, category distribution, top growing topics, velocity scatter plot
- **Saved Trends** — authenticated users can save/unsave trends and view them on their dashboard
- **User Dashboard** — saved trends, recently viewed trends, quick stats
- **Topic Discovery** — browse by category and explore a related-topics cloud
- **Responsive UI** — mobile-first design across all pages
- **Error Handling** — loading states, empty states, auth errors, 404s

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16 (App Router), React, TypeScript, Tailwind CSS |
| Backend | Next.js Server Components + Route Handlers |
| Database & Auth | Supabase (PostgreSQL + Supabase Auth) |
| Charts | Recharts |
| Icons | lucide-react |
| Deployment | Vercel |
| Data Source | Wikimedia Pageviews API (see [Data Source](#data-source--limitations)) |

**Why this stack:** Next.js App Router gives server-rendered pages (good for SEO and fast data loading)
alongside client components for interactivity. Supabase provides a managed Postgres database, auth and
row-level security without running a separate backend server, which fits a 15-day solo build. Tailwind
keeps the UI consistent and responsive with minimal custom CSS.

---

## Getting Started (Local Setup)

### 1. Clone the repo
```bash
git clone https://github.com/Arushisingh-10/trendpulse-platform.git
cd trendpulse-platform
```

### 2. Install dependencies
```bash
npm install
```

### 3. Set up environment variables
Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-publishable-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-secret-key
YOUTUBE_API_KEY=your-youtube-api-key   # optional
```

| Variable | Where to find it | Exposed to browser? |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Project Settings → API | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Project Settings → API Keys (publishable key) | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Project Settings → API Keys (secret key) | **No — server only** |
| `YOUTUBE_API_KEY` | Google Cloud Console → APIs & Services → Credentials | **No — server only** |

⚠️ Never commit `.env.local`. It is already listed in `.gitignore`.

### 4. Set up the database
Run the SQL in [`supabase/schema.sql`](./supabase/schema.sql) in the Supabase SQL Editor. This creates
all tables and Row Level Security (RLS) policies.

### 5. Seed real trend data
```bash
npm run seed
```
This fetches ~90 days of daily Wikipedia page views for each tracked topic and loads them into
`trends` and `trend_history`. See [`scripts/seed.ts`](./scripts/seed.ts).

### 6. Run the dev server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000).

---

## Database Schema

4 tables, all with Row Level Security enabled:

trends
├── id (uuid, PK)
├── slug (text, unique)
├── name, category, description
├── wiki_title (Wikipedia article used for data)
├── keywords (text[]), related (text[]), icon
└── created_at

trend_history
├── id (bigint, PK)
├── trend_id (uuid, FK → trends.id)
├── date
└── views (int)

saved_trends
├── id (bigint, PK)
├── user_id (uuid, FK → auth.users.id)
├── trend_id (uuid, FK → trends.id)
└── created_at

recent_views
├── id (bigint, PK)
├── user_id (uuid, FK → auth.users.id)
├── trend_id (uuid, FK → trends.id)
└── viewed_at

**RLS policies:**
- `trends` and `trend_history` — readable by anyone (public data)
- `saved_trends` and `recent_views` — a user can only read/write their **own** rows
  (`auth.uid() = user_id`)

Full SQL: [`supabase/schema.sql`](./supabase/schema.sql)

---

## Trend Velocity Methodology

Trend status is computed from Wikipedia page views using a simple, explainable formula
(see [`lib/velocity.ts`](./lib/velocity.ts)):

app/
├── page.tsx # Home
├── trends/ # Trending list + [slug] detail page
├── analytics/ # Analytics dashboard
├── explore/ # Topic discovery
├── about/ # About page
├── login/, signup/ # Auth pages
├── dashboard/ # Protected user dashboard
└── auth/callback/ # OAuth callback route
components/ # Reusable UI (Navbar, TrendCard, charts, forms, etc.)
lib/
├── supabase/ # Browser & server Supabase clients
├── trends.ts # Data layer: reads trends + computes velocity
├── velocity.ts # Velocity calculation logic
└── youtube.ts # YouTube Data API integration (optional)
scripts/seed.ts # Wikipedia data seed script
supabase/schema.sql # Database schema + RLS policies
