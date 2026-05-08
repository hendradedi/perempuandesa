import { Link } from 'react-router-dom';
import { CircleHelp, Mail, MapPin, Phone, Sparkles, Users } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 pb-8">
      <div className="site-container">
        <div className="rounded-3xl bg-slate-950 border border-slate-800 px-6 md:px-10 py-10 md:py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-slate-900">
                  <Users className="w-5 h-5" />
                </div>
                <span className="text-xl font-bold text-white">
                  Perempuan<span className="text-teal-400">Desa</span>
                </span>
              </div>
              <p className="text-slate-300 text-sm leading-relaxed">
                Platform pembelajaran digital untuk memberdayakan perempuan desa melalui pendidikan dan keterampilan yang relevan.
              </p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-700 bg-slate-900 px-3 py-1.5 text-xs text-teal-300">
                <Sparkles className="w-3.5 h-3.5" />
                Tumbuh bersama komunitas
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Navigasi</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/" className="text-slate-300 hover:text-teal-300 transition-colors">
                    Beranda
                  </Link>
                </li>
                <li>
                  <a href="#modul" className="text-slate-300 hover:text-teal-300 transition-colors">
                    Modul Belajar
                  </a>
                </li>
                <li>
                  <a href="#testimoni" className="text-slate-300 hover:text-teal-300 transition-colors">
                    Testimoni
                  </a>
                </li>
                <li>
                  <a href="#tentang" className="text-slate-300 hover:text-teal-300 transition-colors">
                    Tentang Kami
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Bantuan</h3>
              <ul className="space-y-3 text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <CircleHelp className="w-4 h-4 text-teal-300" />
                  FAQ & Panduan Belajar
                </li>
                <li className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-teal-300" />
                  info@perempuandesa.id
                </li>
                <li className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-teal-300" />
                  +62 812 3456 7890
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-teal-300" />
                  Semarang, Jawa Tengah
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Akun</h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link to="/login" className="text-slate-300 hover:text-teal-300 transition-colors">
                    Masuk
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="text-slate-300 hover:text-teal-300 transition-colors">
                    Daftar
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="text-slate-300 hover:text-teal-300 transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/profile" className="text-slate-300 hover:text-teal-300 transition-colors">
                    Profil
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-slate-800 mt-10 pt-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-slate-400 text-center md:text-left">
              © {currentYear} Perempuan Desa. Semua hak dilindungi.
            </p>
            <div className="flex items-center justify-center md:justify-end gap-5 text-sm">
              <a href="#" className="text-slate-400 hover:text-teal-300 transition-colors">Kebijakan Privasi</a>
              <a href="#" className="text-slate-400 hover:text-teal-300 transition-colors">Syarat Layanan</a>
              <a href="#" className="text-slate-400 hover:text-teal-300 transition-colors">Kontak</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;