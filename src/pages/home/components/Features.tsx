import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

export default function Features() {
  const { config } = useSiteConfigContext();
  const { label, title, subtitle, items } = config.features;

  return (
    <section id="features" className="w-full py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 md:px-6 text-center mb-12">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">{subtitle}</p>
      </div>
      {items.map((item, idx) => (
        <div key={idx} className="max-w-5xl mx-auto px-4 md:px-6 mb-8 md:mb-12 last:mb-0">
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