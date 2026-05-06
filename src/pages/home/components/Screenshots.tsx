import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

export default function Screenshots() {
  const { config } = useSiteConfigContext();
  const { label, title, subtitle, items } = config.screenshots;
  const { screenshotsStyle } = config;

  return (
    <section
      className="w-full"
      style={{
        paddingTop: screenshotsStyle.paddingTop,
        paddingBottom: screenshotsStyle.paddingBottom,
        backgroundColor: screenshotsStyle.bgColor,
      }}
    >
      <div className="mx-auto px-4 md:px-6 text-center mb-10" style={{ maxWidth: screenshotsStyle.maxWidth }}>
        <p
          className="font-semibold text-gray-500 uppercase tracking-wider mb-2"
          style={{ fontSize: screenshotsStyle.labelSize }}
        >
          {label}
        </p>
        <h2
          className="font-bold text-gray-900 mb-3"
          style={{ fontSize: screenshotsStyle.titleSize }}
        >
          {title}
        </h2>
        <p
          className="text-gray-500 max-w-xl mx-auto"
          style={{ fontSize: screenshotsStyle.subtitleSize }}
        >
          {subtitle}
        </p>
      </div>
      <div className="mx-auto px-4 md:px-6" style={{ maxWidth: screenshotsStyle.maxWidth }}>
        <div className="flex overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth justify-start md:justify-center" style={{ gap: screenshotsStyle.gap }}>
          {items.map((item, idx) => (
            <div
              key={idx}
              className="shrink-0 rounded-lg overflow-hidden snap-center"
              style={{ width: `clamp(140px, 30vw, 220px)` }}
            >
              <img
                src={item.image}
                alt={item.alt}
                className="w-full h-auto object-cover"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}