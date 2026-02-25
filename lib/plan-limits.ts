export const PLAN_LIMITS = {
  basic: {
    agents: 1,
    messages: 100,
    customization: "basic" as const,
    support: "email" as const,
    analytics: false,
    apiAccess: false,
    whiteLabel: false,
    customIntegrations: false,
  },
  medium: {
    agents: 5,
    messages: 1000,
    customization: "advanced" as const,
    support: "priority" as const,
    analytics: true,
    apiAccess: true,
    whiteLabel: false,
    customIntegrations: false,
  },
  premium: {
    agents: Infinity,
    messages: Infinity,
    customization: "full" as const,
    support: "24/7 priority" as const,
    analytics: true,
    apiAccess: true,
    whiteLabel: true,
    customIntegrations: true,
  },
};

export type PlanName = keyof typeof PLAN_LIMITS;
export type PlanFeatures = (typeof PLAN_LIMITS)[PlanName];
