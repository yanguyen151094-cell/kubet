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
  _version?: number;
  _lastModified?: number;
  version?: number;
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

const STORAGE_KEY = 'salekit_site_config_v2';
const CONFIG_TS_KEY = 'salekit_config_timestamp';
const LOCAL_VERSION_KEY = 'salekit_config_version';

function getLocalVersion(): number {
  try {
    return Number(localStorage.getItem(LOCAL_VERSION_KEY)) || 0;
  } catch {
    return 0;
  }
}

function setLocalVersion(v: number) {
  try {
    localStorage.setItem(LOCAL_VERSION_KEY, String(v));
  } catch {
    // ignore
  }
}

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

// Helper: timeout wrapper for promises
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${ms}ms`)), ms)
    ),
  ]);
}

// Helper: check if config_data is empty
function isEmptyConfigData(data: unknown): boolean {
  if (!data) return true;
  if (typeof data !== 'object') return true;
  if (Array.isArray(data)) return data.length === 0;
  return Object.keys(data).length === 0;
}

export function useSiteConfig() {
  const [config, setConfigState] = useState<SiteConfig>(() => {
    const merged = mergeWithDefault({});
    merged._version = getLocalVersion();
    merged._lastModified = Date.now();
    return merged;
  });
  const [loading, setLoading] = useState(true);
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dbEnabledRef = useRef(true);
  const refreshCountRef = useRef(0);
  const configVersionRef = useRef<number>(config._version || 0);
  const configRef = useRef<SiteConfig>(config);

  // Keep ref always in sync with current config
  useEffect(() => {
    configRef.current = config;
    configVersionRef.current = config._version || 0;
  }, [config]);

  // Core fetch logic - can be called from anywhere
  // CRITICAL: only update state if fetched data is NEWER than current state
  const fetchConfig = useCallback(async (sourceHint?: string) => {
    refreshCountRef.current += 1;
    const rc = refreshCountRef.current;
    setLoading(true);

    let source = 'default';
    let mergedConfig: SiteConfig | null = null;
    let fetchedVersion = 0;

    try {
      // Try Supabase with timeout
      const { data, error: dbError } = await withTimeout(
        supabase
          .from('site_config')
          .select('config_data')
          .eq('id', 1)
          .maybeSingle(),
        5000
      );

      console.log('[useSiteConfig] DB result #' + rc + ':', { hasData: !!data, config_data: data?.config_data, dbError: dbError?.message, sourceHint });

      if (dbError) {
        console.error('[useSiteConfig] Supabase load error:', dbError);
        setError(dbError.message);
        dbEnabledRef.current = false;
      } else if (data && !isEmptyConfigData(data.config_data)) {
        const dbData = data.config_data as Record<string, unknown>;
        mergedConfig = mergeWithDefault(dbData);
        fetchedVersion = Number(dbData._lastModified) || Number(dbData._version) || 0;
        dbEnabledRef.current = true;
        source = 'supabase';
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(mergedConfig));
        } catch {
          // ignore
        }
      }
    } catch (err) {
      console.error('[useSiteConfig] Config load error:', err);
      setError('Không thể tải cấu hình từ server');
      dbEnabledRef.current = false;
    }

    // If no valid DB config, try localStorage
    if (!mergedConfig) {
      try {
        const cached = localStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached) as Record<string, unknown>;
          mergedConfig = mergeWithDefault(parsed);
          fetchedVersion = Number(parsed._lastModified) || Number(parsed._version) || 0;
          source = 'localStorage';
          console.log('[useSiteConfig] Loaded from localStorage #' + rc);
        }
      } catch (e) {
        console.error('[useSiteConfig] localStorage parse error:', e);
      }
    }

    // Final fallback: default
    if (!mergedConfig) {
      mergedConfig = { ...defaultSiteConfig, _version: 0, _lastModified: 0 };
      source = 'default';
      console.log('[useSiteConfig] Loaded from default #' + rc);
    }

    // CRITICAL FIX: Do NOT overwrite current state if fetched data is OLDER
    const currentVersion = configVersionRef.current;
    if (fetchedVersion > 0 && fetchedVersion < currentVersion) {
      console.log('[useSiteConfig] Skipping overwrite: fetched v' + fetchedVersion + ' < current v' + currentVersion);
      setLoading(false);
      return { source: 'skipped-older', config: configRef.current };
    }

    // Only update state if data is newer or same version
    if (fetchedVersion >= currentVersion) {
      setConfigState(mergedConfig);
      if (fetchedVersion > 0) {
        configVersionRef.current = fetchedVersion;
      }
    }
    setDbReady(true);
    setLoading(false);
    console.log('[useSiteConfig] Final source #' + rc + ':', source, '| version:', fetchedVersion, 'current:', currentVersion, '| hero.title:', mergedConfig.hero.title.substring(0, 30));
    return { source, config: mergedConfig };
  }, []);

  // Initial load on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await fetchConfig('initial');
    })();
    return () => {
      cancelled = true;
    };
  }, [fetchConfig]);

  // Listen for cross-tab config changes via storage event
  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY || e.key === CONFIG_TS_KEY) {
        console.log('[useSiteConfig] Storage changed from other tab, refreshing...');
        fetchConfig('storage-event');
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [fetchConfig]);

  // Re-fetch when tab becomes visible (user switches back from admin tab)
  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) {
        console.log('[useSiteConfig] Tab became visible, refreshing config...');
        fetchConfig('visibility');
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, [fetchConfig]);

  // Re-fetch every 30s while page is active (polling for external changes)
  // BUT skip if local state has been modified (newer version)
  useEffect(() => {
    const interval = setInterval(() => {
      if (!document.hidden) {
        fetchConfig('polling');
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [fetchConfig]);

  // Save to localStorage whenever config changes (debounced)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!loading && dbReady) {
        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
        } catch {
          // ignore storage errors
        }
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [config, loading, dbReady]);

  const setConfigWithVersion = useCallback((updater: SiteConfig | ((prev: SiteConfig) => SiteConfig)) => {
    setConfigState((prev) => {
      const newConfig = typeof updater === 'function'
        ? (updater as (prev: SiteConfig) => SiteConfig)(prev)
        : { ...prev, ...updater };
      const version = Date.now();
      const merged = { ...newConfig, _version: version, _lastModified: version };
      configVersionRef.current = version;
      configRef.current = merged;
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        localStorage.setItem(CONFIG_TS_KEY, String(version));
        setLocalVersion(version);
      } catch {
        // ignore
      }
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
    const version = Date.now();
    const reset = { ...defaultSiteConfig, _version: version, _lastModified: version };
    setConfigState(reset);
    configVersionRef.current = version;
    configRef.current = reset;
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(CONFIG_TS_KEY);
    localStorage.removeItem(LOCAL_VERSION_KEY);
    supabase
      .from('site_config')
      .upsert({ id: 1, key: 'default', config_data: reset, updated_at: new Date().toISOString() })
      .catch((err: Error) => console.error('Supabase reset error:', err));
  }, []);

  // Save directly to Supabase with timeout - uses ref for latest data
  const saveToDatabase = useCallback(async (data?: SiteConfig) => {
    // Use the ref to get the MOST CURRENT config, not stale closure
    const configToSave = data ?? configRef.current;
    const version = Date.now();
    const payload = { ...configToSave, _version: version, _lastModified: version };

    try {
      // Always save to localStorage first
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
        localStorage.setItem(CONFIG_TS_KEY, String(version));
        setLocalVersion(version);
        console.log('[saveToDatabase] Saved to localStorage v' + version);
      } catch {
        // ignore
      }

      // Update our own version ref immediately so fetch won't overwrite
      configVersionRef.current = version;

      // If DB is known to be disabled, skip network
      if (!dbEnabledRef.current) {
        console.log('[saveToDatabase] DB disabled, skipping network');
        return { success: true, error: null, localOnly: true };
      }

      // Direct Supabase update with 8s timeout - include key to satisfy NOT NULL
      console.log('[saveToDatabase] Trying Supabase upsert v' + version + '...');
      const { error: saveErr } = await withTimeout(
        supabase
          .from('site_config')
          .upsert({
            id: 1,
            key: 'default',
            config_data: payload,
            updated_at: new Date().toISOString(),
          }),
        8000
      );

      if (saveErr) {
        console.error('[saveToDatabase] Supabase save error:', saveErr);
        dbEnabledRef.current = false;
        return { success: true, error: null, localOnly: true };
      }

      console.log('[saveToDatabase] Supabase save OK v' + version);
      return { success: true, error: null, localOnly: false };
    } catch (err) {
      console.error('[saveToDatabase] Save error:', err);
      dbEnabledRef.current = false;
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