-- =====================================================
-- COMPLETE SUPABASE SCHEMA FOR AI CAREER PLATFORM
-- =====================================================
-- This is the MASTER schema file - Run this ONCE in Supabase SQL Editor
-- Includes: Profiles, Jobs, Interviews, Analytics, Storage
-- Google Auth: PRESERVED (existing auth.users table untouched)
-- =====================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm"; -- For text search

-- =====================================================
-- 1. PROFILES TABLE (Enhanced from existing)
-- =====================================================
-- Stores user profile data with resume information
-- Google Auth integration: PRESERVED

CREATE TABLE IF NOT EXISTS public.profiles (
    -- Primary key linked to auth.users (Google Auth compatible)
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    
    -- Basic user info (from Google OAuth or email signup)
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    
    -- Resume data
    resume_url TEXT,
    resume_file_name TEXT,
    resume_uploaded_at TIMESTAMPTZ,
    resume_raw_text TEXT,
    
    -- AI-extracted resume data (JSONB for flexibility)
    skills TEXT[], -- ["React", "Node.js", "Python"]
    skill_proficiency JSONB, -- {"React": "expert", "Python": "intermediate"}
    experience JSONB, -- Array of job experiences
    education JSONB, -- Array of education entries
    projects JSONB, -- Array of projects
    certifications JSONB, -- Array of certifications
    
    -- AI-generated insights
    profile_summary TEXT, -- AI-generated professional summary
    strengths TEXT[], -- Identified strengths
    areas_for_improvement TEXT[], -- Skill gaps
    career_level TEXT, -- "junior", "mid", "senior"
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add columns to existing profiles table if they don't exist
DO $$ 
BEGIN
    -- Resume columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='resume_url') THEN
        ALTER TABLE public.profiles ADD COLUMN resume_url TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='resume_file_name') THEN
        ALTER TABLE public.profiles ADD COLUMN resume_file_name TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='resume_uploaded_at') THEN
        ALTER TABLE public.profiles ADD COLUMN resume_uploaded_at TIMESTAMPTZ;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='resume_raw_text') THEN
        ALTER TABLE public.profiles ADD COLUMN resume_raw_text TEXT;
    END IF;
    
    -- AI-extracted data columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='skills') THEN
        ALTER TABLE public.profiles ADD COLUMN skills TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='skill_proficiency') THEN
        ALTER TABLE public.profiles ADD COLUMN skill_proficiency JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='experience') THEN
        ALTER TABLE public.profiles ADD COLUMN experience JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='education') THEN
        ALTER TABLE public.profiles ADD COLUMN education JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='projects') THEN
        ALTER TABLE public.profiles ADD COLUMN projects JSONB;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='certifications') THEN
        ALTER TABLE public.profiles ADD COLUMN certifications JSONB;
    END IF;
    
    -- AI insights columns
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='profile_summary') THEN
        ALTER TABLE public.profiles ADD COLUMN profile_summary TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='strengths') THEN
        ALTER TABLE public.profiles ADD COLUMN strengths TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='areas_for_improvement') THEN
        ALTER TABLE public.profiles ADD COLUMN areas_for_improvement TEXT[];
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='career_level') THEN
        ALTER TABLE public.profiles ADD COLUMN career_level TEXT;
    END IF;
END $$;

-- =====================================================
-- 2. JOB MATCHES TABLE
-- =====================================================
-- Stores AI-matched job opportunities

