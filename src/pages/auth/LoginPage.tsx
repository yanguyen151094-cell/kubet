import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

export default function LoginPage() {
  const { config } = useSiteConfigContext();
  const c = config.authLogin;

  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('submitting');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const params = new URLSearchParams();
    formData.forEach((value, key) => {
      if (typeof value === 'string') params.append(key, value);
    });

    try {
      const res = await fetch('https://readdy.ai/api/form/d7t9924cmq04e0g4evvg', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString(),
      });
      if (res.ok) {
        setStatus('success');
        setPhone('');
        setUsername('');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: c.bgColor }}>
      {/* Toolbar 1 */}
      <div
        className="w-full py-2.5 text-center text-xs font-medium tracking-wide"
        style={{ backgroundColor: c.accentColor, color: '#ffffff' }}
      >
        <div className="flex items-center justify-center gap-2 px-4">
          <span className="w-4 h-4 flex items-center justify-center">
            <i className="ri-football-line w-4 h-4 flex items-center justify-center" />
          </span>
          <span className="whitespace-nowrap">{c.toolbar1}</span>
        </div>
      </div>

      {/* Toolbar 2 */}
      <div
        className="w-full py-2 text-center text-xs font-medium tracking-wide"
        style={{ backgroundColor: '#000000', color: '#ffffff' }}
      >
        <div className="flex items-center justify-center gap-2 px-4">
          <span className="w-4 h-4 flex items-center justify-center">
            <i className="ri-trophy-line w-4 h-4 flex items-center justify-center text-yellow-400" />
          </span>
          <span className="whitespace-nowrap">{c.toolbar2}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm">
          {/* Card */}
          <div
            className="rounded-xl p-6 md:p-8 border-2"
            style={{
              backgroundColor: c.cardBg,
              borderColor: c.borderColor,
            }}
          >
            <div className="text-center mb-6">
              <img
                src={c.authLogo}
                alt="Kubet Logo"
                className="mx-auto mb-4 object-contain"
                style={{ width: c.authLogoWidth, height: c.authLogoHeight }}
              />
              <h1 className="text-xl font-semibold text-gray-900">{c.title}</h1>
              <p className="text-sm text-gray-500 mt-1">{c.subtitle}</p>
            </div>

            <form id="dang-nhap-kubet" data-readdy-form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="login-phone" className="block text-sm font-medium text-gray-700 mb-1">
                  {c.phoneLabel}
                </label>
                <input
                  id="login-phone"
                  name="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0909 123 456"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-all"
                />
              </div>

              <div>
                <label htmlFor="login-username" className="block text-sm font-medium text-gray-700 mb-1">
                  {c.usernameLabel}
                </label>
                <input
                  id="login-username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Tên đăng nhập của bạn"
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full text-white text-sm font-bold py-3 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap hover:brightness-110"
                style={{ backgroundColor: c.accentColor }}
              >
                {status === 'submitting' ? (
                  <span className="inline-flex items-center gap-2">
                    <span className="w-4 h-4 flex items-center justify-center">
                      <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
                    </span>
                    Đang xử lý...
                  </span>
                ) : (
                  c.buttonText
                )}
              </button>
            </form>

            {status === 'success' && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md text-sm text-green-700 flex items-start gap-2">
                <span className="mt-0.5 w-4 h-4 flex items-center justify-center flex-shrink-0">
                  <i className="ri-checkbox-circle-line w-4 h-4 flex items-center justify-center" />
                </span>
                {c.successMessage}
              </div>
            )}

            {status === 'error' && (
              <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-sm text-red-700 flex items-start gap-2">
                <span className="mt-0.5 w-4 h-4 flex items-center justify-center flex-shrink-0">
                  <i className="ri-error-warning-line w-4 h-4 flex items-center justify-center" />
                </span>
                {c.errorMessage}
              </div>
            )}

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-500">
                Chưa có tài khoản?{' '}
                <Link
                  to="/dang-ky"
                  className="font-semibold hover:underline"
                  style={{ color: c.accentColor }}
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>

          {/* Back to home */}
          <div className="mt-6 text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-200 transition-colors"
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-arrow-left-line w-4 h-4 flex items-center justify-center" />
              </span>
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}