import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import perempuanDesaImage from '../../assets/perempuan-desa.webp';

const Login = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email harus diisi';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Format email tidak valid';
    }

    if (!formData.password) {
      newErrors.password = 'Password harus diisi';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password minimal 6 karakter';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
    if (authError) {
      setAuthError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const authenticatedUser = await onLogin(formData.email, formData.password);
      setIsLoading(false);
      navigate(authenticatedUser?.isAdmin ? '/admin' : '/dashboard');
    } catch (error) {
      const code = error?.code || '';
      if (error?.message === 'ACCOUNT_DISABLED') {
        setAuthError('Akun Anda dinonaktifkan oleh admin. Silakan hubungi pengelola.');
      } else if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
        setAuthError('Email atau password tidak sesuai.');
      } else if (code.includes('too-many-requests')) {
        setAuthError('Terlalu banyak percobaan login. Coba lagi beberapa menit.');
      } else {
        setAuthError('Login gagal. Silakan coba lagi.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="card-gradient hidden lg:flex flex-col justify-between">
          <div>
            <span className="inline-flex rounded-full border border-teal-200 bg-teal-50 text-teal-700 text-xs font-semibold px-3 py-1 mb-6">
              Area Peserta
            </span>
            <h2 className="text-4xl font-extrabold text-slate-900 leading-tight mb-4">
              Selamat Datang
              <br />
              Kembali
            </h2>
            <p className="text-slate-600">
              Lanjutkan progres belajar Anda, ikuti kuis, dan capai sertifikat baru bersama Perempuan Desa.
            </p>
          </div>
          <div className="rounded-2xl bg-slate-900 p-5 mt-8">
            <p className="text-sm text-slate-300">"Belajar terarah membuat perubahan terasa nyata."</p>
          </div>
        </div>

        <div className="card p-6 md:p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <img
                src={perempuanDesaImage}
                alt="Ilustrasi perempuan desa"
                className="w-20 h-20 rounded-full object-cover border-2 border-slate-200"
              />
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug">
              Masuk ke Akun
            </h2>
            <p className="mt-3 text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
              Silakan masuk untuk melanjutkan pembelajaran.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className={`form-input ${errors.email ? '!border-red-500 focus:!shadow-[0_0_0_4px_rgba(239,68,68,0.15)]' : ''}`}
                placeholder="nama@email.com"
              />
              {errors.email && (
                <p className="mt-2 text-xs sm:text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`form-input ${errors.password ? '!border-red-500 focus:!shadow-[0_0_0_4px_rgba(239,68,68,0.15)]' : ''}`}
                placeholder="Masukkan password"
              />
              {errors.password && (
                <p className="mt-2 text-xs sm:text-sm text-red-500">{errors.password}</p>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pt-2">
            <div className="flex items-center gap-2">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-teal-600 focus:ring-teal-500 border-slate-300 rounded"
              />
              <label htmlFor="remember-me" className="text-xs sm:text-sm text-slate-700">
                Ingat saya
              </label>
            </div>

            <a href="#" className="text-xs sm:text-sm text-teal-700 hover:text-teal-800 font-medium self-start sm:self-auto">
              Lupa password?
            </a>
          </div>

          {authError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs sm:text-sm text-red-600">
              {authError}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full btn-primary flex items-center justify-center py-3 md:py-4 disabled:opacity-50 disabled:cursor-not-allowed text-base md:text-lg"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Memproses...
              </>
            ) : (
              'Masuk'
            )}
          </button>

          <div className="text-center pt-2">
            <p className="text-xs sm:text-sm text-slate-600">
              Belum punya akun?{' '}
              <Link to="/register" className="font-semibold text-teal-700 hover:text-teal-800 transition-colors">
                Daftar di sini
              </Link>
            </p>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;