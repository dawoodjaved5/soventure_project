# 🚀 Complete Supabase Setup Guide for Soventure

## 📋 Table of Contents
1. [Initial Supabase Setup](#1-initial-supabase-setup)
2. [Database Schema](#2-database-schema)
3. [Storage Buckets](#3-storage-buckets)
4. [Edge Functions Setup](#4-edge-functions-setup)
5. [Environment Variables](#5-environment-variables)
6. [Testing & Verification](#6-testing--verification)

---

## 1. Initial Supabase Setup

### Step 1: Create Supabase Project
1. Go to [https://supabase.com](https://supabase.com)
2. Sign in or create an account
3. Click "New Project"
4. Fill in:
   - **Name:** `soventure-hackathon`
   - **Database Password:** (save this securely)
   - **Region:** Choose closest to you
   - **Pricing Plan:** Free tier is fine
5. Wait for project to be created (~2 minutes)

### Step 2: Get API Keys
1. Go to **Settings** → **API**
2. Copy these values:
   - `Project URL` → This is your `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role` key → This is your `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### Step 3: Get OpenAI API Key
1. Go to [https://platform.openai.com/api-keys](https://platform.openai.com/api-keys)
2. Create new secret key
3. Copy and save it → This is your `OPENAI_API_KEY`

---

## 2. Database Schema

### Step 1: Enable Extensions
Go to **SQL Editor** in Supabase and run:

```sql
-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Enable pgvector for future AI embeddings (optional but recommended)
create extension if not exists vector;
```

### Step 2: Create Tables

Run this complete SQL script:

```sql
-- ============================================
-- PROFILES TABLE (Extended User Data)
-- ============================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  
  -- Basic Info
  name text,
  email text,
  avatar_url text,
  
  -- Resume Data
  resume_url text,
  resume_file_name text,
  resume_uploaded_at timestamptz,
  resume_raw_text text,
  
  -- Extracted Resume Data
  skills text[],
  skill_proficiency jsonb, -- {"React": "expert", "Python": "intermediate"}
  experience jsonb, -- Array of job experiences
  education jsonb, -- Array of education entries
  projects jsonb, -- Array of projects
  certifications jsonb, -- Array of certifications
  
  -- AI-Generated Insights
  profile_summary text, -- AI-generated summary
  strengths text[], -- Identified strengths
  areas_for_improvement text[], -- Skill gaps
  career_level text, -- "junior", "mid", "senior"
  
  -- Metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- JOB MATCHES TABLE
-- ============================================
create table job_matches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  
  -- Job Details
  title text not null,
  company text not null,
  location text,
  job_type text, -- "full-time", "part-time", "contract", "internship"
  experience_level text, -- "entry", "mid", "senior"
  salary_range text,
  link text not null,
  
  -- Matching Data
  score int not null check (score >= 0 and score <= 100),
  match_reasons text, -- AI explanation of why it matches
  requirements text[], -- Key requirements
  matched_skills text[], -- User skills that match
  missing_skills text[], -- Skills user lacks
  
  -- Scraping Metadata
  source text, -- "linkedin", "indeed", "glassdoor"
  scraped_at timestamptz default now(),
  job_posted_date timestamptz,
  
  -- User Actions
  is_bookmarked boolean default false,
  is_applied boolean default false,
  applied_at timestamptz,
  notes text,
  
  -- Metadata
  date_found timestamptz default now(),
  
  -- Indexes for performance
  constraint unique_job_per_user unique(user_id, link)
);

-- Create index for faster queries
create index idx_job_matches_user_score on job_matches(user_id, score desc);
create index idx_job_matches_date on job_matches(date_found desc);

-- ============================================
-- INTERVIEW HISTORY TABLE
-- ============================================
create table interview_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  
  -- Interview Details
  company text not null,
  role text not null,
  tech_stack text[],
  interview_date timestamptz,
  
  -- Company Research Data
  company_info jsonb, -- AI-researched company information
  company_culture text,
  recent_news text[],
  tech_focus_areas text[],
  
  -- Generated Questions
  questions jsonb not null, -- Array of question objects
  total_questions int,
  
  -- Question Breakdown
  technical_questions_count int,
  behavioral_questions_count int,
  system_design_questions_count int,
  
  -- User Progress
  completed_questions int default 0,
  user_notes text,
  
  -- Metadata
  date timestamptz default now(),
  last_accessed timestamptz default now()
);

-- Create index
create index idx_interview_history_user on interview_history(user_id, date desc);

-- ============================================
-- JOB SEARCH ANALYTICS TABLE
-- ============================================
create table job_search_analytics (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  
  -- Search Metrics
  total_jobs_discovered int default 0,
  total_jobs_applied int default 0,
  total_interviews_prepared int default 0,
  
  -- Skill Coverage
  skill_coverage_percentage int,
  top_missing_skills text[],
  
  -- Activity Tracking
  last_resume_update timestamptz,
  last_job_search timestamptz,
  last_interview_prep timestamptz,
  
  -- Metadata
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  constraint one_analytics_per_user unique(user_id)
);

-- ============================================
-- SCRAPING CACHE TABLE (Performance Optimization)
-- ============================================
create table scraping_cache (
  id uuid primary key default gen_random_uuid(),
  
  -- Cache Key
  cache_key text not null unique, -- Hash of search parameters
  cache_type text not null, -- "job_search", "company_info"
  
  -- Cached Data
  data jsonb not null,
  
  -- Metadata
  created_at timestamptz default now(),
  expires_at timestamptz not null,
  hit_count int default 0
);

-- Create index for cache lookups
create index idx_scraping_cache_key on scraping_cache(cache_key);
create index idx_scraping_cache_expiry on scraping_cache(expires_at);

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
alter table profiles enable row level security;
alter table job_matches enable row level security;
alter table interview_history enable row level security;
alter table job_search_analytics enable row level security;
alter table scraping_cache enable row level security;

-- Profiles Policies
create policy "Users can view own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update
  using (auth.uid() = id);

create policy "Users can insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Job Matches Policies
create policy "Users can view own job matches"
  on job_matches for select
  using (auth.uid() = user_id);

create policy "Users can insert own job matches"
  on job_matches for insert
  with check (auth.uid() = user_id);

create policy "Users can update own job matches"
  on job_matches for update
  using (auth.uid() = user_id);

create policy "Users can delete own job matches"
  on job_matches for delete
  using (auth.uid() = user_id);

-- Interview History Policies
create policy "Users can view own interview history"
  on interview_history for select
  using (auth.uid() = user_id);

create policy "Users can insert own interview history"
  on interview_history for insert
  with check (auth.uid() = user_id);

create policy "Users can update own interview history"
  on interview_history for update
  using (auth.uid() = user_id);

create policy "Users can delete own interview history"
  on interview_history for delete
  using (auth.uid() = user_id);

-- Analytics Policies
create policy "Users can view own analytics"
  on job_search_analytics for select
  using (auth.uid() = user_id);

create policy "Users can insert own analytics"
  on job_search_analytics for insert
  with check (auth.uid() = user_id);

create policy "Users can update own analytics"
  on job_search_analytics for update
  using (auth.uid() = user_id);

-- Scraping Cache Policies (Service role only)
create policy "Service role can manage cache"
  on scraping_cache for all
  using (auth.jwt() ->> 'role' = 'service_role');

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Function to update updated_at timestamp
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger update_profiles_updated_at
  before update on profiles
  for each row
  execute function update_updated_at_column();

create trigger update_analytics_updated_at
  before update on job_search_analytics
  for each row
  execute function update_updated_at_column();

-- Function to clean expired cache
create or replace function clean_expired_cache()
returns void as $$
begin
  delete from scraping_cache where expires_at < now();
end;
$$ language plpgsql;

-- ============================================
-- INITIAL DATA SETUP
-- ============================================

-- Create analytics record for new users (trigger)
create or replace function create_user_analytics()
returns trigger as $$
begin
  insert into job_search_analytics (user_id)
  values (new.id)
  on conflict (user_id) do nothing;
  return new;
end;
$$ language plpgsql;

create trigger on_profile_created
  after insert on profiles
  for each row
  execute function create_user_analytics();
```

### Step 3: Verify Tables
Run this to check all tables were created:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;
```

You should see:
- `profiles`
- `job_matches`
- `interview_history`
- `job_search_analytics`
- `scraping_cache`

---

## 3. Storage Buckets

### Step 1: Create Resumes Bucket
1. Go to **Storage** in Supabase
2. Click **New Bucket**
3. Settings:
   - **Name:** `resumes`
   - **Public:** ✅ Yes (or use signed URLs)
   - **File size limit:** 10 MB
   - **Allowed MIME types:** `application/pdf`

### Step 2: Set Storage Policies

Go to **Storage** → **Policies** → **resumes** bucket:

```sql
-- Allow authenticated users to upload their own resumes
create policy "Users can upload own resumes"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'resumes' 
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to read their own resumes
create policy "Users can read own resumes"
on storage.objects for select
to authenticated
using (
  bucket_id = 'resumes' 
  and (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow authenticated users to delete their own resumes
create policy "Users can delete own resumes"
on storage.objects for delete
to authenticated
using (
  bucket_id = 'resumes' 
  and (storage.foldername(name))[1] = auth.uid()::text
);
```

---

## 4. Edge Functions Setup

### Step 1: Install Supabase CLI

```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref YOUR_PROJECT_REF
```

Get your `PROJECT_REF` from Supabase Dashboard → Settings → General → Reference ID

### Step 2: Initialize Functions

```bash
# Create functions directory structure
supabase functions new parse_resume
supabase functions new discover_jobs
supabase functions new interview_generator
```

This creates:
```
supabase/
└── functions/
    ├── parse_resume/
    │   └── index.ts
    ├── discover_jobs/
    │   └── index.ts
    └── interview_generator/
        └── index.ts
```

### Step 3: Set Secrets

```bash
# Set OpenAI API Key
supabase secrets set OPENAI_API_KEY=your_openai_api_key_here

# Verify secrets
supabase secrets list
```

---

## 5. Environment Variables

### Update `.env.local`

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here

# For Edge Functions (don't expose to client)
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# OpenAI (used in Edge Functions)
OPENAI_API_KEY=your_openai_api_key_here
```

---

## 6. Testing & Verification

### Test Database Connection

Create a test file: `test-db.ts`

```typescript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

async function testDatabase() {
  // Test profiles table
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .limit(1)
  
  if (error) {
    console.error('❌ Database error:', error)
  } else {
    console.log('✅ Database connected successfully!')
  }
}

testDatabase()
```

### Test Storage

```typescript
async function testStorage() {
  const { data, error } = await supabase
    .storage
    .from('resumes')
    .list()
  
  if (error) {
    console.error('❌ Storage error:', error)
  } else {
    console.log('✅ Storage bucket accessible!')
  }
}
```

---

## ✅ Setup Checklist

- [ ] Supabase project created
- [ ] API keys copied to `.env.local`
- [ ] OpenAI API key obtained
- [ ] Database extensions enabled
- [ ] All 5 tables created
- [ ] RLS policies enabled
- [ ] Helper functions created
- [ ] Storage bucket `resumes` created
- [ ] Storage policies set
- [ ] Supabase CLI installed
- [ ] Project linked with CLI
- [ ] Edge Functions directories created
- [ ] Secrets set in Supabase
- [ ] Database connection tested
- [ ] Storage access tested

---

## 🎯 Next Steps

1. **Implement Edge Functions** (see separate files)
2. **Test Resume Upload Flow**
3. **Test Job Discovery**
4. **Test Interview Generation**
5. **Deploy Edge Functions**
6. **Run End-to-End Tests**

---

## 📞 Troubleshooting

### Issue: Can't connect to database
- Check if API keys are correct in `.env.local`
- Verify project is not paused (free tier pauses after inactivity)

### Issue: RLS policies blocking queries
- Make sure user is authenticated
- Check policy conditions match your query

### Issue: Storage upload fails
- Verify bucket name is exactly `resumes`
- Check file size is under 10MB
- Ensure file is PDF format

---

**Your Supabase backend is now ready! 🚀**

Next: Implement the Edge Functions to bring everything to life!
