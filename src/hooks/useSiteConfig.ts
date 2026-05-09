import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
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

export interface SectionStyle {
  paddingTop: number;
  paddingBottom: number;
  gap: number;
  maxWidth: number;
  titleSize: number;
  subtitleSize: number;
  labelSize: number;
  bgColor?: string;
}

export interface AuthPageConfig {
  title: string;
  subtitle: string;
  phoneLabel: string;
  usernameLabel: string;
  buttonText: string;
  successMessage: string;
  errorMessage: string;
  bgColor: string;
  cardBg: string;
  borderColor: string;
  accentColor: string;
  toolbar1: string;
  toolbar2: string;
  authLogo: string;
  authLogoWidth: number;
  authLogoHeight: number;
  gSheetUrl: string;
  referralCodeLabel: string;
  referralCodePlaceholder: string;
  accountLabel: string;
  accountPlaceholder: string;
  nicknameLabel: string;
  nicknamePlaceholder: string;
  passwordLabel: string;
  passwordPlaceholder: string;
  otpButtonText: string;
  otpPlaceholder: string;
  confirmCodeLabel: string;
  confirmCodePlaceholder: string;
  confirmCodeButtonText: string;
  checkbox1Label: string;
  checkbox2Label: string;
  termsLinkText: string;
  termsUrl: string;
  confirmButtonText: string;
  accountValidationText: string;
  passwordShowIcon: string;
  passwordHideIcon: string;
}

export interface SiteConfig {
  logo: string;
  logoWidth: number;
  logoHeight: number;
  heroStyle: SectionStyle;
  howItWorksStyle: SectionStyle;
  featuresStyle: SectionStyle;
  statsStyle: SectionStyle;
  screenshotsStyle: SectionStyle;
  testimonialsStyle: SectionStyle;
  pricingStyle: SectionStyle;
  faqStyle: SectionStyle;
  contactStyle: SectionStyle;
  footerStyle: SectionStyle;
  nav: {
    howItWorks: string;
    features: string;
    pricing: string;
    contact: string;
  };
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
  authRegister: AuthPageConfig;
  authLogin: AuthPageConfig;
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

const STORAGE_KEY = 'salekit_site_config_v3';

function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = { ...target };
  for (const key in source) {
    if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
      result[key] = deepMerge(
        (target[key] as Record<string, unknown>) || {},
        source[key] as Record<string, unknown>
      );
    } else {
      result[key] = source[key];
    }
  }
  return result;
}

function mergeWithDefault(stored: Record<string, unknown>): SiteConfig {
  const merged = deepMerge(defaultSiteConfig as unknown as Record<string, unknown>, stored);
  return merged as SiteConfig;
}

