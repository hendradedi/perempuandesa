import { useEffect, useMemo, useState } from 'react';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useAuth } from '../../context/useAuth';
import { learningModules } from '../../data/learningModules';

const initialMaterialForm = {
  title: '',
  description: '',
  duration: '',
  content: ''
};

const initialLesson = () => ({
  title: '',
  duration: '15 menit',
  content: '',
  keyPoints: '',
  tips: ''
});

const initialModuleForm = {
  title: '',
  description: '',
  icon: '📘',
  color: 'primary',
  lessons: [initialLesson()],
  quizText: ''
};

const initialAiModuleForm = {
  topic: '',
  targetLevel: 'Pemula',
  learningGoal: '',
  lessonCount: 3
};



const formatTimestamp = (rawTimestamp) => {
  if (!rawTimestamp || !rawTimestamp.toDate) {
    return '-';
  }

  return rawTimestamp.toDate().toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
};

const normalizeLessonsFromText = (rawText) => {
  const lines = rawText.split('\n').map((item) => item.trim()).filter(Boolean);

  return lines.map((line, index) => {
    const [title, duration, content] = line.split('|').map((item) => item.trim());

    return {
      id: index + 1,
      title: title || `Pelajaran ${index + 1}`,
      duration: duration || '15 menit',
      content: content || 'Materi sedang dipersiapkan admin.'
    };
  });
};

const normalizeQuizFromText = (rawText) => {
  const lines = rawText.split('\n').map((item) => item.trim()).filter(Boolean);

  return lines.map((line) => {
    const [question, optionA, optionB, optionC, optionD, correctIndexRaw, explanation] = line.split('|').map((item) => item.trim());
    const correctAnswer = Number(correctIndexRaw);

    return {
      question: question || 'Pertanyaan kuis',
      options: [optionA, optionB, optionC, optionD].map((item, idx) => item || `Pilihan ${idx + 1}`),
      correctAnswer: Number.isInteger(correctAnswer) && correctAnswer >= 0 && correctAnswer <= 3 ? correctAnswer : 0,
      explanation: explanation || 'Penjelasan jawaban disiapkan admin.'
    };
  });
};

const normalizeLessonsFromForm = (formLessons) => {
  return formLessons.map((l, index) => ({
    id: index + 1,
    title: l.title.trim() || `Pelajaran ${index + 1}`,
    duration: l.duration.trim() || '15 menit',
    content: l.content.trim() || 'Materi sedang dipersiapkan.',
    keyPoints: l.keyPoints
      ? l.keyPoints.split('\n').map(k => k.trim()).filter(Boolean)
      : [],
    tips: l.tips.trim() || ''
  }));
};

const normalizeModuleDraft = (draft, createdBy, createdByName) => {
  const normalizedLessons = (draft.lessons || []).map((lesson, index) => ({
    id: index + 1,
    title: lesson.title || `Pelajaran ${index + 1}`,
    duration: lesson.duration || '15 menit',
    content: lesson.content || 'Materi sedang dipersiapkan.',
    keyPoints: Array.isArray(lesson.keyPoints) ? lesson.keyPoints : [],
    tips: lesson.tips || ''
  }));

  const normalizedQuiz = (draft.quizQuestions || []).slice(0, 3).map((question) => ({
    question: question.question || 'Pertanyaan kuis',
    options: Array.isArray(question.options) && question.options.length >= 4
      ? question.options.slice(0, 4)
      : ['Pilihan 1', 'Pilihan 2', 'Pilihan 3', 'Pilihan 4'],
    correctAnswer: Number.isInteger(question.correctAnswer) && question.correctAnswer >= 0 && question.correctAnswer <= 3
      ? question.correctAnswer
      : 0,
    explanation: question.explanation || 'Penjelasan jawaban.'
  }));

  return {
    title: draft.title || 'Modul Baru',
    description: draft.description || 'Deskripsi modul dari AI',
    icon: draft.icon || '📘',
    color: ['primary', 'teal', 'coral', 'indigo', 'rose', 'amber'].includes(draft.color) ? draft.color : 'primary',
    lessons: normalizedLessons,
    quizQuestions: normalizedQuiz,
    improvementNotes: Array.isArray(draft.improvementNotes) ? draft.improvementNotes : [],
    source: 'admin',
    status: 'approved',
    createdBy,
    createdByName,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  };
};

