import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import perempuanDesaImage from '../../assets/perempuan-desa.webp';

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
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
        <div className="card-gradient hidden lg:flex flex-col justify-between">
          <div>
            <span className="inline-flex rounded-full border border-primary-200 bg-primary-50 text-primary-700 text-xs font-semibold px-3 py-1 mb-6">
              Pendaftaran Gratis
            </span>
            <h2 className="text-4xl font-extrabold text-slate-900 leading-tight mb-4">
              Bangun Masa Depan
              <br />
              Bersama Komunitas
            </h2>
            <p className="text-slate-600">
              Daftarkan akun Anda untuk mengakses modul terstruktur, kuis evaluasi, dan pencapaian berbasis progres belajar.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 mt-8">
            <p className="text-sm font-semibold text-slate-900 mb-2">Apa yang Anda dapatkan?</p>
            <ul className="text-sm text-slate-600 space-y-1.5">
              <li>• Materi relevan untuk perempuan desa</li>
              <li>• Tracking progres belajar yang jelas</li>
              <li>• Badge dan sertifikat digital</li>
            </ul>
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
              Daftar Akun Baru
            </h2>
            <p className="mt-3 text-slate-600 text-xs sm:text-sm md:text-base leading-relaxed">
              Mulai perjalanan belajar Anda hari ini.
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