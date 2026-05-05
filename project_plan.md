# Salekit Landing Page

## 1. Project Description
Landing page giới thiệu ứng dụng Appexy, cho phép khách hàng xem thông tin sản phẩm, bảng giá, tính năng và liên hệ. Admin có thể chỉnh sửa toàn bộ nội dung trang web trực tiếp qua panel riêng biệt.

## 2. Page Structure
- `/` - Trang chủ (Landing Page)
- `/admin` - Trang đăng nhập Admin
- `/admin/dashboard` - Dashboard chỉnh sửa nội dung website

## 3. Core Features
- [x] Trang chủ với đầy đủ các section: Hero, How It Works, Features, Stats, Screenshots, Testimonials, Pricing, FAQ, Contact, Footer
- [x] Admin Panel riêng biệt tại `/admin`
- [x] Đăng nhập Admin bằng mật khẩu (Yamato@123)
- [x] Chỉnh sửa Logo, Hình ảnh, Text trên toàn bộ trang web
- [x] Lưu cấu hình vào localStorage
- [x] Preview thay đổi realtime

## 4. Data Model Design
Không cần database - dùng localStorage để lưu cấu hình site.

## 5. Backend / Third-party Integration Plan
- Không cần Supabase, Shopify, Stripe cho phase này
- Dùng localStorage để lưu trữ cấu hình site

## 6. Development Phase Plan

### Phase 1: Trang chủ Landing Page
- Goal: Xây dựng toàn bộ giao diện trang chủ với mock data
- Deliverable: Trang chủ có đầy đủ các section

### Phase 2: Admin Panel + Tích hợp chỉnh sửa
- Goal: Xây dựng trang Admin với đăng nhập và chức năng chỉnh sửa toàn bộ nội dung
- Deliverable: Admin có thể chỉnh sửa logo, hình ảnh, text và lưu vào localStorage