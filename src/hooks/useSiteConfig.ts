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
  _dbVersion?: number;
  logo: string;
  logoWidth: number;
  logoHeight: number;
  heroStyle: SectionStyle;
  howItWorksStyle: SectionStyle;
  featuresStyle: SectionStyle;
  statsStyle: SectionStyle;
  screenshotsStyle: SectionStyle;
  testimonialsStyle: SectionStyle;
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
const DB_TS_KEY = 'salekit_db_timestamp';

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

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    ),
  ]);
}

function isEmptyConfigData(data: unknown): boolean {
  if (!data) return true;
  if (typeof data !== 'object') return true;
  if (Array.isArray(data)) return data.length === 0;
  return Object.keys(data).length === 0;
}

export function useSiteConfig() {
  // State: always starts from default merged with localStorage
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
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dbEnabledRef = useRef(true);
  const refreshCountRef = useRef(0);
  const configRef = useRef<SiteConfig>(config);
  const dbVersionRef = useRef<number>(0);
  const savedLocallyRef = useRef(false);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  // CORE: fetch config from DB — DB is the source of truth
  const fetchConfig = useCallback(async (sourceHint?: string) => {
    refreshCountRef.current += 1;
    const rc = refreshCountRef.current;
    setLoading(true);

    let dbTimestamp = 0;
    let dbData: Record<string, unknown> | null = null;

    try {
      const { data, error: dbError } = await withTimeout(
        supabase
          .from('site_config')
          .select('config_data, updated_at')
          .eq('id', 1)
          .maybeSingle(),
        5000
      );

      if (dbError) {
        console.error('[useSiteConfig] DB error #' + rc + ':', dbError.message, sourceHint);
        setError(dbError.message);
        dbEnabledRef.current = false;
      } else if (data && !isEmptyConfigData(data.config_data)) {
        dbTimestamp = new Date(data.updated_at as string).getTime();
        dbData = data.config_data as Record<string, unknown>;
        dbEnabledRef.current = true;
        setError(null);
        // Remember DB version for comparison
        dbVersionRef.current = dbTimestamp;
        // Save DB timestamp
        try { localStorage.setItem(DB_TS_KEY, String(dbTimestamp)); } catch { /* ignore */ }
        console.log('[useSiteConfig] DB loaded #' + rc + ' | updated_at:', new Date(dbTimestamp).toLocaleTimeString(), '| sourceHint:', sourceHint);
      } else {
        console.log('[useSiteConfig] DB empty or null #' + rc);
      }
    } catch (err) {
      console.error('[useSiteConfig] Load error #' + rc + ':', err);
      dbEnabledRef.current = false;
    }

    if (dbData) {
      const merged = mergeWithDefault(dbData);
      merged._dbVersion = dbTimestamp;

      // Always trust DB data on initial load and when cross-tab sync
      // Only skip if this SAME tab just saved (within 3 seconds)
      const localTs = Number(localStorage.getItem(DB_TS_KEY)) || 0;
      const justSaved = savedLocallyRef.current && Math.abs(localTs - dbTimestamp) < 3000;

      if (justSaved) {
        console.log('[useSiteConfig] Just saved locally, keeping current state #' + rc);
        savedLocallyRef.current = false;
      } else {
        setConfigState(merged);
        try { localStorage.setItem(STORAGE_KEY, JSON.stringify(merged)); } catch { /* ignore */ }
        console.log('[useSiteConfig] Applied DB data #' + rc, '| hero.title:', merged.hero.title.substring(0, 30));
      }
    } else {
      // No DB: try localStorage as fallback
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as Record<string, unknown>;
          const merged = mergeWithDefault(parsed);
          // Only update if different from current
          if (JSON.stringify(merged) !== JSON.stringify(configRef.current)) {
            setConfigState(merged);
          }
        }
      } catch { /* ignore */ }
    }

    setDbReady(true);
    setLoading(false);
  }, []);

  // Initial load
  useEffect(() => {
    fetchConfig('initial');
  }, [fetchConfig]);

  // Cross-tab sync: when localStorage changes from another tab, re-fetch from DB
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === DB_TS_KEY) {
        // Only act if another tab changed it (e.newValue different from current)
        if (e.newValue && e.newValue !== JSON.stringify(configRef.current)) {
          console.log('[useSiteConfig] Storage changed from other tab, re-fetching...');
          fetchConfig('storage-event');
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [fetchConfig]);

  // Tab visibility: refresh when user comes back
  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) {
        fetchConfig('visibility');
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [fetchConfig]);

  // Save to localStorage whenever config changes (for fast UI)
  useEffect(() => {
    if (!loading && dbReady) {
      const timer = setTimeout(() => {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        } catch { /* ignore */ }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [config, loading, dbReady]);

  // setConfigWithVersion: update state + mark as locally saved
  const setConfigWithVersion = useCallback((updater: SiteConfig | ((prev: SiteConfig) => SiteConfig)) => {
    setConfigState((prev) => {
      const newConfig = typeof updater === 'function'
        ? (updater as (prev: SiteConfig) => SiteConfig)(prev)
        : { ...prev, ...updater };
      const merged = mergeWithDefault(newConfig as unknown as Record<string, unknown>);
      configRef.current = merged;
      return merged;
    });
    // Mark that we just made local changes — don't overwrite from DB for 3s
    savedLocallyRef.current = true;
  }, []);

  const setConfig = useCallback((newConfig: Partial<SiteConfig>) => {
    setConfigWithVersion((prev) => ({ ...prev, ...newConfig }));
  }, [setConfigWithVersion]);

  // (Tất cả các update functions giữ nguyên như cũ...)
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
    localStorage.removeItem(DB_TS_KEY);
    supabase
      .from('site_config')
      .upsert({ id: 1, config_data: reset, updated_at: new Date().toISOString() })
      .catch((err: Error) => console.error('Supabase reset error:', err));
  }, []);

  // Save directly to Supabase — then trigger cross-tab sync
  const saveToDatabase = useCallback(async (data?: SiteConfig) => {
    const configToSave = data ?? configRef.current;

    try {
      // 1. Save to localStorage first for instant UI
      const cleanConfig = { ...configToSave };
      delete (cleanConfig as Record<string, unknown>)._dbVersion;
      try { localStorage.setItem(STORAGE_KEY, JSON.stringify(cleanConfig)); } catch { /* ignore */ }

      // 2. If DB disabled, skip
      if (!dbEnabledRef.current) {
        console.log('[saveToDatabase] DB disabled, local only');
        return { success: true, error: null, localOnly: true };
      }

      // 3. Save to Supabase
      console.log('[saveToDatabase] Saving to Supabase...');
      const now = new Date().toISOString();
      const { error: saveErr } = await withTimeout(
        supabase
          .from('site_config')
          .upsert({ id: 1, config_data: cleanConfig, updated_at: now }),
        8000
      );

      if (saveErr) {
        console.error('[saveToDatabase] Save error:', saveErr);
        dbEnabledRef.current = false;
        return { success: true, error: null, localOnly: true };
      }

      // 4. Mark that we just saved so fetchConfig won't overwrite
      savedLocallyRef.current = true;
      const ts = new Date(now).getTime();
      try { localStorage.setItem(DB_TS_KEY, String(ts)); } catch { /* ignore */ }

      // 5. Trigger cross-tab sync by updating a dummy key
      try {
        localStorage.setItem('salekit_sync_trigger', String(Date.now()));
      } catch { /* ignore */ }

      // 6. Fetch fresh from DB to confirm
      await fetchConfig('after-save');

      console.log('[saveToDatabase] Save + sync OK');
      return { success: true, error: null, localOnly: false };
    } catch (err) {
      console.error('[saveToDatabase] Error:', err);
      dbEnabledRef.current = false;
      return { success: true, error: null, localOnly: true };
    }
  }, [fetchConfig]);

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