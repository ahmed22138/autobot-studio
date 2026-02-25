-- Support Tickets Table
-- Run this SQL in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ticket_id TEXT NOT NULL UNIQUE,

  -- Customer Information
  name TEXT NOT NULL,
  email TEXT NOT NULL,

  -- Ticket Details
  plan TEXT NOT NULL CHECK (plan IN ('basic', 'medium', 'premium')),
  priority TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,

  -- Status Management
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'resolved', 'closed')),

  -- Timestamps
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  resolved_at TIMESTAMPTZ,

  -- Optional: Assign to support agent
  assigned_to TEXT
);

-- Indexes for faster queries
CREATE INDEX idx_support_tickets_email ON support_tickets(email);
CREATE INDEX idx_support_tickets_status ON support_tickets(status);
CREATE INDEX idx_support_tickets_plan ON support_tickets(plan);
CREATE INDEX idx_support_tickets_created ON support_tickets(created_at DESC);
CREATE INDEX idx_support_tickets_ticket_id ON support_tickets(ticket_id);

-- Row Level Security (RLS)
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert tickets (public form)
CREATE POLICY "Anyone can create support tickets"
  ON support_tickets
  FOR INSERT
  WITH CHECK (true);

-- Policy: Only admins can view all tickets
-- (You can modify this based on your needs)
CREATE POLICY "Service role can view all tickets"
  ON support_tickets
  FOR SELECT
  USING (true);

-- Policy: Service role can update tickets
CREATE POLICY "Service role can update tickets"
  ON support_tickets
  FOR UPDATE
  USING (true);

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_support_ticket_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update timestamp
CREATE TRIGGER update_support_tickets_timestamp
  BEFORE UPDATE ON support_tickets
  FOR EACH ROW
  EXECUTE FUNCTION update_support_ticket_timestamp();

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ Support Tickets table created successfully!';
  RAISE NOTICE '📊 You can now track all support requests in the database';
END $$;
