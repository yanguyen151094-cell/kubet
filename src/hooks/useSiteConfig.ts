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
  // New fields for full registration form
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

export function useSiteConfig() {
  const [config, setConfigState] = useState<SiteConfig>(() => mergeWithDefault({}));
  const [loading, setLoading] = useState(true);
  const [dbReady, setDbReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dbEnabledRef = useRef(true);

  // Load from Supabase on mount
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setDbReady(false);

    (async () => {
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

        if (!cancelled) {
          if (dbError) {
            console.error('Supabase load error:', dbError);
            setError(dbError.message);
            dbEnabledRef.current = false;
            // Fallback to localStorage
            try {
              const cached = localStorage.getItem(STORAGE_KEY);
              if (cached) {
                const parsed = JSON.parse(cached) as Record<string, unknown>;
                setConfigState(mergeWithDefault(parsed));
              }
            } catch {
              // ignore parse errors
            }
          } else if (data && data.config_data && Object.keys(data.config_data).length > 0) {
            const merged = mergeWithDefault(data.config_data as Record<string, unknown>);
            setConfigState(merged);
            dbEnabledRef.current = true;
            // Also sync to localStorage as fallback cache
            try {
              localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
            } catch {
              // ignore storage errors
            }
          } else {
            // No DB config yet - use default and seed
            setConfigState(defaultSiteConfig);
            // Seed default config into DB with key
            try {
              await withTimeout(
                supabase
                  .from('site_config')
                  .upsert({ id: 1, key: 'default', config_data: defaultSiteConfig, updated_at: new Date().toISOString() }),
                5000
              );
            } catch (seedErr) {
              console.error('Seed default config error:', seedErr);
              dbEnabledRef.current = false;
            }
          }
          setDbReady(true);
          setLoading(false);
        }
      } catch (err) {
        if (!cancelled) {
          console.error('Config load error:', err);
          setError('Không thể tải cấu hình từ server');
          dbEnabledRef.current = false;
          // Fallback to localStorage
          try {
            const cached = localStorage.getItem(STORAGE_KEY);
            if (cached) {
              const parsed = JSON.parse(cached) as Record<string, unknown>;
              setConfigState(mergeWithDefault(parsed));
            }
          } catch {
            // ignore parse errors
          }
          setDbReady(true);
          setLoading(false);
        }
      }
    })();

    // Subscribe to realtime updates
    let channel: ReturnType<typeof supabase.channel> | null = null;
    try {
      channel = supabase
        .channel('site_config_changes')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'site_config', filter: 'id=eq.1' },
          (payload) => {
            if (!cancelled && payload.new && (payload.new as Record<string, unknown>).config_data) {
              const newData = (payload.new as Record<string, unknown>).config_data as Record<string, unknown>;
              const merged = mergeWithDefault(newData);
              setConfigState(merged);
              try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
              } catch {
                // ignore
              }
            }
          }
        )
        .subscribe();
    } catch {
      // ignore realtime subscription errors
    }

    return () => {
      cancelled = true;
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

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

  const updateNav = useCallback((nav: Partial<SiteConfig['nav']>) => {
    setConfigState((prev) => ({ ...prev, nav: { ...prev.nav, ...nav } }));
  }, []);

  const updateAuthRegister = useCallback((auth: Partial<AuthPageConfig>) => {
    setConfigState((prev) => ({ ...prev, authRegister: { ...prev.authRegister, ...auth } }));
  }, []);

  const updateAuthLogin = useCallback((auth: Partial<AuthPageConfig>) => {
    setConfigState((prev) => ({ ...prev, authLogin: { ...prev.authLogin, ...auth } }));
  }, []);

  const updateHeroStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfigState((prev) => ({ ...prev, heroStyle: { ...prev.heroStyle, ...style } }));
  }, []);

  const updateHowItWorksStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfigState((prev) => ({ ...prev, howItWorksStyle: { ...prev.howItWorksStyle, ...style } }));
  }, []);

  const updateFeaturesStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfigState((prev) => ({ ...prev, featuresStyle: { ...prev.featuresStyle, ...style } }));
  }, []);

  const updateStatsStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfigState((prev) => ({ ...prev, statsStyle: { ...prev.statsStyle, ...style } }));
  }, []);

  const updateScreenshotsStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfigState((prev) => ({ ...prev, screenshotsStyle: { ...prev.screenshotsStyle, ...style } }));
  }, []);

  const updateTestimonialsStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfigState((prev) => ({ ...prev, testimonialsStyle: { ...prev.testimonialsStyle, ...style } }));
  }, []);

  const updateFAQStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfigState((prev) => ({ ...prev, faqStyle: { ...prev.faqStyle, ...style } }));
  }, []);

  const updateContactStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfigState((prev) => ({ ...prev, contactStyle: { ...prev.contactStyle, ...style } }));
  }, []);

  const updateFooterStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfigState((prev) => ({ ...prev, footerStyle: { ...prev.footerStyle, ...style } }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfigState(defaultSiteConfig);
    localStorage.removeItem(STORAGE_KEY);
    supabase
      .from('site_config')
      .upsert({ id: 1, key: 'default', config_data: defaultSiteConfig, updated_at: new Date().toISOString() })
      .catch((err: Error) => console.error('Supabase reset error:', err));
  }, []);

  // Save directly to Supabase with timeout - NO Edge Function
  const saveToDatabase = useCallback(async (data?: SiteConfig) => {
    const configToSave = data ?? config;
    try {
      // Always save to localStorage first
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(configToSave));
      } catch {
        // ignore
      }

      // If DB is known to be disabled, skip network
      if (!dbEnabledRef.current) {
        return { success: true, error: null, localOnly: true };
      }

      // Direct Supabase update with 8s timeout - include key to satisfy NOT NULL
      const { error: saveErr } = await withTimeout(
        supabase
          .from('site_config')
          .upsert({
            id: 1,
            key: 'default',
            config_data: configToSave,
            updated_at: new Date().toISOString(),
          }),
        8000
      );

      if (saveErr) {
        console.error('Supabase save error:', saveErr);
        dbEnabledRef.current = false;
        return { success: true, error: null, localOnly: true };
      }

      return { success: true, error: null, localOnly: false };
    } catch (err) {
      console.error('Save error:', err);
      dbEnabledRef.current = false;
      return { success: true, error: null, localOnly: true };
    }
  }, [config]);

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
  };
}