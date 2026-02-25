# 🧪 Testing Guide - AutoBot Studio

## Quick Start Testing (5 Minutes)

### Step 1: Start the Server
```bash
cd E:\course-recover\autonomus-frontend\my-app
npm run dev
```

**Should see:**
```
✔ Ready in 2.5s
○ Local: http://localhost:3000
```

---

## 🎯 Critical Path Testing (Must Test First!)

### Test 1: User Signup with Name ✅

**Steps:**
1. Open: `http://localhost:3000/signup`
2. **Check: Name field visible** ✅
3. Fill form:
   ```
   Full name: Ahmed Khan
   Email: test@example.com
   Password: test123
   ```
4. Click "Create Account"
5. **Expected:** Redirect to `/dashboard`
6. **Check:** "Welcome back, Ahmed Khan! 👋" shows
7. **Check:** Email shows below name

**Verify in Supabase:**
```
1. Go to Supabase Dashboard
2. Authentication → Users
3. Click on test@example.com
4. Check User Metadata:
   - name: "Ahmed Khan" ✅
   - full_name: "Ahmed Khan" ✅
```

**Status:** ☐ PASS / ☐ FAIL

---

### Test 2: Admin Panel Access ✅

**Steps:**
1. Open: `http://localhost:3000/admin/login`
2. Login with: `workb9382@gmail.com`
3. **Expected:** Redirect to `/admin/dashboard`
4. **Check:** Sidebar shows on left
5. **Check:** Your name and email in sidebar bottom
6. **Check:** Avatar with first letter in top right
7. **Check:** 🛡️ Admin badge visible

**Sidebar Should Show:**
```
┌─────────────────────┐
│ 🛡️ Admin Panel      │
│    AutoBot Studio   │
├─────────────────────┤
│ Dashboard           │
│ Users               │
│ Agents              │
│ Tickets             │
│ Analytics           │
│ Settings            │
├─────────────────────┤
│ [A] Ahmed           │
│     workb9382@...   │
│ 🛡️ ADMIN ACCESS     │
│ [Logout]            │
└─────────────────────┘
```

**Status:** ☐ PASS / ☐ FAIL

---

### Test 3: Create Agent ✅

**Steps:**
1. Login as regular user
2. Go to: `http://localhost:3000/dashboard`
3. Click "Create New Agent"
4. Fill form:
   ```
   Name: Customer Support Bot
   Description: Helps customers with questions
   Tone: Friendly
   ```
5. Click "Create Agent"
6. **Expected:** Return to dashboard
7. **Check:** New agent appears in "Your Agents" list
8. **Check:** Embed code shows
9. **Check:** Can copy embed code

**Verify in Supabase:**
```
1. Go to Supabase → Table Editor
2. Open "agents" table
3. Check: New agent row exists
4. Check: agent_id generated
5. Check: status = 'active'
6. Check: user_id matches your user
```

**Status:** ☐ PASS / ☐ FAIL

---

### Test 4: Submit Support Ticket ✅

**Steps:**
1. Go to: `http://localhost:3000/support`
2. Fill form:
   ```
   Name: Ahmed Khan
   Email: test@example.com
   Plan: Basic
   Subject: Need help with agents
   Message: How do I create multiple agents?
   ```
3. Click "Submit Support Request"
4. **Expected:** Success message
5. **Check:** Ticket ID shows (TKT-XXXXXXXX)

**Verify Email:**
```
1. Check email: workb9382@gmail.com
2. Should receive: "🎯 New Support Request"
3. Check: Email has ticket details
4. Check: Professional HTML design
```

**Verify in Supabase:**
```
1. Go to Supabase → Table Editor
2. Open "support_tickets" table
3. Check: New ticket row exists
4. Check: ticket_id starts with "TKT-"
5. Check: status = 'open'
6. Check: priority = 'low' (Basic plan)
```

**Status:** ☐ PASS / ☐ FAIL

---

### Test 5: User Reply to Ticket ✅

**Steps:**
1. Login as user who created ticket
2. Go to: `http://localhost:3000/dashboard/my-tickets`
3. **Check:** Ticket appears in list
4. Click "View Conversation & Reply (0)"
5. **Expected:** Ticket expands
6. **Check:** Original message shows
7. Type reply: "I need to create 3 bots for different pages"
8. Click "Send Reply"
9. **Expected:** Success alert
10. **Check:** Reply appears in conversation (blue bubble)

**Verify Email:**
```
1. Check email: workb9382@gmail.com
2. Should receive: "🔔 Customer Reply"
3. Check: Shows customer's reply
4. Check: Link to admin panel
```

**Verify in Supabase:**
```
1. Open "ticket_replies" table
2. Check: New reply row exists
3. Check: sender_type = 'user'
4. Check: sender_email = test@example.com
5. Check: message saved correctly
```

**Status:** ☐ PASS / ☐ FAIL

---

### Test 6: Admin View & Reply to Ticket ✅

