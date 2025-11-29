# Resume Upload Setup Guide

This guide will help you set up the resume upload feature in your Supabase project.

## Step 1: Add Resume URL Column to Database

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `supabase/add_resume.sql`
4. Click **"Run"**
5. This will add the `resume_url` column to your `profiles` table

## Step 2: Create Storage Bucket

1. In Supabase Dashboard, go to **Storage**
2. Click **"Create bucket"**
3. Fill in the details:
   - **Name**: `resumes`
   - **Public bucket**: **No** (unchecked - keep it private)
   - Click **"Create bucket"**

## Step 3: Configure Storage Policies

After creating the bucket, run the storage policies from `supabase/add_resume.sql`:

1. Go to **SQL Editor** in Supabase
2. Run the policy creation SQL (the second part of `add_resume.sql`)

OR manually set up policies:

1. Go to **Storage** → **Policies** → **resumes** bucket
2. Click **"New Policy"**
3. Add these policies:

### Policy 1: Allow Upload
- **Policy name**: "Authenticated users can upload resumes"
- **Allowed operation**: INSERT
- **Target roles**: authenticated
- **Policy definition**: `bucket_id = 'resumes'`

### Policy 2: Allow Read
- **Policy name**: "Authenticated users can view resumes"
- **Allowed operation**: SELECT
- **Target roles**: authenticated
- **Policy definition**: `bucket_id = 'resumes'`

### Policy 3: Allow Update
- **Policy name**: "Authenticated users can update resumes"
- **Allowed operation**: UPDATE
- **Target roles**: authenticated
- **Policy definition**: `bucket_id = 'resumes'`

### Policy 4: Allow Delete
- **Policy name**: "Authenticated users can delete resumes"
- **Allowed operation**: DELETE
- **Target roles**: authenticated
- **Policy definition**: `bucket_id = 'resumes'`

## Step 4: Optional - Configure Bucket Settings

1. Go to **Storage** → **resumes** bucket → **Settings**
2. **File size limit**: `5242880` (5MB)
3. **Allowed MIME types**: `application/pdf`
4. Save settings

## Step 5: Test the Upload

1. Go to your dashboard (`/dashboard`)
2. Click "Upload Resume"
3. Select a PDF file (max 5MB)
4. Click "Upload"
5. You should see a success message and a link to view the resume

## Troubleshooting

### Error: "new row violates row-level security policy"

**Solution**: Make sure you've run the storage policies SQL or created them manually in the Storage → Policies section.

### Error: "Bucket not found"

**Solution**: Make sure you've created the `resumes` bucket in Storage.

### Error: "Permission denied"

**Solution**: Check that the storage policies are correctly set up for authenticated users.

### Resume URL not saving

**Solution**: Verify that the `resume_url` column was added to the `profiles` table by running:
```sql
SELECT column_name FROM information_schema.columns 
WHERE table_name = 'profiles' AND column_name = 'resume_url';
```

## How It Works

1. User selects a PDF file
2. File is validated (PDF only, max 5MB)
3. File is uploaded to Supabase Storage bucket `resumes`
4. Public URL is generated and saved to user's profile
5. User can view, replace, or delete their resume

The resume files are stored securely in Supabase Storage and only accessible to authenticated users.


