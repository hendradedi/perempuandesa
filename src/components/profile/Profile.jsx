import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Crown, 
  Award, 
  BookOpen, 
  Trophy, 
  ArrowLeft, 
  Edit3, 
  Download, 
  TrendingUp, 
  Calendar,
  X,
  Phone,
  MapPin,
  User,
  Save,
  Loader2,
  Mail,
  ChevronRight
} from 'lucide-react';
import { doc, setDoc, collection, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/useAuth';
import perempuanDesaImage from '../../assets/srikandi-desa.webp';

const Profile = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDownloading, setIsDownloading] = useState(null);
  const [certTemplate, setCertTemplate] = useState(null);
  const canvasRef = useRef(null);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    fullName: user?.fullName || '',
    address: user?.address || '',
    phone: user?.phone || ''
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        fullName: user.fullName || '',
        address: user.address || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchTemplate = async () => {
      try {
        const q = query(collection(db, 'settings'), limit(1));
        const snap = await getDocs(q);
        if (!snap.empty) {
          const data = snap.docs[0].data();
          if (data.certTemplate) setCertTemplate(data.certTemplate);
        }
      } catch (err) {
        console.error('Error fetching cert template:', err);
      }
    };
    fetchTemplate();
  }, []);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    
    setIsSaving(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        ...formData,
        updatedAt: new Date()
      }, { merge: true });
      await refreshUser();
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      alert('Gagal memperbarui profil. Silakan coba lagi.');
    } finally {
      setIsSaving(false);
    }
  };

  const downloadCertificate = async (cert) => {
    const isProfileComplete = user?.fullName && user?.address && user?.phone;
    if (!isProfileComplete) {
      alert('Silakan lengkapi data profil Anda sebelum mengunduh sertifikat.');
      setIsEditModalOpen(true);
      return;
    }

    setIsDownloading(cert.id);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = certTemplate || 'https://perempuandesa-5ab24.firebasestorage.app/o/templates%2Fcertificate_default.png?alt=media';

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      ctx.font = 'bold 80px "Playfair Display", serif';
      ctx.fillStyle = '#1c1917';
      ctx.textAlign = 'center';
      
      const centerX = canvas.width / 2;
      const centerY = canvas.height * 0.48;
      
      const displayName = user?.fullName;
      ctx.fillText(displayName, centerX, centerY);
      
      ctx.font = '500 40px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#78716c';
      ctx.fillText(cert.module, centerX, centerY + 100);

      ctx.font = '400 24px "Plus Jakarta Sans", sans-serif';
      const dateText = new Date(cert.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      ctx.fillText(`Diterbitkan pada: ${dateText}`, centerX, canvas.height * 0.85);

      const link = document.createElement('a');
      link.download = `Sertifikat_SELARAS_${displayName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsDownloading(null);
    };

    img.onerror = () => {
      alert('Gagal memuat desain sertifikat.');
      setIsDownloading(null);
    };
  };

  const badges = [
    { id: 1, name: 'Pemula', icon: '🌱', description: 'Menyelesaikan modul pertama', color: 'text-emerald-700', bg: 'bg-emerald-50' },
    { id: 2, name: 'Ahli Kesehatan', icon: '🩺', description: 'Lulus modul Kesehatan Reproduksi', color: 'text-blue-700', bg: 'bg-blue-50' },
    { id: 3, name: 'Pengusaha Muda', icon: '💼', description: 'Lulus modul Kewirausahaan', color: 'text-amber-700', bg: 'bg-amber-50' },
    { id: 4, name: 'Bintang Belajar', icon: '⭐', description: 'Menyelesaikan 5 kuis', color: 'text-rose-700', bg: 'bg-rose-50' }
  ];

  const certificates = user?.certificates || [];

  return (
    <div className="min-h-screen bg-[#fdfbf9] text-[#1c1917] font-sans pb-20">
      <main className="max-w-[1000px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
        
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-stone-400 hover:text-stone-900 font-bold text-xs uppercase tracking-widest transition-all">
            <ArrowLeft size={16} /> Kembali
          </button>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-5 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs sm:text-sm font-bold shadow-lg transition-all transform hover:-translate-y-0.5">
            <Edit3 size={16} /> <span className="hidden xs:inline">Edit Profil</span>
          </button>
        </div>

        {/* Profile Header Card */}
        <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-10 border border-stone-100 shadow-xl shadow-stone-200/50 mb-8 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none hidden sm:block">
            <User size={150} />
          </div>
          
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 relative z-10">
            <div className="relative group">
              <img src={perempuanDesaImage} alt="Profil" className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl object-cover border-4 border-white shadow-xl group-hover:scale-105 transition-transform duration-500" />
              <div className="absolute -bottom-2 -right-2 w-8 h-8 sm:w-10 sm:h-10 bg-rose-600 text-white rounded-xl flex items-center justify-center shadow-lg border-2 border-white">
                <Sparkles size={16} />
              </div>
            </div>
            
            <div className="flex-1 text-center md:text-left min-w-0">
              <div className="inline-flex items-center gap-2 bg-rose-50 border border-rose-100 rounded-full px-3 py-1 text-[10px] font-bold text-rose-800 uppercase tracking-widest mb-3">
                Peserta SELARAS
              </div>
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight mb-2 truncate">
                {user?.fullName || user?.name || 'Peserta'}
              </h1>
              <p className="text-stone-400 text-sm mb-6 flex items-center justify-center md:justify-start gap-2">
                <Mail size={14} /> {user?.email}
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-4 sm:gap-6">
                <div className="flex items-center gap-2 text-stone-600 text-sm font-medium">
                  <div className="p-1.5 bg-stone-100 rounded-lg"><MapPin size={14} className="text-stone-500" /></div>
                  <span className="truncate max-w-[150px] sm:max-w-none">{user?.address || 'Alamat belum diatur'}</span>
                </div>
                <div className="flex items-center gap-2 text-stone-600 text-sm font-medium">
                  <div className="p-1.5 bg-stone-100 rounded-lg"><Phone size={14} className="text-stone-500" /></div>
                  <span>{user?.phone || 'Nomor HP belum diatur'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 xs:grid-cols-3 gap-3 sm:gap-4 mt-10">
            <div className="bg-rose-50/50 border border-rose-100 p-4 rounded-2xl flex items-center gap-4 transition-all hover:bg-rose-50">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center shadow-sm text-rose-800 shrink-0">
                <Crown size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Poin</p>
                <p className="text-lg sm:text-xl font-serif font-bold text-stone-900">{user?.points || 0}</p>
              </div>
            </div>
            <div className="bg-amber-50/50 border border-amber-100 p-4 rounded-2xl flex items-center gap-4 transition-all hover:bg-amber-50">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center shadow-sm text-amber-600 shrink-0">
                <Trophy size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Badge</p>
                <p className="text-lg sm:text-xl font-serif font-bold text-stone-900">{user?.badges?.length || 0}</p>
              </div>
            </div>
            <div className="bg-indigo-50/50 border border-indigo-100 p-4 rounded-2xl flex items-center gap-4 transition-all hover:bg-indigo-50">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white flex items-center justify-center shadow-sm text-indigo-600 shrink-0">
                <Award size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Sertifikat</p>
                <p className="text-lg sm:text-xl font-serif font-bold text-stone-900">{certificates.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 sm:gap-4 mb-8 overflow-x-auto pb-2 scrollbar-hide no-scrollbar">
          {[
            { id: 'overview', label: 'Ringkasan', icon: <TrendingUp size={16} /> },
            { id: 'badges', label: 'Badge', icon: <Trophy size={16} /> },
            { id: 'certificates', label: 'Sertifikat', icon: <Award size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap border transition-all ${
                activeTab === tab.id 
                ? 'bg-stone-900 border-stone-900 text-white shadow-lg' 
                : 'bg-white border-stone-100 text-stone-500 hover:border-rose-200'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in duration-700">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="p-2 bg-rose-50 rounded-xl">
                    <BookOpen size={20} className="text-rose-800" />
                  </div>
                  <h3 className="font-serif text-lg text-stone-900 font-bold">Statistik Belajar</h3>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Modul Lulus', value: user?.completedModules?.length || 0, bg: 'bg-rose-50', color: 'text-rose-800' },
                    { label: 'Skor Rata-rata', value: '95', bg: 'bg-emerald-50', color: 'text-emerald-800' },
                  ].map((item, i) => (
                    <div key={i} className={`${item.bg} p-6 rounded-2xl text-center border border-white/50`}>
                      <p className={`text-3xl sm:text-4xl font-serif font-bold ${item.color} mb-1`}>{item.value}</p>
                      <p className={`text-[10px] font-bold uppercase tracking-widest ${item.color} opacity-70`}>{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="p-2 bg-stone-100 rounded-xl">
                    <Calendar size={20} className="text-stone-700" />
                  </div>
                  <h3 className="font-serif text-lg text-stone-900 font-bold">Aktivitas Terbaru</h3>
                </div>
                <div className="space-y-4">
                  {[
                    { icon: '🎉', title: 'Lulus Kuis', date: 'Terbaru', points: '+50' },
                    { icon: '✅', title: 'Materi Selesai', date: 'Kemarin', points: '+10' },
                  ].map((act, i) => (
                    <div key={i} className="flex items-center justify-between p-4 rounded-2xl border border-stone-50 hover:bg-stone-50/50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-lg shrink-0">{act.icon}</div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold text-stone-900 truncate">{act.title}</p>
                          <p className="text-[10px] text-stone-400 font-medium">{act.date}</p>
                        </div>
                      </div>
                      <span className="text-sm font-bold text-rose-800">{act.points}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map(badge => (
                <div key={badge.id} className="bg-white rounded-3xl p-6 border border-stone-100 shadow-sm text-center hover:shadow-md transition-shadow group">
                  <div className={`w-16 h-16 rounded-2xl ${badge.bg} flex items-center justify-center text-3xl mx-auto mb-4 shadow-sm group-hover:scale-110 transition-transform duration-500`}>
                    {badge.icon}
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 mb-1">{badge.name}</h4>
                  <p className="text-[10px] text-stone-500 leading-relaxed px-2">{badge.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'certificates' && (
            <div className="space-y-4">
              {!(user?.fullName && user?.address && user?.phone) && (
                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-4">
                  <span className="text-amber-600 text-xl shrink-0">⚠️</span>
                  <p className="text-amber-900 text-xs sm:text-sm font-medium leading-relaxed">
                    Profil Anda belum lengkap. Silakan isi <span className="font-bold">Nama Lengkap</span>, <span className="font-bold">Alamat</span>, dan <span className="font-bold">No. HP</span> untuk dapat mengunduh sertifikat.
                  </p>
                </div>
              )}
              
              {certificates.length === 0 ? (
                <div className="bg-white rounded-[2rem] p-12 text-center border border-stone-100 shadow-sm">
                  <div className="w-20 h-20 bg-stone-50 rounded-full flex items-center justify-center text-4xl mx-auto mb-6 grayscale opacity-50">🎓</div>
                  <h4 className="font-serif text-xl font-bold text-stone-900 mb-2">Belum Ada Sertifikat</h4>
                  <p className="text-stone-500 text-sm max-w-xs mx-auto mb-8">Selesaikan modul pembelajaran dan lulus kuis untuk meraih sertifikat kelulusan.</p>
                  <Link to="/dashboard" className="inline-flex items-center gap-2 bg-stone-900 text-white px-8 py-3.5 rounded-full font-bold text-sm shadow-xl transition-all hover:-translate-y-1">
                    Mulai Belajar <ChevronRight size={16} />
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {certificates.map(cert => (
                    <div key={cert.id} className={`bg-white rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 border border-stone-100 shadow-sm transition-all ${!(user?.fullName && user?.address && user?.phone) ? 'opacity-60 grayscale-[0.5]' : 'hover:shadow-md hover:border-rose-100'}`}>
                      <div className="flex items-center gap-4 w-full sm:w-auto">
                        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 shrink-0">
                          <Award size={24} />
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-sm sm:text-base font-bold text-stone-900 truncate">{cert.module}</h4>
                          <p className="text-[10px] sm:text-xs text-stone-400 font-medium">Diterbitkan: {new Date(cert.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => downloadCertificate(cert)}
                        disabled={isDownloading === cert.id}
                        className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold border transition-all ${
                          (user?.fullName && user?.address && user?.phone)
                          ? 'bg-stone-50 border-stone-200 text-stone-800 hover:bg-rose-600 hover:border-rose-600 hover:text-white hover:shadow-lg'
                          : 'bg-stone-50 border-stone-100 text-stone-300 cursor-not-allowed'
                        }`}>
                        {isDownloading === cert.id ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} 
                        Unduh Sertifikat
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Hidden Canvas for Certificate Generation */}
        <canvas ref={canvasRef} className="hidden" />

        {/* Edit Profile Modal */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-md animate-in fade-in duration-300" onClick={() => setIsEditModalOpen(false)}>
            <div className="bg-white rounded-[2.5rem] w-full max-w-lg p-8 sm:p-10 relative shadow-2xl animate-in zoom-in-95 duration-300" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                className="absolute top-6 right-6 p-2 text-stone-300 hover:text-stone-900 transition-colors">
                <X size={24} />
              </button>
              
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900 mb-2">Edit Profil</h2>
              <p className="text-xs sm:text-sm text-stone-400 mb-8">Lengkapi data diri Anda secara akurat untuk keperluan pencetakan sertifikat.</p>
              
              <form onSubmit={handleUpdateProfile} className="space-y-5">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">Nama Lengkap (Sesuai Sertifikat)</label>
                  <div className="relative group">
                    <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-rose-600 transition-colors" />
                    <input 
                      className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                      placeholder="Masukkan nama lengkap..."
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">Alamat Domisili</label>
                  <div className="relative group">
                    <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-rose-600 transition-colors" />
                    <input 
                      className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                      placeholder="Alamat lengkap saat ini..."
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold text-stone-500 uppercase tracking-widest ml-1">Nomor WhatsApp / HP</label>
                  <div className="relative group">
                    <Phone size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-300 group-focus-within:text-rose-600 transition-colors" />
                    <input 
                      className="w-full bg-stone-50 border border-stone-100 rounded-2xl py-3.5 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500 transition-all"
                      placeholder="Contoh: 08123456789"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSaving}
                  className="w-full bg-stone-900 hover:bg-stone-800 text-white rounded-2xl py-4 font-bold text-sm shadow-xl shadow-stone-200 transition-all flex items-center justify-center gap-3 transform hover:-translate-y-0.5 active:translate-y-0 mt-4">
                  {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />} 
                  Simpan Perubahan
                </button>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;