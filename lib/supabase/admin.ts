import { createClient } from "@supabase/supabase-js";

/**
 * Admin Supabase Client
 * Uses Service Role Key for admin operations
 * WARNING: Only use in server-side code, never expose to client!
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nwlyfcterxwqbrstvlyz.supabase.co";
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53bHlmY3Rlcnh3cWJyc3R2bHl6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTA2NTcxMSwiZXhwIjoyMDkwNjQxNzExfQ._FYKyX-P1qNCbH_R5ZvYqalhZPu1nv_euGGg7PdgLFo";

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
