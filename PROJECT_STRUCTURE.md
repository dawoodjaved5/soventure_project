# 📁 Soventure Project Structure

```
soventure_project/
│
├── 📱 app/                          # Next.js App Router
│   ├── dashboard/
│   │   └── page.tsx                # ✨ Enhanced Dashboard with Charts
│   ├── upload-resume/
│   │   └── page.tsx                # 📄 Resume Upload & Parsing
│   ├── jobs/
│   │   └── page.tsx                # 💼 Job Discovery & Matching
│   ├── interview/
│   │   └── page.tsx                # 🧠 Interview Preparation
│   ├── login/
│   │   └── page.tsx                # 🔐 Login Page
│   ├── signup/
│   │   └── page.tsx                # 📝 Signup Page
│   ├── auth/
│   │   └── callback/               # OAuth Callback
│   ├── layout.tsx                  # 🎨 Root Layout + Navigation
│   ├── page.tsx                    # 🏠 Home (redirects)
│   └── globals.css                 # 🎨 Global Styles + Animations
│
├── 🧩 components/
│   ├── Navigation.tsx              # 🧭 Main Navigation Bar
│   ├── LogoutButton.tsx            # 🚪 Logout Component
│   └── LoadingSkeleton.tsx         # ⏳ Loading States
│
├── 📚 lib/
│   └── api/
│       └── index.ts                # 🔌 API Helper Functions
│
├── 🔧 utils/
│   └── supabase/
│       ├── client.ts               # Browser Supabase Client
│       ├── server.ts               # Server Supabase Client
│       └── middleware.ts           # Auth Middleware
│
├── 📖 Documentation/
│   ├── FRONTEND_README.md          # 📘 Complete Frontend Docs
│   ├── FRONTEND_QUICKSTART.md      # 🚀 Quick Start Guide
│   ├── IMPLEMENTATION_SUMMARY.md   # ✅ Implementation Summary
│   └── PROJECT_STRUCTURE.md        # 📁 This File
│
├── ⚙️ Configuration/
│   ├── package.json                # Dependencies
│   ├── tsconfig.json               # TypeScript Config
│   ├── tailwind.config.js          # Tailwind Config
│   ├── next.config.js              # Next.js Config
│   ├── postcss.config.js           # PostCSS Config
│   └── .env.local                  # Environment Variables
│
└── 🗄️ supabase/                    # Supabase Backend (TODO)
    └── functions/                  # Edge Functions
        ├── parse_resume/           # ⏳ TODO: Resume Parser
        ├── discover_jobs/          # ⏳ TODO: Job Discovery
        └── interview_generator/    # ⏳ TODO: Interview Generator

```

## 🎯 Page Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         🏠 Home (/)                          │
│                    Redirects to Login                        │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
        ┌───────────────────┐  ┌───────────────────┐
        │  🔐 Login         │  │  📝 Signup        │
        │  /login           │  │  /signup          │
        └───────────────────┘  └───────────────────┘
                    │                   │
                    └─────────┬─────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │         ✨ Dashboard (/dashboard)        │
        │  • Stats Cards                          │
        │  • Charts (Pie, Bar, Line)              │
        │  • Quick Actions                        │
        │  • Recent Activity                      │
        └─────────────────────────────────────────┘
                              ↓
            ┌─────────────────┼─────────────────┐
            ↓                 ↓                  ↓
┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐
│ 📄 Upload Resume │ │ 💼 Job Discovery │ │ 🧠 Interview Prep│
│ /upload-resume   │ │ /jobs            │ │ /interview       │
│                  │ │                  │ │                  │
│ • PDF Upload     │ │ • AI Matching    │ │ • Question Gen   │
│ • AI Parsing     │ │ • Score Display  │ │ • Answer Tips    │
│ • Data Display   │ │ • Apply Links    │ │ • History        │
└──────────────────┘ └──────────────────┘ └──────────────────┘
```

## 🎨 Component Hierarchy

```
RootLayout (layout.tsx)
├── Navigation (sticky top bar)
│   ├── Logo
│   ├── Dashboard Link
│   ├── Upload Resume Link
│   ├── Jobs Link
│   └── Interview Link
│
└── Page Content
    ├── Dashboard Page
    │   ├── Header + LogoutButton
    │   ├── Stats Grid (4 cards)
    │   ├── Quick Actions (3 cards)
    │   ├── Charts Section
    │   │   ├── Skills Pie Chart
    │   │   ├── Job Scores Bar Chart
    │   │   └── Interview Timeline Line Chart
    │   └── Recent Activity
    │       ├── Recent Jobs
    │       └── Recent Interviews
    │
    ├── Upload Resume Page
    │   ├── Header
    │   ├── Upload Section
    │   │   ├── File Picker
    │   │   └── Upload Button
    │   └── Parsed Data Display
    │       ├── Skills Card
    │       ├── Experience Card
    │       ├── Education Card
    │       └── Projects Card
    │
    ├── Jobs Page
    │   ├── Header
    │   ├── Search + Discover Section
    │   └── Jobs List
    │       └── Job Card (repeated)
    │           ├── Score Bar
    │           ├── Job Info
    │           ├── Match Reasons
    │           ├── Requirements
    │           └── Apply Button
    │
    └── Interview Page
        ├── Header
        ├── Input Form
        │   ├── Company Input
        │   ├── Role Input
        │   ├── Tech Stack Input
        │   └── Generate Button
        ├── Questions Display
        │   └── Question Card (repeated)
        │       ├── Question Header
        │       ├── Type Badge
        │       ├── Difficulty Badge
        │       └── Expandable Answer
        └── Interview History
