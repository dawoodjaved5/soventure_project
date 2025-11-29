-- ==========================
-- 1. Users
-- ==========================
create table if not exists users (
    id uuid primary key default gen_random_uuid(),
    full_name text,
    email text unique,
    created_at timestamptz default now()
);

-- ==========================
-- 2. Resumes
-- ==========================
create table if not exists resumes (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    file_url text not null,
    raw_text text,
    summary text,
    skills jsonb,
    experience jsonb,
    education jsonb,
    projects jsonb,
    ai_skill_levels jsonb,
    created_at timestamptz default now()
);

-- ==========================
-- 3. User Profiles
-- ==========================
create table if not exists user_profiles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    headline text,
    strengths jsonb,
    weaknesses jsonb,
    preferred_roles text[],
    tech_stack jsonb,
    updated_at timestamptz default now()
);

-- ==========================
-- 4. Scraped Jobs
-- ==========================
create table if not exists scraped_jobs (
    id uuid primary key default gen_random_uuid(),
    source text not null,
    job_title text,
    company text,
    location text,
    url text,
    description text,
    requirements jsonb,
    posted_date date,
    created_at timestamptz default now()
);

-- ==========================
-- 5. Job Matches
-- ==========================
create table if not exists job_matches (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    job_id uuid references scraped_jobs(id) on delete cascade,
    score numeric,
    reasons jsonb,
    matched_at timestamptz default now()
);

-- ==========================
-- 6. Interview Requests
-- ==========================
create table if not exists interview_requests (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    company text,
    role text,
    technologies text[],
    created_at timestamptz default now()
);

-- ==========================
-- 7. Interview Research
-- ==========================
create table if not exists interview_research (
    id uuid primary key default gen_random_uuid(),
    request_id uuid references interview_requests(id) on delete cascade,
    company_overview text,
    company_tech_stack jsonb,
    recent_news jsonb,
    role_expectations jsonb,
    created_at timestamptz default now()
);

-- ==========================
-- 8. Interview Questions
-- ==========================
create table if not exists interview_questions (
    id uuid primary key default gen_random_uuid(),
    request_id uuid references interview_requests(id) on delete cascade,
    category text,
    question text,
    model_answer text,
    explanation text,
    created_at timestamptz default now()
);

-- ==========================
-- 9. Analytics Skill Gaps
-- ==========================
create table if not exists analytics_skill_gaps (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    missing_skills text[],
    recommended_skills text[],
    gap_explanation text,
    created_at timestamptz default now()
);

-- ==========================
-- 10. User Activity
-- ==========================
create table if not exists user_activity (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id),
    action text,
    metadata jsonb,
    created_at timestamptz default now()
);

-- ==========================
-- Indexes
-- ==========================
create index if not exists idx_resumes_user on resumes(user_id);
create index if not exists idx_user_profiles_user on user_profiles(user_id);
create index if not exists idx_job_matches_user on job_matches(user_id);
create index if not exists idx_interview_requests_user on interview_requests(user_id);
create index if not exists idx_interview_questions_request on interview_questions(request_id);
create index if not exists idx_analytics_skill_gaps_user on analytics_skill_gaps(user_id);
create index if not exists idx_user_activity_user on user_activity(user_id);
