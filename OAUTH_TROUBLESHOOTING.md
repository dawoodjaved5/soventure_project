# Google OAuth Troubleshooting Guide

If Google OAuth isn't working (redirects back to signup/login without logging in), check these:

## ✅ Step 1: Verify Supabase Redirect URLs

1. Go to your **Supabase Dashboard**
2. Navigate to **⚙️ Settings** → **Authentication** → **URL Configuration**
3. Make sure these URLs are added:

   **Site URL:**
   ```
   http://localhost:3000
   ```

   **Redirect URLs:**
   ```
   http://localhost:3000/auth/callback
   ```
   
   **Important:** No trailing slashes!

4. Click **"Save"**

## ✅ Step 2: Verify Google Cloud Console Redirect URIs

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Under **"Authorized redirect URIs"**, make sure you have:

   ```
   https://[your-project-ref].supabase.co/auth/v1/callback
   ```

   **Important:** 
   - This MUST be the Supabase callback URL, NOT your app's callback
   - Get this URL from: Supabase Dashboard → Authentication → Providers → Google
   - It should look like: `https://xxxxxxxxxxxxx.supabase.co/auth/v1/callback`

5. Click **"Save"**

## ✅ Step 3: Verify OAuth Consent Screen

1. In Google Cloud Console, go to **APIs & Services** → **OAuth consent screen**
2. Make sure:
   - App is in **"Testing"** mode (for development)
   - Your email is added as a **"Test user"**
   - Scopes include: `email`, `profile`, `openid`
3. If in production, app should be **"Published"**

## ✅ Step 4: Check Browser Console

1. Open **Developer Tools** (F12)
2. Go to **Console** tab
3. Try Google login again
4. Look for any error messages
5. Check the **Network** tab to see if the callback is being called

## ✅ Step 5: Test the Flow

The correct flow should be:

1. User clicks "Continue with Google" on your app
2. Redirected to: `https://accounts.google.com/...`
3. User selects Google account
4. Google redirects to: `https://[your-project-ref].supabase.co/auth/v1/callback?code=...`
5. Supabase processes the OAuth code
6. Supabase redirects to: `http://localhost:3000/auth/callback?code=...`
7. Your app processes the code and creates a session
8. User is redirected to: `http://localhost:3000/`

## 🔍 Common Issues

### Issue: "Redirect URI mismatch"

**Problem:** The redirect URI in Google Console doesn't match Supabase's callback URL

**Solution:**
- Make sure Google Console has: `https://[project-ref].supabase.co/auth/v1/callback`
- NOT: `http://localhost:3000/auth/callback`
- The flow goes: Google → Supabase → Your App

### Issue: User redirected back to signup page

**Problem:** Callback isn't creating a session properly

**Possible causes:**
1. Redirect URL in Supabase Settings doesn't include your callback URL
2. Cookies aren't being set (check browser settings)
3. Callback route has an error

**Solution:**
1. Verify Supabase redirect URLs (Step 1)
2. Check browser console for errors
3. Make sure cookies are enabled
4. Try in an incognito window

### Issue: "Access blocked: This app's request is invalid"

**Problem:** OAuth consent screen not configured or user not added as test user

**Solution:**
1. Go to Google Cloud Console → OAuth consent screen
2. Add yourself as a test user
3. Or publish the app (for production)

### Issue: "Error 400: redirect_uri_mismatch"

**Problem:** The redirect URI in the OAuth request doesn't match what's configured

**Solution:**
- Double-check Step 2 - the Google Console redirect URI must be exactly: `https://[project-ref].supabase.co/auth/v1/callback`
- Check for typos, trailing slashes, or wrong protocol (http vs https)

## 🔧 Debugging Steps

1. **Check if callback is being called:**
   - Add a console.log in `app/auth/callback/route.ts`
   - Or check browser Network tab for `/auth/callback` request

2. **Check Supabase Auth logs:**
   - Go to Supabase Dashboard → Authentication → Logs
   - Look for errors related to OAuth

3. **Test with a simple callback:**
   - Temporarily modify the callback to just return a simple message
   - See if it's even being reached

4. **Check environment variables:**
   - Make sure `NEXT_PUBLIC_SUPABASE_URL` is correct
   - Make sure `NEXT_PUBLIC_SUPABASE_ANON_KEY` is correct

## 📝 Quick Checklist

- [ ] Supabase redirect URL includes: `http://localhost:3000/auth/callback`
- [ ] Google Console redirect URI is: `https://[project-ref].supabase.co/auth/v1/callback`
- [ ] OAuth consent screen has test users added
- [ ] Google OAuth is enabled in Supabase
- [ ] Client ID and Secret are correct in Supabase
- [ ] Browser allows cookies
- [ ] No errors in browser console
- [ ] Environment variables are set correctly

## 🆘 Still Not Working?

1. **Clear browser cache and cookies**
2. **Try in incognito mode**
3. **Check Supabase Auth logs for detailed errors**
4. **Verify all URLs match exactly** (no trailing slashes, correct protocol)
5. **Try creating a new OAuth client in Google Console**

The most common issue is the redirect URI mismatch between Google Console and what Supabase expects!


