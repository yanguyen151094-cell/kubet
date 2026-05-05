import { useState, useCallback } from 'react';

interface AdminLoginProps {
  onLogin: () => void;
}

const ADMIN_PASSWORD = 'Yamato@123';

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('admin_authenticated', 'true');
      onLogin();
    } else {
      setError(true);
    }
  }, [password, onLogin]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-sm p-8 md:p-10 w-full max-w-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto mb-4 flex items-center justify-center bg-emerald-100 rounded-full">
            <i className="ri-shield-keyhole-line text-xl text-emerald-600 w-6 h-6 flex items-center justify-center" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">Quản trị viên</h1>
          <p className="text-sm text-gray-500 mt-1">Vui lòng nhập mật khẩu để tiếp tục</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => { setPassword(e.target.value); setError(false); }}
              placeholder="Mật khẩu"
              className="w-full px-4 py-3 rounded-md border border-gray-200 text-sm focus:outline-none focus:border-emerald-500"
            />
            {error && (
              <p className="text-xs text-red-500 mt-1">Mật khẩu không chính xác</p>
            )}
          </div>
          <button
            type="submit"
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-md font-medium transition-colors whitespace-nowrap cursor-pointer"
          >
            Đăng nhập
          </button>
        </form>
        <a href="/" className="block text-center text-sm text-gray-500 hover:text-gray-900 mt-6 transition-colors">
          Quay lại trang chủ
        </a>
      </div>
    </div>
  );
}