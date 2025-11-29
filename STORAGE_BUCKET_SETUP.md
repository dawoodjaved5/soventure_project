# How to Create Storage Bucket in Supabase - Step by Step

## Step-by-Step Guide to Fix "Bucket not found" Error

### Step 1: Go to Storage in Supabase Dashboard

1. Open your **Supabase Dashboard** (https://supabase.com/dashboard)
2. Select your project
3. Click **"Storage"** in the left sidebar (look for the folder/box icon)

### Step 2: Create New Bucket

1. In the Storage page, click the **"New bucket"** button (usually at the top right or in an empty state message)
2. You'll see a form to create a bucket

### Step 3: Fill in Bucket Details

Fill in the form with these exact values:

- **Name**: `resumes` (must be exactly "resumes" - all lowercase, no spaces)
- **Public bucket**: **UNCHECKED** (leave it unchecked/private)
  - This keeps resumes private and secure
- **File size limit**: `5242880` (this is 5MB in bytes - optional but recommended)
- **Allowed MIME types**: `application/pdf` (optional - restricts to PDFs only)

### Step 4: Create the Bucket

1. Click **"Create bucket"** button
2. Wait a few seconds for the bucket to be created
3. You should see "resumes" appear in your buckets list

### Step 5: Set Up Storage Policies (IMPORTANT!)

After creating the bucket, you need to allow users to upload files:

**Option A: Use SQL (Recommended)**

1. Go to **SQL Editor** in Supabase
2. Copy and paste this SQL:

```sql
-- Allow authenticated users to upload resumes
CREATE POLICY "Authenticated users can upload resumes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'resumes');

-- Allow authenticated users to view resumes
CREATE POLICY "Authenticated users can view resumes"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'resumes');

-- Allow authenticated users to update resumes
CREATE POLICY "Authenticated users can update resumes"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'resumes');

-- Allow authenticated users to delete resumes
CREATE POLICY "Authenticated users can delete resumes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'resumes');
```

3. Click **"Run"**

**Option B: Use Dashboard (Alternative)**

1. Go to **Storage** → Click on **"resumes"** bucket
2. Click **"Policies"** tab
3. Click **"New Policy"**
4. For each policy:
   - **Policy name**: Give it a name (e.g., "Upload resumes")
   - **Allowed operation**: Select INSERT, SELECT, UPDATE, or DELETE (create 4 separate policies)
   - **Target roles**: Select `authenticated`
   - **Policy definition**: Use `bucket_id = 'resumes'`
   - Click **"Save"**

### Step 6: Verify the Bucket Exists

1. Go back to **Storage** page
2. You should see "resumes" in your buckets list
3. Click on it to see its details

### Step 7: Test the Upload

1. Go to your app at `/dashboard`
2. Try uploading a PDF resume
3. It should work now! ✅

---

## Quick Checklist

- [ ] Bucket name is exactly "resumes" (lowercase)
- [ ] Bucket is created and visible in Storage list
- [ ] Storage policies are set up (4 policies: INSERT, SELECT, UPDATE, DELETE)
- [ ] Policies allow `authenticated` role
- [ ] Policy definition uses `bucket_id = 'resumes'`

---

## Troubleshooting

### Still Getting "Bucket not found"?

1. **Double-check the bucket name**: It must be exactly `resumes` (lowercase, no spaces)
2. **Refresh your browser** after creating the bucket
3. **Check bucket exists**: Go to Storage → You should see "resumes" in the list
4. **Check browser console**: Look for any additional error messages

### Getting Permission Errors?

- Make sure you've created all 4 storage policies (INSERT, SELECT, UPDATE, DELETE)
- Verify policies allow `authenticated` users
- Check that policies use `bucket_id = 'resumes'`

### Can't See Storage Option?

- Make sure you're logged into Supabase
- Check you've selected the correct project
- Storage should be in the left sidebar menu

---

## Visual Guide

1. **Left Sidebar** → Click **"Storage"** (folder icon)
2. **Top Right** → Click **"New bucket"**
3. **Form** → Enter name: `resumes`
4. **Create** → Click "Create bucket"
5. **Policies** → Run SQL policies or create manually
6. **Done** → Test upload!

That's it! Your bucket should now be ready. 🎉


