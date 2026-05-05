import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

export default function Hero() {
  const { config } = useSiteConfigContext();

  return (
    <section className="w-full py-10 md:py-16">
      <div className="max-w-4xl mx-auto px-4 md:px-6 text-center">
        <div className="flex justify-center mb-8">
          <img
            src={config.hero.logoImage}
            alt="Appexy"
            width={200}
            height={47}
            className="h-12 w-auto object-contain"
          />
        </div>
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-4 md:mb-6">
          {config.hero.title}
        </h1>
        <p className="text-sm md:text-base text-gray-500 max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed">
          {config.hero.subtitle}
        </p>
        <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 md:px-8 py-3 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer">
          {config.hero.buttonText}
        </button>
        <div className="mt-8 md:mt-12 flex justify-center">
          <img
            src={config.hero.phoneImage}
            alt="Appexy App"
            width={520}
            height={440}
            className="w-full max-w-[280px] sm:max-w-sm md:max-w-md object-contain"
          />
        </div>
      </div>
    </section>
  );
}