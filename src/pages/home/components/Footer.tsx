import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

export default function Footer() {
  const { config } = useSiteConfigContext();
  const { logo, address, phone, email, links1, links2, appStoreImage, playStoreImage, copyright } = config.footer;
  const { logoWidth, logoHeight } = config;

  return (
    <footer className="w-full bg-gray-100 py-8 md:py-14">
      <div className="max-w-5xl mx-auto px-4 md:px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 mb-6 md:mb-8">
          <div>
            <img
              src={logo}
              alt="Salekit"
              width={logoWidth}
              height={logoHeight}
              className="h-8 md:h-10 w-auto object-contain mb-3 md:mb-4"
            />
            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
              <p>{address}</p>
              <p>{phone}</p>
              <p>{email}</p>
            </div>
          </div>
          <div>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              {links1.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-gray-900 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <ul className="space-y-2 text-xs sm:text-sm text-gray-600">
              {links2.map((link, idx) => (
                <li key={idx}>
                  <a href="#" className="hover:text-gray-900 transition-colors">{link}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-2 md:mb-3">TẢI APP SALEKIT</h4>
            <div className="flex sm:flex-col gap-2 sm:gap-2">
              <img src={appStoreImage} alt="App Store" className="h-9 md:h-10 w-auto object-contain" />
              <img src={playStoreImage} alt="Play Store" className="h-9 md:h-10 w-auto object-contain" />
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4 md:pt-6 text-center text-xs text-gray-500">
          {copyright}
        </div>
      </div>
    </footer>
  );
}