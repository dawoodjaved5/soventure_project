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
