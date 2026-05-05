import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

export default function Testimonials() {
  const { config } = useSiteConfigContext();
  const { label, title, subtitle, items } = config.testimonials;

  return (
    <section className="w-full py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 md:px-6 text-center mb-10">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">{subtitle}</p>
      </div>
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {items.map((item, idx) => (
            <div key={idx} className="bg-white rounded-lg p-5 sm:p-6 md:p-8 border border-gray-100 text-center">
              <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 rounded-full overflow-hidden bg-gray-100">
                <img
                  src={item.avatar}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="text-sm text-gray-600 italic mb-3 md:mb-4 leading-relaxed">{item.quote}</p>
              <h4 className="text-sm sm:text-base font-semibold text-gray-900">{item.name}</h4>
              <p className="text-xs text-gray-500">{item.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}