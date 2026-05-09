import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Sparkles, Crown } from 'lucide-react';

const NAVIGATION = [
  { name: 'Beranda', href: '/' },
  { name: 'Modul', href: '/#modul' },
  { name: 'Testimoni', href: '/#testimoni' },
  { name: 'Tentang', href: '/#tentang' }
];

const Navbar = ({ isAuthenticated, canAccessAdminPanel, onLogout, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 border-b border-stone-200/50" style={{backdropFilter:'blur(20px)', boxShadow:'0 2px 10px rgba(28,25,23,0.04)'}}>
      <div className="container-page">
        <div className="flex justify-between items-center h-20 gap-3">
          
          {/* Logo SELARAS */}
          <Link to="/" className="flex items-center gap-3 pr-2 group shrink-0">
            <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-600 group-hover:bg-rose-100 transition-colors">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="leading-none">
              <span className="font-serif font-bold text-xl tracking-tight text-stone-900">SELARAS</span>
              <p className="text-[9px] text-stone-400 font-medium tracking-wide hidden sm:block" style={{lineHeight:1.4}}>
                Sistem Literasi Digital & Life Skill
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-10">
            {NAVIGATION.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-stone-600 hover:text-rose-700 transition-colors relative after:absolute after:-bottom-1 after:left-0 after:w-0 after:h-[2px] after:bg-rose-700 hover:after:w-full after:transition-all after:duration-300"
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-5 shrink-0 ml-auto lg:ml-0">
            {!isAuthenticated ? (
              <>
                <Link to="/login" className="text-sm font-semibold text-stone-600 hover:text-rose-700 transition-colors">
                  Masuk
                </Link>
                <Link to="/register" className="bg-rose-700 hover:bg-rose-800 text-white text-sm font-medium px-7 py-3 rounded-full transition-all hover:shadow-lg hover:-translate-y-0.5">
                  Daftar Sekarang
                </Link>
              </>
            ) : (
              <>
                <Link to="/dashboard" className="text-sm font-medium text-stone-600 hover:text-rose-700 transition-colors">
                  Dashboard
                </Link>
                <Link to="/profile" className="text-sm font-medium text-stone-600 hover:text-rose-700 transition-colors">
                  Profil
                </Link>
                {canAccessAdminPanel && (
                  <Link to="/admin" className="text-sm font-medium text-stone-600 hover:text-rose-700 transition-colors">
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-4 border-l border-stone-200 pl-4 ml-2">
                  <div className="flex items-center gap-2 rounded-full border border-rose-100 bg-rose-50 px-4 py-2">
                    <Crown className="w-4 h-4 text-rose-500" />
                    <span className="text-sm font-bold text-rose-700">{user?.points || 0} Poin</span>
                  </div>
                  <button onClick={handleLogout} className="text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">
                    Keluar
                  </button>
                </div>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden ml-auto">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-label="Buka menu"
              className="rounded-full bg-stone-50 p-2.5 text-stone-700 hover:text-rose-700 hover:bg-rose-50 transition-colors focus:outline-none"
            >
              <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-6 border-t border-stone-100">
            {!isAuthenticated ? (
              <div className="flex flex-col space-y-4 px-4">
                {NAVIGATION.map((item) => (
                  <a key={item.name} href={item.href} className="text-stone-700 font-medium hover:text-rose-700" onClick={() => setIsMenuOpen(false)}>
                    {item.name}
                  </a>
                ))}
                <div className="h-px w-full bg-stone-100 my-2"></div>
                <Link to="/login" className="text-stone-700 font-medium hover:text-rose-700" onClick={() => setIsMenuOpen(false)}>Masuk</Link>
                <Link to="/register" className="bg-rose-700 text-white text-center py-3 rounded-full font-medium mt-2" onClick={() => setIsMenuOpen(false)}>Daftar Sekarang</Link>
              </div>
            ) : (
              <div className="flex flex-col space-y-4 px-4">
                <Link to="/dashboard" className="text-stone-700 font-medium hover:text-rose-700" onClick={() => setIsMenuOpen(false)}>Dashboard</Link>
                <Link to="/profile" className="text-stone-700 font-medium hover:text-rose-700" onClick={() => setIsMenuOpen(false)}>Profil</Link>
                {canAccessAdminPanel && (
                  <Link to="/admin" className="text-stone-700 font-medium hover:text-rose-700" onClick={() => setIsMenuOpen(false)}>Admin</Link>
                )}
                <div className="h-px w-full bg-stone-100 my-2"></div>
                <div className="flex items-center gap-3 py-3 rounded-2xl bg-rose-50 px-4">
                  <Crown className="w-5 h-5 text-rose-500" />
                  <span className="font-bold text-rose-700">{user?.points || 0} Poin</span>
                </div>
                <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-stone-500 font-medium hover:text-stone-900 text-left mt-2">
                  Keluar dari Akun
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;