import type { SiteConfig } from '@/hooks/useSiteConfig';

export const defaultSiteConfig: SiteConfig = {
  logo: 'https://salekit.page/assets/images/logo/logo.png',
  logoWidth: 240,
  logoHeight: 56,
  nav: {
    howItWorks: 'Cách hoạt động',
    features: 'Tính năng',
    pricing: 'Bảng giá',
    contact: 'Liên hệ',
  },
  hero: {
    title: 'Hãy xây dựng sản phẩm của bạn bằng ứng dụng Appexy.',
    subtitle: 'Nhưng quả thực, cả hai chúng ta đều buộc tội và đưa ra những kẻ đáng bị căm ghét, những kẻ bị nhu nhược và hư hỏng bởi sự tâng bốc của những thú vui hiện tại, những kẻ phải chịu đau đớn và rắc rối, và những điều tương tự, là do lỗi của chúng ta đã không chu cấp.',
    buttonText: 'Hãy bắt đầu',
    phoneImage: 'https://salekit.page/assets/images/appexy/phones.png',
    logoImage: 'https://salekit.page/assets/images/logo/logo.png',
  },
  howItWorks: {
    label: 'Appexy hoạt động như thế nào',
    title: 'LÀM THẾ NÀO NÓ HOẠT ĐỘNG ?',
    subtitle: 'Nhưng để bạn có thể thấy tất cả lỗi này đã phát sinh từ đâu, tôi sẽ mở vấn đề cho những người buộc tội niềm vui và nỗi đau.',
    items: [
      {
        title: '1. Trình chỉnh sửa trực quan',
        description: 'Vì không ai ghét đau đớn vì bản thân nó là niềm vui.',
        icon: 'ri-edit-line',
      },
      {
        title: '2. Bộ sưu tập thiết kế khổng lồ',
        description: 'Vì không ai ghét đau đớn vì bản thân nó là niềm vui.',
        icon: 'ri-gallery-line',
      },
      {
        title: '3. Cài đặt bằng một cú nhấp chuột',
        description: 'Vì không ai ghét đau đớn vì bản thân nó là niềm vui.',
        icon: 'ri-download-line',
      },
    ],
  },
  features: {
    label: 'Các tính năng của Appexy',
    title: 'Giải pháp thông minh cho người mua',
    subtitle: 'Nhưng để bạn có thể thấy tất cả lỗi này đã phát sinh từ đâu, tôi sẽ mở vấn đề cho những người buộc tội niềm vui và nỗi đau.',
    items: [
      {
        title: 'Khám phá điểm đến của bạn',
        description: 'Mặt khác, chúng tôi tố cáo với sự phẫn nộ chính đáng đến mức mù quáng đến mức họ không thể.',
        bullets: [
          'Do đó, người khôn ngoan luôn giữ trong chúng ta vấn đề đối với nguyên tắc này là sự lựa chọn và từ chối những thú vui.',
          'Nhưng hãy để tất cả lỗi lầm bẩm sinh của những người tố cáo và nỗi đau của những người khen ngợi thấy.',
          'Và thực sự, việc phân biệt mọi thứ rất dễ dàng và phù hợp trong thời gian rảnh rỗi của chúng ta.',
        ],
        image: 'https://salekit.page/assets/images/appexy/feature1.png',
        imagePosition: 'left',
      },
      {
        title: 'Kết nối mọi người, địa điểm',
        description: 'Mặt khác, chúng tôi tố cáo với sự phẫn nộ chính đáng đến mức mù quáng đến mức họ không thể.',
        bullets: [
          'Do đó, người khôn ngoan luôn giữ trong chúng ta vấn đề đối với nguyên tắc này là sự lựa chọn và từ chối những thú vui.',
          'Nhưng hãy để tất cả lỗi lầm bẩm sinh của những người tố cáo và nỗi đau của những người khen ngợi thấy.',
          'Và thực sự, việc phân biệt mọi thứ rất dễ dàng và phù hợp trong thời gian rảnh rỗi của chúng ta.',
        ],
        image: 'https://salekit.page/assets/images/appexy/feature2.png',
        imagePosition: 'right',
      },
    ],
  },
  stats: {
    items: [
      { value: '825', label: 'GLOBAL BRANDS' },
      { value: '1800+', label: 'HAPPY CLIENTS' },
      { value: '599+', label: 'CREATIVE IDEA' },
      { value: '2000+', label: 'USER CLIENTS' },
    ],
  },
  screenshots: {
    label: 'Màn hình ứng dụng của Appexy',
    title: 'Ảnh chụp màn hình tuyệt vời',
    subtitle: 'Nhưng để bạn có thể thấy tất cả lỗi này đã phát sinh từ đâu, tôi sẽ mở vấn đề cho những người buộc tội niềm vui và nỗi đau.',
    items: [
      { image: 'https://salekit.page/assets/images/appexy/screen1.png', alt: 'Screen 1' },
      { image: 'https://salekit.page/assets/images/appexy/screen2.png', alt: 'Screen 2' },
      { image: 'https://salekit.page/assets/images/appexy/screen3.png', alt: 'Screen 3' },
      { image: 'https://salekit.page/assets/images/appexy/screen4.png', alt: 'Screen 4' },
      { image: 'https://salekit.page/assets/images/appexy/screen5.png', alt: 'Screen 5' },
    ],
  },
  testimonials: {
    label: 'OUR TESTIMONIAL',
    title: 'Khách hàng của chúng tôi nói gì',
    subtitle: 'Nhưng để bạn có thể thấy tất cả lỗi này đã phát sinh từ đâu, tôi sẽ mở vấn đề cho những người buộc tội niềm vui và nỗi đau.',
    items: [
      { quote: '"Và vì vậy, chúng tôi trong số họ được giữ bởi một lựa chọn khôn ngoan, đẩy lùi những kẻ khó khăn hơn."', name: 'Mayra Vasquez', role: 'Web Development, USA', avatar: 'https://salekit.page/assets/images/appexy/avatar1.png' },
      { quote: '"Và vì vậy, chúng tôi trong số họ được giữ bởi một lựa chọn khôn ngoan, đẩy lùi những kẻ khó khăn hơn."', name: 'David Nguyen', role: 'Mobile Developer, VN', avatar: 'https://salekit.page/assets/images/appexy/avatar2.png' },
      { quote: '"Và vì vậy, chúng tôi trong số họ được giữ bởi một lựa chọn khôn ngoan, đẩy lùi những kẻ khó khăn hơn."', name: 'Sarah Tran', role: 'UI/UX Designer, VN', avatar: 'https://salekit.page/assets/images/appexy/avatar3.png' },
    ],
  },
  pricing: {
    label: 'OUR PRICING',
    title: 'Bảng giá',
    subtitle: 'Nhưng để bạn có thể thấy tất cả lỗi này đã phát sinh từ đâu, tôi sẽ mở vấn đề cho những người buộc tội niềm vui và nỗi đau.',
    items: [
      {
        name: 'Miễn phí',
        price: '$0.00',
        period: '/ Tháng',
        features: ['3 Projects', '580GB Storage', 'Unlimited Contacts', '5 Domains', 'Free Support 24/7'],
        buttonText: 'Dùng thử',
        highlighted: false,
      },
      {
        name: 'Pro',
        price: '$29.99',
        period: '/ Tháng',
        features: ['10 Projects', '1.5TB Storage', 'Unlimited Contacts', '12 Domains', 'Free Support 24/7'],
        buttonText: 'Đăng ký',
        highlighted: true,
      },
      {
        name: 'Enterprise',
        price: '$59.99',
        period: '/ Tháng',
        features: ['20 Projects', '2.5TB Storage', 'Unlimited Contacts', '18 Domains', 'Free Support 24/7'],
        buttonText: 'Đăng ký',
        highlighted: false,
      },
    ],
  },
  faq: {
    label: 'OUR FAQS',
    title: 'Các câu hỏi thường gặp',
    subtitle: 'Nhưng để bạn có thể thấy tất cả lỗi này đã phát sinh từ đâu, tôi sẽ mở vấn đề cho những người buộc tội niềm vui và nỗi đau.',
    items: [
      {
        question: 'Thiết bị tại PETPRO đạt những tiêu chuẩn nào?',
        answer: 'Trang thiết bị tại PETPRO tập trung vào tiêu chí mới hiện đại, chính xác và chuyên dùng cho thú nhỏ.',
      },
      {
        question: 'Làm cách nào để tải Ứng dụng dành cho thiết bị di động cho điện thoại của tôi?',
        answer: 'Bạn có thể tải ứng dụng Appexy từ App Store (iOS) hoặc Google Play Store (Android). Tìm kiếm "Appexy" và nhấn "Tải xuống".',
      },
      {
        question: 'Appexy có gì đặc biệt?',
        answer: 'Appexy cung cấp giao diện trực quan, bộ sưu tập thiết kế khổng lồ và khả năng cài đặt bằng một cú nhấp chuột.',
      },
      {
        question: 'Appexy có giá bao nhiêu?',
        answer: 'Appexy có gói miễn phí $0.00/tháng và các gói trả phí bắt đầu từ $29.99/tháng với nhiều tính năng nâng cao.',
      },
    ],
    image: 'https://salekit.page/assets/images/appexy/faq.png',
  },
  contact: {
    title: 'Liên hệ với chúng tôi',
    subtitle: 'OUR CONTACT US',
    description: 'Bạn chỉ cần đăng ký, nhân viên SaleKit sẽ tư vấn trực tiếp và hỗ trợ online 24/7',
    formImage: 'https://salekit.page/assets/images/appexy/contact.png',
  },
  footer: {
    logo: 'https://salekit.page/assets/images/logo/logo.png',
    address: 'Địa chỉ: 247 Cầu Giấy, Hà Nội',
    phone: '089 898 6008',
    email: 'cskh@salemall.vn',
    links1: ['Giới thiệu', 'Blog', 'Kho giao diện', 'Phần mềm spa'],
    links2: ['Hướng dẫn', 'Nhóm hỗ trợ', 'Đại lý', 'Affiliate', 'Chatbot'],
    appStoreImage: 'https://salekit.page/assets/images/appexy/appstore.png',
    playStoreImage: 'https://salekit.page/assets/images/appexy/playstore.png',
    copyright: '© Salekit - Phần mềm quản lý bán hàng đa kênh - Điều khoản dịch vụ - Chính sách bảo mật',
  },
};