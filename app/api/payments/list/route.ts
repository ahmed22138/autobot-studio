import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminEmails = (process.env.ADMIN_EMAILS || "").toLowerCase().split(",").filter(Boolean);
  if (!adminEmails.includes((user.email || "").toLowerCase())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const admin = createAdminClient();
  const { data: requests, error } = await admin
    .from("payment_requests")
    .select("id, user_email, plan, amount_pkr, payment_method, screenshot, note, status, admin_note, created_at")
    .order("created_at", { ascending: false });

  if (error) return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });

  return NextResponse.json({ requests: requests || [] });
}
