import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import perempuanDesaImage from '../../assets/perempuan-desa.webp';

const Navbar = ({ isAuthenticated, canAccessAdminPanel, onLogout, user }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/90 bg-white/90 backdrop-blur-xl">
      <div className="w-full max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 2xl:px-16">
        <div className="flex justify-between items-center h-16 md:h-20 gap-3">
          {/* Logo */}
          <Link to="/" className="flex min-w-0 items-center space-x-2 pr-2">
            <img
              src={perempuanDesaImage}
              alt="Ilustrasi perempuan desa"
              className="w-10 h-10 rounded-full object-cover border border-slate-200"
            />
            <span className="hidden sm:inline text-base md:text-xl font-extrabold tracking-tight bg-gradient-to-r from-teal-600 to-primary-700 bg-clip-text text-transparent truncate">
              Perempuan Desa
            </span>
            <span className="sm:hidden text-base font-extrabold tracking-tight text-slate-800">
              Desa
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6 shrink-0 ml-auto">
            {!isAuthenticated ? (
              <>
                <Link 
                  to="/" 
                  className="text-slate-600 hover:text-teal-700 font-medium transition-colors whitespace-nowrap"
                >
                  Beranda
                </Link>
                <Link 
                  to="/login" 
                  className="text-slate-600 hover:text-teal-700 font-medium transition-colors whitespace-nowrap"
                >
                  Masuk
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary text-sm"
                >
                  Daftar
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
          <div className="md:hidden">
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
                <Link 
                  to="/" 
                  className="text-slate-700 hover:text-teal-700 font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Beranda
                </Link>
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