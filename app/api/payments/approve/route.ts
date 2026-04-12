import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // Admin check
  const adminEmails = ["dj9581907@gmail.com", "workb9382@gmail.com"];
  if (!adminEmails.includes((user.email || "").toLowerCase())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { request_id } = await req.json();
  if (!request_id) return NextResponse.json({ error: "request_id required" }, { status: 400 });

  const admin = createAdminClient();

  // Get the payment request
  const { data: payReq } = await admin
    .from("payment_requests")
    .select("*")
    .eq("id", request_id)
    .single();

  if (!payReq) return NextResponse.json({ error: "Request not found" }, { status: 404 });

  // Safety check
  if (!payReq.user_id) {
    return NextResponse.json({ error: "Payment request has no user_id" }, { status: 400 });
  }

  // 1. Update payment request status
  const { error: updateErr } = await admin.from("payment_requests").update({
    status:      "approved",
    reviewed_at: new Date().toISOString(),
    reviewed_by: user.id,
  }).eq("id", request_id);

  if (updateErr) {
    console.error("Failed to update payment_requests:", updateErr);
    return NextResponse.json({ error: "Failed to update payment status" }, { status: 500 });
  }

  // 2. Upsert subscription — activate the plan
  const renewsAt = new Date();
  renewsAt.setMonth(renewsAt.getMonth() + 1);

  const { error: subErr } = await admin.from("subscriptions").upsert({
    user_id:    payReq.user_id,
    plan:       payReq.plan,
    status:     "active",
    renews_at:  renewsAt.toISOString(),
    updated_at: new Date().toISOString(),
  }, { onConflict: "user_id" });

  if (subErr) {
    console.error("Failed to upsert subscription:", subErr);
    return NextResponse.json({ error: `Subscription failed: ${subErr.message}` }, { status: 500 });
  }

  // 3. Email user
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && payReq.user_email) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from:    "AutoBot Studio <onboarding@resend.dev>",
          to:      [payReq.user_email],
          subject: `Your ${payReq.plan.toUpperCase()} Plan is Active!`,
          html: `
<div style="font-family:sans-serif;max-width:500px;background:#0a0a0f;color:#fff;padding:32px;border-radius:12px">
  <h2 style="color:#22c55e">Plan Activated!</h2>
  <p style="color:#a1a1aa">Tumhara payment verify ho gaya aur <strong style="color:#fff;text-transform:capitalize">${payReq.plan}</strong> plan activate ho gaya hai.</p>
  <table style="width:100%;border-collapse:collapse;margin-top:16px">
    <tr><td style="color:#a1a1aa;padding:8px 0">Plan</td><td style="color:#fff;font-weight:600;text-transform:capitalize">${payReq.plan}</td></tr>
    <tr><td style="color:#a1a1aa;padding:8px 0">Amount Paid</td><td style="color:#22c55e;font-weight:700">PKR ${payReq.amount_pkr.toLocaleString()}</td></tr>
    <tr><td style="color:#a1a1aa;padding:8px 0">Valid Until</td><td style="color:#fff">${renewsAt.toLocaleDateString("en-PK", { day: "numeric", month: "long", year: "numeric" })}</td></tr>
  </table>
  <a href="https://autobot-studio.vercel.app/dashboard"
     style="display:inline-block;margin-top:24px;padding:12px 24px;background:linear-gradient(135deg,#22c55e,#16a34a);color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
    Go to Dashboard →
  </a>
  <p style="color:#52525b;font-size:12px;margin-top:24px">AutoBot Studio — Your AI Sales Platform</p>
</div>`,
        }),
      });
    } catch { /* silent */ }
  }

  return NextResponse.json({ success: true });
}
