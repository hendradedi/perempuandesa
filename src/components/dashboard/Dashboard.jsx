import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { buildAllModules } from '../../utils/moduleHelpers';
import { Award, BookOpen, CheckCircle2, Crown, LayoutDashboard, Star, TrendingUp, User, Zap } from 'lucide-react';

const LESSON_PROGRESS_KEY = 'lessonProgressByModule';

const getStoredProgress = () => {
  const storedValue = localStorage.getItem(LESSON_PROGRESS_KEY);
  if (!storedValue) return {};
  try { return JSON.parse(storedValue); } catch { return {}; }
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
      if (moduleCompletedLessons === module.lessons.length && module.lessons.length > 0) acc.completedModules += 1;
      return acc;
    },
    { totalModules: modules.length, completedModules: 0, totalLessons: 0, completedLessons: 0 }
  );

  const progressPercentage = progress.totalLessons > 0
    ? Math.round((progress.completedLessons / progress.totalLessons) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-[#f8fafc] py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-10 text-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-teal-50 border border-teal-200 px-4 py-1.5 text-sm font-semibold text-teal-700 mb-4">
            <LayoutDashboard className="w-4 h-4" />
            Dashboard Belajar
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
            Selamat Datang, <span className="text-teal-600">{user?.name || 'Peserta'}</span>! ðŸ‘‹
          </h1>
          <p className="text-slate-500 text-base">Mari lanjutkan perjalanan belajarmu hari ini</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 md:gap-5 mb-8">
          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-500">Total Poin</p>
              <span className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
                <Crown className="w-4.5 h-4.5 text-amber-500" />
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{user?.points || 0}</p>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-500">Modul Selesai</p>
              <span className="w-9 h-9 rounded-xl bg-teal-50 flex items-center justify-center">
                <BookOpen className="w-4.5 h-4.5 text-teal-600" />
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {progress.completedModules}<span className="text-lg text-slate-400">/{progress.totalModules}</span>
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-500">Pelajaran Selesai</p>
              <span className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-4.5 h-4.5 text-emerald-600" />
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">
              {progress.completedLessons}<span className="text-lg text-slate-400">/{progress.totalLessons}</span>
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-medium text-slate-500">Badge</p>
              <span className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center">
                <Award className="w-4.5 h-4.5 text-rose-500" />
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{user?.badges?.length || 0}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-teal-600" />
              <h3 className="text-base font-semibold text-slate-900">Progress Belajar Keseluruhan</h3>
            </div>
            <span className="text-sm font-bold text-teal-600 bg-teal-50 border border-teal-200 rounded-full px-3 py-1">
              {progressPercentage}%
            </span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden mb-2">
            <div
              className="bg-gradient-to-r from-teal-500 to-emerald-400 h-3 rounded-full transition-all duration-700"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-sm text-slate-500">
            {progress.completedLessons} dari {progress.totalLessons} pelajaran telah diselesaikan
          </p>
        </div>

        {/* Modules */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-5">
            <BookOpen className="w-5 h-5 text-teal-600" />
            <h2 className="text-xl font-bold text-slate-900">Modul Pembelajaran</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {modules.map((module) => {
              const completedIds = completedByModule[module.routeId] ?? [];
              const completedLessons = module.lessons.filter((lesson) => completedIds.includes(lesson.id)).length;
              const moduleProgress = module.lessons.length > 0
                ? Math.round((completedLessons / module.lessons.length) * 100)
                : 0;
              return (
                <Link
                  key={module.routeId}
                  to={`/module/${module.routeId}`}
                  className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl flex-shrink-0">{module.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-slate-900 mb-1">{module.title}</h3>
                      <p className="text-slate-500 text-sm mb-4 leading-relaxed">{module.description}</p>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs text-slate-500">{completedLessons}/{module.lessons.length} pelajaran</span>
                        <span className="text-xs font-bold text-teal-600">{moduleProgress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-teal-500 to-emerald-400 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${moduleProgress}%` }}
                        />
                      </div>
                      <p className="text-teal-600 font-semibold text-xs mt-3">Mulai Belajar â†’</p>
                    </div>
                  </div>
                </Link>
              );
            })}
            {modules.length === 0 && (
              <div className="rounded-2xl bg-white border border-dashed border-slate-300 p-8 text-center col-span-2">
                <BookOpen className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">Belum ada modul tersedia saat ini.</p>
              </div>
            )}
          </div>
        </div>

        {/* Extra materials from admin */}
        {materials.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-5">
              <Star className="w-5 h-5 text-amber-500" />
              <h2 className="text-xl font-bold text-slate-900">Materi Tambahan dari Admin</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {materials.slice(0, 6).map((material) => (
                <div key={material.id} className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <h3 className="text-base font-bold text-slate-900 leading-snug">{material.title}</h3>
                    <span className="text-xs rounded-full bg-teal-50 text-teal-700 border border-teal-200 px-3 py-1 whitespace-nowrap shrink-0">
                      {material.duration || '10 menit'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm mb-4">{material.description}</p>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <p className="text-sm text-slate-700 line-clamp-4">{material.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Zap className="w-5 h-5 text-teal-600" />
            <h3 className="text-base font-bold text-slate-900">Aksi Cepat</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/profile"
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/40 transition-colors group"
            >
              <span className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-teal-100 flex items-center justify-center transition-colors">
                <User className="w-5 h-5 text-slate-600 group-hover:text-teal-600" />
              </span>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Lihat Profil</p>
                <p className="text-xs text-slate-500">Kelola akun Anda</p>
              </div>
            </Link>

            <Link
              to="/profile"
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-amber-300 hover:bg-amber-50/40 transition-colors group"
            >
              <span className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-amber-100 flex items-center justify-center transition-colors">
                <Award className="w-5 h-5 text-slate-600 group-hover:text-amber-600" />
              </span>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Badge & Sertifikat</p>
                <p className="text-xs text-slate-500">Lihat pencapaian</p>
              </div>
            </Link>

            <Link
              to="/dashboard"
              className="flex items-center gap-4 p-4 rounded-xl border border-slate-200 hover:border-emerald-300 hover:bg-emerald-50/40 transition-colors group"
            >
              <span className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-emerald-100 flex items-center justify-center transition-colors">
                <TrendingUp className="w-5 h-5 text-slate-600 group-hover:text-emerald-600" />
              </span>
              <div>
                <p className="font-semibold text-slate-900 text-sm">Statistik</p>
                <p className="text-xs text-slate-500">Lihat progress detail</p>
              </div>
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
