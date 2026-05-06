import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

export default function Stats() {
  const { config } = useSiteConfigContext();
  const { items } = config.stats;
  const { statsStyle } = config;

  return (
    <section
      className="w-full"
      style={{
        paddingTop: statsStyle.paddingTop,
        paddingBottom: statsStyle.paddingBottom,
        backgroundColor: statsStyle.bgColor,
      }}
    >
      <div className="mx-auto px-4 md:px-6" style={{ maxWidth: statsStyle.maxWidth }}>
        <div
          className="grid grid-cols-2 md:grid-cols-4"
          style={{ gap: statsStyle.gap }}
        >
          {items.map((stat, idx) => (
            <div key={idx} className="text-center text-white">
              <div
                className="font-bold mb-1"
                style={{ fontSize: statsStyle.titleSize }}
              >
                {stat.value}
              </div>
              <div
                className="uppercase tracking-wider opacity-90"
                style={{ fontSize: statsStyle.labelSize }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}