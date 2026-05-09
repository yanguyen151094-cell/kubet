import { useCallback, useState } from 'react';
import { useSiteConfigContext } from '@/contexts/SiteConfigContext';
import { defaultSiteConfig } from '@/mocks/siteConfig';
import ImageUpload from '@/components/ImageUpload';
import SectionStyleEditor from './SectionStyleEditor';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: 'logo', label: 'Logo & Thương hiệu', icon: 'ri-image-line' },
  { id: 'nav', label: 'Menu điều hướng', icon: 'ri-menu-line' },
  { id: 'auth', label: 'Đăng nhập/Đăng ký', icon: 'ri-user-line' },
  { id: 'hero', label: 'Hero Section', icon: 'ri-home-4-line' },
  { id: 'howitworks', label: 'Cách hoạt động', icon: 'ri-settings-2-line' },
  { id: 'features', label: 'Tính năng', icon: 'ri-star-line' },
  { id: 'stats', label: 'Thống kê', icon: 'ri-bar-chart-line' },
  { id: 'screenshots', label: 'Screenshot', icon: 'ri-screenshot-line' },
  { id: 'testimonials', label: 'Đánh giá', icon: 'ri-chat-quote-line' },
  { id: 'pricing', label: 'Bảng giá', icon: 'ri-price-tag-3-line' },
  { id: 'faq', label: 'FAQ', icon: 'ri-question-line' },
  { id: 'contact', label: 'Liên hệ', icon: 'ri-mail-line' },
  { id: 'footer', label: 'Footer', icon: 'ri-pages-line' },
];

