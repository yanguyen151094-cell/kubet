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
  images: string[];
  alt: string;
  link?: string;
  autoPlay?: boolean;
  interval?: number;
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
  simpleNav: NavLink[];
  simpleBanner: BannerConfig;
  simpleContent: {
    sections: ContentSection[];
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

const LS_KEY = 'site_config_v1';

function loadConfig(): SiteConfig {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SiteConfig>;
      if (parsed.version === defaultSiteConfig.version) {
        return { ...defaultSiteConfig, ...parsed };
      }
      // Version mismatch: clear stale config
      localStorage.removeItem(LS_KEY);
    }
  } catch {
    // ignore parse errors
  }
  return { ...defaultSiteConfig };
}

function saveConfig(cfg: SiteConfig) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(cfg));
  } catch {
    // ignore storage errors
  }
}

export function useSiteConfig() {
  const [config, setConfigState] = useState<SiteConfig>(() => loadConfig());

  // Persist every change to localStorage immediately
  useEffect(() => {
    saveConfig(config);
  }, [config]);

  const setConfig = useCallback((partial: Partial<SiteConfig>) => {
    setConfigState((prev) => ({ ...prev, ...partial }));
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

  const updateSimpleNav = useCallback((nav: NavLink[]) => {
    setConfigState((prev) => ({ ...prev, simpleNav: nav }));
  }, []);

  const updateSimpleNavItem = useCallback((index: number, item: Partial<NavLink>) => {
    setConfigState((prev) => {
      const items = [...prev.simpleNav];
      items[index] = { ...items[index], ...item };
      return { ...prev, simpleNav: items };
    });
  }, []);

  const updateSimpleBanner = useCallback((banner: Partial<BannerConfig>) => {
    setConfigState((prev) => ({ ...prev, simpleBanner: { ...prev.simpleBanner, ...banner } }));
  }, []);

  const updateSimpleContentSection = useCallback((index: number, section: Partial<ContentSection>) => {
    setConfigState((prev) => {
      const sections = [...prev.simpleContent.sections];
      sections[index] = { ...sections[index], ...section };
      return { ...prev, simpleContent: { ...prev.simpleContent, sections } };
    });
  }, []);

  const updateSimpleContentArticle = useCallback((sectionIndex: number, articleIndex: number, article: Partial<ArticleItem>) => {
    setConfigState((prev) => {
      const sections = [...prev.simpleContent.sections];
      const articles = [...sections[sectionIndex].articles];
      articles[articleIndex] = { ...articles[articleIndex], ...article };
      sections[sectionIndex] = { ...sections[sectionIndex], articles };
      return { ...prev, simpleContent: { ...prev.simpleContent, sections } };
    });
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

  const updatePricingStyle = useCallback((style: Partial<SectionStyle>) => {
    setConfigState((prev) => ({ ...prev, pricingStyle: { ...prev.pricingStyle, ...style } }));
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
    setConfigState({ ...defaultSiteConfig });
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
    updateNav,
    updateSimpleNav,
    updateSimpleNavItem,
    updateSimpleBanner,
    updateSimpleContentSection,
    updateSimpleContentArticle,
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
  };
}