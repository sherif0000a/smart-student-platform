import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Award, 
  Star, 
  CheckCircle2, 
  AlertCircle, 
  HelpCircle, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  Trophy, 
  BookOpen, 
  Check, 
  Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { ARABIC_UNIT_QUIZZES, ArabicUnitQuiz, ArabicQuizQuestion } from '../data/arabicQuizzesData';
import { sounds, speakArabic, stopSpeaking } from '../utils/audio';

interface ArabicUnitQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  unitId?: number;
  studentName: string;
  onAddStars: (stars: number) => void;
}

export const ArabicUnitQuizModal: React.FC<ArabicUnitQuizModalProps> = ({
  isOpen,
  onClose,
  unitId = 1,
  studentName,
  onAddStars
}) => {
  const [activeUnitId, setActiveUnitId] = useState<number>(unitId);
  const [currentQuiz, setCurrentQuiz] = useState<ArabicUnitQuiz>(
    () => ARABIC_UNIT_QUIZZES.find((q) => q.unitId === unitId) || ARABIC_UNIT_QUIZZES[0]
  );

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [userAnswers, setUserAnswers] = useState<Record<number, string>>({});
  const [answeredState, setAnsweredState] = useState<Record<number, boolean>>({});
  const [isQuizCompleted, setIsQuizCompleted] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [starsAwarded, setStarsAwarded] = useState<boolean>(false);

  useEffect(() => {
    if (unitId) {
      setActiveUnitId(unitId);
      const found = ARABIC_UNIT_QUIZZES.find((q) => q.unitId === unitId) || ARABIC_UNIT_QUIZZES[0];
      setCurrentQuiz(found);
      resetQuiz(found);
    }
  }, [unitId, isOpen]);

  const resetQuiz = (quizToUse: ArabicUnitQuiz = currentQuiz) => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setAnsweredState({});
    setIsQuizCompleted(false);
    setShowHint(false);
    setStarsAwarded(false);
    stopSpeaking();
  };

  const handleSelectUnit = (newUnitId: number) => {
    setActiveUnitId(newUnitId);
    const found = ARABIC_UNIT_QUIZZES.find((q) => q.unitId === newUnitId) || ARABIC_UNIT_QUIZZES[0];
    setCurrentQuiz(found);
    resetQuiz(found);
    sounds.playClick();
  };

  if (!isOpen) return null;

  const currentQ: ArabicQuizQuestion = currentQuiz.questions[currentQuestionIndex] || currentQuiz.questions[0];
  const isCurrentAnswered = Boolean(answeredState[currentQuestionIndex]);
  const selectedAnswer = userAnswers[currentQuestionIndex];
  const isCorrect = selectedAnswer === currentQ.correctAnswer;

  // Answer selection handler
  const handleSelectOption = (option: string) => {
    if (isCurrentAnswered) return;

    const correct = option === currentQ.correctAnswer;
    setUserAnswers((prev) => ({ ...prev, [currentQuestionIndex]: option }));
    setAnsweredState((prev) => ({ ...prev, [currentQuestionIndex]: true }));

    if (correct) {
      sounds.playCheerSuccess();
      speakArabic(`أَحْسَنْتَ يَا بَطَلُ! إِجَابَةٌ صَحِيحَةٌ. ${currentQ.explanation}`);
    } else {
      sounds.playHint();
      speakArabic(`انْتَبِهْ يَا ذَكِيُّ! الإِجَابَةُ الصَّحِيحَةُ هِيَ: ${currentQ.correctAnswer}. ${currentQ.explanation}`);
    }
  };

  // Calculate final score
  const calculateScore = () => {
    let correctCount = 0;
    currentQuiz.questions.forEach((q, idx) => {
      if (userAnswers[idx] === q.correctAnswer) {
        correctCount++;
      }
    });
    const percentage = Math.round((correctCount / currentQuiz.questions.length) * 100);
    return {
      correctCount,
      total: currentQuiz.questions.length,
      percentage,
      passed: percentage >= currentQuiz.passingScore
    };
  };

  const handleNextQuestion = () => {
    stopSpeaking();
    setShowHint(false);
    sounds.playClick();
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Quiz completed!
      const score = calculateScore();
      setIsQuizCompleted(true);
      if (score.passed && !starsAwarded) {
        sounds.playFanfare();
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 }
        });
        onAddStars(currentQuiz.rewardStars);
        setStarsAwarded(true);
        speakArabic(`مَبْرُوكٌ يَا ${studentName}! نَجَحْتَ فِي اخْتِبَارِ الْوَحْدَةِ بِتَفَوُّقٍ وَحَصَلْتَ عَلَى ${currentQuiz.rewardStars} نَجْمَةً!`);
      } else {
        sounds.playHint();
      }
    }
  };

  const finalScore = calculateScore();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-indigo-950/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-4 md:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl shadow-inner">
              📝
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white/25 text-amber-100 text-[10px] md:text-xs font-black px-2.5 py-0.5 rounded-full">
                  اخْتِبَارُ نِهَايَةِ الْوَحْدَةِ
                </span>
                <span className="text-yellow-300 text-xs font-bold flex items-center gap-1">
                  <span>+{currentQuiz.rewardStars}</span>
                  <Star className="w-3.5 h-3.5 fill-yellow-300" />
                </span>
              </div>
              <h2 className="text-lg md:text-xl font-black text-white">
                {currentQuiz.title}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              stopSpeaking();
              sounds.playClick();
              onClose();
            }}
            className="p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition active:scale-95"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Unit Selector Tabs */}
        <div className="bg-amber-50/80 border-b border-amber-200/70 p-2 flex items-center justify-center gap-2 overflow-x-auto">
          {ARABIC_UNIT_QUIZZES.map((quiz) => (
            <button
              key={quiz.unitId}
              onClick={() => handleSelectUnit(quiz.unitId)}
              className={`px-3 py-1.5 rounded-xl font-black text-xs md:text-sm transition-all flex items-center gap-1.5 whitespace-nowrap ${
                activeUnitId === quiz.unitId
                  ? 'bg-amber-500 text-white shadow-sm scale-102 ring-2 ring-amber-300'
                  : 'bg-white text-slate-700 hover:bg-amber-100 border border-amber-200'
              }`}
            >
              <span>الوحدة {quiz.unitNumberArabic}</span>
              <span>⭐</span>
            </button>
          ))}
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {!isQuizCompleted ? (
            <div className="space-y-4">
              
              {/* Progress & Category bar */}
              <div className="flex items-center justify-between text-xs font-black text-slate-600 bg-slate-100 p-2.5 rounded-2xl">
                <span className="flex items-center gap-1 text-amber-700 bg-amber-100 px-2.5 py-1 rounded-xl">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>السُّؤَالُ {currentQuestionIndex + 1} مِنْ {currentQuiz.questions.length}</span>
                </span>
                <span className="bg-indigo-100 text-indigo-800 px-2.5 py-1 rounded-xl">
                  {currentQ.categoryLabel}
                </span>
                {currentQ.rulePoint && (
                  <span className="hidden sm:inline-block text-slate-500 text-[11px] truncate max-w-[200px]">
                    📌 {currentQ.rulePoint}
                  </span>
                )}
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-amber-500 to-orange-500 h-2.5 transition-all duration-300 rounded-full"
                  style={{ width: `${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%` }}
                ></div>
              </div>

              {/* Question Card */}
              <div className="bg-amber-50/60 border-2 border-amber-200 rounded-3xl p-5 md:p-6 space-y-4">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-base md:text-lg font-black text-slate-900 leading-relaxed">
                    {currentQ.question}
                  </h3>
                  <button
                    onClick={() => speakArabic(currentQ.question)}
                    className="p-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-2xl transition shrink-0"
                    title="استمع للسؤال بصوت نقي"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Options List */}
                <div className="space-y-2.5 pt-2">
                  {currentQ.options.map((option, idx) => {
                    const isSelected = selectedAnswer === option;
                    const isOptionCorrect = option === currentQ.correctAnswer;
                    
                    let btnStyle = 'border-slate-200 bg-white hover:border-amber-400 hover:bg-amber-50/50 text-slate-800';
                    if (isCurrentAnswered) {
                      if (isOptionCorrect) {
                        btnStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-2 ring-emerald-300 font-black';
                      } else if (isSelected && !isOptionCorrect) {
                        btnStyle = 'border-rose-500 bg-rose-50 text-rose-900 ring-2 ring-rose-300 font-bold';
                      } else {
                        btnStyle = 'border-slate-200 bg-slate-50 text-slate-400 opacity-60';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={isCurrentAnswered}
                        onClick={() => handleSelectOption(option)}
                        className={`w-full text-right p-3.5 md:p-4 rounded-2xl border-2 transition-all flex items-center justify-between gap-3 font-bold text-sm md:text-base ${btnStyle}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-7 h-7 rounded-xl bg-amber-100/70 text-amber-900 flex items-center justify-center text-xs font-black">
                            {['أ', 'ب', 'ج', 'د'][idx] || idx + 1}
                          </span>
                          <span>{option}</span>
                        </div>

                        {isCurrentAnswered && (
                          <div>
                            {isOptionCorrect ? (
                              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                            ) : isSelected ? (
                              <AlertCircle className="w-5 h-5 text-rose-500" />
                            ) : null}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Hint toggle */}
                {!isCurrentAnswered && (
                  <div className="pt-2 flex justify-start">
                    <button
                      onClick={() => {
                        sounds.playHint();
                        setShowHint(!showHint);
                      }}
                      className="text-xs font-black text-amber-700 hover:text-amber-800 flex items-center gap-1.5 bg-amber-100/70 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition"
                    >
                      <HelpCircle className="w-3.5 h-3.5" />
                      <span>{showHint ? 'إِخْفَاءُ التَّلْمِيحِ' : 'أَحْتَاجُ تَلْمِيحاً 💡'}</span>
                    </button>
                  </div>
                )}

                {/* Hint display */}
                {showHint && !isCurrentAnswered && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="p-3 bg-yellow-50 border border-yellow-200 rounded-2xl text-xs font-bold text-amber-900 flex items-center gap-2"
                  >
                    <span>💡</span>
                    <span>{currentQ.hint}</span>
                  </motion.div>
                )}
              </div>

              {/* Instant Pedagogical Feedback Card */}
              {isCurrentAnswered && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-2xl border-2 space-y-2 ${
                    isCorrect
                      ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950'
                      : 'bg-rose-50/80 border-rose-300 text-rose-950'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-black text-sm md:text-base">
                      {isCorrect ? (
                        <>
                          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                          <span>إِجَابَةٌ نَمُوذَجِيَّةٌ يَا بَطَلُ! ⭐</span>
                        </>
                      ) : (
                        <>
                          <AlertCircle className="w-5 h-5 text-rose-600" />
                          <span>تَعَلَّمْ مِنْ هَذَا الْخَطَأِ يَا بَطَلُ! 💡</span>
                        </>
                      )}
                    </div>
                    <button
                      onClick={() => speakArabic(currentQ.explanation)}
                      className="p-1.5 bg-white/70 hover:bg-white rounded-xl text-xs font-bold flex items-center gap-1 transition shadow-2xs"
                      title="استمع للشرح"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>اسْتَمِعْ</span>
                    </button>
                  </div>

                  <p className="text-xs md:text-sm font-semibold leading-relaxed">
                    {currentQ.explanation}
                  </p>
                </motion.div>
              )}

              {/* Next Button */}
              {isCurrentAnswered && (
                <div className="flex justify-end pt-2">
                  <button
                    onClick={handleNextQuestion}
                    className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm md:text-base px-6 py-2.5 rounded-2xl shadow-md transition transform hover:scale-102 active:scale-95"
                  >
                    <span>{currentQuestionIndex < currentQuiz.questions.length - 1 ? 'السُّؤَالُ التَّالِي' : 'عَرْضُ النَّتِيجَةِ 🏆'}</span>
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                </div>
              )}

            </div>
          ) : (
            /* Quiz Results Screen */
            <div className="py-6 text-center space-y-6 animate-fadeIn">
              <div className="w-20 h-20 md:w-24 md:h-24 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-4xl shadow-xl animate-bounce-subtle">
                {finalScore.passed ? '👑' : '💪'}
              </div>

              <div>
                <h3 className="text-2xl md:text-3xl font-black text-slate-900 mb-1">
                  {finalScore.passed ? `أَحْسَنْتَ يَا بَطَلَنَا ${studentName}!` : `مُحَاوَلَةٌ جَيِّدَةٌ يَا ${studentName}!`}
                </h3>
                <p className="text-xs md:text-sm font-bold text-slate-600">
                  {finalScore.passed
                    ? 'لَقَدِ اجْتَزْتَ اخْتِبَارَ الْوَحْدَةِ بِنَجَاحٍ بَاهِرٍ وَاسْتَحْقَقْتَ نُجُومَ التَّفَوُّقِ!'
                    : 'حَاوِلْ مَرَّةً أُخْرَى لِمُرَاجَعَةِ النِّقَاطِ وَالْحُصُولِ عَلَى نُجُومِ الْوَحْدَةِ كَامِلَةً!'}
                </p>
              </div>

              {/* Score Display */}
              <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
                <div className="bg-amber-50 border border-amber-200 p-3 rounded-2xl">
                  <p className="text-[11px] font-bold text-amber-800">الدَّرَجَةُ</p>
                  <p className="text-xl md:text-2xl font-black text-amber-600">
                    {finalScore.correctCount} / {finalScore.total}
                  </p>
                </div>
                <div className="bg-sky-50 border border-sky-200 p-3 rounded-2xl">
                  <p className="text-[11px] font-bold text-sky-800">النِّسْبَةُ</p>
                  <p className="text-xl md:text-2xl font-black text-sky-600">
                    {finalScore.percentage}%
                  </p>
                </div>
                <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl">
                  <p className="text-[11px] font-bold text-emerald-800">النُّجُومُ</p>
                  <p className="text-xl md:text-2xl font-black text-emerald-600 flex items-center justify-center gap-1">
                    <span>+{finalScore.passed ? currentQuiz.rewardStars : 0}</span>
                    <span>⭐</span>
                  </p>
                </div>
              </div>

              {/* Question Summary Checklist */}
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-right max-h-48 overflow-y-auto space-y-2">
                <p className="text-xs font-black text-slate-700 mb-2">مُلَخَّصُ إِجَابَاتِ الاخْتِبَارِ:</p>
                {currentQuiz.questions.map((q, idx) => {
                  const correct = userAnswers[idx] === q.correctAnswer;
                  return (
                    <div
                      key={q.id}
                      className={`text-xs p-2 rounded-xl flex items-center justify-between border ${
                        correct ? 'bg-emerald-50 border-emerald-200 text-emerald-900' : 'bg-rose-50 border-rose-200 text-rose-900'
                      }`}
                    >
                      <span className="font-bold line-clamp-1">{idx + 1}. {q.question}</span>
                      <span className="font-black shrink-0 mr-2">{correct ? '✓ صَحِيحٌ' : '✗ خَطَأٌ'}</span>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => resetQuiz()}
                  className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-black text-sm px-5 py-2.5 rounded-2xl transition active:scale-95"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>إِعَادَةُ الاخْتِبَارِ</span>
                </button>

                <button
                  onClick={() => {
                    stopSpeaking();
                    sounds.playClick();
                    onClose();
                  }}
                  className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm px-6 py-2.5 rounded-2xl shadow-md transition active:scale-95"
                >
                  <span>مُتَابَعَةُ التَّعَلُّمِ 🚀</span>
                </button>
              </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};
