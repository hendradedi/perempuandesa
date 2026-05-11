import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Crown, BookOpen, CheckCircle2, Award, TrendingUp, User, ShieldCheck, LogOut, ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { buildAllModules } from '../../utils/moduleHelpers';

const LESSON_KEY = 'lessonProgressByModule';
const getProgress = () => { try { return JSON.parse(localStorage.getItem(LESSON_KEY) || '{}'); } catch { return {}; } };

const MOD_STYLE = {
  primary: { bg: 'bg-rose-50', border: 'border-rose-200', accent: 'text-rose-900', light: 'bg-rose-100', bar: 'bg-rose-900' },
  coral:   { bg: 'bg-[#fdf4ec]', border: 'border-[#f0dcc8]', accent: 'text-[#975f42]', light: 'bg-[#fce7d0]', bar: 'bg-[#975f42]' },
  teal:    { bg: 'bg-teal-50', border: 'border-teal-200', accent: 'text-[#3f6b6c]', light: 'bg-[#cceeee]', bar: 'bg-[#3f6b6c]' },
  indigo:  { bg: 'bg-indigo-50', border: 'border-indigo-200', accent: 'text-indigo-900', light: 'bg-indigo-100', bar: 'bg-indigo-900' },
  rose:    { bg: 'bg-rose-50', border: 'border-rose-200', accent: 'text-rose-900', light: 'bg-rose-100', bar: 'bg-rose-900' },
  amber:   { bg: 'bg-amber-50', border: 'border-amber-200', accent: 'text-amber-900', light: 'bg-amber-100', bar: 'bg-amber-900' },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const [modules, setModules] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    buildAllModules().then(m => { setModules(m); setLoading(false); });
    setProgress(getProgress());
  }, []);

  const handleLogout = () => { logout(); navigate('/'); };

  const totalLessons     = modules.reduce((s, m) => s + m.lessons.length, 0);
  const completedLessons = modules.reduce((s, m) => s + (progress[m.routeId] || []).length, 0);
  const completedMods    = modules.filter(m => m.lessons.length > 0 && (progress[m.routeId] || []).length >= m.lessons.length).length;
  const pct              = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#faf9f8] text-[#1c1917] font-sans">

      {/* ── NAV ───────────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 w-full bg-white/95 border-b border-stone-200 backdrop-blur-md shadow-sm">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-8 flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 sm:gap-3 text-decoration-none group">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-rose-50 flex items-center justify-center text-rose-800 group-hover:bg-rose-100 transition-colors shrink-0">
              <Sparkles size={18} />
            </div>
            <div className="min-w-0">
              <div className="font-serif font-bold text-base sm:text-xl text-stone-900 leading-none">SELARAS</div>
              <p className="text-[8px] sm:text-[10px] text-stone-400 font-medium tracking-tight leading-tight mt-0.5 truncate hidden xs:block">
                Sistem Literasi Digital & Life Skill
              </p>
            </div>
          </Link>

          {/* Right: points + logout (Desktop) */}
          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden sm:flex items-center gap-6 mr-4">
              <span className="text-sm font-bold text-rose-800 border-b-2 border-rose-800 pb-1 cursor-default">Dashboard</span>
              <Link to="/profile" className="text-sm font-medium text-stone-500 hover:text-rose-800 transition-colors">Profil</Link>
            </div>
            
            <div className="flex items-center gap-2 sm:gap-3 bg-rose-50 border border-rose-100 rounded-full px-3 sm:px-4 py-1.5 sm:py-2">
              <Crown size={14} className="text-rose-800 shrink-0" />
              <span className="text-xs sm:text-sm font-bold text-rose-900 leading-none">{user?.points || 0} Poin</span>
            </div>
            
            <button onClick={handleLogout} className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-stone-500 hover:text-stone-900 transition-colors">
              <LogOut size={16} className="shrink-0" />
              <span className="hidden xs:inline">Keluar</span>
            </button>
          </div>
        </div>
      </nav>

      {/* ── MAIN ──────────────────────────────────────────────── */}
      <main className="max-w-[1280px] mx-auto px-4 sm:px-8 py-8 sm:py-12">

        {/* Greeting */}
        <div className="mb-8 sm:mb-10 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="inline-flex items-center gap-2 bg-stone-100 border border-stone-200 rounded-full px-3 sm:px-4 py-1 sm:py-1.5 text-[9px] sm:text-[11px] font-bold text-stone-500 uppercase tracking-widest mb-4">
            <Sparkles size={12} className="text-rose-700" /> Ruang Belajar Anda
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 leading-[1.1] mb-2 sm:mb-3 font-semibold">
            Selamat Datang,{' '}
            <span className="text-rose-800 italic">{user?.name || 'Peserta'}</span>
          </h1>
          <p className="text-stone-500 font-light text-sm sm:text-base lg:text-lg max-w-2xl">
            Mari lanjutkan perjalanan belajar Anda. Setiap langkah kecil adalah kemajuan berarti menuju masa depan yang lebih baik.
          </p>
        </div>

        {/* ── STATS ROW ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 sm:mb-10">
          {[
            { label: 'Total Poin',         value: user?.points || 0,          icon: <Crown size={22} className="text-rose-800" />,      bg: 'bg-rose-50' },
            { label: 'Modul Selesai',      value: `${completedMods}/${modules.length}`, icon: <BookOpen size={22} className="text-stone-600" />,   bg: 'bg-stone-50' },
            { label: 'Pelajaran Selesai',  value: `${completedLessons}/${totalLessons}`, icon: <CheckCircle2 size={22} className="text-rose-800" />, bg: 'bg-rose-50' },
            { label: 'Sertifikat',         value: user?.certificates?.length || 0, icon: <Award size={22} className="text-stone-600" />,      bg: 'bg-stone-50' },
          ].map((st, i) => (
            <div key={i} className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-widest text-stone-400">{st.label}</p>
                <div className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl ${st.bg} flex items-center justify-center`}>{st.icon}</div>
              </div>
              <p className="font-serif text-2xl sm:text-3xl text-stone-900 leading-none">{st.value}</p>
            </div>
          ))}
        </div>

        {/* ── TWO-COLUMN GRID ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8">
            {/* Overall Progress */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-100 shadow-sm overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-[0.03] pointer-events-none">
                <TrendingUp size={120} />
              </div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-rose-50 rounded-xl">
                    <TrendingUp size={20} className="text-rose-800" />
                  </div>
                  <h2 className="font-serif text-lg sm:text-xl text-stone-900 font-bold">Progress Keseluruhan</h2>
                </div>
                <span className="font-serif text-2xl sm:text-3xl text-rose-800 font-bold">{pct}%</span>
              </div>
              <div className="w-full h-3 bg-stone-100 rounded-full overflow-hidden mb-3">
                <div 
                  className="h-full bg-gradient-to-r from-rose-800 to-rose-600 rounded-full transition-all duration-1000 ease-out" 
                  style={{ width: `${pct}%` }}
                ></div>
              </div>
              <p className="text-[11px] sm:text-xs font-bold text-stone-400 uppercase tracking-widest">{completedLessons} dari {totalLessons} pelajaran selesai</p>
            </div>

            {/* Module List */}
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-100 shadow-sm">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="p-2 bg-stone-100 rounded-xl">
                  <BookOpen size={20} className="text-stone-700" />
                </div>
                <h2 className="font-serif text-lg sm:text-xl text-stone-900 font-bold">Modul Pembelajaran</h2>
              </div>

              {loading ? (
                <div className="space-y-4">
                  {[1,2,3].map(i => <div key={i} className="h-24 bg-stone-50 rounded-2xl animate-pulse"></div>)}
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {modules.map((mod) => {
                    const done  = (progress[mod.routeId] || []).length;
                    const total = mod.lessons.length;
                    const pctMod = total > 0 ? Math.round((done / total) * 100) : 0;
                    const c     = MOD_STYLE[mod.color] || MOD_STYLE.primary;
                    const isDone = done >= total && total > 0;

                    return (
                      <Link key={mod.routeId} to={`/module/${mod.routeId}`} className="block group">
                        <div className={`flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 p-5 sm:p-6 rounded-2xl sm:rounded-3xl border transition-all duration-300 ${c.bg} ${c.border} hover:shadow-xl hover:shadow-stone-200/50 hover:-translate-y-1 relative overflow-hidden`}>
                          
                          {/* Icon Container */}
                          <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center text-2xl sm:text-3xl shadow-sm shrink-0 z-10">
                            {mod.icon}
                          </div>

                          {/* Info Container */}
                          <div className="flex-1 min-w-0 w-full z-10">
                            <div className="flex items-center flex-wrap gap-2 mb-1">
                              <h3 className="text-sm sm:text-base font-bold text-stone-900 truncate max-w-[200px] sm:max-w-none">{mod.title}</h3>
                              {isDone && (
                                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[9px] font-bold border border-emerald-200 shrink-0">
                                  <CheckCircle2 size={10} /> SELESAI
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-stone-500 mb-4 line-clamp-1 sm:line-clamp-2">{mod.description}</p>

                            {/* Progress bar container */}
                            <div className="flex items-center gap-3">
                              <div className="flex-1 h-2 bg-white/60 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full transition-all duration-700 ${c.bar}`} 
                                  style={{ width: `${pctMod}%` }}
                                ></div>
                              </div>
                              <span className={`text-[10px] sm:text-xs font-bold ${c.accent} shrink-0`}>{done}/{total}</span>
                            </div>
                          </div>

                          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:block opacity-30 group-hover:opacity-100 group-hover:translate-x-1 transition-all">
                            <ChevronRight size={20} className="text-stone-400" />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN – SIDEBAR */}
          <aside className="lg:col-span-4 space-y-6 sm:space-y-8">
            <div className="bg-white rounded-[2rem] p-6 sm:p-8 border border-stone-100 shadow-sm lg:sticky lg:top-28">
              <div className="flex items-center gap-3 mb-6 sm:mb-8">
                <div className="p-2 bg-stone-100 rounded-xl">
                  <ShieldCheck size={18} className="text-stone-700" />
                </div>
                <h2 className="font-serif text-lg text-stone-900 font-bold">Akses Cepat</h2>
              </div>

              {/* Quick links */}
              <div className="space-y-3 mb-8">
                {[
                  { to: '/profile', icon: <User size={18} />, label: 'Profil Saya',  sub: 'Kelola preferensi akun' },
                  { to: '/profile', icon: <Award size={18} />, label: 'Pencapaian',  sub: 'Sertifikat & lencana' },
                ].map((item, i) => (
                  <Link key={i} to={item.to} className="block group">
                    <div className="flex items-center justify-between p-4 rounded-2xl border border-stone-50 bg-white hover:bg-rose-50 hover:border-rose-100 transition-all duration-300">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-stone-100 flex items-center justify-center text-stone-500 group-hover:bg-white group-hover:text-rose-800 transition-colors shrink-0">
                          {item.icon}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-stone-900 leading-tight truncate">{item.label}</p>
                          <p className="text-[10px] text-stone-400 truncate">{item.sub}</p>
                        </div>
                      </div>
                      <ChevronRight size={14} className="text-stone-300 group-hover:text-rose-800 transition-colors shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>

              {/* Module quick list */}
              <div className="border-t border-stone-100 pt-6">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">Modul Tersedia</p>
                <div className="space-y-1">
                  {modules.map(mod => {
                    const done  = (progress[mod.routeId] || []).length;
                    const total = mod.lessons.length;
                    const c     = MOD_STYLE[mod.color] || MOD_STYLE.primary;
                    return (
                      <Link key={mod.routeId} to={`/module/${mod.routeId}`} className="block group px-2 py-2.5 rounded-xl hover:bg-stone-50 transition-colors">
                        <div className="flex items-center gap-3">
                          <span className="text-xl shrink-0 group-hover:scale-110 transition-transform">{mod.icon}</span>
                          <span className="text-xs font-medium text-stone-600 flex-1 truncate group-hover:text-stone-900 transition-colors">{mod.title}</span>
                          <span className={`text-[10px] font-bold ${c.accent} shrink-0`}>{done}/{total}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Motivational banner */}
              <div className="mt-8 rounded-2xl bg-gradient-to-br from-rose-900 to-rose-700 p-6 text-center shadow-lg shadow-rose-200/50 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 rotate-12">
                  <Sparkles size={60} />
                </div>
                <div className="text-3xl mb-3">🌸</div>
                <p className="text-xs sm:text-sm text-rose-50 leading-relaxed font-light italic">
                  "Setiap langkah kecil yang Anda ambil hari ini adalah investasi untuk masa depan yang lebih cerah."
                </p>
              </div>
            </div>
          </aside>

        </div>
      </main>
    </div>
  );
}
