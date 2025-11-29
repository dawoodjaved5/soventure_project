# ⚡ Quick Setup Guide - Get Your App Running in 5 Minutes

## 🚨 Important: Configure Environment Variables First!

Your app needs Supabase credentials to run. Follow these steps:

### Step 1: Get Supabase Credentials (2 minutes)

1. **Go to Supabase Dashboard**
   - Visit: https://supabase.com/dashboard
   - Sign in or create account

2. **Create/Select Project**
   - Click "New Project" or select existing project
   - Wait for project to be ready (~2 minutes for new projects)

3. **Get API Keys**
   - Go to: **Settings** → **API**
   - Copy these values:
     - **Project URL** (looks like: `https://xxxxx.supabase.co`)
     - **anon public** key (long string starting with `eyJ...`)

### Step 2: Update .env.local (1 minute)

Open `.env.local` file and replace the placeholder values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-actual-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-actual-anon-key-here
```

**Example:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://abcdefgh.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Step 3: Run the App (1 minute)

```bash
npm run dev
```

Open: http://localhost:3000

---

## ✅ Verification Checklist

After starting the app, you should see:

- ✅ No Supabase errors in terminal
- ✅ Login/Signup pages load
- ✅ Can create account
- ✅ Dashboard loads after login

---

## 🎨 What's Been Built

### Frontend Pages (All Complete!)
1. **Dashboard** - 6 interactive charts
   - Skills Radar Chart
   - Job Scores Bar Chart
   - Activity Area Chart
   - Progress Radial Chart
   - Score Distribution Pie Chart
   - Interview Timeline Line Chart

2. **Upload Resume** - PDF upload & AI parsing
3. **Job Discovery** - AI-powered job matching
4. **Interview Prep** - Company-specific questions

### Design Features
- ✨ Premium gradient backgrounds
- 💫 Smooth animations
- 📊 6 different chart types
- 🎨 Responsive design
- ⚡ Interactive hover effects

---

## 🔧 Troubleshooting

### Error: "Your project's URL and Key are required"
**Solution:** Update `.env.local` with real Supabase credentials

### Error: "Failed to fetch"
**Solution:** 
1. Check internet connection
2. Verify Supabase project is active (not paused)
3. Confirm API keys are correct

### Charts not showing data
**Solution:** This is normal! Charts will populate when you:
1. Upload a resume
2. Discover jobs
3. Generate interview questions

---

## 📊 Testing the UI

### Without Backend (Just UI)
The frontend will load and show:
- Empty states with helpful messages
- All UI components and layouts
- Navigation and routing
- Beautiful design and animations

### With Backend (Full Functionality)
After setting up Supabase Edge Functions:
- Resume parsing works
- Job discovery finds matches
- Interview questions generate
- Charts populate with real data

---

## 🚀 Next Steps

### For Demo/Testing:
1. ✅ Configure `.env.local` (DONE ABOVE)
2. ✅ Run `npm run dev`
3. ✅ Test UI navigation
4. ⏳ Set up Supabase database (see SUPABASE_COMPLETE_SETUP.md)
5. ⏳ Deploy Edge Functions (see EDGE_FUNCTIONS_DEPLOYMENT.md)

### For Production:
1. Deploy to Vercel
2. Add production environment variables
3. Test end-to-end flows
4. Prepare demo

---

## 📞 Need Help?

### Documentation Files:
- `SUPABASE_COMPLETE_SETUP.md` - Backend setup
- `EDGE_FUNCTIONS_DEPLOYMENT.md` - Deploy functions
- `HACKATHON_GUIDE.md` - Demo preparation
- `FRONTEND_README.md` - Frontend details

### Common Issues:
1. **App won't start** → Check `.env.local` has real values
2. **Login fails** → Verify Supabase project is active
3. **Charts empty** → Normal without data, add some!

---

## 🎉 You're Ready!

Once `.env.local` is configured, your beautiful frontend is ready to use!

**The UI is production-ready and will WOW judges! 🏆**

---

**Quick Command Reference:**
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

**Access your app:** http://localhost:3000