const AdminPanel = ({ isSuperAdmin }) => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [materialForm, setMaterialForm] = useState(initialMaterialForm);
  const [moduleForm, setModuleForm] = useState(initialModuleForm);
  const [aiModuleForm, setAiModuleForm] = useState(initialAiModuleForm);
  const [isSubmittingMaterial, setIsSubmittingMaterial] = useState(false);
  const [isSubmittingModule, setIsSubmittingModule] = useState(false);
  const [isGeneratingModule, setIsGeneratingModule] = useState(false);
  const [isApprovingDraft, setIsApprovingDraft] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [updatingUserId, setUpdatingUserId] = useState('');
  const [aiModuleDraft, setAiModuleDraft] = useState(null);
  const [editingModuleId, setEditingModuleId] = useState(null);
  const [isSyncingModules, setIsSyncingModules] = useState(false);
  const [certTemplateUrl, setCertTemplateUrl] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  const adminStats = useMemo(() => {
    const totalUsers = users.length;
    const activeUsers = users.filter((item) => item.active !== false).length;
    const adminUsers = users.filter((item) => item.role === 'admin').length;
    const assistantAdmins = users.filter((item) => item.role === 'assistant_admin').length;

    return {
      totalUsers,
      activeUsers,
      adminUsers,
      assistantAdmins,
      totalMaterials: materials.length,
      totalModules: modules.length
    };
  }, [users, materials, modules]);

  const fetchAdminData = async () => {
    setLoading(true);
    setErrorMessage('');

    try {
      const [usersSnapshot, materialsSnapshot, modulesSnapshot] = await Promise.all([
        getDocs(query(collection(db, 'users'), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'materials'), orderBy('createdAt', 'desc'))),
        getDocs(query(collection(db, 'modules'), orderBy('createdAt', 'desc')))
      ]);

      const nextUsers = usersSnapshot.docs.map((item) => ({
        id: item.id,
        ...item.data(),
        role: item.data().role || 'user',
        active: item.data().active !== false
      }));

      const nextMaterials = materialsSnapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }));

      const nextModules = modulesSnapshot.docs.map((item) => ({
        id: item.id,
        ...item.data()
      }));

      // Fetch settings
      const settingsSnap = await getDocs(query(collection(db, 'settings'), limit(1)));
      if (!settingsSnap.empty) {
        setCertTemplateUrl(settingsSnap.docs[0].data().certTemplate || '');
      }

      setUsers(nextUsers);
      setMaterials(nextMaterials);
      setModules(nextModules);
    } catch (error) {
      console.error('Error fetching data:', error);
      setErrorMessage('Gagal memuat data admin. Cek izin Firestore Anda.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const clearMessages = () => {
    setErrorMessage('');
    setSuccessMessage('');
  };

  const handleMaterialInputChange = (event) => {
    const { name, value } = event.target;
    setMaterialForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleModuleInputChange = (event) => {
    const { name, value } = event.target;
    setModuleForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAiModuleInputChange = (event) => {
    const { name, value } = event.target;
    setAiModuleForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleAddMaterial = async (event) => {
    event.preventDefault();

    const title = materialForm.title.trim();
    const description = materialForm.description.trim();
    const duration = materialForm.duration.trim();
    const content = materialForm.content.trim();

    if (!title || !description || !content) {
      setErrorMessage('Judul, deskripsi, dan isi materi wajib diisi.');
      return;
    }

    setIsSubmittingMaterial(true);
    clearMessages();

    try {
      await addDoc(collection(db, 'materials'), {
        title,
        description,
        duration: duration || '10 menit',
        content,
        createdBy: user?.uid || '',
        createdByName: user?.name || user?.email || 'Admin',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setMaterialForm(initialMaterialForm);
      setSuccessMessage('Materi baru berhasil ditambahkan.');
      await fetchAdminData();
    } catch {
      setErrorMessage('Materi gagal ditambahkan. Cek aturan akses Firestore.');
    } finally {
      setIsSubmittingMaterial(false);
    }
  };

  const addModuleToFirestore = async (modulePayload) => {
    await addDoc(collection(db, 'modules'), {
      ...modulePayload,
      source: 'admin',
      status: 'approved'
    });
  };

  const handleAddManualModule = async (event) => {
    event.preventDefault();
    clearMessages();

    const title = moduleForm.title.trim();
    const description = moduleForm.description.trim();
    const lessons = normalizeLessonsFromForm(moduleForm.lessons);
    const quizQuestions = normalizeQuizFromText(moduleForm.quizText);

    if (!title || !description || lessons.length < 1) {
      setErrorMessage('Judul, deskripsi, dan minimal 1 pelajaran wajib diisi.');
      return;
    }

    setIsSubmittingModule(true);

    try {
      const payload = {
        title,
        description,
        icon: moduleForm.icon || '📘',
        color: ['primary', 'teal', 'coral', 'indigo', 'rose', 'amber'].includes(moduleForm.color) ? moduleForm.color : 'primary',
        lessons,
        quizQuestions,
        updatedAt: serverTimestamp()
      };

      if (editingModuleId) {
        await updateDoc(doc(db, 'modules', editingModuleId), payload);
        setSuccessMessage('Modul berhasil diperbarui.');
      } else {
        await addDoc(collection(db, 'modules'), {
          ...payload,
          status: 'approved',
          createdBy: user?.uid || '',
          createdByName: user?.name || user?.email || 'Admin',
          createdAt: serverTimestamp()
        });
        setSuccessMessage('Modul manual berhasil ditambahkan.');
      }

      setModuleForm(initialModuleForm);
      setEditingModuleId(null);
      await fetchAdminData();
    } catch {
      setErrorMessage(editingModuleId ? 'Gagal memperbarui modul.' : 'Gagal menambahkan modul.');
    } finally {
      setIsSubmittingModule(false);
    }
  };

  const handleEditModule = (mod) => {
    setEditingModuleId(mod.id);
    const qTxt = (mod.quizQuestions || []).map(q =>
      `${q.question} | ${(q.options||[]).join(' | ')} | ${q.correctAnswer} | ${q.explanation}`
    ).join('\n');

    const formLessons = (mod.lessons || []).map(l => ({
      title: l.title || '',
      duration: l.duration || '15 menit',
      content: l.content || '',
      keyPoints: Array.isArray(l.keyPoints) ? l.keyPoints.join('\n') : (l.keyPoints || ''),
      tips: l.tips || ''
    }));

    setModuleForm({
      title: mod.title || '',
      description: mod.description || '',
      icon: mod.icon || '📘',
      color: mod.color || 'primary',
      lessons: formLessons.length > 0 ? formLessons : [initialLesson()],
      quizText: qTxt
    });
    // Scroll to the edit form
    setTimeout(() => {
      document.getElementById('module-editor')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleLessonChange = (index, field, value) => {
    setModuleForm(prev => {
      const lessons = [...prev.lessons];
      lessons[index] = { ...lessons[index], [field]: value };
      return { ...prev, lessons };
    });
  };

  const handleAddLesson = () => {
    setModuleForm(prev => ({ ...prev, lessons: [...prev.lessons, initialLesson()] }));
  };

  const handleRemoveLesson = (index) => {
    setModuleForm(prev => ({ ...prev, lessons: prev.lessons.filter((_, i) => i !== index) }));
  };

  const handleCancelEdit = () => {
    setEditingModuleId(null);
    setModuleForm(initialModuleForm);
  };

  const handleSyncModules = async () => {
    if (!window.confirm('Sinkronisasi akan memindahkan modul sistem ke database agar bisa diedit. Lanjutkan?')) return;
    setIsSyncingModules(true);
    clearMessages();
    try {
      let count = 0;
      for (const mod of learningModules) {
        const exists = modules.find(m => m.title === mod.title);
        if (!exists) {
          await addDoc(collection(db, 'modules'), {
            ...mod,
            source: 'system',
            status: 'approved',
            createdBy: user?.uid,
            createdByName: 'System Sync',
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          count++;
        }
      }
      setSuccessMessage(`Berhasil sinkronisasi ${count} modul baru ke database.`);
      await fetchAdminData();
    } catch {
      setErrorMessage('Gagal melakukan sinkronisasi modul.');
    } finally {
      setIsSyncingModules(false);
    }
  };

  const handleGenerateModuleDraft = async (event) => {
    event.preventDefault();
    clearMessages();

    if (!aiModuleForm.topic.trim()) {
      setErrorMessage('Topik modul wajib diisi.');
      return;
    }

    setIsGeneratingModule(true);

    try {
      const response = await fetch('/api/ai-generate-module', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          topic: aiModuleForm.topic,
          targetLevel: aiModuleForm.targetLevel,
          learningGoal: aiModuleForm.learningGoal,
          lessonCount: Number(aiModuleForm.lessonCount) || 3
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'AI gagal menyusun draft modul.');
      }

      setAiModuleDraft(data.moduleDraft || null);
      setSuccessMessage('Draft modul dari AI siap direview dan disetujui.');
    } catch (error) {
      setErrorMessage(error.message || 'Terjadi kesalahan saat generate modul AI.');
    } finally {
      setIsGeneratingModule(false);
    }
  };

  const handleApproveAiDraft = async () => {
    if (!aiModuleDraft) {
      return;
    }

    clearMessages();
    setIsApprovingDraft(true);

    try {
      const payload = normalizeModuleDraft(
        aiModuleDraft,
        user?.uid || '',
        user?.name || user?.email || 'Admin'
      );

      await addModuleToFirestore(payload);
      setAiModuleDraft(null);
      setSuccessMessage('Draft modul AI disetujui dan disimpan.');
      await fetchAdminData();
    } catch {
      setErrorMessage('Gagal menyetujui draft modul AI.');
    } finally {
      setIsApprovingDraft(false);
    }
  };

  const updateUserField = async (targetUser, nextData) => {
    setUpdatingUserId(targetUser.id);
    clearMessages();

    try {
      await updateDoc(doc(db, 'users', targetUser.id), {
        ...nextData,
        updatedAt: serverTimestamp()
      });

      setSuccessMessage('Data pengguna berhasil diperbarui.');
      await fetchAdminData();
    } catch {
      setErrorMessage('Perubahan pengguna gagal disimpan.');
    } finally {
      setUpdatingUserId('');
    }
  };

  const handleRoleChange = async (targetUser, nextRole) => {
    if (!isSuperAdmin) {
      setErrorMessage('Hanya admin utama yang dapat mengubah role pengguna.');
      return;
    }

    if (targetUser.id === user?.uid && nextRole !== 'admin') {
      setErrorMessage('Admin utama tidak bisa menurunkan role akun sendiri.');
      return;
    }

    await updateUserField(targetUser, { role: nextRole });
  };

  const toggleActive = async (targetUser) => {
    if (!isSuperAdmin) {
      setErrorMessage('Hanya admin utama yang dapat mengaktif/nonaktifkan akun.');
      return;
    }

    if (targetUser.id === user?.uid && targetUser.active !== false) {
      setErrorMessage('Admin aktif tidak bisa menonaktifkan akun sendiri.');
      return;
    }

    await updateUserField(targetUser, { active: !(targetUser.active !== false) });
  };



  const handleResetUserPassword = async (targetEmail) => {
    if (!isSuperAdmin) {
      setErrorMessage('Fitur reset password hanya untuk admin utama.');
      return;
    }

    const newPassword = window.prompt(`Masukkan password baru untuk ${targetEmail} (min 8 karakter):`);
    
    if (newPassword === null) return; // Cancelled
    
    if (newPassword.trim().length < 8) {
      setErrorMessage('Password baru minimal 8 karakter.');
      return;
    }

    setIsResettingPassword(true);
    clearMessages();

    try {
      const idToken = await auth.currentUser?.getIdToken();

      if (!idToken) {
        throw new Error('Token admin tidak ditemukan. Silakan login ulang.');
      }

      const response = await fetch('/api/admin-reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`
        },
        body: JSON.stringify({ targetEmail: targetEmail.trim(), newPassword: newPassword.trim() })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Gagal reset password user.');
      }

      setSuccessMessage(`Password untuk ${targetEmail} berhasil diperbarui.`);
    } catch (error) {
      setErrorMessage(error.message || 'Terjadi kesalahan saat reset password user.');
    } finally {
      setIsResettingPassword(false);
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    clearMessages();
    try {
      const settingsSnap = await getDocs(query(collection(db, 'settings'), limit(1)));
      if (!settingsSnap.empty) {
        await updateDoc(doc(db, 'settings', settingsSnap.docs[0].id), {
          certTemplate: certTemplateUrl,
          updatedAt: serverTimestamp()
        });
      } else {
        await addDoc(collection(db, 'settings'), {
          certTemplate: certTemplateUrl,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        });
      }
      setSuccessMessage('Pengaturan sertifikat berhasil disimpan.');
    } catch (error) {
      console.error('Error saving settings:', error);
      setErrorMessage('Gagal menyimpan pengaturan.');
    } finally {
      setIsSavingSettings(false);
    }
  };

  const S = {
    page:    { minHeight:'100vh', background:'#faf9f8', fontFamily:"'Plus Jakarta Sans', sans-serif", color:'#1c1917' },
    wrap:    { maxWidth:'1280px', margin:'0 auto', padding:'3rem 2rem 5rem' },
    card:    { background:'#fff', borderRadius:'20px', border:'1px solid #f5f5f4', boxShadow:'0 2px 8px rgba(28,25,23,0.05)', padding:'1.75rem' },
    badge:   { display:'inline-flex', alignItems:'center', gap:'6px', background:'#f5f5f4', border:'1px solid #e7e5e4', borderRadius:'999px', padding:'4px 14px', fontSize:'11px', fontWeight:600, color:'#78716c', letterSpacing:'0.08em', textTransform:'uppercase', marginBottom:'1rem' },
    input:   { width:'100%', padding:'10px 14px', borderRadius:'12px', border:'1px solid #e7e5e4', fontSize:'0.875rem', outline:'none', fontFamily:'inherit', boxSizing:'border-box', background:'#fafaf9' },
    btn:     { width:'100%', padding:'12px', borderRadius:'12px', fontWeight:700, fontSize:'0.9rem', cursor:'pointer', border:'none', transition:'all 0.2s' },
    label:   { display:'block', fontSize:'11px', fontWeight:700, color:'#a8a29e', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'6px' },
  };

  if (loading) {
    return (
      <div style={{...S.page, display:'flex', alignItems:'center', justifyContent:'center'}}>
        <p style={{color:'#78716c'}}>Memuat data admin...</p>
      </div>
    );
  }

  return (
    <div style={S.page}>
      <div style={S.wrap}>

        {/* Header */}
        <div style={{marginBottom:'2.5rem'}}>
          <div style={S.badge}>Pusat Kontrol SELARAS</div>
          <h1 style={{fontFamily:"'Playfair Display', serif", fontSize:'clamp(1.8rem,4vw,2.8rem)', color:'#1c1917', marginBottom:'0.5rem', fontWeight:600}}>
            Panel <span style={{color:'#9f1239', fontStyle:'italic'}}>Admin</span>
          </h1>
          <p style={{color:'#78716c', fontWeight:300, fontSize:'1rem'}}>
            Kelola pengguna, materi, dan modul platform SELARAS. Asisten admin dapat menyusun modul dengan bantuan AI.
          </p>
        </div>

        {/* Stats Row */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:'1rem', marginBottom:'2rem'}}>
          {[
            { label:'Total Pengguna',   value: adminStats.totalUsers,      color:'#9f1239', bg:'#fff1f2' },
            { label:'Pengguna Aktif',   value: adminStats.activeUsers,     color:'#065f46', bg:'#d1fae5' },
            { label:'Admin Utama',      value: adminStats.adminUsers,      color:'#92400e', bg:'#fef3c7' },
            { label:'Asisten Admin',    value: adminStats.assistantAdmins, color:'#1e40af', bg:'#dbeafe' },
            { label:'Materi Tambahan',  value: adminStats.totalMaterials,  color:'#5b21b6', bg:'#ede9fe' },
            { label:'Modul Aktif',      value: adminStats.totalModules,    color:'#134e4a', bg:'#ccfbf1' },
          ].map((st,i) => (
            <div key={i} style={{...S.card, padding:'1.25rem'}}>
              <p style={{fontSize:'10px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.08em', color:'#a8a29e', marginBottom:'0.75rem'}}>{st.label}</p>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between'}}>
                <p style={{fontFamily:"'Playfair Display', serif", fontSize:'2rem', color:'#1c1917', lineHeight:1}}>{st.value}</p>
                <div style={{width:'36px', height:'36px', borderRadius:'10px', background:st.bg, display:'flex', alignItems:'center', justifyContent:'center'}}>
                  <div style={{width:'8px', height:'8px', borderRadius:'50%', background:st.color}}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Alerts */}
        {errorMessage && <div style={{marginBottom:'1rem', borderRadius:'12px', border:'1px solid #fecaca', background:'#fef2f2', padding:'12px 16px', fontSize:'0.875rem', color:'#991b1b'}}>{errorMessage}</div>}
        {successMessage && <div style={{marginBottom:'1.5rem', borderRadius:'12px', border:'1px solid #a7f3d0', background:'#f0fdf4', padding:'12px 16px', fontSize:'0.875rem', color:'#065f46'}}>{successMessage}</div>}

        {/* Row 1: Users table + Add Material */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 380px', gap:'1.5rem', marginBottom:'1.5rem', alignItems:'start'}}>

          {/* Users Table */}
          <div style={S.card}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem'}}>
              <h2 style={{fontFamily:"'Playfair Display', serif", fontSize:'1.2rem', color:'#1c1917', fontWeight:600}}>Pengguna Registrasi</h2>
              <button onClick={fetchAdminData} style={{padding:'8px 16px', borderRadius:'10px', border:'1px solid #e7e5e4', background:'#faf9f8', fontSize:'0.8rem', fontWeight:600, cursor:'pointer', color:'#57534e'}}>Refresh</button>
            </div>
            <div style={{overflowX:'auto'}}>
              <table style={{width:'100%', borderCollapse:'collapse', fontSize:'0.8rem'}}>
                <thead>
                  <tr style={{borderBottom:'2px solid #f5f5f4', textAlign:'left'}}>
                    {['Nama','Email','Role','Status','Poin','Aksi'].map(h => (
                      <th key={h} style={{padding:'10px 12px', fontSize:'10px', fontWeight:700, textTransform:'uppercase', letterSpacing:'0.06em', color:'#a8a29e'}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.length === 0 && (
                    <tr><td colSpan={6} style={{padding:'2rem', textAlign:'center', color:'#a8a29e'}}>Belum ada pengguna terdaftar.</td></tr>
                  )}
                  {users.map((item) => {
                    const userRole = item.role || 'user';
                    const userActive = item.active !== false;
                    const roleColor = userRole==='admin' ? {bg:'#fff1f2',color:'#9f1239'} : userRole==='assistant_admin' ? {bg:'#fef3c7',color:'#92400e'} : {bg:'#f5f5f4',color:'#57534e'};
                    return (
                      <tr key={item.id} style={{borderBottom:'1px solid #fafaf9'}}>
                        <td style={{padding:'12px'}}>
                          <p style={{fontWeight:600, color:'#1c1917'}}>{item.name || '-'}</p>
                          <p style={{fontSize:'11px', color:'#a8a29e'}}>{formatTimestamp(item.createdAt)}</p>
                        </td>
                        <td style={{padding:'12px', color:'#57534e', fontSize:'0.8rem'}}>{item.email || '-'}</td>
                        <td style={{padding:'12px'}}>
                          <span style={{padding:'3px 10px', borderRadius:'999px', fontSize:'11px', fontWeight:700, background:roleColor.bg, color:roleColor.color}}>{userRole}</span>
                        </td>
                        <td style={{padding:'12px'}}>
                          <span style={{padding:'3px 10px', borderRadius:'999px', fontSize:'11px', fontWeight:700, background: userActive ? '#d1fae5' : '#f5f5f4', color: userActive ? '#065f46' : '#78716c'}}>
                            {userActive ? 'Aktif' : 'Nonaktif'}
                          </span>
                        </td>
                        <td style={{padding:'12px', fontWeight:700, color:'#1c1917'}}>{item.points || 0}</td>
                        <td style={{padding:'12px'}}>
                          {isSuperAdmin ? (
                            <div style={{display:'flex', flexDirection:'column', gap:'6px', minWidth:'160px'}}>
                              <select value={userRole} onChange={(e) => handleRoleChange(item, e.target.value)} disabled={updatingUserId === item.id}
                                style={{...S.input, fontSize:'12px', padding:'6px 10px'}}>
                                <option value="user">User</option>
                                <option value="assistant_admin">Assistant Admin</option>
                                <option value="admin">Admin</option>
                              </select>
                              <button onClick={() => toggleActive(item)} disabled={updatingUserId === item.id}
                                style={{padding:'6px 10px', borderRadius:'8px', fontSize:'11px', fontWeight:700, cursor:'pointer', border:'1px solid', background: userActive ? '#fff1f2' : '#f0fdf4', color: userActive ? '#9f1239' : '#065f46', borderColor: userActive ? '#fecdd3' : '#a7f3d0'}}>
                                {userActive ? 'Nonaktifkan' : 'Aktifkan'}
                              </button>
                              <button onClick={() => handleResetUserPassword(item.email)} disabled={isResettingPassword}
                                style={{padding:'6px 10px', borderRadius:'8px', fontSize:'11px', fontWeight:700, cursor:'pointer', border:'1px solid #e7e5e4', background:'#fff', color:'#1c1917'}}>
                                🔐 Reset PW
                              </button>
                            </div>
                          ) : (
                            <span style={{fontSize:'12px', color:'#a8a29e', fontStyle:'italic'}}>Hanya lihat</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Material + Reset Password */}
          <div style={{display:'flex', flexDirection:'column', gap:'1.25rem'}}>
            <div style={S.card}>
              <h2 style={{fontFamily:"'Playfair Display', serif", fontSize:'1.15rem', color:'#1c1917', fontWeight:600, marginBottom:'1.25rem'}}>Tambah Materi</h2>
              <form onSubmit={handleAddMaterial} style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                {[
                  {name:'title', placeholder:'Judul materi', label:'Judul'},
                  {name:'description', placeholder:'Deskripsi singkat', label:'Deskripsi'},
                  {name:'duration', placeholder:'Contoh: 15 menit', label:'Durasi'},
                ].map(f => (
                  <div key={f.name}>
                    <label style={S.label}>{f.label}</label>
                    <input name={f.name} value={materialForm[f.name]} onChange={handleMaterialInputChange} placeholder={f.placeholder} style={S.input} />
                  </div>
                ))}
                <div>
                  <label style={S.label}>Isi Materi</label>
                  <textarea name="content" value={materialForm.content} onChange={handleMaterialInputChange} placeholder="Isi lengkap materi..." style={{...S.input, minHeight:'100px', resize:'vertical'}} />
                </div>
                <button type="submit" disabled={isSubmittingMaterial} style={{...S.btn, background: isSubmittingMaterial ? '#e7e5e4' : '#9f1239', color:'#fff'}}>
                  {isSubmittingMaterial ? 'Menyimpan...' : 'Simpan Materi'}
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Row 2: Add Module Manual + AI Module */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'1.5rem'}}>

          {/* Visual Module Editor */}
          <div id="module-editor" style={S.card}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem'}}>
              <h2 style={{fontFamily:"'Playfair Display', serif", fontSize:'1.15rem', color:'#1c1917', fontWeight:600}}>
                {editingModuleId ? '✏️ Edit Modul' : '➕ Tambah Modul Baru'}
              </h2>
              {editingModuleId && (
                <button onClick={handleCancelEdit} style={{fontSize:'11px', color:'#9f1239', fontWeight:700, background:'#fff1f2', border:'1px solid #fecdd3', borderRadius:'8px', padding:'5px 12px', cursor:'pointer'}}>✕ Batal Edit</button>
              )}
            </div>

            <form onSubmit={handleAddManualModule} style={{display:'flex', flexDirection:'column', gap:'14px'}}>
              {/* Meta Info */}
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                <div>
                  <label style={S.label}>Judul Modul</label>
                  <input name="title" value={moduleForm.title} onChange={handleModuleInputChange} placeholder="Nama modul..." style={S.input} required />
                </div>
                <div>
                  <label style={S.label}>Deskripsi Singkat</label>
                  <input name="description" value={moduleForm.description} onChange={handleModuleInputChange} placeholder="Deskripsi modul..." style={S.input} />
                </div>
              </div>
              <div style={{display:'grid', gridTemplateColumns:'80px 1fr', gap:'10px'}}>
                <div>
                  <label style={S.label}>Ikon</label>
                  <input name="icon" value={moduleForm.icon} onChange={handleModuleInputChange} style={{...S.input, textAlign:'center', fontSize:'1.5rem'}} />
                </div>
                <div>
                  <label style={S.label}>Warna Tema</label>
                  <select name="color" value={moduleForm.color} onChange={handleModuleInputChange} style={S.input}>
                    <option value="primary">🔴 primary (merah)</option>
                    <option value="teal">🟢 teal (hijau)</option>
                    <option value="coral">🟠 coral (orange)</option>
                    <option value="indigo">🔵 indigo (biru)</option>
                    <option value="rose">🌸 rose (pink)</option>
                    <option value="amber">🟡 amber (kuning)</option>
                  </select>
                </div>
              </div>

              {/* Lessons Editor */}
              <div>
                <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px'}}>
                  <label style={{...S.label, marginBottom:0}}>📚 Pelajaran ({moduleForm.lessons.length})</label>
                  <button type="button" onClick={handleAddLesson}
                    style={{fontSize:'11px', fontWeight:700, background:'#f0fdf4', color:'#065f46', border:'1px solid #a7f3d0', padding:'5px 12px', borderRadius:'8px', cursor:'pointer'}}>
                    + Tambah Pelajaran
                  </button>
                </div>

                <div style={{display:'flex', flexDirection:'column', gap:'12px'}}>
                  {moduleForm.lessons.map((lesson, idx) => (
                    <div key={idx} style={{border:'1px solid #e7e5e4', borderRadius:'16px', padding:'16px', background:'#fafaf9', position:'relative'}}>
                      <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px'}}>
                        <span style={{fontSize:'12px', fontWeight:700, color:'#9f1239', background:'#fff1f2', padding:'3px 10px', borderRadius:'999px'}}>Pelajaran {idx + 1}</span>
                        {moduleForm.lessons.length > 1 && (
                          <button type="button" onClick={() => handleRemoveLesson(idx)}
                            style={{fontSize:'11px', color:'#dc2626', background:'none', border:'none', cursor:'pointer', fontWeight:700}}>🗑 Hapus</button>
                        )}
                      </div>
                      <div style={{display:'grid', gridTemplateColumns:'1fr 130px', gap:'8px', marginBottom:'8px'}}>
                        <div>
                          <label style={S.label}>Judul Pelajaran</label>
                          <input value={lesson.title} onChange={e => handleLessonChange(idx, 'title', e.target.value)}
                            placeholder="Judul pelajaran..." style={S.input} />
                        </div>
                        <div>
                          <label style={S.label}>Durasi</label>
                          <input value={lesson.duration} onChange={e => handleLessonChange(idx, 'duration', e.target.value)}
                            placeholder="15 menit" style={S.input} />
                        </div>
                      </div>
                      <div style={{marginBottom:'8px'}}>
                        <label style={S.label}>Isi Materi</label>
                        <textarea value={lesson.content} onChange={e => handleLessonChange(idx, 'content', e.target.value)}
                          placeholder="Tulis isi materi pelajaran di sini..." rows={3}
                          style={{...S.input, resize:'vertical', minHeight:'80px'}} />
                      </div>
                      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'8px'}}>
                        <div>
                          <label style={S.label}>Poin Utama (satu per baris)</label>
                          <textarea value={lesson.keyPoints} onChange={e => handleLessonChange(idx, 'keyPoints', e.target.value)}
                            placeholder={`Poin 1\nPoin 2\nPoin 3`} rows={4}
                            style={{...S.input, resize:'vertical', minHeight:'80px'}} />
                        </div>
                        <div>
                          <label style={S.label}>Tips / Saran Belajar</label>
                          <textarea value={lesson.tips} onChange={e => handleLessonChange(idx, 'tips', e.target.value)}
                            placeholder="Saran atau tips menarik untuk peserta..." rows={4}
                            style={{...S.input, resize:'vertical', minHeight:'80px'}} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quiz */}
              <div>
                <label style={S.label}>🧠 Soal Kuis (per baris: Pertanyaan | OpsiA | B | C | D | IndexBenar | Penjelasan)</label>
                <div style={{background:'#fffbeb', border:'1px solid #fde68a', borderRadius:'10px', padding:'10px', marginBottom:'6px', fontSize:'11px', color:'#92400e'}}>
                  Contoh: <code>Apa itu hoax? | Fakta | Berita palsu | Berita viral | Gosip | 1 | Hoax adalah informasi palsu...</code>
                </div>
                <textarea name="quizText" value={moduleForm.quizText} onChange={handleModuleInputChange}
                  placeholder="Soal 1 | OpsiA | B | C | D | 0 | Penjelasan..." rows={5}
                  style={{...S.input, minHeight:'100px', resize:'vertical', fontFamily:'monospace', fontSize:'12px'}} />
              </div>

              <button type="submit" disabled={isSubmittingModule}
                style={{...S.btn, background: isSubmittingModule ? '#e7e5e4' : (editingModuleId ? '#4338ca' : '#065f46'), color:'#fff', fontSize:'1rem', padding:'14px'}}>
                {isSubmittingModule ? 'Menyimpan...' : (editingModuleId ? '💾 Simpan Perubahan Modul' : '✅ Simpan Modul Baru')}
              </button>
            </form>
          </div>

          {/* AI Module */}
          <div style={{...S.card, background:'linear-gradient(135deg, #fff 0%, #f5f3ff 100%)'}}>
            <h2 style={{fontFamily:"'Playfair Display', serif", fontSize:'1.15rem', color:'#1c1917', fontWeight:600, marginBottom:'4px'}}>
              Asisten Admin AI
            </h2>
            <p style={{fontSize:'12px', color:'#a8a29e', marginBottom:'1.25rem'}}>Penyusun modul otomatis menggunakan kecerdasan buatan.</p>
            <form onSubmit={handleGenerateModuleDraft} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
              <input name="topic" value={aiModuleForm.topic} onChange={handleAiModuleInputChange} placeholder="Topik modul" style={S.input} />
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                <input name="targetLevel" value={aiModuleForm.targetLevel} onChange={handleAiModuleInputChange} placeholder="Level peserta" style={S.input} />
                <input type="number" min={3} max={7} name="lessonCount" value={aiModuleForm.lessonCount} onChange={handleAiModuleInputChange} placeholder="Jumlah pelajaran" style={S.input} />
              </div>
              <input name="learningGoal" value={aiModuleForm.learningGoal} onChange={handleAiModuleInputChange} placeholder="Tujuan belajar" style={S.input} />
              <button type="submit" disabled={isGeneratingModule} style={{...S.btn, background:'#fff', color:'#5b21b6', border:'2px solid #ddd6fe'}}>
                {isGeneratingModule ? 'AI Menyusun Draft...' : 'Generate Draft Modul AI'}
              </button>
            </form>

            {aiModuleDraft && (
              <div style={{marginTop:'1.25rem', borderRadius:'14px', border:'1px solid #ddd6fe', background:'#fff', padding:'1rem'}}>
                <p style={{fontWeight:700, fontSize:'1rem', color:'#1c1917', marginBottom:'4px'}}>{aiModuleDraft.title}</p>
                <p style={{fontSize:'12px', color:'#78716c', marginBottom:'12px'}}>{aiModuleDraft.description}</p>
                <div style={{display:'flex', gap:'12px', fontSize:'12px', fontWeight:700, color:'#5b21b6', background:'#f5f3ff', borderRadius:'10px', padding:'10px', marginBottom:'12px'}}>
                  <span>Pelajaran: {aiModuleDraft?.lessons?.length || 0}</span>
                  <span>Soal: {aiModuleDraft?.quizQuestions?.length || 0}</span>
                </div>
                <button onClick={handleApproveAiDraft} disabled={isApprovingDraft} style={{...S.btn, background:'#5b21b6', color:'#fff'}}>
                  {isApprovingDraft ? 'Menyimpan...' : 'Setujui dan Simpan Modul'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Row 3: Materials list + Modules list */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem'}}>
          {/* Materials List */}
          <div style={S.card}>
            <h2 style={{fontFamily:"'Playfair Display', serif", fontSize:'1.15rem', color:'#1c1917', fontWeight:600, marginBottom:'1.25rem'}}>Materi Terbaru</h2>
            <div style={{display:'flex', flexDirection:'column', gap:'10px', maxHeight:'400px', overflowY:'auto'}}>
              {materials.length === 0 && <p style={{textAlign:'center', color:'#a8a29e', padding:'2rem', fontSize:'14px'}}>Belum ada materi tambahan.</p>}
              {materials.map(item => (
                <div key={item.id} style={{borderRadius:'14px', border:'1px solid #f5f5f4', padding:'14px', background:'#fafaf9'}}>
                  <p style={{fontWeight:600, color:'#1c1917', marginBottom:'4px'}}>{item.title}</p>
                  <p style={{fontSize:'12px', color:'#78716c', marginBottom:'8px'}}>{item.description}</p>
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:'11px', color:'#a8a29e', fontWeight:700}}>
                    <span>{item.duration || '10 menit'}</span>
                    <span>{formatTimestamp(item.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Modules List - all modules */}
          <div style={S.card}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem'}}>
              <h2 style={{fontFamily:"'Playfair Display', serif", fontSize:'1.15rem', color:'#1c1917', fontWeight:600}}>Semua Modul</h2>
              <button
                onClick={handleSyncModules}
                disabled={isSyncingModules}
                style={{fontSize:'10px', fontWeight:700, background:'#f0fdf4', color:'#065f46', border:'1px solid #a7f3d0', padding:'6px 12px', borderRadius:'10px', cursor:'pointer'}}
              >
                {isSyncingModules ? 'Sinkronisasi...' : '🔄 Sinkron Modul Sistem'}
              </button>
            </div>
            <p style={{fontSize:'11px', color:'#a8a29e', marginBottom:'1rem'}}>Klik <strong>Edit</strong> untuk mengubah modul. Modul bawaan sistem perlu di-sinkron dulu agar bisa diedit.</p>
            <div style={{display:'flex', flexDirection:'column', gap:'10px', maxHeight:'500px', overflowY:'auto'}}>
              {/* Firestore modules */}
              {modules.map(item => (
                <div key={item.id} style={{borderRadius:'14px', border:'1px solid #e7e5e4', padding:'14px', background:'#fff', position:'relative'}}>
                  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'6px'}}>
                    <p style={{fontWeight:600, color:'#1c1917'}}>{item.icon || '📘'} {item.title}</p>
                    <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                      <span style={{fontSize:'10px', padding:'3px 8px', borderRadius:'999px', background: item.source === 'ai' || item.source === 'admin' ? '#f5f3ff' : '#dbeafe', color: item.source === 'ai' || item.source === 'admin' ? '#5b21b6' : '#1e40af', fontWeight:700}}>
                        {item.source === 'ai' ? '🤖 AI' : item.source === 'system' ? '⚙️ Sistem' : '👤 Admin'}
                      </span>
                      <button onClick={() => handleEditModule(item)}
                        style={{fontSize:'10px', fontWeight:700, color:'#4338ca', background:'#eef2ff', border:'1px solid #c7d2fe', padding:'4px 12px', borderRadius:'999px', cursor:'pointer'}}>✏️ Edit</button>
                    </div>
                  </div>
                  <p style={{fontSize:'12px', color:'#78716c', marginBottom:'6px'}}>{item.description}</p>
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:'11px', color:'#a8a29e', fontWeight:700}}>
                    <span style={{color:'#5b21b6'}}>📖 {item.lessons?.length || 0} Pelajaran</span>
                    <span>{formatTimestamp(item.createdAt)}</span>
                  </div>
                </div>
              ))}
              {/* Static modules not yet synced */}
              {learningModules
                .filter(sm => !modules.some(cm => cm.title === sm.title))
                .map(sm => (
                  <div key={sm.id} style={{borderRadius:'14px', border:'1px dashed #e7e5e4', padding:'14px', background:'#faf9f8', opacity: 0.75}}>
                    <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'6px'}}>
                      <p style={{fontWeight:600, color:'#57534e'}}>{sm.icon} {sm.title}</p>
                      <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                        <span style={{fontSize:'10px', padding:'3px 8px', borderRadius:'999px', background:'#f5f5f4', color:'#78716c', fontWeight:700}}>📦 Bawaan</span>
                        <button
                          onClick={handleSyncModules}
                          disabled={isSyncingModules}
                          style={{fontSize:'10px', fontWeight:700, color:'#065f46', background:'#f0fdf4', border:'1px solid #a7f3d0', padding:'4px 10px', borderRadius:'999px', cursor:'pointer'}}>
                          Sinkron dulu
                        </button>
                      </div>
                    </div>
                    <p style={{fontSize:'12px', color:'#a8a29e'}}>{sm.description}</p>
                    <p style={{fontSize:'11px', color:'#a8a29e', fontWeight:700, marginTop:'4px'}}>📖 {sm.lessons?.length || 0} Pelajaran · Belum tersinkron ke database</p>
                  </div>
                ))
              }
              {modules.length === 0 && learningModules.length === 0 && (
                <p style={{textAlign:'center', color:'#a8a29e', padding:'2rem', fontSize:'14px'}}>Belum ada modul.</p>
              )}
            </div>
          </div>
        </div>

        {/* Row 4: Certificate Management */}
        <div style={{marginTop:'1.5rem'}}>
          <div style={{...S.card, background:'linear-gradient(to right, #fff, #faf9f8)'}}>
            <h2 style={{fontFamily:"'Playfair Display', serif", fontSize:'1.15rem', color:'#1c1917', fontWeight:600, marginBottom:'4px'}}>Manajemen Sertifikat</h2>
            <p style={{fontSize:'12px', color:'#78716c', marginBottom:'1.5rem'}}>Atur desain sertifikat yang akan otomatis memuat nama peserta saat diunduh.</p>
            
            <form onSubmit={handleSaveSettings} style={{display:'grid', gridTemplateColumns:'1fr 200px', gap:'1rem', alignItems:'end'}}>
              <div>
                <label style={S.label}>URL Template Sertifikat (Gambar PNG/JPG)</label>
                <input 
                  value={certTemplateUrl} 
                  onChange={(e) => setCertTemplateUrl(e.target.value)} 
                  placeholder="https://example.com/sertifikat-template.png" 
                  style={S.input} 
                />
              </div>
              <button type="submit" disabled={isSavingSettings} style={{...S.btn, background:'#1c1917', color:'#fff'}}>
                {isSavingSettings ? 'Menyimpan...' : 'Simpan Template'}
              </button>
            </form>

            {certTemplateUrl && (
              <div style={{marginTop:'1.5rem'}}>
                <p style={S.label}>Preview Template:</p>
                <div style={{borderRadius:'12px', overflow:'hidden', border:'1px solid #e7e5e4', maxWidth:'400px', background:'#f5f5f4'}}>
                  <img src={certTemplateUrl} alt="Template Preview" style={{width:'100%', display:'block'}} />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;