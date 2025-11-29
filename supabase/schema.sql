-- =====================================================
-- Supabase Database Schema for Next.js Authentication
-- =====================================================
-- This schema sets up user profiles, Row Level Security,
-- and automatic profile creation for Google OAuth users
-- =====================================================

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE
-- =====================================================
-- Stores additional user information beyond auth.users
-- Automatically populated when users sign up via email or OAuth

-- Drop the table if it exists (to ensure clean setup)
-- WARNING: This will delete all existing profile data!
-- Comment out the next line if you want to keep existing data
-- DROP TABLE IF EXISTS public.profiles CASCADE;

CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Add email column if it doesn't exist (for existing tables)
DO $$ 
BEGIN
    -- Check if table exists first
    IF EXISTS (
        SELECT 1 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles'
    ) THEN
        -- Then check and add email column if missing
        IF NOT EXISTS (
            SELECT 1 
            FROM information_schema.columns 
            WHERE table_schema = 'public' 
            AND table_name = 'profiles' 
            AND column_name = 'email'
        ) THEN
            ALTER TABLE public.profiles ADD COLUMN email TEXT;
        END IF;
    END IF;
END $$;

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================
-- Enable RLS to ensure users can only access their own data
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid errors on re-run)
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Policy: Users can view their own profile
CREATE POLICY "Users can view own profile" ON public.profiles
    FOR SELECT
    USING (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update own profile" ON public.profiles
    FOR UPDATE
    USING (auth.uid() = id);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile" ON public.profiles
    FOR INSERT
    WITH CHECK (auth.uid() = id);

-- =====================================================
-- TRIGGER FUNCTIONS
-- =====================================================

-- Function to automatically create a profile when a user signs up
-- This works for both email/password and OAuth (Google) signups
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, avatar_url)
    VALUES (
        NEW.id,
        (NEW.raw_user_meta_data->>'email')::TEXT,
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

-- Function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Drop existing triggers if they exist (to avoid errors on re-run)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;

-- Trigger: Automatically create profile when user signs up
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger: Update updated_at timestamp on profile updates
CREATE TRIGGER on_profile_updated
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- INDEXES (Create after table is set up)
-- =====================================================
-- Drop existing indexes if they exist (to avoid conflicts)
DROP INDEX IF EXISTS profiles_email_idx;
DROP INDEX IF EXISTS profiles_created_at_idx;

-- Create indexes only if columns exist
DO $$
BEGIN
    -- Create email index if email column exists
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'email'
    ) THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles(email) WHERE email IS NOT NULL';
    END IF;
    
    -- Create created_at index if created_at column exists  
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'created_at'
    ) THEN
        EXECUTE 'CREATE INDEX IF NOT EXISTS profiles_created_at_idx ON public.profiles(created_at)';
    END IF;
END $$;

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================
-- Allow authenticated users to access the profiles table
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.profiles TO anon, authenticated;
-- =====================================================
-- Resume Data Schema
-- =====================================================

-- Skills Table
CREATE TABLE IF NOT EXISTS public.skills (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    skill_name TEXT NOT NULL,
    proficiency TEXT, -- e.g., Beginner, Intermediate, Expert
    category TEXT, -- e.g., Programming Language, Framework, Tool
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Experience Table
CREATE TABLE IF NOT EXISTS public.experience (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    company_name TEXT NOT NULL,
    role TEXT NOT NULL,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Education Table
CREATE TABLE IF NOT EXISTS public.education (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    institution_name TEXT NOT NULL,
    degree TEXT,
    field_of_study TEXT,
    start_date DATE,
    end_date DATE,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- Projects Table
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
    project_name TEXT NOT NULL,
    description TEXT,
    technologies TEXT[], -- Array of technologies used
    project_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- RLS Policies (Enable RLS and allow users to manage their own data)

-- Skills
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own skills" ON public.skills USING (auth.uid() = user_id);

-- Experience
ALTER TABLE public.experience ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own experience" ON public.experience USING (auth.uid() = user_id);

-- Education
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own education" ON public.education USING (auth.uid() = user_id);

-- Projects
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage own projects" ON public.projects USING (auth.uid() = user_id);
