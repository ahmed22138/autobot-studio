-- ============================================================
-- AutoBot Studio — Performance & Integrity SQL Migrations
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- 1. Add missing columns to agents table
ALTER TABLE agents
  ADD COLUMN IF NOT EXISTS welcome_message  TEXT,
  ADD COLUMN IF NOT EXISTS system_prompt    TEXT,
  ADD COLUMN IF NOT EXISTS response_length  TEXT DEFAULT 'medium',
  ADD COLUMN IF NOT EXISTS webhook_url      TEXT;

-- 2. Indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_messages_user_id     ON messages(user_id);
CREATE INDEX IF NOT EXISTS idx_messages_agent_id    ON messages(agent_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at  ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_orders_agent_id      ON orders(agent_id);
CREATE INDEX IF NOT EXISTS idx_agents_user_id       ON agents(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_agent_id      ON agents(agent_id);

-- 3. Prevent duplicate orders
ALTER TABLE orders
  ADD CONSTRAINT IF NOT EXISTS orders_order_number_unique UNIQUE (order_number);

-- 4. Add in_stock default to agent_products
ALTER TABLE agent_products
  ADD COLUMN IF NOT EXISTS in_stock BOOLEAN DEFAULT TRUE;

-- 5. Payment requests table (manual subscription payments)
CREATE TABLE IF NOT EXISTS payment_requests (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email      TEXT NOT NULL,
  plan            TEXT NOT NULL CHECK (plan IN ('medium', 'premium')),
  amount_pkr      INTEGER NOT NULL,
  payment_method  TEXT NOT NULL CHECK (payment_method IN ('jazzcash', 'easypaisa', 'bank')),
  screenshot      TEXT NOT NULL,          -- base64 data URL
  note            TEXT,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_note      TEXT,
  reviewed_by     UUID REFERENCES auth.users(id),
  reviewed_at     TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Index for fast admin queries
CREATE INDEX IF NOT EXISTS idx_payment_requests_status     ON payment_requests(status);
CREATE INDEX IF NOT EXISTS idx_payment_requests_user_id    ON payment_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_requests_created_at ON payment_requests(created_at DESC);

-- Row Level Security
ALTER TABLE payment_requests ENABLE ROW LEVEL SECURITY;

-- Users can only see their own payment requests
CREATE POLICY "Users can view own payment requests"
  ON payment_requests FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own payment requests
CREATE POLICY "Users can insert own payment requests"
  ON payment_requests FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Only service role (admin API) can update payment requests
-- (approve/reject done via service role key in API routes)

-- ============================================================
-- Done!
-- ============================================================
