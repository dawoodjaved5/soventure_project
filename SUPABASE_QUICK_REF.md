# ⚡ Quick Reference: Supabase Setup

## 🎯 3-Step Setup

### 1️⃣ Run Master Schema
```
File: supabase/MASTER_SCHEMA.sql
Where: Supabase Dashboard → SQL Editor
Action: Copy all → Paste → Run
Time: 2 minutes
```

### 2️⃣ Create Storage Bucket
```
Where: Supabase Dashboard → Storage
Action: Create bucket named "resumes"
Settings: Private, 10MB limit, PDF only
Time: 1 minute
```

### 3️⃣ Set Storage Policies
```
File: supabase/STORAGE_POLICIES.sql
Where: Supabase Dashboard → SQL Editor
Action: Copy all → Paste → Run
Time: 1 minute
```

---

## ✅ Verification Checklist

After setup, verify:

- [ ] 5 tables created (profiles, job_matches, interview_history, job_search_analytics, scraping_cache)
- [ ] RLS enabled on all tables
- [ ] Storage bucket "resumes" exists
- [ ] Storage policies created
- [ ] Test user can sign up
- [ ] Profile auto-created on signup
- [ ] Can upload PDF to storage

---

## 📊 What You Get

### Tables:
1. **profiles** - User data + resume info
2. **job_matches** - AI job matches
3. **interview_history** - Interview prep
4. **job_search_analytics** - User metrics
5. **scraping_cache** - Performance cache

### Security:
- ✅ Row Level Security (RLS)
- ✅ User-specific data isolation
- ✅ Google Auth preserved
- ✅ Secure file storage

### Auto-Features:
- ✅ Profile creation on signup
- ✅ Analytics tracking
- ✅ Timestamp updates
- ✅ Cache management

---

## 🔧 Quick Fixes

### "Table already exists"
→ OK! Schema uses IF NOT EXISTS

### "Policy already exists"
→ Schema drops old policies first

### Upload fails
→ Check bucket exists, user authenticated, file is PDF

### RLS blocking queries
→ Make sure user is logged in

---

## 📝 Quick SQL Queries

**View all tables:**
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';
```

**Check RLS:**
```sql
SELECT tablename, rowsecurity FROM pg_tables 
WHERE schemaname = 'public';
```

**View policies:**
```sql
SELECT tablename, policyname FROM pg_policies 
WHERE schemaname = 'public';
```

**Count users:**
```sql
SELECT COUNT(*) FROM profiles;
```

**View recent jobs:**
```sql
SELECT * FROM job_matches ORDER BY date_found DESC LIMIT 10;
```

---

## 🎯 Next Steps

1. ✅ Database setup (DONE!)
2. ⏳ Deploy Edge Functions
3. ⏳ Test frontend integration
4. ⏳ End-to-end testing

---

## 📞 Files Reference

- `MASTER_SCHEMA.sql` - Main database schema
- `STORAGE_POLICIES.sql` - Resume upload policies
- `SUPABASE_SETUP_GUIDE.md` - Detailed guide
- `PROJECT_STATUS_AND_PLAN.md` - Implementation plan

---

**Total Setup Time: ~5 minutes**
**Difficulty: Easy**
**Status: Production Ready**

🚀 You're all set!
