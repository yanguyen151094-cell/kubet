import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

export default function Header() {
  const { config } = useSiteConfigContext();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="w-full relative z-50 bg-white border-b border-gray-100">
      <div className="w-full mx-auto px-3 md:px-6 py-2 md:py-3 flex items-center justify-between gap-2">
        {/* Logo — giới hạn cứng không vượt quá */}
        <a href="/" className="flex items-center shrink-0">
          <img
            src={config.logo}
            alt="Logo"
            className="object-contain"
            style={{
              maxWidth: 120,
              maxHeight: 40,
              width: 'auto',
              height: 'auto',
            }}
          />
        </a>

        {/* Desktop nav links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-8">
          {(config.simpleNav ?? []).map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="text-sm text-gray-600 hover:text-gray-900 transition-colors whitespace-nowrap"
            >
              {item.label}
            </a>
          ))}
        </nav>

        {/* Auth buttons — ALWAYS VISIBLE on both mobile & desktop */}
        <div className="flex items-center gap-1.5 md:gap-2 shrink-0">
          <Link
            to="/dang-nhap"
            className="text-[11px] md:text-sm font-semibold text-red-600 border border-red-200 px-2 py-1 md:px-3 md:py-2 rounded-md whitespace-nowrap transition-colors hover:bg-red-50"
          >
            Đăng nhập
          </Link>
          <Link
            to="/dang-ky"
            className="text-[11px] md:text-sm font-semibold text-white px-2 py-1 md:px-4 md:py-2 rounded-md whitespace-nowrap bg-red-600 hover:bg-red-700 transition-colors"
          >
            Đăng ký
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-8 h-8 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors cursor-pointer shrink-0 ml-1"
            aria-label="Toggle menu"
          >
            <i className={`${menuOpen ? 'ri-close-line' : 'ri-menu-line'} text-lg text-gray-700 w-5 h-5 flex items-center justify-center`} />
          </button>
        </div>
      </div>

      {/* Mobile menu panel (nav links only) */}
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