**Steps:**
1. Login as admin: `http://localhost:3000/admin/login`
2. Go to: `http://localhost:3000/admin/tickets`
3. **Check:** Professional table layout (NOT cards)
4. **Check:** Cyan/purple theme
5. **Check:** All tickets from all users show
6. Find test ticket
7. **Check:** Reply count shows: 1
8. Click "View" button
9. **Expected:** Modal opens
10. **Check:** Full conversation shows
11. **Check:** User reply visible (blue bubble)
12. **Check:** Admin reply form at bottom
13. Type admin reply: "You can create up to 5 agents on Basic plan."
14. Click "Send Reply"
15. **Expected:** Success alert
16. **Check:** Reply appears (purple with shield icon)

**Verify in Supabase:**
```
1. Open "ticket_replies" table
2. Check: Admin reply row exists
3. Check: sender_type = 'admin'
4. Check: sender_name = 'Support Team'
5. Check: message saved correctly
```

**Verify User Sees Reply:**
```
1. Logout admin
2. Login as test@example.com
3. Go to /dashboard/my-tickets
4. Expand ticket
5. Check: Admin reply shows (purple with 🛡️)
6. Check: Both replies in order
```

**Status:** ☐ PASS / ☐ FAIL

---

### Test 7: Admin User Management ✅

**Steps:**
1. Login as admin
2. Go to: `http://localhost:3000/admin/users`
3. **Check:** Table shows all users
4. **Check:** Names show (NOT "Unknown") ✅
5. **Check:** Emails show below names
6. **Check:** Avatars show first letter
7. **Check:** Plan badges visible
8. **Check:** Agent count per user
9. **Check:** Status (Active/Canceled)

**Search Test:**
```
1. Type "Ahmed" in search
2. Check: Filters by name
3. Type "test@example.com"
4. Check: Filters by email
5. Clear search
6. Check: All users show again
```

**Filter Test:**
```
1. Select "Basic" plan filter
2. Check: Only Basic plan users show
3. Select "All Plans"
4. Check: All users show again
```

**Status:** ☐ PASS / ☐ FAIL

---

## 🎨 UI/UX Testing

### Design Consistency ✅

**User Pages (Blue Theme):**
```
☐ Dashboard: Blue accents
☐ My Tickets: Blue theme, card layout
☐ Support form: Blue buttons
☐ Create Agent: Blue gradient
```

**Admin Pages (Cyan/Purple Theme):**
```
☐ Admin dashboard: Cyan accents
☐ Admin tickets: Table layout, cyan/purple
☐ Admin sidebar: Purple gradient
☐ Admin badges: Amber/cyan
```

**User vs Admin Tickets:**
```
User Tickets:
☐ Card layout
☐ Blue colors
☐ Expandable inline
☐ "My Support Tickets" title

Admin Tickets:
☐ Table layout
☐ Cyan/purple colors
☐ Modal popup
☐ "Admin Support Dashboard" title
☐ Professional appearance
```

---

## 📊 Database Verification

### Check All Tables in Supabase

**1. auth.users table:**
```
☐ New users appear
☐ user_metadata has name field
☐ email verified
```

**2. users table:**
```
☐ User records created
☐ id matches auth.users id
☐ email saved
```

**3. agents table:**
```
☐ Agents saved
☐ agent_id unique
☐ user_id references users
☐ status active/inactive
```

**4. support_tickets table:**
```
☐ Tickets saved
☐ ticket_id format: TKT-XXXXXXXX
☐ status: open/in_progress/resolved/closed
☐ priority based on plan
```

**5. ticket_replies table:**
```
☐ Replies saved
☐ sender_type: user or admin
☐ ticket_id references support_tickets
☐ created_at timestamp
```

**6. subscriptions table:**
```
☐ Subscriptions saved
☐ plan: basic/medium/premium
☐ status: active/canceled
```

---

## 🔍 SQL Verification Queries

**Run these in Supabase SQL Editor:**

**1. Check User Metadata:**
```sql
SELECT
  email,
  raw_user_meta_data->>'name' as name,
  raw_user_meta_data->>'full_name' as full_name,
  created_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 5;
```

**Expected:** All users have name field populated ✅

---

**2. Check Ticket with Replies:**
```sql
SELECT
  t.ticket_id,
  t.subject,
  t.status,
  COUNT(r.id) as reply_count
FROM support_tickets t
LEFT JOIN ticket_replies r ON t.ticket_id = r.ticket_id
GROUP BY t.id, t.ticket_id, t.subject, t.status
ORDER BY t.created_at DESC;
```

**Expected:** Tickets with reply counts ✅

---

**3. Check Admin Activity:**
```sql
SELECT
  sender_type,
  sender_name,
  COUNT(*) as message_count,
  MAX(created_at) as last_activity
FROM ticket_replies
GROUP BY sender_type, sender_name;
```

**Expected:** Shows user and admin replies ✅

---

## ⚡ Performance Testing

