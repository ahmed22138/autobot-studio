# 🔐 Google OAuth Setup - Complete Guide

## ✅ What's Added:

1. **Admin Signup Page** - `/admin/signup`
   - Email/Password signup
   - Google Sign-In button

2. **Admin Login Page** - `/admin/login` (Updated)
   - Email/Password login
   - Google Sign-In button
   - Link to signup page

---

## 🚀 How to Enable Google OAuth:

### **Step 1: Google Cloud Console Setup**

#### **1.1 - Create Google Cloud Project**

1. Go to: https://console.cloud.google.com/
2. Click "Select a Project" → "New Project"
3. Project name: **AutoBot Studio**
4. Click "Create"

#### **1.2 - Enable Google+ API**

1. In your project dashboard
2. Go to "APIs & Services" → "Library"
3. Search for **"Google+ API"**
4. Click it and press **"Enable"**

#### **1.3 - Configure OAuth Consent Screen**

1. Go to "APIs & Services" → "OAuth consent screen"
2. Select **"External"** (for public use)
3. Click **"Create"**

**Fill in details:**
- **App name:** AutoBot Studio Admin
- **User support email:** workb9382@gmail.com
- **Developer contact email:** workb9382@gmail.com
- Click **"Save and Continue"**

**Scopes (Optional):**
- Just click **"Save and Continue"**

**Test users (Optional):**
- Add: workb9382@gmail.com
- Click **"Save and Continue"**

Click **"Back to Dashboard"**

#### **1.4 - Create OAuth 2.0 Credentials**

1. Go to "APIs & Services" → "Credentials"
2. Click **"+ CREATE CREDENTIALS"**
3. Select **"OAuth 2.0 Client IDs"**

**Configure:**
- **Application type:** Web application
- **Name:** AutoBot Studio Admin

**Authorized JavaScript origins:**
```
http://localhost:3000
https://your-domain.com (production)
```

**Authorized redirect URIs:**
```
https://atyjeaegzgtpbdawbjnq.supabase.co/auth/v1/callback
```

**Important:** Replace `atyjeaegzgtpbdawbjnq` with your actual Supabase project ID

4. Click **"Create"**

#### **1.5 - Copy Credentials**

You'll get:
- **Client ID:** something like `123456789-abcdefg.apps.googleusercontent.com`
- **Client secret:** something like `GOCSPX-abcdefghijklmnop`

**Copy both!** You'll need them in the next step.

---

### **Step 2: Supabase Configuration**

#### **2.1 - Open Supabase Dashboard**

1. Go to: https://supabase.com/dashboard
2. Select your project: `atyjeaegzgtpbdawbjnq`

#### **2.2 - Enable Google Provider**

1. Go to **"Authentication"** (left sidebar)
2. Click **"Providers"**
3. Find **"Google"** in the list
4. Click to expand

#### **2.3 - Add Google Credentials**

**Enable Google:**
- Toggle **"Enable Sign in with Google"** to ON

**Paste your credentials:**
- **Google Client ID:** (paste from Step 1.5)
- **Google Client Secret:** (paste from Step 1.5)

**Authorized Client IDs (optional):**
- Leave empty for now

Click **"Save"**

---

### **Step 3: Add to .env.local (Optional)**

Open `.env.local` and add:

```env
# Google OAuth (optional - already configured in Supabase)
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

This is optional since Supabase handles it.

---

### **Step 4: Test Google Sign-In**

#### **4.1 - Start Your Server**

```bash
npm run dev
```

#### **4.2 - Test Admin Signup**

1. Go to: `http://localhost:3000/admin/signup`
2. Click **"Continue with Google"** button
3. Choose your Google account
4. Allow permissions
5. You'll be redirected to `/admin/dashboard`

#### **4.3 - Test Admin Login**

1. Logout (if logged in)
2. Go to: `http://localhost:3000/admin/login`
3. Click **"Continue with Google"** button
4. Should login and redirect to dashboard

---

## 🎯 Admin Email Check (Important!)

### **After Google Login, Check Email:**

The code still checks if user email is in admin list:

```javascript
const ADMIN_EMAILS = ["workb9382@gmail.com"];
```

**To add more Google admin emails:**

1. Open: `app/admin/layout.tsx`
2. Find: `const ADMIN_EMAILS`
3. Add emails:
```javascript
const ADMIN_EMAILS = [
  "workb9382@gmail.com",
  "another-admin@gmail.com",
  "boss@company.com",
];
```

