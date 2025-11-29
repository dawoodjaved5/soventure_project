# SQL Schema Information

## 📋 Complete SQL Code for Supabase

The SQL schema file is located at: `supabase/schema.sql`

This SQL file contains everything you need to set up your database for authentication with Google OAuth.

---

## 🔍 What the SQL Does

### 1. **Enables UUID Extension**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
```
- Allows generating unique UUIDs for user IDs

### 2. **Creates Profiles Table**
```sql
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);
```
- Stores user profile information
- Links to Supabase's built-in `auth.users` table
- Automatically deletes when user is deleted

### 3. **Creates Indexes**
- Index on `email` for faster lookups
- Index on `created_at` for sorting

### 4. **Enables Row Level Security (RLS)**
- Users can only see and edit their own profiles
- Prevents unauthorized access to other users' data

### 5. **Creates Automatic Profile Creation**
- When a user signs up (email or Google), a profile is automatically created
- Extracts name and avatar from Google OAuth data

### 6. **Automatic Timestamp Updates**
- `updated_at` field automatically updates when profile is modified

---

## 📝 How to Run the SQL

### Method 1: Supabase Dashboard (Recommended)

1. Go to your Supabase project dashboard
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New Query"**
4. Open the file `supabase/schema.sql` from this project
5. Copy the entire contents
6. Paste into the SQL Editor
7. Click **"Run"** (or press `Ctrl/Cmd + Enter`)
8. You should see: ✅ "Success. No rows returned"

### Method 2: Supabase CLI

If you have Supabase CLI installed:

```bash
supabase db push
```

---

## ✅ Verification

After running the SQL, verify it worked:

1. Go to Supabase Dashboard → **"Table Editor"**
2. You should see a `profiles` table
3. Check the columns match the schema above

To check RLS policies:

1. Go to Supabase Dashboard → **"Authentication"** → **"Policies"**
2. You should see policies for the `profiles` table:
   - "Users can view own profile"
   - "Users can update own profile"
   - "Users can insert own profile"

---

## 🔧 Troubleshooting

### Error: "relation already exists"

If you get this error, the table already exists. You can either:

1. **Drop and recreate** (⚠️ deletes all data):
   ```sql
   DROP TABLE IF EXISTS public.profiles CASCADE;
   ```
   Then run the full schema again.

2. **Use IF NOT EXISTS** - The schema already includes `IF NOT EXISTS` clauses, so you can safely re-run it.

### Error: "permission denied"

Make sure you're running the SQL as a user with proper permissions. The Supabase dashboard SQL Editor runs with appropriate permissions automatically.

### Error: "trigger already exists"

The schema includes `DROP TRIGGER IF EXISTS` statements, so this shouldn't happen. If it does, you can manually drop triggers:

```sql
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP TRIGGER IF EXISTS on_profile_updated ON public.profiles;
```

---

## 📊 Database Structure

```
auth.users (Supabase built-in)
    ↓ (referenced by)
public.profiles
    ├── id (FK → auth.users.id)
    ├── email
    ├── full_name
    ├── avatar_url
    ├── created_at
    └── updated_at
```

---

## 🔐 Security Features

1. **Row Level Security (RLS)**: Users can only access their own data
2. **Cascade Delete**: If a user is deleted from `auth.users`, their profile is automatically deleted
3. **Secure Functions**: Trigger functions use `SECURITY DEFINER` for safe execution

---

## 🎯 What Happens on Signup

When a user signs up (email or Google OAuth):

1. Supabase creates a record in `auth.users`
2. The `on_auth_user_created` trigger fires
3. The `handle_new_user()` function runs
4. A new profile is created in `public.profiles` with:
   - User ID from `auth.users`
   - Email from `auth.users`
   - Full name from OAuth metadata (if Google signup)
   - Avatar URL from OAuth metadata (if Google signup)

---

## 📝 Customization

You can extend the `profiles` table to add more fields:

```sql
ALTER TABLE public.profiles
ADD COLUMN phone_number TEXT,
ADD COLUMN bio TEXT,
ADD COLUMN location TEXT;
```

Just make sure to update the `handle_new_user()` function to populate these fields if needed.

---

## 📚 Related Files

- `supabase/schema.sql` - The complete SQL schema
- `types/database.types.ts` - TypeScript types for the database (auto-generated)
- `SUPABASE_SETUP.md` - Complete setup guide

---

For more information, see the [Supabase Documentation](https://supabase.com/docs/guides/database).



