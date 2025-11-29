-- =====================================================
-- CORRECTED Storage Policies SQL
-- =====================================================
-- Use this SQL - it fixes the "IF NOT EXISTS" error
-- =====================================================

-- Drop existing policies if they exist (this prevents errors)
DROP POLICY IF EXISTS "Authenticated users can upload resumes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can view resumes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can update resumes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete resumes" ON storage.objects;

-- Now create the policies
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

