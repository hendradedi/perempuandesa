import { useState } from 'react';
import { Link } from 'react-router-dom';
import perempuanDesaImage from '../../assets/srikandi-desa.webp';
import { ArrowRight, CheckCircle2, BookOpen, Heart, Sparkles, Star, Award, HelpCircle } from 'lucide-react';
import UserGuideModal from './UserGuideModal';

const LandingPage = () => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf9f8] text-stone-800 font-sans selection:bg-rose-200 selection:text-rose-900 overflow-x-hidden">
      
      {/* HERO SECTION */}
      <section className="relative pt-20 md:pt-32 pb-16 md:pb-32 px-4">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-rose-50/60 to-transparent" />
          <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-rose-100/40 blur-[120px]" />
          <div className="absolute top-20 -left-20 h-[400px] w-[400px] rounded-full bg-stone-200/50 blur-[100px]" />
        </div>

        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          <div className="text-left relative z-10 animate-in fade-in slide-in-from-left-6 duration-1000">
            <span className="inline-flex items-center gap-2 rounded-full bg-white border border-rose-100 px-4 py-1.5 sm:px-5 sm:py-2 text-xs sm:text-sm font-semibold text-rose-700 mb-6 sm:mb-8 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500" />
              Platform Sekolah Perempuan Desa
            </span>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium leading-[1.1] tracking-tight text-stone-900 mb-4 sm:mb-6">
              <span className="italic text-rose-700">SELARAS</span>
            </h1>
            <p className="text-stone-500 text-[10px] sm:text-xs mb-6 sm:mb-8 font-bold tracking-[0.15em] uppercase leading-tight">
              Sistem Literasi digitAl dan Life skill Responsif gender untuk perempuan deSa
            </p>

            <p className="text-lg md:text-xl text-stone-600 leading-relaxed mb-10 font-light max-w-lg">
              Platform sekolah perempuan desa berbasis digital yang mendukung literasi digital, life skill, kemandirian ekonomi, dan penguatan kapasitas sosial perempuan secara inklusif, adaptif, dan berkelanjutan.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-5">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white px-8 py-4 text-base font-bold transition-all shadow-xl hover:-translate-y-1 active:translate-y-0"
              >
                Mulai Belajar Sekarang
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setShowGuide(true)}
                className="inline-flex items-center justify-center gap-3 rounded-full border border-stone-200 bg-white/80 backdrop-blur-md text-stone-700 px-8 py-4 text-base font-bold transition-all hover:bg-stone-50"
              >
                <HelpCircle className="w-4 h-4 text-rose-500" />
                Panduan Pengguna
              </button>
            </div>
          </div>

          <div className="relative z-10 w-full max-w-lg mx-auto lg:max-w-none animate-in fade-in slide-in-from-right-6 duration-1000">
            <div className="relative p-2.5 sm:p-4 bg-white/50 backdrop-blur-xl border border-stone-100 shadow-2xl rounded-[2.5rem] sm:rounded-[3.5rem]">
              <div className="overflow-hidden relative rounded-[2rem] sm:rounded-[3rem] aspect-[4/5]">
                <img
                  src={perempuanDesaImage}
                  alt="Ilustrasi perempuan desa"
                  className="w-full h-full object-cover object-top hover:scale-110 transition-transform duration-1000"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"></div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-4 sm:-bottom-8 sm:-left-8 bg-white p-4 sm:p-5 flex items-center gap-3 sm:gap-4 rounded-2xl sm:rounded-3xl shadow-2xl border border-stone-100 animate-bounce-slow">
                <div className="w-10 h-10 sm:w-14 sm:h-14 flex items-center justify-center text-rose-600 bg-rose-50 rounded-xl sm:rounded-2xl">
                  <Heart className="w-5 h-5 sm:w-7 sm:h-7 fill-rose-200" />
                </div>
                <div>
                  <p className="text-xl sm:text-3xl font-serif font-bold text-stone-900 leading-none">750+</p>
                  <p className="text-[9px] sm:text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">Wanita Berdaya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS SECTION */}
      <section className="border-y border-stone-200 bg-white py-12 sm:py-20">
        <div className="max-w-[1280px] mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            {[
              { val: '30+', label: 'Modul Premium', color: 'text-rose-800' },
              { val: '140', label: 'Sesi Interaktif', color: 'text-stone-900' },
              { val: '98%', label: 'Tingkat Kepuasan', color: 'text-rose-800' },
              { val: '85+', label: 'Sertifikat Diraih', color: 'text-stone-900' },
            ].map((m, i) => (
              <div key={i} className="text-center group">
                <p className={`font-serif ${m.color} text-4xl sm:text-5xl lg:text-6xl mb-2 transition-transform group-hover:scale-110 duration-500`}>{m.val}</p>
                <p className="text-[10px] sm:text-xs font-bold text-stone-400 uppercase tracking-widest leading-tight">{m.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION */}
      <section id="tentang" className="py-20 sm:py-32 px-4 bg-[#fdfbf9]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 sm:mb-24">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 mb-6 font-medium">Mengapa SELARAS?</h2>
            <p className="text-stone-600 font-light text-base sm:text-lg leading-relaxed">
              Platform SELARAS dirancang untuk meningkatkan literasi digital, keterampilan hidup, kemandirian ekonomi, dan penguatan sosial perempuan desa melalui pendekatan yang inklusif, adaptif, dan responsif gender.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <BookOpen className="w-6 h-6" />, bg:'bg-rose-50', color:'text-rose-800', title:'Literasi Digital', desc:'Kuasai penggunaan perangkat digital, internet aman, dan pemanfaatan teknologi untuk kegiatan sosial-ekonomi.' },
              { icon: <Heart className="w-6 h-6" />, bg:'bg-stone-100', color:'text-stone-700', title:'Responsif Gender', desc:'Memahami konsep kesetaraan, keadilan gender, dan pengarusutamaan gender (PUG) dalam pembangunan desa.' },
              { icon: <Star className="w-6 h-6" />, bg:'bg-rose-50', color:'text-rose-800', title:'Ekonomi Mandiri', desc:'Pelatihan kewirausahaan, manajemen keuangan usaha, dan pemasaran digital untuk kemandirian ekonomi.' },
              { icon: <Award className="w-6 h-6" />, bg:'bg-stone-100', color:'text-stone-700', title:'Pendampingan', desc:'Sistem komunitas dan pendampingan berkelanjutan untuk mendukung keberhasilan setiap pengguna.' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-stone-100 rounded-[2rem] p-8 shadow-sm hover:shadow-xl hover:shadow-stone-200/50 transition-all duration-500 hover:-translate-y-2 group">
                <div className={`flex items-center justify-center mb-6 w-14 h-14 rounded-2xl ${item.bg} ${item.color} group-hover:scale-110 transition-transform`}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-stone-900 mb-3 text-lg">{item.title}</h3>
                <p className="text-stone-500 font-light text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED MODULES */}
      <section id="modul" className="py-20 sm:py-32 px-4 bg-white border-y border-stone-200">
        <div className="max-w-[1280px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
            <div className="max-w-xl">
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 mb-6 font-medium">Modul Unggulan SELARAS</h2>
              <p className="text-stone-600 font-light text-base sm:text-lg">
                Materi interaktif yang dirancang berbasis kebutuhan nyata perempuan desa — tersedia kapan saja, di mana saja.
              </p>
            </div>
            <Link to="/login" className="font-bold text-rose-800 flex items-center gap-2 group whitespace-nowrap">
              Lihat Seluruh Modul <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {[
              { icon: <Sparkles className="w-10 h-10" />, bg:'bg-rose-50', color:'text-rose-800', title:'Pengarusutamaan Gender (PUG)', desc:'Meningkatkan partisipasi perempuan dalam pembangunan desa, pengambilan keputusan, dan kepemimpinan masyarakat desa.', sesi:'2 Sesi', durasi:'20 Menit/Hari' },
              { icon: <Heart className="w-10 h-10" />, bg:'bg-stone-100', color:'text-stone-700', title:'Life Skill & Kesejahteraan', desc:'Pengelolaan keuangan keluarga, komunikasi interpersonal, dan pengembangan diri untuk kualitas hidup yang lebih baik.', sesi:'4 Sesi', durasi:'20 Menit/Hari' },
            ].map((mod, i) => (
              <article key={i} className="bg-[#fafafa] border border-stone-100 rounded-[2.5rem] overflow-hidden group hover:shadow-2xl hover:shadow-stone-200 transition-all duration-700">
                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-8 p-8 sm:p-10">
                  <div className={`flex items-center justify-center shrink-0 w-24 h-24 rounded-full ${mod.bg} ${mod.color} group-hover:scale-110 transition-transform duration-700`}>
                    {mod.icon}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl sm:text-2xl text-stone-900 mb-3 font-medium">{mod.title}</h3>
                    <p className="text-stone-500 font-light mb-6 leading-relaxed text-sm sm:text-base">{mod.desc}</p>
                    <div className="flex items-center gap-3 text-stone-400 text-[10px] font-bold uppercase tracking-widest">
                      <span>{mod.sesi}</span>
                      <span className="w-1 h-1 rounded-full bg-stone-300"></span>
                      <span>{mod.durasi}</span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimoni" className="py-20 sm:py-32 px-4 bg-[#faf9f8]">
        <div className="max-w-[1280px] mx-auto text-center">
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-stone-900 mb-4 font-medium">Suara Pengguna SELARAS</h2>
          <p className="text-stone-500 font-light mb-16 sm:mb-24">Cerita nyata dari perempuan desa yang telah merasakan manfaat platform SELARAS.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[{
              quote: 'Sebuah ruang yang sangat elegan dan informatif. Saya menemukan kembali kepercayaan diri untuk merintis usaha.',
              name: 'Siti Aminah',
              role: 'Wirausaha Lokal'
            }, {
              quote: 'Materi disajikan dengan sangat cantik dan bahasa yang menenangkan. Sangat cocok untuk rutinitas pagi saya.',
              name: 'Maya Wati',
              role: 'Ibu Rumah Tangga'
            }, {
              quote: 'Platform ini membuktikan bahwa pendidikan bagi perempuan desa bisa dikemas dengan sangat berkelas.',
              name: 'Rina Dewi',
              role: 'Penggiat Komunitas'
            }].map((item, idx) => (
              <div key={idx} className="bg-white border border-stone-100 text-left p-8 sm:p-10 rounded-[2rem] shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2">
                <div className="flex gap-1 mb-6">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-rose-300 text-rose-300" />)}
                </div>
                <p className="text-stone-600 font-serif italic mb-8 text-base sm:text-lg leading-relaxed">
                  "{item.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-stone-100 shrink-0 overflow-hidden border-2 border-white shadow-sm">
                    <div className="w-full h-full bg-gradient-to-br from-stone-200 to-stone-300"></div>
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-stone-900 truncate">{item.name}</h4>
                    <p className="text-stone-400 uppercase text-[9px] font-bold tracking-widest truncate">{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-20 sm:py-32 px-4">
        <div className="max-w-[1280px] mx-auto">
          <div className="relative overflow-hidden text-center rounded-[3rem] sm:rounded-[4rem] bg-stone-900 py-16 sm:py-24 px-6 sm:px-12 shadow-2xl shadow-stone-400/50">
            {/* Background elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
              <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-rose-500/20 blur-[120px]"></div>
              <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-stone-500/20 blur-[100px]"></div>
            </div>

            <div className="relative z-10 max-w-2xl mx-auto">
              <p className="text-rose-400 text-xs font-bold mb-6 uppercase tracking-[0.3em]">Bergabunglah bersama SELARAS</p>
              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white mb-8 font-medium leading-tight">
                Mulai Perjalanan Belajarmu Hari Ini
              </h2>
              <p className="font-light text-stone-300 text-base sm:text-lg mb-12 leading-relaxed">
                SELARAS hadir untuk setiap perempuan desa yang ingin tumbuh, belajar, dan berdaya. Akses pembelajaran mandiri melalui perangkat digital — kapan saja, di mana saja.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-3 bg-rose-700 hover:bg-rose-600 text-white px-10 py-4 rounded-full text-base font-bold shadow-xl shadow-rose-900/40 transition-all hover:-translate-y-1 active:translate-y-0"
              >
                Daftar di SELARAS
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FLOATING HELP */}
      <button 
        onClick={() => setShowGuide(true)}
        className="fixed bottom-6 right-6 sm:bottom-8 sm:right-8 w-14 h-14 sm:w-16 sm:h-16 bg-rose-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-transform z-50 group animate-in slide-in-from-bottom-10 duration-1000"
      >
        <HelpCircle className="w-7 h-7 sm:w-8 sm:h-8" />
        <span className="absolute right-full mr-4 bg-stone-900 text-white text-[10px] font-bold py-2.5 px-5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none shadow-xl border border-stone-800">
          Butuh Bantuan?
        </span>
      </button>

      {/* USER GUIDE MODAL */}
      <UserGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />

    </div>
  );
};

export default LandingPage;