import { Link } from 'react-router-dom';
import perempuanDesaImage from '../../assets/perempuan-desa.webp';

const LandingPage = () => {
  return (
    <div className="min-h-screen text-slate-900">
      {/* Hero Section */}
      <section className="px-4 sm:px-6 lg:px-8 pt-12 md:pt-20 pb-20 md:pb-24">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start md:items-center">
            <div className="fade-in">
              <span className="inline-flex items-center rounded-full border border-teal-200 bg-teal-50 text-teal-700 text-xs md:text-sm font-semibold px-3 py-1 mb-5">
                Program Belajar Perempuan Desa
              </span>
              <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight mb-6">
                Belajar Praktis.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-primary-700">
                  Tumbuh Mandiri.
                </span>
              </h1>
              <p className="text-base md:text-xl text-slate-600 max-w-xl mb-8">
                Platform pembelajaran digital untuk meningkatkan keterampilan, pengetahuan, dan kemandirian ekonomi perempuan di pedesaan Indonesia.
              </p>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <Link to="/register" className="btn-primary text-base md:text-lg px-7 py-3.5">
                  Mulai Belajar Sekarang
                </Link>
                <Link to="/login" className="btn-outline text-base md:text-lg px-7 py-3.5">
                  Saya Sudah Punya Akun
                </Link>
              </div>
            </div>

            <div className="slide-up">
              <div className="card-gradient p-5 sm:p-6 md:p-8 overflow-hidden">
                <div className="flex items-center justify-between border-b border-slate-200 pb-4 mb-5">
                  <p className="font-semibold text-slate-800 text-base">Ringkasan Komunitas</p>
                  <img
                    src={perempuanDesaImage}
                    alt="Profil perempuan desa"
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 flex-shrink-0"
                  />
                </div>
                <div className="rounded-2xl overflow-hidden border border-slate-100 bg-white mb-6">
                  <img
                    src={perempuanDesaImage}
                    alt="Ilustrasi perempuan desa Indonesia"
                    className="block w-full aspect-[16/10] md:aspect-[16/9] object-cover object-top"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-5">
                  <div className="rounded-xl bg-white p-4 sm:p-5 border border-slate-100">
                    <p className="text-2xl sm:text-3xl font-extrabold text-teal-600 leading-tight">500+</p>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2">Pengguna Aktif</p>
                  </div>
                  <div className="rounded-xl bg-white p-4 sm:p-5 border border-slate-100">
                    <p className="text-2xl sm:text-3xl font-extrabold text-primary-600 leading-tight">25+</p>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2">Modul Belajar</p>
                  </div>
                  <div className="rounded-xl bg-white p-4 sm:p-5 border border-slate-100">
                    <p className="text-2xl sm:text-3xl font-extrabold text-coral-500 leading-tight">100+</p>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2">Kuis Interaktif</p>
                  </div>
                  <div className="rounded-xl bg-white p-4 sm:p-5 border border-slate-100">
                    <p className="text-2xl sm:text-3xl font-extrabold text-yellow-500 leading-tight">50+</p>
                    <p className="text-xs sm:text-sm text-slate-600 mt-2">Sertifikat</p>
                  </div>
                </div>
                <div className="rounded-xl bg-slate-900 text-slate-100 p-5 sm:p-6">
                  <p className="text-sm font-semibold mb-2">Update Mingguan</p>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">Topik baru: Strategi UMKM, Literasi Finansial Keluarga, dan Kesehatan Reproduksi.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">
              Mengapa Perempuan Desa?
            </h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Platform kami dirancang khusus untuk memenuhi kebutuhan pembelajaran perempuan desa dengan fitur-fitur modern dan mendukung.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            <div className="card text-center flex flex-col h-full p-6 md:p-7">
              <div className="text-5xl md:text-6xl mb-5 leading-none">📚</div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">Pembelajaran Interaktif</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed flex-grow">
                Materi pembelajaran yang disajikan dengan cara yang mudah dipahami dan interaktif.
              </p>
            </div>

            <div className="card text-center flex flex-col h-full p-6 md:p-7">
              <div className="text-5xl md:text-6xl mb-5 leading-none">🧠</div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">Kuis & Evaluasi</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed flex-grow">
                Kuis interaktif untuk menguji pemahaman dan memperkuat materi yang telah dipelajari.
              </p>
            </div>

            <div className="card text-center flex flex-col h-full p-6 md:p-7">
              <div className="text-5xl md:text-6xl mb-5 leading-none">🎮</div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">Gamifikasi</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed flex-grow">
                Dapatkan poin, badge, dan penghargaan untuk setiap pencapaian belajar Anda.
              </p>
            </div>

            <div className="card text-center flex flex-col h-full p-6 md:p-7">
              <div className="text-5xl md:text-6xl mb-5 leading-none">🏆</div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">Sertifikat Digital</h3>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed flex-grow">
                Dapatkan sertifikat digital setelah menyelesaikan modul dan kuis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">
              Modul Pembelajaran
            </h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Pilih modul yang sesuai dengan minat dan kebutuhan Anda untuk mulai belajar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            <div className="card-gradient p-6 md:p-8">
              <div className="flex items-start gap-4 md:gap-5">
                <div className="text-5xl md:text-6xl shrink-0 leading-none">💼</div>
                <div className="min-w-0">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 leading-snug">
                    Kewirausahaan & Ekonomi Kreatif
                  </h3>
                  <p className="text-slate-600 mb-4 text-sm md:text-base leading-relaxed">
                    Pelajari dasar-dasar kewirausahaan, manajemen keuangan, dan pemasaran produk lokal.
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs md:text-sm text-slate-600">
                    <span>3 Pelajaran</span>
                    <span>•</span>
                    <span>15 Menit</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="card-gradient p-6 md:p-8">
              <div className="flex items-start gap-4 md:gap-5">
                <div className="text-5xl md:text-6xl shrink-0 leading-none">🩺</div>
                <div className="min-w-0">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 leading-snug">
                    Kesehatan Reproduksi
                  </h3>
                  <p className="text-slate-600 mb-4 text-sm md:text-base leading-relaxed">
                    Pahami pentingnya kesehatan reproduksi, siklus menstruasi, dan pencegahan penyakit.
                  </p>
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs md:text-sm text-slate-600">
                    <span>3 Pelajaran</span>
                    <span>•</span>
                    <span>20 Menit</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">
              Apa Kata Mereka?
            </h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Dapatkan inspirasi dari perempuan desa lain yang telah berhasil melalui platform kami.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            <div className="card p-6 md:p-7">
              <div className="flex items-center gap-0.5 mb-5">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className="text-yellow-400 text-lg md:text-xl">★</span>
                ))}
              </div>
              <p className="text-slate-600 mb-5 italic text-sm md:text-base leading-relaxed">
                "Platform ini sangat membantu saya memahami kesehatan reproduksi. Materinya mudah dipahami!"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={perempuanDesaImage}
                  alt="Foto profil peserta"
                  className="w-11 h-11 rounded-full object-cover border border-slate-200 flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">Siti Aminah</p>
                  <p className="text-xs text-slate-600">Pengusaha Kerajinan</p>
                </div>
              </div>
            </div>

            <div className="card p-6 md:p-7">
              <div className="flex items-center gap-0.5 mb-5">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className="text-yellow-400 text-lg md:text-xl">★</span>
                ))}
              </div>
              <p className="text-slate-600 mb-5 italic text-sm md:text-base leading-relaxed">
                "Dari modul kewirausahaan, saya bisa memulai usaha kecil-kecilan. Sekarang penghasilan saya bertambah!"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={perempuanDesaImage}
                  alt="Foto profil peserta"
                  className="w-11 h-11 rounded-full object-cover border border-slate-200 flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">Maya Wati</p>
                  <p className="text-xs text-slate-600">Ibu Rumah Tangga</p>
                </div>
              </div>
            </div>

            <div className="card p-6 md:p-7">
              <div className="flex items-center gap-0.5 mb-5">
                {[1, 2, 3, 4, 5].map(star => (
                  <span key={star} className="text-yellow-400 text-lg md:text-xl">★</span>
                ))}
              </div>
              <p className="text-slate-600 mb-5 italic text-sm md:text-base leading-relaxed">
                "Gamifikasi membuat belajar jadi lebih menyenangkan. Badge dan poin jadi motivasi saya!"
              </p>
              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <img
                  src={perempuanDesaImage}
                  alt="Foto profil peserta"
                  className="w-11 h-11 rounded-full object-cover border border-slate-200 flex-shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-slate-900 text-sm">Rina Dewi</p>
                  <p className="text-xs text-slate-600">Pengelola UMKM</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="rounded-3xl bg-slate-900 px-6 sm:px-8 md:px-12 py-12 md:py-16 border border-slate-800">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6 leading-snug">
            Siap untuk Memulai Perjalanan Belajar Anda?
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-slate-300 mb-8 md:mb-10 leading-relaxed">
            Bergabunglah dengan ribuan perempuan desa yang sedang meningkatkan diri bersama kami.
            </p>
            <Link to="/register" className="btn-primary text-base md:text-lg px-7 md:px-8 py-3 md:py-4 inline-block">
              Daftar Sekarang - Gratis!
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;