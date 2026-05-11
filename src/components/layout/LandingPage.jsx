import { useState } from 'react';
import { Link } from 'react-router-dom';
import perempuanDesaImage from '../../assets/srikandi-desa.webp';
import { ArrowRight, CheckCircle2, Play, BookOpen, Heart, Sparkles, Star, Award, HelpCircle } from 'lucide-react';
import UserGuideModal from './UserGuideModal';

const LandingPage = () => {
  const [showGuide, setShowGuide] = useState(false);

  return (
    <div className="min-h-screen bg-[#faf9f8] text-stone-800 font-sans selection:bg-rose-200 selection:text-rose-900">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-20 md:pt-32 pb-20 md:pb-32">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-x-0 top-0 h-[600px] bg-gradient-to-b from-rose-50/60 to-transparent" />
          <div className="absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-rose-100/40 blur-[120px]" />
          <div className="absolute top-20 -left-20 h-[400px] w-[400px] rounded-full bg-stone-200/50 blur-[100px]" />
        </div>

        <div className="container-page grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <div className="text-left relative z-10 lg:pr-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white border border-rose-100 px-5 py-2 text-sm font-semibold text-rose-700 mb-8 shadow-sm">
              <Sparkles className="w-4 h-4 text-rose-500" />
              Platform Sekolah Perempuan Desa
            </span>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-medium leading-tight tracking-tight text-stone-900 mb-3">
              <span className="italic text-rose-700">SELARAS</span>
            </h1>
            <p className="text-stone-500 text-sm mb-6 font-medium tracking-wide">Sistem Literasi digitAl dan Life skill Responsif gender untuk perempuan deSa</p>

            <p className="text-lg md:text-xl text-stone-600 leading-relaxed mb-10 font-light" style={{maxWidth:'480px'}}>
              Platform sekolah perempuan desa berbasis digital yang mendukung literasi digital, life skill, kemandirian ekonomi, dan penguatan kapasitas sosial perempuan secara inklusif, adaptif, dan berkelanjutan.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-5">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-3 rounded-full bg-stone-900 hover:bg-stone-800 text-white px-8 py-4 text-base font-medium transition-all shadow-lg"
                style={{transition:'all 0.3s'}}
                onMouseEnter={e => e.currentTarget.style.transform='translateY(-2px)'}
                onMouseLeave={e => e.currentTarget.style.transform='translateY(0)'}
              >
                Mulai Belajar Sekarang
                <ArrowRight className="w-4 h-4" />
              </Link>
              <button
                onClick={() => setShowGuide(true)}
                className="inline-flex items-center justify-center gap-3 rounded-full border border-stone-200 bg-white text-stone-700 px-8 py-4 text-base font-medium transition-all"
                style={{backdropFilter:'blur(8px)'}}
              >
                <HelpCircle className="w-4 h-4 text-rose-500" />
                Panduan Pengguna
              </button>
            </div>
          </div>

          <div className="relative z-10 w-full" style={{maxWidth:'520px', margin:'0 auto'}}>
            <div className="relative p-3 bg-white border border-stone-100 shadow-2xl" style={{borderRadius:'2.5rem', backgroundColor:'rgba(255,255,255,0.5)', backdropFilter:'blur(20px)'}}>
              <div className="overflow-hidden relative" style={{borderRadius:'2rem', aspectRatio:'4/5'}}>
                <img
                  src={perempuanDesaImage}
                  alt="Ilustrasi perempuan desa"
                  className="w-full h-full object-cover object-top"
                  style={{transition:'transform 1s', cursor:'default'}}
                  onMouseEnter={e => e.target.style.transform='scale(1.05)'}
                  onMouseLeave={e => e.target.style.transform='scale(1)'}
                />
                <div className="absolute inset-0" style={{background:'linear-gradient(to top, rgba(28,25,23,0.4), transparent)'}}></div>
              </div>
              
              {/* Floating Badge */}
              <div className="absolute bg-white p-5 flex items-center gap-4" style={{bottom:'-1.5rem', left:'-2rem', borderRadius:'1.5rem', boxShadow:'0 20px 40px rgba(28,25,23,0.12)', border:'1px solid #e7e5e4'}}>
                <div className="w-12 h-12 flex items-center justify-center text-rose-600" style={{background:'#fff1f2', borderRadius:'1rem'}}>
                  <Heart className="w-6 h-6" style={{fill:'#fecdd3'}} />
                </div>
                <div>
                  <p className="text-2xl font-serif font-bold text-stone-900">750+</p>
                  <p className="text-xs font-semibold text-stone-500 uppercase" style={{letterSpacing:'0.08em'}}>Wanita Berdaya</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* METRICS SECTION */}
      <section className="border-y border-stone-200 bg-white py-12 md:py-16">
        <div className="container-page">
          <div className="grid grid-cols-2 md:grid-cols-4" style={{gap:'2rem'}}>
            <div className="text-center">
              <p className="font-serif text-stone-900 mb-2" style={{fontSize:'2.75rem', color:'#9f1239'}}>30+</p>
              <p className="text-sm font-medium text-stone-500 uppercase" style={{letterSpacing:'0.1em'}}>Modul Premium</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-stone-900 mb-2" style={{fontSize:'2.75rem'}}>140</p>
              <p className="text-sm font-medium text-stone-500 uppercase" style={{letterSpacing:'0.1em'}}>Sesi Interaktif</p>
            </div>
            <div className="text-center">
              <p className="font-serif mb-2" style={{fontSize:'2.75rem', color:'#9f1239'}}>98%</p>
              <p className="text-sm font-medium text-stone-500 uppercase" style={{letterSpacing:'0.1em'}}>Tingkat Kepuasan</p>
            </div>
            <div className="text-center">
              <p className="font-serif text-stone-900 mb-2" style={{fontSize:'2.75rem'}}>85+</p>
              <p className="text-sm font-medium text-stone-500 uppercase" style={{letterSpacing:'0.1em'}}>Sertifikat Diraih</p>
            </div>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION */}
      <section id="tentang" className="py-16 md:py-24">
        <div className="container-page">
          <div className="text-center mb-16" style={{maxWidth:'700px', margin:'0 auto 4rem'}}>
            <h2 className="font-serif text-stone-900 mb-6" style={{fontSize:'2.5rem'}}>Mengapa SELARAS?</h2>
            <p className="text-stone-600 font-light" style={{fontSize:'1.1rem', lineHeight:'1.8'}}>
              Platform SELARAS dirancang untuk meningkatkan literasi digital, keterampilan hidup, kemandirian ekonomi, dan penguatan sosial perempuan desa melalui pendekatan yang inklusif, adaptif, dan responsif gender.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4" style={{gap:'1.5rem'}}>
            {[
              { icon: <BookOpen className="w-6 h-6" />, bg:'#fff1f2', color:'#9f1239', title:'Literasi Digital', desc:'Kuasai penggunaan perangkat digital, internet aman, dan pemanfaatan teknologi untuk kegiatan sosial-ekonomi.' },
              { icon: <Heart className="w-6 h-6" />, bg:'#f5f5f4', color:'#44403c', title:'Responsif Gender', desc:'Memahami konsep kesetaraan, keadilan gender, dan pengarusutamaan gender (PUG) dalam pembangunan desa.' },
              { icon: <Star className="w-6 h-6" />, bg:'#fff1f2', color:'#9f1239', title:'Ekonomi Mandiri', desc:'Pelatihan kewirausahaan, manajemen keuangan usaha, dan pemasaran digital untuk kemandirian ekonomi.' },
              { icon: <Award className="w-6 h-6" />, bg:'#f5f5f4', color:'#44403c', title:'Pendampingan', desc:'Sistem komunitas dan pendampingan berkelanjutan untuk mendukung keberhasilan setiap pengguna.' },
            ].map((item, i) => (
              <div key={i} className="bg-white border border-stone-100 group" style={{borderRadius:'2.5rem', padding:'2.5rem', boxShadow:'0 4px 20px rgba(28,25,23,0.03)', transition:'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)'}}>
                <div className="flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500" style={{width:'64px', height:'64px', borderRadius:'1.25rem', background:item.bg, color:item.color}}>
                  {item.icon}
                </div>
                <h3 className="font-bold text-stone-900 mb-4" style={{fontSize:'1.2rem'}}>{item.title}</h3>
                <p className="text-stone-500 font-light" style={{fontSize:'0.95rem', lineHeight:'1.7'}}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED MODULES */}
      <section id="modul" className="py-16 md:py-24" style={{background:'#f5f5f4', borderTop:'1px solid #e7e5e4', borderBottom:'1px solid #e7e5e4'}}>
        <div className="container-page">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12" style={{gap:'1.5rem'}}>
            <div style={{maxWidth:'520px'}}>
              <h2 className="font-serif text-stone-900 mb-4" style={{fontSize:'2.5rem'}}>Modul Unggulan SELARAS</h2>
              <p className="text-stone-600 font-light" style={{fontSize:'1.05rem'}}>
                Materi interaktif yang dirancang berbasis kebutuhan nyata perempuan desa — tersedia kapan saja, di mana saja.
              </p>
            </div>
            <Link to="/login" className="font-semibold" style={{color:'#9f1239', display:'inline-flex', alignItems:'center', gap:'0.5rem', whiteSpace:'nowrap'}}>
              Lihat Seluruh Modul <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2" style={{gap:'1.5rem'}}>
            {[
              { icon: <Sparkles className="w-10 h-10" />, bg:'#fff1f2', color:'#9f1239', title:'Pengarusutamaan Gender (PUG)', desc:'Meningkatkan partisipasi perempuan dalam pembangunan desa, pengambilan keputusan, dan kepemimpinan masyarakat desa.', sesi:'2 Sesi', durasi:'20 Menit/Hari' },
              { icon: <Heart className="w-10 h-10" />, bg:'#f5f5f4', color:'#44403c', title:'Life Skill & Kesejahteraan', desc:'Pengelolaan keuangan keluarga, komunikasi interpersonal, dan pengembangan diri untuk kualitas hidup yang lebih baik.', sesi:'4 Sesi', durasi:'20 Menit/Hari' },
            ].map((mod, i) => (
              <article key={i} className="bg-white border border-stone-100" style={{borderRadius:'2.5rem', boxShadow:'0 2px 8px rgba(28,25,23,0.04)', overflow:'hidden', transition:'all 0.5s'}}>
                <div className="flex flex-col sm:flex-row items-center" style={{gap:'2rem', padding:'2.5rem'}}>
                  <div className="flex items-center justify-center shrink-0" style={{width:'96px', height:'96px', borderRadius:'50%', background:mod.bg, color:mod.color}}>
                    {mod.icon}
                  </div>
                  <div>
                    <h3 className="font-serif text-stone-900 mb-3" style={{fontSize:'1.4rem', fontWeight:'500'}}>{mod.title}</h3>
                    <p className="text-stone-500 font-light mb-5" style={{lineHeight:'1.7'}}>{mod.desc}</p>
                    <div className="flex items-center gap-3 text-stone-400" style={{fontSize:'0.75rem', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.08em'}}>
                      <span>{mod.sesi}</span>
                      <span style={{width:'4px', height:'4px', borderRadius:'50%', background:'#d6d3d1', display:'inline-block'}}></span>
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
      <section id="testimoni" className="py-16 md:py-24">
        <div className="container-page text-center">
          <h2 className="font-serif text-stone-900 mb-4" style={{fontSize:'2.5rem'}}>Suara Pengguna SELARAS</h2>
          <p className="text-stone-500 font-light mb-12">Cerita nyata dari perempuan desa yang telah merasakan manfaat platform SELARAS.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3" style={{gap:'2rem'}}>
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
              <div key={idx} className="bg-white border border-stone-100 text-left hover:shadow-xl transition-all duration-500" style={{padding:'3rem', borderRadius:'2.5rem', boxShadow:'0 4px 20px rgba(28,25,23,0.03)'}}>
                <div className="flex gap-1.5 mb-8">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4" style={{fill:'#fda4af', color:'#fda4af'}} />)}
                </div>
                <p className="text-stone-700 font-serif italic mb-10" style={{fontSize:'1.15rem', lineHeight:'1.8'}}>
                  "{item.quote}"
                </p>
                <div className="flex items-center gap-5">
                  <div style={{width:'56px', height:'56px', borderRadius:'50%', background:'#f5f5f4', border:'2px solid #fff', boxShadow:'0 4px 12px rgba(0,0,0,0.05)'}}></div>
                  <div>
                    <h4 className="font-bold text-stone-900" style={{fontSize:'1.1rem'}}>{item.name}</h4>
                    <p className="text-stone-400 font-bold uppercase" style={{fontSize:'0.75rem', letterSpacing:'0.12em'}}>{item.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-16 md:py-20 px-4 md:px-0">
        <div className="container-page">
          <div className="relative overflow-hidden text-center rounded-[2rem] md:rounded-[3rem] p-8 md:p-20" style={{background:'#1c1917', boxShadow:'0 32px 64px rgba(28,25,23,0.3)'}}>
            <div className="relative" style={{maxWidth:'680px', margin:'0 auto', position:'relative', zIndex:1}}>
              <p className="text-rose-300 text-xs font-medium mb-4 uppercase tracking-widest">Bergabunglah bersama SELARAS</p>
              <h2 className="font-serif text-white mb-6" style={{fontSize:'2.5rem'}}>
                Mulai Perjalanan Belajarmu Hari Ini
              </h2>
              <p className="font-light mb-10" style={{color:'#d6d3d1', fontSize:'1.1rem', lineHeight:'1.8'}}>
                SELARAS hadir untuk setiap perempuan desa yang ingin tumbuh, belajar, dan berdaya. Akses pembelajaran mandiri melalui perangkat digital — kapan saja, di mana saja.
              </p>
              <Link
                to="/register"
                className="inline-flex items-center gap-3 text-white font-medium"
                style={{background:'#9f1239', borderRadius:'999px', padding:'1rem 2.5rem', fontSize:'1.05rem', transition:'background 0.3s'}}
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
        className="fixed bottom-8 right-8 w-14 h-14 bg-rose-600 text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform z-50 group"
      >
        <HelpCircle className="w-6 h-6" />
        <span className="absolute right-full mr-4 bg-stone-900 text-white text-[10px] py-2 px-4 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Butuh Bantuan? Klik di sini
        </span>
      </button>

      {/* USER GUIDE MODAL */}
      <UserGuideModal isOpen={showGuide} onClose={() => setShowGuide(false)} />

    </div>
  );
};

export default LandingPage;