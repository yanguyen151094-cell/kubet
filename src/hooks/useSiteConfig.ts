import { useState, useEffect, useCallback } from 'react';
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

export interface NavLink {
  label: string;
  href: string;
}

export interface BannerConfig {
  image: string;
  alt: string;
  link?: string;
}

export interface ArticleItem {
  title: string;
  content: string;
  image?: string;
}

export interface ContentSection {
  id: string;
  label: string;
  title: string;
  articles: ArticleItem[];
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

export interface SiteConfig {
  version: number;
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
  // --- NEW simple homepage config ---
  simpleNav: NavLink[];
  simpleBanner: BannerConfig;
  simpleContent: {
    sections: ContentSection[];
  };
  // --- END NEW ---
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

export function useSiteConfig() {
  const [config, setConfig] = useState<SiteConfig>(() => ({ ...defaultSiteConfig }));

  // Luôn fetch từ DB khi mount - DB là nguồn sự thật, nhưng merge với default để tránh thiếu trường mới
  useEffect(() => {
    supabase
      .from('site_config')
      .select('config_data')
      .eq('id', 1)
      .maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error('[useSiteConfig] Fetch error:', error);
          return;
        }
        if (data?.config_data) {
          const dbConfig = data.config_data as Partial<SiteConfig>;
          setConfig((prev) => ({
            ...prev,
            ...dbConfig,
            // Giữ default cho các trường mới nếu DB cũ chưa có
            simpleNav: dbConfig.simpleNav ?? prev.simpleNav,
            simpleBanner: dbConfig.simpleBanner ?? prev.simpleBanner,
            simpleContent: dbConfig.simpleContent ?? prev.simpleContent,
          }));
        } else {
          console.log('[useSiteConfig] No config found in DB, using default');
        }
      })
      .catch((err) => {
        console.error('[useSiteConfig] Fetch exception:', err);
      });
  }, []);

  // ---- Setters ----
  const setConfigDirect = useCallback((partial: Partial<SiteConfig>) => {
    setConfig((prev) => ({ ...prev, ...partial }));
  }, []);

  const updateHero = useCallback((hero: Partial<SiteConfig['hero']>) => {
    setConfig((prev) => ({ ...prev, hero: { ...prev.hero, ...hero } }));
  }, []);

  const updateHowItWorks = useCallback((howItWorks: Partial<SiteConfig['howItWorks']>) => {
    setConfig((prev) => ({ ...prev, howItWorks: { ...prev.howItWorks, ...howItWorks } }));
  }, []);

  const updateHowItWorksItem = useCallback((index: number, item: Partial<HowItWorkItem>) => {
    setConfig((prev) => {
      const items = [...prev.howItWorks.items];
      items[index] = { ...items[index], ...item };
      return { ...prev, howItWorks: { ...prev.howItWorks, items } };
    });
  }, []);

  const updateFeatureItem = useCallback((index: number, item: Partial<FeatureItem>) => {
    setConfig((prev) => {
      const items = [...prev.features.items];
      items[index] = { ...items[index], ...item };
      return { ...prev, features: { ...prev.features, items } };
    });
  }, []);

  const updateStatsItem = useCallback((index: number, stat: Partial<StatItem>) => {
    setConfig((prev) => {
      const items = [...prev.stats.items];
      items[index] = { ...items[index], ...stat };
      return { ...prev, stats: { ...prev.stats, items } };
    });
  }, []);

  const updateScreenshotItem = useCallback((index: number, screenshot: Partial<ScreenshotItem>) => {
    setConfig((prev) => {
      const items = [...prev.screenshots.items];
      items[index] = { ...items[index], ...screenshot };
      return { ...prev, screenshots: { ...prev.screenshots, items } };
    });
  }, []);

  const updateTestimonialItem = useCallback((index: number, testimonial: Partial<TestimonialItem>) => {
    setConfig((prev) => {
      const items = [...prev.testimonials.items];
      items[index] = { ...items[index], ...testimonial };
      return { ...prev, testimonials: { ...prev.testimonials, items } };
    });
  }, []);

  const updatePricingItem = useCallback((index: number, pricing: Partial<PricingItem>) => {
    setConfig((prev) => {
      const items = [...prev.pricing.items];
      items[index] = { ...items[index], ...pricing };
      return { ...prev, pricing: { ...prev.pricing, items } };
    });
  }, []);

  const updateFAQItem = useCallback((index: number, faq: Partial<FAQItem>) => {
    setConfig((prev) => {
      const items = [...prev.faq.items];
      items[index] = { ...items[index], ...faq };
      return { ...prev, faq: { ...prev.faq, items } };
    });
  }, []);

  const updateContact = useCallback((contact: Partial<SiteConfig['contact']>) => {
    setConfig((prev) => ({ ...prev, contact: { ...prev.contact, ...contact } }));
  }, []);

  const updateFooter = useCallback((footer: Partial<SiteConfig['footer']>) => {
    setConfig((prev) => ({ ...prev, footer: { ...prev.footer, ...footer } }));
  }, []);

  const updateNav = useCallback((nav: Partial<SiteConfig['nav']>) => {
    setConfig((prev) => ({ ...prev, nav: { ...prev.nav, ...nav } }));
  }, []);

  // ---- NEW simple homepage setters ----
  const updateSimpleNav = useCallback((nav: NavLink[]) => {
    setConfig((prev) => ({ ...prev, simpleNav: nav }));
  }, []);

  const updateSimpleNavItem = useCallback((index: number, item: Partial<NavLink>) => {
    setConfig((prev) => {
      const items = [...prev.simpleNav];
      items[index] = { ...items[index], ...item };
      return { ...prev, simpleNav: items };
    });
  }, []);

  const updateSimpleBanner = useCallback((banner: Partial<BannerConfig>) => {
    setConfig((prev) => ({ ...prev, simpleBanner: { ...prev.simpleBanner, ...banner } }));
  }, []);

  const updateSimpleContentSection = useCallback((index: number, section: Partial<ContentSection>) => {
    setConfig((prev) => {
      const sections = [...prev.simpleContent.sections];
      sections[index] = { ...sections[index], ...section };
      return { ...prev, simpleContent: { ...prev.simpleContent, sections } };
    });
  }, []);

  const updateSimpleContentArticle = useCallback((sectionIndex: number, articleIndex: number, article: Partial<ArticleItem>) => {
    setConfig((prev) => {
      const sections = [...prev.simpleContent.sections];
      const articles = [...sections[sectionIndex].articles];
      articles[articleIndex] = { ...articles[articleIndex], ...article };
      sections[sectionIndex] = { ...sections[sectionIndex], articles };
      return { ...prev, simpleContent: { ...prev.simpleContent, sections } };
    });
  }, []);
  // ---- END NEW ----

  const updateAuthRegister = useCallback((auth: Partial<AuthPageConfig>) => {
    setConfig((prev) => ({ ...prev, authRegister: { ...prev.authRegister, ...auth } }));
  }, []);

  const updateAuthLogin = useCallback((auth: Partial<AuthPageConfig>) => {
    setConfig((prev) => ({ ...prev, authLogin: { ...prev.authLogin, ...auth } }));
  }, []);

  const updateHeroStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfig((prev) => ({ ...prev, heroStyle: { ...prev.heroStyle, ...style } }));
  }, []);

  const updateHowItWorksStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfig((prev) => ({ ...prev, howItWorksStyle: { ...prev.howItWorksStyle, ...style } }));
  }, []);

  const updateFeaturesStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfig((prev) => ({ ...prev, featuresStyle: { ...prev.featuresStyle, ...style } }));
  }, []);

  const updateStatsStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfig((prev) => ({ ...prev, statsStyle: { ...prev.statsStyle, ...style } }));
  }, []);

  const updateScreenshotsStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfig((prev) => ({ ...prev, screenshotsStyle: { ...prev.screenshotsStyle, ...style } }));
  }, []);

  const updateTestimonialsStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfig((prev) => ({ ...prev, testimonialsStyle: { ...prev.testimonialsStyle, ...style } }));
  }, []);

  const updatePricingStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfig((prev) => ({ ...prev, pricingStyle: { ...prev.pricingStyle, ...style } }));
  }, []);

  const updateFAQStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfig((prev) => ({ ...prev, faqStyle: { ...prev.faqStyle, ...style } }));
  }, []);

  const updateContactStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfig((prev) => ({ ...prev, contactStyle: { ...prev.contactStyle, ...style } }));
  }, []);

  const updateFooterStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfig((prev) => ({ ...prev, footerStyle: { ...prev.footerStyle, ...style } }));
  }, []);

  const resetConfig = useCallback(() => {
    setConfig({ ...defaultSiteConfig });
  }, []);

  const saveToDatabase = useCallback(async (data?: SiteConfig) => {
    const cfg = data ?? config;
    try {
      const { getSupabaseFunctionsUrl, SUPABASE_ANON_KEY } = await import('@/lib/supabase');
      const url = getSupabaseFunctionsUrl('update-site-config');
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'apikey': SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ config_data: cfg }),
      });
      if (!res.ok) {
        const errBody = await res.text();
        console.error('[saveToDatabase] Edge function error:', res.status, errBody);
        return { success: false, error: `HTTP ${res.status}: ${errBody}` };
      }
      return { success: true, error: null };
    } catch (err) {
      console.error('[saveToDatabase] Exception:', err);
      return { success: false, error: (err as Error).message };
    }
  }, [config]);

  return {
    config,
    setConfig: setConfigDirect,
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
    // --- NEW ---
    updateSimpleNav,
    updateSimpleNavItem,
    updateSimpleBanner,
    updateSimpleContentSection,
    updateSimpleContentArticle,
    // --- END NEW ---
    updateAuthRegister,
    updateAuthLogin,
    updateHeroStyle,
    updateHowItWorksStyle,
    updateFeaturesStyle,
    updateStatsStyle,
    updateScreenshotsStyle,
    updateTestimonialsStyle,
    updatePricingStyle,
    updateFAQStyle,
    updateContactStyle,
    updateFooterStyle,
    resetConfig,
    saveToDatabase,
  };
}