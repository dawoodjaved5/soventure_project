# Fix "Bucket not found" Error - Quick Guide

## 🔧 Problem
Error: "Bucket not found" when uploading resume

## ✅ Solution: Create the Storage Bucket

### Step 1: Open Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Sign in if needed
3. Select your project

### Step 2: Go to Storage

1. Look at the **left sidebar**
2. Find **"Storage"** (folder/box icon) - usually near the bottom
3. Click on it

### Step 3: Create the Bucket

1. You'll see a page with your storage buckets (might be empty)
2. Click the **"New bucket"** button (usually blue, at the top)
3. A form will appear

### Step 4: Fill the Form

Fill in exactly like this:

```
Name: resumes

☐ Public bucket  (UNCHECK this - leave it unchecked/private)

(Optional settings - you can skip these)
File size limit: 5242880
Allowed MIME types: application/pdf
```

**Important**: The name must be exactly `resumes` (lowercase, no spaces!)

### Step 5: Create It

1. Click the **"Create bucket"** or **"Save"** button
2. Wait a few seconds
3. You should now see "resumes" in your buckets list ✅

### Step 6: Set Up Permissions (IMPORTANT!)

Now you need to allow users to upload files. Do this:

1. Stay in the Storage page
2. Click on the **"resumes"** bucket you just created
3. Click the **"Policies"** tab at the top
4. You'll see a button **"New Policy"** - click it

You need to create **4 policies** (one for each action):

#### Policy 1: Upload (INSERT)
- **Policy name**: "Allow upload"
- **Allowed operation**: Select **"INSERT"**
- **Policy definition**: Copy and paste this:
  ```sql
  bucket_id = 'resumes'
  ```
- Click **"Review"** then **"Save policy"**

#### Policy 2: View (SELECT)
- Click **"New Policy"** again
- **Policy name**: "Allow view"
- **Allowed operation**: Select **"SELECT"**
- **Policy definition**: Same as above:
  ```sql
  bucket_id = 'resumes'
  ```
- Click **"Review"** then **"Save policy"**

#### Policy 3: Update
- Click **"New Policy"** again
- **Policy name**: "Allow update"
- **Allowed operation**: Select **"UPDATE"**
- **Policy definition**: Same:
  ```sql
  bucket_id = 'resumes'
  ```
- Click **"Review"** then **"Save policy"**

#### Policy 4: Delete
- Click **"New Policy"** one more time
- **Policy name**: "Allow delete"
- **Allowed operation**: Select **"DELETE"**
- **Policy definition**: Same:
  ```sql
  bucket_id = 'resumes'
  ```
- Click **"Review"** then **"Save policy"**

---

## 🎯 Quick Alternative: Use SQL (Faster!)

Instead of creating policies manually, you can run this SQL:

1. Go to **SQL Editor** in Supabase (left sidebar)
2. Click **"New Query"**
3. Copy and paste this entire SQL:

```sql
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
```

4. Click **"Run"** (or press Ctrl/Cmd + Enter)
5. You should see "Success" ✅

---

## ✅ Test It

1. Go back to your app (`/dashboard`)
2. Try uploading a PDF resume
3. The "Bucket not found" error should be gone! 🎉

---

## 📝 Summary Checklist

- [ ] Created bucket named "resumes" in Storage
- [ ] Bucket is visible in Storage list
- [ ] Created 4 storage policies (or ran the SQL)
- [ ] Tested upload - no more errors!

---

That's it! Your bucket is now set up. 🚀


