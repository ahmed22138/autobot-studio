import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { ticketId, message } = await request.json();

    if (!ticketId || !message) {
      return NextResponse.json(
        { error: "Ticket ID and message are required" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Get current user
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    // Get ticket details
    const { data: ticket, error: ticketError } = await supabase
      .from("support_tickets")
      .select("*")
      .eq("ticket_id", ticketId)
      .single();

    if (ticketError || !ticket) {
      return NextResponse.json(
        { error: "Ticket not found" },
        { status: 404 }
      );
    }

    // Verify user owns this ticket
    if (ticket.email !== user.email) {
      return NextResponse.json(
        { error: "Unauthorized - Not your ticket" },
        { status: 403 }
      );
    }

    // Get user profile data (name)
    const { data: profile } = await supabase
      .from("agents")
      .select("user_id")
      .eq("user_id", user.id)
      .limit(1)
      .single();

    const userName = user.user_metadata?.name || ticket.name || "User";

    // Save reply to database
    const { data: reply, error: replyError } = await supabase
      .from("ticket_replies")
      .insert({
        ticket_id: ticketId,
        sender_type: "user",
        sender_email: user.email,
        sender_name: userName,
        message: message,
      })
      .select()
      .single();

    if (replyError) {
      console.error("❌ Failed to save reply:", replyError);
      return NextResponse.json(
        { error: "Failed to save reply" },
        { status: 500 }
      );
    }

    // Send email notification to admin
    try {
      const nodemailer = require("nodemailer");

      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const emailHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Ticket Reply</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Arial, sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">
  <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 60px rgba(0,0,0,0.3);">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px; text-align: center;">
              <h1 style="margin: 0; color: white; font-size: 28px; font-weight: 700;">🔔 New Customer Reply</h1>
              <p style="margin: 10px 0 0 0; color: rgba(255,255,255,0.9); font-size: 16px;">AutoBot Studio Support System</p>
            </td>
          </tr>

          <!-- Alert Banner -->
          <tr>
            <td style="background: linear-gradient(90deg, #3b82f6 0%, #8b5cf6 100%); padding: 20px; text-align: center;">
              <p style="margin: 0; color: white; font-size: 18px; font-weight: 600;">⚡ Customer has replied to their ticket</p>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td style="padding: 40px;">

              <!-- Ticket Info -->
              <div style="background: linear-gradient(135deg, #f0f9ff 0%, #e0e7ff 100%); border-left: 4px solid #3b82f6; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h2 style="margin: 0 0 15px 0; color: #1e293b; font-size: 20px;">Ticket Information</h2>
                <table width="100%" cellpadding="8" cellspacing="0">
                  <tr>
                    <td style="color: #64748b; font-size: 14px; font-weight: 600;">Ticket ID:</td>
                    <td style="color: #1e293b; font-size: 14px; font-weight: 700; font-family: 'Courier New', monospace;">${ticketId}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; font-size: 14px; font-weight: 600;">Subject:</td>
                    <td style="color: #1e293b; font-size: 14px; font-weight: 600;">${ticket.subject}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; font-size: 14px; font-weight: 600;">Customer:</td>
                    <td style="color: #1e293b; font-size: 14px;">${userName} (${user.email})</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; font-size: 14px; font-weight: 600;">Plan:</td>
                    <td style="color: #1e293b; font-size: 14px; text-transform: uppercase;">${ticket.plan}</td>
                  </tr>
                  <tr>
                    <td style="color: #64748b; font-size: 14px; font-weight: 600;">Status:</td>
                    <td><span style="background: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 12px; font-size: 12px; font-weight: 600; text-transform: uppercase;">${ticket.status}</span></td>
                  </tr>
                </table>
              </div>

              <!-- New Reply -->
              <div style="background: #fefce8; border-left: 4px solid #facc15; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
                <h3 style="margin: 0 0 15px 0; color: #713f12; font-size: 16px; display: flex; align-items: center;">
                  💬 Customer's Reply:
                </h3>
                <p style="margin: 0; color: #1e293b; font-size: 15px; line-height: 1.7; white-space: pre-wrap;">${message}</p>
              </div>

              <!-- Action Button -->
              <div style="text-align: center; margin: 30px 0;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/admin/tickets"
                   style="display: inline-block; background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 12px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 15px rgba(59, 130, 246, 0.4);">
                  🎯 View & Respond in Admin Panel
                </a>
              </div>

              <!-- Original Ticket -->
              <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 20px; border-radius: 8px; margin-top: 30px;">
                <h3 style="margin: 0 0 15px 0; color: #475569; font-size: 14px; text-transform: uppercase; letter-spacing: 0.5px;">Original Message:</h3>
                <p style="margin: 0; color: #64748b; font-size: 14px; line-height: 1.6;">${ticket.message}</p>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #f8fafc; padding: 30px; text-align: center; border-top: 1px solid #e2e8f0;">
              <p style="margin: 0 0 10px 0; color: #64748b; font-size: 13px;">
                🤖 AutoBot Studio - AI Chatbot Platform
              </p>
              <p style="margin: 0; color: #94a3b8; font-size: 12px;">
                This is an automated notification from your support system
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
      `;

      await transporter.sendMail({
        from: `"AutoBot Studio Support" <${process.env.EMAIL_USER}>`,
        to: process.env.SUPPORT_EMAIL,
        replyTo: user.email,
        subject: `🔔 Customer Reply: ${ticket.subject} [${ticketId}]`,
        html: emailHTML,
      });

      console.log("✅ Admin notification sent successfully");
    } catch (emailError) {
      console.error("⚠️ Failed to send admin notification:", emailError);
      // Continue even if email fails - reply is saved
    }

    return NextResponse.json({
      success: true,
      message: "Reply submitted successfully",
      reply: reply,
    });

  } catch (error: any) {
    console.error("❌ Error in reply API:", error);
    return NextResponse.json(
      { error: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}
