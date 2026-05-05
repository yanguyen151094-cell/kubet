import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

export default function Stats() {
  const { config } = useSiteConfigContext();
  const { items } = config.stats;

  return (
    <section className="w-full py-10 md:py-16 bg-emerald-500">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
          {items.map((stat, idx) => (
            <div key={idx} className="text-center text-white">
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
              <div className="text-xs md:text-sm uppercase tracking-wider opacity-90">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}