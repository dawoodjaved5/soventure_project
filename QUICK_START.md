# 🚀 Quick Start Guide

Get your Next.js + Supabase + Google Auth project running in 5 minutes!

## ⚡ Fast Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Supabase Quick Setup

1. **Create Project**: Go to [supabase.com](https://supabase.com) → New Project
2. **Get Credentials**: Settings → API → Copy URL and anon key
3. **Run SQL**: SQL Editor → Copy/paste contents of `supabase/schema.sql` → Run
4. **Configure Auth URLs**: Settings → Authentication → URL Configuration
   - Site URL: `http://localhost:3000`
   - Redirect URLs: `http://localhost:3000/auth/callback`

### 4. Google OAuth Quick Setup

1. **Google Cloud Console**: [console.cloud.google.com](https://console.cloud.google.com)
   - Create Project → OAuth consent screen → Create OAuth 2.0 Client ID
   - Application type: Web application
   - Authorized redirect URI: `https://[your-project-ref].supabase.co/auth/v1/callback`

2. **Add to Supabase**: Settings → Authentication → Providers → Google
   - Enable Google
   - Paste Client ID and Client Secret
   - Save

### 5. Run the App

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) 🎉

---

## 📖 Detailed Setup

For detailed step-by-step instructions with screenshots and troubleshooting, see:

- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Complete setup guide
- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Additional technical details

---

## 📁 Project Structure

```
soventure/
├── app/
│   ├── auth/
│   │   └── callback/        # OAuth callback handler
│   ├── dashboard/           # Protected dashboard page
│   ├── login/              # Login page
│   ├── signup/             # Signup page
│   └── page.tsx            # Home page (redirects)
├── components/
│   └── LogoutButton.tsx    # Logout component
├── utils/
│   └── supabase/
│       ├── client.ts       # Browser Supabase client
│       ├── server.ts       # Server Supabase client
│       └── middleware.ts   # Session middleware
├── supabase/
│   └── schema.sql          # Database schema
└── middleware.ts           # Next.js middleware
```

---

## 🔑 Key Features

✅ Google OAuth authentication  
✅ Email/password authentication  
✅ Beautiful, modern UI  
✅ Protected routes with middleware  
✅ Automatic profile creation  
✅ Row Level Security (RLS)  
✅ Type-safe with TypeScript  

---

## 🆘 Need Help?

Check the detailed guides:
- [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) - Complete setup
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Technical reference



