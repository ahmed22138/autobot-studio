import Stripe from "stripe";

// Lazy initialization - only created at runtime (not at build time)
let _stripe: Stripe | null = null;

export const stripe = new Proxy({} as Stripe, {
  get(_, prop: string | symbol) {
    if (!_stripe) {
      _stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
        typescript: true,
      });
    }
    return (_stripe as any)[prop];
  },
});
