import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Crown, BookOpen, CheckCircle2, Award, TrendingUp, User, ShieldCheck, LogOut, ChevronRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import { buildAllModules } from '../../utils/moduleHelpers';

const LESSON_KEY = 'lessonProgressByModule';
const getProgress = () => { try { return JSON.parse(localStorage.getItem(LESSON_KEY) || '{}'); } catch { return {}; } };

const MOD_STYLE = {
  primary: { bg: '#fff1f2', border: '#fecdd3', accent: '#9f1239', light: '#ffe4e6' },
  coral:   { bg: '#fdf4ec', border: '#f0dcc8', accent: '#975f42', light: '#fce7d0' },
  teal:    { bg: '#f0faf9', border: '#bdd8d8', accent: '#3f6b6c', light: '#cceeee' },
  indigo:  { bg: '#eef2ff', border: '#c7d2fe', accent: '#4338ca', light: '#e0e7ff' },
  rose:    { bg: '#fff1f2', border: '#fecdd3', accent: '#be123c', light: '#ffe4e6' },
  amber:   { bg: '#fffbeb', border: '#fde68a', accent: '#b45309', light: '#fef3c7' },
};

const s = {
  page:    { minHeight: '100vh', background: '#fdfbf9', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1c1917' },
  nav:     { position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.8)', borderBottom: '1px solid rgba(231,229,228,0.5)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' },
  navInner:{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '80px' },
  logo:    { display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' },
  logoIcon:{ width: '42px', height: '42px', borderRadius: '14px', background: 'linear-gradient(135deg, #fff1f2 0%, #ffe4e6 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9f1239', boxShadow: '0 4px 12px rgba(159,18,57,0.08)' },
  main:    { maxWidth: '1280px', margin: '0 auto' },
  card:    { background: '#fff', borderRadius: '32px', padding: '2.5rem', border: '1px solid #f5f5f4', boxShadow: '0 4px 20px rgba(28,25,23,0.03)', marginBottom: '2rem' },
  statCard:{ background: '#fff', borderRadius: '28px', padding: '1.75rem', border: '1px solid #f5f5f4', boxShadow: '0 4px 12px rgba(28,25,23,0.02)', transition: 'all 0.3s ease' },
  sideCard:{ background: '#fff', borderRadius: '32px', padding: '2rem', border: '1px solid #f5f5f4', boxShadow: '0 4px 20px rgba(28,25,23,0.03)', position: 'sticky', top: '100px' },
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
    <div style={s.page}>

      {/* ── NAV ───────────────────────────────────────────────── */}
      <nav style={s.nav}>
        <div style={s.navInner} className="px-4 md:px-8">
          {/* Logo */}
          <Link to="/" style={s.logo}>
            <div style={s.logoIcon}><Sparkles size={18} /></div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: '1.15rem', color: '#1c1917', lineHeight: 1.1 }}>SELARAS</div>
              <div style={{ fontSize: '10px', color: '#a8a29e', letterSpacing: '0.05em', lineHeight: 1.3 }}>Sistem Literasi Digital & Life Skill</div>
            </div>
          </Link>

          {/* Nav links */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#9f1239', borderBottom: '2px solid #9f1239', paddingBottom: '2px' }}>Dashboard</span>
            <Link to="/profile" style={{ fontSize: '0.875rem', color: '#78716c', textDecoration: 'none' }}>Profil</Link>
          </div>

          {/* Right: points + logout */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '999px', padding: '6px 14px' }}>
              <Crown size={14} color="#9f1239" />
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#9f1239' }}>{user?.points || 0} Poin</span>
            </div>
            <button onClick={handleLogout} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#78716c', background: 'none', border: 'none', cursor: 'pointer' }}>
              <LogOut size={15} />Keluar
            </button>
          </div>
        </div>
      </nav>

      {/* ── MAIN ──────────────────────────────────────────────── */}
      <main style={s.main} className="pt-10 md:pt-16 pb-24 px-4 md:px-8">

        {/* Greeting Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#fff', border: '1px solid #e7e5e4', borderRadius: '12px', padding: '6px 16px', fontSize: '11px', fontWeight: 700, color: '#9f1239', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '1.25rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div className="w-2 h-2 rounded-full bg-[#9f1239] animate-pulse"></div>
              Ruang Belajar Mandiri
            </div>
            <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', color: '#1c1917', lineHeight: 1.1, marginBottom: '0.75rem', fontWeight: 600 }}>
              Halo, <span style={{ color: '#9f1239', fontStyle: 'italic' }}>{user?.name || 'Peserta'}</span>
            </h1>
            <p style={{ color: '#78716c', fontWeight: 400, fontSize: '1.1rem', maxWidth: '600px', lineHeight: 1.6 }}>
              Selamat datang kembali di <strong style={{color: '#1c1917'}}>SELARAS</strong>. Terus asah potensi Anda dan jadilah perempuan yang mandiri dan berdaya.
            </p>
          </div>
          <div className="hidden lg:block">
            <div style={{ padding: '1.5rem 2rem', background: '#fff', border: '1px solid #f5f5f4', borderRadius: '24px', boxShadow: '0 4px 12px rgba(0,0,0,0.02)' }}>
               <p style={{ fontSize: '11px', fontWeight: 700, color: '#a8a29e', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '8px' }}>Motto Hari Ini</p>
               <p style={{ fontStyle: 'italic', color: '#1c1917', fontSize: '0.95rem', maxWidth: '240px', lineHeight: 1.5 }}>
                 "Kecantikan terbaik adalah kemandirian pikiran dan hati."
               </p>
            </div>
          </div>
        </div>

        {/* ── STATS ROW ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            { label: 'Total Poin',         value: user?.points || 0,          icon: <Crown size={22} />,      color: '#9f1239', bg: '#fff1f2' },
            { label: 'Modul Selesai',      value: `${completedMods}/${modules.length}`, icon: <BookOpen size={22} />,   color: '#134e4a', bg: '#f0faf9' },
            { label: 'Pelajaran Selesai',  value: `${completedLessons}/${totalLessons}`, icon: <CheckCircle2 size={22} />, color: '#4338ca', bg: '#eef2ff' },
            { label: 'Sertifikat',         value: user?.certificates?.length || 0, icon: <Award size={22} />,      color: '#b45309', bg: '#fffbeb' },
          ].map((st, i) => (
            <div key={i} style={s.statCard} className="hover:shadow-lg hover:-translate-y-1">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: st.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: st.color }}>{st.icon}</div>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: st.color, opacity: 0.2 }}></div>
              </div>
              <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em', color: '#a8a29e', marginBottom: '6px' }}>{st.label}</p>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.5rem', color: '#1c1917', lineHeight: 1, fontWeight: 600 }}>{st.value}</p>
            </div>
          ))}
        </div>

        {/* ── TWO-COLUMN GRID ───────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-8 items-start">

          {/* LEFT COLUMN */}
          <div>
            {/* Overall Progress */}
            <div style={s.card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <TrendingUp size={18} color="#9f1239" />
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#1c1917', fontWeight: 600 }}>Progress Keseluruhan</h2>
                </div>
                <span style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#9f1239', fontWeight: 600 }}>{pct}%</span>
              </div>
              <div style={{ width: '100%', height: '10px', background: '#f5f5f4', borderRadius: '999px', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${pct}%`, background: 'linear-gradient(90deg, #9f1239, #be123c)', borderRadius: '999px', transition: 'width 1s ease' }}></div>
              </div>
              <p style={{ fontSize: '12px', color: '#a8a29e', marginTop: '0.5rem' }}>{completedLessons} dari {totalLessons} pelajaran selesai</p>
            </div>

            {/* Module List */}
            <div style={s.card}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#f5f5f4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={20} color="#1c1917" />
                  </div>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', color: '#1c1917', fontWeight: 600 }}>Modul Pembelajaran</h2>
                </div>
                <div style={{ fontSize: '12px', color: '#a8a29e', fontWeight: 600 }}>{modules.length} Tersedia</div>
              </div>

              {loading ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {[1,2,3].map(i => <div key={i} style={{ height: '88px', background: '#f5f5f4', borderRadius: '16px', animation: 'pulse 1.5s infinite' }}></div>)}
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {modules.map((mod) => {
                    const done  = (progress[mod.routeId] || []).length;
                    const total = mod.lessons.length;
                    const pctMod = total > 0 ? Math.round((done / total) * 100) : 0;
                    const c     = MOD_STYLE[mod.color] || MOD_STYLE.primary;
                    const done_ = done >= total && total > 0;

                    return (
                      <Link key={mod.routeId} to={`/module/${mod.routeId}`} style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem 1.5rem', borderRadius: '24px', border: `1px solid ${c.border}`, background: '#fff', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', cursor: 'pointer', position: 'relative', overflow: 'hidden' }}
                          className="group hover:border-[#9f1239]/20 hover:shadow-xl hover:shadow-[#9f1239]/5">
                          
                          {/* Accent line */}
                          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: '4px', background: c.accent, opacity: 0.8 }}></div>

                          {/* Icon container */}
                          <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: c.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0, transition: 'transform 0.3s' }} className="group-hover:scale-110">
                            {mod.icon}
                          </div>
 
                          {/* Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#1c1917', transition: 'color 0.3s' }} className="group-hover:text-[#9f1239]">{mod.title}</h3>
                              {done_ && <div style={{ flexShrink: 0, background: '#d1fae5', color: '#065f46', borderRadius: '8px', padding: '2px 10px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>✓ Selesai</div>}
                            </div>
                            <p style={{ fontSize: '13px', color: '#78716c', marginBottom: '1rem', lineHeight: 1.5 }}>{mod.description}</p>
 
                            {/* Progress bar container */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ flex: 1, height: '6px', background: '#f5f5f4', borderRadius: '999px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${pctMod}%`, background: `linear-gradient(90deg, ${c.accent}, ${c.accent}dd)`, borderRadius: '999px', transition: 'width 1s ease' }}></div>
                              </div>
                              <span style={{ fontSize: '11px', fontWeight: 800, color: c.accent, fontFamily: 'monospace' }}>{pctMod}%</span>
                            </div>
                          </div>
 
                          <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#fdfbf9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d6d3d1', transition: 'all 0.3s' }} className="group-hover:bg-[#9f1239] group-hover:text-white">
                            <ChevronRight size={20} />
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
          <div>
            <div style={s.sideCard}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                <ShieldCheck size={18} color="#44403c" />
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.15rem', color: '#1c1917', fontWeight: 600 }}>Akses Cepat</h2>
              </div>

              {/* Quick links */}
              {[
                { to: '/profile', icon: <User size={18} />, label: 'Profil Saya',  sub: 'Kelola preferensi akun' },
                { to: '/profile', icon: <Award size={18} />, label: 'Pencapaian',  sub: 'Sertifikat & lencana' },
              ].map((item, i) => (
                <Link key={i} to={item.to} style={{ textDecoration: 'none' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 16px', borderRadius: '16px', border: '1px solid #f5f5f4', marginBottom: '10px', transition: 'all 0.2s', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#fff1f2'; e.currentTarget.style.borderColor = '#fecdd3'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#f5f5f4'; }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f5f5f4', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#78716c' }}>{item.icon}</div>
                      <div>
                        <p style={{ fontSize: '0.875rem', fontWeight: 600, color: '#1c1917' }}>{item.label}</p>
                        <p style={{ fontSize: '11px', color: '#a8a29e' }}>{item.sub}</p>
                      </div>
                    </div>
                    <ChevronRight size={16} color="#d6d3d1" />
                  </div>
                </Link>
              ))}

              {/* Module quick links */}
              <div style={{ borderTop: '1px solid #f5f5f4', paddingTop: '1.25rem', marginTop: '0.5rem' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#a8a29e', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '12px' }}>Modul Tersedia</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {modules.map(mod => {
                    const done  = (progress[mod.routeId] || []).length;
                    const total = mod.lessons.length;
                    const c     = MOD_STYLE[mod.color] || MOD_STYLE.primary;
                    return (
                      <Link key={mod.routeId} to={`/module/${mod.routeId}`} style={{ textDecoration: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', borderRadius: '12px', transition: 'background 0.2s', cursor: 'pointer' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#faf9f8'}
                          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                          <span style={{ fontSize: '1.1rem' }}>{mod.icon}</span>
                          <span style={{ fontSize: '0.8rem', color: '#57534e', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mod.title}</span>
                          <span style={{ fontSize: '11px', fontWeight: 700, color: c.accent, flexShrink: 0 }}>{done}/{total}</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Motivational banner */}
              <div style={{ marginTop: '1.5rem', borderRadius: '16px', background: 'linear-gradient(135deg, #9f1239 0%, #be123c 100%)', padding: '1.25rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '6px' }}>🌸</div>
                <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, fontWeight: 300 }}>
                  Setiap langkah kecil yang Anda ambil hari ini adalah investasi untuk masa depan yang lebih cerah.
                </p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
