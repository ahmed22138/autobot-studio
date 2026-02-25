# Stripe Setup Guide

## 1. Stripe Dashboard Keys

Go to [https://dashboard.stripe.com/test/apikeys](https://dashboard.stripe.com/test/apikeys)

Copy these two keys:

| Key | Example | Where to find |
|-----|---------|---------------|
| Publishable Key | `pk_test_51...` | Top of API keys page |
| Secret Key | `sk_test_51...` | Click "Reveal test key" |

---

## 2. Create Products & Prices in Stripe

Go to [https://dashboard.stripe.com/test/products](https://dashboard.stripe.com/test/products)

### Product 1: Medium Plan
- Click **"+ Add Product"**
- Name: `Medium Plan`
- Price: `$8.00` / `month` (Recurring)
- Click **Save**
- Copy the **Price ID** (starts with `price_...`)

### Product 2: Premium Plan
- Click **"+ Add Product"**
- Name: `Premium Plan`
- Price: `$15.00` / `month` (Recurring)
- Click **Save**
- Copy the **Price ID** (starts with `price_...`)

---

## 3. Webhook Setup

Go to [https://dashboard.stripe.com/test/webhooks](https://dashboard.stripe.com/test/webhooks)

### For Local Development:
```bash
# Install Stripe CLI: https://docs.stripe.com/stripe-cli
stripe login
stripe listen --forward-to localhost:3000/api/stripe/webhook
```
CLI will print your webhook secret (`whsec_...`), copy it.

### For Production:
- Click **"+ Add endpoint"**
- Endpoint URL: `https://your-domain.com/api/stripe/webhook`
- Select these 4 events:
  - `checkout.session.completed`
  - `customer.subscription.updated`
  - `customer.subscription.deleted`
  - `invoice.payment_failed`
- Click **Add endpoint**
- Click **"Reveal"** under Signing secret, copy it (`whsec_...`)

---

## 4. Supabase Service Role Key

Go to your Supabase Dashboard > **Settings** > **API**

Copy the **service_role key** (under "Project API keys" section — the `secret` one, NOT the `anon` one)

---

## 5. Fill `.env.local`

Open `.env.local` and replace the placeholders:

```env
# Already set
NEXT_PUBLIC_SUPABASE_URL=https://atyjeaegzgtpbdawbjnq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...

# Stripe (from Step 1)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_PASTE_HERE
STRIPE_SECRET_KEY=sk_test_PASTE_HERE

# Webhook Secret (from Step 3)
STRIPE_WEBHOOK_SECRET=whsec_PASTE_HERE

# Price IDs (from Step 2)
STRIPE_MEDIUM_PRICE_ID=price_PASTE_HERE
STRIPE_PREMIUM_PRICE_ID=price_PASTE_HERE

# Supabase Admin (from Step 4)
SUPABASE_SERVICE_ROLE_KEY=eyJhbG_PASTE_HERE

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## 6. Run SQL in Supabase

Go to Supabase Dashboard > **SQL Editor** > **New Query**

Paste and run:

```sql
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT UNIQUE,
  plan TEXT NOT NULL DEFAULT 'basic' CHECK (plan IN ('basic', 'medium', 'premium')),
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'canceled', 'past_due', 'incomplete')),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION handle_new_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO subscriptions (user_id, plan, status) VALUES (NEW.id, 'basic', 'active');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user_subscription();
```

---

## 7. Test Payment

Test card number: `4242 4242 4242 4242`
Expiry: Any future date (e.g. `12/34`)
CVC: Any 3 digits (e.g. `123`)

---

## Summary Checklist

- [ ] Stripe Publishable Key (`pk_test_...`)
- [ ] Stripe Secret Key (`sk_test_...`)
- [ ] Webhook Secret (`whsec_...`)
- [ ] Medium Plan Price ID (`price_...`)
- [ ] Premium Plan Price ID (`price_...`)
- [ ] Supabase Service Role Key (`eyJhbG...`)
- [ ] SQL run in Supabase
- [ ] `.env.local` updated with all values
