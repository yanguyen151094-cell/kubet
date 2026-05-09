import { useCallback, useState } from 'react';
import { useSiteConfigContext } from '@/contexts/SiteConfigContext';
import { defaultSiteConfig } from '@/mocks/siteConfig';
import ImageUpload from '@/components/ImageUpload';

interface Tab {
  id: string;
  label: string;
  icon: string;
}

const tabs: Tab[] = [
  { id: 'logo', label: 'Logo & Thương hiệu', icon: 'ri-image-line' },
  { id: 'nav', label: 'Menu điều hướng', icon: 'ri-menu-line' },
  { id: 'banner', label: 'Banner', icon: 'ri-gallery-line' },
  { id: 'content', label: 'Nội dung bài viết', icon: 'ri-article-line' },
  { id: 'auth', label: 'Đăng nhập / Đăng ký', icon: 'ri-user-line' },
];

export default function AdminDashboard() {
  const {
    config,
    setConfig,
    updateSimpleNav,
    updateSimpleNavItem,
    updateSimpleBanner,
    updateSimpleContentSection,
    updateSimpleContentArticle,
    updateAuthRegister,
    updateAuthLogin,
    resetConfig,
  } = useSiteConfigContext();

  const [activeTab, setActiveTab] = useState('logo');
  const [saved, setSaved] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Lưu vào localStorage - đã tự động qua useEffect trong useSiteConfig
  const handleSave = useCallback(() => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, []);

  const handleReset = useCallback(() => {
    if (!window.confirm('Bạn có chắc muốn reset về mặc định? Tất cả thay đổi sẽ bị mất.')) return;
    resetConfig();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [resetConfig]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Mobile header */}
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
          <a href="/" className="block w-full text-center text-sm text-gray-600 hover:text-gray-900 py-2">
            Xem trang chủ
          </a>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="md:hidden fixed inset-0 z-30 bg-black/20" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <div className="max-w-3xl">
          <div className="flex items-center justify-between mb-4 md:mb-6">
            <h1 className="text-lg md:text-xl font-bold text-gray-900">
              {tabs.find((t) => t.id === activeTab)?.label}
            </h1>
            <div className="flex items-center gap-2 md:gap-3">
              {saved && <span className="text-xs md:text-sm text-emerald-600">Đã lưu!</span>}
              <button
                onClick={handleSave}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 md:px-4 py-2 rounded-md text-xs md:text-sm font-medium transition-colors whitespace-nowrap cursor-pointer"
              >
                Lưu
              </button>
              <button onClick={handleReset} className="text-xs md:text-sm text-gray-500 hover:text-red-500 transition-colors cursor-pointer">
                Reset
              </button>
            </div>
          </div>

          {/* ===== TAB: LOGO ===== */}
          {activeTab === 'logo' && (
            <div className="bg-white rounded-lg p-6 space-y-5">
              <ImageUpload
                label="Logo website"
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

          {/* ===== TAB: NAV ===== */}
          {activeTab === 'nav' && (
            <div className="bg-white rounded-lg p-6 space-y-5">
              <p className="text-sm text-gray-500">Sửa tên menu và link. Menu này hiển thị ở header và footer.</p>
              {config.simpleNav.map((item, idx) => (
                <div key={idx} className="border border-gray-100 rounded-md p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-700">Menu {idx + 1}</h4>
                    {config.simpleNav.length > 2 && (
                      <button
                        onClick={() => {
                          const newNav = config.simpleNav.filter((_, i) => i !== idx);
                          updateSimpleNav(newNav);
                        }}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                      >
                        Xóa
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Tên menu</label>
                      <input
                        type="text"
                        value={item.label}
                        onChange={(e) => updateSimpleNavItem(idx, { label: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Link (href)</label>
                      <input
                        type="text"
                        value={item.href}
                        onChange={(e) => updateSimpleNavItem(idx, { href: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={() => updateSimpleNav([...config.simpleNav, { label: 'Menu mới', href: '/#' }])}
                className="w-full py-2.5 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors cursor-pointer"
              >
                + Thêm menu mới
              </button>
            </div>
          )}

          {/* ===== TAB: BANNER ===== */}
          {activeTab === 'banner' && (
            <div className="bg-white rounded-lg p-6 space-y-5">
              <ImageUpload
                label="Ảnh banner chính (slide 1)"
                value={config.simpleBanner.images?.[0] ?? ''}
                onChange={(url) => {
                  const imgs = config.simpleBanner.images?.length
                    ? [...config.simpleBanner.images]
                    : ['', '', '', ''];
                  imgs[0] = url;
                  updateSimpleBanner({ images: imgs });
                }}
                helpText="Chọn ảnh banner lớn hiển thị dưới header"
              />
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Alt text (SEO)</label>
                  <input
                    type="text"
                    value={config.simpleBanner.alt}
                    onChange={(e) => updateSimpleBanner({ alt: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Link khi click (để trống = không click)</label>
                  <input
                    type="text"
                    value={config.simpleBanner.link ?? ''}
                    onChange={(e) => updateSimpleBanner({ link: e.target.value || undefined })}
                    placeholder="e.g. /dang-ky"
                    className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ===== TAB: CONTENT ===== */}
          {activeTab === 'content' && (
            <div className="bg-white rounded-lg p-6 space-y-6">
              <p className="text-sm text-gray-500">Các section bài viết hiển thị trên trang chủ. Mỗi section có label, tiêu đề và nhiều bài viết nhỏ.</p>

              {config.simpleContent.sections.map((section, sIdx) => (
                <div key={section.id} className="border border-gray-200 rounded-lg p-4 md:p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-800">Section {sIdx + 1}: {section.title}</h3>
                    {config.simpleContent.sections.length > 1 && (
                      <button
                        onClick={() => {
                          const newSections = config.simpleContent.sections.filter((_, i) => i !== sIdx);
                          setConfig({ simpleContent: { sections: newSections } });
                        }}
                        className="text-xs text-red-500 hover:text-red-700 transition-colors cursor-pointer"
                      >
                        Xóa section
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">ID (anchor link)</label>
                      <input
                        type="text"
                        value={section.id}
                        onChange={(e) => updateSimpleContentSection(sIdx, { id: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Label nhỏ</label>
                      <input
                        type="text"
                        value={section.label}
                        onChange={(e) => updateSimpleContentSection(sIdx, { label: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">Tiêu đề section</label>
                      <input
                        type="text"
                        value={section.title}
                        onChange={(e) => updateSimpleContentSection(sIdx, { title: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Bài viết trong section</h4>
                    {section.articles.map((article, aIdx) => (
                      <div key={aIdx} className="bg-gray-50 rounded-md p-3 space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">Bài {aIdx + 1}</span>
                          {section.articles.length > 1 && (
                            <button
                              onClick={() => {
                                const newArticles = section.articles.filter((_, i) => i !== aIdx);
                                updateSimpleContentSection(sIdx, { articles: newArticles });
                              }}
                              className="text-xs text-red-400 hover:text-red-600 cursor-pointer"
                            >
                              Xóa bài
                            </button>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Tiêu đề bài</label>
                          <input
                            type="text"
                            value={article.title}
                            onChange={(e) => updateSimpleContentArticle(sIdx, aIdx, { title: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                          />
                        </div>
                        <ImageUpload
                          label="Ảnh minh họa bài viết (tùy chọn)"
                          value={article.image ?? ''}
                          onChange={(url) => updateSimpleContentArticle(sIdx, aIdx, { image: url })}
                          helpText="Để trống nếu không cần ảnh"
                        />
                        <div>
                          <label className="block text-xs text-gray-500 mb-1">Nội dung</label>
                          <textarea
                            value={article.content}
                            onChange={(e) => updateSimpleContentArticle(sIdx, aIdx, { content: e.target.value })}
                            rows={4}
                            maxLength={2000}
                            className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500 resize-none"
                          />
                          <p className="text-xs text-gray-400 text-right mt-1">{article.content.length}/2000</p>
                        </div>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newArticles = [...section.articles, { title: 'Bài viết mới', content: 'Nội dung bài viết...' }];
                        updateSimpleContentSection(sIdx, { articles: newArticles });
                      }}
                      className="w-full py-2 border-2 border-dashed border-gray-200 rounded-md text-xs text-gray-400 hover:border-emerald-300 hover:text-emerald-500 transition-colors cursor-pointer"
                    >
                      + Thêm bài viết
                    </button>
                  </div>
                </div>
              ))}

              <button
                onClick={() => {
                  const newId = `section-${config.simpleContent.sections.length + 1}`;
                  const newSections = [
                    ...config.simpleContent.sections,
                    { id: newId, label: 'Label mới', title: 'Tiêu đề mới', articles: [{ title: 'Bài 1', content: 'Nội dung...' }] },
                  ];
                  setConfig({ simpleContent: { sections: newSections } });
                }}
                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-md text-sm text-gray-500 hover:border-emerald-400 hover:text-emerald-600 transition-colors cursor-pointer"
              >
                + Thêm section mới
              </button>
            </div>
          )}

          {/* ===== TAB: AUTH ===== */}
          {activeTab === 'auth' && (
            <div className="space-y-6">
              {/* Register */}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Google Sheet</label>
                    <input
                      type="url"
                      value={config.authRegister.gSheetUrl}
                      onChange={(e) => updateAuthRegister({ gSheetUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
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
                    <input type="color" value={config.authRegister.bgColor} onChange={(e) => updateAuthRegister({ bgColor: e.target.value })} className="w-full h-10 rounded-md border border-gray-200 cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Màu nền khung</label>
                    <input type="color" value={config.authRegister.cardBg} onChange={(e) => updateAuthRegister({ cardBg: e.target.value })} className="w-full h-10 rounded-md border border-gray-200 cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Màu viền</label>
                    <input type="color" value={config.authRegister.borderColor} onChange={(e) => updateAuthRegister({ borderColor: e.target.value })} className="w-full h-10 rounded-md border border-gray-200 cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Màu nhấn/nút</label>
                    <input type="color" value={config.authRegister.accentColor} onChange={(e) => updateAuthRegister({ accentColor: e.target.value })} className="w-full h-10 rounded-md border border-gray-200 cursor-pointer" />
                  </div>
                </div>
              </div>

              {/* Login */}
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">URL Google Sheet</label>
                    <input
                      type="url"
                      value={config.authLogin.gSheetUrl}
                      onChange={(e) => updateAuthLogin({ gSheetUrl: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-emerald-500"
                    />
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
                    <input type="color" value={config.authLogin.bgColor} onChange={(e) => updateAuthLogin({ bgColor: e.target.value })} className="w-full h-10 rounded-md border border-gray-200 cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Màu nền khung</label>
                    <input type="color" value={config.authLogin.cardBg} onChange={(e) => updateAuthLogin({ cardBg: e.target.value })} className="w-full h-10 rounded-md border border-gray-200 cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Màu viền</label>
                    <input type="color" value={config.authLogin.borderColor} onChange={(e) => updateAuthLogin({ borderColor: e.target.value })} className="w-full h-10 rounded-md border border-gray-200 cursor-pointer" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">Màu nhấn/nút</label>
                    <input type="color" value={config.authLogin.accentColor} onChange={(e) => updateAuthLogin({ accentColor: e.target.value })} className="w-full h-10 rounded-md border border-gray-200 cursor-pointer" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}