```

## 🔌 Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React/Next.js)                  │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
        ┌───────────────────┐  ┌───────────────────┐
        │  Browser Client   │  │  Server Client    │
        │  (client.ts)      │  │  (server.ts)      │
        └───────────────────┘  └───────────────────┘
                    │                   │
                    └─────────┬─────────┘
                              ↓
        ┌─────────────────────────────────────────┐
        │         Supabase Backend                │
        ├─────────────────────────────────────────┤
        │  🔐 Auth (Supabase Auth)                │
        │  📊 Database (PostgreSQL)               │
        │  📁 Storage (Resume PDFs)               │
        │  ⚡ Edge Functions (Deno)               │
        └─────────────────────────────────────────┘
                              ↓
                    ┌─────────┴─────────┐
                    ↓                   ↓
        ┌───────────────────┐  ┌───────────────────┐
        │  External APIs    │  │  Web Scraping     │
        │  • OpenAI         │  │  • Job Boards     │
        │  • Resume Parser  │  │  • Company Info   │
        └───────────────────┘  └───────────────────┘
```

## 📊 Database Schema

```
┌─────────────────────────────────────────────────────────────┐
│                      auth.users (Supabase)                   │
│  • id (UUID)                                                 │
│  • email                                                     │
│  • created_at                                                │
└─────────────────────────────────────────────────────────────┘
                              ↓ (references)
┌─────────────────────────────────────────────────────────────┐
│                         profiles                             │
│  • id (UUID) → auth.users.id                                │
│  • name                                                      │
│  • avatar_url                                                │
│  • resume_url                                                │
│  • resume_raw_text                                           │
│  • skills (text[])                                           │
│  • experience (jsonb)                                        │
│  • education (jsonb)                                         │
│  • projects (jsonb)                                          │
└─────────────────────────────────────────────────────────────┘
                              ↓ (references)
        ┌─────────────────────┴─────────────────────┐
        ↓                                           ↓
┌──────────────────────┐              ┌──────────────────────┐
│   job_matches        │              │  interview_history   │
│  • id                │              │  • id                │
│  • user_id           │              │  • user_id           │
│  • title             │              │  • company           │
│  • company           │              │  • role              │
│  • link              │              │  • tech_stack        │
│  • score             │              │  • date              │
│  • reasons           │              │  • questions (jsonb) │
│  • requirements      │              └──────────────────────┘
│  • date_found        │
└──────────────────────┘
```

## 🎨 Design Token System

```
Colors:
├── Primary Gradient: purple-600 → pink-600
├── Blue Gradient: blue-600 → cyan-600
├── Orange Gradient: orange-600 → red-600
└── Green Gradient: green-600 → emerald-600

Spacing:
├── Small: 4px (gap-1, p-1)
├── Medium: 16px (gap-4, p-4)
├── Large: 24px (gap-6, p-6)
└── XLarge: 32px (gap-8, p-8)

Border Radius:
├── Small: 8px (rounded-lg)
├── Medium: 12px (rounded-xl)
├── Large: 16px (rounded-2xl)
└── XLarge: 24px (rounded-3xl)

Shadows:
├── Small: shadow-lg
├── Medium: shadow-xl
└── Large: shadow-2xl

Animations:
├── fade-in: 0.5s ease-out
├── slide-in-right: 0.5s ease-out
└── pulse-glow: 2s infinite
```

## 🚀 Deployment Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Vercel (Frontend)                         │
│  • Next.js App                                               │
│  • Static Assets                                             │
│  • Edge Functions (Vercel)                                   │
└─────────────────────────────────────────────────────────────┘
                              ↓ API Calls
┌─────────────────────────────────────────────────────────────┐
│                  Supabase (Backend)                          │
│  • PostgreSQL Database                                       │
│  • Auth Service                                              │
│  • Storage Buckets                                           │
│  • Edge Functions (Deno)                                     │
└─────────────────────────────────────────────────────────────┘
```

## 📱 Responsive Breakpoints

```
Mobile (< 768px)
├── Single column layouts
├── Stacked cards
├── Compact navigation
└── Touch-optimized buttons

Tablet (768px - 1024px)
├── 2-column grids
├── Side-by-side cards
└── Expanded navigation

Desktop (> 1024px)
├── 3-4 column grids
├── Full charts
├── Spacious layouts
└── Hover effects
```

---

**This structure is optimized for hackathon speed and scalability! 🚀**
