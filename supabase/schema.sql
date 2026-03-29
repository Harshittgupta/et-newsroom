-- ============================================================
-- ET Newsroom — Supabase Database Schema
-- ============================================================
-- Run this entire file in:
-- Supabase Dashboard → SQL Editor → New query → Paste → Run
-- ============================================================

-- ── 1. PROFILES ─────────────────────────────────────────────
-- One profile per user, auto-created on signup via trigger
CREATE TABLE IF NOT EXISTS public.profiles (
  id           UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email        TEXT NOT NULL,
  full_name    TEXT,
  persona      TEXT NOT NULL DEFAULT 'investor'
                 CHECK (persona IN ('investor', 'founder', 'student', 'analyst')),
  interests    TEXT[] NOT NULL DEFAULT ARRAY['Markets', 'Economy'],
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_profiles_updated_at ON public.profiles;
CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();


-- ── 2. BOOKMARKS ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.bookmarks (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  article_id       TEXT NOT NULL,
  article_title    TEXT NOT NULL,
  article_url      TEXT NOT NULL,
  article_category TEXT NOT NULL DEFAULT 'general',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, article_id)   -- prevent duplicate bookmarks
);


-- ── 3. WATCHLIST ─────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.watchlist (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  symbol       TEXT NOT NULL,
  display_name TEXT NOT NULL,
  added_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, symbol)       -- one entry per stock per user
);

-- Seed default watchlist stocks for new users
CREATE OR REPLACE FUNCTION public.seed_default_watchlist()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.watchlist (user_id, symbol, display_name) VALUES
    (NEW.id, 'HDFCBANK', 'HDFC Bank'),
    (NEW.id, 'RELIANCE', 'Reliance'),
    (NEW.id, 'INFY',     'Infosys'),
    (NEW.id, 'TCS',      'TCS'),
    (NEW.id, 'BAJFINANCE','Bajaj Finance');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS seed_watchlist_on_profile ON public.profiles;
CREATE TRIGGER seed_watchlist_on_profile
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.seed_default_watchlist();


-- ── 4. BRIEFING HISTORY ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS public.briefing_history (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic      TEXT NOT NULL,
  messages   JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);


-- ── 5. ROW LEVEL SECURITY (RLS) ──────────────────────────────
-- Users can only see and edit their own data

ALTER TABLE public.profiles        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookmarks       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.watchlist       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.briefing_history ENABLE ROW LEVEL SECURITY;

-- Profiles
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON public.bookmarks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own bookmarks"
  ON public.bookmarks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own bookmarks"
  ON public.bookmarks FOR DELETE USING (auth.uid() = user_id);

-- Watchlist
CREATE POLICY "Users can view own watchlist"
  ON public.watchlist FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert to watchlist"
  ON public.watchlist FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete from watchlist"
  ON public.watchlist FOR DELETE USING (auth.uid() = user_id);

-- Briefing history
CREATE POLICY "Users can view own briefings"
  ON public.briefing_history FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert briefings"
  ON public.briefing_history FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own briefings"
  ON public.briefing_history FOR UPDATE USING (auth.uid() = user_id);


-- ── 6. INDEXES ───────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_bookmarks_user_id ON public.bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_watchlist_user_id ON public.watchlist(user_id);
CREATE INDEX IF NOT EXISTS idx_briefing_user_id  ON public.briefing_history(user_id);
