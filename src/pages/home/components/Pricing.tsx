import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

export default function Pricing() {
  const { config } = useSiteConfigContext();
  const { label, title, subtitle, items } = config.pricing;

  return (
    <section id="pricing" className="w-full py-12 md:py-20 bg-gray-50/50">
      <div className="max-w-5xl mx-auto px-4 md:px-6 text-center mb-10">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">{subtitle}</p>
      </div>
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {items.map((item, idx) => (
            <div
              key={idx}
              className={`rounded-lg p-5 sm:p-6 md:p-8 text-center ${
                item.highlighted
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white border border-gray-100'
              }`}
            >
              <div className={`inline-block px-3 md:px-4 py-1 rounded-md text-xs sm:text-sm font-medium mb-3 md:mb-4 ${
                item.highlighted
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gray-100 text-gray-700'
              }`}>
                {item.name}
              </div>
              <div className="mb-1">
                <span className="text-2xl sm:text-3xl md:text-4xl font-bold">{item.price}</span>
              </div>
              <span className={`text-xs sm:text-sm ${item.highlighted ? 'opacity-90' : 'text-gray-500'}`}>{item.period}</span>
              <ul className="mt-4 md:mt-6 space-y-2 md:space-y-3 text-xs sm:text-sm">
                {item.features.map((feature, fIdx) => (
                  <li key={fIdx} className={`${item.highlighted ? 'opacity-90' : 'text-gray-600'}`}>
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`mt-4 md:mt-6 w-full py-2.5 md:py-3 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer ${
                  item.highlighted
                    ? 'bg-white text-emerald-500 hover:bg-gray-100'
                    : 'bg-emerald-500 text-white hover:bg-emerald-600'
                }`}
              >
                {item.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}