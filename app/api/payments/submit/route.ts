import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { plan, amount_pkr, payment_method, screenshot, note } = await req.json();

  if (!plan || !amount_pkr || !payment_method || !screenshot) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  if (!["medium", "premium"].includes(plan)) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const admin = createAdminClient();

  // Check if already has pending request
  const { data: existing } = await admin
    .from("payment_requests")
    .select("id")
    .eq("user_id", user.id)
    .eq("status", "pending")
    .single();

  if (existing) {
    return NextResponse.json({ error: "Tumhara ek payment request already pending hai. Please wait karo." }, { status: 400 });
  }

  // Save payment request
  const { error } = await admin.from("payment_requests").insert({
    user_id:        user.id,
    user_email:     user.email,
    plan,
    amount_pkr,
    payment_method,
    screenshot,          // base64 stored in DB
    note:           note || null,
    status:         "pending",
  });

  if (error) {
    return NextResponse.json({ error: "Failed to save request" }, { status: 500 });
  }

  // Send email notification to admin
  const resendKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAILS?.split(",")[0];
  if (resendKey && adminEmail) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from:    "AutoBot Studio <onboarding@resend.dev>",
          to:      [adminEmail],
          subject: `New Payment Request — ${plan.toUpperCase()} (PKR ${amount_pkr.toLocaleString()})`,
          html: `
<div style="font-family:sans-serif;max-width:500px;background:#0a0a0f;color:#fff;padding:32px;border-radius:12px">
  <h2 style="color:#3b82f6">New Subscription Payment</h2>
  <table style="width:100%;border-collapse:collapse;margin-top:16px">
    <tr><td style="color:#a1a1aa;padding:8px 0">User</td><td style="color:#fff">${user.email}</td></tr>
    <tr><td style="color:#a1a1aa;padding:8px 0">Plan</td><td style="color:#fff;font-weight:600;text-transform:capitalize">${plan}</td></tr>
    <tr><td style="color:#a1a1aa;padding:8px 0">Amount</td><td style="color:#22c55e;font-weight:700">PKR ${amount_pkr.toLocaleString()}</td></tr>
    <tr><td style="color:#a1a1aa;padding:8px 0">Method</td><td style="color:#fff;text-transform:capitalize">${payment_method}</td></tr>
    ${note ? `<tr><td style="color:#a1a1aa;padding:8px 0">Note</td><td style="color:#fff">${note}</td></tr>` : ""}
  </table>
  <a href="https://autobot-studio.vercel.app/dashboard/admin/payments"
     style="display:inline-block;margin-top:24px;padding:12px 24px;background:linear-gradient(135deg,#3b82f6,#7c3aed);color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
    Review & Approve →
  </a>
</div>`,
        }),
      });
    } catch { /* silent */ }
  }

  return NextResponse.json({ success: true });
}
