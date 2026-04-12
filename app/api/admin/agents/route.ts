import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const ADMIN_EMAILS = ["dj9581907@gmail.com", "workb9382@gmail.com"];
  if (!ADMIN_EMAILS.includes(user.email?.toLowerCase() || "")) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();

  // Fetch all agents
  const { data: agents, error } = await admin
    .from("agents")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Failed to fetch agents" }, { status: 500 });

  // Get all unique user IDs
  const userIds = [...new Set((agents || []).map((a: { user_id: string }) => a.user_id))];

  // Fetch all user emails in one call
  const emailMap: Record<string, string> = {};
  for (const uid of userIds) {
    try {
      const { data } = await admin.auth.admin.getUserById(uid);
      if (data?.user?.email) emailMap[uid] = data.user.email;
    } catch { /* skip */ }
  }

  const result = (agents || []).map((a: Record<string, unknown>) => ({
    ...a,
    user_email: emailMap[a.user_id as string] || "Unknown",
  }));

  return NextResponse.json({ agents: result });
}
