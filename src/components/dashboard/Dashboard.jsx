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
    <div className="min-h-screen bg-slate-50 py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10 text-left">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-200/50 px-3 py-1 text-xs font-semibold text-slate-600 uppercase tracking-wide mb-4">
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard Belajar
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Selamat Datang, <span className="text-teal-600">{user?.name || 'Peserta'}!</span> 👋
          </h1>
          <p className="text-slate-500 text-lg">Mari lanjutkan perjalanan belajarmu hari ini.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-slate-500">Total Poin</p>
              <div className="p-2 bg-amber-50 rounded-lg">
                <Crown className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900">{user?.points || 0}</h3>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-slate-500">Modul Selesai</p>
              <div className="p-2 bg-blue-50 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <h3 className="text-3xl font-bold text-slate-900">{progress.completedModules}</h3>
              <span className="text-sm font-medium text-slate-400">/ {progress.totalModules}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-slate-500">Pelajaran Selesai</p>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <h3 className="text-3xl font-bold text-slate-900">{progress.completedLessons}</h3>
              <span className="text-sm font-medium text-slate-400">/ {progress.totalLessons}</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-medium text-slate-500">Badge Didapat</p>
              <div className="p-2 bg-rose-50 rounded-lg">
                <Award className="w-5 h-5 text-rose-500" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900">{user?.badges?.length || 0}</h3>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Main Activity Area */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Progress Section */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="w-5 h-5 text-teal-600" />
                <h2 className="text-lg font-bold text-slate-900">Progress Belajar Keseluruhan</h2>
              </div>
              
              <div className="flex justify-between items-end mb-2">
                <span className="text-sm font-medium text-slate-500">
                  {progress.completedLessons} dari {progress.totalLessons} pelajaran telah diselesaikan
                </span>
                <span className="text-lg font-bold text-teal-600">{progressPercentage}%</span>
              </div>
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-teal-500 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>

            {/* Modul Pembelajaran */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-teal-600" />
                  <h2 className="text-lg font-bold text-slate-900">Modul Pembelajaran</h2>
                </div>
              </div>

              {modules.length > 0 ? (
                <div className="space-y-4">
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
                        className="flex flex-col sm:flex-row items-start gap-4 p-4 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50/30 transition-all group"
                      >
                        <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center text-3xl shrink-0 group-hover:scale-105 transition-transform">
                          {module.icon}
                        </div>
                        <div className="flex-1 min-w-0 w-full">
                          <h3 className="font-bold text-slate-900 mb-1 group-hover:text-teal-700 transition-colors">{module.title}</h3>
                          <p className="text-slate-500 text-sm mb-3 line-clamp-2">{module.description}</p>
                          <div className="flex items-center justify-between mb-1.5">
                            <span className="text-xs text-slate-500">{completedLessons}/{module.lessons.length} pelajaran</span>
                            <span className="text-xs font-bold text-teal-600">{moduleProgress}%</span>
                          </div>
                          <div className="w-full bg-slate-100 rounded-full h-1.5">
                            <div
                              className="bg-teal-500 h-1.5 rounded-full transition-all duration-500"
                              style={{ width: `${moduleProgress}%` }}
                            />
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-slate-50/50">
                  <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-slate-300">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum ada modul tersedia</h3>
                  <p className="text-slate-500 max-w-sm mb-6 text-sm">
                    Kamu belum mendaftar ke modul apapun. Mulai jelajahi katalog untuk menemukan materi yang cocok untukmu.
                  </p>
                  <a href="/#modul" className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-full font-medium shadow-sm transition-all hover:shadow-md">
                    Cari Modul Sekarang
                  </a>
                </div>
              )}
            </div>

            {/* Extra materials from admin */}
            {materials.length > 0 && (
              <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
                <div className="flex items-center gap-2 mb-6">
                  <Star className="w-5 h-5 text-amber-500" />
                  <h2 className="text-lg font-bold text-slate-900">Materi Tambahan dari Admin</h2>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {materials.slice(0, 6).map((material) => (
                    <div key={material.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="font-bold text-slate-900">{material.title}</h3>
                        <span className="text-[10px] rounded-full bg-amber-100 text-amber-700 border border-amber-200 px-2 py-0.5 whitespace-nowrap shrink-0">
                          {material.duration || '10 menit'}
                        </span>
                      </div>
                      <p className="text-sm text-slate-700 line-clamp-3">{material.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
          </div>

          {/* RIGHT COLUMN: Sidebar (Aksi Cepat) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Zap className="w-5 h-5 text-teal-600" />
                Aksi Cepat
              </h2>
              
              <div className="space-y-3">
                <Link
                  to="/profile"
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50 group transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-teal-100/50 transition-colors text-slate-500 group-hover:text-teal-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">Lihat Profil</h4>
                      <p className="text-xs text-slate-500">Kelola akun Anda</p>
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover:text-teal-500 transition-colors">→</span>
                </Link>

                <Link
                  to="/profile"
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-amber-200 hover:bg-amber-50 group transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-amber-100/50 transition-colors text-slate-500 group-hover:text-amber-600">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm group-hover:text-amber-700 transition-colors">Badge & Sertifikat</h4>
                      <p className="text-xs text-slate-500">Lihat pencapaian</p>
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover:text-amber-500 transition-colors">→</span>
                </Link>

                <Link
                  to="/dashboard"
                  className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50 group transition-all text-left"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-blue-100/50 transition-colors text-slate-500 group-hover:text-blue-600">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">Statistik Detail</h4>
                      <p className="text-xs text-slate-500">Lihat progress detail</p>
                    </div>
                  </div>
                  <span className="text-slate-300 group-hover:text-blue-500 transition-colors">→</span>
                </Link>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
