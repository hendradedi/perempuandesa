import { Link } from 'react-router-dom';
import { Mail, MapPin, Sparkles } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-0 pb-0 bg-stone-900 pt-20 border-t border-stone-800">
      <div className="container-page">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8 pb-20 border-b border-stone-800">
          
          {/* Brand Column */}
          <div className="lg:col-span-5 pr-0 lg:pr-12">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-rose-900 flex items-center justify-center text-rose-300" style={{opacity:0.7}}>
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <span className="font-serif font-bold text-2xl tracking-tight text-white">SELARAS</span>
              </div>
            </div>
            <p className="text-rose-300 text-xs font-medium mb-3 tracking-wide">
              Sistem Literasi digitAl dan Life skill Responsif gender untuk perempuan deSa
            </p>
            <p className="text-stone-400 text-sm leading-relaxed mb-6 font-light max-w-sm">
              Platform sekolah perempuan desa berbasis digital yang mendukung literasi digital, keterampilan hidup, kemandirian ekonomi, dan penguatan kapasitas sosial perempuan secara inklusif, adaptif, dan berkelanjutan.
            </p>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-stone-700 bg-stone-800">
              <span className="text-xs text-stone-400 font-light">Responsif Gender • Inklusif • Berkelanjutan</span>
            </div>
          </div>

          {/* Navigasi */}
          <div className="lg:col-span-2">
            <h3 className="font-serif text-lg text-white mb-6">Eksplorasi</h3>
            <ul className="space-y-4">
              <li><Link to="/" className="text-stone-400 hover:text-rose-300 transition-colors font-light text-sm">Beranda</Link></li>
              <li><a href="#modul" className="text-stone-400 hover:text-rose-300 transition-colors font-light text-sm">Koleksi Modul</a></li>
              <li><a href="#testimoni" className="text-stone-400 hover:text-rose-300 transition-colors font-light text-sm">Kisah Sukses</a></li>
              <li><a href="#tentang" className="text-stone-400 hover:text-rose-300 transition-colors font-light text-sm">Tentang SELARAS</a></li>
            </ul>
          </div>

          {/* Akun */}
          <div className="lg:col-span-2">
            <h3 className="font-serif text-lg text-white mb-6">Akses</h3>
            <ul className="space-y-4">
              <li><Link to="/login" className="text-stone-400 hover:text-rose-300 transition-colors font-light text-sm">Masuk</Link></li>
              <li><Link to="/register" className="text-stone-400 hover:text-rose-300 transition-colors font-light text-sm">Daftar Sekarang</Link></li>
              <li><Link to="/dashboard" className="text-stone-400 hover:text-rose-300 transition-colors font-light text-sm">Ruang Belajar</Link></li>
              <li><Link to="/profile" className="text-stone-400 hover:text-rose-300 transition-colors font-light text-sm">Profil Saya</Link></li>
            </ul>
          </div>

          {/* Kontak */}
          <div className="lg:col-span-3">
            <h3 className="font-serif text-lg text-white mb-6">Dikembangkan Oleh</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-1" />
                <span className="text-stone-400 font-light text-sm leading-relaxed">
                  Dr. Mintarsih Arbarini, M.Pd, dkk<br />
                  FIPP UNNES<br />
                  Semarang, Jawa Tengah
                </span>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-rose-400 shrink-0 mt-1" />
                <span className="text-stone-400 font-light text-sm">Lab PNF FIPP UNNES</span>
              </li>
            </ul>
            <div className="mt-6 p-3 rounded-xl bg-stone-800 border border-stone-700">
              <p className="text-xs text-stone-400 italic leading-relaxed">
                "Dibuat dan dikembangkan oleh Dr. Mintarsih Arbarini, M.Pd, dkk" ❤️
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Footer */}
        <div className="py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-stone-500 font-light text-center md:text-left">
            © {currentYear} SELARAS – Sistem Literasi Digital & Life Skill Responsif Gender untuk Perempuan Desa
          </p>
          <div className="flex items-center gap-6 text-sm font-light">
            <a href="#" className="text-stone-500 hover:text-stone-300 transition-colors">Privasi</a>
            <a href="#" className="text-stone-500 hover:text-stone-300 transition-colors">Syarat & Ketentuan</a>
            <a href="#" className="text-stone-500 hover:text-stone-300 transition-colors">Bantuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;