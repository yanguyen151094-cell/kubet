import { useState } from 'react';
import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

export default function FAQ() {
  const { config } = useSiteConfigContext();
  const { label, title, subtitle, items, image } = config.faq;
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="w-full py-12 md:py-20">
      <div className="max-w-5xl mx-auto px-4 md:px-6 text-center mb-10">
        <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">{label}</p>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-3">{title}</h2>
        <p className="text-sm text-gray-500 max-w-xl mx-auto">{subtitle}</p>
      </div>
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-12 items-start">
          <div className="md:w-2/5 flex justify-center w-full">
            <img
              src={image}
              alt="FAQ"
              width={340}
              height={415}
              className="w-full max-w-[200px] sm:max-w-xs object-contain"
            />
          </div>
          <div className="md:w-3/5 space-y-2 md:space-y-3 w-full">
            {items.map((item, idx) => (
              <div key={idx} className="border border-gray-100 rounded-lg overflow-hidden">
                <button
                  onClick={() => setOpenIndex(openIndex === idx ? null : idx)}
                  className="w-full flex items-center justify-between px-4 md:px-6 py-3 md:py-4 text-left bg-white hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <span className="text-sm font-medium text-gray-900 pr-4">{item.question}</span>
                  <span className="w-5 h-5 flex items-center justify-center shrink-0">
                    <i className={`${openIndex === idx ? 'ri-subtract-line' : 'ri-add-line'} text-emerald-500 w-4 h-4 flex items-center justify-center`} />
                  </span>
                </button>
                {openIndex === idx && (
                  <div className="px-4 md:px-6 pb-3 md:pb-4 text-sm text-gray-500 leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}