import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PLAN_LIMITS, PlanName } from "@/lib/plan-limits";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Get user's plan from subscriptions table
  const { data: sub } = await supabase
    .from("subscriptions")
    .select("plan")
    .eq("user_id", user.id)
    .single();

  const plan: PlanName = (sub?.plan as PlanName) || "basic";

  // Count user's agents
  const { count: agentCount } = await supabase
    .from("agents")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Count user's messages this month
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  const { count: messageCount } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("role", "user")
    .gte("created_at", startOfMonth);

  const limits = PLAN_LIMITS[plan];

  return NextResponse.json({
    plan,
    agentCount: agentCount ?? 0,
    messageCount: messageCount ?? 0,
    limits: {
      agents: limits.agents === Infinity ? null : limits.agents,
      messages: limits.messages === Infinity ? null : limits.messages,
    },
    features: {
      customization: limits.customization,
      support: limits.support,
      analytics: limits.analytics,
      apiAccess: limits.apiAccess,
      whiteLabel: limits.whiteLabel,
      customIntegrations: limits.customIntegrations,
    },
  });
}
