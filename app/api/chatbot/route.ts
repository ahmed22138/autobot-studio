import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Project knowledge base
const PROJECT_KNOWLEDGE = `
AutoBot Studio - AI Chatbot Platform

FEATURES:
1. Create AI Agents - Users can create custom chatbots
2. Three Plans - Basic (1 agent), Medium (5 agents), Premium (unlimited)
3. Admin Panel - Manage all users, agents, and support tickets
4. Support System - Email and ticket support
5. Stripe Integration - Subscription payments

HOW TO CREATE AGENT:
1. Login to dashboard
2. Click "Create New Agent"
3. Fill: Name, Description, Tone
4. Click "Create Agent"
5. Copy embed code and use on website

PLANS:
- Basic: 1 agent, 1000 messages/month, basic customization
- Medium: 5 agents, 10000 messages/month, advanced customization
- Premium: Unlimited agents, unlimited messages, full customization

ADMIN ACCESS:
- workb9382@gmail.com
- dj9581907@gmail.com

SUPPORT:
- Email: workb9382@gmail.com
- Or submit ticket from dashboard

TROUBLESHOOTING:
- Agent not working? Check if status is "active"
- Can't create agent? Check your plan limit
- Login issues? Reset password or contact support
- Payment issues? Contact support with transaction ID
`;

interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

// Detect user intent from message
function detectIntent(message: string, conversationHistory: Message[] = []): {
  intent: string;
  entities: any;
} {
  const lowerMsg = message.toLowerCase();

  // Check if we're in the middle of a flow
  const lastBotMessage = conversationHistory
    .filter((m) => m.role === "assistant")
    .slice(-1)[0]?.content || "";

  // ── Sales flow continuation ──────────────────────────────────────────
  if (
    lastBotMessage.includes("your name?") &&
    lastBotMessage.includes("love to help")
  ) {
    return { intent: "sales_flow_name", entities: { name: message } };
  }

  if (
    lastBotMessage.includes("best email") ||
    (lastBotMessage.includes("email") && lastBotMessage.includes("reach you"))
  ) {
    return { intent: "sales_flow_email", entities: { email: message } };
  }

  if (
    lastBotMessage.includes("which plan") &&
    lastBotMessage.includes("Basic") &&
    lastBotMessage.includes("Premium")
  ) {
    return { intent: "sales_flow_interest", entities: { interest: message } };
  }

  // ── Support flow continuation ────────────────────────────────────────
  if (lastBotMessage.includes("What is your name") || lastBotMessage.includes("your name?")) {
    return { intent: "support_flow_name", entities: { name: message } };
  }

  if (lastBotMessage.includes("email address") || lastBotMessage.includes("your email?")) {
    return { intent: "support_flow_email", entities: { email: message } };
  }

  if (lastBotMessage.includes("Which plan") || lastBotMessage.includes("your plan?")) {
    return { intent: "support_flow_plan", entities: { plan: message } };
  }

  if (
    lastBotMessage.includes("describe your problem") ||
    lastBotMessage.includes("What issue")
  ) {
    return { intent: "support_flow_problem", entities: { problem: message } };
  }

  // ── Sales intent ─────────────────────────────────────────────────────
  if (
    lowerMsg.includes("buy") ||
    lowerMsg.includes("purchase") ||
    lowerMsg.includes("subscribe") ||
    lowerMsg.includes("demo") ||
    lowerMsg.includes("trial") ||
    lowerMsg.includes("free trial") ||
    lowerMsg.includes("get started") ||
    lowerMsg.includes("sign up") ||
    lowerMsg.includes("interested") ||
    lowerMsg.includes("start using") ||
    lowerMsg.includes("i want") ||
    (lowerMsg.includes("how") && lowerMsg.includes("start"))
  ) {
    return { intent: "sales_inquiry", entities: {} };
  }

  // ── Support ticket ───────────────────────────────────────────────────
  if (
    lowerMsg.includes("support") ||
    lowerMsg.includes("ticket") ||
    lowerMsg.includes("problem") ||
    lowerMsg.includes("issue") ||
    lowerMsg.includes("help") ||
    lowerMsg.includes("form")
  ) {
    return {
      intent: "create_support_ticket",
      entities: extractSupportInfo(message),
    };
  }

  // Agent creation help
  if (
    lowerMsg.includes("create") &&
    (lowerMsg.includes("agent") || lowerMsg.includes("bot") || lowerMsg.includes("chatbot"))
  ) {
    return { intent: "guide_agent_creation", entities: {} };
  }

  // Agent problem
  if (
    (lowerMsg.includes("agent") || lowerMsg.includes("bot")) &&
    (lowerMsg.includes("not working") ||
      lowerMsg.includes("problem") ||
      lowerMsg.includes("issue") ||
      lowerMsg.includes("error"))
  ) {
    return { intent: "troubleshoot_agent", entities: {} };
  }

  // Plan/pricing inquiry
  if (
    lowerMsg.includes("plan") ||
    lowerMsg.includes("price") ||
    lowerMsg.includes("pricing") ||
    lowerMsg.includes("cost") ||
    lowerMsg.includes("upgrade")
  ) {
    return { intent: "plan_info", entities: {} };
  }

  // Login issues
  if (
    lowerMsg.includes("login") ||
    lowerMsg.includes("signin") ||
    lowerMsg.includes("password") ||
    lowerMsg.includes("account")
  ) {
    return { intent: "login_help", entities: {} };
  }

  // General question
  return { intent: "general_question", entities: {} };
}

