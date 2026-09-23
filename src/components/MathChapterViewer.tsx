import React, { useState, useEffect } from 'react';
import { MathChapter, MathLessonItem, MathExercise } from '../types';
import { ArrowRight, CheckCircle2, XCircle, Lightbulb, HelpCircle, Trophy, Sparkles, Award, Star, Volume2, VolumeX, Play, Square, FastForward } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds, speakArabic, stopSpeaking } from '../utils/audio';
import { getMathVoiceExplanation } from '../curriculum/math/voiceExplanationsBank';

interface MathChapterViewerProps {
  chapter: MathChapter;
  onBack: () => void;
  onCompleteExercise: (exerciseId: string, points: number) => void;
  onOpenRewardGame: () => void;
  studentName: string;
  isGirl: boolean;
}

export const MathChapterViewer: React.FC<MathChapterViewerProps> = ({
  chapter,
  onBack,
  onCompleteExercise,
  onOpenRewardGame,
  studentName,
  isGirl
}) => {
  const [activeLessonId, setActiveLessonId] = useState<string>(chapter.lessons[0]?.id || '');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [checkedResults, setCheckedResults] = useState<Record<string, boolean>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set());
  const [isPlayingVoice, setIsPlayingVoice] = useState<boolean>(false);
  const [voiceSpeed, setVoiceSpeed] = useState<number>(0.88);
  const [speakingExerciseId, setSpeakingExerciseId] = useState<string | null>(null);
  const [autoCorrectRevealed, setAutoCorrectRevealed] = useState<Record<string, boolean>>({});

  const activeLesson = chapter.lessons.find(l => l.id === activeLessonId) || chapter.lessons[0];

  // Stop any audio when changing lesson or unmounting
  useEffect(() => {
    stopSpeaking();
    setIsPlayingVoice(false);
    setSpeakingExerciseId(null);

    const handleGlobalStop = () => {
      setIsPlayingVoice(false);
      setSpeakingExerciseId(null);
    };

    window.addEventListener('al-talib-audio-stopped', handleGlobalStop);
    return () => {
      window.removeEventListener('al-talib-audio-stopped', handleGlobalStop);
      stopSpeaking();
    };
  }, [activeLessonId]);

  const handleToggleVoiceExplanation = () => {
    if (isPlayingVoice) {
      stopSpeaking();
      setIsPlayingVoice(false);
    } else {
      sounds.playClick();
      setIsPlayingVoice(true);
      const textToSpeak = activeLesson?.voiceExplanation || getMathVoiceExplanation(activeLesson?.lessonCode || '1-1');
      speakArabic(
        textToSpeak,
        () => setIsPlayingVoice(false),
        () => setIsPlayingVoice(true),
        voiceSpeed
      );
    }
  };

  const handleStopAllVoice = () => {
    sounds.playButtonTap();
    stopSpeaking();
    setIsPlayingVoice(false);
    setSpeakingExerciseId(null);
  };

  const handleSpeakGeniusHint = (gExercise: MathExercise) => {
    if (speakingExerciseId === gExercise.id) {
      stopSpeaking();
      setSpeakingExerciseId(null);
    } else {
      sounds.playClick();
      setSpeakingExerciseId(gExercise.id);
      setIsPlayingVoice(false);
      const hintText = `لُغْزُ الأَذْكِيَاءِ يَا بَطَلَنَا: ${gExercise.problem}. تَلْمِيحُ الْحَلِّ: ${gExercise.hint}. فَكِّرْ ذِهْنِيّاً ثُمَّ اخْتَرْ الإِجَابَةَ الصَّحِيحَةَ!`;
      speakArabic(
        hintText,
        () => setSpeakingExerciseId(null),
        () => setSpeakingExerciseId(gExercise.id),
        voiceSpeed
      );
    }
  };

  const handleSelectOption = (exerciseId: string, option: string) => {
    if (checkedResults[exerciseId] !== undefined) return;
    sounds.playButtonTap();
    setSelectedAnswers(prev => ({ ...prev, [exerciseId]: option }));
  };

  const handleCheckAnswer = (exercise: MathExercise) => {
    const chosen = selectedAnswers[exercise.id];
    if (!chosen) return;

    const isCorrect = chosen.trim() === exercise.correctAnswer.trim();
    setCheckedResults(prev => ({ ...prev, [exercise.id]: isCorrect }));

    if (isCorrect) {
      sounds.playCheerSuccess();
      onCompleteExercise(exercise.id, exercise.isGenius ? 20 : 10);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    } else {
      sounds.playHint();
    }
  };

  const allExercises = [...(activeLesson?.exercises || []), ...(activeLesson?.geniusQuestions || [])];
  const allSolved = allExercises.length > 0 && allExercises.every(ex => checkedResults[ex.id] === true);

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12 animate-fadeIn">
      {/* Top Banner */}
      <div className={`p-6 rounded-3xl text-white shadow-xl bg-gradient-to-r ${chapter.color} flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-xl mb-3 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>الْعَوْدَةُ لِقَائِمَةِ فُصُولِ الرِّيَاضِيَّاتِ</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-400 text-slate-900 font-black px-2.5 py-0.5 rounded-full">
              الْفَصْلُ {chapter.chapterNumber}
            </span>
            <h1 className="text-2xl md:text-3xl font-black">{chapter.title}</h1>
          </div>
          <p className="text-sm text-white/90 mt-1">{chapter.themeDescription}</p>
        </div>

        {/* Reward Game Quick Action */}
        <button
          onClick={onOpenRewardGame}
          className="bg-amber-400 hover:bg-amber-300 text-slate-900 px-4 py-2.5 rounded-2xl font-black text-sm shadow-lg flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 whitespace-nowrap self-stretch md:self-auto justify-center"
        >
          <Trophy className="w-5 h-5 text-amber-900" />
          <span>لُعْبَةُ جَوَائِزِ الأَبْطَالِ 🎯</span>
        </button>
      </div>

      {/* Lesson Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {chapter.lessons.map(lesson => (
          <button
            key={lesson.id}
            onClick={() => {
              setActiveLessonId(lesson.id);
              sounds.playTabSwitch();
            }}
            className={`px-4 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
              activeLessonId === lesson.id
                ? 'bg-amber-500 text-white shadow-md scale-105'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <span className="text-xs px-1.5 py-0.5 rounded bg-black/10">دَرْسُ {lesson.lessonCode}</span>
            <span>{lesson.title}</span>
          </button>
        ))}
      </div>

      {activeLesson && (
        <div className="space-y-6">
          {/* Concept Explanation Card */}
          <div className="bg-white p-6 rounded-3xl border-2 border-amber-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-100 pb-3">
              <div className="flex items-center gap-2 text-amber-700 font-black text-lg">
                <span className="p-2 bg-amber-100 rounded-xl text-xl">💡</span>
                <h2>شَرْحُ وَفِكْرَةُ الدَّرْسِ مِنْ كِتَابِ الْوَزَارَةِ</h2>
              </div>

              {/* Complete User-Controlled Voice Explanation Bar */}
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={handleToggleVoiceExplanation}
                  className={`flex items-center gap-2 px-4 py-2 rounded-2xl font-black text-xs md:text-sm shadow-md transition-all active:scale-95 ${
                    isPlayingVoice
                      ? 'bg-rose-500 hover:bg-rose-600 text-white animate-pulse'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
                  }`}
                  title={isPlayingVoice ? 'إيقاف الشرح الصوتي' : 'استمع لشرح المعلم الصوتي'}
                >
                  {isPlayingVoice ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>إِيقَافُ الصَّوْتِ 🛑</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>اسْتَمِعْ لِشَرْحِ الْمُعَلِّمِ 🎙️</span>
                    </>
                  )}
                </button>

                {isPlayingVoice && (
                  <button
                    type="button"
                    onClick={handleStopAllVoice}
                    className="p-2 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold transition"
                    title="إيقاف نهائي فوري"
                  >
                    <Square className="w-3.5 h-3.5 fill-current" />
                  </button>
                )}

                {/* Speed Selector */}
                <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-[11px] font-bold text-stone-700">
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceSpeed(0.8);
                      if (isPlayingVoice) handleToggleVoiceExplanation();
                    }}
                    className={`px-2 py-0.5 rounded-lg transition ${voiceSpeed === 0.8 ? 'bg-amber-500 text-white shadow-xs' : 'hover:bg-stone-200'}`}
                  >
                    هَادِئ (0.8x)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setVoiceSpeed(0.95);
                      if (isPlayingVoice) handleToggleVoiceExplanation();
                    }}
                    className={`px-2 py-0.5 rounded-lg transition ${voiceSpeed === 0.95 ? 'bg-amber-500 text-white shadow-xs' : 'hover:bg-stone-200'}`}
                  >
                    عَادِي (1.0x)
                  </button>
                </div>
              </div>
            </div>

            {/* Audio Wave Visualizer when speaking */}
            {isPlayingVoice && (
              <div className="p-3.5 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-100 rounded-2xl border border-amber-300 flex items-center justify-between gap-3 animate-fadeIn">
                <div className="flex items-center gap-2">
                  <div className="flex items-end gap-1 h-5">
                    <span className="w-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s] h-5" />
                    <span className="w-1.5 bg-orange-500 rounded-full animate-bounce [animation-delay:-0.15s] h-3.5" />
                    <span className="w-1.5 bg-amber-600 rounded-full animate-bounce [animation-delay:-0.45s] h-4" />
                    <span className="w-1.5 bg-orange-600 rounded-full animate-bounce h-2.5" />
                  </div>
                  <span className="text-xs md:text-sm font-black text-amber-950">
                    الْمُعَلِّمُ يَشْرَحُ لَكَ الآنَ مَفْهُومَ «{activeLesson.title}» بِأُسْلُوبٍ مُبَسَّطٍ...
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleStopAllVoice}
                  className="px-3 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-black shadow-xs shrink-0"
                >
                  إِيقَافٌ فَوْرِيٌّ 🛑
                </button>
              </div>
            )}

            <p className="text-slate-700 leading-relaxed text-base font-medium">
              {activeLesson.conceptSummary}
            </p>

            {/* Rules list */}
            {activeLesson.rules && activeLesson.rules.length > 0 && (
              <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 space-y-2">
                <h3 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>الْقَوَاعِدُ الرِّيَاضِيَّةُ الْهَامَّةُ:</span>
                </h3>
                <ul className="space-y-1.5 text-sm text-slate-800">
                  {activeLesson.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Solved Examples */}
            {activeLesson.solvedExamples && activeLesson.solvedExamples.length > 0 && (
              <div className="space-y-3 pt-2">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>أَمْثِلَةٌ مَحْلُولَةٌ بِخُطُوَاتٍ بَسِيطَةٍ:</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {activeLesson.solvedExamples.map((ex, i) => (
                    <div key={i} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 space-y-2">
                      <div className="font-bold text-slate-900 text-sm">{ex.question}</div>
                      <div className="space-y-1 text-xs text-slate-600">
                        {ex.stepByStep.map((s, stepIdx) => (
                          <div key={stepIdx} className="flex items-center gap-1">
                            <span className="text-slate-400">←</span>
                            <span>{s}</span>
                          </div>
                        ))}
                      </div>
                      <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-700">النَّاتِجُ النِّهَائِيُّ:</span>
                        <span className="font-black text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-lg">
                          {ex.result}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Interactive Textbook Exercises */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                <span className="p-1.5 bg-orange-100 rounded-xl text-lg">✏️</span>
                <span>تَدْرِيبَاتُ كِتَابِ الرِّيَاضِيَّاتِ التَّفَاعُلِيَّةِ</span>
              </h2>
              <span className="text-xs text-slate-500 font-bold">
                {activeLesson.exercises.length} مَسَائِلَ
              </span>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {activeLesson.exercises.map(exercise => {
                const isSelected = selectedAnswers[exercise.id];
                const isChecked = checkedResults[exercise.id];
                const hintOpen = revealedHints[exercise.id];

                return (
                  <div
                    key={exercise.id}
                    className={`bg-white p-5 rounded-3xl border-2 transition-all ${
                      isChecked === true
                        ? 'border-emerald-400 bg-emerald-50/20'
                        : isChecked === false
                        ? 'border-rose-300 bg-rose-50/20'
                        : 'border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <p className="font-bold text-slate-800 text-base">{exercise.problem}</p>
                      <button
                        onClick={() => setRevealedHints(prev => ({ ...prev, [exercise.id]: !hintOpen }))}
                        className="text-amber-600 hover:text-amber-700 p-1.5 rounded-xl hover:bg-amber-50 text-xs font-bold flex items-center gap-1 transition-colors"
                        title="تَلْمِيحٌ ذَكِيٌّ"
                      >
                        <Lightbulb className="w-4 h-4" />
                        <span>تَلْمِيحٌ</span>
                      </button>
                    </div>

                    {hintOpen && (
                      <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 animate-fadeIn">
                        💡 <strong>تَلْمِيحٌ مُسَاعِدٌ:</strong> {exercise.hint}
                      </div>
                    )}

                    {/* Options */}
                    <div className="grid grid-cols-3 gap-2 mb-3">
                      {exercise.options?.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectOption(exercise.id, opt)}
                          disabled={isChecked !== undefined}
                          className={`p-3 rounded-2xl font-black text-sm border-2 transition-all ${
                            isSelected === opt
                              ? 'border-amber-500 bg-amber-100 text-amber-900 shadow'
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    {/* Action buttons / Result */}
                    <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          {isChecked === true && (
                            <span className="text-emerald-700 font-bold text-xs flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>{exercise.explanation}</span>
                            </span>
                          )}
                          {isChecked === false && (
                            <div className="space-y-1">
                              <span className="text-amber-700 font-bold text-xs flex items-center gap-1.5">
                                <Sparkles className="w-4 h-4 text-amber-500" />
                                <span>حَاوِلْ مَرَّةً أُخْرَى، أَوِ اسْتَعِنْ بِالتَّصْحِيحِ التِّلْقَائِيِّ:</span>
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {isChecked === undefined ? (
                            <button
                              onClick={() => handleCheckAnswer(exercise)}
                              disabled={!isSelected}
                              className="px-5 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow transition-all"
                            >
                              تَأْكِيدُ الإِجَابَةِ ✨
                            </button>
                          ) : isChecked === false ? (
                            <>
                              <button
                                onClick={() => {
                                  setAutoCorrectRevealed(prev => ({ ...prev, [exercise.id]: !prev[exercise.id] }));
                                }}
                                className="px-3 py-1.5 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl text-xs font-bold transition flex items-center gap-1"
                              >
                                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                                <span>{autoCorrectRevealed[exercise.id] ? 'إِخْفَاءُ التَّصْحِيحِ' : 'تَصْحِيحٌ تِلْقَائِيٌّ 💡'}</span>
                              </button>

                              <button
                                onClick={() => {
                                  setCheckedResults(prev => {
                                    const copy = { ...prev };
                                    delete copy[exercise.id];
                                    return copy;
                                  });
                                }}
                                className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold"
                              >
                                إِعَادَةُ الْمُحَاوَلَةِ
                              </button>
                            </>
                          ) : null}
                        </div>
                      </div>

                      {/* Auto-Correct Guidance Box */}
                      {autoCorrectRevealed[exercise.id] && (
                        <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-3 text-right space-y-1">
                          <p className="text-xs font-black text-emerald-900 flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>التَّصْحِيحُ التِّلْقَائِيُّ: الإِجَابَةُ الصَّحِيحَةُ هِيَ ({exercise.correctAnswer})</span>
                          </p>
                          <p className="text-[11px] text-emerald-800 font-bold">
                            الشَّرْحُ: {exercise.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Genius Questions Section (أسئلة الأذكياء) */}
          {activeLesson.geniusQuestions && activeLesson.geniusQuestions.length > 0 && (
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-400 p-5 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-black text-lg">
                <span className="p-2 bg-amber-400 text-slate-900 rounded-xl text-xl shadow">🧠</span>
                <div>
                  <h3 className="text-base font-black">سُؤَالُ الْعَبَاقِرَةِ وَالأَذْكِيَاءِ (تَحَدٍّ خَاصٌّ)</h3>
                  <p className="text-xs text-amber-700">احْصُلْ عَلَى 20 نُقْطَةً إِضَافِيَّةً لِتَقْفِيلِ نِقَاطِكَ!</p>
                </div>
              </div>

              {activeLesson.geniusQuestions.map(gExercise => {
                const isSelected = selectedAnswers[gExercise.id];
                const isChecked = checkedResults[gExercise.id];

                return (
                  <div key={gExercise.id} className="bg-white p-4 rounded-2xl border border-amber-300 shadow-sm space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-bold text-slate-900 text-sm">{gExercise.problem}</p>
                      <button
                        type="button"
                        onClick={() => handleSpeakGeniusHint(gExercise)}
                        className={`p-2 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-2xs transition active:scale-95 shrink-0 ${
                          speakingExerciseId === gExercise.id
                            ? 'bg-rose-500 text-white animate-pulse'
                            : 'bg-amber-100 hover:bg-amber-200 text-amber-900'
                        }`}
                        title="استمع لتلميح العباقرة بصوت المعلم"
                      >
                        {speakingExerciseId === gExercise.id ? (
                          <>
                            <VolumeX className="w-3.5 h-3.5" />
                            <span>إِيقَافُ الصَّوْتِ 🛑</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="w-3.5 h-3.5 text-amber-700" />
                            <span>تَلْمِيحٌ صَوْتِيٌّ 🔊</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {gExercise.options?.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectOption(gExercise.id, opt)}
                          disabled={isChecked !== undefined}
                          className={`p-2.5 rounded-xl font-bold text-xs border-2 transition-all ${
                            isSelected === opt
                              ? 'border-orange-500 bg-orange-100 text-orange-950 font-black'
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2">
                      <div className="text-xs">
                        {isChecked === true && (
                          <span className="text-emerald-700 font-bold flex items-center gap-1">
                            <Sparkles className="w-4 h-4 text-amber-500" />
                            <span>عَبْقَرِيٌّ! {gExercise.explanation}</span>
                          </span>
                        )}
                        {isChecked === false && (
                          <span className="text-rose-600 font-bold">فَكِّرْ ذِهْنِيّاً مَرَّةً أُخْرَى!</span>
                        )}
                      </div>

                      {isChecked === undefined && (
                        <button
                          onClick={() => handleCheckAnswer(gExercise)}
                          disabled={!isSelected}
                          className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-black rounded-xl text-xs shadow hover:scale-105 transition-all"
                        >
                          حَلُّ التَّحَدِّي 🚀
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Completion & Play Reward Banner */}
          {allSolved && (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-5 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-bounce">
              <div className="flex items-center gap-3">
                <span className="p-3 bg-white/20 rounded-2xl text-3xl">🎉</span>
                <div>
                  <h3 className="text-xl font-black">
                    {isGirl ? `أَحْسَنْتِ وَأَبْدَعْتِ يَا بَطَلَتَنَا ${studentName}!` : `أَحْسَنْتَ وَأَبْدَعْتَ يَا بَطَلَنَا ${studentName}!`}
                  </h3>
                  <p className="text-xs text-emerald-100">
                    قَفَّلْتَ جَمِيعَ نِقَاطِ هَذَا الدَّرْسِ بِنَجَاحٍ! افْتَحْ لُعْبَةَ الأَبْطَالِ الآنَ لِتَرْبَحَ مَزِيداً مِنَ النُّجُومِ 🌟
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenRewardGame}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-sm rounded-2xl shadow-lg flex items-center gap-2 whitespace-nowrap"
              >
                <Trophy className="w-5 h-5 text-amber-900" />
                <span>الْعَبْ لُعْبَةَ التَّقْفِيلِ الآنَ!</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
