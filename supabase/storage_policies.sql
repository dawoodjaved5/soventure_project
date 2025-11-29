-- =====================================================
-- STORAGE POLICIES FOR RESUME UPLOADS
-- =====================================================
-- Run this AFTER creating the 'resumes' bucket in Supabase Dashboard
-- =====================================================

-- =====================================================
-- STEP 1: Create Storage Bucket (Do this in Supabase Dashboard first!)
-- =====================================================
-- Go to: Storage → Create Bucket
-- Settings:
--   - Name: resumes
--   - Public: No (keep private)
--   - File size limit: 10485760 (10MB)
--   - Allowed MIME types: application/pdf
-- =====================================================

-- =====================================================
-- STEP 2: Run these policies (After bucket is created)
-- =====================================================

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can upload their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can view their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own resumes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view resumes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update resumes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete resumes" ON storage.objects;

-- =====================================================
-- OPTION 1: User-specific folder structure (RECOMMENDED)
-- =====================================================
-- Each user uploads to their own folder: resumes/{user_id}/filename.pdf
-- More secure - users can only access their own files

CREATE POLICY "Users can upload their own resumes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can view their own resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can update their own resumes"
ON storage.objects FOR UPDATE
TO authenticated
USING (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users can delete their own resumes"
ON storage.objects FOR DELETE
TO authenticated
USING (
    bucket_id = 'resumes' AND
    (storage.foldername(name))[1] = auth.uid()::text
);

-- =====================================================
-- OPTION 2: Simple policies (Use if Option 1 doesn't work)
-- =====================================================
-- All authenticated users can access all files in resumes bucket
-- Less secure but easier to set up
-- Uncomment these if you want to use this option:
-- =====================================================

/*
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
*/

-- =====================================================
-- VERIFICATION
-- =====================================================
-- Check if policies were created successfully

SELECT 
    policyname,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
AND policyname LIKE '%resume%';

-- =====================================================
-- TESTING
-- =====================================================
-- Test upload from your frontend:
-- 1. Login to your app
-- 2. Go to /upload-resume
-- 3. Try uploading a PDF
-- 4. Check Supabase Storage → resumes bucket
-- 5. You should see: resumes/{your-user-id}/filename.pdf
-- =====================================================

-- =====================================================
-- TROUBLESHOOTING
-- =====================================================

-- If uploads fail, check:
-- 1. Bucket 'resumes' exists in Storage
-- 2. User is authenticated (check auth.users table)
-- 3. File is PDF and under 10MB
-- 4. Policies are created (run verification query above)

-- To see storage errors:
-- SELECT * FROM storage.objects WHERE bucket_id = 'resumes';

-- To manually delete all files (if needed):
-- DELETE FROM storage.objects WHERE bucket_id = 'resumes';

-- =====================================================
-- SETUP COMPLETE!
-- =====================================================
