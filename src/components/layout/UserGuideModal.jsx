import React from 'react';
import { X, CheckCircle2, UserPlus, LayoutDashboard, BookOpen, GraduationCap, Trophy, HelpCircle, ChevronRight, Sparkles } from 'lucide-react';

const UserGuideModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      icon: <UserPlus className="w-5 h-5" />,
      title: "Pendaftaran & Login",
      desc: "Buat akun menggunakan email Anda. Jika sudah terdaftar, silakan masuk untuk melanjutkan progres.",
      color: "#9f1239",
      bg: "#fff1f2"
    },
    {
      icon: <LayoutDashboard className="w-5 h-5" />,
      title: "Eksplorasi Dashboard",
      desc: "Pantau kemajuan belajar, akumulasi poin, dan akses cepat ke modul yang sedang Anda ikuti.",
      color: "#1e40af",
      bg: "#dbeafe"
    },
    {
      icon: <BookOpen className="w-5 h-5" />,
      title: "Mulai Pembelajaran",
      desc: "Pilih modul materi yang relevan. Setiap sesi dirancang singkat dan padat untuk kenyamanan belajar.",
      color: "#065f46",
      bg: "#d1fae5"
    },
    {
      icon: <Trophy className="w-5 h-5" />,
      title: "Kuis & Evaluasi",
      desc: "Uji pemahaman Anda melalui kuis interaktif di setiap akhir modul dan kumpulkan poin reward.",
      color: "#92400e",
      bg: "#fef3c7"
    },
    {
      icon: <GraduationCap className="w-5 h-5" />,
      title: "Sertifikat Kelulusan",
      desc: "Dapatkan sertifikat digital resmi setelah menyelesaikan rangkaian pembelajaran sebagai bukti kompetensi.",
      color: "#5b21b6",
      bg: "#ede9fe"
    }
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8" style={{ backgroundColor: 'rgba(12, 10, 9, 0.7)', backdropFilter: 'blur(16px)' }}>
      <div 
        className="relative w-full max-w-5xl bg-white shadow-[0_32px_64px_-12px_rgba(0,0,0,0.3)] overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in duration-300" 
        style={{ borderRadius: '2.5rem', height: 'auto', maxHeight: '90vh' }}
      >
        {/* Sidebar - Visual Branding */}
        <div className="hidden md:flex w-full md:w-[35%] bg-[#1c1917] p-12 text-white flex-col relative border-r border-stone-800">
          <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none overflow-hidden">
             <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full bg-rose-600 blur-[120px]"></div>
             <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-rose-900 blur-[120px]"></div>
          </div>
          
          {/* Proportional Centered Content Wrapper */}
          <div className="flex-1 flex flex-col justify-center items-center relative z-10 space-y-12 px-4">
            
            {/* Red Help Icon - Proportional Positioning */}
            <div className="w-20 h-20 bg-rose-600 rounded-[2rem] flex items-center justify-center shadow-2xl shadow-rose-900/50 transform hover:scale-110 transition-transform duration-500 mb-2">
              <HelpCircle className="w-10 h-10 text-white" />
            </div>
            
            <div className="text-center space-y-5">
              <h2 className="font-serif text-4xl font-medium leading-tight">
                Panduan <br/>
                <span className="text-rose-400 italic">Eksplorasi</span>
              </h2>
              <p className="text-stone-400 text-sm font-light leading-relaxed max-w-[240px] mx-auto">
                Langkah praktis mengoptimalkan pengalaman belajar Anda di platform SELARAS.
              </p>
            </div>
            
            <div className="w-full space-y-6 bg-stone-900/40 p-8 rounded-[2rem] border border-stone-800/50">
              <div className="flex items-center justify-center gap-3 text-[10px] font-bold text-rose-500 uppercase tracking-[0.25em] mb-2">
                <div className="w-5 h-[1px] bg-rose-900"></div>
                Fitur Unggulan
                <div className="w-5 h-[1px] bg-rose-900"></div>
              </div>
              <ul className="space-y-4">
                {['Modul Interaktif', 'Sistem Poin Reward', 'Sertifikat Digital'].map((f, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-stone-300 font-light justify-center">
                    <CheckCircle2 className="w-4 h-4 text-rose-500" /> {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Elevated and Larger Footer Text */}
          <div className="relative z-10 py-10 border-t border-stone-800/50 text-center">
            <p className="text-sm text-stone-200 font-serif italic mb-1">
              "Memberdayakan Perempuan Desa"
            </p>
            <p className="text-[10px] text-stone-500 uppercase tracking-[0.3em] font-bold">Platform SELARAS</p>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="w-full md:w-[65%] flex flex-col bg-[#faf9f8]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 md:p-8 border-b border-stone-100 bg-white md:bg-transparent">
            <div className="md:hidden">
              <h2 className="font-serif text-2xl font-medium text-stone-900">Panduan Pengguna</h2>
            </div>
            <div className="hidden md:block">
              <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-stone-400 bg-stone-100 px-4 py-1.5 rounded-full">Bantuan SELARAS</span>
            </div>
            <button 
              onClick={onClose}
              className="p-2.5 rounded-full hover:bg-rose-50 transition-all text-stone-400 hover:text-rose-600"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Steps List */}
          <div className="flex-1 overflow-y-auto p-6 md:p-12 space-y-5 custom-scrollbar">
            {steps.map((step, index) => (
              <div 
                key={index} 
                className="group relative flex items-start gap-6 p-6 bg-white border border-stone-200/60 rounded-[2.5rem] hover:border-rose-200 hover:shadow-[0_20px_40px_-12px_rgba(0,0,0,0.04)] transition-all duration-500"
              >
                <div 
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 shadow-sm"
                  style={{ backgroundColor: step.bg, color: step.color }}
                >
                  {step.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1.5">
                    <h3 className="font-bold text-stone-800 text-base tracking-tight">{step.title}</h3>
                    <span className="text-[10px] font-black text-stone-200 group-hover:text-rose-200 transition-colors">STEP 0{index + 1}</span>
                  </div>
                  <p className="text-stone-500 text-sm font-light leading-relaxed pr-2">
                    {step.desc}
                  </p>
                </div>
                <ChevronRight className="w-4 h-4 text-stone-200 group-hover:text-rose-300 self-center transition-all group-hover:translate-x-1" />
              </div>
            ))}
            
            {/* Call to Action Box - Centered */}
            <div className="mt-12 p-10 bg-gradient-to-br from-rose-600 to-rose-800 rounded-[2.5rem] text-white shadow-2xl shadow-rose-900/20 relative overflow-hidden group text-center">
               <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5"></div>
               <div className="absolute -top-20 -right-20 w-48 h-48 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
               
               <div className="relative z-10 flex flex-col items-center">
                  <div className="w-12 h-12 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mb-6 border border-white/20">
                    <Sparkles className="w-6 h-6 text-rose-200" />
                  </div>
                  <h4 className="font-serif text-2xl mb-3 italic">Sudah Siap Memulai?</h4>
                  <p className="text-rose-100 text-sm font-light leading-relaxed mb-8 max-w-md mx-auto">
                    Akses sekarang dan jadilah bagian dari komunitas perempuan desa yang cerdas teknologi dan mandiri ekonomi.
                  </p>
                  <button 
                    onClick={onClose}
                    className="bg-white text-rose-700 px-10 py-4 rounded-2xl text-sm font-bold shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all"
                  >
                    Mulai Eksplorasi Sekarang
                  </button>
               </div>
            </div>
          </div>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #e7e5e4; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d6d3d1; }
      `}} />
    </div>
  );
};

export default UserGuideModal;
