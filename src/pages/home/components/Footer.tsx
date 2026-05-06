import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

export default function Footer() {
  const { config } = useSiteConfigContext();
  const { logo, address, phone, email, links1, links2, appStoreImage, playStoreImage, copyright } = config.footer;
  const { logoWidth, logoHeight } = config;
  const { footerStyle } = config;

  return (
    <footer
      className="w-full"
      style={{
        paddingTop: footerStyle.paddingTop,
        paddingBottom: footerStyle.paddingBottom,
        backgroundColor: footerStyle.bgColor,
      }}
    >
      <div className="mx-auto px-4 md:px-6" style={{ maxWidth: footerStyle.maxWidth }}>
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-6 md:mb-8"
          style={{ gap: footerStyle.gap }}
        >
          <div>
            <img
              src={logo}
              alt="Salekit"
              className="object-contain max-w-full mb-3 md:mb-4"
              style={{ width: logoWidth, height: logoHeight }}
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
            <h4
              className="font-semibold text-gray-900 mb-2 md:mb-3"
              style={{ fontSize: footerStyle.titleSize }}
            >
              TẢI APP SALEKIT
            </h4>
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