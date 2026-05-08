import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { buildAllModules } from '../../utils/moduleHelpers';

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
  const [materials, setMaterials] = useState([]);
  const [modules, setModules] = useState([]);
  const completedByModule = getStoredProgress();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [materialsSnapshot, loadedModules] = await Promise.all([
          getDocs(query(collection(db, 'materials'), orderBy('createdAt', 'desc'))),
          buildAllModules()
        ]);
        setMaterials(materialsSnapshot.docs.map((item) => ({ id: item.id, ...item.data() })));
        setModules(loadedModules);
      } catch {
        setMaterials([]);
        setModules([]);
      }
    };

    loadData();
  }, []);

  const progress = modules.reduce(
    (acc, module) => {
      const completedIds = completedByModule[module.routeId] ?? [];
      const moduleCompletedLessons = module.lessons.filter((lesson) => completedIds.includes(lesson.id)).length;

      acc.totalLessons += module.lessons.length;
      acc.completedLessons += moduleCompletedLessons;

      if (moduleCompletedLessons === module.lessons.length) {
        acc.completedModules += 1;
      }

      return acc;
    },
    {
      totalModules: modules.length,
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
            {modules.map((module, index) => {
              const completedIds = completedByModule[module.routeId] ?? [];
              const completedLessons = module.lessons.filter((lesson) => completedIds.includes(lesson.id)).length;
              const moduleProgress = module.lessons.length > 0
                ? Math.round((completedLessons / module.lessons.length) * 100)
                : 0;
              const progressClass = getModuleProgressClass(module.color);

              return (
                <Link
                  key={module.routeId}
                  to={`/module/${module.routeId}`}
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

            {modules.length === 0 && (
              <div className="card">
                <p className="text-slate-600">Belum ada modul tersedia saat ini.</p>
              </div>
            )}
          </div>
        </div>

        {materials.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Materi Tambahan dari Admin</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {materials.slice(0, 6).map((material) => (
                <div key={material.id} className="card">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-lg font-bold text-slate-900 leading-snug">{material.title}</h3>
                    <span className="text-xs rounded-full bg-teal-50 text-teal-700 border border-teal-200 px-2 py-1 whitespace-nowrap">
                      {material.duration || '10 menit'}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm mb-4">{material.description}</p>
                  <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                    <p className="text-sm text-slate-700 line-clamp-4">{material.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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
