import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Loader2
} from 'lucide-react';
import { doc, updateDoc, setDoc, getDoc, collection, getDocs, query, limit, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/useAuth';
import perempuanDesaImage from '../../assets/srikandi-desa.webp';

const s = {
  page:    { minHeight: '100vh', background: '#fdfbf9', fontFamily: "'Plus Jakarta Sans', sans-serif", color: '#1c1917' },
  main:    { maxWidth: '1000px', margin: '0 auto' },
  card:    { background: '#fff', borderRadius: '24px', padding: '2rem', border: '1px solid #f5f5f4', boxShadow: '0 4px 20px rgba(28,25,23,0.03)', marginBottom: '1.5rem' },
  statCard:{ background: '#fff', borderRadius: '20px', padding: '1.25rem', border: '1px solid #f5f5f4', display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 },
  badge:   { display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f5f5f4', border: '1px solid #e7e5e4', borderRadius: '999px', padding: '4px 14px', fontSize: '11px', fontWeight: 600, color: '#78716c', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' },
  avatar:  { width: '100px', height: '100px', borderRadius: '24px', objectFit: 'cover', border: '3px solid #fff', boxShadow: '0 8px 24px rgba(28,25,23,0.08)' },
  btn:     { padding: '10px 20px', borderRadius: '999px', fontWeight: 700, fontSize: '0.875rem', cursor: 'pointer', border: 'none', transition: 'all 0.3s', display: 'flex', alignItems: 'center', gap: '8px' },
  modal:   { position: 'fixed', inset: 0, background: 'rgba(28,25,23,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '1rem' },
  modalContent: { background: '#fff', borderRadius: '28px', width: '100%', maxWidth: '450px', position: 'relative', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' },
  input:   { width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid #e7e5e4', fontSize: '0.95rem', outline: 'none', background: '#faf9f8', transition: 'all 0.2s' },
  inputLabel: { display: 'block', fontSize: '12px', fontWeight: 700, color: '#78716c', marginBottom: '6px', marginLeft: '4px' }
};

const Profile = () => {
  const { user, refreshUser } = useAuth();
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

  // Fetch certificate template from admin settings
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
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, {
        ...formData,
        updatedAt: serverTimestamp()
      }, { merge: true });
      
      setIsEditModalOpen(false);
    } catch (err) {
      console.error('Detailed error updating profile:', err);
      alert(`Gagal memperbarui profil: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const downloadCertificate = async (cert) => {
    // Validation: Check if profile is complete
    const isProfileComplete = user?.fullName && user?.address && user?.phone;
    
    if (!isProfileComplete) {
      alert('Silakan lengkapi data profil Anda (Nama Lengkap, Alamat, No. HP) sebelum mengunduh sertifikat.');
      setIsEditModalOpen(true); // Open modal for them
      return;
    }

    setIsDownloading(cert.id);
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.crossOrigin = 'anonymous';
    // Use admin template or default fallback
    img.src = certTemplate || 'https://perempuandesa-5ab24.firebasestorage.app/o/templates%2Fcertificate_default.png?alt=media';

    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw template
      ctx.drawImage(img, 0, 0);
      
      // Add User Name
      ctx.font = 'bold 80px "Playfair Display", serif';
      ctx.fillStyle = '#1c1917';
      ctx.textAlign = 'center';
      
      // Calculate center position
      const centerX = canvas.width / 2;
      const centerY = canvas.height * 0.48; // Adjust based on template design
      
      const displayName = user?.fullName;
      ctx.fillText(displayName, centerX, centerY);
      
      // Add Module Name
      ctx.font = '500 40px "Plus Jakarta Sans", sans-serif';
      ctx.fillStyle = '#78716c';
      ctx.fillText(cert.module, centerX, centerY + 100);

      // Add Date
      ctx.font = '400 24px "Plus Jakarta Sans", sans-serif';
      const dateText = new Date(cert.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      ctx.fillText(`Diterbitkan pada: ${dateText}`, centerX, canvas.height * 0.85);

      // Trigger Download
      const link = document.createElement('a');
      link.download = `Sertifikat_SELARAS_${displayName.replace(/\s+/g, '_')}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      setIsDownloading(null);
    };

    img.onerror = () => {
      alert('Gagal memuat desain sertifikat. Silakan hubungi admin.');
      setIsDownloading(null);
    };
  };

  const badges = [
    { id: 1, name: 'Pemula', icon: '🌱', description: 'Menyelesaikan modul pertama', color: '#065f46', bg: '#d1fae5' },
    { id: 2, name: 'Ahli Kesehatan', icon: '🩺', description: 'Lulus modul Kesehatan Reproduksi', color: '#1e40af', bg: '#dbeafe' },
    { id: 3, name: 'Pengusaha Muda', icon: '💼', description: 'Lulus modul Kewirausahaan', color: '#92400e', bg: '#fef3c7' },
    { id: 4, name: 'Bintang Belajar', icon: '⭐', description: 'Menyelesaikan 5 kuis', color: '#9f1239', bg: '#fff1f2' }
  ];

  const certificates = user?.certificates || [
    { id: 1, module: 'Literasi Digital', date: '2026-05-01', icon: <Award className="w-8 h-8" /> },
    { id: 2, module: 'Ekonomi Kreatif', date: '2026-05-05', icon: <Award className="w-8 h-8" /> }
  ];

  return (
    <div style={s.page}>
      <main style={s.main} className="px-4 md:px-6 pt-8 pb-20">
        {/* Navigation */}
        <div style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link to="/dashboard" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: '#a8a29e', fontSize: '0.85rem', fontWeight: 600 }}>
            <ArrowLeft size={16} /> Dashboard
          </Link>
          <button 
            onClick={() => setIsEditModalOpen(true)}
            style={{ ...s.btn, background: '#1c1917', color: '#fff' }}>
            <Edit3 size={16} /> Edit Profil
          </button>
        </div>

        {/* Simplified Header */}
        <div style={s.card}>
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-6 md:gap-8">
            <img src={perempuanDesaImage} alt="Profil" style={s.avatar} />
            <div style={{ flex: 1, minWidth: '250px' }}>
              <div style={s.badge}>Peserta SELARAS</div>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: '2rem', fontWeight: 700, color: '#1c1917', marginBottom: '0.25rem' }}>
                {user?.fullName || user?.name || 'Peserta'}
              </h1>
              <p style={{ color: '#a8a29e', fontSize: '0.9rem', marginBottom: '1rem' }}>{user?.email}</p>
              
              <div className="flex flex-col sm:flex-row items-center md:items-start gap-4 sm:gap-6">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#78716c', fontSize: '0.85rem' }}>
                  <MapPin size={14} /> {user?.address || 'Alamat belum diatur'}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#78716c', fontSize: '0.85rem' }}>
                  <Phone size={14} /> {user?.phone || 'Nomor HP belum diatur'}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div style={s.statCard}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fff1f2', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Crown size={18} color="#9f1239" />
              </div>
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#a8a29e', textTransform: 'uppercase' }}>Poin</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{user?.points || 0}</p>
              </div>
            </div>
            <div style={s.statCard}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Trophy size={18} color="#92400e" />
              </div>
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#a8a29e', textTransform: 'uppercase' }}>Badge</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{user?.badges?.length || 0}</p>
              </div>
            </div>
            <div style={s.statCard}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ede9fe', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Award size={18} color="#5b21b6" />
              </div>
              <div>
                <p style={{ fontSize: '10px', fontWeight: 700, color: '#a8a29e', textTransform: 'uppercase' }}>Sertifikat</p>
                <p style={{ fontSize: '1.1rem', fontWeight: 700 }}>{certificates.length || 0}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
          {[
            { id: 'overview', label: 'Ringkasan', icon: <TrendingUp size={16} /> },
            { id: 'badges', label: 'Badge', icon: <Trophy size={16} /> },
            { id: 'certificates', label: 'Sertifikat', icon: <Award size={16} /> }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                ...s.btn,
                background: activeTab === tab.id ? '#1c1917' : 'transparent',
                color: activeTab === tab.id ? '#fff' : '#78716c',
                border: '1px solid',
                borderColor: activeTab === tab.id ? '#1c1917' : '#e7e5e4',
              }}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="animate-in fade-in duration-500">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div style={s.card}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <BookOpen size={18} color="#9f1239" /> Statistik Belajar
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: 'Modul Lulus', value: user?.completedModules?.length || 0, bg: '#fff1f2', color: '#9f1239' },
                    { label: 'Rata-rata Skor', value: '95', bg: '#f0faf9', color: '#3f6b6c' },
                  ].map((item, i) => (
                    <div key={i} style={{ padding: '1rem', borderRadius: '16px', background: item.bg, textAlign: 'center' }}>
                      <p style={{ fontSize: '1.5rem', fontWeight: 700, color: item.color }}>{item.value}</p>
                      <p style={{ fontSize: '10px', fontWeight: 700, color: item.color, opacity: 0.7 }}>{item.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div style={s.card}>
                <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={18} color="#9f1239" /> Aktivitas Terbaru
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {[
                    { icon: '🎉', title: 'Lulus Kuis', date: 'Terbaru', points: '+50' },
                    { icon: '✅', title: 'Materi Selesai', date: 'Kemarin', points: '+10' },
                  ].map((act, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: i === 1 ? 'none' : '1px solid #f5f5f4', paddingBottom: i === 1 ? 0 : '0.75rem' }}>
                      <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#faf9f8', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{act.icon}</div>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '0.85rem', fontWeight: 600 }}>{act.title}</p>
                        <p style={{ fontSize: '11px', color: '#a8a29e' }}>{act.date}</p>
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#9f1239' }}>{act.points}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'badges' && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {badges.map(badge => (
                <div key={badge.id} style={{ ...s.card, textAlign: 'center' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '20px', background: badge.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', margin: '0 auto 1rem' }}>
                    {badge.icon}
                  </div>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 700 }}>{badge.name}</h4>
                  <p style={{ fontSize: '0.75rem', color: '#78716c' }}>{badge.description}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'certificates' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {!(user?.fullName && user?.address && user?.phone) && (
                <div style={{ ...s.card, background: '#fff9f9', borderColor: '#fecdd3', padding: '1rem 1.5rem', marginBottom: '1rem' }}>
                  <p style={{ color: '#991b1b', fontSize: '0.85rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ⚠️ Profil belum lengkap. Lengkapi Nama Lengkap, Alamat, dan No. HP untuk mengaktifkan unduh sertifikat.
                  </p>
                </div>
              )}
              
              {certificates.length === 0 ? (
                <div style={{ ...s.card, textAlign: 'center', padding: '3rem 1rem' }}>
                  <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
                  <h4 style={{ fontWeight: 700, marginBottom: '0.5rem' }}>Belum Ada Sertifikat</h4>
                  <p style={{ fontSize: '0.85rem', color: '#78716c' }}>Selesaikan modul dan lulus kuis untuk mendapatkan sertifikat.</p>
                  <Link to="/dashboard" style={{ ...s.btn, background: '#1c1917', color: '#fff', margin: '1.5rem auto 0', width: 'fit-content' }}>
                    Mulai Belajar
                  </Link>
                </div>
              ) : (
                certificates.map(cert => (
                  <div key={cert.id} style={{ ...s.card, padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', opacity: (user?.fullName && user?.address && user?.phone) ? 1 : 0.6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5b21b6' }}>
                        <Award size={24} />
                      </div>
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 700 }}>{cert.module}</h4>
                        <p style={{ fontSize: '11px', color: '#a8a29e' }}>Diterbitkan: {new Date(cert.date).toLocaleDateString('id-ID')}</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => downloadCertificate(cert)}
                      disabled={isDownloading === cert.id}
                      style={{ 
                        ...s.btn, 
                        background: (user?.fullName && user?.address && user?.phone) ? '#f5f5f4' : '#f5f5f4', 
                        color: (user?.fullName && user?.address && user?.phone) ? '#1c1917' : '#a8a29e', 
                        border: '1px solid #e7e5e4',
                        cursor: (user?.fullName && user?.address && user?.phone) ? 'pointer' : 'not-allowed'
                      }}>
                      {isDownloading === cert.id ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />} 
                      Unduh
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        {/* Hidden Canvas for Certificate Generation */}
        <canvas ref={canvasRef} style={{ display: 'none' }} />

        {/* Edit Profile Modal */}
        {isEditModalOpen && (
          <div style={s.modal} onClick={() => setIsEditModalOpen(false)}>
            <div style={s.modalContent} className="p-6 sm:p-8" onClick={e => e.stopPropagation()}>
              <button 
                onClick={() => setIsEditModalOpen(false)}
                style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer', color: '#a8a29e' }}>
                <X size={20} />
              </button>
              
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>Edit Profil</h2>
              <p style={{ fontSize: '0.85rem', color: '#78716c', marginBottom: '2rem' }}>Lengkapi data diri Anda untuk keperluan sertifikat.</p>
              
              <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                <div>
                  <label style={s.inputLabel}>Nama Lengkap (Untuk Sertifikat)</label>
                  <div style={{ position: 'relative' }}>
                    <User size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a8a29e' }} />
                    <input 
                      style={{ ...s.input, paddingLeft: '40px' }}
                      placeholder="Contoh: Siti Rahayu"
                      value={formData.fullName}
                      onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={s.inputLabel}>Alamat Domisili</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a8a29e' }} />
                    <input 
                      style={{ ...s.input, paddingLeft: '40px' }}
                      placeholder="Alamat lengkap di desa"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label style={s.inputLabel}>Nomor WhatsApp/HP</label>
                  <div style={{ position: 'relative' }}>
                    <Phone size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#a8a29e' }} />
                    <input 
                      style={{ ...s.input, paddingLeft: '40px' }}
                      placeholder="0812xxxxxxx"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={isSaving}
                  style={{ ...s.btn, background: '#9f1239', color: '#fff', width: '100%', justifyContent: 'center', marginTop: '1rem', padding: '14px' }}>
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