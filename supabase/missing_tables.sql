-- =====================================================
-- Missing Tables Setup
-- =====================================================
-- Run this in the Supabase SQL Editor to fix 404 errors
-- =====================================================

-- 1. Create job_matches table
CREATE TABLE IF NOT EXISTS public.job_matches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    description TEXT,
    match_score INTEGER,
    date_found TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    status TEXT DEFAULT 'new', -- new, applied, rejected, interviewing
    url TEXT
);

-- Enable RLS
ALTER TABLE public.job_matches ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own job matches"
    ON public.job_matches FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own job matches"
    ON public.job_matches FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own job matches"
    ON public.job_matches FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own job matches"
    ON public.job_matches FOR DELETE
    USING (auth.uid() = user_id);


-- 2. Create interview_history table
CREATE TABLE IF NOT EXISTS public.interview_history (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    job_title TEXT NOT NULL,
    company TEXT NOT NULL,
    date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    score INTEGER,
    feedback TEXT,
    duration TEXT,
    type TEXT -- technical, behavioral, etc.
);

-- Enable RLS
ALTER TABLE public.interview_history ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own interview history"
    ON public.interview_history FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own interview history"
    ON public.interview_history FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own interview history"
    ON public.interview_history FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own interview history"
    ON public.interview_history FOR DELETE
    USING (auth.uid() = user_id);
