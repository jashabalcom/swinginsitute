// Stripe product and price configuration for booking system

export const STRIPE_PRICES = {
  // Single Lessons
  SINGLE_LESSON: {
    priceId: "price_1SrOhyBMMWTvlQ8HVKIYMzoJ",
    productId: "prod_Tp2nnDT2gdAtxs",
    name: "Single Private Lesson",
    basePrice: 145,
    memberPrice: 115,
    sessions: 1,
  },

  // Lesson Packages
  PACKAGE_3: {
    priceId: "price_1SrOjnBMMWTvlQ8HD4DBXjyF",
    productId: "prod_Tp2pZybeOOoEhq",
    name: "3-Lesson Package",
    basePrice: 400,
    memberPrice: 345,
    sessions: 3,
    validityDays: 90,
    savings: 35,
  },
  PACKAGE_6: {
    priceId: "price_1SrOk4BMMWTvlQ8HX0jcKQxH",
    productId: "prod_Tp2pE7QdK9VryM",
    name: "6-Lesson Package",
    basePrice: 725,
    memberPrice: 630,
    sessions: 6,
    validityDays: 180,
    savings: 145,
  },
} as const;

export const LESSON_PACKAGES = [
  STRIPE_PRICES.PACKAGE_3,
  STRIPE_PRICES.PACKAGE_6,
];

// Service type constants
export const SERVICE_TYPES = {
  PRIVATE_LESSON: "lesson",
  GROUP_CLASS: "class",
  CAMP: "camp",
  ASSESSMENT: "assessment",
} as const;

// Membership tier configuration
export const MEMBERSHIP_TIERS = {
  community: {
    name: "Community",
    priceId: "price_1SrWckBMMWTvlQ8HUb8t1fG5",
    productId: "prod_TpAynmYe2OSTKN",
    price: 49,
    swingReviews: 0,
    feedbackTime: null,
    lessonRate: 145,
    inPersonCredits: 0,
    features: [
      "Full Training Room access",
      "Post, comment, and react",
      "Direct messaging with members",
      "Events calendar access",
      "Monthly workshops",
    ],
  },
  starter: {
    name: "Starter",
    priceId: "price_1SrQj8BMMWTvlQ8HaxQbr9aC",
    productId: "prod_Tp4siVSGD0PG7k",
    price: 99,
    swingReviews: 2,
    feedbackTime: "72hr",
    lessonRate: 145,
    inPersonCredits: 0,
    features: [
      "Phase-based training curriculum",
      "2 swing reviews per month",
      "Training Room community access",
      "Weekly action plans",
      "Mobile-friendly platform",
    ],
  },
  pro: {
    name: "Pro",
    priceId: "price_1SrQj9BMMWTvlQ8HyXH9jaFo",
    productId: "prod_Tp4sKzTi2pyda4",
    price: 199,
    swingReviews: 4,
    feedbackTime: "48hr",
    lessonRate: 115,
    inPersonCredits: 0,
    features: [
      "Everything in Starter",
      "4 swing reviews per month",
      "Priority feedback (48hr)",
      "Inner Diamond mindset program",
      "Monthly live Q&A with Coach",
      "Discounted lesson rate ($115/hr)",
    ],
  },
  elite: {
    name: "Elite",
    priceId: "price_1SrQjBBMMWTvlQ8Hqd52Rcg7",
    productId: "prod_Tp4sXGo0L4c2bn",
    price: 299,
    swingReviews: -1, // Unlimited
    feedbackTime: "24hr",
    lessonRate: 115,
    inPersonCredits: 0,
    features: [
      "Everything in Pro",
      "Unlimited swing reviews",
      "24hr priority feedback",
      "1 monthly Zoom call with Coach",
      "Personalized phase progression",
      "College recruiting guidance",
    ],
  },
  "hybrid-core": {
    name: "Hybrid Core",
    priceId: "price_1SrQjDBMMWTvlQ8H1n3QbNY7",
    productId: "prod_Tp4s6jRZcg949u",
    price: 279,
    swingReviews: 4,
    feedbackTime: "48hr",
    lessonRate: 115,
    inPersonCredits: 1,
    features: [
      "Full Pro online membership",
      "1 in-person credit per month",
      "Discounted rate ($115/hr)",
      "Priority booking",
      "Training Room community",
    ],
  },
  "hybrid-pro": {
    name: "Hybrid Pro",
    priceId: "price_1SrQjFBMMWTvlQ8HelHr8Zdj",
    productId: "prod_Tp4t69jx1LlFu7",
    price: 449,
    swingReviews: -1,
    feedbackTime: "24hr",
    lessonRate: 115,
    inPersonCredits: 2,
    features: [
      "Full Elite online membership",
      "2 in-person credits per month",
      "Discounted rate ($115/hr)",
      "VIP priority booking",
      "Quarterly progress assessment",
      "Direct messaging with Coach",
    ],
  },
} as const;

// Helper to get hybrid credits for a tier
export const getHybridCredits = (tier: MembershipTier): number => {
  return MEMBERSHIP_TIERS[tier]?.inPersonCredits || 0;
};

export type MembershipTier = keyof typeof MEMBERSHIP_TIERS;

// Helper to get tier by product ID
export const getTierByProductId = (productId: string): MembershipTier | null => {
  for (const [key, tier] of Object.entries(MEMBERSHIP_TIERS)) {
    if (tier.productId === productId) {
      return key as MembershipTier;
    }
  }
  return null;
};

// Helper to get tier by price ID
export const getTierByPriceId = (priceId: string): MembershipTier | null => {
  for (const [key, tier] of Object.entries(MEMBERSHIP_TIERS)) {
    if (tier.priceId === priceId) {
      return key as MembershipTier;
    }
  }
  return null;
};
