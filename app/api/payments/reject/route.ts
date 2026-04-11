import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const adminEmails = ["dj9581907@gmail.com", "workb9382@gmail.com"];
  if (!adminEmails.includes((user.email || "").toLowerCase())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { request_id, reason } = await req.json();
  const admin = createAdminClient();

  const { data: payReq } = await admin.from("payment_requests").select("*").eq("id", request_id).single();
  if (!payReq) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await admin.from("payment_requests").update({
    status:      "rejected",
    reviewed_at: new Date().toISOString(),
    reviewed_by: user.id,
    admin_note:  reason || null,
  }).eq("id", request_id);

  // Email user
  const resendKey = process.env.RESEND_API_KEY;
  if (resendKey && payReq.user_email) {
    try {
      await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { "Authorization": `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from:    "AutoBot Studio <onboarding@resend.dev>",
          to:      [payReq.user_email],
          subject: "Payment Verification Issue — AutoBot Studio",
          html: `
<div style="font-family:sans-serif;max-width:500px;background:#0a0a0f;color:#fff;padding:32px;border-radius:12px">
  <h2 style="color:#ef4444">Payment Verify Nahi Hua</h2>
  <p style="color:#a1a1aa">Sorry, tumhara payment screenshot verify nahi ho saka.</p>
  ${reason ? `<p style="color:#fff;background:#ffffff10;padding:12px;border-radius:8px;border-left:3px solid #ef4444">Reason: ${reason}</p>` : ""}
  <p style="color:#a1a1aa;margin-top:16px">Please dobara try karo ya support@autobotstudio.com pe contact karo.</p>
  <a href="https://autobot-studio.vercel.app/pricing"
     style="display:inline-block;margin-top:24px;padding:12px 24px;background:linear-gradient(135deg,#3b82f6,#7c3aed);color:#fff;border-radius:8px;text-decoration:none;font-weight:600">
    Try Again →
  </a>
</div>`,
        }),
      });
    } catch { /* silent */ }
  }

  return NextResponse.json({ success: true });
}
