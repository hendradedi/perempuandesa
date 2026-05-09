import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/useAuth';
import { buildAllModules, findModuleByRouteId } from '../../utils/moduleHelpers';

const Quiz = () => {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const [allModules, setAllModules] = useState([]);
  const [isLoadingModule, setIsLoadingModule] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [showExplanation, setShowExplanation] = useState(false);
  const [aiMessages, setAiMessages] = useState([]);
  const [aiInput, setAiInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiError, setAiError] = useState('');

  useEffect(() => {
    const loadModules = async () => {
      setIsLoadingModule(true);
      const modules = await buildAllModules();
      setAllModules(modules);
      setIsLoadingModule(false);
    };

    loadModules();
  }, []);

  const module = useMemo(
    () => findModuleByRouteId(allModules, moduleId),
    [allModules, moduleId]
  );

  const questions = useMemo(() => module?.quizQuestions || [], [module]);

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const isCorrect = selectedAnswer === questions[currentQuestion].correctAnswer;
    const newAnswers = [
      ...answers,
      {
        question: questions[currentQuestion].question,
        selectedAnswer,
        correctAnswer: questions[currentQuestion].correctAnswer,
        isCorrect,
        explanation: questions[currentQuestion].explanation
      }
    ];

    setAnswers(newAnswers);

    if (isCorrect) {
      setScore(score + 1);
    }

    setShowExplanation(true);

    setTimeout(() => {
      setShowExplanation(false);
      setSelectedAnswer(null);

      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        setShowResult(true);
      }
    }, 3000);
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setAnswers([]);
    setShowExplanation(false);
    setAiMessages([]);
    setAiInput('');
    setAiError('');
    setIsAiLoading(false);
  };

  const { user, refreshUser } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const saveQuizResult = async () => {
    if (!user?.uid || !passed) return;
    
    setIsSaving(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      
      // Points to award
      const pointsToAdd = 50;
      
      // New certificate
      const newCert = {
        id: Date.now(),
        module: module.title,
        date: new Date().toISOString(),
        icon: 'Award'
      };

      // Check if already has certificate for this module
      const hasCert = (user.certificates || []).some(c => c.module === module.title);
      
      const updateData = {
        points: (user.points || 0) + pointsToAdd,
        updatedAt: serverTimestamp()
      };

      if (!hasCert) {
        updateData.certificates = [...(user.certificates || []), newCert];
      }

      // Add to completed modules if not already
      if (!(user.completedModules || []).includes(module.id)) {
        updateData.completedModules = [...(user.completedModules || []), module.id];
      }

      await setDoc(userRef, updateData, { merge: true });
      await refreshUser();
    } catch (error) {
      console.error('Error saving quiz result:', error);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    if (showResult && passed) {
      saveQuizResult();
    }
  }, [showResult, passed]);

  const handleFinish = () => {
    navigate('/dashboard');
  };

  if (!module || questions.length === 0) {
    if (isLoadingModule) {
      return (
        <div className="min-h-screen flex items-center justify-center px-4">
          <div className="card text-center max-w-md w-full">
            <p className="text-lg text-slate-700">Memuat kuis...</p>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="card text-center max-w-md w-full">
          <p className="text-lg text-slate-700">Kuis tidak tersedia.</p>
        </div>
      </div>
    );
  }

  const percentage = Math.round((score / questions.length) * 100);
  const passed = percentage >= 70;

  const requestAiExplanation = async (promptText) => {
    const cleanPrompt = promptText.trim();

    if (!cleanPrompt || isAiLoading) {
      return;
    }

    const aiEndpoint = import.meta.env.VITE_AI_ENDPOINT || '/api/ai-quiz-explain';

    setAiError('');
    setIsAiLoading(true);

    const nextMessages = [...aiMessages, { role: 'user', content: cleanPrompt }];
    setAiMessages(nextMessages);
    setAiInput('');

    try {
      const payload = {
        userQuestion: cleanPrompt,
        moduleTitle: module.title,
        score,
        totalQuestions: questions.length,
        percentage,
        passed,
        answers: answers.map((answer, index) => ({
          number: index + 1,
          question: answer.question,
          isCorrect: answer.isCorrect,
          userAnswer: questions[index]?.options[answer.selectedAnswer] || '-',
          correctAnswer: questions[index]?.options[answer.correctAnswer] || '-',
          explanation: answer.explanation
        })),
        chatHistory: nextMessages.slice(-8)
      };

      const response = await fetch(aiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || 'Layanan AI belum tersedia saat ini.');
      }

      setAiMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || 'Saya siap membantu menjelaskan hasil kuis Anda.'
        }
      ]);
    } catch (error) {
      setAiError(error.message || 'Gagal mendapatkan penjelasan AI.');
    } finally {
      setIsAiLoading(false);
    }
  };

  if (showResult) {
    return (
      <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="card text-center bounce-in">
            <div className="text-7xl mb-5">{passed ? '🎉' : '😔'}</div>
            <h2 className="text-3xl font-bold text-slate-900 mb-3">
              {passed ? 'Selamat! Anda Lulus!' : 'Belum Berhasil'}
            </h2>
            <p className="text-lg text-slate-600 mb-8">
              Skor Anda: <span className="font-bold text-primary-700">{score}/{questions.length}</span> ({percentage}%)
            </p>

            {passed && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 mb-8">
                <div className="flex items-center justify-center space-x-3 mb-3">
                  <span className="text-3xl">🏆</span>
                  <div className="text-left">
                    <p className="font-semibold text-slate-900">Badge Baru!</p>
                    <p className="text-sm text-slate-600">Ahli {module.title}</p>
                  </div>
                </div>
                <div className="inline-flex items-center gap-2 text-primary-700 bg-primary-50 rounded-full px-4 py-2 font-semibold">
                  <span className="text-xl">👑</span>
                  <span>+50 Poin</span>
                </div>
              </div>
            )}

            {!passed && (
              <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 mb-8">
                <p className="text-slate-700">
                  Jangan menyerah. Ulangi materi dan coba lagi. Anda perlu skor minimal 70% untuk lulus.
                </p>
              </div>
            )}

            <div className="text-left mb-8">
              <h3 className="text-xl font-bold text-slate-900 mb-4">Review Jawaban</h3>
              <div className="space-y-3">
                {answers.map((answer, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-xl border ${
                      answer.isCorrect ? 'bg-teal-50 border-teal-200' : 'bg-slate-50 border-slate-200'
                    }`}
                  >
                    <div className="flex items-start gap-2 mb-2">
                      <span className="text-lg">{answer.isCorrect ? '✅' : '❌'}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-slate-900 mb-1">
                          {index + 1}. {answer.question}
                        </p>
                        {!answer.isCorrect && (
                          <p className="text-sm text-slate-600 mb-1">
                            <span className="font-medium">Jawaban Anda:</span> {questions[index].options[answer.selectedAnswer]}
                          </p>
                        )}
                        <p className="text-sm text-slate-600 mb-1">
                          <span className="font-medium">Jawaban Benar:</span> {questions[index].options[answer.correctAnswer]}
                        </p>
                        <p className="text-sm text-slate-700 italic">{answer.explanation}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="text-left mb-8 rounded-2xl border border-slate-200 bg-white p-5">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <h3 className="text-xl font-bold text-slate-900">AI Pendamping Belajar</h3>
                <span className="text-xs sm:text-sm rounded-full bg-teal-50 text-teal-700 px-3 py-1 border border-teal-200 w-fit">
                  Interaktif
                </span>
              </div>

              <p className="text-sm text-slate-600 mb-4">
                Tanya AI untuk memahami kesalahan jawaban, strategi belajar ulang, atau rencana latihan berikutnya.
              </p>

              <div className="flex flex-wrap gap-2 mb-4">
                <button
                  onClick={() => requestAiExplanation('Tolong jelaskan 3 hal utama yang harus saya pelajari lagi dari hasil kuis ini.')}
                  className="btn-outline !px-3 !py-2 text-xs sm:text-sm"
                  disabled={isAiLoading}
                >
                  Hal yang harus dipelajari ulang
                </button>
                <button
                  onClick={() => requestAiExplanation('Buatkan rencana belajar 7 hari berdasarkan hasil kuis saya.')}
                  className="btn-outline !px-3 !py-2 text-xs sm:text-sm"
                  disabled={isAiLoading}
                >
                  Rencana 7 hari
                </button>
              </div>

              <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 min-h-40 max-h-72 overflow-y-auto">
                {aiMessages.length === 0 && (
                  <p className="text-sm text-slate-600">
                    Belum ada percakapan. Ketik pertanyaan Anda atau pilih saran cepat di atas.
                  </p>
                )}

                <div className="space-y-3">
                  {aiMessages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`rounded-xl px-3 py-2 text-sm leading-relaxed ${
                        message.role === 'assistant'
                          ? 'bg-white border border-slate-200 text-slate-700'
                          : 'bg-primary-700 text-white'
                      }`}
                    >
                      {message.content}
                    </div>
                  ))}
                </div>
              </div>

              {aiError && (
                <div className="mt-3 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs sm:text-sm text-red-700">
                  {aiError}
                </div>
              )}

              <form
                onSubmit={(event) => {
                  event.preventDefault();
                  requestAiExplanation(aiInput);
                }}
                className="mt-4 flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="text"
                  value={aiInput}
                  onChange={(event) => setAiInput(event.target.value)}
                  className="form-input"
                  placeholder="Contoh: Kenapa saya salah di nomor 2 dan cara mengingatnya?"
                  disabled={isAiLoading}
                />
                <button
                  type="submit"
                  className="btn-primary sm:w-auto"
                  disabled={isAiLoading || !aiInput.trim()}
                >
                  {isAiLoading ? 'Memproses...' : 'Tanya AI'}
                </button>
              </form>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              {!passed && (
                <button onClick={handleRetakeQuiz} className="btn-secondary w-full sm:w-auto">
                  Ulangi Kuis
                </button>
              )}
              <button onClick={handleFinish} className="btn-primary w-full sm:w-auto">
                {passed ? 'Kembali ke Dashboard' : 'Pelajari Lagi'}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const question = questions[currentQuestion];

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8 fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
            <h1 className="text-2xl font-bold text-slate-900">Kuis: {module.title}</h1>
            <span className="text-sm font-medium text-slate-600">
              Pertanyaan {currentQuestion + 1} dari {questions.length}
            </span>
          </div>

          <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="card slide-up">
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 mb-6">{question.question}</h2>

            <div className="space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => !showExplanation && handleAnswerSelect(index)}
                  disabled={showExplanation}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    showExplanation
                      ? index === question.correctAnswer
                        ? 'bg-teal-50 border-teal-300'
                        : index === selectedAnswer
                        ? 'bg-slate-100 border-slate-300'
                        : 'bg-white border-slate-200'
                      : selectedAnswer === index
                      ? 'bg-primary-50 border-primary-300'
                      : 'bg-white border-slate-300 hover:border-primary-300 hover:bg-primary-50'
                  } ${showExplanation ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border flex items-center justify-center ${
                        showExplanation
                          ? index === question.correctAnswer
                            ? 'border-teal-600 bg-teal-600'
                            : index === selectedAnswer
                            ? 'border-slate-500 bg-slate-500'
                            : 'border-slate-300'
                          : selectedAnswer === index
                          ? 'border-primary-600 bg-primary-600'
                          : 'border-slate-300'
                      }`}
                    >
                      {showExplanation && index === question.correctAnswer && <span className="text-white text-xs">✓</span>}
                      {showExplanation && index === selectedAnswer && index !== question.correctAnswer && (
                        <span className="text-white text-xs">•</span>
                      )}
                      {!showExplanation && selectedAnswer === index && <span className="text-white text-xs">✓</span>}
                    </div>
                    <span className="text-slate-900">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {showExplanation && (
            <div
              className={`p-4 rounded-xl mb-6 fade-in border ${
                selectedAnswer === question.correctAnswer
                  ? 'bg-teal-50 border-teal-200'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <p className="font-semibold text-slate-900 mb-2">
                {selectedAnswer === question.correctAnswer ? '✅ Benar!' : '❌ Kurang Tepat'}
              </p>
              <p className="text-slate-700">{question.explanation}</p>
            </div>
          )}

          <button
            onClick={handleNextQuestion}
            disabled={selectedAnswer === null || showExplanation}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {showExplanation ? 'Memuat...' : currentQuestion < questions.length - 1 ? 'Lanjut' : 'Selesai'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
