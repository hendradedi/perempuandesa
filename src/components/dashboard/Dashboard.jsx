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
  page:    { minHeight: '100vh', background: '#faf9f8', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1c1917' },
  nav:     { position: 'sticky', top: 0, zIndex: 50, background: 'rgba(255,255,255,0.95)', borderBottom: '1px solid #e7e5e4', backdropFilter: 'blur(16px)', boxShadow: '0 2px 8px rgba(28,25,23,0.05)' },
  navInner:{ maxWidth: '1280px', margin: '0 auto', padding: '0 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' },
  logo:    { display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' },
  logoIcon:{ width: '38px', height: '38px', borderRadius: '50%', background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9f1239' },
  main:    { maxWidth: '1280px', margin: '0 auto', padding: '3rem 2rem 5rem' },
  grid2:   { display: 'grid', gridTemplateColumns: '1fr 340px', gap: '2rem', alignItems: 'start' },
  statsRow:{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', marginBottom: '2rem' },
  statCard:{ background: '#fff', borderRadius: '20px', padding: '1.5rem', border: '1px solid #f5f5f4', boxShadow: '0 2px 8px rgba(28,25,23,0.04)' },
  card:    { background: '#fff', borderRadius: '24px', padding: '2rem', border: '1px solid #f5f5f4', boxShadow: '0 2px 8px rgba(28,25,23,0.04)', marginBottom: '1.5rem' },
  sideCard:{ background: '#fff', borderRadius: '24px', padding: '2rem', border: '1px solid #f5f5f4', boxShadow: '0 2px 8px rgba(28,25,23,0.04)', position: 'sticky', top: '90px' },
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
        <div style={s.navInner}>
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
      <main style={s.main}>

        {/* Greeting */}
        <div style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f5f5f4', border: '1px solid #e7e5e4', borderRadius: '999px', padding: '4px 14px', fontSize: '11px', fontWeight: 600, color: '#78716c', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>
            <Sparkles size={12} color="#9f1239" /> Ruang Belajar Anda
          </div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 'clamp(2rem, 4vw, 3rem)', color: '#1c1917', lineHeight: 1.15, marginBottom: '0.5rem', fontWeight: 600 }}>
            Selamat Datang,{' '}
            <span style={{ color: '#9f1239', fontStyle: 'italic' }}>{user?.name || 'Peserta'}</span>
          </h1>
          <p style={{ color: '#78716c', fontWeight: 300, fontSize: '1rem' }}>
            Mari lanjutkan perjalanan belajar Anda. Setiap langkah adalah kemajuan berarti.
          </p>
        </div>

        {/* ── STATS ROW ─────────────────────────────────────── */}
        <div style={s.statsRow}>
          {[
            { label: 'Total Poin',         value: user?.points || 0,          icon: <Crown size={20} color="#9f1239" />,      bg: '#fff1f2' },
            { label: 'Modul Selesai',      value: `${completedMods}/${modules.length}`, icon: <BookOpen size={20} color="#78716c" />,   bg: '#f5f5f4' },
            { label: 'Pelajaran Selesai',  value: `${completedLessons}/${totalLessons}`, icon: <CheckCircle2 size={20} color="#9f1239" />, bg: '#fff1f2' },
            { label: 'Sertifikat',         value: user?.certificates?.length || 0, icon: <Award size={20} color="#78716c" />,      bg: '#f5f5f4' },
          ].map((st, i) => (
            <div key={i} style={s.statCard}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#a8a29e' }}>{st.label}</p>
                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: st.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{st.icon}</div>
              </div>
              <p style={{ fontFamily: "'Playfair Display', serif", fontSize: '2.25rem', color: '#1c1917', lineHeight: 1 }}>{st.value}</p>
            </div>
          ))}
        </div>

        {/* ── TWO-COLUMN GRID ───────────────────────────────── */}
        <div style={s.grid2}>

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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                <BookOpen size={18} color="#44403c" />
                <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.2rem', color: '#1c1917', fontWeight: 600 }}>Modul Pembelajaran</h2>
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1.1rem 1.25rem', borderRadius: '18px', border: `1px solid ${c.border}`, background: c.bg, transition: 'all 0.25s', cursor: 'pointer' }}
                          onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(28,25,23,0.08)'; }}
                          onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}>

                          {/* Icon */}
                          <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', boxShadow: '0 2px 8px rgba(28,25,23,0.06)', flexShrink: 0 }}>
                            {mod.icon}
                          </div>

                          {/* Info */}
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#1c1917', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mod.title}</h3>
                              {done_ && <span style={{ flexShrink: 0, fontSize: '10px', padding: '2px 8px', borderRadius: '999px', background: '#d1fae5', color: '#065f46', border: '1px solid #a7f3d0', fontWeight: 600 }}>✓ Selesai</span>}
                            </div>
                            <p style={{ fontSize: '12px', color: '#a8a29e', marginBottom: '8px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{mod.description}</p>

                            {/* Progress bar */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ flex: 1, height: '5px', background: 'rgba(255,255,255,0.8)', borderRadius: '999px', overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${pctMod}%`, background: c.accent, borderRadius: '999px', transition: 'width 0.8s ease' }}></div>
                              </div>
                              <span style={{ fontSize: '11px', fontWeight: 700, color: c.accent, flexShrink: 0 }}>{done}/{total}</span>
                            </div>
                          </div>

                          <ChevronRight size={18} color="#d6d3d1" style={{ flexShrink: 0 }} />
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
