import { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { learningModules } from '../../data/learningModules';

const LESSON_PROGRESS_KEY = 'lessonProgressByModule';

const getStoredProgress = () => {
  const storedValue = localStorage.getItem(LESSON_PROGRESS_KEY);

  if (!storedValue) {
    return {};
  }

  try {
    return JSON.parse(storedValue);
  } catch {
    return {};
  }
};

const getModuleProgressClass = (color) => {
  if (color === 'coral') {
    return 'bg-coral-600';
  }

  if (color === 'teal') {
    return 'bg-teal-600';
  }

  return 'bg-primary-600';
};

const ModuleDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedByModule, setSelectedByModule] = useState({});
  const [completedByModule, setCompletedByModule] = useState(() => getStoredProgress());
  const [showCongrats, setShowCongrats] = useState(false);

  const module = useMemo(
    () => learningModules.find((item) => item.id === parseInt(id, 10)) ?? null,
    [id]
  );

  const completedLessonIds = completedByModule[id] ?? [];
  const selectedLessonId = module ? (selectedByModule[id] ?? module.lessons[0]?.id) : null;
  const selectedLesson = module
    ? module.lessons.find((lesson) => lesson.id === selectedLessonId) ?? module.lessons[0]
    : null;

  const isLessonCompleted = (lessonId) => completedLessonIds.includes(lessonId);
  const progressClass = module ? getModuleProgressClass(module.color) : 'bg-primary-600';

  const selectLesson = (lessonId) => {
    setSelectedByModule((prev) => ({ ...prev, [id]: lessonId }));
  };

  const saveModuleProgress = (updatedCompletedIds) => {
    setCompletedByModule((prev) => {
      const next = { ...prev, [id]: updatedCompletedIds };
      localStorage.setItem(LESSON_PROGRESS_KEY, JSON.stringify(next));
      return next;
    });
  };

  const handleCompleteLesson = () => {
    if (selectedLesson && !isLessonCompleted(selectedLesson.id)) {
      const updatedCompletedIds = [...completedLessonIds, selectedLesson.id];
      saveModuleProgress(updatedCompletedIds);
      setShowCongrats(true);

      setTimeout(() => {
        setShowCongrats(false);

        const allCompleted = module.lessons.every((lesson) => updatedCompletedIds.includes(lesson.id));
        if (allCompleted) {
          navigate(`/quiz/${module.id}`);
        } else {
          const currentIndex = module.lessons.findIndex((lesson) => lesson.id === selectedLesson.id);
          if (currentIndex < module.lessons.length - 1) {
            selectLesson(module.lessons[currentIndex + 1].id);
          }
        }
      }, 2000);
    }
  };

  if (!module) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card text-center max-w-md w-full">
          <p className="text-lg text-slate-700">Modul tidak ditemukan.</p>
          <Link to="/dashboard" className="btn-primary mt-4 inline-flex">
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const completedLessons = module.lessons.filter((lesson) => isLessonCompleted(lesson.id)).length;
  const progress = Math.round((completedLessons / module.lessons.length) * 100);

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 fade-in">
          <Link to="/dashboard" className="text-primary-700 hover:text-primary-800 mb-4 inline-flex items-center font-medium">
            ← Kembali ke Dashboard
          </Link>

          <div className="flex items-start gap-4 mt-4 mb-6">
            <span className="text-5xl md:text-6xl leading-none">{module.icon}</span>
            <div>
              <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900">{module.title}</h1>
              <p className="text-slate-600 mt-2">{module.description}</p>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-slate-700">Progress Modul</span>
              <span className="text-sm font-semibold text-primary-700">{progress}%</span>
            </div>
            <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
              <div className={`${progressClass} h-2.5 rounded-full transition-all duration-500`} style={{ width: `${progress}%` }}></div>
            </div>
            <p className="text-sm text-slate-600 mt-2">
              {completedLessons} dari {module.lessons.length} pelajaran selesai
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          <div className="lg:col-span-1">
            <div className="card lg:sticky lg:top-24">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Daftar Pelajaran</h2>
              <div className="space-y-2">
                {module.lessons.map((lesson, index) => (
                  <button
                    key={lesson.id}
                    onClick={() => selectLesson(lesson.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all ${
                      selectedLesson?.id === lesson.id
                        ? 'bg-primary-50 border-primary-300'
                        : 'bg-white border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className={`text-xl ${isLessonCompleted(lesson.id) ? '' : 'opacity-60'}`}>
                        {isLessonCompleted(lesson.id) ? '✅' : '📝'}
                      </span>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 text-sm">Pelajaran {index + 1}</p>
                        <p className="text-xs text-slate-600">{lesson.title}</p>
                        <p className="text-xs text-slate-500 mt-1">{lesson.duration}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            {selectedLesson && (
              <div className="card slide-up">
                <div className="mb-6">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                    <h2 className="text-2xl font-bold text-slate-900">{selectedLesson.title}</h2>
                    {isLessonCompleted(selectedLesson.id) && (
                      <span className="px-3 py-1 bg-teal-100 text-teal-700 rounded-full text-sm font-medium w-fit">
                        ✓ Selesai
                      </span>
                    )}
                  </div>
                  <p className="text-slate-600 flex items-center gap-2 text-sm">
                    <span>⏱️</span>
                    <span>{selectedLesson.duration}</span>
                  </p>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
                    <h3 className="text-base font-semibold text-slate-900 mb-2">Materi Pembelajaran</h3>
                    <p className="text-slate-700 leading-relaxed">{selectedLesson.content}</p>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <span className="text-xl">💡</span>
                      Poin Penting
                    </h4>
                    <ul className="list-disc list-inside text-slate-700 space-y-1.5">
                      <li>Pahami konsep dasar dengan baik</li>
                      <li>Praktikkan dalam kehidupan sehari-hari</li>
                      <li>Diskusikan dengan komunitas</li>
                    </ul>
                  </div>

                  <div className="rounded-xl border border-slate-200 bg-white p-5">
                    <h4 className="font-semibold text-slate-900 mb-2 flex items-center gap-2">
                      <span className="text-xl">📌</span>
                      Tips Belajar
                    </h4>
                    <p className="text-slate-700">
                      Luangkan waktu untuk memahami setiap bagian. Jangan ragu untuk mengulang materi jika diperlukan.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 sm:justify-between pt-6 border-t border-slate-200">
                  <button
                    onClick={() => {
                      const currentIndex = module.lessons.findIndex((lesson) => lesson.id === selectedLesson.id);
                      if (currentIndex > 0) {
                        selectLesson(module.lessons[currentIndex - 1].id);
                      }
                    }}
                    disabled={module.lessons.findIndex((lesson) => lesson.id === selectedLesson.id) === 0}
                    className="btn-outline disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ← Sebelumnya
                  </button>

                  {!isLessonCompleted(selectedLesson.id) ? (
                    <button onClick={handleCompleteLesson} className="btn-primary">Tandai Selesai ✓</button>
                  ) : (
                    <button
                      onClick={() => {
                        const currentIndex = module.lessons.findIndex((lesson) => lesson.id === selectedLesson.id);
                        if (currentIndex < module.lessons.length - 1) {
                          selectLesson(module.lessons[currentIndex + 1].id);
                        } else {
                          navigate(`/quiz/${module.id}`);
                        }
                      }}
                      className="btn-primary"
                    >
                      {module.lessons.findIndex((lesson) => lesson.id === selectedLesson.id) === module.lessons.length - 1
                        ? 'Mulai Kuis →'
                        : 'Selanjutnya →'}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {showCongrats && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 fade-in px-4">
            <div className="card max-w-sm w-full text-center bounce-in">
              <div className="text-5xl mb-3">🎉</div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Selamat!</h3>
              <p className="text-slate-600 mb-4">Anda telah menyelesaikan pelajaran ini.</p>
              <div className="inline-flex items-center gap-2 text-primary-700 bg-primary-50 rounded-full px-4 py-2 font-semibold">
                <span className="text-xl">👑</span>
                <span>+10 Poin</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ModuleDetail;
