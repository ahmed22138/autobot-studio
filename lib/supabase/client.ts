import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "https://nwlyfcterxwqbrstvlyz.supabase.co",
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53bHlmY3Rlcnh3cWJyc3R2bHl6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNjU3MTEsImV4cCI6MjA5MDY0MTcxMX0.X3h3th2kRw_IbVuf9bCoeMQ1JjNvIAmFXUMFSJUyh7k"
  );
}
