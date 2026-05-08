import { createContext, useContext } from 'react';
import { useSiteConfig } from '@/hooks/useSiteConfig';
import type { SiteConfig, HowItWorkItem, FeatureItem, StatItem, ScreenshotItem, TestimonialItem, PricingItem, FAQItem, AuthPageConfig } from '@/hooks/useSiteConfig';

interface SiteConfigContextType {
  config: SiteConfig;
  loading: boolean;
  error: string | null;
  setConfig: (config: Partial<SiteConfig>) => void;
  updateHero: (hero: Partial<SiteConfig['hero']>) => void;
  updateHowItWorks: (howItWorks: Partial<SiteConfig['howItWorks']>) => void;
  updateHowItWorksItem: (index: number, item: Partial<HowItWorkItem>) => void;
  updateFeatureItem: (index: number, item: Partial<FeatureItem>) => void;
  updateStatsItem: (index: number, stat: Partial<StatItem>) => void;
  updateScreenshotItem: (index: number, screenshot: Partial<ScreenshotItem>) => void;
  updateTestimonialItem: (index: number, testimonial: Partial<TestimonialItem>) => void;
  updatePricingItem: (index: number, pricing: Partial<PricingItem>) => void;
  updateFAQItem: (index: number, faq: Partial<FAQItem>) => void;
  updateContact: (contact: Partial<SiteConfig['contact']>) => void;
  updateFooter: (footer: Partial<SiteConfig['footer']>) => void;
  updateNav: (nav: Partial<SiteConfig['nav']>) => void;
  updateAuthRegister: (auth: Partial<AuthPageConfig>) => void;
  updateAuthLogin: (auth: Partial<AuthPageConfig>) => void;
  updateHeroStyle: (style: Partial<SiteConfig['heroStyle']>) => void;
  updateHowItWorksStyle: (style: Partial<SiteConfig['howItWorksStyle']>) => void;
  updateFeaturesStyle: (style: Partial<SiteConfig['featuresStyle']>) => void;
  updateStatsStyle: (style: Partial<SiteConfig['statsStyle']>) => void;
  updateScreenshotsStyle: (style: Partial<SiteConfig['screenshotsStyle']>) => void;
  updateTestimonialsStyle: (style: Partial<SiteConfig['testimonialsStyle']>) => void;
  updateFAQStyle: (style: Partial<SiteConfig['faqStyle']>) => void;
  updateContactStyle: (style: Partial<SiteConfig['contactStyle']>) => void;
  updateFooterStyle: (style: Partial<SiteConfig['footerStyle']>) => void;
  resetConfig: () => void;
}

const SiteConfigContext = createContext<SiteConfigContextType | null>(null);

export function SiteConfigProvider({ children }: { children: React.ReactNode }) {
  const siteConfig = useSiteConfig();
  return (
    <SiteConfigContext.Provider value={siteConfig}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfigContext() {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) throw new Error('useSiteConfigContext must be used within SiteConfigProvider');
  return ctx;
}