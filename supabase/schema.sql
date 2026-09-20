-- 1. Trends (topics)
create table if not exists public.trends (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name text not null,
  category text not null,
  description text,
  wiki_title text not null,
  keywords text[] default '{}',
  related text[] default '{}',
  icon text default 'bot',
  created_at timestamptz default now()
);

-- 2. Daily history (Wikipedia pageviews)
create table if not exists public.trend_history (
  id bigint generated always as identity primary key,
  trend_id uuid not null references public.trends(id) on delete cascade,
  date date not null,
  views integer not null,
  unique (trend_id, date)
);
create index if not exists idx_history_trend_date on public.trend_history (trend_id, date);

-- 3. Saved trends (per user)
create table if not exists public.saved_trends (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  trend_id uuid not null references public.trends(id) on delete cascade,
  created_at timestamptz default now(),
  unique (user_id, trend_id)
);

-- 4. Recently viewed (per user)
create table if not exists public.recent_views (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  trend_id uuid not null references public.trends(id) on delete cascade,
  viewed_at timestamptz default now()
);

-- Security: Row Level Security on
alter table public.trends enable row level security;
alter table public.trend_history enable row level security;
alter table public.saved_trends enable row level security;
alter table public.recent_views enable row level security;

-- Trends aur history: sabhi padh sakte hain (public data)
create policy "trends readable by all" on public.trends for select using (true);
create policy "history readable by all" on public.trend_history for select using (true);

-- Saved trends: har user sirf apna data dekhe/badle
create policy "own saved select" on public.saved_trends for select using (auth.uid() = user_id);
create policy "own saved insert" on public.saved_trends for insert with check (auth.uid() = user_id);
create policy "own saved delete" on public.saved_trends for delete using (auth.uid() = user_id);

-- Recent views: same
create policy "own views select" on public.recent_views for select using (auth.uid() = user_id);
create policy "own views insert" on public.recent_views for insert with check (auth.uid() = user_id);
create policy "own views delete" on public.recent_views for delete using (auth.uid() = user_id);