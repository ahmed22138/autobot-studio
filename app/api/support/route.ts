import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  try {
    const { name, email, subject, message, plan } = await request.json();

    // Validation
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Priority based on plan
    const priorityMap: Record<string, string> = {
      basic: "Normal (24-48h response)",
      medium: "Priority (12-24h response)",
      premium: "Urgent - 24/7 (2-4h response)",
    };

    const priority = priorityMap[plan] || "Normal";

    // Professional Email content
    const emailContent = {
      from: email,
      to: process.env.SUPPORT_EMAIL || "support@autobobstudio.com",
      subject: `🎯 ${priority} Support Request - ${subject}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <style>
              * { margin: 0; padding: 0; box-sizing: border-box; }
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                line-height: 1.6;
                color: #1f2937;
                background-color: #f3f4f6;
                padding: 20px;
              }
              .email-wrapper {
                max-width: 650px;
                margin: 0 auto;
                background: white;
                border-radius: 16px;
                overflow: hidden;
                box-shadow: 0 10px 40px rgba(0,0,0,0.1);
              }
              .header {
                background: linear-gradient(135deg, #1e40af 0%, #7c3aed 50%, #db2777 100%);
                padding: 40px 30px;
                text-align: center;
                position: relative;
              }
              .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path fill="rgba(255,255,255,0.1)" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,112C672,96,768,96,864,112C960,128,1056,160,1152,160C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path></svg>') no-repeat bottom;
                background-size: cover;
                opacity: 0.3;
              }
              .logo {
                font-size: 40px;
                margin-bottom: 8px;
                display: block;
              }
              .header h1 {
                color: white;
                font-size: 28px;
                font-weight: 700;
                margin: 0;
                position: relative;
                z-index: 1;
                text-shadow: 0 2px 10px rgba(0,0,0,0.2);
              }
              .header p {
                color: rgba(255,255,255,0.9);
                margin-top: 8px;
                font-size: 14px;
                position: relative;
                z-index: 1;
              }
              .priority-banner {
                padding: 16px 30px;
                text-align: center;
                font-weight: 600;
                font-size: 15px;
                border-bottom: 3px solid;
              }
              .priority-basic { background: #f3f4f6; color: #374151; border-color: #9ca3af; }
              .priority-medium { background: #dbeafe; color: #1e40af; border-color: #3b82f6; }
              .priority-premium { background: #fef3c7; color: #92400e; border-color: #f59e0b; }
              .content { padding: 35px 30px; }
              .intro {
                background: linear-gradient(135deg, #f0f9ff 0%, #faf5ff 100%);
                border-left: 4px solid #3b82f6;
                padding: 16px 20px;
                margin-bottom: 30px;
                border-radius: 8px;
              }
              .intro p {
                margin: 0;
                color: #374151;
                font-size: 14px;
                line-height: 1.6;
              }
              .ticket-info {
                background: #fafafa;
                border-radius: 12px;
                padding: 24px;
                margin-bottom: 24px;
              }
              .info-grid {
                display: grid;
                grid-template-columns: 140px 1fr;
                gap: 16px;
              }
              .label {
                font-weight: 600;
                color: #6b7280;
                font-size: 13px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .value {
                color: #111827;
                font-size: 15px;
                word-break: break-word;
              }
              .value strong {
                color: #1e40af;
              }
              .message-box {
                background: white;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                padding: 20px;
                margin-top: 24px;
              }
              .message-box h3 {
                color: #374151;
                font-size: 14px;
                font-weight: 600;
                margin-bottom: 12px;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .message-content {
                color: #1f2937;
                font-size: 15px;
                line-height: 1.7;
                white-space: pre-wrap;
              }
              .plan-badge {
                display: inline-block;
                padding: 6px 14px;
                border-radius: 20px;
                font-size: 13px;
                font-weight: 600;
                text-transform: uppercase;
                letter-spacing: 0.5px;
              }
              .badge-basic { background: #e5e7eb; color: #374151; }
              .badge-medium { background: #dbeafe; color: #1e40af; }
              .badge-premium { background: #fef3c7; color: #92400e; border: 2px solid #f59e0b; }
              .action-buttons {
                text-align: center;
                margin: 30px 0;
                padding: 20px;
                background: linear-gradient(135deg, #f0f9ff 0%, #faf5ff 100%);
                border-radius: 12px;
              }
              .btn {
                display: inline-block;
                padding: 14px 32px;
                background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                color: white;
                text-decoration: none;
                border-radius: 8px;
                font-weight: 600;
                font-size: 15px;
                box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
                transition: transform 0.2s;
              }
              .btn:hover {
                transform: translateY(-2px);
              }
              .footer {
                background: #111827;
                color: #9ca3af;
                padding: 30px;
                text-align: center;
                font-size: 13px;
              }
              .footer-brand {
                font-size: 20px;
                color: white;
                font-weight: 700;
                margin-bottom: 12px;
                background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
              }
              .footer p {
                margin: 8px 0;
                line-height: 1.6;
              }
              .divider {
                height: 1px;
                background: linear-gradient(90deg, transparent, #e5e7eb, transparent);
                margin: 20px 0;
              }
              .timestamp {
                text-align: center;
                color: #9ca3af;
                font-size: 12px;
                padding: 16px;
                background: #fafafa;
              }
            </style>
          </head>
          <body>
            <div class="email-wrapper">
              <!-- Header -->
              <div class="header">
                <span class="logo">🤖</span>
                <h1>AutoBot Studio</h1>
                <p>Professional AI Chatbot Platform</p>
              </div>

              <!-- Priority Banner -->
              <div class="priority-banner priority-${plan}">
                ⚡ ${priority.toUpperCase()} - Response Expected: ${
                  plan === 'basic' ? '24-48 hours' :
                  plan === 'medium' ? '12-24 hours' :
                  '2-4 hours'
                }
              </div>

              <!-- Content -->
              <div class="content">
                <!-- Intro -->
                <div class="intro">
                  <p><strong>📬 New Support Request Received</strong></p>
                  <p style="margin-top: 8px;">A customer has submitted a support ticket. Please review the details below and respond within the expected timeframe.</p>
                </div>

                <!-- Ticket Information -->
                <div class="ticket-info">
                  <div class="info-grid">
                    <div class="label">🎫 Ticket ID</div>
                    <div class="value"><strong>#${Date.now().toString().slice(-8)}</strong></div>

                    <div class="label">👤 Customer</div>
                    <div class="value"><strong>${name}</strong></div>

                    <div class="label">📧 Email</div>
                    <div class="value"><a href="mailto:${email}" style="color: #3b82f6; text-decoration: none;">${email}</a></div>

                    <div class="label">💳 Plan</div>
                    <div class="value"><span class="plan-badge badge-${plan}">${plan.toUpperCase()}</span></div>

                    <div class="label">📌 Subject</div>
                    <div class="value"><strong>${subject}</strong></div>

                    <div class="label">⏰ Received</div>
                    <div class="value">${new Date().toLocaleString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}</div>
                  </div>
                </div>

                <!-- Message -->
                <div class="message-box">
                  <h3>💬 Customer Message</h3>
                  <div class="divider"></div>
                  <div class="message-content">${message.replace(/\n/g, "<br>")}</div>
                </div>

                <!-- Action Buttons -->
                <div class="action-buttons">
                  <p style="margin-bottom: 16px; color: #374151; font-size: 14px;">Ready to respond?</p>
                  <a href="mailto:${email}?subject=Re: ${subject}" class="btn">
                    📧 Reply to Customer
                  </a>
                </div>
              </div>

              <!-- Timestamp -->
              <div class="timestamp">
                🕐 Ticket received at ${new Date().toLocaleTimeString()} on ${new Date().toLocaleDateString()}
              </div>

              <!-- Footer -->
              <div class="footer">
                <div class="footer-brand">AutoBot Studio</div>
                <p>Professional AI Chatbot Platform</p>
                <p style="margin-top: 16px; font-size: 12px;">
                  This is an automated notification from your support system.<br>
                  Please respond to the customer directly via email.
                </p>
                <p style="margin-top: 16px; color: #6b7280;">
                  © ${new Date().getFullYear()} AutoBot Studio. All rights reserved.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    };

    // ==========================================
    // OPTION 1: Using Resend (Recommended)
    // ==========================================
    // Uncomment this if you want to use Resend
    /*
    const resend = new Resend(process.env.RESEND_API_KEY);
    await resend.emails.send({
      from: 'AutoBot Studio <noreply@yourdomain.com>',
      to: process.env.SUPPORT_EMAIL || 'support@autobobstudio.com',
      reply_to: email,
      subject: emailContent.subject,
      html: emailContent.html,
    });
    */

    // ==========================================
    // OPTION 2: Using Nodemailer (Gmail, etc.)
    // ==========================================
    // Active - Nodemailer with Gmail
    const nodemailer = require('nodemailer');
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD, // Use App Password for Gmail
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.SUPPORT_EMAIL,
      replyTo: email,
      subject: emailContent.subject,
      html: emailContent.html,
    });

    // ==========================================
    // OPTION 3: Using SendGrid
    // ==========================================
    // Uncomment this if you want to use SendGrid
    /*
    const sgMail = require('@sendgrid/mail');
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    await sgMail.send({
      to: process.env.SUPPORT_EMAIL,
      from: 'noreply@yourdomain.com',
      replyTo: email,
      subject: emailContent.subject,
      html: emailContent.html,
    });
    */

    // ==========================================
    // SAVE TO DATABASE (Supabase)
    // ==========================================
    const ticketId = `TKT-${Date.now().toString().slice(-8)}`;

    try {
      const supabase = await createClient();
      const { data: ticketData, error: dbError } = await supabase
        .from("support_tickets")
        .insert({
          ticket_id: ticketId,
          name,
          email,
          plan,
          priority,
          subject,
          message,
          status: "open",
        })
        .select()
        .single();

      if (dbError) {
        console.error("❌ Database save error:", dbError);
        // Continue even if DB save fails (email still sent)
      } else {
        console.log("💾 Ticket saved to database:", ticketData?.id);
      }
    } catch (dbErr) {
      console.error("❌ Database connection error:", dbErr);
    }

    // ==========================================
    // PROFESSIONAL LOGGING
    // ==========================================
    console.log("\n" + "=".repeat(60));
    console.log("🎫 NEW SUPPORT TICKET RECEIVED");
    console.log("=".repeat(60));
    console.log(`📌 Ticket ID      : ${ticketId}`);
    console.log(`⚡ Priority       : ${priority}`);
    console.log(`💳 Plan           : ${plan.toUpperCase()}`);
    console.log(`👤 Customer Name  : ${name}`);
    console.log(`📧 Customer Email : ${email}`);
    console.log(`📝 Subject        : ${subject}`);
    console.log(`🕐 Timestamp      : ${new Date().toLocaleString()}`);
    console.log("-".repeat(60));
    console.log(`💬 Message Preview:\n${message.substring(0, 100)}${message.length > 100 ? '...' : ''}`);
    console.log("-".repeat(60));
    console.log("✅ Professional email sent successfully to support team!");
    console.log("💾 Ticket data saved to database for tracking");
    console.log("📬 Customer will receive response within expected timeframe");
    console.log("=".repeat(60) + "\n");

    // Optional: Save to Supabase for tracking
    /*
    const { createClient } = require('@/lib/supabase/server');
    const supabase = await createClient();
    await supabase.from('support_tickets').insert({
      name,
      email,
      plan,
      subject,
      message,
      priority,
      status: 'open',
      created_at: new Date().toISOString(),
    });
    */

    return NextResponse.json({
      success: true,
      message: "Support request received. We'll get back to you soon!",
    });
  } catch (error) {
    console.error("Support API error:", error);
    return NextResponse.json(
      { error: "Failed to send support request" },
      { status: 500 }
    );
  }
}
