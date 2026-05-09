import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../config/firebase';
import { learningModules, quizData } from '../data/learningModules';

export const toRouteModuleId = (moduleId) => String(moduleId);

export const buildStaticModules = () => {
  return learningModules.map((module) => ({
    ...module,
    routeId: toRouteModuleId(module.id),
    source: 'static',
    quizQuestions: quizData[`module${module.id}`] || []
  }));
};

export const buildCustomModules = async () => {
  try {
    const modulesSnapshot = await getDocs(query(collection(db, 'modules'), orderBy('createdAt', 'desc')));

    return modulesSnapshot.docs
      .map((item) => ({
        id: item.id,
        ...item.data()
      }))
      .filter((item) => item.status !== 'archived')
      .map((item) => ({
        ...item,
        routeId: `custom-${item.id}`,
        source: 'custom',
        icon: item.icon || '📘',
        color: item.color || 'primary',
        lessons: Array.isArray(item.lessons)
          ? item.lessons.map((lesson, index) => ({
              id: lesson.id || index + 1,
              title: lesson.title || `Pelajaran ${index + 1}`,
              duration: lesson.duration || '15 menit',
              content: lesson.content || 'Materi sedang dipersiapkan admin.'
            }))
          : [],
        quizQuestions: Array.isArray(item.quizQuestions)
          ? item.quizQuestions.map((question) => ({
              question: question.question || 'Pertanyaan kuis',
              options: Array.isArray(question.options) && question.options.length >= 4
                ? question.options.slice(0, 4)
                : ['Pilihan 1', 'Pilihan 2', 'Pilihan 3', 'Pilihan 4'],
              correctAnswer: Number.isInteger(question.correctAnswer) ? question.correctAnswer : 0,
              explanation: question.explanation || 'Penjelasan jawaban belum tersedia.'
            }))
          : []
      }));
  } catch {
    return [];
  }
};

export const buildAllModules = async () => {
  const staticModules = buildStaticModules();
  const customModules = await buildCustomModules();
  
  // Filter out static modules that already exist in custom (Firestore) by title
  const filteredStatic = staticModules.filter(sm => 
    !customModules.some(cm => cm.title === sm.title)
  );
  
  return [...filteredStatic, ...customModules];
};

export const findModuleByRouteId = (modules, routeId) => {
  return modules.find((item) => item.routeId === String(routeId)) || null;
};