4. Also update in:
   - `app/admin/login/page.tsx`
   - `app/admin/signup/page.tsx`

---

## 📋 Complete Flow:

### **Signup Flow:**
```
User clicks "Continue with Google"
    ↓
Redirects to Google
    ↓
User selects account & allows
    ↓
Google redirects back to app
    ↓
Supabase creates user account
    ↓
Check if email in ADMIN_EMAILS
    ↓
If YES → /admin/dashboard ✅
If NO → /dashboard (user dashboard) ✅
```

### **Login Flow:**
```
User clicks "Continue with Google"
    ↓
Redirects to Google
    ↓
User selects account
    ↓
Google redirects back
    ↓
Supabase authenticates
    ↓
Check if email in ADMIN_EMAILS
    ↓
If YES → /admin/dashboard ✅
If NO → /dashboard ✅
```

---

## 🔐 Security:

### **Email Verification:**
```javascript
// Only these emails can access admin panel
const ADMIN_EMAILS = ["workb9382@gmail.com"];

// After Google login:
if (!ADMIN_EMAILS.includes(user.email)) {
  router.push("/dashboard"); // Regular user
} else {
  router.push("/admin/dashboard"); // Admin
}
```

### **Multiple Security Layers:**
1. ✅ Google OAuth authentication
2. ✅ Supabase session management
3. ✅ Admin email whitelist
4. ✅ Protected routes
5. ✅ Auto-redirect non-admins

---

## 🎨 UI Updates:

### **Login Page:**
```
┌─────────────────────────────────┐
│   🛡️ Admin Panel                │
│   AutoBot Studio - Secure       │
├─────────────────────────────────┤
│ [🔵 Continue with Google]       │
│                                 │
│ ──── Or continue with email ─── │
│                                 │
│ Admin Email: [_______________]  │
│ Password:    [_______________]  │
│ [Sign In as Admin]              │
│                                 │
│ Don't have account? Create      │
└─────────────────────────────────┘
```

### **Signup Page:**
```
┌─────────────────────────────────┐
│   🛡️ Create Admin Account       │
│   AutoBot Studio                │
├─────────────────────────────────┤
│ [🔵 Continue with Google]       │
│                                 │
│ ──── Or continue with email ─── │
│                                 │
│ Name:            [___________]  │
│ Admin Email:     [___________]  │
│ Password:        [___________]  │
│ Confirm Password:[___________]  │
│ [Create Admin Account]          │
│                                 │
│ Already have account? Sign In   │
└─────────────────────────────────┘
```

---

## ✅ Testing Checklist:

```
Setup:
☐ Google Cloud project created
☐ OAuth consent screen configured
☐ OAuth 2.0 credentials created
☐ Client ID & Secret copied
☐ Supabase Google provider enabled
☐ Credentials added to Supabase

Testing:
☐ Google signup works
☐ Google login works
☐ Email/password signup works
☐ Email/password login works
☐ Admin email check working
☐ Redirect to dashboard working
☐ Non-admin users go to /dashboard
☐ Admin users go to /admin/dashboard
```

---

## 🐛 Troubleshooting:

### **"Access blocked" from Google:**
- Make sure app is in "Testing" mode in OAuth consent screen
- Add your email to test users

### **Redirect URI mismatch:**
- Check Supabase project URL is correct
- Make sure redirect URI in Google Console matches exactly

### **"User not authorized":**
- Check email is in ADMIN_EMAILS list
- Check spelling of email

### **Infinite redirect loop:**
- Clear browser cookies
- Try incognito mode
- Check admin email list

---

## 📝 Summary:

```
✅ Admin signup page created
✅ Google OAuth button added
✅ Email/password signup works
✅ Admin login updated with Google
✅ Security checks in place
✅ Auto-redirect based on email
✅ Beautiful UI with Google button
```

---

## 🎯 Next Steps:

1. **Setup Google OAuth** (follow Step 1 & 2)
2. **Test signup with Google**
3. **Test login with Google**
4. **Add more admin emails if needed**
5. **Deploy to production**
6. **Update redirect URIs for production domain**

---

**Google OAuth is now ready to use!** 🎉

Login: `http://localhost:3000/admin/login`
Signup: `http://localhost:3000/admin/signup`

Both support Google + Email/Password!
