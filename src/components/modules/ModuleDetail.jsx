import { useEffect, useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  BookOpen,
  Lightbulb,
  Info,
  CheckCircle2,
  Circle,
  ChevronRight,
  ChevronLeft,
  Trophy,
  Puzzle,
  CheckSquare,
  ListOrdered,
  Clock,
  Sparkles
} from 'lucide-react';
import { buildAllModules, findModuleByRouteId } from '../../utils/moduleHelpers';

const LESSON_PROGRESS_KEY = 'lessonProgressByModule';

const getStoredProgress = () => {
  try { return JSON.parse(localStorage.getItem(LESSON_PROGRESS_KEY) || '{}'); }
  catch { return {}; }
};

const s = {
  page:    { minHeight: '100vh', background: '#fdfbf9', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1c1917' },
  main:    { maxWidth: '1280px', margin: '0 auto' },
  card:    { background: '#fff', borderRadius: '32px', padding: '2.5rem', border: '1px solid #f5f5f4', boxShadow: '0 4px 20px rgba(28,25,23,0.03)', marginBottom: '2rem' },
  sideCard:{ background: '#fff', borderRadius: '32px', padding: '2rem', border: '1px solid #f5f5f4', boxShadow: '0 4px 20px rgba(28,25,23,0.03)', position: 'sticky', top: '100px' },
  btn:     { padding: '14px 28px', borderRadius: '999px', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer', border: 'none', transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center' }
};

// ── Game Components ─────────────────────────────────────────────────────────

function MatchingGame({ game }) {
  const [selected, setSelected] = useState({ term: null, def: null });
  const [matched, setMatched] = useState([]);
  const [shuffledDefs, setShuffledDefs] = useState(() => [...game.pairs].sort(() => Math.random() - 0.5));
  const [wrong, setWrong] = useState(false);

  const handleTerm = (term) => setSelected(s => ({ ...s, term }));
  const handleDef = (def) => {
    const term = selected.term;
    if (!term) return;
    const pair = game.pairs.find(p => p.term === term);
    if (pair && pair.def === def) {
      setMatched(m => [...m, term]);
      setSelected({ term: null, def: null });
    } else {
      setWrong(true);
      setTimeout(() => { setWrong(false); setSelected({ term: null, def: null }); }, 800);
    }
  };

  const done = matched.length === game.pairs.length;

  return (
    <div className="rounded-[2rem] border border-stone-200 bg-white p-8 mt-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-rose-50 rounded-xl">
          <Puzzle className="text-rose-600" size={24} />
        </div>
        <h4 className="font-serif text-xl font-bold text-stone-900">{game.title}</h4>
      </div>
      {done ? (
        <div className="text-center py-10 bg-emerald-50 rounded-3xl border border-emerald-100">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
            <Sparkles className="text-emerald-500" size={32} />
          </div>
          <p className="font-serif text-2xl font-bold text-emerald-900">Semua cocok! Luar biasa!</p>
          <p className="text-emerald-700 mt-1">Anda telah memahami istilah-istilah penting ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-4">Pilih Istilah</p>
            {game.pairs.map(p => (
              <button key={p.term} disabled={matched.includes(p.term)}
                onClick={() => handleTerm(p.term)}
                className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-semibold border transition-all duration-300 ${matched.includes(p.term) ? 'bg-emerald-50 border-emerald-200 text-emerald-700 opacity-60 cursor-default' :
                  selected.term === p.term ? 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-200 -translate-y-0.5' :
                    'bg-stone-50 border-stone-100 text-stone-700 hover:border-rose-300 hover:bg-white hover:shadow-md'
                  }`}>{p.term}</button>
            ))}
          </div>
          <div className="space-y-3">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-[0.2em] mb-4">Pilih Definisi</p>
            {shuffledDefs.map(p => (
              <button key={p.def} disabled={matched.includes(p.term)}
                onClick={() => handleDef(p.def)}
                className={`w-full text-left px-5 py-4 rounded-2xl text-sm leading-relaxed border transition-all duration-300 ${matched.find(t => game.pairs.find(pair => pair.term === t && pair.def === p.def))
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-700 opacity-60 cursor-default' :
                  wrong ? 'bg-red-50 border-red-300 animate-shake text-red-700' :
                    'bg-stone-50 border-stone-100 text-stone-600 hover:border-rose-300 hover:bg-white hover:shadow-md'
                  }`}>{p.def}</button>
            ))}
          </div>
        </div>
      )}
      {selected.term && !done && (
        <div className="mt-6 p-4 bg-stone-50 rounded-2xl border border-stone-100 text-center">
          <p className="text-sm text-stone-500 italic">
            Mencari definisi untuk: <span className="font-bold text-rose-600">"{selected.term}"</span>
          </p>
        </div>
      )}
    </div>
  );
}

function TrueFalseGame({ game }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(null);
  const [done, setDone] = useState(false);

  const q = game.questions[current];

  const answer = (val) => {
    if (answered !== null) return;
    setAnswered(val);
    if (val === q.answer) setScore(s => s + 1);
    setTimeout(() => {
      if (current < game.questions.length - 1) { setCurrent(c => c + 1); setAnswered(null); }
      else setDone(true);
    }, 2500);
  };

  if (done) return (
    <div className="rounded-[2rem] border border-stone-200 bg-white p-10 mt-8 text-center shadow-sm">
      <div className="w-20 h-20 bg-rose-50 rounded-3xl flex items-center justify-center mx-auto mb-6">
        <Trophy className="text-rose-600" size={40} />
      </div>
      <h4 className="font-serif text-2xl font-bold text-stone-900 mb-2">{game.title}</h4>
      <p className="text-stone-500 mb-6">Latihan selesai dengan hasil:</p>
      <div className="inline-flex items-center gap-3 px-8 py-4 bg-stone-900 text-white rounded-2xl text-2xl font-bold mb-8">
        {score} / {game.questions.length}
      </div>
      <button onClick={() => { setCurrent(0); setScore(0); setAnswered(null); setDone(false); }}
        className="block w-full max-w-xs mx-auto py-4 bg-stone-100 text-stone-700 rounded-2xl font-bold hover:bg-stone-200 transition-all">
        Ulangi Latihan
      </button>
    </div>
  );

  return (
    <div className="rounded-[2rem] border border-stone-200 bg-white p-8 mt-8 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-50 rounded-xl">
            <CheckSquare className="text-emerald-600" size={24} />
          </div>
          <h4 className="font-serif text-xl font-bold text-stone-900">{game.title}</h4>
        </div>
        <div className="px-4 py-1.5 bg-stone-100 rounded-full text-[10px] font-bold text-stone-500 tracking-widest uppercase">
          {current + 1} / {game.questions.length}
        </div>
      </div>

      <div className="bg-[#fdfbf9] rounded-3xl p-8 mb-8 border border-stone-100 min-h-[120px] flex items-center justify-center">
        <p className="text-stone-800 font-serif text-xl text-center leading-relaxed italic">"{q.statement}"</p>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        {[true, false].map(val => (
          <button key={String(val)} onClick={() => answer(val)}
            disabled={answered !== null}
            className={`group py-6 rounded-3xl font-bold text-lg border-2 transition-all duration-300 flex flex-col items-center gap-2 ${answered === null ? 'bg-white border-stone-100 hover:border-rose-400 hover:shadow-lg hover:shadow-rose-100' :
              val === q.answer ? 'bg-emerald-50 border-emerald-500 text-emerald-700' :
                answered === val ? 'bg-red-50 border-red-400 text-red-700' :
                  'bg-white border-stone-100 opacity-40'
              }`}>
            <span className="text-2xl mb-1">{val ? '✅' : '❌'}</span>
            <span className="tracking-widest uppercase text-xs">{val ? 'Benar' : 'Salah'}</span>
          </button>
        ))}
      </div>

      {answered !== null && (
        <div className={`rounded-2xl p-6 transition-all duration-500 animate-in fade-in slide-in-from-top-2 ${answered === q.answer ? 'bg-emerald-50 text-emerald-900 border border-emerald-100' : 'bg-rose-50 text-rose-900 border border-rose-100'
          }`}>
          <div className="flex items-center gap-2 mb-2">
            <Sparkles size={18} className={answered === q.answer ? 'text-emerald-600' : 'text-rose-600'} />
            <span className="font-bold text-sm">{answered === q.answer ? 'Luar Biasa!' : 'Penjelasan:'}</span>
          </div>
          <p className="text-sm leading-relaxed opacity-90">{q.explanation}</p>
        </div>
      )}
    </div>
  );
}

function OrderingGame({ game }) {
  const [items, setItems] = useState(() => [...game.items].sort(() => Math.random() - 0.5));
  const [checked, setChecked] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const move = (i, dir) => {
    if (checked) return;
    const next = [...items];
    const j = i + dir;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    setItems(next);
  };

  const check = () => {
    const correct = items.every((item, i) => item === game.correctOrder[i]);
    setIsCorrect(correct);
    setChecked(true);
  };

  return (
    <div className="rounded-[2rem] border border-stone-200 bg-white p-8 mt-8 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-50 rounded-xl">
          <ListOrdered className="text-indigo-600" size={24} />
        </div>
        <h4 className="font-serif text-xl font-bold text-stone-900">{game.title}</h4>
      </div>
      <p className="text-sm text-stone-500 mb-6 bg-stone-50 p-4 rounded-2xl border border-stone-100">
        💡 Gunakan tombol ↑ ↓ untuk mengurutkan langkah-langkah di bawah ini dengan urutan yang benar.
      </p>

      <div className="space-y-3 mb-8">
        {items.map((item, i) => (
          <div key={item} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${checked ? (item === game.correctOrder[i] ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300') : 'bg-white border-stone-100 hover:shadow-md'
            }`}>
            <span className="w-8 h-8 rounded-xl bg-stone-900 text-white font-bold text-xs flex items-center justify-center shrink-0 shadow-sm">{i + 1}</span>
            <span className="flex-1 text-sm font-semibold text-stone-800">{item}</span>
            {!checked && (
              <div className="flex gap-2">
                <button onClick={() => move(i, -1)} className="w-9 h-9 rounded-xl bg-stone-50 text-stone-400 hover:bg-stone-900 hover:text-white transition-all flex items-center justify-center border border-stone-200">
                  <ChevronLeft size={16} className="rotate-90" />
                </button>
                <button onClick={() => move(i, 1)} className="w-9 h-9 rounded-xl bg-stone-50 text-stone-400 hover:bg-stone-900 hover:text-white transition-all flex items-center justify-center border border-stone-200">
                  <ChevronLeft size={16} className="-rotate-90" />
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {!checked ? (
        <button onClick={check} className="w-full py-4 bg-stone-900 text-white rounded-2xl font-bold hover:shadow-xl hover:shadow-stone-200 transition-all transform hover:-translate-y-0.5">
          Periksa Urutan
        </button>
      ) : (
        <div className={`rounded-2xl p-6 text-center shadow-inner ${isCorrect ? 'bg-emerald-50 text-emerald-900' : 'bg-amber-50 text-amber-900 border border-amber-200'}`}>
          <div className="text-2xl mb-2">{isCorrect ? '✨' : '🧐'}</div>
          <p className="font-bold text-sm mb-2">{isCorrect ? 'Urutan Sempurna!' : 'Belum Tepat'}</p>
          {!isCorrect && <p className="text-xs mb-4 opacity-80">Urutan benar: {game.correctOrder.join(' → ')}</p>}
          <button onClick={() => { setItems([...game.items].sort(() => Math.random() - 0.5)); setChecked(false); }}
            className="text-xs font-bold uppercase tracking-widest underline underline-offset-4">Coba lagi</button>
        </div>
      )}
    </div>
  );
}

function GameSection({ game }) {
  if (!game) return null;
  if (game.type === 'matching') return <MatchingGame game={game} />;
  if (game.type === 'truefalse') return <TrueFalseGame game={game} />;
  if (game.type === 'ordering') return <OrderingGame game={game} />;
  return null;
}

// ── Main Component ──────────────────────────────────────────────────────────

const ModuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [allModules, setAllModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedByModule, setSelectedByModule] = useState({});
  const [completedByModule, setCompletedByModule] = useState(() => getStoredProgress());
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    buildAllModules().then(m => { setAllModules(m); setIsLoading(false); });
  }, []);

  const module = useMemo(() => findModuleByRouteId(allModules, id), [allModules, id]);
  const moduleRouteId = module?.routeId || id;
  const completedLessonIds = completedByModule[moduleRouteId] ?? [];
  const selectedLessonId = module ? (selectedByModule[moduleRouteId] ?? module.lessons[0]?.id) : null;
  const selectedLesson = module ? module.lessons.find(l => l.id === selectedLessonId) ?? module.lessons[0] : null;

  const isLessonCompleted = (lessonId) => completedLessonIds.includes(lessonId);

  const progressColor = { coral: '#9f1239', teal: '#134e4a' }[module?.color] || '#9f1239';

  const selectLesson = (lessonId) => {
    setSelectedByModule(p => ({ ...p, [moduleRouteId]: lessonId }));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteLesson = () => {
    if (!selectedLesson || isLessonCompleted(selectedLesson.id)) return;
    const updated = [...completedLessonIds, selectedLesson.id];
    setCompletedByModule(prev => {
      const next = { ...prev, [moduleRouteId]: updated };
      localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(next));
      return next;
    });
    setShowCongrats(true);
    setTimeout(() => {
      setShowCongrats(false);
      const allDone = module.lessons.every(l => updated.includes(l.id));
      if (allDone) { navigate(`/quiz/${module.routeId}`); return; }
      const idx = module.lessons.findIndex(l => l.id === selectedLesson.id);
      if (idx < module.lessons.length - 1) selectLesson(module.lessons[idx + 1].id);
    }, 2000);
  };

  if (!module) {
    if (isLoading) return <div className="min-h-screen flex items-center justify-center bg-[#fdfbf9]"><div className="animate-pulse text-stone-400 font-serif">Mempersiapkan materi...</div></div>;
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fdfbf9] px-4">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] p-10 shadow-2xl shadow-stone-200 text-center">
          <p className="text-xl font-serif text-stone-800 mb-6">Oops! Modul tidak ditemukan.</p>
          <Link to="/dashboard" className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-4 rounded-2xl font-bold hover:shadow-xl transition-all">
            <ArrowLeft size={18} /> Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const completedCount = module.lessons.filter(l => isLessonCompleted(l.id)).length;
  const progress = Math.round((completedCount / module.lessons.length) * 100);

  return (
    <div style={s.page}>

      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-rose-50/50 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-emerald-50/50 blur-[100px]"></div>
      </div>

      <div style={s.main} className="px-4 md:px-8">

        {/* Top Navigation */}
        <div className="py-6 sm:py-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Link to="/dashboard" className="flex items-center gap-2 text-stone-400 hover:text-stone-900 font-bold text-xs uppercase tracking-widest transition-all">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            <div className="flex flex-col items-end">
              <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Progress Modul</span>
              <span className="text-sm font-serif font-bold text-stone-900">{progress}%</span>
            </div>
            <div className="w-24 sm:w-32 h-1.5 bg-stone-200 rounded-full overflow-hidden">
              <div className="h-full transition-all duration-1000" style={{ width: `${progress}%`, backgroundColor: progressColor }}></div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start pb-12">

          {/* Sidebar Lesson Navigation */}
          <aside className="lg:col-span-4 order-2 lg:order-1">
            <div style={s.sideCard}>
              <div className="flex items-start gap-4 mb-8">
                <div style={{ fontSize: '2.5rem', lineHeight: 1 }}>{module.icon}</div>
                <div className="flex-1 min-w-0">
                  <h2 className="font-serif text-xl font-bold text-stone-900 leading-tight mb-1">{module.title}</h2>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f5f5f4', borderRadius: '8px', padding: '2px 8px' }}>
                    <span className="text-[9px] font-bold text-stone-500 uppercase tracking-widest">Kurikulum</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 sm:space-y-3">
                {module.lessons.map((lesson, idx) => {
                  const isActive = selectedLessonId === lesson.id;
                  const isDone = isLessonCompleted(lesson.id);
                  return (
                    <button
                      key={lesson.id}
                      onClick={() => selectLesson(lesson.id)}
                      className={`group w-full text-left p-4 sm:p-5 rounded-2xl border transition-all duration-300 relative overflow-hidden ${isActive
                        ? 'bg-stone-900 border-stone-900 text-white shadow-xl shadow-stone-200 -translate-y-0.5'
                        : 'bg-white border-stone-100 text-stone-600 hover:border-rose-200 hover:bg-rose-50/10'
                        }`}>
                      <div className="flex items-center gap-4 relative z-10">
                        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all ${isActive ? 'bg-white/10' : isDone ? 'bg-emerald-100' : 'bg-stone-50 border border-stone-100'
                          }`}>
                          {isDone ? (
                            <CheckCircle2 size={16} className={isActive ? 'text-white' : 'text-emerald-600'} />
                          ) : (
                            <Circle size={16} className={isActive ? 'text-white/40' : 'text-stone-300'} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[10px] font-bold uppercase tracking-widest mb-1 ${isActive ? 'text-white/50' : 'text-stone-400'}`}>Langkah {idx + 1}</p>
                          <p className={`text-sm font-bold leading-snug ${isActive ? 'text-white' : 'text-stone-800'}`}>{lesson.title}</p>
                        </div>
                        {isActive && <ChevronRight size={16} className="text-white/40 animate-pulse shrink-0" />}
                      </div>
                    </button>
                  );
                })}

                {/* Quiz Unlock Indicator */}
                <div className={`mt-4 sm:mt-6 p-3 sm:p-4 rounded-xl sm:rounded-2xl border border-dashed text-center transition-all ${progress === 100 ? 'bg-emerald-50 border-emerald-300' : 'bg-stone-50 border-stone-200'
                  }`}>
                  <p className={`text-[11px] sm:text-xs font-bold ${progress === 100 ? 'text-emerald-700' : 'text-stone-400'}`}>
                    {progress === 100 ? '🎉 Kuis Siap Dikerjakan!' : '🔒 Selesaikan Semua Pelajaran'}
                  </p>
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="lg:col-span-8 order-1 lg:order-2">
            {selectedLesson && (
              <div className="animate-in fade-in slide-in-from-bottom-6 duration-700">

                {/* Content Header Card */}
                <div style={s.card}>
                  <div className="flex items-center gap-3 mb-10">
                    <div className="px-5 py-2 bg-stone-50 rounded-full text-[11px] font-bold text-stone-500 tracking-widest uppercase border border-stone-100">
                      <Clock size={12} className="inline mr-2 -mt-0.5" />
                      Estimasi {selectedLesson.duration?.toLowerCase().replace('menit', '').trim()} Menit
                    </div>
                    {isLessonCompleted(selectedLesson.id) && (
                      <div className="px-5 py-2 bg-emerald-50 text-emerald-700 rounded-full text-[11px] font-bold tracking-widest uppercase border border-emerald-100 flex items-center gap-2">
                        <CheckCircle2 size={12} />
                        Sudah Dipelajari
                      </div>
                    )}
                  </div>

                  <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-stone-900 mb-10 lg:mb-12 leading-[1.1] font-bold">
                    {selectedLesson.title}
                  </h1>

                  <div className="relative">
                    <div className="flex items-center gap-4 mb-8 text-stone-900">
                      <div className="w-12 h-12 bg-rose-50 rounded-2xl flex items-center justify-center border border-rose-100 shadow-sm">
                        <BookOpen size={24} className="text-rose-600" />
                      </div>
                      <h3 className="text-2xl font-bold font-serif">Materi Belajar</h3>
                    </div>
                    <div className="text-stone-700 text-lg sm:text-xl leading-relaxed font-light whitespace-pre-line bg-stone-50/30 p-8 sm:p-10 rounded-3xl border border-stone-100/50">
                      {selectedLesson.content}
                    </div>
                  </div>
                </div>

                {/* Key Insights & Tips Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                  {selectedLesson.keyPoints && (
                    <div style={s.card}>
                      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <div className="p-2 bg-rose-50 rounded-lg sm:rounded-xl text-rose-600">
                          <Lightbulb size={18} className="sm:w-5 sm:h-5" />
                        </div>
                        <h4 className="font-serif font-bold text-base sm:text-lg text-stone-900">Poin Utama</h4>
                      </div>
                      <ul className="space-y-6">
                        {selectedLesson.keyPoints.map((pt, i) => (
                          <li key={i} className="flex items-start gap-4 group">
                            <div className="mt-2 w-2 h-2 rounded-full bg-rose-400 group-hover:scale-150 transition-all duration-300 shrink-0 shadow-sm"></div>
                            <span className="text-sm sm:text-base text-stone-600 leading-relaxed font-medium">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedLesson.tips && (
                    <div style={{...s.card, background: '#1c1917', color: '#fff', borderColor: '#1c1917'}}>
                      <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                        <div className="p-2 bg-white/10 rounded-lg sm:rounded-xl text-rose-400">
                          <Info size={18} className="sm:w-5 sm:h-5" />
                        </div>
                        <h4 className="font-serif font-bold text-base sm:text-lg">Saran Belajar</h4>
                      </div>
                      <p className="text-stone-300 text-sm sm:text-base leading-loose italic">
                        "{selectedLesson.tips}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Game / Interaction Area */}
                <div className="mb-8 sm:mb-12">
                  <GameSection game={selectedLesson.game} />
                </div>

                {/* Bottom Navigation Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 py-8 sm:py-12 border-t border-stone-200">
                  <button
                    onClick={() => {
                      const idx = module.lessons.findIndex(l => l.id === selectedLesson.id);
                      if (idx > 0) selectLesson(module.lessons[idx - 1].id);
                    }}
                    disabled={module.lessons.findIndex(l => l.id === selectedLesson.id) === 0}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                    className="flex items-center gap-2 sm:gap-3 text-stone-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest disabled:opacity-30 disabled:pointer-events-none hover:text-stone-900 transition-all">
                    <ChevronLeft size={16} /> Sebelumnya
                  </button>

                  {!isLessonCompleted(selectedLesson.id) ? (
                    <button
                      onClick={handleCompleteLesson}
                      style={{...s.btn, background: '#1c1917', color: '#fff', padding: '16px 32px'}}
                      className="group hover:shadow-2xl hover:shadow-stone-300 transform hover:-translate-y-1 w-full sm:w-auto">
                      <span>Tandai Selesai</span>
                      <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-emerald-500 transition-all">
                        <CheckCircle2 size={14} className="sm:w-4 sm:h-4" />
                      </div>
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        const idx = module.lessons.findIndex(l => l.id === selectedLesson.id);
                        if (idx < module.lessons.length - 1) selectLesson(module.lessons[idx + 1].id);
                        else navigate(`/quiz/${module.routeId}`);
                      }}
                      style={{...s.btn, background: '#e11d48', color: '#fff', padding: '16px 32px'}}
                      className="group hover:shadow-2xl hover:shadow-rose-300 transform hover:-translate-y-1 w-full sm:w-auto">
                      <span>{module.lessons.findIndex(l => l.id === selectedLesson.id) === module.lessons.length - 1 ? 'Mulai Kuis' : 'Lanjut Belajar'}</span>
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Modern Congrats Notification */}
      {showCongrats && (
        <div className="fixed inset-x-0 top-6 sm:top-10 flex items-center justify-center z-[100] px-4">
          <div className="bg-stone-900 text-white rounded-[1.5rem] sm:rounded-[2rem] px-6 sm:px-8 py-4 sm:py-5 flex items-center gap-4 sm:gap-6 shadow-2xl animate-in zoom-in slide-in-from-top-10 duration-500 max-w-md w-full">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shrink-0">🎉</div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-xs sm:text-sm">Pelajaran Selesai!</p>
              <p className="text-[9px] sm:text-[10px] text-stone-400 uppercase tracking-widest font-bold">+10 Poin SELARAS</p>
            </div>
            <div className="hidden sm:block w-px h-10 bg-white/10"></div>
            <Trophy className="text-amber-400 shrink-0" size={20} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleDetail;
