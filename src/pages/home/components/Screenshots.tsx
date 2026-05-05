import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

export default function Screenshots() {
  const { config } = useSiteConfigContext();
  const { label, title, subtitle, items } = config.screenshots;

  return (
    <section className="w-full py-12 md:py-20 bg-gray-50/50">
      <div className="max-w-5xl mx-auto px-4 md:px-6 text-center mb-10">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">{subtitle}</p>
      </div>
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="flex gap-3 md:gap-4 overflow-x-auto pb-4 snap-x snap-mandatory scroll-smooth justify-start md:justify-center">
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