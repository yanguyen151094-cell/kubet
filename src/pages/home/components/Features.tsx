import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

export default function Features() {
  const { config } = useSiteConfigContext();
  const { label, title, subtitle, items } = config.features;
  const { featuresStyle } = config;

  return (
    <section
      id="features"
      className="w-full"
      style={{
        paddingTop: featuresStyle.paddingTop,
        paddingBottom: featuresStyle.paddingBottom,
        backgroundColor: featuresStyle.bgColor,
      }}
    >
      <div className="mx-auto px-4 md:px-6 text-center mb-12" style={{ maxWidth: featuresStyle.maxWidth }}>
        <p
          className="font-semibold text-gray-500 uppercase tracking-wider mb-2"
          style={{ fontSize: featuresStyle.labelSize }}
        >
          {label}
        </p>
        <h2
          className="font-bold text-gray-900 mb-3"
          style={{ fontSize: featuresStyle.titleSize }}
        >
          {title}
        </h2>
        <p
          className="text-gray-500 max-w-xl mx-auto"
          style={{ fontSize: featuresStyle.subtitleSize }}
        >
          {subtitle}
        </p>
      </div>
      {items.map((item, idx) => (
        <div key={idx} className="mx-auto px-4 md:px-6 mb-8 md:mb-12 last:mb-0" style={{ maxWidth: featuresStyle.maxWidth }}>
          <div className={`flex flex-col ${item.imagePosition === 'right' ? 'md:flex-row-reverse' : 'md:flex-row'} gap-6 md:gap-10 items-center`}>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 md:mb-3">{item.title}</h3>
              <p className="text-sm text-gray-500 mb-3 md:mb-4">{item.description}</p>
              <ul className="space-y-2 md:space-y-3">
                {item.bullets.map((bullet, bIdx) => (
                  <li key={bIdx} className="flex items-start gap-3 text-sm text-gray-600">
                    <span className="w-5 h-5 flex items-center justify-center mt-0.5 shrink-0">
                      <i className="ri-check-line text-emerald-500 w-4 h-4 flex items-center justify-center" />
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex-1 flex justify-center">
              <img
                src={item.image}
                alt={item.title}
                width={370}
                height={537}
                className="w-full max-w-[260px] sm:max-w-xs object-contain"
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
}