import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";
import Stripe from "stripe";

const supabaseAdmin = createAdminClient();

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json(
      { error: "Invalid signature" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.supabase_user_id;
        const subscriptionId = session.subscription as string;

        if (!userId || !subscriptionId) break;

        // Fetch the subscription to get price/plan details
        const stripeSubscription =
          await stripe.subscriptions.retrieve(subscriptionId);
        const subscriptionItem = stripeSubscription.items.data[0];
        const priceId = subscriptionItem?.price.id;
        const plan = getPlanFromPriceId(priceId);

        await supabaseAdmin
          .from("subscriptions")
          .update({
            stripe_subscription_id: subscriptionId,
            stripe_customer_id: session.customer as string,
            plan,
            status: "active",
            current_period_start: new Date(
              subscriptionItem.current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              subscriptionItem.current_period_end * 1000
            ).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", userId);

        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;
        const subItem = subscription.items.data[0];
        const priceId = subItem?.price.id;
        const plan = getPlanFromPriceId(priceId);

        await supabaseAdmin
          .from("subscriptions")
          .update({
            plan,
            status: subscription.status === "active" ? "active" : "past_due",
            cancel_at_period_end: subscription.cancel_at_period_end,
            current_period_start: new Date(
              subItem.current_period_start * 1000
            ).toISOString(),
            current_period_end: new Date(
              subItem.current_period_end * 1000
            ).toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        // Revert to basic plan
        await supabaseAdmin
          .from("subscriptions")
          .update({
            plan: "basic",
            status: "active",
            stripe_subscription_id: null,
            cancel_at_period_end: false,
            current_period_start: null,
            current_period_end: null,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "past_due",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_customer_id", customerId);

        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}

function getPlanFromPriceId(priceId: string): string {
  if (priceId === process.env.STRIPE_MEDIUM_PRICE_ID) return "medium";
  if (priceId === process.env.STRIPE_PREMIUM_PRICE_ID) return "premium";
  return "basic";
}
