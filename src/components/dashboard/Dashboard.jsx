import { Link } from 'react-router-dom';
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

const Dashboard = ({ user }) => {
  const completedByModule = getStoredProgress();

  const progress = learningModules.reduce(
    (acc, module) => {
      const completedIds = completedByModule[module.id] ?? [];
      const moduleCompletedLessons = module.lessons.filter((lesson) => completedIds.includes(lesson.id)).length;

      acc.totalLessons += module.lessons.length;
      acc.completedLessons += moduleCompletedLessons;

      if (moduleCompletedLessons === module.lessons.length) {
        acc.completedModules += 1;
      }

      return acc;
    },
    {
      totalModules: learningModules.length,
      completedModules: 0,
      totalLessons: 0,
      completedLessons: 0
    }
  );

  const progressPercentage = progress.totalLessons > 0
    ? Math.round((progress.completedLessons / progress.totalLessons) * 100)
    : 0;

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 fade-in">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">
            Selamat Datang, {user?.name || 'Peserta'}! 👋
          </h1>
          <p className="text-slate-600">Mari lanjutkan perjalanan belajarmu hari ini</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6 mb-8">
          <div className="card slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Total Poin</p>
                <p className="text-3xl font-bold text-primary-600">{user?.points || 0}</p>
              </div>
              <span className="text-4xl">👑</span>
            </div>
          </div>

          <div className="card slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Modul Selesai</p>
                <p className="text-3xl font-bold text-coral-600">
                  {progress.completedModules}/{progress.totalModules}
                </p>
              </div>
              <span className="text-4xl">📚</span>
            </div>
          </div>

          <div className="card slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Pelajaran Selesai</p>
                <p className="text-3xl font-bold text-teal-600">
                  {progress.completedLessons}/{progress.totalLessons}
                </p>
              </div>
              <span className="text-4xl">✅</span>
            </div>
          </div>

          <div className="card slide-up" style={{ animationDelay: '0.3s' }}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 mb-1">Badge</p>
                <p className="text-3xl font-bold text-amber-500">{user?.badges?.length || 0}</p>
              </div>
              <span className="text-4xl">🏆</span>
            </div>
          </div>
        </div>

        <div className="card mb-8 slide-up" style={{ animationDelay: '0.4s' }}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-slate-900">Progress Belajar</h3>
            <span className="text-sm font-medium text-primary-600">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-primary-600 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <p className="text-sm text-slate-600 mt-2">
            {progress.completedLessons} dari {progress.totalLessons} pelajaran telah diselesaikan
          </p>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-6">Modul Pembelajaran</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {learningModules.map((module, index) => {
              const completedIds = completedByModule[module.id] ?? [];
              const completedLessons = module.lessons.filter((lesson) => completedIds.includes(lesson.id)).length;
              const moduleProgress = Math.round((completedLessons / module.lessons.length) * 100);
              const progressClass = getModuleProgressClass(module.color);

              return (
                <Link
                  key={module.id}
                  to={`/module/${module.id}`}
                  className="card hover:-translate-y-0.5 transition-transform duration-300 slide-up"
                  style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                >
                  <div className="flex items-start space-x-4">
                    <div className="text-5xl flex-shrink-0">{module.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-xl font-bold text-slate-900 mb-2">{module.title}</h3>
                      <p className="text-slate-600 text-sm mb-4">{module.description}</p>

                      <div className="mb-3">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-600">
                            {completedLessons}/{module.lessons.length} pelajaran
                          </span>
                          <span className="text-xs font-medium text-primary-600">{moduleProgress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div
                            className={`${progressClass} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${moduleProgress}%` }}
                          ></div>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="text-sm text-slate-500">{module.lessons.length} pelajaran</span>
                        <span className="text-primary-700 font-medium text-sm">Mulai Belajar →</span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="card slide-up" style={{ animationDelay: '0.8s' }}>
          <h3 className="text-xl font-bold text-slate-900 mb-4">Aksi Cepat</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              to="/profile"
              className="flex items-start space-x-3 p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            >
              <span className="text-3xl">👤</span>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">Lihat Profil</p>
                <p className="text-sm text-slate-600">Kelola akun Anda</p>
              </div>
            </Link>

            <Link
              to="/profile"
              className="flex items-start space-x-3 p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            >
              <span className="text-3xl">🏆</span>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">Badge & Sertifikat</p>
                <p className="text-sm text-slate-600">Lihat pencapaian</p>
              </div>
            </Link>

            <Link
              to="/dashboard"
              className="flex items-start space-x-3 p-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
            >
              <span className="text-3xl">📊</span>
              <div className="min-w-0">
                <p className="font-semibold text-slate-900">Statistik</p>
                <p className="text-sm text-slate-600">Lihat progress detail</p>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
