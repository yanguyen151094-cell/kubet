import { Link } from 'react-router-dom';
import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

export default function Footer() {
  const { config } = useSiteConfigContext();

  return (
    <footer className="w-full bg-gray-50 border-t border-gray-200">
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
          {/* Logo + info */}
          <div className="sm:col-span-2 lg:col-span-1">
            <a href="/" className="inline-block mb-4">
              <img
                src={config.logo}
                alt="Logo"
                className="object-contain max-w-full"
                style={{ width: config.logoWidth, height: config.logoHeight }}
              />
            </a>
            <p className="text-xs md:text-sm text-gray-500 leading-relaxed">
              Nền tảng giải trí trực tuyến hàng đầu với dịch vụ chất lượng cao.
            </p>
          </div>

          {/* Nav links */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 md:mb-4">Menu</h4>
            <ul className="space-y-2">
              {(config.simpleNav ?? []).slice(0, 4).map((item, idx) => (
                <li key={idx}>
                  <a href={item.href} className="text-xs md:text-sm text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap">
                    {item.label}
                  </a>
                </li>
              ))}
              <li>
                <Link to="/dang-ky" className="text-xs md:text-sm text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap">
                  Đăng ký
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 md:mb-4">Liên hệ</h4>
            <ul className="space-y-2 text-xs md:text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 flex items-center justify-center"><i className="ri-phone-line text-gray-400 w-3 h-3 flex items-center justify-center" /></span>
                <span>089 898 6008</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 flex items-center justify-center"><i className="ri-mail-line text-gray-400 w-3 h-3 flex items-center justify-center" /></span>
                <span>cskh@salemall.vn</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="w-4 h-4 flex items-center justify-center"><i className="ri-map-pin-line text-gray-400 w-3 h-3 flex items-center justify-center" /></span>
                <span>247 Cầu Giấy, Hà Nội</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3 md:mb-4">Mạng xã hội</h4>
            <div className="flex items-center gap-3">
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors" aria-label="Facebook">
                <i className="ri-facebook-fill text-gray-600 w-4 h-4 flex items-center justify-center" />
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors" aria-label="Telegram">
                <i className="ri-telegram-fill text-gray-600 w-4 h-4 flex items-center justify-center" />
              </a>
              <a href="#" className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 hover:bg-gray-300 transition-colors" aria-label="Zalo">
                <i className="ri-chat-1-fill text-gray-600 w-4 h-4 flex items-center justify-center" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 md:mt-10 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500">
            &copy; {new Date().getFullYear()} All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}