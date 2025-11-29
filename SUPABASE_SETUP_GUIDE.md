# 🚀 Supabase Database Setup Guide

## ⚡ Quick Setup (15 Minutes)

Follow these steps in order to set up your complete Supabase database.

---

## 📋 Prerequisites

- ✅ Supabase account created
- ✅ Supabase project created
- ✅ Project is active (not paused)

---

## 🎯 Step-by-Step Setup

### **Step 1: Run Master Schema** (5 minutes)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Open SQL Editor**
   - Click **SQL Editor** in left sidebar
   - Click **New Query**

3. **Copy and Paste Schema**
   - Open file: `supabase/MASTER_SCHEMA.sql`
   - Copy ALL contents
   - Paste into SQL Editor

4. **Execute**
   - Click **Run** button (or press Ctrl/Cmd + Enter)
   - Wait for completion (~30 seconds)
   - You should see: "Success. No rows returned"

5. **Verify Tables Created**
   - Go to **Table Editor** in left sidebar
   - You should see these tables:
     - ✅ profiles
     - ✅ job_matches
     - ✅ interview_history
     - ✅ job_search_analytics
     - ✅ scraping_cache

---

### **Step 2: Create Storage Bucket** (3 minutes)

1. **Go to Storage**
   - Click **Storage** in left sidebar
   - Click **Create a new bucket**

2. **Configure Bucket**
   - **Name:** `resumes`
   - **Public bucket:** ❌ No (keep private)
   - **File size limit:** `10485760` (10MB)
   - **Allowed MIME types:** `application/pdf`
   - Click **Create bucket**

3. **Verify Bucket Created**
   - You should see `resumes` bucket in the list

---

### **Step 3: Set Storage Policies** (2 minutes)

1. **Go back to SQL Editor**
   - Click **SQL Editor** in left sidebar
   - Click **New Query**

2. **Copy and Paste Storage Policies**
   - Open file: `supabase/STORAGE_POLICIES.sql`
   - Copy ALL contents
   - Paste into SQL Editor

3. **Execute**
   - Click **Run** button
   - Wait for completion
   - You should see: "Success. No rows returned"

---

### **Step 4: Verify Setup** (5 minutes)

#### 4.1 Check Tables

Run this query in SQL Editor:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('profiles', 'job_matches', 'interview_history', 'job_search_analytics', 'scraping_cache')
ORDER BY table_name;
```

**Expected Result:** 5 rows showing all table names

#### 4.2 Check RLS Enabled

```sql
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'job_matches', 'interview_history', 'job_search_analytics', 'scraping_cache');
```

**Expected Result:** All tables should have `rowsecurity = true`

#### 4.3 Check Policies

```sql
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

**Expected Result:** Multiple policies for each table

#### 4.4 Check Storage Policies

```sql
SELECT policyname, cmd
FROM pg_policies
WHERE schemaname = 'storage'
AND tablename = 'objects'
AND policyname LIKE '%resume%';
```

**Expected Result:** 4 policies (upload, view, update, delete)

---

## ✅ Setup Complete!

Your database is now ready! Here's what you have:

### **Tables Created:**
1. ✅ **profiles** - User data with resume information
2. ✅ **job_matches** - AI-matched job opportunities
3. ✅ **interview_history** - Interview preparation sessions
4. ✅ **job_search_analytics** - User metrics and analytics
5. ✅ **scraping_cache** - Performance optimization cache

### **Security Enabled:**
- ✅ Row Level Security (RLS) on all tables
- ✅ Policies for user data isolation
- ✅ Storage policies for resume uploads
- ✅ Google Auth integration preserved

### **Features Ready:**
- ✅ Automatic profile creation on signup
- ✅ Analytics tracking
- ✅ Resume storage
- ✅ Job matching
- ✅ Interview prep

---

## 🧪 Test Your Setup

### Test 1: Create a Test User

1. Go to your app: http://localhost:3000
2. Sign up with email or Google
3. Check Supabase → **Authentication** → **Users**
4. You should see your user

### Test 2: Check Profile Created

Run in SQL Editor:

```sql
SELECT * FROM profiles LIMIT 5;
```

You should see your profile with email and name.

### Test 3: Check Analytics Created

```sql
SELECT * FROM job_search_analytics LIMIT 5;
```

You should see an analytics record for your user.

### Test 4: Test Resume Upload

1. Go to `/upload-resume` in your app
2. Upload a PDF file
3. Check Supabase → **Storage** → **resumes**
4. You should see: `{your-user-id}/filename.pdf`

---

## 🔧 Troubleshooting

### Issue: "Table already exists" error

**Solution:** This is OK! The schema uses `CREATE TABLE IF NOT EXISTS`, so it won't overwrite existing tables.

### Issue: "Policy already exists" error

**Solution:** The schema drops existing policies before creating new ones. If you still get errors, manually drop policies:

```sql
DROP POLICY IF EXISTS "policy_name" ON table_name;
```

### Issue: Storage upload fails

**Checklist:**
- [ ] Bucket `resumes` exists
- [ ] User is authenticated
- [ ] File is PDF format
- [ ] File is under 10MB
- [ ] Storage policies are created

**Fix:** Re-run `STORAGE_POLICIES.sql`

### Issue: RLS blocking queries

**Solution:** Make sure you're querying as an authenticated user. Test with:

```sql
SELECT auth.uid(); -- Should return your user ID
```

---

## 📊 Database Schema Overview

### Profiles Table
```
id (UUID) → links to auth.users
email, full_name, avatar_url
resume_url, resume_raw_text
skills[], skill_proficiency (JSONB)
experience, education, projects (JSONB)
profile_summary, strengths[], areas_for_improvement[]
career_level
```

### Job Matches Table
```
id (UUID)
user_id → links to auth.users
title, company, location, link
score (0-100), match_reasons
requirements[], matched_skills[], missing_skills[]
source, scraped_at
is_bookmarked, is_applied
```

### Interview History Table
```
id (UUID)
user_id → links to auth.users
company, role, tech_stack[]
company_info (JSONB), company_culture
recent_news[], tech_focus_areas[]
questions (JSONB), total_questions
technical_questions_count, behavioral_questions_count
```

### Analytics Table
```
id (UUID)
user_id → links to auth.users
total_jobs_discovered, total_jobs_applied
total_interviews_prepared
skill_coverage_percentage
top_missing_skills[]
last_resume_update, last_job_search, last_interview_prep
```

---

## 🎯 Next Steps

Now that your database is set up:

1. ✅ **Database Setup** - COMPLETE!
2. ⏳ **Deploy Edge Functions** - See `EDGE_FUNCTIONS_DEPLOYMENT.md`
3. ⏳ **Test Frontend Integration** - Connect and test
4. ⏳ **End-to-End Testing** - Full user flow

---

## 📞 Need Help?

### Common Commands

**View all tables:**
```sql
\dt
```

**View table structure:**
```sql
\d profiles
```

**Count records:**
```sql
SELECT COUNT(*) FROM profiles;
```

**Delete all data (careful!):**
```sql
TRUNCATE profiles, job_matches, interview_history, job_search_analytics, scraping_cache CASCADE;
```

---

## 🎉 You're Ready!

Your Supabase database is fully configured and ready for your hackathon project!

**What's Working:**
- ✅ User authentication (Google + Email)
- ✅ Profile management
- ✅ Resume storage
- ✅ Job matching structure
- ✅ Interview prep structure
- ✅ Analytics tracking

**What's Next:**
- ⏳ Implement Edge Functions
- ⏳ Connect frontend to backend
- ⏳ Test complete user flow

Good luck! 🚀
