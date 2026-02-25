-- =========================================
-- TICKET REPLIES TABLE (Reply System)
-- =========================================
-- Run this in Supabase SQL Editor

-- Create ticket_replies table
CREATE TABLE IF NOT EXISTS public.ticket_replies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_id TEXT NOT NULL REFERENCES support_tickets(ticket_id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('user', 'admin')),
  sender_email TEXT NOT NULL,
  sender_name TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_ticket_replies_ticket_id ON public.ticket_replies(ticket_id);
CREATE INDEX IF NOT EXISTS idx_ticket_replies_created_at ON public.ticket_replies(created_at DESC);

-- Enable Row Level Security
ALTER TABLE public.ticket_replies ENABLE ROW LEVEL SECURITY;

-- Policy: Allow all users to read replies for their tickets
CREATE POLICY "Users can read their ticket replies"
  ON public.ticket_replies
  FOR SELECT
  USING (
    ticket_id IN (
      SELECT ticket_id FROM support_tickets
      WHERE email = auth.jwt()->>'email'
    )
  );

-- Policy: Allow users to insert replies for their own tickets
CREATE POLICY "Users can reply to their tickets"
  ON public.ticket_replies
  FOR INSERT
  WITH CHECK (
    ticket_id IN (
      SELECT ticket_id FROM support_tickets
      WHERE email = auth.jwt()->>'email'
    )
  );

-- Policy: Allow admins to do everything
CREATE POLICY "Admins can do everything with replies"
  ON public.ticket_replies
  FOR ALL
  USING (true);

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_ticket_replies_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER ticket_replies_updated_at
  BEFORE UPDATE ON public.ticket_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_ticket_replies_updated_at();

-- Update main ticket's updated_at when reply is added
CREATE OR REPLACE FUNCTION update_ticket_on_reply()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE support_tickets
  SET updated_at = NOW()
  WHERE ticket_id = NEW.ticket_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ticket_on_reply_trigger
  AFTER INSERT ON public.ticket_replies
  FOR EACH ROW
  EXECUTE FUNCTION update_ticket_on_reply();

-- Done!
-- Now you can store conversation history for tickets
