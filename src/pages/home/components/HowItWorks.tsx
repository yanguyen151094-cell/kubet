import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

export default function HowItWorks() {
  const { config } = useSiteConfigContext();
  const { label, title, subtitle, items } = config.howItWorks;

  return (
    <section id="how-it-works" className="w-full py-12 md:py-20 bg-gray-50/50">
      <div className="max-w-5xl mx-auto px-4 md:px-6 text-center">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-sm text-gray-500 max-w-xl mx-auto mb-8 md:mb-12">{subtitle}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {items.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg p-5 sm:p-6 md:p-8 text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 mx-auto mb-3 md:mb-4 flex items-center justify-center bg-emerald-50 rounded-full">
                <i className={`${item.icon} text-xl md:text-2xl text-emerald-500 w-6 h-6 flex items-center justify-center`} />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}