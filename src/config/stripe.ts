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
  PACKAGE_12: {
    priceId: "price_1SrOkCBMMWTvlQ8Ho9nuxziM",
    productId: "prod_Tp2pUYu4EmGjeu",
    name: "12-Lesson Package",
    basePrice: 1305,
    memberPrice: 1145,
    sessions: 12,
    validityDays: 365,
    savings: 435,
  },
} as const;

export const LESSON_PACKAGES = [
  STRIPE_PRICES.PACKAGE_3,
  STRIPE_PRICES.PACKAGE_6,
  STRIPE_PRICES.PACKAGE_12,
];

// Service type constants
export const SERVICE_TYPES = {
  PRIVATE_LESSON: "lesson",
  GROUP_CLASS: "class",
  CAMP: "camp",
  ASSESSMENT: "assessment",
} as const;
