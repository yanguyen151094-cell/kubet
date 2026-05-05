import { useState, useEffect, useCallback } from 'react';
import { defaultSiteConfig } from '@/mocks/siteConfig';

export interface HowItWorkItem {
  title: string;
  description: string;
  icon: string;
}

export interface FeatureItem {
  title: string;
  description: string;
  bullets: string[];
  image: string;
  imagePosition: 'left' | 'right';
}

export interface StatItem {
  value: string;
  label: string;
}

export interface ScreenshotItem {
  image: string;
  alt: string;
}

export interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  avatar: string;
}

export interface PricingItem {
  name: string;
  price: string;
  period: string;
  features: string[];
  buttonText: string;
  highlighted: boolean;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SiteConfig {
  logo: string;
  logoWidth: number;
  logoHeight: number;
  hero: {
    title: string;
    subtitle: string;
    buttonText: string;
    phoneImage: string;
    logoImage: string;
  };
  howItWorks: {
    label: string;
    title: string;
    subtitle: string;
    items: HowItWorkItem[];
  };
  features: {
    label: string;
    title: string;
    subtitle: string;
    items: FeatureItem[];
  };
  stats: {
    items: StatItem[];
  };
  screenshots: {
    label: string;
    title: string;
    subtitle: string;
    items: ScreenshotItem[];
  };
  testimonials: {
    label: string;
    title: string;
    subtitle: string;
    items: TestimonialItem[];
  };
  pricing: {
    label: string;
    title: string;
    subtitle: string;
    items: PricingItem[];
  };
  faq: {
    label: string;
    title: string;
    subtitle: string;
    items: FAQItem[];
    image: string;
  };
  contact: {
    title: string;
    subtitle: string;
    description: string;
    formImage: string;
  };
  footer: {
    logo: string;
    address: string;
    phone: string;
    email: string;
    links1: string[];
    links2: string[];
    appStoreImage: string;
    playStoreImage: string;
    copyright: string;
  };
}

const STORAGE_KEY = 'salekit_site_config';

function loadConfig(): SiteConfig {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...defaultSiteConfig, ...JSON.parse(stored) };
    }
  } catch {
    // ignore parse errors
  }
  return defaultSiteConfig;
}

export function useSiteConfig() {
  const [config, setConfigState] = useState<SiteConfig>(loadConfig);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    } catch {
      // ignore storage errors
    }
  }, [config]);

  const setConfig = useCallback((newConfig: Partial<SiteConfig>) => {
    setConfigState((prev) => ({ ...prev, ...newConfig }));
  }, []);

  const updateHero = useCallback((hero: Partial<SiteConfig['hero']>) => {
    setConfigState((prev) => ({ ...prev, hero: { ...prev.hero, ...hero } }));
  }, []);

  const updateHowItWorks = useCallback((howItWorks: Partial<SiteConfig['howItWorks']>) => {
    setConfigState((prev) => ({ ...prev, howItWorks: { ...prev.howItWorks, ...howItWorks } }));
  }, []);

  const updateHowItWorksItem = useCallback((index: number, item: Partial<HowItWorkItem>) => {
    setConfigState((prev) => {
      const items = [...prev.howItWorks.items];
      items[index] = { ...items[index], ...item };
      return { ...prev, howItWorks: { ...prev.howItWorks, items } };
    });
  }, []);

  const updateFeatureItem = useCallback((index: number, item: Partial<FeatureItem>) => {
    setConfigState((prev) => {
      const items = [...prev.features.items];
      items[index] = { ...items[index], ...item };
      return { ...prev, features: { ...prev.features, items } };
    });
  }, []);

  const updateStatsItem = useCallback((index: number, stat: Partial<StatItem>) => {
    setConfigState((prev) => {
      const items = [...prev.stats.items];
      items[index] = { ...items[index], ...stat };
      return { ...prev, stats: { ...prev.stats, items } };
    });
  }, []);

  const updateScreenshotItem = useCallback((index: number, screenshot: Partial<ScreenshotItem>) => {
    setConfigState((prev) => {
      const items = [...prev.screenshots.items];
      items[index] = { ...items[index], ...screenshot };
      return { ...prev, screenshots: { ...prev.screenshots, items } };
    });
  }, []);

  const updateTestimonialItem = useCallback((index: number, testimonial: Partial<TestimonialItem>) => {
    setConfigState((prev) => {
      const items = [...prev.testimonials.items];
      items[index] = { ...items[index], ...testimonial };
      return { ...prev, testimonials: { ...prev.testimonials, items } };
    });
  }, []);

  const updatePricingItem = useCallback((index: number, pricing: Partial<PricingItem>) => {
    setConfigState((prev) => {
      const items = [...prev.pricing.items];
      items[index] = { ...items[index], ...pricing };
      return { ...prev, pricing: { ...prev.pricing, items } };
    });
  }, []);

  const updateFAQItem = useCallback((index: number, faq: Partial<FAQItem>) => {
    setConfigState((prev) => {
      const items = [...prev.faq.items];
      items[index] = { ...items[index], ...faq };
      return { ...prev, faq: { ...prev.faq, items } };
    });
  }, []);

  const updateContact = useCallback((contact: Partial<SiteConfig['contact']>) => {
    setConfigState((prev) => ({ ...prev, contact: { ...prev.contact, ...contact } }));
  }, []);

  const updateFooter = useCallback((footer: Partial<SiteConfig['footer']>) => {
    setConfigState((prev) => ({ ...prev, footer: { ...prev.footer, ...footer } }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfigState(defaultSiteConfig);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    config,
    setConfig,
    updateHero,
    updateHowItWorks,
    updateHowItWorksItem,
    updateFeatureItem,
    updateStatsItem,
    updateScreenshotItem,
    updateTestimonialItem,
    updatePricingItem,
    updateFAQItem,
    updateContact,
    updateFooter,
    resetConfig,
  };
}