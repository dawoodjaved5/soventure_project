# Supabase & Google OAuth Setup Guide

This comprehensive guide will walk you through setting up Google OAuth authentication with Supabase and Next.js step-by-step.

---

## 📋 Prerequisites

- Node.js 18+ installed
- A Google account (Gmail)
- A Supabase account ([sign up for free](https://supabase.com))

---

## Part 1: Supabase Setup

### Step 1.1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Click **"Sign In"** or **"Start your project"**
3. Sign in with GitHub (recommended) or email
4. Once logged in, click **"New Project"**
5. Fill in the project details:
   - **Name**: `soventure` (or any name you prefer)
   - **Database Password**: Create a strong password (⚠️ **SAVE THIS!** You'll need it later)
   - **Region**: Choose the region closest to your users (e.g., `West US (North California)`)
   - **Pricing Plan**: Select "Free" (or your preferred plan)
6. Click **"Create new project"**
7. ⏳ Wait 2-3 minutes for your project to be created

### Step 1.2: Get Your Supabase Credentials

1. In your Supabase project dashboard, click on the **⚙️ Settings** icon (bottom left)
2. Click **"API"** in the settings menu
3. You'll see several important values:

   **Copy these values:**
   - **Project URL** (looks like: `https://xxxxxxxxxxxxx.supabase.co`)
     - This is your `NEXT_PUBLIC_SUPABASE_URL`
   - **anon/public key** (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)
     - This is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role key** (keep this secret! Only for admin operations)
     - This is your `SUPABASE_SERVICE_ROLE_KEY` (optional)

   ⚠️ **Important**: Keep these values safe. You'll need them in Step 4.

### Step 1.3: Run the SQL Schema

1. In your Supabase dashboard, click **"SQL Editor"** in the left sidebar
2. Click **"New Query"** button (top right)
3. Open the file `supabase/schema.sql` from your project
4. **Copy the entire contents** of that file
5. **Paste it into the SQL Editor** in Supabase
6. Click **"Run"** button (or press `Ctrl/Cmd + Enter`)
7. You should see a success message: ✅ "Success. No rows returned"

   **What this SQL does:**
   - Creates a `profiles` table to store user information
   - Sets up Row Level Security (RLS) policies for data protection
   - Creates triggers to automatically create profiles when users sign up
   - Sets up automatic timestamp updates

### Step 1.4: Configure Authentication URLs

1. In Supabase dashboard, go to **⚙️ Settings** → **Authentication**
2. Scroll down to **"URL Configuration"** section
3. Set the following:

   **Site URL:**
   ```
   http://localhost:3000
   ```

   **Redirect URLs** (click "Add URL" for each):
   ```
   http://localhost:3000/auth/callback
   ```
   (Add your production URL later: `https://yourdomain.com/auth/callback`)

4. Click **"Save"**

### Step 1.5: Note Your Supabase Callback URL

1. Still in **Authentication** settings, scroll up to **"Auth Providers"**
2. Click on **"Google"** provider
3. **Don't enable it yet!** Just note the **Redirect URL** shown:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```
4. **Copy this URL** - you'll need it in the Google Console setup

---

## Part 2: Google Cloud Console Setup

### Step 2.1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. If you see a project dropdown at the top, click it, then click **"New Project"**
   - If you don't see a dropdown, click **"Select a project"** → **"New Project"**
4. Fill in the project details:
   - **Project name**: `Soventure Auth` (or any name)
   - **Organization**: Leave as default (or select if you have one)
   - **Location**: Leave as default
5. Click **"Create"**
6. Wait a few seconds, then select your new project from the dropdown

### Step 2.2: Configure OAuth Consent Screen

1. In Google Cloud Console, click the **☰ Menu** (top left)
2. Go to **"APIs & Services"** → **"OAuth consent screen"**
3. Select **"External"** (unless you have a Google Workspace account)
4. Click **"Create"**

5. **App Information:**
   - **App name**: `Soventure` (or your app name)
   - **User support email**: Select your email from dropdown
   - **App logo**: (Optional - skip for now)
   - Click **"Save and Continue"**

6. **Scopes:**
   - Click **"Add or Remove Scopes"**
   - Check these scopes:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
     - `openid`
   - Click **"Update"**
   - Click **"Save and Continue"**

7. **Test Users** (for development):
   - Click **"Add Users"**
   - Add your email address (and any test users)
   - Click **"Add"**
   - Click **"Save and Continue"**

8. **Summary:**
   - Review everything
   - Click **"Back to Dashboard"**

   ⚠️ **Note**: Your app will be in "Testing" mode. Only test users can sign in. After you publish it, anyone can use it.

### Step 2.3: Enable Required APIs

1. In Google Cloud Console, go to **"APIs & Services"** → **"Library"**
2. Search for **"Google+ API"**
   - Click on it
   - Click **"Enable"**
3. Search for **"Google Identity Services API"** (if available)
   - Click on it
   - Click **"Enable"**

### Step 2.4: Create OAuth 2.0 Credentials

1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ Create Credentials"** (top of page)
3. Select **"OAuth client ID"**

4. If prompted to configure consent screen, you can skip it (we already did it)

5. **Application type**: Select **"Web application"**

6. **Name**: `Soventure Web Client` (or any name)

7. **Authorized JavaScript origins** - Click **"+ Add URI"** and add:
   ```
   http://localhost:3000
   ```
   ```
   https://[your-project-ref].supabase.co
   ```
   (Replace `[your-project-ref]` with your actual Supabase project reference)

8. **Authorized redirect URIs** - Click **"+ Add URI"** and add:
   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```
   (This is the callback URL you noted from Supabase in Step 1.5)
   
   Also add:
   ```
   http://localhost:3000/auth/callback
   ```
   (For local development)

9. Click **"Create"**

10. **IMPORTANT**: A popup will show your credentials:
    - **Client ID**: Copy this! (looks like: `123456789-abc.apps.googleusercontent.com`)
    - **Client Secret**: Click "Show" and copy this! (looks like: `GOCSPX-xxxxx`)
    
    ⚠️ **Save these somewhere safe!** You'll need them in the next step.

---

## Part 3: Connect Google OAuth to Supabase

### Step 3.1: Add Google Credentials to Supabase

1. Go back to your **Supabase dashboard**
2. Navigate to **⚙️ Settings** → **Authentication** → **Providers**
3. Scroll down and find **"Google"** in the list
4. Click on **"Google"** to expand it
5. **Enable Google provider** by toggling the switch
6. Enter your credentials:
   - **Client ID (for OAuth)**: Paste your Google Client ID
   - **Client Secret (for OAuth)**: Paste your Google Client Secret
7. Click **"Save"**

   ✅ You should see a success message!

---

## Part 4: Configure Environment Variables

### Step 4.1: Create Environment File

1. In your project root directory, create a file named `.env.local`
   (If you're using VS Code, you can create it directly)

2. Add the following content:

```env
# Supabase Configuration
# Get these from: Supabase Dashboard → Settings → API
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

# Optional: Service Role Key (only needed for admin operations)
# SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

3. **Replace the placeholder values:**
   - `NEXT_PUBLIC_SUPABASE_URL`: Use the Project URL from Step 1.2
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Use the anon/public key from Step 1.2

4. Save the file

   ⚠️ **Security**: Never commit `.env.local` to git! It should already be in `.gitignore`

---

## Part 5: Test the Setup

### Step 5.1: Install Dependencies

Open your terminal in the project directory and run:

```bash
npm install
```

### Step 5.2: Start the Development Server

```bash
npm run dev
```

You should see:
```
- ready started server on 0.0.0.0:3000
- Local: http://localhost:3000
```

### Step 5.3: Test Authentication

1. Open [http://localhost:3000](http://localhost:3000) in your browser
2. You should be redirected to the login page
3. Try signing up with Google:
   - Click **"Continue with Google"**
   - Select your Google account
   - Grant permissions
   - You should be redirected back and logged in! ✅

4. Try email/password signup:
   - Go to `/signup`
   - Enter email and password
   - Click "Sign up"
   - Check your email for confirmation (in production)

---

## 📝 Quick Checklist

Before testing, make sure you've completed:

- [ ] Created Supabase project
- [ ] Copied Supabase URL and anon key
- [ ] Ran SQL schema in Supabase SQL Editor
- [ ] Configured authentication URLs in Supabase
- [ ] Created Google Cloud project
- [ ] Configured OAuth consent screen
- [ ] Created OAuth 2.0 credentials in Google Console
- [ ] Added authorized redirect URIs in Google Console
- [ ] Enabled Google provider in Supabase with credentials
- [ ] Created `.env.local` file with Supabase credentials
- [ ] Started development server

---

## 🔧 Troubleshooting

### Google OAuth Not Working?

1. **Check redirect URI matches exactly:**
   - Google Console redirect URI: `https://[project-ref].supabase.co/auth/v1/callback`
   - Must match exactly (no trailing slashes, correct protocol)

2. **Check Supabase callback URL:**
   - In Supabase → Authentication → Providers → Google
   - Verify the callback URL matches what you entered in Google Console

3. **Check OAuth consent screen:**
   - Make sure you added yourself as a test user
   - Or publish the app (for production)

4. **Check browser console:**
   - Open Developer Tools (F12)
   - Look for error messages

### Email Authentication Not Working?

1. **Check Supabase Auth logs:**
   - Go to Supabase → Authentication → Logs
   - Look for error messages

2. **Email confirmation:**
   - In development, check Supabase Auth logs for confirmation links
   - Or disable email confirmation in Supabase settings (for testing)

### Database Errors?

1. **Check SQL was run:**
   - Go to Supabase → Table Editor
   - You should see a `profiles` table

2. **Check RLS policies:**
   - Go to Supabase → Authentication → Policies
   - Verify policies exist for `profiles` table

---

## 🚀 Production Deployment

When deploying to production:

1. **Update Google Console:**
   - Add production domain to Authorized JavaScript origins
   - Add production callback URL to Authorized redirect URIs

2. **Update Supabase:**
   - Add production URL to Site URL
   - Add production callback URL to Redirect URLs

3. **Update environment variables:**
   - Use production Supabase URL
   - Use production app URL

4. **Publish OAuth consent screen:**
   - In Google Console → OAuth consent screen
   - Click "Publish App"

---

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)

---

**Need Help?** Check the error logs in:
- Supabase Dashboard → Logs
- Browser Console (F12)
- Terminal where you're running `npm run dev`

Good luck! 🎉



