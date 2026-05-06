import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

export default function Hero() {
  const { config } = useSiteConfigContext();
  const { heroStyle } = config;

  return (
    <section
      className="w-full"
      style={{
        paddingTop: heroStyle.paddingTop,
        paddingBottom: heroStyle.paddingBottom,
        backgroundColor: heroStyle.bgColor,
      }}
    >
      <div
        className="mx-auto px-4 md:px-6 text-center"
        style={{ maxWidth: heroStyle.maxWidth, gap: heroStyle.gap }}
      >
        <div className="flex justify-center mb-8">
          <img
            src={config.hero.logoImage}
            alt="Appexy"
            width={200}
            height={47}
            className="h-12 w-auto object-contain"
          />
        </div>
        <h1
          className="font-bold text-gray-900 leading-tight mb-4 md:mb-6"
          style={{ fontSize: heroStyle.titleSize }}
        >
          {config.hero.title}
        </h1>
        <p
          className="text-gray-500 max-w-2xl mx-auto mb-6 md:mb-8 leading-relaxed"
          style={{ fontSize: heroStyle.subtitleSize }}
        >
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