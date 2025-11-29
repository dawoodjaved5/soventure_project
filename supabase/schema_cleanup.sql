-- =====================================================
-- Cleanup Script - Run this FIRST if you get errors
-- =====================================================
-- This will clean up any existing profiles table
-- WARNING: This deletes all profile data!
-- =====================================================

-- Drop indexes first
DROP INDEX IF EXISTS profiles_email_idx;
DROP INDEX IF EXISTS profiles_created_at_idx;

-- Drop triggers
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;

-- Drop functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.handle_updated_at();

-- Drop policies
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;

-- Drop the table (this will delete all profile data!)
DROP TABLE IF EXISTS public.profiles CASCADE;

-- Now you can run schema.sql fresh


