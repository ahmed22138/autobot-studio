-- Run this in Supabase SQL Editor if agents table doesn't exist

CREATE TABLE IF NOT EXISTS public.agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id TEXT NOT NULL UNIQUE,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  tone TEXT DEFAULT 'friendly',
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index
CREATE INDEX IF NOT EXISTS idx_agents_user_id ON public.agents(user_id);
CREATE INDEX IF NOT EXISTS idx_agents_agent_id ON public.agents(agent_id);

-- Enable RLS
ALTER TABLE public.agents ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own agents
CREATE POLICY "Users can view their own agents"
  ON public.agents
  FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own agents
CREATE POLICY "Users can create their own agents"
  ON public.agents
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own agents
CREATE POLICY "Users can update their own agents"
  ON public.agents
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own agents
CREATE POLICY "Users can delete their own agents"
  ON public.agents
  FOR DELETE
  USING (auth.uid() = user_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_agents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER agents_updated_at
  BEFORE UPDATE ON public.agents
  FOR EACH ROW
  EXECUTE FUNCTION update_agents_updated_at();