// Extract support information from message
function extractSupportInfo(message: string): {
  email?: string;
  name?: string;
  problem?: string;
} {
  const entities: any = {};

  // Extract email (simple regex)
  const emailMatch = message.match(/[\w.-]+@[\w.-]+\.\w+/);
  if (emailMatch) {
    entities.email = emailMatch[0];
  }

  // Extract name (look for patterns like "my name is X" or "I am X")
  const namePatterns = [
    /(?:my name is|i am|i'm|name:)\s+([a-zA-Z\s]+)/i,
    /^([A-Z][a-z]+(?:\s+[A-Z][a-z]+)?)/,
  ];

  for (const pattern of namePatterns) {
    const nameMatch = message.match(pattern);
    if (nameMatch) {
      entities.name = nameMatch[1].trim();
      break;
    }
  }

  // Extract problem description
  const problemKeywords = ["problem", "issue", "error", "not working", "help"];
  for (const keyword of problemKeywords) {
    if (message.toLowerCase().includes(keyword)) {
      // Get text after the keyword
      const parts = message.toLowerCase().split(keyword);
      if (parts[1]) {
        entities.problem = parts[1].trim();
      }
    }
  }

  return entities;
}

// Generate AI response based on intent
function generateResponse(intent: string, entities: any, ticketData: any = {}, salesData: any = {}): string {
  switch (intent) {

    // ── Sales flow ──────────────────────────────────────────────────────
    case "sales_inquiry":
      return `🚀 **Great choice! Let's get you started with AutoBot Studio!**\n\nWe'd love to help you build your first AI chatbot.\n\nFirst, may I have **your name?**`;

    case "sales_flow_name":
      return `Awesome, ${entities.name}! 🎉\n\nWhat's the **best email to reach you?** We'll send your account setup details there.`;

    case "sales_flow_email":
      return `Perfect! ✅\n\nNow, **which plan interests you?**\n\n🆓 **Basic** — Free · 1 agent · 1,000 msgs/month\n⭐ **Medium** — $29/mo · 5 agents · 10K msgs/month\n👑 **Premium** — $99/mo · Unlimited agents & messages\n\nOr type **"not sure"** and I'll recommend one for you!`;

    case "sales_flow_interest":
      const interest = entities.interest?.toLowerCase() || "";
      let recommendation = "";
      if (interest.includes("not sure") || interest.includes("unsure")) {
        recommendation = `Based on most of our users, I'd recommend starting with the **Medium plan** — great value with 5 agents and 10K messages/month! You can always upgrade.`;
      } else if (interest.includes("basic") || interest.includes("free")) {
        recommendation = `The **Basic plan** is perfect for getting started — completely free!`;
      } else if (interest.includes("medium")) {
        recommendation = `The **Medium plan** is our most popular choice — 5 agents and 10K messages for just $29/month!`;
      } else if (interest.includes("premium")) {
        recommendation = `The **Premium plan** is perfect for scaling — unlimited everything for $99/month!`;
      } else {
        recommendation = `The **${entities.interest}** plan sounds great!`;
      }
      return `${recommendation}\n\n✅ **We've saved your details!** Our team will reach out within 24 hours to help you get set up.\n\n🔗 **Ready to start now?** [Sign up here](/signup) — it only takes 2 minutes!\n\nAnything else I can help you with?`;

    // ── Support flow ────────────────────────────────────────────────────
    case "support_flow_name":
      return `Nice to meet you, ${entities.name}! 👋\n\nWhat is your email address?`;

    case "support_flow_email":
      return `Got it! Email: ${entities.email} ✅\n\nWhich plan are you currently using?\n- Basic (Free)\n- Medium ($29/month)\n- Premium ($99/month)`;

    case "support_flow_plan":
      return `Perfect! You're on the **${entities.plan}** plan.\n\nNow, please describe your problem or issue in detail:`;

    case "support_flow_problem":
      return `Thank you for the details!\n\n📝 **Creating your support ticket...**\n\nPlease wait a moment... ⏳`;

    case "create_support_ticket":
      // Check if we have all required info
      if (entities.email && entities.name && entities.problem) {
        return `I'll help you create a support ticket!\n\n📝 **Details I captured:**\n- Name: ${entities.name}\n- Email: ${entities.email}\n- Problem: ${entities.problem}\n\nI'm creating your support ticket now... ✅`;
      } else if (entities.email && entities.name && !entities.problem) {
        // Has name and email, ask for problem
        return `Great! I have your details:\n- Name: ${entities.name} ✅\n- Email: ${entities.email} ✅\n\nNow, please describe your problem or issue in detail:`;
      } else {
        // Start the flow - ask for name first
        return `I'll help you submit a support ticket! 📝\n\nLet's start:\n\n**What is your name?**`;
      }

    case "guide_agent_creation":
      return `🤖 **How to Create an AI Agent:**\n\n1. **Login** to your dashboard\n2. Click **"Create New Agent"** button\n3. Fill in the details:\n   - Agent Name (e.g., "Support Bot")\n   - Description (what it does)\n   - Tone (Friendly, Professional, or Casual)\n4. Click **"Create Agent"**\n5. You'll get an **embed code** to use on your website!\n\n💡 **Tip:** Make sure you haven't reached your plan limit.\n\nNeed help with anything else?`;

    case "troubleshoot_agent":
      return `🔧 **Agent Troubleshooting:**\n\nLet's fix your agent issue! Common solutions:\n\n1. **Check Agent Status:**\n   - Go to Dashboard → Your Agents\n   - Make sure status is "Active" (green)\n   - If inactive, click to activate\n\n2. **Verify Embed Code:**\n   - Copy the latest embed code\n   - Make sure it's properly placed in your website\n\n3. **Check Plan Limits:**\n   - Basic: 1 agent, 1000 msgs/month\n   - Medium: 5 agents, 10K msgs/month\n   - Premium: Unlimited\n\n4. **Clear Browser Cache:**\n   - Hard refresh: Ctrl+Shift+R\n\nStill not working? I can create a support ticket for you! Just tell me your email, name, and the specific issue.`;

    case "plan_info":
      return `💎 **AutoBot Studio Plans:**\n\n**🆓 Basic Plan** (Free)\n- 1 Agent\n- 1,000 messages/month\n- Basic customization\n- Email support\n\n**⭐ Medium Plan** ($29/month)\n- 5 Agents\n- 10,000 messages/month\n- Advanced customization\n- Priority support\n- Custom welcome messages\n- Knowledge base integration\n\n**👑 Premium Plan** ($99/month)\n- Unlimited Agents\n- Unlimited messages\n- Full customization\n- 24/7 Priority support\n- Custom system prompts\n- Webhook integration\n- White-label option\n- API access\n\n🚀 **Ready to upgrade?** Go to Dashboard → Pricing\n\nHave questions about a specific plan?`;

    case "login_help":
      return `🔐 **Login Help:**\n\n**Forgot Password?**\n1. Go to login page\n2. Click "Forgot Password"\n3. Enter your email\n4. Check inbox for reset link\n\n**Can't Login?**\n- Make sure email is correct\n- Check caps lock is off\n- Try resetting password\n- Clear browser cookies\n\n**New User?**\n- Click "Sign Up" to create account\n- Use email/password or Google OAuth\n\n**Still Having Issues?**\nI can create a support ticket for you. Just provide:\n- Your email\n- Your name\n- The specific issue\n\nHow can I help you further?`;

    case "general_question":
    default:
      return `👋 **Welcome to AutoBot Studio!**\n\nI'm your AI assistant. I can help you with:\n\n🤖 **Creating Agents** - Guide you through agent creation\n📊 **Plans & Pricing** - Explain our subscription plans\n🔧 **Troubleshooting** - Fix agent issues\n📝 **Support Tickets** - Submit support requests\n🔐 **Account Help** - Login and account issues\n\n**Quick Actions:**\n- "Create an agent" - Get step-by-step guide\n- "Plan info" - See pricing details\n- "I have a problem" - Get help or create ticket\n\nWhat would you like to know?`;
  }
}

// Main chatbot API
export async function POST(request: NextRequest) {
  try {
    const { message, conversationHistory = [], ticketData = {}, salesData = {} } = await request.json();

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    // Detect intent with conversation context
    const { intent, entities } = detectIntent(message, conversationHistory);

    // Track ticket data across conversation
    let updatedTicketData = { ...ticketData };
    let updatedSalesData = { ...salesData };

    // Handle support flow states
    if (intent === "support_flow_name") {
      updatedTicketData.name = entities.name;
    } else if (intent === "support_flow_email") {
      updatedTicketData.email = entities.email;
    } else if (intent === "support_flow_plan") {
      updatedTicketData.plan = entities.plan;
    } else if (intent === "support_flow_problem") {
      updatedTicketData.problem = entities.problem;
    } else if (intent === "create_support_ticket") {
      updatedTicketData = { ...updatedTicketData, ...entities };
    }

    // Handle sales flow states
    if (intent === "sales_flow_name") {
      updatedSalesData.name = entities.name;
    } else if (intent === "sales_flow_email") {
      updatedSalesData.email = entities.email;
    } else if (intent === "sales_flow_interest") {
      updatedSalesData.interest = entities.interest;
    }

    // Generate response
    let response = generateResponse(intent, entities, updatedTicketData, updatedSalesData);

    // Perform actions based on intent
    let action = null;

    // Create ticket when we have all information
    const hasAllInfo =
      updatedTicketData.name &&
      updatedTicketData.email &&
      updatedTicketData.problem;

    if (
      (intent === "support_flow_problem" || intent === "create_support_ticket") &&
      hasAllInfo
    ) {
      // Auto-create support ticket
      try {
        const supabase = await createClient();
        const {
          data: { user },
        } = await supabase.auth.getUser();

        // Generate unique ticket_id
        const ticketId = `TKT-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

        const ticketPayload = {
          user_id: user?.id || null,
          ticket_id: ticketId,
          name: updatedTicketData.name,
          email: updatedTicketData.email,
          plan: (updatedTicketData.plan?.toLowerCase() || "basic"), // Ensure lowercase
          subject: `Support Request - ${updatedTicketData.plan || "General"} Plan`,
          message: updatedTicketData.problem,
          status: "open",
          priority: "medium",
        };

        const { data: ticket, error } = await supabase
          .from("support_tickets")
          .insert(ticketPayload)
          .select()
          .single();

        if (error) {
          console.error("Error creating ticket:", error);
          response = `⚠️ There was an issue creating the ticket. Please try submitting manually from the support page.\n\nError: ${error.message}`;
        } else {
          response = `✅ **Support Ticket Created Successfully!**\n\n📋 **Ticket Details:**\n- Ticket ID: #${ticket.id}\n- Name: ${updatedTicketData.name}\n- Email: ${updatedTicketData.email}\n- Plan: ${updatedTicketData.plan || "Not specified"}\n- Status: Open\n- Priority: Medium\n\n📧 **Next Steps:**\nOur support team will review your ticket and respond within 24 hours to **${updatedTicketData.email}**\n\nYou can track your ticket status in the Support section of your dashboard.\n\nIs there anything else I can help you with?`;
          action = {
            type: "ticket_created",
            ticket_id: ticket.id,
            ticket_data: updatedTicketData,
          };
          // Clear ticket data after successful submission
          updatedTicketData = {};
        }
      } catch (error) {
        console.error("Ticket creation error:", error);
        response += `\n\n⚠️ Error creating ticket. Please contact support at workb9382@gmail.com`;
      }
    }

    // Save sales lead when interest captured
    if (intent === "sales_flow_interest" && updatedSalesData.email) {
      try {
        const adminSupabase = createAdminClient();
        await adminSupabase.from("sales_leads").insert({
          name: updatedSalesData.name || null,
          email: updatedSalesData.email,
          plan_interest: updatedSalesData.interest || null,
          source: "website_chatbot",
          status: "new",
        });
        // Clear sales data after saving
        updatedSalesData = {};
      } catch (err) {
        console.error("Error saving sales lead:", err);
      }
    }

    // Save conversation to database
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      // Get session ID from headers or generate new one
      const sessionId = request.headers.get("x-session-id") || `session_${Date.now()}`;

      const conversationData = {
        user_id: user?.id || null,
        session_id: sessionId,
        user_message: message,
        bot_response: response,
        detected_intent: intent,
        extracted_entities: entities,
        action_type: action?.type || null,
        action_data: action || null,
        user_email: user?.email || null,
        user_name: user?.user_metadata?.name || null,
      };

      const { error: saveError } = await supabase
        .from("chatbot_conversations")
        .insert(conversationData);

      if (saveError) {
        console.error("Error saving conversation:", saveError);
        // Don't fail the request if saving fails
      } else {
        console.log("✅ Conversation saved to database");
      }
    } catch (saveError) {
      console.error("Error saving to database:", saveError);
      // Continue even if save fails
    }

    return NextResponse.json({
      success: true,
      response,
      intent,
      action,
      ticketData: updatedTicketData,
      salesData: updatedSalesData,
    });
  } catch (error: any) {
    console.error("Chatbot error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process message" },
      { status: 500 }
    );
  }
}
