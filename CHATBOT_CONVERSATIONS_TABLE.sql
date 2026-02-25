-- =====================================================
-- CHATBOT CONVERSATIONS TABLE
-- Stores all chatbot interactions
-- =====================================================

-- Create chatbot_conversations table
CREATE TABLE IF NOT EXISTS public.chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),

  -- User information (nullable for anonymous users)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT NOT NULL, -- To track conversation sessions

  -- Message details
  user_message TEXT NOT NULL,
  bot_response TEXT NOT NULL,

  -- Intent and entities (for analytics)
  detected_intent TEXT,
  extracted_entities JSONB DEFAULT '{}'::jsonb,

  -- Action performed (if any)
  action_type TEXT, -- e.g., "ticket_created", "agent_guided", etc.
  action_data JSONB DEFAULT '{}'::jsonb, -- Additional action details

  -- Metadata
  user_email TEXT,
  user_name TEXT,
  user_ip TEXT,
  user_agent TEXT,

  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_user_id
  ON public.chatbot_conversations(user_id);

CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_session_id
  ON public.chatbot_conversations(session_id);

CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_created_at
  ON public.chatbot_conversations(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_intent
  ON public.chatbot_conversations(detected_intent);

CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_action
  ON public.chatbot_conversations(action_type);

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS
ALTER TABLE public.chatbot_conversations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own conversations
CREATE POLICY "Users can view own conversations"
  ON public.chatbot_conversations
  FOR SELECT
  USING (
    auth.uid() = user_id
    OR user_id IS NULL -- Allow viewing anonymous conversations
  );

-- Policy: Anyone can insert conversations (including anonymous)
CREATE POLICY "Anyone can create conversations"
  ON public.chatbot_conversations
  FOR INSERT
  WITH CHECK (true);

-- Policy: Admin can view all conversations
CREATE POLICY "Admin can view all conversations"
  ON public.chatbot_conversations
  FOR SELECT
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) IN (
      'workb9382@gmail.com',
      'dj9581907@gmail.com'
    )
  );

-- Policy: Admin can update/delete conversations
CREATE POLICY "Admin can manage all conversations"
  ON public.chatbot_conversations
  FOR ALL
  USING (
    (SELECT email FROM auth.users WHERE id = auth.uid()) IN (
      'workb9382@gmail.com',
      'dj9581907@gmail.com'
    )
  );

-- =====================================================
-- ANALYTICS VIEW
-- =====================================================

-- View for conversation analytics
CREATE OR REPLACE VIEW chatbot_analytics AS
SELECT
  DATE(created_at) as conversation_date,
  detected_intent,
  action_type,
  COUNT(*) as total_conversations,
  COUNT(DISTINCT user_id) as unique_users,
  COUNT(DISTINCT session_id) as unique_sessions,
  COUNT(*) FILTER (WHERE action_type IS NOT NULL) as conversations_with_actions
FROM public.chatbot_conversations
GROUP BY DATE(created_at), detected_intent, action_type
ORDER BY conversation_date DESC;

-- =====================================================
-- SAMPLE QUERIES
-- =====================================================

-- Get all conversations for a user
-- SELECT * FROM chatbot_conversations WHERE user_id = 'USER_ID_HERE' ORDER BY created_at DESC;

-- Get conversations by intent
-- SELECT * FROM chatbot_conversations WHERE detected_intent = 'create_support_ticket' ORDER BY created_at DESC;

-- Get conversations with actions
-- SELECT * FROM chatbot_conversations WHERE action_type IS NOT NULL ORDER BY created_at DESC;

-- Get conversation stats by date
-- SELECT DATE(created_at) as date, COUNT(*) as total FROM chatbot_conversations GROUP BY DATE(created_at) ORDER BY date DESC;

-- Get most common intents
-- SELECT detected_intent, COUNT(*) as count FROM chatbot_conversations WHERE detected_intent IS NOT NULL GROUP BY detected_intent ORDER BY count DESC;

-- =====================================================
-- SAMPLE DATA (for testing)
-- =====================================================

-- INSERT INTO public.chatbot_conversations (
--   session_id,
--   user_message,
--   bot_response,
--   detected_intent,
--   extracted_entities,
--   action_type,
--   action_data
-- ) VALUES (
--   'session_123',
--   'I need help creating an agent',
--   'Here is how to create an agent...',
--   'guide_agent_creation',
--   '{}',
--   NULL,
--   NULL
-- );

-- =====================================================
-- NOTES
-- =====================================================

-- 1. session_id tracks conversation sessions (even for anonymous users)
-- 2. user_id is nullable (for anonymous chatbot usage)
-- 3. extracted_entities stores structured data from user messages
-- 4. action_data stores details about actions performed (e.g., ticket ID)
-- 5. RLS allows users to view their own conversations
-- 6. Admin can view/manage all conversations
-- 7. Analytics view provides insights into chatbot usage

-- =====================================================
-- ADMIN PANEL INTEGRATION
-- =====================================================

-- To view chatbot conversations in admin panel:
-- SELECT
--   c.id,
--   c.session_id,
--   u.email as user_email,
--   c.user_message,
--   c.bot_response,
--   c.detected_intent,
--   c.action_type,
--   c.created_at
-- FROM chatbot_conversations c
-- LEFT JOIN auth.users u ON c.user_id = u.id
-- ORDER BY c.created_at DESC
-- LIMIT 50;

-- =====================================================
-- RUN THIS SCRIPT IN SUPABASE SQL EDITOR
-- =====================================================
