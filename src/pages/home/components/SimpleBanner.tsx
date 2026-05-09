import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

export default function SimpleBanner() {
  const { config } = useSiteConfigContext();
  const { simpleBanner } = config;
  const bannerImage = simpleBanner?.image ?? '';

  if (!simpleBanner?.image) return null;

  const bannerContent = (
    <div className="w-full">
      <img
        src={bannerImage}
        alt={simpleBanner?.alt ?? ''}
        className="w-full h-auto object-cover object-top"
        style={{ maxHeight: 480 }}
      />
    </div>
  );

  if (simpleBanner.link) {
    return (
      <a href={simpleBanner.link} className="block w-full">
        {bannerContent}
      </a>
    );
  }

  return bannerContent;
}