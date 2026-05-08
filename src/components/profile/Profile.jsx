import { useState } from 'react';
import { Link } from 'react-router-dom';
import perempuanDesaImage from '../../assets/perempuan-desa.webp';

const Profile = ({ user }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const badges = [
    { id: 1, name: 'Pemula', icon: '🌱', description: 'Menyelesaikan modul pertama' },
    { id: 2, name: 'Ahli Kesehatan', icon: '🩺', description: 'Lulus modul Kesehatan Reproduksi' },
    { id: 3, name: 'Pengusaha Muda', icon: '💼', description: 'Lulus modul Kewirausahaan' },
    { id: 4, name: 'Bintang Belajar', icon: '⭐', description: 'Menyelesaikan 5 kuis' }
  ];

  const certificates = [
    { id: 1, module: 'Kesehatan Reproduksi', date: '2026-05-01', icon: '📜' },
    { id: 2, module: 'Kewirausahaan dan Ekonomi Kreatif', date: '2026-05-05', icon: '📜' }
  ];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Profile Header */}
        <div className="card mb-8 fade-in overflow-hidden p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <img
              src={perempuanDesaImage}
              alt="Foto profil perempuan desa"
              className="w-24 h-24 rounded-2xl object-cover border border-slate-200 flex-shrink-0"
            />
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
                {user?.name || 'Peserta'}
              </h1>
              <p className="text-slate-600 text-sm md:text-base mb-5">{user?.email}</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-5">
                <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
                  <span className="text-3xl">👑</span>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-slate-600">Total Poin</p>
                    <p className="text-2xl md:text-3xl font-bold text-primary-600 leading-tight">{user?.points || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-coral-200 bg-rose-50 px-4 py-3">
                  <span className="text-3xl">🏆</span>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-slate-600">Badge</p>
                    <p className="text-2xl md:text-3xl font-bold text-coral-500 leading-tight">{user?.badges?.length || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3">
                  <span className="text-3xl">📜</span>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm text-slate-600">Sertifikat</p>
                    <p className="text-2xl md:text-3xl font-bold text-teal-500 leading-tight">{user?.certificates?.length || 0}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 border-b border-slate-200 pb-2">
            {['overview', 'badges', 'certificates'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2.5 rounded-full font-medium border transition-colors ${
                  activeTab === tab
                    ? 'border-primary-500 bg-primary-50 text-primary-700'
                    : 'border-slate-200 text-slate-600 hover:text-slate-900 bg-white'
                }`}
              >
                {tab === 'overview' && 'Ringkasan'}
                {tab === 'badges' && 'Badge'}
                {tab === 'certificates' && 'Sertifikat'}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="space-y-6 slide-up">
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="card p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-600 mb-2">Modul Diselesaikan</p>
                    <p className="text-3xl md:text-4xl font-bold text-primary-600">2</p>
                  </div>
                  <span className="text-5xl md:text-6xl">📚</span>
                </div>
              </div>
              <div className="card p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-600 mb-2">Pelajaran Diselesaikan</p>
                    <p className="text-3xl md:text-4xl font-bold text-coral-500">6</p>
                  </div>
                  <span className="text-5xl md:text-6xl">✅</span>
                </div>
              </div>
              <div className="card p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs sm:text-sm text-slate-600 mb-2">Kuis Lulus</p>
                    <p className="text-3xl md:text-4xl font-bold text-teal-500">2</p>
                  </div>
                  <span className="text-5xl md:text-6xl">🎯</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card p-6 md:p-8">
              <h2 className="text-lg md:text-xl font-bold text-slate-900 mb-6">Aktivitas Terbaru</h2>
              <div className="space-y-5">
                <div className="flex items-start gap-4 pb-5 border-b border-slate-200 last:border-0 last:pb-0">
                  <span className="text-4xl flex-shrink-0">🎉</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm md:text-base">Lulus Kuis Kewirausahaan</p>
                    <p className="text-xs md:text-sm text-slate-600 mt-1">5 Mei 2026</p>
                  </div>
                  <span className="text-primary-600 font-bold text-sm md:text-base whitespace-nowrap ml-2">+50 Poin</span>
                </div>
                <div className="flex items-start gap-4 pb-5 border-b border-slate-200 last:border-0 last:pb-0">
                  <span className="text-4xl flex-shrink-0">✅</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm md:text-base">Menyelesaikan Pelajaran</p>
                    <p className="text-xs md:text-sm text-slate-600 mt-1">3 Mei 2026</p>
                  </div>
                  <span className="text-primary-600 font-bold text-sm md:text-base whitespace-nowrap ml-2">+10 Poin</span>
                </div>
                <div className="flex items-start gap-4">
                  <span className="text-4xl flex-shrink-0">🏆</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-900 text-sm md:text-base">Mendapat Badge Baru</p>
                    <p className="text-xs md:text-sm text-slate-600 mt-1">1 Mei 2026</p>
                  </div>
                  <span className="text-primary-600 font-bold text-sm md:text-base whitespace-nowrap ml-2">+25 Poin</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'badges' && (
          <div className="slide-up">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              {badges.map(badge => (
                <div key={badge.id} className="card p-6 md:p-7 hover:shadow-lg transition-shadow">
                  <div className="flex items-start gap-4">
                    <span className="text-6xl flex-shrink-0">{badge.icon}</span>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                        {badge.name}
                      </h3>
                      <p className="text-sm text-slate-600 leading-relaxed">
                        {badge.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'certificates' && (
          <div className="slide-up">
            <div className="space-y-5">
              {certificates.map(cert => (
                <div key={cert.id} className="card p-6 md:p-7">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
                    <div className="flex items-center gap-4">
                      <span className="text-5xl flex-shrink-0">{cert.icon}</span>
                      <div className="min-w-0">
                        <h3 className="text-base md:text-lg font-bold text-slate-900 leading-snug">
                          {cert.module}
                        </h3>
                        <p className="text-xs md:text-sm text-slate-600 mt-1">
                          Diterbitkan: {new Date(cert.date).toLocaleDateString('id-ID')}
                        </p>
                      </div>
                    </div>
                    <button className="btn-primary text-sm md:text-base px-5 py-2 md:py-3 whitespace-nowrap">
                      Unduh
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
          <Link to="/dashboard" className="btn-outline text-center">
            Kembali ke Dashboard
          </Link>
          <button className="btn-primary">
            Edit Profil
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;