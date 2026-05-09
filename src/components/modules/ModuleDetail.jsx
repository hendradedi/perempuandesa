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
                className={`w-full text-left px-5 py-4 rounded-2xl text-sm font-semibold border transition-all duration-300 ${
                  matched.includes(p.term) ? 'bg-emerald-50 border-emerald-200 text-emerald-700 opacity-60 cursor-default' :
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
                className={`w-full text-left px-5 py-4 rounded-2xl text-sm leading-relaxed border transition-all duration-300 ${
                  matched.find(t => game.pairs.find(pair => pair.term === t && pair.def === p.def))
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
            className={`group py-6 rounded-3xl font-bold text-lg border-2 transition-all duration-300 flex flex-col items-center gap-2 ${
              answered === null ? 'bg-white border-stone-100 hover:border-rose-400 hover:shadow-lg hover:shadow-rose-100' :
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
        <div className={`rounded-2xl p-6 transition-all duration-500 animate-in fade-in slide-in-from-top-2 ${
          answered === q.answer ? 'bg-emerald-50 text-emerald-900 border border-emerald-100' : 'bg-rose-50 text-rose-900 border border-rose-100'
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
          <div key={item} className={`flex items-center gap-4 p-4 rounded-2xl border transition-all duration-300 ${
            checked ? (item === game.correctOrder[i] ? 'bg-emerald-50 border-emerald-300' : 'bg-red-50 border-red-300') : 'bg-white border-stone-100 hover:shadow-md'
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
    <div className="min-h-screen bg-[#fdfbf9] pb-20">
      
      {/* Decorative Background */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-rose-50/50 blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-5%] w-[30%] h-[30%] rounded-full bg-emerald-50/50 blur-[100px]"></div>
      </div>

      <div className="max-w-[1200px] mx-auto px-4 md:px-8">
        
        {/* Top Navigation */}
        <div className="py-8 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-stone-400 hover:text-stone-900 font-bold text-xs uppercase tracking-widest transition-all">
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <div className="flex items-center gap-4">
             <div className="hidden sm:flex flex-col items-end">
               <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Progress Modul</span>
               <span className="text-sm font-serif font-bold text-stone-900">{progress}%</span>
             </div>
             <div className="w-24 h-1.5 bg-stone-200 rounded-full overflow-hidden">
               <div className="h-full transition-all duration-1000" style={{ width: `${progress}%`, backgroundColor: progressColor }}></div>
             </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Sidebar Lesson Navigation */}
          <aside className="lg:col-span-4 lg:sticky lg:top-8 order-2 lg:order-1">
            <div className="bg-white rounded-[2.5rem] border border-stone-100 p-8 shadow-xl shadow-stone-200/50">
              <div className="flex items-center gap-3 mb-8">
                <div className="text-4xl">{module.icon}</div>
                <div>
                  <h2 className="font-serif text-xl font-bold text-stone-900 leading-tight">{module.title}</h2>
                  <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">Langkah Belajar</p>
                </div>
              </div>

              <div className="space-y-3">
                {module.lessons.map((lesson, idx) => {
                  const isActive = selectedLessonId === lesson.id;
                  const isDone = isLessonCompleted(lesson.id);
                  return (
                    <button 
                      key={lesson.id} 
                      onClick={() => selectLesson(lesson.id)}
                      className={`group w-full text-left p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden ${
                        isActive 
                        ? 'bg-stone-900 border-stone-900 text-white shadow-xl shadow-stone-200' 
                        : 'bg-stone-50 border-stone-100 text-stone-600 hover:border-stone-200 hover:bg-white'
                      }`}>
                      <div className="flex items-center gap-4 relative z-10">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-all ${
                          isActive ? 'bg-white/20' : isDone ? 'bg-emerald-100' : 'bg-white border border-stone-100'
                        }`}>
                          {isDone ? (
                            <CheckCircle2 size={16} className={isActive ? 'text-white' : 'text-emerald-600'} />
                          ) : (
                            <Circle size={16} className={isActive ? 'text-white/50' : 'text-stone-300'} />
                          )}
                        </div>
                        <div className="flex-1">
                          <p className={`text-[10px] font-bold uppercase tracking-widest mb-0.5 ${isActive ? 'text-white/60' : 'text-stone-400'}`}>Pelajaran {idx + 1}</p>
                          <p className={`text-sm font-bold line-clamp-1 ${isActive ? 'text-white' : 'text-stone-900'}`}>{lesson.title}</p>
                        </div>
                        {isActive && <ChevronRight size={16} className="text-white/50" />}
                      </div>
                    </button>
                  );
                })}
                
                {/* Quiz Unlock Indicator */}
                <div className={`mt-6 p-4 rounded-2xl border border-dashed text-center transition-all ${
                  progress === 100 ? 'bg-emerald-50 border-emerald-300' : 'bg-stone-50 border-stone-200'
                }`}>
                   <p className={`text-xs font-bold ${progress === 100 ? 'text-emerald-700' : 'text-stone-400'}`}>
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
                <div className="bg-white rounded-[2.5rem] border border-stone-100 p-8 sm:p-12 mb-8 shadow-xl shadow-stone-200/50">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="px-4 py-1.5 bg-stone-100 rounded-full text-[10px] font-bold text-stone-500 tracking-widest uppercase">
                      {selectedLesson.duration} Menit
                    </div>
                    {isLessonCompleted(selectedLesson.id) && (
                      <div className="px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-[10px] font-bold tracking-widest uppercase border border-emerald-100">
                        Lulus Pelajaran
                      </div>
                    )}
                  </div>
                  
                  <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 mb-8 leading-tight">
                    {selectedLesson.title}
                  </h1>

                  <div className="prose prose-stone max-w-none">
                    <div className="flex items-center gap-3 mb-6 text-stone-900">
                      <div className="p-2 bg-rose-50 rounded-xl">
                        <BookOpen size={24} className="text-rose-600" />
                      </div>
                      <h3 className="text-xl font-bold font-serif m-0">Materi Belajar</h3>
                    </div>
                    <p className="text-stone-600 text-lg leading-relaxed font-light">
                      {selectedLesson.content}
                    </p>
                  </div>
                </div>

                {/* Key Insights & Tips Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {selectedLesson.keyPoints && (
                    <div className="bg-white rounded-[2.5rem] border border-stone-100 p-8 shadow-sm">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-rose-50 rounded-xl text-rose-600">
                          <Lightbulb size={20} />
                        </div>
                        <h4 className="font-serif font-bold text-lg text-stone-900">Poin Utama</h4>
                      </div>
                      <ul className="space-y-4">
                        {selectedLesson.keyPoints.map((pt, i) => (
                          <li key={i} className="flex items-start gap-3 group">
                            <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-rose-400 group-hover:scale-150 transition-all duration-300"></div>
                            <span className="text-sm text-stone-600 leading-relaxed font-medium">{pt}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedLesson.tips && (
                    <div className="bg-stone-900 rounded-[2.5rem] p-8 text-white shadow-xl shadow-stone-200">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-white/10 rounded-xl text-rose-400">
                          <Info size={20} />
                        </div>
                        <h4 className="font-serif font-bold text-lg">Saran Belajar</h4>
                      </div>
                      <p className="text-stone-400 text-sm leading-relaxed italic">
                        "{selectedLesson.tips}"
                      </p>
                    </div>
                  )}
                </div>

                {/* Game / Interaction Area */}
                <div className="mb-12">
                   <GameSection game={selectedLesson.game} />
                </div>

                {/* Bottom Navigation Actions */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-6 py-12 border-t border-stone-200">
                  <button
                    onClick={() => {
                      const idx = module.lessons.findIndex(l => l.id === selectedLesson.id);
                      if (idx > 0) selectLesson(module.lessons[idx - 1].id);
                    }}
                    disabled={module.lessons.findIndex(l => l.id === selectedLesson.id) === 0}
                    className="flex items-center gap-3 text-stone-400 font-bold text-xs uppercase tracking-widest disabled:opacity-30 disabled:pointer-events-none hover:text-stone-900 transition-all">
                    <ChevronLeft size={18} /> Sebelumnya
                  </button>

                  {!isLessonCompleted(selectedLesson.id) ? (
                    <button 
                      onClick={handleCompleteLesson} 
                      className="group bg-stone-900 text-white px-10 py-5 rounded-[2rem] font-bold flex items-center gap-4 hover:shadow-2xl hover:shadow-stone-300 transition-all transform hover:-translate-y-1">
                      <span>Tandai Selesai</span>
                      <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-emerald-500 transition-all">
                        <CheckCircle2 size={16} />
                      </div>
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        const idx = module.lessons.findIndex(l => l.id === selectedLesson.id);
                        if (idx < module.lessons.length - 1) selectLesson(module.lessons[idx + 1].id);
                        else navigate(`/quiz/${module.routeId}`);
                      }} 
                      className="group bg-rose-600 text-white px-10 py-5 rounded-[2rem] font-bold flex items-center gap-4 hover:shadow-2xl hover:shadow-rose-300 transition-all transform hover:-translate-y-1">
                      <span>{module.lessons.findIndex(l => l.id === selectedLesson.id) === module.lessons.length - 1 ? 'Mulai Kuis' : 'Lanjut Belajar'}</span>
                      <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
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
        <div className="fixed inset-x-0 top-10 flex items-center justify-center z-[100] px-4">
          <div className="bg-stone-900 text-white rounded-[2rem] px-8 py-5 flex items-center gap-6 shadow-2xl animate-in zoom-in slide-in-from-top-10 duration-500">
             <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-2xl">🎉</div>
             <div>
               <p className="font-bold text-sm">Pelajaran Selesai!</p>
               <p className="text-[10px] text-stone-400 uppercase tracking-widest font-bold">+10 Poin SELARAS</p>
             </div>
             <div className="w-px h-10 bg-white/10"></div>
             <Trophy className="text-amber-400" size={24} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleDetail;
