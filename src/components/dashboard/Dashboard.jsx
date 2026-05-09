import React from 'react';
import {
  Crown,
  BookOpen,
  CheckCircle2,
  Award,
  TrendingUp,
  User,
  ShieldCheck,
  Search,
  LayoutDashboard,
  LogOut,
  ChevronRight
} from 'lucide-react';

export default function DashboardUser() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-teal-200 selection:text-teal-900">

      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-white">
                <User className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg tracking-tight text-slate-800">
                Perempuan<span className="text-teal-600">Desa</span>
              </span>
            </div>

            {/* Desktop Menu */}
            <div className="hidden md:flex items-center gap-6">
              <a href="#" className="text-sm font-medium text-teal-600 border-b-2 border-teal-600 py-5">Dashboard</a>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Modul</a>
              <a href="#" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">Testimoni</a>
            </div>

            {/* User Profile & Points */}
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200/50">
                <Crown className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span className="text-sm font-bold text-amber-700">0 Poin</span>
              </div>
              <button className="text-sm font-medium text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1.5">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Keluar</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* Header Section */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200/50 text-slate-600 text-xs font-semibold tracking-wide uppercase mb-4">
            <LayoutDashboard className="w-3.5 h-3.5" />
            Dashboard Belajar
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-2 tracking-tight">
            Selamat Datang, <span className="text-teal-600">pnf!</span> 👋
          </h1>
          <p className="text-slate-500 text-lg">Mari lanjutkan perjalanan belajarmu hari ini.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {/* Stat Card 1 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm font-medium text-slate-500">Total Poin</p>
              <div className="p-2 bg-amber-50 rounded-lg">
                <Crown className="w-5 h-5 text-amber-500" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900">0</h3>
          </div>

          {/* Stat Card 2 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm font-medium text-slate-500">Modul Selesai</p>
              <div className="p-2 bg-blue-50 rounded-lg">
                <BookOpen className="w-5 h-5 text-blue-500" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <h3 className="text-3xl font-bold text-slate-900">0</h3>
              <span className="text-sm font-medium text-slate-400">/ 0</span>
            </div>
          </div>

          {/* Stat Card 3 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm font-medium text-slate-500">Pelajaran Selesai</p>
              <div className="p-2 bg-emerald-50 rounded-lg">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
            </div>
            <div className="flex items-baseline gap-1">
              <h3 className="text-3xl font-bold text-slate-900">0</h3>
              <span className="text-sm font-medium text-slate-400">/ 0</span>
            </div>
          </div>

          {/* Stat Card 4 */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm font-medium text-slate-500">Badge Didapat</p>
              <div className="p-2 bg-rose-50 rounded-lg">
                <Award className="w-5 h-5 text-rose-500" />
              </div>
            </div>
            <h3 className="text-3xl font-bold text-slate-900">0</h3>
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
                <span className="text-sm font-medium text-slate-500">0 dari 0 pelajaran telah diselesaikan</span>
                <span className="text-lg font-bold text-teal-600">0%</span>
              </div>
              {/* Progress Bar */}
              <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-teal-500 rounded-full w-[0%] transition-all duration-500 ease-out"></div>
              </div>
            </div>

            {/* Modul Pembelajaran (Empty State) */}
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-100">
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-teal-600" />
                  <h2 className="text-lg font-bold text-slate-900">Modul Pembelajaran</h2>
                </div>
              </div>

              {/* Empty State UI */}
              <div className="border-2 border-dashed border-slate-200 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-slate-50/50">
                <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mb-4 text-slate-300">
                  <BookOpen className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">Belum ada modul tersedia</h3>
                <p className="text-slate-500 max-w-sm mb-6 text-sm">
                  Kamu belum mendaftar ke modul apapun. Mulai jelajahi katalog untuk menemukan materi yang cocok untukmu.
                </p>
                <button className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-6 py-2.5 rounded-full font-medium shadow-sm transition-all hover:shadow-md">
                  <Search className="w-4 h-4" />
                  Cari Modul Sekarang
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Sidebar (Aksi Cepat) */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 sticky top-24">
              <h2 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-teal-600" />
                Aksi Cepat
              </h2>

              <div className="space-y-3">
                {/* Action Link 1 */}
                <button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50 group transition-all text-left">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-teal-100/50 transition-colors text-slate-500 group-hover:text-teal-600">
                      <User className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">Lihat Profil</h4>
                      <p className="text-xs text-slate-500">Kelola akun Anda</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 transition-colors" />
                </button>

                {/* Action Link 2 */}
                <button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50 group transition-all text-left">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-teal-100/50 transition-colors text-slate-500 group-hover:text-teal-600">
                      <Award className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">Badge & Sertifikat</h4>
                      <p className="text-xs text-slate-500">Lihat pencapaian</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 transition-colors" />
                </button>

                {/* Action Link 3 */}
                <button className="w-full flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50 group transition-all text-left">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-teal-100/50 transition-colors text-slate-500 group-hover:text-teal-600">
                      <TrendingUp className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900 text-sm group-hover:text-teal-700 transition-colors">Statistik Detail</h4>
                      <p className="text-xs text-slate-500">Lihat progress detail</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-teal-500 transition-colors" />
                </button>
              </div>

            </div>
          </div>

        </div>
      </main>

    </div>
  );
}
