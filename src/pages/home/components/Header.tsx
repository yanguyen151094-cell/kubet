import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

export default function Header() {
  const { config } = useSiteConfigContext();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full relative z-50 bg-white border-b border-gray-100">
      <div className="w-full mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
        {/* Logo */}
        <a href="/" className="flex items-center shrink-0">
          <img
            src={config.logo}
            alt="Logo"
            className="object-contain max-w-full"
            style={{ width: config.logoWidth, height: config.logoHeight }}
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {(config.simpleNav ?? []).map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
          <div className="flex items-center gap-2 ml-2">
            <Link
              to="/dang-nhap"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap px-3 py-2 rounded-md hover:bg-gray-50"
            >
              Đăng nhập
            </Link>
            <Link
              to="/dang-ky"
              className="text-sm bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors whitespace-nowrap"
            >
              Đăng ký
            </Link>
          </div>
        </nav>

        {/* Mobile: auth buttons + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            to="/dang-nhap"
            className="text-xs font-medium text-gray-700 border border-gray-300 px-2.5 py-1.5 rounded-md whitespace-nowrap"
          >
            Đăng nhập
          </Link>
          <Link
            to="/dang-ky"
            className="text-xs font-medium text-white px-2.5 py-1.5 rounded-md whitespace-nowrap bg-red-600"
          >
            Đăng ký
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="w-10 h-10 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
            aria-label="Toggle menu"
          >
            <i className={`${menuOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl text-gray-700 w-6 h-6 flex items-center justify-center`} />
          </button>
        </div>
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 z-40">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {(config.simpleNav ?? []).map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                onClick={() => setMenuOpen(false)}
                className="text-sm text-gray-700 hover:bg-gray-50 px-3 py-2.5 rounded-md transition-colors whitespace-nowrap"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}