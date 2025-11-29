# Setup Guide: Next.js + Supabase + Google OAuth

This guide will walk you through setting up Google OAuth authentication with Supabase and Next.js.

## Prerequisites

- Node.js 18+ installed
- A Google Cloud Platform account
- A Supabase account (free tier works fine)

---

## Step 1: Install Dependencies

First, install all the project dependencies:

```bash
npm install
```

---

## Step 2: Set Up Supabase Project

### 2.1 Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Fill in your project details:
   - **Name**: Choose a project name (e.g., "soventure")
   - **Database Password**: Create a strong password (save this!)
   - **Region**: Choose the closest region to your users
5. Click "Create new project" and wait for it to be ready (2-3 minutes)

### 2.2 Get Your Supabase Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (this is your `NEXT_PUBLIC_SUPABASE_URL`)
   - **anon/public key** (this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`)
   - **service_role key** (this is your `SUPABASE_SERVICE_ROLE_KEY` - keep this secret!)

### 2.3 Run the SQL Schema

1. In your Supabase project dashboard, go to **SQL Editor**
2. Click "New Query"
3. Copy and paste the entire contents of `supabase/schema.sql`
4. Click "Run" (or press Ctrl/Cmd + Enter)
5. You should see a success message

This SQL will:
- Create a `profiles` table to store user information
- Set up Row Level Security (RLS) policies
- Create triggers to automatically create a profile when a user signs up
- Set up automatic timestamp updates

### 2.4 Configure Google OAuth in Supabase

1. In your Supabase project dashboard, go to **Authentication** → **Providers**
2. Find **Google** in the list and click to enable it
3. **DON'T fill in the credentials yet** - we'll get these from Google Console next
4. For now, note the **Redirect URL** shown in Supabase. It should look like:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```
5. Copy this URL - you'll need it in the next step

### 2.5 Set Up Authentication Redirect URLs

1. In your Supabase dashboard, go to **Authentication** → **URL Configuration**
2. Add your site URLs:
   - **Site URL**: `http://localhost:3000` (for development)
   - **Redirect URLs**:      - `http://localhost:3000/auth/callback`
      - `https://your-production-domain.com/auth/callback` (add your production domain later)

---

## Step 3: Set Up Google Cloud Console

### 3.1 Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click the project dropdown at the top
3. Click "New Project"
4. Enter a project name (e.g., "Soventure Auth")
5. Click "Create"

### 3.2 Enable Google+ API

1. In your Google Cloud project, go to **APIs & Services** → **Library**
2. Search for "Google+ API"
3. Click on it and click "Enable"
4. Also search for and enable "Google Identity Services API" (if available)

### 3.3 Create OAuth 2.0 Credentials

1. Go to **APIs & Services** → **Credentials**
2. Click "Create Credentials" → "OAuth client ID"
3. If prompted, configure the OAuth consent screen first:
   - **User Type**: Choose "External" (unless you have a Google Workspace)
   - Click "Create"
   - Fill in the required information:
     - **App name**: Your app name (e.g., "Soventure")
     - **User support email**: Your email
     - **Developer contact information**: Your email
   - Click "Save and Continue"
   - Add scopes (you can skip this for now or add `email`, `profile`, `openid`)
   - Click "Save and Continue"
   - Add test users if needed (for development)
   - Click "Save and Continue"
   - Review and go back to dashboard

4. Now create the OAuth client ID:
   - **Application type**: Select "Web application"
   - **Name**: Enter a name (e.g., "Soventure Web Client")
   - **Authorized JavaScript origins**:
     - Add: `http://localhost:3000`
     - Add: `https://[your-project-ref].supabase.co` (replace with your Supabase project URL)
   - **Authorized redirect URIs**:
      - Add: `https://[your-project-ref].supabase.co/auth/v1/callback` (the redirect URL from Supabase)
      - Add: `http://localhost:3000/auth/callback` (for local development)
   - Click "Create"

5. Copy your credentials:
   - **Client ID**: Copy this
   - **Client Secret**: Copy this (click "Show" if needed)

### 3.4 Add Credentials to Supabase

1. Go back to your Supabase dashboard
2. Navigate to **Authentication** → **Providers** → **Google**
3. Enable Google provider
4. Paste your **Client ID** and **Client Secret** from Google Cloud Console
5. Click "Save"

---

## Step 4: Configure Environment Variables

1. In your project root, create a file named `.env.local`:

```bash
cp .env.local.example .env.local
```

2. Open `.env.local` and fill in your values:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Replace the values with your actual Supabase credentials from Step 2.2.

**Important**: Never commit `.env.local` to git! It's already in `.gitignore`.

---

## Step 5: Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Step 6: Test the Authentication

1. Navigate to `/signup` or `/login`
2. Try signing up with email/password
3. Try signing in with Google OAuth
4. After successful authentication, you should be redirected to `/dashboard`

---

## How It Works

### Authentication Flow

1. **Email/Password Signup**:
   - User enters email and password on `/signup`
   - Supabase creates the user account
   - An email confirmation is sent (in production)
   - User profile is automatically created via database trigger

2. **Google OAuth Signup/Login**:
   - User clicks "Continue with Google"
   - Redirected to Google's OAuth consent screen
   - After consent, Google redirects back to Supabase
   - Supabase exchanges the code for a session via server-side route handler
   - User profile is automatically created with Google account info
   - Redirected to `/dashboard`

3. **Session Management**:
   - Middleware refreshes the session on each request
   - Protected routes check for authenticated user
   - Session is stored in secure HTTP-only cookies

### Database Schema

The `profiles` table stores additional user information:
- `id`: UUID linked to `auth.users`
- `email`: User's email address
- `full_name`: User's full name (from OAuth or manual entry)
- `avatar_url`: Profile picture URL (from OAuth)
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

---

## Troubleshooting

### Google OAuth Not Working

1. **Check redirect URIs**: Ensure the redirect URI in Google Console exactly matches Supabase's callback URL
2. **Check Supabase settings**: Verify Client ID and Secret are correctly entered
3. **Check OAuth consent screen**: Make sure it's configured and published (or add test users for development)
4. **Check browser console**: Look for error messages

### Email Authentication Issues

1. **Email confirmation**: In development, check Supabase logs for the confirmation link
2. **Password requirements**: Ensure password is at least 6 characters
3. **Check Supabase Auth logs**: Go to Authentication → Logs in Supabase dashboard

### Database Issues

1. **RLS policies**: Ensure Row Level Security is properly configured
2. **Triggers**: Verify the `handle_new_user` trigger is created
3. **Check Supabase logs**: Go to Database → Logs in Supabase dashboard

---

## Production Deployment

When deploying to production:

1. **Update environment variables** with production URLs
2. **Add production redirect URLs** in both:
   - Google Cloud Console (OAuth credentials)
   - Supabase (Authentication → URL Configuration)
3. **Update Site URL** in Supabase to your production domain
4. **Publish OAuth consent screen** in Google Cloud Console (if not already)

---

## Next Steps

- Customize the UI to match your brand
- Add more user profile fields
- Implement additional authentication methods (GitHub, Facebook, etc.)
- Add email templates for better UX
- Set up email notifications

---

## Support

If you encounter any issues:
1. Check the [Supabase Documentation](https://supabase.com/docs)
2. Check the [Next.js Documentation](https://nextjs.org/docs)
3. Review the error logs in Supabase dashboard

Good luck with your project! 🚀
