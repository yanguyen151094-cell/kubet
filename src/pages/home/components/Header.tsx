import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

export default function Header() {
  const { config } = useSiteConfigContext();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full relative z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        <a href="/" className="flex items-center">
          <img
            src={config.logo}
            alt="Salekit Logo"
            className="object-contain max-w-full"
            style={{ width: config.logoWidth, height: config.logoHeight }}
          />
        </a>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <a href="/#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap">{config.nav.howItWorks}</a>
          <a href="/#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap">{config.nav.features}</a>
          <a href="/#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap">{config.nav.pricing}</a>
          <a href="/#contact" className="text-sm text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap">{config.nav.contact}</a>
          <div className="flex items-center gap-3 ml-2">
            <Link
              to="/dang-nhap"
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap px-3 py-2 rounded-md hover:bg-gray-50"
            >
              Đăng nhập
            </Link>
            <Link
              to="/dang-ky"
              className="text-sm bg-gray-900 text-white px-4 py-2 rounded-md hover:bg-gray-800 transition-colors whitespace-nowrap"
            >
              Đăng ký
            </Link>
          </div>
        </nav>

        {/* Mobile: 2 auth buttons + hamburger */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            to="/dang-nhap"
            className="text-xs font-medium text-gray-700 border border-gray-300 px-2.5 py-1.5 rounded-md whitespace-nowrap"
          >
            Đăng nhập
          </Link>
          <Link
            to="/dang-ky"
            className="text-xs font-medium text-white px-2.5 py-1.5 rounded-md whitespace-nowrap"
            style={{ backgroundColor: config.authRegister.accentColor || '#2196f3' }}
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
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-200 shadow-sm">
          <nav className="flex flex-col px-4 py-3 gap-1">
            <a href="/#how-it-works" onClick={() => setMenuOpen(false)} className="text-sm text-gray-700 hover:bg-gray-50 px-3 py-2.5 rounded-md transition-colors whitespace-nowrap">{config.nav.howItWorks}</a>
            <a href="/#features" onClick={() => setMenuOpen(false)} className="text-sm text-gray-700 hover:bg-gray-50 px-3 py-2.5 rounded-md transition-colors whitespace-nowrap">{config.nav.features}</a>
            <a href="/#pricing" onClick={() => setMenuOpen(false)} className="text-sm text-gray-700 hover:bg-gray-50 px-3 py-2.5 rounded-md transition-colors whitespace-nowrap">{config.nav.pricing}</a>
            <a href="/#contact" onClick={() => setMenuOpen(false)} className="text-sm text-gray-700 hover:bg-gray-50 px-3 py-2.5 rounded-md transition-colors whitespace-nowrap">{config.nav.contact}</a>
          </nav>
        </div>
      )}
    </header>
  );
}