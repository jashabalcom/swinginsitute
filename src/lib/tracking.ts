// Tracking utility for Facebook Pixel, Google Analytics, and Google Ads
// Note: Window.fbq type is declared in FacebookPixel.tsx

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// Google Ads Conversion ID
const GOOGLE_ADS_ID = 'AW-667308121';

// Google Ads Conversion Labels
const CONVERSION_LABELS = {
  PURCHASE: 'oQV-COSBkO0bENmgmb4C', // Purchase conversion
  QUIZ_LEAD: 'quiz_lead_label', // Replace with your actual label from Google Ads
  SIGNUP: 'signup_label', // Replace with your actual label from Google Ads
} as const;

// User data interface for Enhanced Conversions
export interface EnhancedConversionData {
  email?: string;
  phone?: string;
  firstName?: string;
  lastName?: string;
  address?: {
    street?: string;
    city?: string;
    region?: string;
    postalCode?: string;
    country?: string;
  };
}

// SHA-256 hashing for Enhanced Conversions
async function sha256Hash(value: string): Promise<string> {
  const normalized = value.toLowerCase().trim();
  const encoder = new TextEncoder();
  const data = encoder.encode(normalized);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Prepare hashed user data for Enhanced Conversions
async function prepareEnhancedUserData(userData?: EnhancedConversionData): Promise<Record<string, unknown> | undefined> {
  if (!userData) return undefined;
  
  const hashedData: Record<string, unknown> = {};
  
  if (userData.email) {
    hashedData.sha256_email_address = await sha256Hash(userData.email);
  }
  
  if (userData.phone) {
    // Normalize phone: remove spaces, dashes, parentheses
    const normalizedPhone = userData.phone.replace(/[\s\-\(\)]/g, '');
    hashedData.sha256_phone_number = await sha256Hash(normalizedPhone);
  }
  
  if (userData.firstName) {
    hashedData.sha256_first_name = await sha256Hash(userData.firstName);
  }
  
  if (userData.lastName) {
    hashedData.sha256_last_name = await sha256Hash(userData.lastName);
  }
  
  if (userData.address) {
    if (userData.address.street) {
      hashedData.sha256_street = await sha256Hash(userData.address.street);
    }
    if (userData.address.city) {
      hashedData.city = userData.address.city;
    }
    if (userData.address.region) {
      hashedData.region = userData.address.region;
    }
    if (userData.address.postalCode) {
      hashedData.postal_code = userData.address.postalCode;
    }
    if (userData.address.country) {
      hashedData.country = userData.address.country;
    }
  }
  
  return Object.keys(hashedData).length > 0 ? hashedData : undefined;
}

// Google Ads conversion tracking with Enhanced Conversions support
export const trackGoogleAdsConversion = async (
  conversionLabel: string, 
  value?: number, 
  transactionId?: string,
  userData?: EnhancedConversionData
) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const conversionData: Record<string, unknown> = {
      send_to: `${GOOGLE_ADS_ID}/${conversionLabel}`,
      value: value,
      currency: 'USD',
      transaction_id: transactionId,
    };
    
    // Add Enhanced Conversion data if provided
    const hashedUserData = await prepareEnhancedUserData(userData);
    if (hashedUserData) {
      conversionData.user_data = hashedUserData;
    }
    
    window.gtag('event', 'conversion', conversionData);
  }
};

export { CONVERSION_LABELS };

// Facebook Pixel tracking
export const trackFBEvent = (event: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', event, params);
  }
};

export const trackFBCustomEvent = (event: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('trackCustom', event, params);
  }
};

// Google Analytics tracking
export const trackGAEvent = (event: string, params?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', event, params);
  }
};

// ViewContent tracking for high-value pages
export const trackViewContent = (contentName: string, contentId?: string, value?: number) => {
  trackFBEvent('ViewContent', {
    content_name: contentName,
    content_ids: contentId ? [contentId] : undefined,
    content_type: 'product',
    value,
    currency: 'USD'
  });
  trackGAEvent('view_item', {
    content_name: contentName,
    content_id: contentId,
    value,
    currency: 'USD'
  });
};

