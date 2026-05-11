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

const initialModuleForm = {
  title: '',
  description: '',
  icon: '📘',
  color: 'primary',
  lessonsText: '',
  quizText: ''
};

const initialAiModuleForm = {
  topic: '',
  targetLevel: 'Pemula',
  learningGoal: '',
  lessonCount: 3
};

const initialResetForm = {
  targetEmail: '',
  newPassword: ''
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
  const [resetForm, setResetForm] = useState(initialResetForm);
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
    const lessons = normalizeLessonsFromText(moduleForm.lessonsText);
    const quizQuestions = normalizeQuizFromText(moduleForm.quizText);

    if (!title || !description || lessons.length < 3 || quizQuestions.length < 3) {
      setErrorMessage('Judul, deskripsi, minimal 3 pelajaran, dan minimal 3 soal kuis wajib diisi.');
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
    const lTxt = (mod.lessons || []).map(l => `${l.title} | ${l.duration} | ${l.content}`).join('\n');
    const qTxt = (mod.quizQuestions || []).map(q => 
      `${q.question} | ${q.options[0]} | ${q.options[1]} | ${q.options[2]} | ${q.options[3]} | ${q.correctAnswer} | ${q.explanation}`
    ).join('\n');

    setModuleForm({
      title: mod.title,
      description: mod.description,
      icon: mod.icon || '📘',
      color: mod.color || 'primary',
      lessonsText: lTxt,
      quizText: qTxt
    });
    window.scrollTo({ top: 600, behavior: 'smooth' });
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

  const handleResetPasswordInput = (event) => {
    const { name, value } = event.target;
    setResetForm((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResetUserPassword = async (event) => {
    event.preventDefault();

    if (!isSuperAdmin) {
      setErrorMessage('Fitur reset password hanya untuk admin utama.');
      return;
    }

    const targetEmail = resetForm.targetEmail.trim();
    const newPassword = resetForm.newPassword.trim();

    if (!targetEmail || !newPassword) {
      setErrorMessage('Email user dan password baru wajib diisi.');
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
        body: JSON.stringify({ targetEmail, newPassword })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Gagal reset password user.');
      }

      setResetForm(initialResetForm);
      setSuccessMessage('Password user berhasil diubah oleh admin utama.');
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

            {isSuperAdmin && (
              <div style={{...S.card, background:'#fff9f9', borderColor:'#fecdd3'}}>
                <h2 style={{fontFamily:"'Playfair Display', serif", fontSize:'1.1rem', color:'#1c1917', fontWeight:600, marginBottom:'4px'}}>Reset Password User</h2>
                <p style={{fontSize:'12px', color:'#a8a29e', marginBottom:'1rem'}}>Khusus admin utama untuk membantu user yang lupa password.</p>
                <form onSubmit={handleResetUserPassword} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
                  <input type="email" name="targetEmail" value={resetForm.targetEmail} onChange={handleResetPasswordInput} placeholder="Email user" style={S.input} />
                  <input type="text" name="newPassword" value={resetForm.newPassword} onChange={handleResetPasswordInput} placeholder="Password baru (min 8 karakter)" style={S.input} />
                  <button type="submit" disabled={isResettingPassword} style={{...S.btn, background:'#fff1f2', color:'#9f1239', border:'1px solid #fecdd3'}}>
                    {isResettingPassword ? 'Memproses...' : 'Ubah Password User'}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Add Module Manual + AI Module */}
        <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1.5rem', marginBottom:'1.5rem'}}>

          {/* Manual Module */}
          <div style={S.card}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1rem'}}>
              <h2 style={{fontFamily:"'Playfair Display', serif", fontSize:'1.15rem', color:'#1c1917', fontWeight:600}}>{editingModuleId ? 'Edit Modul' : 'Tambah Modul Manual'}</h2>
              {editingModuleId && (
                <button onClick={handleCancelEdit} style={{fontSize:'11px', color:'#9f1239', fontWeight:700, background:'none', border:'none', cursor:'pointer'}}>Batal Edit</button>
              )}
            </div>
            <div style={{background:'#fffbeb', border:'1px solid #fde68a', borderRadius:'12px', padding:'12px', marginBottom:'1rem', fontSize:'12px', color:'#92400e'}}>
              <p><strong>Format pelajaran (per baris):</strong> Judul | Durasi | Konten</p>
              <p style={{marginTop:'4px'}}><strong>Format kuis (per baris):</strong> Pertanyaan | OpsiA | B | C | D | IndexBenar(0-3) | Penjelasan</p>
            </div>
            <form onSubmit={handleAddManualModule} style={{display:'flex', flexDirection:'column', gap:'10px'}}>
              <input name="title" value={moduleForm.title} onChange={handleModuleInputChange} placeholder="Judul modul" style={S.input} />
              <input name="description" value={moduleForm.description} onChange={handleModuleInputChange} placeholder="Deskripsi modul" style={S.input} />
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px'}}>
                <input name="icon" value={moduleForm.icon} onChange={handleModuleInputChange} placeholder="Ikon" style={S.input} />
                <select name="color" value={moduleForm.color} onChange={handleModuleInputChange} style={S.input}>
                  <option value="primary">primary (merah)</option>
                  <option value="teal">teal (hijau)</option>
                  <option value="coral">coral (orange)</option>
                  <option value="indigo">indigo (biru)</option>
                  <option value="rose">rose (pink)</option>
                  <option value="amber">amber (kuning)</option>
                </select>
              </div>
              <textarea name="lessonsText" value={moduleForm.lessonsText} onChange={handleModuleInputChange} placeholder="Dasar Kewirausahaan | 15 menit | Materi pembuka..." style={{...S.input, minHeight:'90px', resize:'vertical'}} />
              <textarea name="quizText" value={moduleForm.quizText} onChange={handleModuleInputChange} placeholder="Apa itu modal? | Tabungan | Dana | Listrik | Pajak | 1 | Modal adalah..." style={{...S.input, minHeight:'90px', resize:'vertical'}} />
              <button type="submit" disabled={isSubmittingModule} style={{...S.btn, background: isSubmittingModule ? '#e7e5e4' : (editingModuleId ? '#4338ca' : '#065f46'), color:'#fff'}}>
                {isSubmittingModule ? 'Menyimpan...' : (editingModuleId ? 'Update Modul' : 'Simpan Modul Manual')}
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

          {/* Modules List */}
          <div style={S.card}>
            <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.25rem'}}>
              <h2 style={{fontFamily:"'Playfair Display', serif", fontSize:'1.15rem', color:'#1c1917', fontWeight:600}}>Modul Tersimpan</h2>
              <button 
                onClick={handleSyncModules} 
                disabled={isSyncingModules}
                style={{fontSize:'10px', fontWeight:700, background:'#f0fdf4', color:'#065f46', border:'1px solid #a7f3d0', padding:'6px 12px', borderRadius:'10px', cursor:'pointer'}}
              >
                {isSyncingModules ? 'Sinkronisasi...' : 'Sinkron Modul Sistem'}
              </button>
            </div>
            <div style={{display:'flex', flexDirection:'column', gap:'10px', maxHeight:'400px', overflowY:'auto'}}>
              {modules.length === 0 && <p style={{textAlign:'center', color:'#a8a29e', padding:'2rem', fontSize:'14px'}}>Belum ada modul buatan admin.</p>}
              {modules.map(item => (
                <div key={item.id} style={{borderRadius:'14px', border:'1px solid #f5f5f4', padding:'14px', background:'#fafaf9', position:'relative'}}>
                  <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'6px'}}>
                    <p style={{fontWeight:600, color:'#1c1917'}}>{item.icon || '📘'} {item.title}</p>
                    <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
                      <span style={{fontSize:'10px', padding:'3px 10px', borderRadius:'999px', background:'#d1fae5', color:'#065f46', fontWeight:700}}>{item.status || 'approved'}</span>
                      <button onClick={() => handleEditModule(item)} style={{fontSize:'10px', fontWeight:700, color:'#4338ca', background:'#eef2ff', border:'1px solid #c7d2fe', padding:'3px 10px', borderRadius:'999px', cursor:'pointer'}}>Edit</button>
                    </div>
                  </div>
                  <p style={{fontSize:'12px', color:'#78716c', marginBottom:'8px'}}>{item.description}</p>
                  <div style={{display:'flex', justifyContent:'space-between', fontSize:'11px', color:'#a8a29e', fontWeight:700}}>
                    <span style={{color:'#5b21b6'}}>{item.lessons?.length || 0} Pelajaran</span>
                    <span>{formatTimestamp(item.createdAt)}</span>
                  </div>
                </div>
              ))}
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