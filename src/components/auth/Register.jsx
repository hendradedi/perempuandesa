import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import perempuanDesaImage from '../../assets/srikandi-desa.webp';

const Register = ({ onRegister }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [authError, setAuthError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nama harus diisi';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Nama minimal 3 karakter';
    }

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

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Konfirmasi password harus diisi';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok';
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
    // Clear error when user starts typing
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
      await onRegister({
        name: formData.name.trim(),
        email: formData.email,
        password: formData.password
      });
      setIsLoading(false);
      navigate('/dashboard');
    } catch (error) {
      const code = error?.code || '';
      if (code.includes('email-already-in-use')) {
        setAuthError('Email ini sudah terdaftar. Silakan gunakan email lain.');
      } else if (code.includes('weak-password')) {
        setAuthError('Password terlalu lemah. Gunakan kombinasi huruf dan angka.');
      } else if (code.includes('invalid-email')) {
        setAuthError('Format email tidak valid.');
      } else {
        setAuthError('Pendaftaran gagal. Silakan coba lagi.');
      }
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4.5rem)] bg-slate-100 px-4 sm:px-6 lg:px-8 py-8 md:py-12 flex items-center justify-center">
      <div className="w-full max-w-lg">
        <div className="card bg-white p-6 md:p-8 shadow-[0_18px_45px_rgba(15,23,42,0.12)] border-slate-200">
          <div className="text-center mb-7">
            <div className="flex justify-center mb-4">
              <div className="relative">
                <img
                  src={perempuanDesaImage}
                  alt="Ilustrasi perempuan desa"
                  className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
                />
                <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-teal-500 border-2 border-white">
                  <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"/>
                  </svg>
                </span>
              </div>
            </div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-snug">
              Daftar Akun Baru
            </h2>
            <p className="mt-2 text-slate-500 text-sm">
              Mulai perjalanan belajar Anda hari ini dengan pengalaman yang lebih terarah.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="form-label">
                Nama Lengkap
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className={`form-input ${errors.name ? '!border-red-500 focus:!shadow-[0_0_0_4px_rgba(239,68,68,0.15)]' : ''}`}
                placeholder="Masukkan nama lengkap"
              />
              {errors.name && (
                <p className="mt-2 text-xs sm:text-sm text-red-500">{errors.name}</p>
              )}
            </div>

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
                placeholder="Minimal 6 karakter"
              />
              {errors.password && (
                <p className="mt-2 text-xs sm:text-sm text-red-500">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="form-label">
                Konfirmasi Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`form-input ${errors.confirmPassword ? '!border-red-500 focus:!shadow-[0_0_0_4px_rgba(239,68,68,0.15)]' : ''}`}
                placeholder="Ulangi password"
              />
              {errors.confirmPassword && (
                <p className="mt-2 text-xs sm:text-sm text-red-500">{errors.confirmPassword}</p>
              )}
            </div>
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
                Mendaftar...
              </>
            ) : (
              'Daftar Sekarang'
            )}
          </button>

          <div className="text-center pt-2">
            <p className="text-xs sm:text-sm text-slate-600">
              Sudah punya akun?{' '}
              <Link to="/login" className="font-semibold text-teal-700 hover:text-teal-800 transition-colors">
                Masuk di sini
              </Link>
            </p>
          </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;