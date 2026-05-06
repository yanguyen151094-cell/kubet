import { useState, useCallback } from 'react';
import { useSiteConfigContext } from '@/contexts/SiteConfigContext';

export default function Contact() {
  const { config } = useSiteConfigContext();
  const { title, subtitle, description, formImage } = config.contact;
  const { contactStyle } = config;

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', email: '', phone: '', note: '' });

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }, []);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ full_name: '', email: '', phone: '', note: '' });
  }, []);

  return (
    <section
      id="contact"
      className="w-full"
      style={{
        paddingTop: contactStyle.paddingTop,
        paddingBottom: contactStyle.paddingBottom,
        backgroundColor: contactStyle.bgColor,
      }}
    >
      <div className="mx-auto px-4 md:px-6 text-center mb-10" style={{ maxWidth: contactStyle.maxWidth }}>
        <p
          className="font-semibold text-gray-500 uppercase tracking-wider mb-2"
          style={{ fontSize: contactStyle.labelSize }}
        >
          {subtitle}
        </p>
        <h2
          className="font-bold text-gray-900 mb-3"
          style={{ fontSize: contactStyle.titleSize }}
        >
          {title}
        </h2>
        <p
          className="text-gray-500 max-w-xl mx-auto"
          style={{ fontSize: contactStyle.subtitleSize }}
        >
          {description}
        </p>
      </div>
      <div className="mx-auto px-4 md:px-6" style={{ maxWidth: contactStyle.maxWidth }}>
        <div className="flex flex-col md:flex-row items-center" style={{ gap: contactStyle.gap }}>
          <div className="md:w-1/2 w-full">
            <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
              <input
                type="text"
                name="full_name"
                placeholder="Họ và tên"
                value={formData.full_name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 md:py-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-emerald-500"
              />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 md:py-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-emerald-500"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Số điện thoại"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 md:py-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-emerald-500"
              />
              <textarea
                name="note"
                placeholder="Để lại lời nhắn cho chúng tôi"
                value={formData.note}
                onChange={handleChange}
                maxLength={500}
                rows={3}
                className="w-full px-4 py-2.5 md:py-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-emerald-500 resize-none"
              />
              <button
                type="submit"
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 md:py-3 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer"
              >
                ĐĂNG KÝ NGAY
              </button>
              {submitted && (
                <p className="text-sm text-emerald-600 text-center">Cảm ơn bạn đã quan tâm!</p>
              )}
            </form>
          </div>
          <div className="md:w-1/2 flex justify-center w-full">
            <img
              src={formImage}
              alt="Contact"
              width={438}
              height={412}
              className="w-full max-w-[260px] sm:max-w-sm object-contain"
            />
          </div>
        </div>
      </div>
    </section>
  );
}