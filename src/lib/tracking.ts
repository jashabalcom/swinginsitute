// Tracking utility for Facebook Pixel and Google Analytics

declare global {
  interface Window {
    fbq: (...args: unknown[]) => void;
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

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
export const trackLead = (source?: string) => {
  trackFBEvent('Lead', { content_name: source || 'strategy_call' });
  trackGAEvent('generate_lead', { event_category: 'engagement', event_label: source });
};

export const trackSignup = (method?: string) => {
  trackFBEvent('CompleteRegistration', { content_name: method || 'email' });
  trackGAEvent('sign_up', { method: method || 'email' });
};

export const trackInitiateCheckout = (tier: string, price: number) => {
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
};

export const trackPurchase = (tier: string, price: number, transactionId?: string) => {
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

export const trackQuizComplete = (profile: string, variant?: string) => {
  trackFBEvent('Lead', { content_name: 'swing_quiz', lead_type: profile, variant });
  trackGAEvent('generate_lead', { method: 'quiz', profile, variant });
};
