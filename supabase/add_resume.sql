-- =====================================================
-- Add Resume URL Column to Profiles Table
-- =====================================================
-- Run this SQL in Supabase SQL Editor to add resume storage
-- =====================================================

-- Add resume_url column to profiles table if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'resume_url'
    ) THEN
        ALTER TABLE public.profiles ADD COLUMN resume_url TEXT;
    END IF;
END $$;

-- =====================================================
-- STORAGE SETUP (Run these in Supabase Dashboard)
-- =====================================================
-- Note: Storage buckets must be created via Supabase Dashboard
-- Go to: Storage → Create bucket
-- 
-- Bucket Name: resumes
-- Public: No (private bucket)
-- File size limit: 5242880 (5MB)
-- Allowed MIME types: application/pdf
-- =====================================================

-- Create storage bucket policy (run after creating the bucket in Dashboard)
-- This allows authenticated users to upload their own resumes
CREATE POLICY "Users can upload their own resumes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to read their own resumes
CREATE POLICY "Users can view their own resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to update their own resumes
CREATE POLICY "Users can update their own resumes"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own resumes
CREATE POLICY "Users can delete their own resumes"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- ALTERNATIVE: Simpler policy for resumes bucket
-- =====================================================
-- If the folder-based policy doesn't work, use this simpler one:
-- (But note: users can see all files in the bucket)
-- =====================================================

-- Drop the folder-based policies if you want to use simpler ones
DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own resumes" ON storage.objects;

-- Simpler policies (all authenticated users can access resumes bucket)
-- Note: This is less secure but easier to set up
CREATE POLICY "Authenticated users can upload resumes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can view resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can update resumes"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'resumes');

CREATE POLICY "Authenticated users can delete resumes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'resumes');


