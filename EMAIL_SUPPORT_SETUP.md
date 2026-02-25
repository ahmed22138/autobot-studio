# Email Support Setup Guide

## Overview

Support page ab `/support` par available hai. Users form fill karke support request bhej sakte hain.

**Plans ke according response time:**
- **Basic Plan**: Email Support (24-48 hours response)
- **Medium Plan**: Priority Support (12-24 hours response)
- **Premium Plan**: 24/7 Priority Support (2-4 hours response)

---

## Current Implementation

✅ **Created Files:**
1. `/app/support/page.tsx` - Support contact form
2. `/app/api/support/route.ts` - API endpoint to handle form
3. Updated `Navbar.tsx` and `Footer.tsx` with Support links

⚠️ **Email Service NOT Connected Yet** - Currently just logs to console

---

## Setup Options (Choose One)

### **Option 1: Resend (Recommended - Easiest)**

**Best for:** Modern email with great deliverability

#### Steps:

1. **Sign up at:** https://resend.com/
2. **Get API Key:** Dashboard → API Keys
3. **Install package:**
   ```bash
   npm install resend
   ```

4. **Add to `.env.local`:**
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxx
   SUPPORT_EMAIL=support@yourdomain.com
   ```

5. **Uncomment in `/app/api/support/route.ts` (line ~48-56):**
   ```typescript
   import { Resend } from 'resend';

   const resend = new Resend(process.env.RESEND_API_KEY);
   await resend.emails.send({
     from: 'AutoBot Studio <noreply@yourdomain.com>',
     to: process.env.SUPPORT_EMAIL || 'support@autobobstudio.com',
     reply_to: email,
     subject: emailContent.subject,
     html: emailContent.html,
   });
   ```

6. **Verify your domain** (for production) in Resend dashboard

**Pros:**
- Very easy setup
- Excellent deliverability
- Free tier: 100 emails/day
- No SMTP configuration needed

---

### **Option 2: Gmail with Nodemailer**

**Best for:** Quick testing or low volume

#### Steps:

1. **Install package:**
   ```bash
   npm install nodemailer
   npm install --save-dev @types/nodemailer
   ```

2. **Enable 2-Factor Authentication on Gmail**

3. **Generate App Password:**
   - Go to: https://myaccount.google.com/apppasswords
   - Select "Mail" and generate password
   - Copy the 16-character password

4. **Add to `.env.local`:**
   ```env
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASSWORD=xxxx xxxx xxxx xxxx  # App Password
   SUPPORT_EMAIL=support@yourdomain.com
   ```

5. **Uncomment in `/app/api/support/route.ts` (line ~61-74):**
   ```typescript
   const nodemailer = require('nodemailer');

   const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: process.env.EMAIL_USER,
       pass: process.env.EMAIL_PASSWORD,
     },
   });

   await transporter.sendMail({
     from: process.env.EMAIL_USER,
     to: process.env.SUPPORT_EMAIL,
     replyTo: email,
     subject: emailContent.subject,
     html: emailContent.html,
   });
   ```

**Pros:**
- Free
- Easy for testing
- No credit card needed

**Cons:**
- Gmail daily limit: 500 emails/day
- Less reliable for production

---

### **Option 3: SendGrid**

**Best for:** High volume production apps

#### Steps:

1. **Sign up at:** https://sendgrid.com/
2. **Create API Key:** Settings → API Keys → Create API Key
3. **Install package:**
   ```bash
   npm install @sendgrid/mail
   ```

4. **Add to `.env.local`:**
   ```env
   SENDGRID_API_KEY=SG.xxxxxxxxxxxxxxxxxxxxxxxx
   SUPPORT_EMAIL=support@yourdomain.com
   ```

5. **Uncomment in `/app/api/support/route.ts` (line ~79-90):**
   ```typescript
   const sgMail = require('@sendgrid/mail');

   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
   await sgMail.send({
     to: process.env.SUPPORT_EMAIL,
     from: 'noreply@yourdomain.com', // Must be verified in SendGrid
     replyTo: email,
     subject: emailContent.subject,
     html: emailContent.html,
   });
   ```

6. **Verify sender email** in SendGrid dashboard

**Pros:**
- Free tier: 100 emails/day
- Scalable
- Advanced analytics

---

## Advanced: Save to Database (Optional)

Agar aap emails ke saath support tickets bhi database mein save karna chahte ho:

### 1. Create Supabase Table

```sql
CREATE TABLE support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  plan TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  priority TEXT NOT NULL,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_support_tickets_email ON support_tickets(email);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
```

### 2. Uncomment in `/app/api/support/route.ts` (line ~112-123)

```typescript
const { createClient } = require('@/lib/supabase/server');
const supabase = await createClient();

await supabase.from('support_tickets').insert({
  name,
  email,
  plan,
  subject,
  message,
  priority,
  status: 'open',
});
```

### 3. Create Admin Dashboard (Optional)

Create `/app/dashboard/tickets/page.tsx` to view all support requests.

---

## Testing

### Test the Support Form:

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Visit: http://localhost:3000/support

3. Fill the form and submit

4. Check:
   - **Console logs** (if no email service)
   - **Your email** (if email service configured)
   - **Supabase table** (if database save enabled)

---

## Production Checklist

- [ ] Choose and configure an email service (Resend/Gmail/SendGrid)
- [ ] Add environment variables to production (Vercel/Netlify/etc.)
- [ ] Test email delivery in production
- [ ] Verify domain (for Resend/SendGrid)
- [ ] Set up email forwarding to your actual support team
- [ ] (Optional) Create support ticket dashboard
- [ ] (Optional) Add email notifications for new tickets
- [ ] (Optional) Add automatic replies confirming ticket receipt

---

## Environment Variables Summary

```env
# Choose one email service:

# Option 1: Resend
RESEND_API_KEY=re_xxxxxx

# Option 2: Gmail/Nodemailer
EMAIL_USER=your-gmail@gmail.com
EMAIL_PASSWORD=xxxx xxxx xxxx xxxx

# Option 3: SendGrid
SENDGRID_API_KEY=SG.xxxxxx

# Common (all options)
SUPPORT_EMAIL=support@yourdomain.com  # Where tickets will be sent
```

---

## Next Steps

1. **Choose your email service** based on your needs
2. **Follow the setup steps** for that service
3. **Test it** locally
4. **Deploy** with environment variables
5. **(Optional)** Add database tracking for tickets

---

## Troubleshooting

**Emails not sending?**
- Check API keys are correct
- Check environment variables are loaded
- Look at server console for errors
- Verify sender domain (for Resend/SendGrid)

**Gmail App Password not working?**
- Make sure 2FA is enabled
- Use the 16-character password (no spaces)
- Enable "Less secure app access" if needed

**Rate limits?**
- Resend: 100/day free, upgrade for more
- Gmail: 500/day max
- SendGrid: 100/day free, upgrade for more

---

Need help? Check the service documentation:
- Resend: https://resend.com/docs
- Nodemailer: https://nodemailer.com/
- SendGrid: https://docs.sendgrid.com/
