-- =====================================================
-- ADD user_id COLUMN TO support_tickets TABLE
-- Run this in Supabase SQL Editor
-- =====================================================

-- Add user_id column (nullable - for anonymous tickets)
ALTER TABLE support_tickets
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_id
  ON support_tickets(user_id);

-- Update RLS policy to allow users to view their own tickets
DROP POLICY IF EXISTS "Users can view own tickets" ON support_tickets;

CREATE POLICY "Users can view own tickets"
  ON support_tickets
  FOR SELECT
  USING (
    auth.uid() = user_id  -- User's own tickets
    OR user_id IS NULL    -- Anonymous tickets
    OR (SELECT email FROM auth.users WHERE id = auth.uid()) IN (
      'workb9382@gmail.com',
      'dj9581907@gmail.com'  -- Admin can see all
    )
  );

-- Success message
DO $$
BEGIN
  RAISE NOTICE '✅ user_id column added to support_tickets table!';
  RAISE NOTICE '🔗 Tickets can now be linked to authenticated users';
  RAISE NOTICE '📊 Anonymous tickets will have user_id = NULL';
END $$;