export function useSiteConfig() {
  const [config, setConfigState] = useState<SiteConfig>(() => {
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as Record<string, unknown>;
        return mergeWithDefault(parsed);
      }
    } catch { /* ignore */ }
    return mergeWithDefault({});
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const configRef = useRef<SiteConfig>(config);
  const lastFetchRef = useRef(0);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const fetchConfig = useCallback(async (sourceHint?: string) => {
    const now = Date.now();
    if (now - lastFetchRef.current < 500) return { source: 'throttled', config: configRef.current };
    lastFetchRef.current = now;
    setLoading(true);
    console.log(`[fetchConfig] START source=${sourceHint}`);

    let merged: SiteConfig | null = null;
    let source = 'default';

    // 1. ALWAYS try localStorage FIRST — it has the freshest data (saved before DB call)
    try {
      const cached = localStorage.getItem(STORAGE_KEY);
      if (cached) {
        const parsed = JSON.parse(cached) as Record<string, unknown>;
        merged = mergeWithDefault(parsed);
        source = 'localStorage';
        console.log('[fetchConfig] Loaded from localStorage (primary source)');
      }
    } catch { /* ignore */ }

    // 2. Fallback to DB only if localStorage is empty
    if (!merged) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 8000);

        const { data, error: dbError } = await supabase
          .from('site_config')
          .select('config_data')
          .eq('id', 1)
          .abortSignal(controller.signal)
          .maybeSingle();

        clearTimeout(timeoutId);

        if (!dbError && data?.config_data) {
          const parsed = data.config_data as Record<string, unknown>;
          merged = mergeWithDefault(parsed);
          source = 'db';
          console.log('[fetchConfig] Loaded from DB');
          // Also cache to localStorage for next time
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
          } catch { /* ignore */ }
        } else if (dbError) {
          console.warn('[fetchConfig] DB error:', dbError.message);
        }
      } catch (err) {
        console.warn('[fetchConfig] DB fetch failed:', (err as Error).message);
      }
    }

    // 3. Final fallback to default
    if (!merged) {
      merged = mergeWithDefault({});
      source = 'default';
      console.log('[fetchConfig] Using default config');
    }

    setConfigState(merged);
    configRef.current = merged;
    setError(null);
    setLoading(false);
    console.log('[fetchConfig] END source=' + source);
    return { source, config: merged };
  }, []);

  useEffect(() => {
    fetchConfig('initial');
  }, [fetchConfig]);

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'salekit_sync_trigger') {
        console.log('[useSiteConfig] Sync trigger from another tab');
        fetchConfig('cross-tab');
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [fetchConfig]);

  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) {
        fetchConfig('visibility');
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [fetchConfig]);

  useEffect(() => {
    if (!loading) {
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(config)); } catch { /* ignore */ }
    }
  }, [config, loading]);

  const setConfigWithVersion = useCallback((updater: SiteConfig | ((prev: SiteConfig) => SiteConfig)) => {
    setConfigState((prev) => {
      const newConfig = typeof updater === 'function'
        ? (updater as (prev: SiteConfig) => SiteConfig)(prev)
        : { ...prev, ...updater };
      const merged = mergeWithDefault(newConfig as unknown as Record<string, unknown>);
      configRef.current = merged;
      return merged;
    });
  }, []);

  const setConfig = useCallback((newConfig: Partial<SiteConfig>) => {
    setConfigWithVersion((prev) => ({ ...prev, ...newConfig }));
  }, [setConfigWithVersion]);

  const updateHero = useCallback((hero: Partial<SiteConfig['hero']>) => {
    setConfigWithVersion((prev) => ({ ...prev, hero: { ...prev.hero, ...hero } }));
  }, [setConfigWithVersion]);

  const updateHowItWorks = useCallback((howItWorks: Partial<SiteConfig['howItWorks']>) => {
    setConfigWithVersion((prev) => ({ ...prev, howItWorks: { ...prev.howItWorks, ...howItWorks } }));
  }, [setConfigWithVersion]);

  const updateHowItWorksItem = useCallback((index: number, item: Partial<HowItWorkItem>) => {
    setConfigWithVersion((prev) => {
      const items = [...prev.howItWorks.items];
      items[index] = { ...items[index], ...item };
      return { ...prev, howItWorks: { ...prev.howItWorks, items } };
    });
  }, [setConfigWithVersion]);

  const updateFeatureItem = useCallback((index: number, item: Partial<FeatureItem>) => {
    setConfigWithVersion((prev) => {
      const items = [...prev.features.items];
      items[index] = { ...items[index], ...item };
      return { ...prev, features: { ...prev.features, items } };
    });
  }, [setConfigWithVersion]);

  const updateStatsItem = useCallback((index: number, stat: Partial<StatItem>) => {
    setConfigWithVersion((prev) => {
      const items = [...prev.stats.items];
      items[index] = { ...items[index], ...stat };
      return { ...prev, stats: { ...prev.stats, items } };
    });
  }, [setConfigWithVersion]);

  const updateScreenshotItem = useCallback((index: number, screenshot: Partial<ScreenshotItem>) => {
    setConfigWithVersion((prev) => {
      const items = [...prev.screenshots.items];
      items[index] = { ...items[index], ...screenshot };
      return { ...prev, screenshots: { ...prev.screenshots, items } };
    });
  }, [setConfigWithVersion]);

  const updateTestimonialItem = useCallback((index: number, testimonial: Partial<TestimonialItem>) => {
    setConfigWithVersion((prev) => {
      const items = [...prev.testimonials.items];
      items[index] = { ...items[index], ...testimonial };
      return { ...prev, testimonials: { ...prev.testimonials, items } };
    });
  }, [setConfigWithVersion]);

  const updatePricingItem = useCallback((index: number, pricing: Partial<PricingItem>) => {
    setConfigWithVersion((prev) => {
      const items = [...prev.pricing.items];
      items[index] = { ...items[index], ...pricing };
      return { ...prev, pricing: { ...prev.pricing, items } };
    });
  }, [setConfigWithVersion]);

  const updateFAQItem = useCallback((index: number, faq: Partial<FAQItem>) => {
    setConfigWithVersion((prev) => {
      const items = [...prev.faq.items];
      items[index] = { ...items[index], ...faq };
      return { ...prev, faq: { ...prev.faq, items } };
    });
  }, [setConfigWithVersion]);

  const updateContact = useCallback((contact: Partial<SiteConfig['contact']>) => {
    setConfigWithVersion((prev) => ({ ...prev, contact: { ...prev.contact, ...contact } }));
  }, [setConfigWithVersion]);

  const updateFooter = useCallback((footer: Partial<SiteConfig['footer']>) => {
    setConfigWithVersion((prev) => ({ ...prev, footer: { ...prev.footer, ...footer } }));
  }, [setConfigWithVersion]);

  const updateNav = useCallback((nav: Partial<SiteConfig['nav']>) => {
    setConfigWithVersion((prev) => ({ ...prev, nav: { ...prev.nav, ...nav } }));
  }, [setConfigWithVersion]);

  const updateAuthRegister = useCallback((auth: Partial<AuthPageConfig>) => {
    setConfigWithVersion((prev) => ({ ...prev, authRegister: { ...prev.authRegister, ...auth } }));
  }, [setConfigWithVersion]);

  const updateAuthLogin = useCallback((auth: Partial<AuthPageConfig>) => {
    setConfigWithVersion((prev) => ({ ...prev, authLogin: { ...prev.authLogin, ...auth } }));
  }, [setConfigWithVersion]);

  const updateHeroStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfigWithVersion((prev) => ({ ...prev, heroStyle: { ...prev.heroStyle, ...style } }));
  }, [setConfigWithVersion]);

  const updateHowItWorksStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfigWithVersion((prev) => ({ ...prev, howItWorksStyle: { ...prev.howItWorksStyle, ...style } }));
  }, [setConfigWithVersion]);

  const updateFeaturesStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfigWithVersion((prev) => ({ ...prev, featuresStyle: { ...prev.featuresStyle, ...style } }));
  }, [setConfigWithVersion]);

  const updateStatsStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfigWithVersion((prev) => ({ ...prev, statsStyle: { ...prev.statsStyle, ...style } }));
  }, [setConfigWithVersion]);

  const updateScreenshotsStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfigWithVersion((prev) => ({ ...prev, screenshotsStyle: { ...prev.screenshotsStyle, ...style } }));
  }, [setConfigWithVersion]);

  const updateTestimonialsStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfigWithVersion((prev) => ({ ...prev, testimonialsStyle: { ...prev.testimonialsStyle, ...style } }));
  }, [setConfigWithVersion]);

  const updateFAQStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfigWithVersion((prev) => ({ ...prev, faqStyle: { ...prev.faqStyle, ...style } }));
  }, [setConfigWithVersion]);

  const updateContactStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfigWithVersion((prev) => ({ ...prev, contactStyle: { ...prev.contactStyle, ...style } }));
  }, [setConfigWithVersion]);

  const updateFooterStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfigWithVersion((prev) => ({ ...prev, footerStyle: { ...prev.footerStyle, ...style } }));
  }, [setConfigWithVersion]);

  const resetConfig = useCallback(() => {
    const reset = { ...defaultSiteConfig };
    setConfigState(reset);
    configRef.current = reset;
    localStorage.removeItem(STORAGE_KEY);
    // Also clear DB on reset
    supabase.from('site_config').delete().eq('id', 1).then(({ error }) => {
      if (error) console.warn('[resetConfig] DB clear error:', error.message);
    });
  }, []);

  // Save to localStorage (primary) + DB (background sync)
  const saveToDatabase = useCallback(async (data?: SiteConfig) => {
    const configToSave = data ?? configRef.current;
    console.log('[saveToDatabase] START');

    // Always save to localStorage first (fast, reliable)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(configToSave));
      localStorage.setItem('salekit_sync_trigger', String(Date.now()));
    } catch { /* ignore */ }

    // Then try DB in background (for cross-device sync)
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);

      const { error: upsertError } = await supabase
        .from('site_config')
        .upsert(
          {
            id: 1,
            config_data: configToSave,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        )
        .abortSignal(controller.signal);

      clearTimeout(timeoutId);

      if (upsertError) {
        console.warn('[saveToDatabase] DB upsert error:', upsertError.message);
        return { success: true, error: null, localOnly: true };
      }

      console.log('[saveToDatabase] END success — saved to DB + localStorage');
      return { success: true, error: null, localOnly: false };
    } catch (err) {
      console.warn('[saveToDatabase] DB save failed:', (err as Error).message);
      // Still success because localStorage saved
      return { success: true, error: null, localOnly: true };
    }
  }, []);

  return {
    config,
    loading,
    error,
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
    updateNav,
    updateAuthRegister,
    updateAuthLogin,
    updateHeroStyle,
    updateHowItWorksStyle,
    updateFeaturesStyle,
    updateStatsStyle,
    updateScreenshotsStyle,
    updateTestimonialsStyle,
    updateFAQStyle,
    updateContactStyle,
    updateFooterStyle,
    resetConfig,
    saveToDatabase,
    fetchConfig,
  };
}