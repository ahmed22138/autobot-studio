# 🧪 Chatbot Test Conversation - Step by Step

## 📅 Date: 2026-02-17

---

## 🎯 **TEST SCENARIO: Auto Support Ticket**

### **Conversational Flow Test**

Chatbot will ask step-by-step:
1. ✅ Name
2. ✅ Email
3. ✅ Plan (Basic/Medium/Premium)
4. ✅ Problem description
5. ✅ Create ticket automatically

---

## 💬 **EXACT CONVERSATION:**

### **Step 1: Start Support Request**

**You type:**
```
I need help with support ticket
```

**Chatbot responds:**
```
I'll help you submit a support ticket! 📝

Let's start:

**What is your name?**
```

---

### **Step 2: Provide Name**

**You type:**
```
Rahul Kumar
```

**Chatbot responds:**
```
Nice to meet you, Rahul Kumar! 👋

What is your email address?
```

---

### **Step 3: Provide Email**

**You type:**
```
rahul@company.com
```

**Chatbot responds:**
```
Got it! Email: rahul@company.com ✅

Which plan are you currently using?
- Basic (Free)
- Medium ($29/month)
- Premium ($99/month)
```

---

### **Step 4: Provide Plan**

**You type:**
```
Medium
```

**Chatbot responds:**
```
Perfect! You're on the **Medium** plan.

Now, please describe your problem or issue in detail:
```

---

### **Step 5: Describe Problem**

**You type:**
```
My agent is not responding to customer messages for the last 2 days
```

**Chatbot responds:**
```
Thank you for the details!

📝 **Creating your support ticket...**

Please wait a moment... ⏳
```

**Then immediately:**
```
✅ **Support Ticket Created Successfully!**

📋 **Ticket Details:**
- Ticket ID: #47
- Name: Rahul Kumar
- Email: rahul@company.com
- Plan: Medium
- Status: Open
- Priority: Medium

📧 **Next Steps:**
Our support team will review your ticket and respond within 24 hours to **rahul@company.com**

You can track your ticket status in the Support section of your dashboard.

Is there anything else I can help you with?
```

---

## ✅ **VERIFICATION:**

### **1. Check Support Tickets Page:**
```
URL: http://localhost:3000/support

Expected:
✅ New ticket appears
✅ Ticket #47 visible
✅ Name: Rahul Kumar
✅ Email: rahul@company.com
✅ Subject: "Support Request - Medium Plan"
✅ Message: "My agent is not responding..."
✅ Status: Open
✅ Priority: Medium
```

---

### **2. Check Supabase Database:**
```
Table: support_tickets

Expected fields:
✅ id: 47
✅ name: Rahul Kumar
✅ email: rahul@company.com
✅ subject: Support Request - Medium Plan
✅ message: My agent is not responding to customer messages for the last 2 days
✅ status: open
✅ priority: medium
✅ created_at: [recent timestamp]
```

---

### **3. Check Chatbot Conversations:**
```
URL: http://localhost:3000/admin/chatbot

Expected:
✅ Full conversation saved
✅ 5 message pairs (10 messages total)
✅ Final message has action_type: "ticket_created"
✅ action_data contains ticket_id: 47
```

---

## 🚀 **QUICK TEST (All at Once)**

You can also provide everything in one message:

**You type:**
```
I need support. My name is Sarah Johnson, email sarah@test.com, I'm on Premium plan, my problem is the chatbot embed code is not working on my website
```

**Chatbot responds:**
```
I'll help you create a support ticket!

📝 **Details I captured:**
- Name: Sarah Johnson
- Email: sarah@test.com
- Problem: my problem is the chatbot embed code is not working on my website

I'm creating your support ticket now... ✅

[Then creates ticket immediately]

✅ **Support Ticket Created Successfully!**

📋 **Ticket Details:**
- Ticket ID: #48
- Name: Sarah Johnson
- Email: sarah@test.com
- Plan: Premium
- Status: Open
- Priority: Medium

📧 **Next Steps:**
Our support team will review your ticket and respond within 24 hours to **sarah@test.com**

You can track your ticket status in the Support section of your dashboard.

Is there anything else I can help you with?
```

