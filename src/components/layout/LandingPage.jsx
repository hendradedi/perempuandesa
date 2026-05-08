import { Link } from 'react-router-dom';
import perempuanDesaImage from '../../assets/perempuan-desa.webp';
import { ArrowRight, CheckCircle2, CirclePlay, GraduationCap, HeartPulse, Rocket, Sparkles, Star, Wallet } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <section className="relative overflow-hidden pt-16 md:pt-20 pb-16 md:pb-24">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-[420px] bg-gradient-to-b from-cyan-50 to-transparent" />
          <div className="absolute -top-10 left-0 h-72 w-72 rounded-full bg-emerald-200/35 blur-3xl" />
          <div className="absolute top-10 right-0 h-80 w-80 rounded-full bg-sky-200/35 blur-3xl" />
        </div>

        <div className="site-container grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="text-left">
            <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 border border-emerald-200 px-4 py-1.5 text-sm font-semibold text-emerald-800 mb-6">
              <Sparkles className="w-4 h-4" />
              Program Belajar Perempuan Desa 2026
            </span>

            <h1 className="text-4xl md:text-5xl xl:text-6xl font-bold leading-tight tracking-tight text-slate-900 mb-5">
              Belajar Cerdas,
              <br />
              <span className="text-teal-600">Tumbuh Mandiri</span>
            </h1>

            <p className="text-base md:text-lg text-slate-600 leading-relaxed max-w-xl mb-8">
              Platform pembelajaran digital yang membantu perempuan desa meningkatkan keterampilan, kepercayaan diri, dan kemandirian ekonomi keluarga.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 my-8">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white px-7 py-3 text-sm md:text-base font-semibold transition-all hover:-translate-y-0.5"
              >
                Mulai Belajar
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 bg-white text-slate-700 hover:border-teal-500 hover:text-teal-600 px-7 py-3 text-sm md:text-base font-semibold transition-colors"
              >
                <CirclePlay className="w-4 h-4" />
                Saya Sudah Punya Akun
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="rounded-[28px] border border-slate-200 bg-white p-4 md:p-6 shadow-xl shadow-slate-300/30">
              <img
                src={perempuanDesaImage}
                alt="Ilustrasi perempuan desa"
                className="w-full h-72 md:h-96 rounded-2xl object-cover object-top"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="site-container">
          <div className="rounded-2xl bg-white border border-slate-200 p-8 md:p-10 shadow-sm">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 md:gap-8">
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-teal-700 mb-2">750+</p>
                <p className="text-sm md:text-base text-slate-600 font-medium">Pengguna Aktif</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-cyan-700 mb-2">30+</p>
                <p className="text-sm md:text-base text-slate-600 font-medium">Modul Belajar</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-emerald-700 mb-2">140+</p>
                <p className="text-sm md:text-base text-slate-600 font-medium">Kuis Interaktif</p>
              </div>
              <div className="text-center">
                <p className="text-3xl md:text-4xl font-bold text-amber-700 mb-2">85+</p>
                <p className="text-sm md:text-base text-slate-600 font-medium">Sertifikat</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="tentang" className="section-pad scroll-mt-24">
        <div className="site-container">
          <div className="text-center mb-12 md:mb-14">
            <h2 className="section-title !mb-3">Mengapa Perempuan Desa?</h2>
            <div className="flex justify-center">
              <p className="max-w-2xl text-base md:text-lg text-slate-600 leading-relaxed">
                Dirancang dengan pendekatan praktis, hangat, dan relevan dengan kebutuhan perempuan di pedesaan Indonesia.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
            <article className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-cyan-50 text-cyan-700 flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Pembelajaran Interaktif</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Materi dibagi ringkas dengan alur yang mudah diikuti dari dasar hingga praktik.
              </p>
            </article>

            <article className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <Rocket className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Kuis & Evaluasi</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Uji pemahaman secara berkala agar pembelajaran benar-benar membentuk kebiasaan.
              </p>
            </article>

            <article className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-4">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Gamifikasi Motivatif</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Kumpulkan poin dan lencana sebagai dorongan untuk terus naik level.
              </p>
            </article>

            <article className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Sertifikat Digital</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Setiap pencapaian dapat didokumentasikan dan dipakai untuk pengembangan diri.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section id="modul" className="section-pad scroll-mt-24">
        <div className="site-container">
          <div className="text-center mb-12 md:mb-14">
            <h2 className="section-title !mb-3">Modul Unggulan</h2>
            <div className="flex justify-center">
              <p className="max-w-2xl text-base md:text-lg text-slate-600 leading-relaxed">
                Materi belajar pilihan untuk membantu perempuan desa lebih siap secara ekonomi dan kesehatan.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <article className="rounded-3xl bg-white border border-slate-200 p-7 md:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <Wallet className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Kewirausahaan & Ekonomi Kreatif</h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4">
                    Belajar menyusun usaha rumahan, mengelola keuangan sederhana, dan memasarkan produk lokal.
                  </p>
                  <p className="text-sm text-slate-500">3 Pelajaran • 15 Menit • Praktik langsung</p>
                </div>
              </div>
            </article>

            <article className="rounded-3xl bg-white border border-slate-200 p-7 md:p-8 shadow-sm">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-cyan-100 text-cyan-700 flex items-center justify-center shrink-0">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-2">Kesehatan Reproduksi</h3>
                  <p className="text-slate-600 text-sm md:text-base leading-relaxed mb-4">
                    Pahami siklus tubuh, kebersihan reproduksi, dan langkah pencegahan masalah kesehatan dasar.
                  </p>
                  <p className="text-sm text-slate-500">3 Pelajaran • 20 Menit • Bahasa sederhana</p>
                </div>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section id="testimoni" className="section-pad scroll-mt-24">
        <div className="site-container">
          <div className="text-center mb-12 md:mb-14">
            <h2 className="section-title !mb-3">Cerita Dari Peserta</h2>
            <div className="flex justify-center">
              <p className="max-w-2xl text-base md:text-lg text-slate-600 leading-relaxed">
                Perubahan kecil yang konsisten dapat membawa dampak besar bagi keluarga dan komunitas.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[{
              quote: 'Platform ini membantu saya memahami kesehatan reproduksi dengan penjelasan yang sederhana.',
              name: 'Siti Aminah',
              role: 'Pengusaha Kerajinan'
            }, {
              quote: 'Setelah ikut modul kewirausahaan, saya berani mulai usaha kecil dari rumah.',
              name: 'Maya Wati',
              role: 'Ibu Rumah Tangga'
            }, {
              quote: 'Sistem poin dan lencana bikin saya semangat belajar rutin setiap minggu.',
              name: 'Rina Dewi',
              role: 'Pengelola UMKM'
            }].map((item) => (
              <article key={item.name} className="rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
                <div className="flex items-center gap-1 mb-4 text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star key={star} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-slate-600 text-sm md:text-base leading-relaxed italic mb-6">&ldquo;{item.quote}&rdquo;</p>
                <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                  <img src={perempuanDesaImage} alt={item.name} className="w-11 h-11 rounded-full object-cover border border-slate-200" />
                  <div>
                    <p className="text-sm font-semibold text-slate-900">{item.name}</p>
                    <p className="text-xs text-slate-500">{item.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="site-container">
          <div className="rounded-3xl bg-slate-900 border border-slate-800 px-6 md:px-10 py-12 md:py-16 text-center">
            <h2 className="text-2xl md:text-4xl font-bold text-white mb-4">Siap memulai perjalanan belajar Anda?</h2>
            <p className="text-slate-300 text-sm md:text-lg mb-8 max-w-2xl mx-auto">
              Bergabung bersama ribuan perempuan desa yang sedang membangun masa depan lebih mandiri.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full bg-teal-500 hover:bg-teal-400 text-slate-900 font-semibold px-7 py-3 transition-colors"
            >
              Daftar Sekarang
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;