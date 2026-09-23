import React, { useState } from 'react';
import { EnglishUnit, EnglishLessonItem, EnglishExercise } from '../types';
import { ArrowRight, Volume2, CheckCircle2, XCircle, Lightbulb, Trophy, Sparkles, BookOpen, MessageSquare, Headphones } from 'lucide-react';
import confetti from 'canvas-confetti';
import { speakEnglish, sounds } from '../utils/audio';

interface EnglishUnitViewerProps {
  unit: EnglishUnit;
  onBack: () => void;
  onCompleteExercise: (exerciseId: string, points: number) => void;
  onOpenDictionary: () => void;
  onOpenRewardGame: () => void;
  studentName: string;
  isGirl: boolean;
}

export const EnglishUnitViewer: React.FC<EnglishUnitViewerProps> = ({
  unit,
  onBack,
  onCompleteExercise,
  onOpenDictionary,
  onOpenRewardGame,
  studentName,
  isGirl
}) => {
  const [activeLessonId, setActiveLessonId] = useState<string>(unit.lessons[0]?.id || '');
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});
  const [checkedResults, setCheckedResults] = useState<Record<string, boolean>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, boolean>>({});
  const [speakingWord, setSpeakingWord] = useState<string | null>(null);

  const activeLesson = unit.lessons.find(l => l.id === activeLessonId) || unit.lessons[0];

  const handlePronounce = (text: string) => {
    sounds.playButtonTap();
    setSpeakingWord(text);
    speakEnglish(text, () => {
      setSpeakingWord(null);
    });
  };

  const handleSelectOption = (exerciseId: string, option: string) => {
    if (checkedResults[exerciseId] !== undefined) return;
    sounds.playButtonTap();
    setSelectedAnswers(prev => ({ ...prev, [exerciseId]: option }));
  };

  const handleCheckAnswer = (exercise: EnglishExercise) => {
    const chosen = selectedAnswers[exercise.id];
    if (!chosen) return;

    const isCorrect = chosen.trim().toLowerCase() === exercise.correctAnswer.trim().toLowerCase();
    setCheckedResults(prev => ({ ...prev, [exercise.id]: isCorrect }));

    if (isCorrect) {
      sounds.playCheerSuccess();
      onCompleteExercise(exercise.id, exercise.isGenius ? 20 : 10);
      confetti({
        particleCount: 45,
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
      <div className={`p-6 rounded-3xl text-white shadow-xl bg-gradient-to-r ${unit.color} flex flex-col md:flex-row items-start md:items-center justify-between gap-4`}>
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 bg-white/20 hover:bg-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-xl mb-3 transition-colors"
          >
            <ArrowRight className="w-4 h-4" />
            <span>الْعَوْدَةُ لِقَائِمَةِ وَحَدَاتِ اللُّغَةِ الإِنْجِلِيزِيَّةِ</span>
          </button>
          <div className="flex items-center gap-2">
            <span className="text-xs bg-amber-400 text-slate-900 font-black px-2.5 py-0.5 rounded-full">
              UNIT {unit.unitNumber}
            </span>
            <h1 className="text-2xl md:text-3xl font-black">{unit.title}</h1>
          </div>
          <p className="text-base text-white/90 font-bold mt-1">{unit.titleAr}</p>
        </div>

        {/* Quick actions: Dictionary & Reward Game */}
        <div className="flex flex-wrap gap-2 self-stretch md:self-auto">
          <button
            onClick={onOpenDictionary}
            className="flex-1 md:flex-initial bg-white/20 hover:bg-white/30 text-white px-3.5 py-2.5 rounded-2xl font-bold text-xs border border-white/30 flex items-center justify-center gap-2 transition-transform active:scale-95"
          >
            <BookOpen className="w-4 h-4" />
            <span>قَامُوسُ 1000 كَلِمَةٍ 📖</span>
          </button>
          <button
            onClick={onOpenRewardGame}
            className="flex-1 md:flex-initial bg-amber-400 hover:bg-amber-300 text-slate-900 px-4 py-2.5 rounded-2xl font-black text-xs shadow-lg flex items-center justify-center gap-1.5 transition-transform hover:scale-105 active:scale-95"
          >
            <Trophy className="w-4 h-4 text-amber-900" />
            <span>لُعْبَةُ التَّقْفِيلِ 🎯</span>
          </button>
        </div>
      </div>

      {/* Lesson Navigation Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {unit.lessons.map(lesson => (
          <button
            key={lesson.id}
            onClick={() => {
              setActiveLessonId(lesson.id);
              sounds.playTabSwitch();
            }}
            className={`px-4 py-2.5 rounded-2xl font-bold text-sm whitespace-nowrap transition-all flex items-center gap-2 ${
              activeLessonId === lesson.id
                ? 'bg-sky-600 text-white shadow-md scale-105'
                : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <span className="text-xs px-1.5 py-0.5 rounded bg-black/10">Lesson {lesson.lessonNumber}</span>
            <span>{lesson.title}</span>
          </button>
        ))}
      </div>

      {activeLesson && (
        <div className="space-y-6">
          {/* Vocabulary Section with Clear Audio Speech */}
          {activeLesson.vocabulary && activeLesson.vocabulary.length > 0 && (
            <div className="bg-white p-5 rounded-3xl border-2 border-sky-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-sky-100 pb-2">
                <div className="flex items-center gap-2 text-sky-800 font-black text-lg">
                  <span className="p-2 bg-sky-100 rounded-xl text-xl">🔤</span>
                  <h2>Key Vocabulary (مُفْرَدَاتُ الدَّرْسِ الْهَامَّةُ)</h2>
                </div>
                <span className="text-xs text-sky-600 font-bold">
                  اضْغَطْ عَلَى السَّمَّاعَةِ لِسَمَاعِ النُّطْقِ الْوَاضِحِ 🔊
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {activeLesson.vocabulary.map((v, i) => (
                  <div
                    key={i}
                    className="p-3.5 bg-sky-50/60 rounded-2xl border border-sky-100 flex items-center justify-between hover:border-sky-300 transition-colors"
                  >
                    <div>
                      <div className="text-base font-black text-slate-900">{v.word}</div>
                      <div className="text-xs font-bold text-sky-600">نُطْقٌ: «{v.phonetic}»</div>
                      <div className="text-sm font-bold text-emerald-700 mt-1">{v.meaningAr}</div>
                    </div>
                    <button
                      onClick={() => handlePronounce(v.word)}
                      className={`p-2 rounded-xl transition-all ${
                        speakingWord === v.word
                          ? 'bg-amber-500 text-white scale-110 animate-pulse'
                          : 'bg-white hover:bg-sky-100 text-sky-700 border border-sky-200'
                      }`}
                      title="اسْتَمِعْ لِلنُّطْقِ"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Conversation / Dialog Section */}
          {activeLesson.conversation && activeLesson.conversation.length > 0 && (
            <div className="bg-white p-5 rounded-3xl border-2 border-blue-200 shadow-sm space-y-4">
              <div className="flex items-center gap-2 text-blue-800 font-black text-lg border-b border-blue-100 pb-2">
                <span className="p-2 bg-blue-100 rounded-xl text-xl">💬</span>
                <h2>Listen and Practice (الْمُحَادَثَةُ وَالتَّوَاصُلُ)</h2>
              </div>

              <div className="space-y-3">
                {activeLesson.conversation.map((line, idx) => (
                  <div
                    key={idx}
                    className={`p-4 rounded-2xl border flex items-start justify-between gap-3 ${
                      idx % 2 === 0
                        ? 'bg-sky-50 border-sky-200'
                        : 'bg-amber-50 border-amber-200'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black px-2 py-0.5 rounded-full bg-white text-slate-800 border">
                          {line.speaker} ({line.speakerAr})
                        </span>
                      </div>
                      <p className="text-base font-bold text-slate-900">{line.text}</p>
                      <p className="text-xs text-slate-600 mt-1">{line.translationAr}</p>
                    </div>

                    <button
                      onClick={() => handlePronounce(line.text)}
                      className="p-2 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 shadow-sm transition-transform active:scale-95"
                      title="اسْتَمِعْ لِلْجُمْلَةِ"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Phonics Focus Card */}
          {activeLesson.phonicsFocus && (
            <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border-2 border-amber-300 p-5 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-amber-900 font-black text-lg">
                <span className="p-2 bg-amber-400 text-slate-900 rounded-xl text-xl">🎧</span>
                <div>
                  <h3 className="text-base font-black">Phonics Focus: Sound {activeLesson.phonicsFocus.sound}</h3>
                  <p className="text-xs text-amber-700">{activeLesson.phonicsFocus.rule}</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 pt-1">
                {activeLesson.phonicsFocus.sampleWords.map((word, i) => (
                  <button
                    key={i}
                    onClick={() => handlePronounce(word)}
                    className="px-3.5 py-1.5 bg-white hover:bg-amber-100 border border-amber-200 rounded-xl font-black text-sm text-slate-800 shadow-sm flex items-center gap-1.5 transition-transform active:scale-95"
                  >
                    <span>{word}</span>
                    <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Language in Use & Grammar Focus */}
          {activeLesson.languageFocus && (
            <div className="bg-white p-5 rounded-3xl border-2 border-indigo-200 shadow-sm space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 font-black text-lg border-b border-indigo-100 pb-2">
                <span className="p-2 bg-indigo-100 rounded-xl text-xl">📐</span>
                <h2>Language in Use: {activeLesson.languageFocus.title}</h2>
              </div>
              <p className="text-slate-700 text-sm font-medium">
                {activeLesson.languageFocus.ruleExplanation}
              </p>
              <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-2xl font-mono text-xs text-indigo-900 font-bold">
                {activeLesson.languageFocus.formula}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-1">
                {activeLesson.languageFocus.examples.map((ex, i) => (
                  <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs space-y-1">
                    <p className="font-bold text-slate-900">{ex.en}</p>
                    <p className="text-slate-500">{ex.ar}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Exercises Section */}
          <div className="space-y-4">
            <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
              <span className="p-1.5 bg-sky-100 rounded-xl text-lg">📝</span>
              <span>General Exercises & Pop Quizzes</span>
            </h2>

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
                        : 'border-slate-200 hover:border-sky-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <p className="font-bold text-slate-800 text-base">{exercise.question}</p>
                      <button
                        onClick={() => setRevealedHints(prev => ({ ...prev, [exercise.id]: !hintOpen }))}
                        className="text-amber-600 hover:text-amber-700 p-1.5 rounded-xl hover:bg-amber-50 text-xs font-bold flex items-center gap-1 transition-colors"
                      >
                        <Lightbulb className="w-4 h-4" />
                        <span>Hint</span>
                      </button>
                    </div>

                    {hintOpen && (
                      <div className="mb-3 p-3 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 animate-fadeIn">
                        💡 <strong>تَلْمِيحٌ:</strong> {exercise.hint}
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-3">
                      {exercise.options?.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectOption(exercise.id, opt)}
                          disabled={isChecked !== undefined}
                          className={`p-3 rounded-2xl font-bold text-sm border-2 transition-all ${
                            isSelected === opt
                              ? 'border-sky-500 bg-sky-100 text-sky-900 shadow'
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <div>
                        {isChecked === true && (
                          <span className="text-emerald-700 font-bold text-xs flex items-center gap-1.5">
                            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                            <span>{exercise.explanation}</span>
                          </span>
                        )}
                        {isChecked === false && (
                          <span className="text-rose-600 font-bold text-xs flex items-center gap-1.5">
                            <XCircle className="w-4 h-4 text-rose-500" />
                            <span>Try again! Review the rule above.</span>
                          </span>
                        )}
                      </div>

                      {isChecked === undefined ? (
                        <button
                          onClick={() => handleCheckAnswer(exercise)}
                          disabled={!isSelected}
                          className="px-5 py-2 bg-sky-600 hover:bg-sky-700 disabled:opacity-40 text-white font-bold rounded-xl text-xs shadow transition-all"
                        >
                          Check Answer ✨
                        </button>
                      ) : isChecked === false ? (
                        <button
                          onClick={() => {
                            setCheckedResults(prev => {
                              const copy = { ...prev };
                              delete copy[exercise.id];
                              return copy;
                            });
                          }}
                          className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold"
                        >
                          إِعَادَةُ الْمُحَاوَلَةِ
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Genius Questions Section */}
          {activeLesson.geniusQuestions && activeLesson.geniusQuestions.length > 0 && (
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-300 p-5 rounded-3xl space-y-3">
              <div className="flex items-center gap-2 text-indigo-900 font-black text-lg">
                <span className="p-2 bg-indigo-500 text-white rounded-xl text-xl shadow">🧠</span>
                <div>
                  <h3 className="text-base font-black">Genius Question (تَحَدِّي الأَذْكِيَاءِ)</h3>
                  <p className="text-xs text-indigo-700">ارْبَحْ 20 نُقْطَةً لِتَقْفِيلِ دَرَجَاتِك!</p>
                </div>
              </div>

              {activeLesson.geniusQuestions.map(gExercise => {
                const isSelected = selectedAnswers[gExercise.id];
                const isChecked = checkedResults[gExercise.id];

                return (
                  <div key={gExercise.id} className="bg-white p-4 rounded-2xl border border-indigo-200 shadow-sm space-y-3">
                    <p className="font-bold text-slate-900 text-sm">{gExercise.question}</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      {gExercise.options?.map((opt, i) => (
                        <button
                          key={i}
                          onClick={() => handleSelectOption(gExercise.id, opt)}
                          disabled={isChecked !== undefined}
                          className={`p-2.5 rounded-xl font-bold text-xs border-2 transition-all ${
                            isSelected === opt
                              ? 'border-indigo-600 bg-indigo-100 text-indigo-950 font-black'
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
                          <span className="text-rose-600 font-bold">Think again! You can do it!</span>
                        )}
                      </div>

                      {isChecked === undefined && (
                        <button
                          onClick={() => handleCheckAnswer(gExercise)}
                          disabled={!isSelected}
                          className="px-5 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black rounded-xl text-xs shadow hover:scale-105 transition-all"
                        >
                          حل التحدي 🚀
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Lesson Completion Reward Banner */}
          {allSolved && (
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-5 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 animate-bounce">
              <div className="flex items-center gap-3">
                <span className="p-3 bg-white/20 rounded-2xl text-3xl">🎉</span>
                <div>
                  <h3 className="text-xl font-black">
                    {isGirl ? `مُمْتَازَةٌ جِدّاً يَا بَطَلَتَنَا ${studentName}!` : `مُمْتَازٌ جِدّاً يَا بَطَلَنَا ${studentName}!`}
                  </h3>
                  <p className="text-xs text-emerald-100">
                    أَنْهَيْتَ كُلَّ تَمَارِينِ الدَّرْسِ الإِنْجِلِيزِيِّ بِنَجَاحٍ! افْتَحْ لُعْبَةَ الأَبْطَالِ الآنَ لِتَقْفِيلِ النِّقَاطِ! 🌟
                  </p>
                </div>
              </div>
              <button
                onClick={onOpenRewardGame}
                className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-sm rounded-2xl shadow-lg flex items-center gap-2 whitespace-nowrap"
              >
                <Trophy className="w-5 h-5 text-amber-900" />
                <span>الْعَبْ لُعْبَةَ الْجَوَائِزِ 🎯</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
