# 🎯 Setup Summary - Quick Reference

## SQL Code for Supabase

The complete SQL code is in: **`supabase/schema.sql`**

**To run it:**
1. Go to Supabase Dashboard → SQL Editor
2. Copy the entire contents of `supabase/schema.sql`
3. Paste and click "Run"

---

## 📋 Exact Steps Checklist

### Supabase Dashboard Steps

1. ✅ Create new project at [supabase.com](https://supabase.com)
2. ✅ Get credentials: Settings → API → Copy URL and anon key
3. ✅ Run SQL: SQL Editor → Copy/paste `supabase/schema.sql` → Run
4. ✅ Configure Auth URLs: Authentication → URL Configuration
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`
5. ✅ Note callback URL: Authentication → Providers → Google
   - Copy: `https://[project-ref].supabase.co/auth/v1/callback`

### Google Cloud Console Steps

1. ✅ Create project at [console.cloud.google.com](https://console.cloud.google.com)
2. ✅ Configure OAuth consent screen:
   - Type: External
   - App name: Your app name
   - Add scopes: email, profile, openid
   - Add test users (your email)
3. ✅ Create OAuth 2.0 Client ID:
   - Type: Web application
   - Authorized JavaScript origins:
     - `http://localhost:3000`
     - `https://[project-ref].supabase.co`
   - Authorized redirect URIs:
     - `https://[project-ref].supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback`
4. ✅ Copy Client ID and Client Secret

### Connect Google to Supabase

1. ✅ Go to Supabase → Authentication → Providers → Google
2. ✅ Enable Google provider
3. ✅ Paste Client ID and Client Secret
4. ✅ Save

### Local Environment

1. ✅ Create `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://[project-ref].supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=[your-anon-key]
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

2. ✅ Install and run:
   ```bash
   npm install
   npm run dev
   ```

---

## 🔗 Important URLs to Save

**From Supabase:**
- Project URL: `https://[project-ref].supabase.co`
- Anon Key: `eyJhbGci...` (starts with eyJ)
- Callback URL: `https://[project-ref].supabase.co/auth/v1/callback`

**From Google Console:**
- Client ID: `123456789-abc.apps.googleusercontent.com`
- Client Secret: `GOCSPX-xxxxx`

---

## 📚 Detailed Guides

- **New to this?** → Read [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) (complete step-by-step)
- **Quick setup?** → Read [QUICK_START.md](./QUICK_START.md)
- **SQL details?** → Read [SQL_SCHEMA_INFO.md](./SQL_SCHEMA_INFO.md)
- **Technical ref?** → Read [SETUP_GUIDE.md](./SETUP_GUIDE.md)

---

## ✅ Test Your Setup

1. Start dev server: `npm run dev`
2. Visit: http://localhost:3000
3. Click "Continue with Google"
4. Sign in with your Google account
5. Should redirect to `/dashboard` ✅

If it works, you're all set! 🎉