CREATE TABLE IF NOT EXISTS public.job_matches (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Job details
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    job_type TEXT, -- "full-time", "part-time", "contract", "internship"
    experience_level TEXT, -- "entry", "mid", "senior"
    salary_range TEXT,
    link TEXT NOT NULL,
    description TEXT,
    
    -- Matching data
    score INT NOT NULL CHECK (score >= 0 AND score <= 100),
    match_reasons TEXT, -- AI explanation
    requirements TEXT[], -- Key requirements
    matched_skills TEXT[], -- User skills that match
    missing_skills TEXT[], -- Skills user lacks
    
    -- Scraping metadata
    source TEXT, -- "linkedin", "indeed", "glassdoor"
    scraped_at TIMESTAMPTZ DEFAULT NOW(),
    job_posted_date TIMESTAMPTZ,
    
    -- User actions
    is_bookmarked BOOLEAN DEFAULT FALSE,
    is_applied BOOLEAN DEFAULT FALSE,
    applied_at TIMESTAMPTZ,
    notes TEXT,
    
    -- Timestamps
    date_found TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- Prevent duplicate jobs per user
    CONSTRAINT unique_job_per_user UNIQUE(user_id, link)
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_job_matches_user_score ON public.job_matches(user_id, score DESC);
CREATE INDEX IF NOT EXISTS idx_job_matches_date ON public.job_matches(date_found DESC);
CREATE INDEX IF NOT EXISTS idx_job_matches_company ON public.job_matches(company);

-- =====================================================
-- 3. INTERVIEW HISTORY TABLE
-- =====================================================
-- Stores interview preparation sessions

CREATE TABLE IF NOT EXISTS public.interview_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Interview details
    company TEXT NOT NULL,
    role TEXT NOT NULL,
    tech_stack TEXT[],
    interview_date TIMESTAMPTZ,
    
    -- Company research data
    company_info JSONB, -- AI-researched company information
    company_culture TEXT,
    recent_news TEXT[],
    tech_focus_areas TEXT[],
    
    -- Generated questions (JSONB array of question objects)
    questions JSONB NOT NULL,
    total_questions INT,
    
    -- Question breakdown
    technical_questions_count INT,
    behavioral_questions_count INT,
    system_design_questions_count INT,
    
    -- User progress
    completed_questions INT DEFAULT 0,
    user_notes TEXT,
    
    -- Timestamps
    date TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    last_accessed TIMESTAMPTZ DEFAULT NOW()
);

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_interview_history_user ON public.interview_history(user_id, date DESC);
CREATE INDEX IF NOT EXISTS idx_interview_history_company ON public.interview_history(company);

-- =====================================================
-- 4. JOB SEARCH ANALYTICS TABLE
-- =====================================================
-- Tracks user metrics and analytics

CREATE TABLE IF NOT EXISTS public.job_search_analytics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    
    -- Search metrics
    total_jobs_discovered INT DEFAULT 0,
    total_jobs_applied INT DEFAULT 0,
    total_interviews_prepared INT DEFAULT 0,
    
    -- Skill coverage
    skill_coverage_percentage INT,
    top_missing_skills TEXT[],
    
    -- Activity tracking
    last_resume_update TIMESTAMPTZ,
    last_job_search TIMESTAMPTZ,
    last_interview_prep TIMESTAMPTZ,
    
    -- Timestamps
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    
    -- One analytics record per user
    CONSTRAINT one_analytics_per_user UNIQUE(user_id)
);

-- =====================================================
-- 5. SCRAPING CACHE TABLE (Performance Optimization)
-- =====================================================
-- Caches scraped data to reduce API calls

CREATE TABLE IF NOT EXISTS public.scraping_cache (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- Cache key
    cache_key TEXT NOT NULL UNIQUE,
    cache_type TEXT NOT NULL, -- "job_search", "company_info"
    
    -- Cached data
    data JSONB NOT NULL,
    
    -- Metadata
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    expires_at TIMESTAMPTZ NOT NULL,
    hit_count INT DEFAULT 0
);

-- Indexes for cache lookups
CREATE INDEX IF NOT EXISTS idx_scraping_cache_key ON public.scraping_cache(cache_key);
CREATE INDEX IF NOT EXISTS idx_scraping_cache_expiry ON public.scraping_cache(expires_at);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interview_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_search_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scraping_cache ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

DROP POLICY IF EXISTS "Users can view their own job matches" ON public.job_matches;
DROP POLICY IF EXISTS "Users can insert their own job matches" ON public.job_matches;
DROP POLICY IF EXISTS "Users can update their own job matches" ON public.job_matches;
DROP POLICY IF EXISTS "Users can delete their own job matches" ON public.job_matches;

DROP POLICY IF EXISTS "Users can view their own interview history" ON public.interview_history;
DROP POLICY IF EXISTS "Users can insert their own interview history" ON public.interview_history;
DROP POLICY IF EXISTS "Users can update their own interview history" ON public.interview_history;
DROP POLICY IF EXISTS "Users can delete their own interview history" ON public.interview_history;