export default function AdminDashboard() {
  const {
    config,
    setConfig,
    updateHero,
    updateHowItWorks,
    updateHowItWorksItem,
    updateFeatureItem,
    updateStatsItem,
    updateScreenshotItem,
    updateTestimonialItem,
    updatePricingItem,
    updateFAQItem,
    updateContact,
    updateFooter,
    updateNav,
    updateAuthRegister,
    updateAuthLogin,
    updateHeroStyle,
    updateHowItWorksStyle,
    updateFeaturesStyle,
    updateStatsStyle,
    updateScreenshotsStyle,
    updateTestimonialsStyle,
    updateFAQStyle,
    updateContactStyle,
    updateFooterStyle,
    resetConfig,
    saveToDatabase,
  } = useSiteConfigContext();

  const [activeTab, setActiveTab] = useState('hero');
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [saveError, setSaveError] = useState('');

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaveError('');
    
    try {
      const result = await saveToDatabase();
      setSaving(false);
      if (result.success && !result.localOnly) {
        setSaved(true);
        setTimeout(() => { setSaved(false); setSaveError(''); }, 2000);
      } else if (result.success && result.localOnly) {
        setSaveError('Đã lưu local (DB lỗi: ' + (result.error || 'unknown') + ')');
        setTimeout(() => setSaveError(''), 4000);
      } else {
        setSaveError(result.error ?? 'Lỗi lưu');
        setTimeout(() => setSaveError(''), 3000);
      }
    } catch (err) {
      setSaving(false);
      console.error('Save error:', err);
      setSaveError('Lỗi kết nối server');
      setTimeout(() => setSaveError(''), 3000);
    }
  }, [saveToDatabase]);

  const handleReset = useCallback(async () => {
    if (!window.confirm('Bạn có chắc muốn reset về mặc định? Tất cả thay đổi sẽ bị mất.')) return;

    resetConfig();
    const result = await saveToDatabase(defaultSiteConfig);
    if (result.success) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  }, [resetConfig, saveToDatabase]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile header bar */}
      <div className="md:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <h2 className="text-base font-bold text-gray-900">Quản trị</h2>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="w-9 h-9 flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
          aria-label="Toggle sidebar"
        >
          <i className={`${sidebarOpen ? 'ri-close-line' : 'ri-menu-line'} text-xl text-gray-700 w-5 h-5 flex items-center justify-center`} />
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'fixed inset-0 z-40 bg-white' : 'hidden'} md:block md:relative md:w-64 md:shrink-0 md:bg-white md:border-r md:border-gray-200 overflow-y-auto`}>
        <div className="hidden md:block p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-gray-900">Quản trị</h2>
          <p className="text-xs text-gray-500 mt-1">Chỉnh sửa nội dung website</p>
        </div>
        <nav className="p-2 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors text-left cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-emerald-50 text-emerald-700 font-medium'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className={`${tab.icon} w-4 h-4 flex items-center justify-center`} />
              </span>
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-200 mt-auto">
          <a
            href="/"
            className="block w-full text-center text-sm text-gray-600 hover:text-gray-900 py-2"
          >
            Xem trang chủ
          </a>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/20"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-3xl">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h1 className="text-lg md:text-xl font-bold text-gray-900">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h1>
            <div className="flex items-center gap-2 md:gap-3">
              {saved && (
                <span className="text-xs md:text-sm text-emerald-600">Đã lưu!</span>
              )}
              {saveError && (
                <span className="text-xs md:text-sm text-red-500">{saveError}</span>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                className={`bg-emerald-500 hover:bg-emerald-600 text-white px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer ${saving ? 'opacity-70' : ''}`}
              >
                {saving ? 'Đang lưu...' : 'Lưu'}
              </button>
              <button
                onClick={handleReset}
                className="text-xs md:text-sm text-gray-500 hover:text-red-500 transition-colors cursor-pointer"
              >
                Reset
              </button>
            </div>
          </div>

          {activeTab === 'logo' && (
            <div className="bg-white rounded-lg p-6 space-y-4">
              <ImageUpload
                label="Logo"
                value={config.logo}
                onChange={(url) => setConfig({ logo: url })}
                helpText="Chọn ảnh logo từ máy tính hoặc nhập URL"
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Width (px)</label>
                  <input
                    type="number"
                    value={config.logoWidth}
                    onChange={(e) => setConfig({ logoWidth: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Height (px)</label>
                  <input
                    type="number"
                    value={config.logoHeight}
                    onChange={(e) => setConfig({ logoHeight: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'nav' && (
            <div className="bg-white rounded-lg p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cách hoạt động</label>
                  <input
                    type="text"
                    value={config.nav.howItWorks}
                    onChange={(e) => updateNav({ howItWorks: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tính năng</label>
                  <input
                    type="text"
                    value={config.nav.features}
                    onChange={(e) => updateNav({ features: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Bảng giá</label>
                  <input
                    type="text"
                    value={config.nav.pricing}
                    onChange={(e) => updateNav({ pricing: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Liên hệ</label>
                  <input
                    type="text"
                    value={config.nav.contact}
                    onChange={(e) => updateNav({ contact: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'auth' && (
            <div className="space-y-6">
              {/* ===== Register config ===== */}
              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 flex items-center justify-center bg-red-50 rounded-md">
                    <i className="ri-user-add-line w-5 h-5 flex items-center justify-center text-red-600" />
                  </span>
                  <h2 className="text-base font-semibold text-gray-900">Trang Đăng ký</h2>
                </div>
                <ImageUpload
                  label="Logo đăng ký"
                  value={config.authRegister.authLogo}
                  onChange={(url) => updateAuthRegister({ authLogo: url })}
                  helpText="Chọn ảnh logo hiển thị trên form đăng ký"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Width logo (px)</label>
                    <input
                      type="number"
                      value={config.authRegister.authLogoWidth}
                      onChange={(e) => updateAuthRegister({ authLogoWidth: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height logo (px)</label>
                    <input
                      type="number"
                      value={config.authRegister.authLogoHeight}
                      onChange={(e) => updateAuthRegister({ authLogoHeight: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Google Sheet (API endpoint)</label>
                    <input
                      type="url"
                      value={config.authRegister.gSheetUrl}
                      onChange={(e) => updateAuthRegister({ gSheetUrl: e.target.value })}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">Điền URL Google Apps Script Web App để nhận dữ liệu đăng ký</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                    <input
                      type="text"
                      value={config.authRegister.title}
                      onChange={(e) => updateAuthRegister({ title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phụ đề</label>
                    <input
                      type="text"
                      value={config.authRegister.subtitle}
                      onChange={(e) => updateAuthRegister({ subtitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nhãn SĐT</label>
                    <input
                      type="text"
                      value={config.authRegister.phoneLabel}
                      onChange={(e) => updateAuthRegister({ phoneLabel: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nút bấm</label>
                    <input
                      type="text"
                      value={config.authRegister.buttonText}
                      onChange={(e) => updateAuthRegister({ buttonText: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thông báo thành công</label>
                    <input
                      type="text"
                      value={config.authRegister.successMessage}
                      onChange={(e) => updateAuthRegister({ successMessage: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thông báo lỗi</label>
                    <input
                      type="text"
                      value={config.authRegister.errorMessage}
                      onChange={(e) => updateAuthRegister({ errorMessage: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thanh công cụ 1</label>
                    <input
                      type="text"
                      value={config.authRegister.toolbar1}
                      onChange={(e) => updateAuthRegister({ toolbar1: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thanh công cụ 2</label>
                    <input
                      type="text"
                      value={config.authRegister.toolbar2}
                      onChange={(e) => updateAuthRegister({ toolbar2: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Màu nền trang</label>
                    <input
                      type="color"
                      value={config.authRegister.bgColor}
                      onChange={(e) => updateAuthRegister({ bgColor: e.target.value })}
                      className="w-full h-10 rounded-md border border-gray-200 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Màu nền khung</label>
                    <input
                      type="color"
                      value={config.authRegister.cardBg}
                      onChange={(e) => updateAuthRegister({ cardBg: e.target.value })}
                      className="w-full h-10 rounded-md border border-gray-200 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Màu viền</label>
                    <input
                      type="color"
                      value={config.authRegister.borderColor}
                      onChange={(e) => updateAuthRegister({ borderColor: e.target.value })}
                      className="w-full h-10 rounded-md border border-gray-200 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Màu nhấn/nút</label>
                    <input
                      type="color"
                      value={config.authRegister.accentColor}
                      onChange={(e) => updateAuthRegister({ accentColor: e.target.value })}
                      className="w-full h-10 rounded-md border border-gray-200 cursor-pointer"
                    />
                  </div>
                </div>

                {/* === New Registration Form Fields === */}
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <h3 className="text-sm font-semibold text-gray-700 mb-3">Các trường form đăng ký</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nhãn mã giới thiệu</label>
                      <input
                        type="text"
                        value={config.authRegister.referralCodeLabel}
                        onChange={(e) => updateAuthRegister({ referralCodeLabel: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder mã giới thiệu</label>
                      <input
                        type="text"
                        value={config.authRegister.referralCodePlaceholder}
                        onChange={(e) => updateAuthRegister({ referralCodePlaceholder: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nhãn tài khoản</label>
                      <input
                        type="text"
                        value={config.authRegister.accountLabel}
                        onChange={(e) => updateAuthRegister({ accountLabel: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder tài khoản</label>
                      <input
                        type="text"
                        value={config.authRegister.accountPlaceholder}
                        onChange={(e) => updateAuthRegister({ accountPlaceholder: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Thông báo validate tài khoản</label>
                      <input
                        type="text"
                        value={config.authRegister.accountValidationText}
                        onChange={(e) => updateAuthRegister({ accountValidationText: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nhãn biệt danh</label>
                      <input
                        type="text"
                        value={config.authRegister.nicknameLabel}
                        onChange={(e) => updateAuthRegister({ nicknameLabel: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder biệt danh</label>
                      <input
                        type="text"
                        value={config.authRegister.nicknamePlaceholder}
                        onChange={(e) => updateAuthRegister({ nicknamePlaceholder: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nhãn mật khẩu</label>
                      <input
                        type="text"
                        value={config.authRegister.passwordLabel}
                        onChange={(e) => updateAuthRegister({ passwordLabel: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder mật khẩu</label>
                      <input
                        type="text"
                        value={config.authRegister.passwordPlaceholder}
                        onChange={(e) => updateAuthRegister({ passwordPlaceholder: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nút gửi mã OTP</label>
                      <input
                        type="text"
                        value={config.authRegister.otpButtonText}
                        onChange={(e) => updateAuthRegister({ otpButtonText: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder SĐT</label>
                      <input
                        type="text"
                        value={config.authRegister.otpPlaceholder}
                        onChange={(e) => updateAuthRegister({ otpPlaceholder: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nhãn mã xác nhận</label>
                      <input
                        type="text"
                        value={config.authRegister.confirmCodeLabel}
                        onChange={(e) => updateAuthRegister({ confirmCodeLabel: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Placeholder mã xác nhận</label>
                      <input
                        type="text"
                        value={config.authRegister.confirmCodePlaceholder}
                        onChange={(e) => updateAuthRegister({ confirmCodePlaceholder: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nút gửi mã xác nhận</label>
                      <input
                        type="text"
                        value={config.authRegister.confirmCodeButtonText}
                        onChange={(e) => updateAuthRegister({ confirmCodeButtonText: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nút xác nhận chính</label>
                      <input
                        type="text"
                        value={config.authRegister.confirmButtonText}
                        onChange={(e) => updateAuthRegister({ confirmButtonText: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung checkbox 1</label>
                      <input
                        type="text"
                        value={config.authRegister.checkbox1Label}
                        onChange={(e) => updateAuthRegister({ checkbox1Label: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nội dung checkbox 2</label>
                      <input
                        type="text"
                        value={config.authRegister.checkbox2Label}
                        onChange={(e) => updateAuthRegister({ checkbox2Label: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Text link điều khoản</label>
                      <input
                        type="text"
                        value={config.authRegister.termsLinkText}
                        onChange={(e) => updateAuthRegister({ termsLinkText: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">URL điều khoản</label>
                      <input
                        type="url"
                        value={config.authRegister.termsUrl}
                        onChange={(e) => updateAuthRegister({ termsUrl: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* ===== Login config ===== */}
              <div className="bg-white rounded-lg p-6 space-y-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-8 h-8 flex items-center justify-center bg-red-50 rounded-md">
                    <i className="ri-login-box-line w-5 h-5 flex items-center justify-center text-red-600" />
                  </span>
                  <h2 className="text-base font-semibold text-gray-900">Trang Đăng nhập</h2>
                </div>
                <ImageUpload
                  label="Logo đăng nhập"
                  value={config.authLogin.authLogo}
                  onChange={(url) => updateAuthLogin({ authLogo: url })}
                  helpText="Chọn ảnh logo hiển thị trên form đăng nhập"
                />
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Width logo (px)</label>
                    <input
                      type="number"
                      value={config.authLogin.authLogoWidth}
                      onChange={(e) => updateAuthLogin({ authLogoWidth: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Height logo (px)</label>
                    <input
                      type="number"
                      value={config.authLogin.authLogoHeight}
                      onChange={(e) => updateAuthLogin({ authLogoHeight: Number(e.target.value) })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Google Sheet (API endpoint)</label>
                    <input
                      type="url"
                      value={config.authLogin.gSheetUrl}
                      onChange={(e) => updateAuthLogin({ gSheetUrl: e.target.value })}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                    <p className="text-xs text-gray-400 mt-1">Điền URL Google Apps Script Web App để nhận dữ liệu đăng nhập</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                    <input
                      type="text"
                      value={config.authLogin.title}
                      onChange={(e) => updateAuthLogin({ title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phụ đề</label>
                    <input
                      type="text"
                      value={config.authLogin.subtitle}
                      onChange={(e) => updateAuthLogin({ subtitle: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nhãn SĐT</label>
                    <input
                      type="text"
                      value={config.authLogin.phoneLabel}
                      onChange={(e) => updateAuthLogin({ phoneLabel: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nhãn tên đăng nhập</label>
                    <input
                      type="text"
                      value={config.authLogin.usernameLabel}
                      onChange={(e) => updateAuthLogin({ usernameLabel: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nút bấm</label>
                    <input
                      type="text"
                      value={config.authLogin.buttonText}
                      onChange={(e) => updateAuthLogin({ buttonText: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thông báo thành công</label>
                    <input
                      type="text"
                      value={config.authLogin.successMessage}
                      onChange={(e) => updateAuthLogin({ successMessage: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thanh công cụ 1</label>
                    <input
                      type="text"
                      value={config.authLogin.toolbar1}
                      onChange={(e) => updateAuthLogin({ toolbar1: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Thanh công cụ 2</label>
                    <input
                      type="text"
                      value={config.authLogin.toolbar2}
                      onChange={(e) => updateAuthLogin({ toolbar2: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Màu nền trang</label>
                    <input
                      type="color"
                      value={config.authLogin.bgColor}
                      onChange={(e) => updateAuthLogin({ bgColor: e.target.value })}
                      className="w-full h-10 rounded-md border border-gray-200 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Màu nền khung</label>
                    <input
                      type="color"
                      value={config.authLogin.cardBg}
                      onChange={(e) => updateAuthLogin({ cardBg: e.target.value })}
                      className="w-full h-10 rounded-md border border-gray-200 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Màu viền</label>
                    <input
                      type="color"
                      value={config.authLogin.borderColor}
                      onChange={(e) => updateAuthLogin({ borderColor: e.target.value })}
                      className="w-full h-10 rounded-md border border-gray-200 cursor-pointer"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Màu nhấn/nút</label>
                    <input
                      type="color"
                      value={config.authLogin.accentColor}
                      onChange={(e) => updateAuthLogin({ accentColor: e.target.value })}
                      className="w-full h-10 rounded-md border border-gray-200 cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'hero' && (
            <div className="bg-white rounded-lg p-6 space-y-6">
              <SectionStyleEditor
                label="Kích thước & giao diện Hero"
                style={config.heroStyle}
                onChange={updateHeroStyle}
              />
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                  <input
                    type="text"
                    value={config.hero.title}
                    onChange={(e) => updateHero({ title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    value={config.hero.subtitle}
                    onChange={(e) => updateHero({ subtitle: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nút bấm</label>
                  <input
                    type="text"
                    value={config.hero.buttonText}
                    onChange={(e) => updateHero({ buttonText: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <ImageUpload
                  label="Ảnh điện thoại"
                  value={config.hero.phoneImage}
                  onChange={(url) => updateHero({ phoneImage: url })}
                  helpText="Chọn ảnh điện thoại/mockup từ máy tính"
                />
                <ImageUpload
                  label="Ảnh logo hero"
                  value={config.hero.logoImage}
                  onChange={(url) => updateHero({ logoImage: url })}
                  helpText="Chọn logo hiển thị trong hero section"
                />
              </div>
            </div>
          )}

          {activeTab === 'howitworks' && (
            <div className="bg-white rounded-lg p-6 space-y-6">
              <SectionStyleEditor
                label="Kích thước & giao diện Cách hoạt động"
                style={config.howItWorksStyle}
                onChange={updateHowItWorksStyle}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                  <input
                    type="text"
                    value={config.howItWorks.label}
                    onChange={(e) => updateHowItWorks({ label: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                  <input
                    type="text"
                    value={config.howItWorks.title}
                    onChange={(e) => updateHowItWorks({ title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <input
                    type="text"
                    value={config.howItWorks.subtitle}
                    onChange={(e) => updateHowItWorks({ subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <div className="space-y-4">
                {config.howItWorks.items.map((item, idx) => (
                  <div key={idx} className="border border-gray-100 rounded-md p-4 space-y-3">
                    <h4 className="text-sm font-semibold text-gray-700">Item {idx + 1}</h4>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Tiêu đề</label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) => updateHowItWorksItem(idx, { title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Mô tả</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => updateHowItWorksItem(idx, { description: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Icon (Remix icon class)</label>
                      <input
                        type="text"
                        value={item.icon}
                        onChange={(e) => updateHowItWorksItem(idx, { icon: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'features' && (
            <div className="bg-white rounded-lg p-6 space-y-6">
              <SectionStyleEditor
                label="Kích thước & giao diện Tính năng"
                style={config.featuresStyle}
                onChange={updateFeaturesStyle}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                  <input
                    type="text"
                    value={config.features.label}
                    onChange={(e) => setConfig({ features: { ...config.features, label: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                  <input
                    type="text"
                    value={config.features.title}
                    onChange={(e) => setConfig({ features: { ...config.features, title: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <input
                    type="text"
                    value={config.features.subtitle}
                    onChange={(e) => setConfig({ features: { ...config.features, subtitle: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              {config.features.items.map((item, idx) => (
                <div key={idx} className="border border-gray-100 rounded-md p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700">Feature {idx + 1}</h4>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Tiêu đề</label>
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => updateFeatureItem(idx, { title: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Mô tả</label>
                    <textarea
                      value={item.description}
                      onChange={(e) => updateFeatureItem(idx, { description: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>
                  <ImageUpload
                    label="Ảnh minh họa"
                    value={item.image}
                    onChange={(url) => updateFeatureItem(idx, { image: url })}
                  />
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Vị trí ảnh</label>
                    <select
                      value={item.imagePosition}
                      onChange={(e) => updateFeatureItem(idx, { imagePosition: e.target.value as 'left' | 'right' })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    >
                      <option value="left">Bên trái</option>
                      <option value="right">Bên phải</option>
                    </select>
                  </div>
                  {item.bullets.map((bullet, bIdx) => (
                    <div key={bIdx}>
                      <label className="block text-xs text-gray-500 mb-1">Bullet {bIdx + 1}</label>
                      <input
                        type="text"
                        value={bullet}
                        onChange={(e) => {
                          const newBullets = [...item.bullets];
                          newBullets[bIdx] = e.target.value;
                          updateFeatureItem(idx, { bullets: newBullets });
                        }}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="bg-white rounded-lg p-6 space-y-6">
              <SectionStyleEditor
                label="Kích thước & giao diện Thống kê"
                style={config.statsStyle}
                onChange={updateStatsStyle}
              />
              {config.stats.items.map((stat, idx) => (
                <div key={idx} className="border border-gray-100 rounded-md p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700">Stat {idx + 1}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Giá trị</label>
                      <input
                        type="text"
                        value={stat.value}
                        onChange={(e) => updateStatsItem(idx, { value: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Nhãn</label>
                      <input
                        type="text"
                        value={stat.label}
                        onChange={(e) => updateStatsItem(idx, { label: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'screenshots' && (
            <div className="bg-white rounded-lg p-6 space-y-6">
              <SectionStyleEditor
                label="Kích thước & giao diện Screenshot"
                style={config.screenshotsStyle}
                onChange={updateScreenshotsStyle}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                  <input
                    type="text"
                    value={config.screenshots.label}
                    onChange={(e) => setConfig({ screenshots: { ...config.screenshots, label: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                  <input
                    type="text"
                    value={config.screenshots.title}
                    onChange={(e) => setConfig({ screenshots: { ...config.screenshots, title: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <input
                    type="text"
                    value={config.screenshots.subtitle}
                    onChange={(e) => setConfig({ screenshots: { ...config.screenshots, subtitle: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              {config.screenshots.items.map((item, idx) => (
                <div key={idx} className="border border-gray-100 rounded-md p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700">Screenshot {idx + 1}</h4>
                  <ImageUpload
                    label="Ảnh screenshot"
                    value={item.image}
                    onChange={(url) => updateScreenshotItem(idx, { image: url })}
                  />
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Alt text</label>
                    <input
                      type="text"
                      value={item.alt}
                      onChange={(e) => updateScreenshotItem(idx, { alt: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'testimonials' && (
            <div className="bg-white rounded-lg p-6 space-y-6">
              <SectionStyleEditor
                label="Kích thước & giao diện Đánh giá"
                style={config.testimonialsStyle}
                onChange={updateTestimonialsStyle}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                  <input
                    type="text"
                    value={config.testimonials.label}
                    onChange={(e) => setConfig({ testimonials: { ...config.testimonials, label: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                  <input
                    type="text"
                    value={config.testimonials.title}
                    onChange={(e) => setConfig({ testimonials: { ...config.testimonials, title: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <input
                    type="text"
                    value={config.testimonials.subtitle}
                    onChange={(e) => setConfig({ testimonials: { ...config.testimonials, subtitle: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              {config.testimonials.items.map((item, idx) => (
                <div key={idx} className="border border-gray-100 rounded-md p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700">Testimonial {idx + 1}</h4>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Tên</label>
                    <input
                      type="text"
                      value={item.name}
                      onChange={(e) => updateTestimonialItem(idx, { name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Vai trò</label>
                    <input
                      type="text"
                      value={item.role}
                      onChange={(e) => updateTestimonialItem(idx, { role: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Lời nhận xét</label>
                    <textarea
                      value={item.quote}
                      onChange={(e) => updateTestimonialItem(idx, { quote: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>
                  <ImageUpload
                    label="Avatar"
                    value={item.avatar}
                    onChange={(url) => updateTestimonialItem(idx, { avatar: url })}
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'pricing' && (
            <div className="bg-white rounded-lg p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                  <input
                    type="text"
                    value={config.pricing.label}
                    onChange={(e) => setConfig({ pricing: { ...config.pricing, label: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                  <input
                    type="text"
                    value={config.pricing.title}
                    onChange={(e) => setConfig({ pricing: { ...config.pricing, title: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <input
                    type="text"
                    value={config.pricing.subtitle}
                    onChange={(e) => setConfig({ pricing: { ...config.pricing, subtitle: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              {config.pricing.items.map((item, idx) => (
                <div key={idx} className="border border-gray-100 rounded-md p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700">Gói {idx + 1}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Tên gói</label>
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => updatePricingItem(idx, { name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Giá</label>
                      <input
                        type="text"
                        value={item.price}
                        onChange={(e) => updatePricingItem(idx, { price: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Kỳ hạn</label>
                      <input
                        type="text"
                        value={item.period}
                        onChange={(e) => updatePricingItem(idx, { period: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Nút bấm</label>
                      <input
                        type="text"
                        value={item.buttonText}
                        onChange={(e) => updatePricingItem(idx, { buttonText: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Tính năng (phân cách bằng dấu phẩy)</label>
                    <input
                      type="text"
                      value={item.features.join(', ')}
                      onChange={(e) => updatePricingItem(idx, { features: e.target.value.split(',').map((f) => f.trim()) })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={item.highlighted}
                      onChange={(e) => updatePricingItem(idx, { highlighted: e.target.checked })}
                      className="w-4 h-4 accent-emerald-500"
                    />
                    <label className="text-sm text-gray-600">Nổi bật (highlight)</label>
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="bg-white rounded-lg p-6 space-y-6">
              <SectionStyleEditor
                label="Kích thước & giao diện FAQ"
                style={config.faqStyle}
                onChange={updateFAQStyle}
              />
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Label</label>
                  <input
                    type="text"
                    value={config.faq.label}
                    onChange={(e) => setConfig({ faq: { ...config.faq, label: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                  <input
                    type="text"
                    value={config.faq.title}
                    onChange={(e) => setConfig({ faq: { ...config.faq, title: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <input
                    type="text"
                    value={config.faq.subtitle}
                    onChange={(e) => setConfig({ faq: { ...config.faq, subtitle: e.target.value } })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
              <ImageUpload
                label="Ảnh FAQ"
                value={config.faq.image}
                onChange={(url) => setConfig({ faq: { ...config.faq, image: url } })}
              />
              {config.faq.items.map((item, idx) => (
                <div key={idx} className="border border-gray-100 rounded-md p-4 space-y-3">
                  <h4 className="text-sm font-semibold text-gray-700">FAQ {idx + 1}</h4>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Câu hỏi</label>
                    <input
                      type="text"
                      value={item.question}
                      onChange={(e) => updateFAQItem(idx, { question: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Câu trả lời</label>
                    <textarea
                      value={item.answer}
                      onChange={(e) => updateFAQItem(idx, { answer: e.target.value })}
                      rows={2}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500 resize-none"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'contact' && (
            <div className="bg-white rounded-lg p-6 space-y-6">
              <SectionStyleEditor
                label="Kích thước & giao diện Liên hệ"
                style={config.contactStyle}
                onChange={updateContactStyle}
              />
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Tiêu đề</label>
                  <input
                    type="text"
                    value={config.contact.title}
                    onChange={(e) => updateContact({ title: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle</label>
                  <input
                    type="text"
                    value={config.contact.subtitle}
                    onChange={(e) => updateContact({ subtitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
                  <textarea
                    value={config.contact.description}
                    onChange={(e) => updateContact({ description: e.target.value })}
                    rows={2}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500 resize-none"
                  />
                </div>
                <ImageUpload
                  label="Ảnh minh họa liên hệ"
                  value={config.contact.formImage}
                  onChange={(url) => updateContact({ formImage: url })}
                />
              </div>
            </div>
          )}

          {activeTab === 'footer' && (
            <div className="bg-white rounded-lg p-6 space-y-6">
              <SectionStyleEditor
                label="Kích thước & giao diện Footer"
                style={config.footerStyle}
                onChange={updateFooterStyle}
              />
              <div className="space-y-4">
                <ImageUpload
                  label="Logo Footer"
                  value={config.footer.logo}
                  onChange={(url) => updateFooter({ logo: url })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ</label>
                  <input
                    type="text"
                    value={config.footer.address}
                    onChange={(e) => updateFooter({ address: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Điện thoại</label>
                  <input
                    type="text"
                    value={config.footer.phone}
                    onChange={(e) => updateFooter({ phone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="text"
                    value={config.footer.email}
                    onChange={(e) => updateFooter({ email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Links cột 1 (phân cách bằng dấu phẩy)</label>
                  <input
                    type="text"
                    value={config.footer.links1.join(', ')}
                    onChange={(e) => updateFooter({ links1: e.target.value.split(',').map((l) => l.trim()) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Links cột 2 (phân cách bằng dấu phẩy)</label>
                  <input
                    type="text"
                    value={config.footer.links2.join(', ')}
                    onChange={(e) => updateFooter({ links2: e.target.value.split(',').map((l) => l.trim()) })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <ImageUpload
                  label="App Store Image"
                  value={config.footer.appStoreImage}
                  onChange={(url) => updateFooter({ appStoreImage: url })}
                />
                <ImageUpload
                  label="Play Store Image"
                  value={config.footer.playStoreImage}
                  onChange={(url) => updateFooter({ playStoreImage: url })}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Copyright</label>
                  <input
                    type="text"
                    value={config.footer.copyright}
                    onChange={(e) => updateFooter({ copyright: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}