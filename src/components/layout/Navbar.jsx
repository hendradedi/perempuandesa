import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Users } from 'lucide-react';

const NAVIGATION = [
  { name: 'Beranda', href: '/' },
  { name: 'Modul', href: '/#modul' },
  { name: 'Testimoni', href: '/#testimoni' },
  { name: 'Tentang Kami', href: '/#tentang' }
];

const Navbar = ({ isAuthenticated, canAccessAdminPanel, onLogout, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-slate-200/60">
      <div className="site-container">
        <div className="flex justify-between items-center h-16 md:h-20 gap-3">
          {/* Logo */}
          <Link to="/" className="flex min-w-0 items-center gap-3 pr-2">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-600 to-emerald-400 flex items-center justify-center text-white shadow-lg shadow-teal-500/20">
              <Users className="w-5 h-5" />
            </div>
            <span className="font-bold text-lg md:text-xl tracking-tight text-slate-800 truncate">
              Perempuan<span className="text-teal-600">Desa</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {NAVIGATION.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-sm font-medium text-slate-600 hover:text-teal-600 transition-colors"
              >
                {item.name}
              </a>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-4 shrink-0 ml-auto lg:ml-0">
            {!isAuthenticated ? (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-slate-600 hover:text-teal-600 transition-colors"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold px-6 py-2.5 rounded-full shadow-md shadow-teal-600/20 transition-all hover:shadow-lg hover:-translate-y-0.5"
                >
                  Daftar Gratis
                </Link>
              </>
            ) : (
              <>
                <Link 
                  to="/dashboard" 
                  className="text-slate-600 hover:text-teal-700 font-medium transition-colors whitespace-nowrap"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  className="text-slate-600 hover:text-teal-700 font-medium transition-colors whitespace-nowrap"
                >
                  Profil
                </Link>
                {canAccessAdminPanel && (
                  <Link
                    to="/admin"
                    className="text-slate-600 hover:text-teal-700 font-medium transition-colors whitespace-nowrap"
                  >
                    Admin
                  </Link>
                )}
                <div className="flex items-center gap-3">
                  <div className="flex items-center space-x-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5">
                    <span className="text-lg">👑</span>
                    <span className="text-sm font-semibold text-amber-700">{user?.points || 0} Poin</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn-outline text-sm"
                  >
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
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-700 hover:text-teal-700 focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          <div className="md:hidden py-4 border-t border-slate-200 fade-in">
            {!isAuthenticated ? (
              <div className="card !p-4 flex flex-col space-y-3">
                <a
                  href="/"
                  className="text-slate-700 hover:text-teal-700 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Beranda
                </a>
                <a
                  href="/#modul"
                  className="text-slate-700 hover:text-teal-700 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Modul
                </a>
                <a
                  href="/#testimoni"
                  className="text-slate-700 hover:text-teal-700 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Testimoni
                </a>
                <Link 
                  to="/login" 
                  className="text-slate-700 hover:text-teal-700 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Masuk
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary text-center"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Daftar
                </Link>
              </div>
            ) : (
              <div className="card !p-4 flex flex-col space-y-3">
                <Link 
                  to="/dashboard" 
                  className="text-slate-700 hover:text-teal-700 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link 
                  to="/profile" 
                  className="text-slate-700 hover:text-teal-700 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Profil
                </Link>
                {canAccessAdminPanel && (
                  <Link
                    to="/admin"
                    className="text-slate-700 hover:text-teal-700 font-medium transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Admin
                  </Link>
                )}
                <div className="flex items-center space-x-2 py-2 rounded-lg border border-amber-200 bg-amber-50 px-3">
                  <span className="text-xl">👑</span>
                  <span className="text-sm font-semibold text-amber-700 break-words">{user?.points || 0} Poin</span>
                </div>
                <button 
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="btn-outline text-center"
                >
                  Keluar
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