import { Link } from 'react-router-dom';
import perempuanDesaImage from '../../assets/perempuan-desa.webp';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 px-4 sm:px-6 lg:px-8 pb-8">
      <div className="max-w-7xl mx-auto card !p-8 md:!p-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <img
                src={perempuanDesaImage}
                alt="Ilustrasi perempuan desa"
                className="w-10 h-10 rounded-full object-cover border border-slate-200"
              />
              <span className="text-xl font-extrabold bg-gradient-to-r from-teal-600 to-primary-700 bg-clip-text text-transparent">
                Perempuan Desa
              </span>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed">
              Platform pembelajaran digital untuk memberdayakan perempuan desa melalui pendidikan dan keterampilan.
            </p>
            <div className="flex space-x-4 mt-6">
              <a href="#" className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 hover:text-teal-700 transition-colors">
                <span className="text-2xl">📘</span>
              </a>
              <a href="#" className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 hover:text-teal-700 transition-colors">
                <span className="text-2xl">📷</span>
              </a>
              <a href="#" className="rounded-full border border-slate-200 bg-white p-2 text-slate-600 hover:text-teal-700 transition-colors">
                <span className="text-2xl">💬</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Tautan Cepat</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-slate-600 hover:text-teal-700 transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-slate-600 hover:text-teal-700 transition-colors">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-slate-600 hover:text-teal-700 transition-colors">
                  Profil
                </Link>
              </li>
              <li>
                <a href="#" className="text-slate-600 hover:text-teal-700 transition-colors">
                  Tentang Kami
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Sumber Daya</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-slate-600 hover:text-teal-700 transition-colors">
                  Panduan Belajar
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-600 hover:text-teal-700 transition-colors">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-600 hover:text-teal-700 transition-colors">
                  Hubungi Kami
                </a>
              </li>
              <li>
                <a href="#" className="text-slate-600 hover:text-teal-700 transition-colors">
                  Kebijakan Privasi
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Kontak</h3>
            <ul className="space-y-2 text-slate-600">
              <li className="flex items-center space-x-2">
                <span className="text-xl">📧</span>
                <span className="break-all">info@perempuandesa.id</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-xl">📱</span>
                <span className="break-words">+62 812 3456 7890</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="text-xl">📍</span>
                <span className="break-words">Semarang, Jawa Tengah</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-200 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-3">
            <p className="text-slate-600 text-sm text-center md:text-left">
              © {currentYear} Perempuan Desa. Semua hak dilindungi.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mt-1 md:mt-0">
              <a href="#" className="text-sm text-slate-600 hover:text-teal-700 transition-colors">
                Syarat & Ketentuan
              </a>
              <a href="#" className="text-sm text-slate-600 hover:text-teal-700 transition-colors">
                Privasi
              </a>
              <a href="#" className="text-sm text-slate-600 hover:text-teal-700 transition-colors">
                Cookie
              </a>
            </div>
          </div>
        </div>

        {/* Decorative Bar */}
        <div className="mt-8">
          <div className="h-1 bg-gradient-to-r from-teal-600 via-primary-600 to-coral-500 rounded-full"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;