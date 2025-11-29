-- =====================================================
-- Storage Policies for Resumes Bucket
-- =====================================================
-- Run this AFTER creating the "resumes" bucket in Storage
-- =====================================================

-- Drop existing policies if they exist (to avoid errors on re-run)
DROP POLICY IF EXISTS "Authenticated users can upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view resumes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update resumes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete resumes" ON storage.objects;

-- Policy 1: Allow authenticated users to upload resumes
CREATE POLICY "Authenticated users can upload resumes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resumes');

-- Policy 2: Allow authenticated users to view resumes
CREATE POLICY "Authenticated users can view resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'resumes');

-- Policy 3: Allow authenticated users to update resumes
CREATE POLICY "Authenticated users can update resumes"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'resumes');

-- Policy 4: Allow authenticated users to delete resumes
CREATE POLICY "Authenticated users can delete resumes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'resumes');

