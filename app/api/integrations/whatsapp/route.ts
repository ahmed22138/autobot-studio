import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// GET — load existing WhatsApp integration
export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { data } = await supabase
    .from("whatsapp_integrations")
    .select("id, phone_number, agent_id, status, created_at")
    .eq("user_id", user.id)
    .single();

  return NextResponse.json({ integration: data || null });
}

// POST — save/update WhatsApp integration
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { phone_number, agent_id } = await req.json();
  if (!phone_number || !agent_id) {
    return NextResponse.json({ error: "phone_number and agent_id required" }, { status: 400 });
  }

  // Format number
  const cleaned = phone_number.replace(/\D/g, "");
  const formatted = cleaned.startsWith("0")
    ? "+92" + cleaned.slice(1)
    : cleaned.startsWith("92")
    ? "+" + cleaned
    : "+" + cleaned;

  const { error } = await supabase.from("whatsapp_integrations").upsert({
    user_id:      user.id,
    phone_number: formatted,
    agent_id,
    status:       "pending",
    updated_at:   new Date().toISOString(),
  }, { onConflict: "user_id" });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ success: true, phone_number: formatted });
}

// DELETE — disconnect WhatsApp
export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await supabase.from("whatsapp_integrations").delete().eq("user_id", user.id);
  return NextResponse.json({ success: true });
}
