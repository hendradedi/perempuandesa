import { Link } from 'react-router-dom';
import { CircleHelp, Mail, MapPin, Phone, Sparkles, Users } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-16 pb-10">
      <div className="site-container">
        <div className="rounded-3xl bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-600 p-[2px] shadow-2xl shadow-teal-500/20">
          <div className="rounded-[22px] bg-white px-10 md:px-16 lg:px-20 py-14 md:py-20">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-12">
              <div>
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center text-white shadow-md shadow-teal-300/40">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-xl font-bold text-slate-900">
                    Perempuan<span className="text-teal-600">Desa</span>
                  </span>
                </div>
                <p className="text-slate-600 text-sm leading-relaxed mb-5">
                  Platform pembelajaran digital untuk memberdayakan perempuan desa melalui pendidikan dan keterampilan yang relevan.
                </p>
                <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-4 py-2 text-xs font-medium text-teal-700">
                  <Sparkles className="w-3.5 h-3.5" />
                  Tumbuh bersama komunitas
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-5 uppercase tracking-wider">Navigasi</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link to="/" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">
                      Beranda
                    </Link>
                  </li>
                  <li>
                    <a href="#modul" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">
                      Modul Belajar
                    </a>
                  </li>
                  <li>
                    <a href="#testimoni" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">
                      Testimoni
                    </a>
                  </li>
                  <li>
                    <a href="#tentang" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">
                      Tentang Kami
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-5 uppercase tracking-wider">Bantuan</h3>
                <ul className="space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                      <CircleHelp className="w-3.5 h-3.5 text-teal-600" />
                    </span>
                    FAQ & Panduan Belajar
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                      <Mail className="w-3.5 h-3.5 text-teal-600" />
                    </span>
                    info@perempuandesa.id
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                      <Phone className="w-3.5 h-3.5 text-teal-600" />
                    </span>
                    +62 812 3456 7890
                  </li>
                  <li className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                      <MapPin className="w-3.5 h-3.5 text-teal-600" />
                    </span>
                    Semarang, Jawa Tengah
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="text-sm font-bold text-slate-900 mb-5 uppercase tracking-wider">Akun</h3>
                <ul className="space-y-3 text-sm">
                  <li>
                    <Link to="/login" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">
                      Masuk
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">
                      Daftar
                    </Link>
                  </li>
                  <li>
                    <Link to="/dashboard" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">
                      Dashboard
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className="text-slate-600 hover:text-teal-600 transition-colors font-medium">
                      Profil
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="border-t border-slate-200 mt-12 pt-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-sm text-slate-500 text-center md:text-left">
                © {currentYear} Perempuan Desa. Semua hak dilindungi.
              </p>
              <div className="flex items-center justify-center md:justify-end gap-6 text-sm">
                <a href="#" className="text-slate-500 hover:text-teal-600 transition-colors">Kebijakan Privasi</a>
                <a href="#" className="text-slate-500 hover:text-teal-600 transition-colors">Syarat Layanan</a>
                <a href="#" className="text-slate-500 hover:text-teal-600 transition-colors">Kontak</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;