// Schedule/booking event
export const trackSchedule = (eventName: string, value?: number) => {
  trackFBEvent('Schedule', { content_name: eventName, value, currency: 'USD' });
  trackGAEvent('schedule', { event_name: eventName, value });
};

// Add to cart for package selection
export const trackAddToCart = (productName: string, price: number, productId?: string) => {
  trackFBEvent('AddToCart', {
    content_name: productName,
    content_ids: productId ? [productId] : undefined,
    value: price,
    currency: 'USD'
  });
  trackGAEvent('add_to_cart', {
    currency: 'USD',
    value: price,
    items: [{ item_name: productName, price }]
  });
};

// Conversion tracking helpers
export const trackLead = (source?: string, conversionLabel?: string, userData?: EnhancedConversionData) => {
  trackFBEvent('Lead', { content_name: source || 'strategy_call' });
  trackGAEvent('generate_lead', { event_category: 'engagement', event_label: source });
  // Google Ads Lead conversion - use provided label or default
  if (conversionLabel) {
    trackGoogleAdsConversion(conversionLabel, undefined, undefined, userData);
  }
};

export const trackSignup = (method?: string, conversionLabel?: string, userData?: EnhancedConversionData) => {
  trackFBEvent('CompleteRegistration', { content_name: method || 'email' });
  trackGAEvent('sign_up', { method: method || 'email' });
  // Google Ads signup conversion with Enhanced Conversions - always fire
  trackGoogleAdsConversion(conversionLabel || CONVERSION_LABELS.SIGNUP, undefined, undefined, userData);
};

export const trackInitiateCheckout = (tier: string, price: number, conversionLabel?: string, userData?: EnhancedConversionData) => {
  trackFBEvent('InitiateCheckout', {
    content_name: tier,
    value: price,
    currency: 'USD'
  });
  trackGAEvent('begin_checkout', {
    currency: 'USD',
    value: price,
    items: [{ item_name: tier }]
  });
  // Google Ads checkout conversion
  if (conversionLabel) {
    trackGoogleAdsConversion(conversionLabel, price, undefined, userData);
  }
};

export const trackPurchase = (tier: string, price: number, transactionId?: string, conversionLabel?: string, userData?: EnhancedConversionData) => {
  trackFBEvent('Purchase', {
    content_name: tier,
    value: price,
    currency: 'USD'
  });
  trackFBEvent('Subscribe', {
    value: price,
    currency: 'USD',
    predicted_ltv: price * 12
  });
  trackGAEvent('purchase', {
    transaction_id: transactionId,
    value: price,
    currency: 'USD',
    items: [{ item_name: tier }]
  });
  // Google Ads purchase conversion with Enhanced Conversions
  trackGoogleAdsConversion(CONVERSION_LABELS.PURCHASE, price, transactionId, userData);
};

export const trackPageView = (path: string) => {
  trackFBEvent('PageView');
  trackGAEvent('page_view', { page_path: path });
};

// Quiz funnel tracking
export const trackQuizStart = (variant?: string) => {
  trackFBCustomEvent('QuizStart', { quiz_name: 'swing_assessment', variant });
  trackGAEvent('quiz_start', { quiz_name: 'swing_assessment', variant });
};

export const trackQuizStep = (step: number) => {
  trackFBCustomEvent('QuizProgress', { step, quiz_name: 'swing_assessment' });
  trackGAEvent('quiz_progress', { step, quiz_name: 'swing_assessment' });
};

export const trackQuizComplete = (profile: string, variant?: string, userData?: EnhancedConversionData) => {
  trackFBEvent('Lead', { content_name: 'swing_quiz', lead_type: profile, variant });
  trackGAEvent('generate_lead', { method: 'quiz', profile, variant });
  // Google Ads quiz lead conversion with Enhanced Conversions - always fire
  trackGoogleAdsConversion(CONVERSION_LABELS.QUIZ_LEAD, undefined, undefined, userData);
};
