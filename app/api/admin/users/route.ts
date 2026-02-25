import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  try {
    // First verify user is logged in and is admin
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Admin emails
    const ADMIN_EMAILS = ["workb9382@gmail.com", "dj9581907@gmail.com"];
    if (!ADMIN_EMAILS.includes(user.email?.toLowerCase() || "")) {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 });
    }

    // Use admin client with service role key for admin operations
    const adminClient = createAdminClient();

    // Get ALL users from auth (server-side with admin privileges)
    const { data: authData, error: authError } = await adminClient.auth.admin.listUsers();

    if (authError) {
      console.error("Error fetching users:", authError);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    const allUsers = authData?.users || [];

    // Get all agents to count per user (use admin client)
    const { data: agents } = await adminClient.from("agents").select("user_id");

    // Get subscriptions data (use admin client)
    const { data: subscriptions } = await adminClient.from("subscriptions").select("*");

    // Get agents count per user
    const agentCounts: Record<string, number> = {};
    agents?.forEach((agent) => {
      agentCounts[agent.user_id] = (agentCounts[agent.user_id] || 0) + 1;
    });

    // Build user data from ALL users
    const userData = allUsers.map((user) => {
      const userId = user.id;
      const subscription = subscriptions?.find((s) => s.user_id === userId);

      // Extract user name from metadata or email
      const userEmail = user.email || "Unknown";
      let userName = "User";

      if (user.user_metadata?.name) {
        userName = user.user_metadata.name;
      } else if (user.user_metadata?.full_name) {
        userName = user.user_metadata.full_name;
      } else if (userEmail && userEmail !== "Unknown") {
        // Extract from email (capitalize first letter)
        const emailPart = userEmail.split("@")[0];
        userName = emailPart.charAt(0).toUpperCase() + emailPart.slice(1);
      }

      return {
        id: userId,
        name: userName,
        email: userEmail,
        created_at: user.created_at || new Date().toISOString(),
        last_sign_in_at: user.last_sign_in_at || new Date().toISOString(),
        plan: subscription?.plan || "basic",
        agentCount: agentCounts[userId] || 0,
        status: subscription?.status || "active",
      };
    });

    console.log(`✅ Fetched ${userData.length} users for admin`);

    return NextResponse.json({
      success: true,
      users: userData,
      count: userData.length,
    });
  } catch (error: any) {
    console.error("❌ Error in admin users API:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
