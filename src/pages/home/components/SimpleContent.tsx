import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

export default function SimpleContent() {
  const { config } = useSiteConfigContext();
  const { simpleContent } = config;

  if (!(simpleContent?.sections?.length)) return null;

  return (
    <section className="w-full py-10 md:py-16 bg-white">
      <div className="max-w-4xl mx-auto px-4 md:px-6">
        {simpleContent.sections.map((section, idx) => (
          <div key={section.id} id={section.id} className={idx > 0 ? 'mt-10 md:mt-14' : ''}>
            <div className="mb-6 md:mb-8">
              <span className="text-xs font-medium tracking-wider text-gray-400 uppercase">
                {section.label}
              </span>
              <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mt-1">
                {section.title}
              </h2>
            </div>
            <div className="space-y-6 md:space-y-8">
              {section.articles.map((article, aIdx) => (
                <article key={aIdx} className="border-b border-gray-100 pb-6 md:pb-8 last:border-0 last:pb-0">
                  <h3 className="text-lg md:text-xl font-semibold text-gray-800 mb-3">
                    {article.title}
                  </h3>
                  {article.image && (
                    <div className="mb-4 overflow-hidden rounded-lg">
                      <img
                        src={article.image}
                        alt={article.title}
                        className="w-full h-auto object-cover object-top max-h-[320px]"
                      />
                    </div>
                  )}
                  <div className="text-sm md:text-base text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {article.content}
                  </div>
                </article>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}