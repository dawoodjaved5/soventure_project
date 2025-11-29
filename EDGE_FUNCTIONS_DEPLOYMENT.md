# 🚀 Edge Functions Deployment Guide

## Prerequisites

1. **Supabase CLI installed**
   ```bash
   npm install -g supabase
   ```

2. **Logged in to Supabase**
   ```bash
   supabase login
   ```

3. **Project linked**
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```
   Get your PROJECT_REF from: Supabase Dashboard → Settings → General → Reference ID

---

## 📦 Deploy All Functions

### Step 1: Set Environment Secrets

```bash
# Set OpenAI API Key
supabase secrets set OPENAI_API_KEY=sk-your-openai-key-here

# Verify secrets are set
supabase secrets list
```

### Step 2: Deploy Functions

Deploy all three functions at once:

```bash
# Deploy all functions
supabase functions deploy parse_resume
supabase functions deploy discover_jobs
supabase functions deploy interview_generator

# Or deploy all at once
supabase functions deploy
```

### Step 3: Verify Deployment

```bash
# List all deployed functions
supabase functions list

# Check function logs
supabase functions logs parse_resume
supabase functions logs discover_jobs
supabase functions logs interview_generator
```

---

## 🧪 Testing Functions

### Test 1: Parse Resume Function

```bash
# Using curl
curl -i --location --request POST \
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/parse_resume' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "resumeUrl": "https://your-storage-url/resume.pdf",
    "userId": "user-uuid-here"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "skills": ["React", "Node.js", "Python"],
    "experience": [...],
    "education": [...],
    "summary": "..."
  },
  "message": "Resume parsed successfully"
}
```

### Test 2: Discover Jobs Function

```bash
curl -i --location --request POST \
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/discover_jobs' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "userId": "user-uuid-here",
    "query": "React developer"
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "jobsFound": 15,
  "message": "Found 15 matching jobs"
}
```

### Test 3: Interview Generator Function

```bash
curl -i --location --request POST \
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/interview_generator' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{
    "userId": "user-uuid-here",
    "company": "Google",
    "role": "Senior Software Engineer",
    "techStack": ["React", "Node.js", "Kubernetes"]
  }'
```

**Expected Response:**
```json
{
  "success": true,
  "questions": [
    {
      "question": "...",
      "type": "technical",
      "difficulty": "medium",
      "answer": "...",
      "explanation": "..."
    }
  ],
  "companyInfo": {...},
  "message": "Generated 18 interview questions"
}
```

---

## 🔍 Monitoring & Debugging

### View Real-time Logs

```bash
# Follow logs in real-time
supabase functions logs parse_resume --follow
supabase functions logs discover_jobs --follow
supabase functions logs interview_generator --follow
```

### Check Function Status

```bash
# Get function details
supabase functions inspect parse_resume
supabase functions inspect discover_jobs
supabase functions inspect interview_generator
```

### Common Issues & Solutions

#### Issue 1: "OpenAI API key not configured"
**Solution:**
```bash
supabase secrets set OPENAI_API_KEY=your-key
supabase functions deploy
```

#### Issue 2: "CORS error"
**Solution:** CORS headers are already configured in the functions. Make sure you're calling from an allowed origin.

#### Issue 3: "Database connection failed"
**Solution:** Verify RLS policies are set correctly and user is authenticated.

#### Issue 4: "Function timeout"
**Solution:** Edge Functions have a 60-second timeout. For long-running tasks:
- Optimize scraping (use caching)
- Reduce number of API calls
- Process in batches

---

## 📊 Performance Optimization

### 1. Enable Caching

The `discover_jobs` function already implements caching:
- Cache duration: 24 hours
- Cache key: Based on user ID and search query
- Automatic cache cleanup

### 2. Rate Limiting

To avoid hitting API limits:
- Batch AI requests (max 5 at a time)
- Add delays between batches (1 second)
- Use caching aggressively

### 3. Error Handling

All functions include:
- Try-catch blocks
- Detailed error logging
- Graceful fallbacks
- User-friendly error messages

---

## 🔐 Security Best Practices

### 1. Environment Variables

Never hardcode:
- API keys
- Database credentials
- Service role keys

Always use:
```bash
supabase secrets set KEY_NAME=value
```

### 2. RLS Policies

Ensure all database tables have RLS enabled:
```sql
alter table profiles enable row level security;
alter table job_matches enable row level security;
alter table interview_history enable row level security;
```

### 3. Input Validation

All functions validate:
- Required parameters
- User authentication
- Data types

---

## 📈 Scaling Considerations

### Current Limits (Free Tier)

- **Function Invocations:** 500,000/month
- **Function Duration:** 60 seconds max
- **Database Rows:** Unlimited
- **Storage:** 1 GB

### When to Upgrade

Consider upgrading if:
- More than 500K function calls/month
- Need longer execution time
- Require more storage

---

## 🎯 Production Checklist

- [ ] All functions deployed successfully
- [ ] Secrets configured (OpenAI API key)
- [ ] Database tables created
- [ ] RLS policies enabled
- [ ] Storage bucket created
- [ ] Functions tested with real data
- [ ] Error handling verified
- [ ] Logs monitored
- [ ] Performance optimized
- [ ] Security reviewed

---

## 🚨 Emergency Procedures

### Rollback a Function

```bash
# List function versions
supabase functions list --version

# Rollback to previous version
supabase functions deploy parse_resume --version VERSION_ID
```

### Disable a Function

```bash
# Delete function (can be redeployed later)
supabase functions delete parse_resume
```

### Check Function Health

```bash
# View recent errors
supabase functions logs parse_resume --limit 100 | grep ERROR

# Monitor response times
supabase functions logs discover_jobs --limit 100 | grep "duration"
```

---

## 📞 Support Resources

- **Supabase Docs:** https://supabase.com/docs/guides/functions
- **Edge Functions Examples:** https://github.com/supabase/supabase/tree/master/examples/edge-functions
- **Community:** https://github.com/supabase/supabase/discussions

---

## 🎉 Deployment Complete!

Your Edge Functions are now live and ready to power your hackathon project!

**Function URLs:**
- Parse Resume: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/parse_resume`
- Discover Jobs: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/discover_jobs`
- Interview Generator: `https://YOUR_PROJECT_REF.supabase.co/functions/v1/interview_generator`

**Next Steps:**
1. Test each function with real data
2. Monitor logs for any errors
3. Optimize based on performance metrics
4. Deploy your frontend to Vercel
5. Demo your complete application!

Good luck with your hackathon! 🚀
