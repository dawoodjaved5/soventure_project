# Soventure Frontend - AI-Powered Career Platform

## 🎨 Pages Overview

### 1. **Upload Resume** (`/upload-resume`)
- **Features:**
  - Drag & drop PDF upload
  - Supabase Storage integration
  - AI-powered resume parsing via Edge Function
  - Visual display of parsed data (skills, experience, education, projects)
  - Beautiful gradient cards for each section
  
- **Flow:**
  1. User uploads PDF
  2. File stored in Supabase Storage
  3. Edge Function `parse_resume` extracts and analyzes content
  4. Parsed data displayed in organized cards
  5. Quick navigation to Job Discovery

### 2. **Job Discovery** (`/jobs`)
- **Features:**
  - AI-powered job matching based on resume
  - Match score visualization (0-100%)
  - Color-coded score bars (green/blue/yellow/red)
  - Search functionality for specific roles/companies
  - Job requirements display
  - Direct links to job postings
  
- **Flow:**
  1. Click "Discover Jobs" button
  2. Edge Function `discover_jobs` scrapes and scores jobs
  3. Results saved to `job_matches` table
  4. Display with match reasons and requirements

### 3. **Interview Prep** (`/interview`)
- **Features:**
  - Generate custom interview questions
  - Input: company, role, tech stack
  - Question types: Technical, Behavioral, System Design
  - Difficulty levels: Easy, Medium, Hard
  - Expandable answers and explanations
  - Interview history tracking
  
- **Flow:**
  1. Enter company, role, and tech stack
  2. Edge Function `interview_generator` creates questions
  3. Questions saved to `interview_history` table
  4. Display with expandable answers

### 4. **Dashboard** (`/dashboard`)
- **Features:**
  - Overview stats (resume status, job matches, interviews, skills)
  - Interactive charts using Recharts:
    - Pie chart: Top skills distribution
    - Bar chart: Job match scores
    - Line chart: Interview prep timeline
  - Quick action cards
  - Recent activity feed
  - Beautiful gradient design throughout
  
- **Data Sources:**
  - `profiles` table
  - `job_matches` table
  - `interview_history` table

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Backend:** Supabase (Auth, Database, Storage, Edge Functions)
- **Charts:** Recharts
- **Icons:** Lucide React
- **HTTP Client:** Axios (for API calls)

## 📁 Project Structure

```
app/
├── dashboard/
│   └── page.tsx          # Enhanced dashboard with charts
├── upload-resume/
│   └── page.tsx          # Resume upload & parsing
├── jobs/
│   └── page.tsx          # Job discovery & matching
├── interview/
│   └── page.tsx          # Interview question generator
├── login/
│   └── page.tsx          # Login page
├── signup/
│   └── page.tsx          # Signup page
├── layout.tsx            # Root layout with Navigation
└── globals.css           # Global styles

components/
├── Navigation.tsx        # Main navigation bar
└── LogoutButton.tsx      # Logout functionality

lib/
└── api/
    └── index.ts          # Centralized API helpers

utils/
└── supabase/
    ├── client.ts         # Browser client
    ├── server.ts         # Server client
    └── middleware.ts     # Auth middleware
```

## 🎨 Design System

### Color Palette
- **Primary Gradient:** Purple to Pink (`from-purple-600 to-pink-600`)
- **Secondary Gradients:**
  - Blue to Cyan (`from-blue-600 to-cyan-600`)
  - Orange to Red (`from-orange-600 to-red-600`)
  - Green to Emerald (`from-green-600 to-emerald-600`)

### Components
- **Cards:** Rounded corners (rounded-2xl, rounded-3xl)
- **Shadows:** Layered shadows (shadow-lg, shadow-xl, shadow-2xl)
- **Hover Effects:** Scale transforms, shadow increases
- **Transitions:** Smooth 300ms duration

## 🔌 API Integration

### Edge Functions Required

1. **`parse_resume`**
   - Input: `{ resumeUrl, userId }`
   - Output: `{ skills, experience, education, projects }`
   - Updates `profiles` table

2. **`discover_jobs`**
   - Input: `{ userId, query? }`
   - Output: Array of job matches
   - Inserts into `job_matches` table

3. **`interview_generator`**
   - Input: `{ userId, company, role, techStack }`
   - Output: `{ questions: [...] }`
   - Inserts into `interview_history` table

### Database Tables

```sql
-- profiles
id, name, avatar_url, resume_url, resume_raw_text, skills, experience, education, projects

-- job_matches
id, user_id, title, company, link, score, reasons, requirements, date_found

-- interview_history
id, user_id, company, role, tech_stack, date, questions
```

## 🚀 Getting Started

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set Environment Variables:**
   Create `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Run Development Server:**
   ```bash
   npm run dev
   ```

4. **Access Pages:**
   - Dashboard: http://localhost:3000/dashboard
   - Upload Resume: http://localhost:3000/upload-resume
   - Jobs: http://localhost:3000/jobs
   - Interview: http://localhost:3000/interview

## 📊 Features Implemented

✅ Responsive navigation with active states  
✅ Resume upload with drag & drop  
✅ AI resume parsing visualization  
✅ Job discovery with match scoring  
✅ Interview question generator  
✅ Interactive dashboard with charts  
✅ Beautiful gradient design system  
✅ Smooth animations and transitions  
✅ Mobile-responsive layouts  
✅ Error handling and loading states  

## 🎯 Next Steps

1. **Backend:** Create the 3 Supabase Edge Functions
2. **Storage:** Set up Supabase Storage bucket for resumes
3. **Database:** Create tables with RLS policies
4. **Testing:** Test all flows end-to-end
5. **Deployment:** Deploy to Vercel

## 💡 Tips

- All pages use client-side rendering (`'use client'`)
- Navigation is sticky and responsive
- Charts only render when data is available
- Error states are handled gracefully
- Loading states use spinners and disabled buttons

## 🎨 Design Highlights

- **Premium Feel:** Vibrant gradients, smooth shadows
- **Interactive:** Hover effects, expandable sections
- **Informative:** Clear data visualization with charts
- **User-Friendly:** Intuitive navigation, clear CTAs
- **Modern:** Latest design trends (glassmorphism hints, bold typography)

---

**Built with ❤️ for Hackathons**