**Page Load Times:**
```
☐ Landing page: < 2s
☐ Dashboard: < 1.5s
☐ Admin panel: < 2s
☐ Tickets page: < 2s
```

**API Response Times:**
```
☐ /api/support: < 500ms
☐ /api/support/reply: < 500ms
☐ /api/usage: < 200ms
```

**Database Queries:**
```
☐ Fetch agents: < 100ms
☐ Fetch tickets: < 200ms
☐ Fetch users: < 300ms
```

---

## 🐛 Error Handling Testing

### Test Error Scenarios:

**1. Invalid Login:**
```
☐ Try wrong password
☐ Check: Error message shows
☐ Try non-existent email
☐ Check: Appropriate error
```

**2. Empty Forms:**
```
☐ Submit empty signup form
☐ Check: Validation errors
☐ Submit empty ticket form
☐ Check: Required field errors
```

**3. Network Errors:**
```
☐ Disconnect internet
☐ Try submitting form
☐ Check: Error handling
☐ Reconnect
☐ Check: Can retry
```

**4. Admin Access:**
```
☐ Login as regular user
☐ Try accessing /admin/dashboard
☐ Check: Redirect to /dashboard
☐ Check: Access denied properly
```

---

## 📧 Email Testing Checklist

**Email Configuration:**
```
☐ .env.local has EMAIL_USER
☐ .env.local has EMAIL_PASSWORD (App Password)
☐ .env.local has SUPPORT_EMAIL
☐ Gmail App Password generated
```

**Email Delivery:**
```
☐ New ticket → Admin receives email
☐ User reply → Admin receives email
☐ Emails not in spam folder
☐ HTML formatting correct
☐ Links work in email
```

**Email Content:**
```
☐ Ticket ID in subject line
☐ Customer details visible
☐ Message content shows
☐ Reply-to address correct
☐ Professional design
```

---

## 🎯 Final Verification

### All Features Working:

**Authentication:**
```
✅ User signup with name
✅ User login
✅ Google OAuth
✅ Admin login
✅ Session management
```

**User Features:**
```
✅ Dashboard with name
✅ Create agents
✅ Manage agents
✅ Submit tickets
✅ View own tickets
✅ Reply to tickets
```

**Admin Features:**
```
✅ Admin dashboard
✅ User management (with names!)
✅ Agent management
✅ Ticket management
✅ Reply to tickets
✅ Status updates
```

**Database:**
```
✅ All tables created
✅ Data saving correctly
✅ RLS policies working
✅ User metadata saved
```

**Email:**
```
✅ Notifications sending
✅ HTML formatting
✅ Admin receives emails
```

---

## 📋 Testing Report Template

```
==========================================
TESTING REPORT - AutoBot Studio
Date: _______________
Tester: _______________
==========================================

1. User Signup with Name:       ☐ PASS ☐ FAIL
2. Admin Panel Access:           ☐ PASS ☐ FAIL
3. Create Agent:                 ☐ PASS ☐ FAIL
4. Submit Support Ticket:        ☐ PASS ☐ FAIL
5. User Reply to Ticket:         ☐ PASS ☐ FAIL
6. Admin View & Reply:           ☐ PASS ☐ FAIL
7. Admin User Management:        ☐ PASS ☐ FAIL
8. Email Notifications:          ☐ PASS ☐ FAIL
9. Database Saving:              ☐ PASS ☐ FAIL
10. UI/UX Design:                ☐ PASS ☐ FAIL

OVERALL STATUS: ☐ READY ☐ NEEDS FIXES

NOTES:
_________________________________________
_________________________________________
_________________________________________

BUGS FOUND:
_________________________________________
_________________________________________
_________________________________________
```

---

## 🚨 If Tests Fail:

### "Unknown" showing instead of name:
```
1. Check: Signup form has name field
2. Check: Name saving to user_metadata
3. Run SQL query to verify
4. New signups should work
5. Old users: Name from email part
```

### Tickets not showing:
```
1. Run: SUPPORT_TICKETS_TABLE.sql
2. Run: TICKET_REPLIES_TABLE.sql
3. Check RLS policies
4. Verify table exists
```

### Email not sending:
```
1. Check .env.local
2. Verify Gmail App Password
3. Check EMAIL_USER = workb9382@gmail.com
4. Test SMTP connection
```

### Admin redirect issues:
```
1. Check ADMIN_EMAILS array
2. Verify: workb9382@gmail.com
3. Case-sensitive check
4. Clear cookies and retry
```

---

## ✅ Success Criteria

**Project is ready when:**
```
✅ All 7 critical tests PASS
✅ Names show everywhere (not "Unknown")
✅ Emails deliver to admin
✅ Data saves to Supabase
✅ Admin panel fully functional
✅ User and admin tickets different designs
✅ Conversations work both ways
✅ No console errors
```

---

**Ready to test? Start with Test 1 and go through each one!** 🚀

**Estimated Testing Time:** 30-45 minutes for full suite
