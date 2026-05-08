import { useEffect, useMemo, useState } from 'react';
import {
  addDoc,
  collection,
  doc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  updateDoc
} from 'firebase/firestore';
import { auth, db } from '../../config/firebase';
import { useAuth } from '../../context/useAuth';

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
    content: lesson.content || 'Materi sedang dipersiapkan.'
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
    color: ['primary', 'teal', 'coral'].includes(draft.color) ? draft.color : 'primary',
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

      setUsers(nextUsers);
      setMaterials(nextMaterials);
      setModules(nextModules);
    } catch {
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
      await addModuleToFirestore({
        title,
        description,
        icon: moduleForm.icon || '📘',
        color: ['primary', 'teal', 'coral'].includes(moduleForm.color) ? moduleForm.color : 'primary',
        lessons,
        quizQuestions,
        createdBy: user?.uid || '',
        createdByName: user?.name || user?.email || 'Admin',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      setModuleForm(initialModuleForm);
      setSuccessMessage('Modul manual berhasil ditambahkan.');
      await fetchAdminData();
    } catch {
      setErrorMessage('Modul manual gagal ditambahkan.');
    } finally {
      setIsSubmittingModule(false);
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

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <p className="text-slate-600">Memuat data admin...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-2">Panel Admin</h1>
          <p className="text-slate-600">
            Kelola registrasi pengguna, materi, dan modul. Asisten admin dapat membantu menyusun modul dengan AI.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-6 gap-4 mb-8">
          <div className="card">
            <p className="text-sm text-slate-600">Total Pengguna</p>
            <p className="text-3xl font-bold text-primary-700 mt-2">{adminStats.totalUsers}</p>
          </div>
          <div className="card">
            <p className="text-sm text-slate-600">Pengguna Aktif</p>
            <p className="text-3xl font-bold text-teal-600 mt-2">{adminStats.activeUsers}</p>
          </div>
          <div className="card">
            <p className="text-sm text-slate-600">Admin Utama</p>
            <p className="text-3xl font-bold text-coral-600 mt-2">{adminStats.adminUsers}</p>
          </div>
          <div className="card">
            <p className="text-sm text-slate-600">Asisten Admin</p>
            <p className="text-3xl font-bold text-amber-500 mt-2">{adminStats.assistantAdmins}</p>
          </div>
          <div className="card">
            <p className="text-sm text-slate-600">Materi Tambahan</p>
            <p className="text-3xl font-bold text-primary-700 mt-2">{adminStats.totalMaterials}</p>
          </div>
          <div className="card">
            <p className="text-sm text-slate-600">Modul Aktif</p>
            <p className="text-3xl font-bold text-teal-600 mt-2">{adminStats.totalModules}</p>
          </div>
        </div>

        {errorMessage && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {errorMessage}
          </div>
        )}
        {successMessage && (
          <div className="mb-6 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm text-teal-700">
            {successMessage}
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
          <section className="xl:col-span-3 card overflow-hidden">
            <div className="flex items-center justify-between mb-4 gap-3">
              <h2 className="text-xl font-bold text-slate-900">Pengguna Registrasi</h2>
              <button onClick={fetchAdminData} className="btn-outline !px-4 !py-2 text-sm">Refresh</button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[860px] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-600">
                    <th className="py-3 pr-3">Nama</th>
                    <th className="py-3 pr-3">Email</th>
                    <th className="py-3 pr-3">Role</th>
                    <th className="py-3 pr-3">Status</th>
                    <th className="py-3 pr-3">Poin</th>
                    <th className="py-3">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((item) => {
                    const userRole = item.role || 'user';
                    const userActive = item.active !== false;

                    return (
                      <tr key={item.id} className="border-b border-slate-100 align-top">
                        <td className="py-3 pr-3">
                          <p className="font-semibold text-slate-900">{item.name || '-'}</p>
                          <p className="text-xs text-slate-500">Dibuat: {formatTimestamp(item.createdAt)}</p>
                        </td>
                        <td className="py-3 pr-3 text-slate-700">{item.email || '-'}</td>
                        <td className="py-3 pr-3">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            userRole === 'admin'
                              ? 'bg-coral-100 text-coral-700'
                              : userRole === 'assistant_admin'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-primary-100 text-primary-700'
                          }`}>
                            {userRole}
                          </span>
                        </td>
                        <td className="py-3 pr-3">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            userActive ? 'bg-teal-100 text-teal-700' : 'bg-slate-200 text-slate-700'
                          }`}>
                            {userActive ? 'aktif' : 'nonaktif'}
                          </span>
                        </td>
                        <td className="py-3 pr-3 font-semibold text-slate-800">{item.points || 0}</td>
                        <td className="py-3">
                          {isSuperAdmin ? (
                            <div className="flex flex-col gap-2 min-w-44">
                              <select
                                value={userRole}
                                onChange={(event) => handleRoleChange(item, event.target.value)}
                                disabled={updatingUserId === item.id}
                                className="form-input !py-2 !px-3 text-xs"
                              >
                                <option value="user">user</option>
                                <option value="assistant_admin">assistant_admin</option>
                                <option value="admin">admin</option>
                              </select>
                              <button
                                onClick={() => toggleActive(item)}
                                disabled={updatingUserId === item.id}
                                className="btn-outline !px-3 !py-1.5 text-xs disabled:opacity-50"
                              >
                                {userActive ? 'Nonaktifkan' : 'Aktifkan'}
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-500">Asisten admin hanya dapat melihat data user.</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>

          <section className="xl:col-span-2 space-y-6">
            <div className="card">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Tambah Materi Baru</h2>
              <form onSubmit={handleAddMaterial} className="space-y-4">
                <div>
                  <label htmlFor="title" className="form-label">Judul Materi</label>
                  <input
                    id="title"
                    name="title"
                    value={materialForm.title}
                    onChange={handleMaterialInputChange}
                    className="form-input"
                    placeholder="Contoh: Strategi UMKM Rumahan"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="form-label">Deskripsi Singkat</label>
                  <input
                    id="description"
                    name="description"
                    value={materialForm.description}
                    onChange={handleMaterialInputChange}
                    className="form-input"
                    placeholder="Ringkasan manfaat materi"
                  />
                </div>

                <div>
                  <label htmlFor="duration" className="form-label">Durasi</label>
                  <input
                    id="duration"
                    name="duration"
                    value={materialForm.duration}
                    onChange={handleMaterialInputChange}
                    className="form-input"
                    placeholder="Contoh: 15 menit"
                  />
                </div>

                <div>
                  <label htmlFor="content" className="form-label">Isi Materi</label>
                  <textarea
                    id="content"
                    name="content"
                    value={materialForm.content}
                    onChange={handleMaterialInputChange}
                    className="form-input min-h-32 resize-y"
                    placeholder="Isi lengkap materi pembelajaran..."
                  />
                </div>

                <button type="submit" disabled={isSubmittingMaterial} className="btn-primary w-full disabled:opacity-50">
                  {isSubmittingMaterial ? 'Menyimpan...' : 'Simpan Materi'}
                </button>
              </form>
            </div>

            {isSuperAdmin && (
              <div className="card">
                <h2 className="text-lg font-bold text-slate-900 mb-3">Reset Password User</h2>
                <p className="text-xs text-slate-600 mb-4">Khusus admin utama untuk membantu user yang lupa password.</p>
                <form onSubmit={handleResetUserPassword} className="space-y-3">
                  <input
                    type="email"
                    name="targetEmail"
                    value={resetForm.targetEmail}
                    onChange={handleResetPasswordInput}
                    className="form-input"
                    placeholder="Email user"
                  />
                  <input
                    type="text"
                    name="newPassword"
                    value={resetForm.newPassword}
                    onChange={handleResetPasswordInput}
                    className="form-input"
                    placeholder="Password baru sementara (min 8 karakter)"
                  />
                  <button type="submit" className="btn-outline w-full" disabled={isResettingPassword}>
                    {isResettingPassword ? 'Memproses...' : 'Ubah Password User'}
                  </button>
                </form>
              </div>
            )}
          </section>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
          <section className="card">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Tambah Modul Manual</h2>
            <p className="text-sm text-slate-600 mb-4">Format pelajaran per baris: Judul | Durasi | Konten</p>
            <p className="text-sm text-slate-600 mb-4">Format kuis per baris: Pertanyaan | OpsiA | OpsiB | OpsiC | OpsiD | IndexBenar(0-3) | Penjelasan</p>

            <form onSubmit={handleAddManualModule} className="space-y-3">
              <input
                name="title"
                value={moduleForm.title}
                onChange={handleModuleInputChange}
                className="form-input"
                placeholder="Judul modul"
              />
              <input
                name="description"
                value={moduleForm.description}
                onChange={handleModuleInputChange}
                className="form-input"
                placeholder="Deskripsi modul"
              />

              <div className="grid grid-cols-2 gap-3">
                <input
                  name="icon"
                  value={moduleForm.icon}
                  onChange={handleModuleInputChange}
                  className="form-input"
                  placeholder="Ikon, contoh 📘"
                />
                <select name="color" value={moduleForm.color} onChange={handleModuleInputChange} className="form-input">
                  <option value="primary">primary</option>
                  <option value="teal">teal</option>
                  <option value="coral">coral</option>
                </select>
              </div>

              <textarea
                name="lessonsText"
                value={moduleForm.lessonsText}
                onChange={handleModuleInputChange}
                className="form-input min-h-32"
                placeholder="Dasar Kewirausahaan | 15 menit | Materi pembuka..."
              />
              <textarea
                name="quizText"
                value={moduleForm.quizText}
                onChange={handleModuleInputChange}
                className="form-input min-h-32"
                placeholder="Apa itu modal usaha? | Tabungan | Dana usaha | Biaya listrik | Pajak | 1 | Modal usaha adalah..."
              />

              <button type="submit" className="btn-primary w-full" disabled={isSubmittingModule}>
                {isSubmittingModule ? 'Menyimpan Modul...' : 'Simpan Modul Manual'}
              </button>
            </form>
          </section>

          <section className="card">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Asisten Admin AI (Penyusun Modul)</h2>
            <form onSubmit={handleGenerateModuleDraft} className="space-y-3">
              <input
                name="topic"
                value={aiModuleForm.topic}
                onChange={handleAiModuleInputChange}
                className="form-input"
                placeholder="Topik modul, contoh: Literasi Keuangan Keluarga"
              />
              <input
                name="targetLevel"
                value={aiModuleForm.targetLevel}
                onChange={handleAiModuleInputChange}
                className="form-input"
                placeholder="Level peserta"
              />
              <input
                name="learningGoal"
                value={aiModuleForm.learningGoal}
                onChange={handleAiModuleInputChange}
                className="form-input"
                placeholder="Tujuan belajar"
              />
              <input
                type="number"
                min={3}
                max={7}
                name="lessonCount"
                value={aiModuleForm.lessonCount}
                onChange={handleAiModuleInputChange}
                className="form-input"
                placeholder="Jumlah pelajaran"
              />

              <button type="submit" className="btn-outline w-full" disabled={isGeneratingModule}>
                {isGeneratingModule ? 'AI Menyusun Draft...' : 'Generate Draft Modul AI'}
              </button>
            </form>

            {aiModuleDraft && (
              <div className="mt-5 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="font-semibold text-slate-900 mb-1">{aiModuleDraft.title}</p>
                <p className="text-sm text-slate-600 mb-3">{aiModuleDraft.description}</p>

                <div className="text-xs text-slate-700 space-y-1 mb-3">
                  <p>Pelajaran: {aiModuleDraft?.lessons?.length || 0}</p>
                  <p>Soal Kuis: {aiModuleDraft?.quizQuestions?.length || 0}</p>
                </div>

                {Array.isArray(aiModuleDraft?.improvementNotes) && aiModuleDraft.improvementNotes.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-slate-700 mb-1">Masukan AI:</p>
                    <ul className="list-disc list-inside text-xs text-slate-600 space-y-0.5">
                      {aiModuleDraft.improvementNotes.map((note, index) => (
                        <li key={index}>{note}</li>
                      ))}
                    </ul>
                  </div>
                )}

                <button onClick={handleApproveAiDraft} disabled={isApprovingDraft} className="btn-primary w-full">
                  {isApprovingDraft ? 'Menyimpan...' : 'Setujui Draft AI dan Simpan Modul'}
                </button>
              </div>
            )}
          </section>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-6">
          <section className="card">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Materi Terbaru</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {materials.length === 0 && (
                <p className="text-sm text-slate-600">Belum ada materi tambahan.</p>
              )}
              {materials.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 p-4 bg-white">
                  <p className="font-semibold text-slate-900 mb-1">{item.title}</p>
                  <p className="text-sm text-slate-600 mb-2">{item.description}</p>
                  <div className="flex items-center justify-between text-xs text-slate-500 gap-2">
                    <span>{item.duration || '10 menit'}</span>
                    <span>{formatTimestamp(item.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Modul Tersimpan</h2>
            <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
              {modules.length === 0 && (
                <p className="text-sm text-slate-600">Belum ada modul buatan admin.</p>
              )}
              {modules.map((item) => (
                <div key={item.id} className="rounded-xl border border-slate-200 p-4 bg-white">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-slate-900">{item.icon || '📘'} {item.title}</p>
                    <span className="text-[10px] rounded-full bg-primary-50 text-primary-700 px-2 py-1">{item.status || 'approved'}</span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1">{item.description}</p>
                  <div className="text-xs text-slate-500 mt-2 flex items-center justify-between">
                    <span>{item.lessons?.length || 0} pelajaran</span>
                    <span>{formatTimestamp(item.createdAt)}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
