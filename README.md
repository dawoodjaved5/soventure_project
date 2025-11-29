NEXT_PUBLIC_SUPABASE_URL=https://ypmnxburhtquqluejeuv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwbW54YnVyaHRxdXFsdWVqZXV2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzNTIzMDgsImV4cCI6MjA3OTkyODMwOH0.o4r0EhUW6bZvpiJ_B8xpMdgKrD07b3fsIGHICHXRY04
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwbW54YnVyaHRxdXFsdWVqZXV2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDM1MjMwOCwiZXhwIjoyMDc5OTI4MzA4fQ.buMLT8XR7WN0Rqx_yhM44eH33-klk_MgKqS00H8SNrI
NEXT_PUBLIC_APP_URL=http://localhost:3000




M Dawood Javed 23i-3038 
Muneeb Ur Rehman 23i-0100 
Muhammad Hashir  23i-3047
Uzair Majeed     23i-3063





# Soventure - Next.js + Supabase + Google OAuth

A modern authentication system built with Next.js 14, Supabase, and Google OAuth. Features beautiful UI, secure authentication flows, and both email/password and Google OAuth sign-in methods.

## Features

- ✅ **Email/Password Authentication** - Sign up and sign in with email and password
- ✅ **Google OAuth Authentication** - One-click sign in with Google
- ✅ **Beautiful UI** - Modern, responsive design with Tailwind CSS
- ✅ **Protected Routes** - Automatic route protection with middleware
- ✅ **Session Management** - Secure session handling with HTTP-only cookies
- ✅ **User Profiles** - Automatic profile creation on signup
- ✅ **TypeScript** - Full type safety throughout the application

## Quick Start

## Tools
-  **CHATGPT** - **GEMINI** - **Claude** - **Supabase** - **NextJS** - **VERCEL** - **Antigravity**

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Run the SQL Schema

1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL from `supabase/schema.sql`

### 4. Configure Google OAuth