---

## 🧪 **TEST VARIATIONS:**

### **Test 1: Minimal Info (Step-by-Step)**
```
User: "I have a problem"
Bot: "What is your name?"
User: "John"
Bot: "What is your email?"
User: "john@test.com"
Bot: "Which plan?"
User: "Basic"
Bot: "Describe problem:"
User: "Login not working"
Bot: [Creates ticket]
```

---

### **Test 2: All Info at Once**
```
User: "My name is Alice, email alice@company.com, Premium plan, agent showing error 500"
Bot: [Creates ticket immediately with all details]
```

---

### **Test 3: Partial Info**
```
User: "Support ticket please. I'm Bob, bob@test.com"
Bot: "Great! I have your details:
      - Name: Bob ✅
      - Email: bob@test.com ✅

      Now, please describe your problem:"
User: "Dashboard not loading"
Bot: [Creates ticket]
```

---

## 📊 **SUCCESS CRITERIA:**

After testing, verify:

- [ ] Chatbot asks for missing information
- [ ] Accepts answers step-by-step
- [ ] Captures name correctly
- [ ] Captures email correctly
- [ ] Asks for plan
- [ ] Captures problem description
- [ ] Creates support ticket in database
- [ ] Returns ticket ID
- [ ] Ticket visible in /support page
- [ ] Ticket visible in admin panel
- [ ] Conversation saved with action
- [ ] No errors in console
- [ ] Can start new conversation after

---

## 🔧 **TESTING CHECKLIST:**

### **Before Testing:**
```bash
# 1. Make sure database table exists
# 2. Server is running
npm run dev

# 3. Website accessible
http://localhost:3000
```

---

### **During Testing:**
```
1. Open chatbot (click bottom-right button)
2. Type: "I need support"
3. Follow step-by-step prompts
4. Provide name, email, plan, problem
5. Wait for confirmation
6. Note the ticket ID
```

---

### **After Testing:**
```
1. Go to /support page
2. Verify ticket is there
3. Go to /admin/chatbot
4. Verify conversation saved
5. Check Supabase database
6. Verify all fields populated
```

---

## 💡 **TIPS:**

### **For Best Results:**
- Answer questions directly
- Provide one piece of info at a time
- Use real email format (xxx@xxx.com)
- Describe problem clearly
- Wait for each response

### **Valid Plans:**
- Basic
- Medium
- Premium
- (or any variation - bot will accept)

### **Problem Examples:**
- "Agent not working"
- "Can't login to dashboard"
- "Payment issue with subscription"
- "Embed code not loading"
- "Messages not sending"

---

## 🎯 **EXPECTED TIMELINE:**

```
Message 1: "I need support" → Bot asks name (1 sec)
Message 2: "John" → Bot asks email (1 sec)
Message 3: "john@test.com" → Bot asks plan (1 sec)
Message 4: "Basic" → Bot asks problem (1 sec)
Message 5: "Agent broken" → Bot creates ticket (2-3 sec)

Total: ~7-8 seconds
```

---

## 📸 **SCREENSHOTS TO TAKE:**

1. **Chatbot conversation:**
   - Full conversation flow
   - Final success message with ticket ID

2. **Support page:**
   - New ticket in list
   - Ticket details

3. **Admin chatbot page:**
   - Conversation saved
   - Action type shown

4. **Supabase:**
   - support_tickets table row
   - chatbot_conversations table rows

---

## ✅ **FINAL VERIFICATION:**

**Success when:**
```
✅ Chatbot responds to each message
✅ Asks for name, email, plan, problem
✅ Creates ticket with all details
✅ Returns ticket ID
✅ Ticket in database
✅ Ticket in support page
✅ Conversation in admin panel
✅ Can use chatbot again for new conversation
```

---

**Happy Testing!** 🚀

Test karo aur mujhe batao result! 🎉