DROP POLICY IF EXISTS "Users can view own analytics" ON public.job_search_analytics;
DROP POLICY IF EXISTS "Users can insert own analytics" ON public.job_search_analytics;
DROP POLICY IF EXISTS "Users can update own analytics" ON public.job_search_analytics;

DROP POLICY IF EXISTS "Service role can manage cache" ON public.scraping_cache;

-- =====================================================
-- PROFILES POLICIES
-- =====================================================

CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- =====================================================
-- JOB MATCHES POLICIES
-- =====================================================

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

-- =====================================================
-- INTERVIEW HISTORY POLICIES
-- =====================================================

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

-- =====================================================
-- ANALYTICS POLICIES
-- =====================================================

CREATE POLICY "Users can view own analytics"
    ON public.job_search_analytics FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own analytics"
    ON public.job_search_analytics FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own analytics"
    ON public.job_search_analytics FOR UPDATE
    USING (auth.uid() = user_id);

-- =====================================================
-- SCRAPING CACHE POLICIES (Service role only)
-- =====================================================

CREATE POLICY "Service role can manage cache"
    ON public.scraping_cache FOR ALL
    USING (auth.jwt() ->> 'role' = 'service_role');

-- =====================================================
-- HELPER FUNCTIONS
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to automatically create a profile when a user signs up
-- PRESERVES GOOGLE AUTH - Works with both email and OAuth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        COALESCE(NEW.email, (NEW.raw_user_meta_data->>'email')::TEXT),
        (NEW.raw_user_meta_data->>'full_name')::TEXT,
        COALESCE(
            (NEW.raw_user_meta_data->>'avatar_url')::TEXT,
            (NEW.raw_user_meta_data->>'picture')::TEXT
        )
    )
    ON CONFLICT (id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create analytics record for new users
CREATE OR REPLACE FUNCTION public.create_user_analytics()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.job_search_analytics (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to clean expired cache
CREATE OR REPLACE FUNCTION public.clean_expired_cache()
RETURNS VOID AS $$
BEGIN
    DELETE FROM public.scraping_cache WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Drop existing triggers to avoid conflicts
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
DROP TRIGGER IF EXISTS on_profile_created ON public.profiles;
DROP TRIGGER IF EXISTS on_analytics_updated ON public.job_search_analytics;

-- Trigger: Automatically create profile when user signs up (GOOGLE AUTH COMPATIBLE)
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Update updated_at timestamp on profile updates
CREATE TRIGGER on_profile_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger: Create analytics record for new profiles
CREATE TRIGGER on_profile_created
    AFTER INSERT ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.create_user_analytics();

-- Trigger: Update updated_at timestamp on analytics updates
CREATE TRIGGER on_analytics_updated
    BEFORE UPDATE ON public.job_search_analytics
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Drop existing indexes to avoid conflicts
DROP INDEX IF EXISTS profiles_email_idx;
DROP INDEX IF EXISTS profiles_created_at_idx;

-- Create indexes
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON public.profiles(created_at);
CREATE INDEX IF NOT EXISTS profiles_skills_idx ON public.profiles USING GIN(skills);

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
GRANT ALL ON public.job_matches TO anon, authenticated;
GRANT ALL ON public.interview_history TO anon, authenticated;
GRANT ALL ON public.job_search_analytics TO anon, authenticated;
GRANT ALL ON public.scraping_cache TO anon, authenticated;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================
-- Run these after the schema is created to verify everything is set up correctly

-- Check all tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'job_matches', 'interview_history', 'job_search_analytics', 'scraping_cache')
ORDER BY table_name;

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'job_matches', 'interview_history', 'job_search_analytics', 'scraping_cache');

-- Check policies exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
-- Next steps:
-- 1. Create storage bucket 'resumes' in Supabase Dashboard
-- 2. Run storage_policies.sql for resume upload permissions
-- 3. Deploy Edge Functions (parse_resume, discover_jobs, interview_generator)
-- 4. Test the application
-- =====================================================