Follow the detailed setup guides:
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Complete step-by-step setup guide with detailed instructions
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Technical reference and troubleshooting
- **[QUICK_START.md](./QUICK_START.md)** - Fast setup for experienced developers

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
soventure/
├── app/
│   ├── auth/
│   │   └── callback/          # OAuth callback handler
│   ├── dashboard/             # Protected dashboard page
│   ├── login/                 # Login page
│   ├── signup/                # Signup page
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Home page (redirects)
│   └── globals.css            # Global styles
├── components/
│   └── LogoutButton.tsx       # Logout button component
├── supabase/
│   └── schema.sql             # Database schema
├── utils/
│   └── supabase/
│       ├── client.ts          # Client-side Supabase client
│       ├── server.ts          # Server-side Supabase client
│       └── middleware.ts      # Middleware session handler
├── types/
│   └── database.types.ts      # TypeScript database types
└── middleware.ts              # Next.js middleware
```

## Pages

- `/` - Home page (redirects to `/login` or `/dashboard`)
- `/login` - Login page with email/password and Google OAuth
- `/signup` - Signup page with email/password and Google OAuth
- `/dashboard` - Protected dashboard (requires authentication)
- `/auth/callback` - OAuth callback handler

## Authentication Flow

### Email/Password Flow
1. User signs up with email and password
2. Supabase creates the user account
3. Email confirmation sent (in production)
4. User profile automatically created via database trigger
5. User redirected to dashboard

### Google OAuth Flow
1. User clicks "Continue with Google"
2. Redirected to Google OAuth consent screen
3. After consent, Google redirects to Supabase callback
4. Supabase exchanges code for session
5. User profile automatically created with Google account info
6. User redirected to dashboard

## Technologies Used

- **Next.js 14** - React framework with App Router
- **TypeScript** - Type safety
- **Supabase** - Backend as a Service (Authentication + Database)
- **Tailwind CSS** - Utility-first CSS framework
- **Google OAuth 2.0** - Social authentication

## Documentation

- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Complete step-by-step setup guide (recommended for first-time setup)
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Technical reference and troubleshooting
- **[QUICK_START.md](./QUICK_START.md)** - Fast setup guide

## License

MIT

---

Built with ❤️ using Next.js and Supabase





project plan 


Core Requirements:

Intelligent Resume Analysis
Accept resume uploads in PDF format
Extract and structure key information: skills, experience, education, projects
Build a comprehensive user profile from resume data
Identify technical expertise areas and proficiency levels
Store structured resume insights for ongoing use

Automated Job Discovery & Matching
Scrape job listings based on extracted resume qualifications
Filter jobs by relevance to user’s specific experience and skill level
Present curated job matches with scoring, scores explaining why each job fits
Display key requirements and alignment with user qualifications

Deep Research-Powered Interview Preparation
Accept user input for upcoming interviews (company name, role, key technologies)
Automatically gather real-time company and industry information from the specified technologies
Build interview question bank based on:
Company-specific technologies and role
Recent interview experiences shared online
Company-specific culture and technical focus

Generate behavioral and technical questions with detailed model answers and sample answers (with explanations)


Page 3

User Dashboard & Analytics
Visual overview of job search progress and discovered opportunities
Skill coverage analysis showing strengths and gaps
Interview preparation tracker and history
Clear presentation of AI-generated insights and recommendations


Technical Requirements:

Web-based application accessible via browser
Secure user authentication and data storage
PDF parsing and text extraction
Web scraping functionality for job discovery
Database for persistent storage
All the code must be stored with GitHub
All the code must be open-source, clean and documented

Judging Rubrics:

Feature Completeness & Quality
Resume Analysis: Accuracy of extraction and insight depth (40% – heavily weighted)
Job Matching: Relevance and quality of discovered opportunities (with clear scoring)
Interview Prep: Depth of research and usefulness of generated questions (15–20 min)
Dashboard: Intuitive presentation of insights and actionable information
AI Integration & Innovation
Sophisticated use of AI for reasoning and skill extraction
Quality of job matching and research process (must show evidence of internet research, not generic responses)
Difficulty, Ambition & Completeness
Simply re-creating a basic job board or generic question bank will score low
Bonus points for creative, sophisticated solutions to clearly challenging aspects (e.g., deep company/role-specific research, multi-step AI reasoning, high-quality resume parsing)

Well done on building something this ambitious! Good luck in the hackathon! 🚀



✅ Supabase SQL Schema (Final Version)
1. users

Stores basic user accounts (auth handled by Supabase Auth)

create table users (
    id uuid primary key,
    full_name text,
    email text unique,
    created_at timestamptz default now()
);

2. resumes

Stores uploaded resumes + extracted structured fields

create table resumes (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    file_url text not null,
    raw_text text, -- extracted PDF text
    summary text,  -- AI extracted summary / profile statement

    -- extracted structured data
    skills jsonb,        -- e.g. ["React", "Node.js", "SQL"]
    experience jsonb,    -- list of jobs, companies, durations
    education jsonb,     -- degrees, universities
    projects jsonb,      -- project names, tech stack

    ai_skill_levels jsonb,  -- {"React":"Intermediate", "Python":"Expert"}

    created_at timestamptz default now()
);

3. user_profiles

Built from resume insights + editable by user.

create table user_profiles (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    headline text,
    strengths jsonb,
    weaknesses jsonb,
    preferred_roles text[],
    tech_stack jsonb,
    updated_at timestamptz default now()
);

🟦 JOB DISCOVERY & MATCHING
4. scraped_jobs

Where Python scraper inserts job listings.

create table scraped_jobs (
    id uuid primary key default gen_random_uuid(),
    source text not null,         -- e.g. "Indeed", "LinkedIn"
    job_title text,
    company text,
    location text,
    url text,
    description text,
    requirements jsonb,
    posted_date date,
    created_at timestamptz default now()
);

5. job_matches

AI/algorithm-generated match score for each job → user

create table job_matches (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    job_id uuid references scraped_jobs(id) on delete cascade,

    score numeric,        -- 0–100
    reasons jsonb,        -- why match? {"skills_match": "...", "experience_match": "..."}
    matched_at timestamptz default now()
);

🟧 INTERVIEW PREPARATION
6. interview_requests

User enters company + role + technologies

create table interview_requests (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,
    company text,
    role text,
    technologies text[],
    created_at timestamptz default now()
);

7. interview_research

Stores Python-scraped research + AI research summaries.

create table interview_research (
    id uuid primary key default gen_random_uuid(),
    request_id uuid references interview_requests(id) on delete cascade,
    company_overview text,
    company_tech_stack jsonb,
    recent_news jsonb,
    role_expectations jsonb,
    created_at timestamptz default now()
);

8. interview_questions

AI-generated Q&A (technical + behavioral)

create table interview_questions (
    id uuid primary key default gen_random_uuid(),
    request_id uuid references interview_requests(id) on delete cascade,

    category text,     -- "technical" | "behavioral" | "company-specific"
    question text,
    model_answer text,
    explanation text,

    created_at timestamptz default now()
);

🟩 DASHBOARD & ANALYTICS
9. analytics_skill_gaps

Used to show skill gap analysis.

create table analytics_skill_gaps (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id) on delete cascade,

    missing_skills text[],
    recommended_skills text[],
    gap_explanation text,

    created_at timestamptz default now()
);

10. user_activity

Tracks job views, applications, and interview prep sessions.

create table user_activity (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references users(id),
    action text,                -- "view_job", "apply_job", "generate_interview"
    metadata jsonb,             -- job_id, request_id, etc.
    created_at timestamptz default now()
);