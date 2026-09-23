import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lesson, UserProfile } from '../types';
import { sounds, speakArabic, stopSpeaking } from '../utils/audio';
import { InteractiveCurriculumReader } from './InteractiveCurriculumReader';
import confetti from 'canvas-confetti';
import { 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Star, 
  Sparkles, 
  BookOpen, 
  Award, 
  Lightbulb, 
  Bot,
  Layers,
  ChevronRight
} from 'lucide-react';

interface LessonViewerProps {
  lesson: Lesson;
  profile: UserProfile;
  onLessonComplete: (lessonId: string, earnedStars: number) => void;
  onBackToMap: () => void;
  onOpenChatWithContext: (message: string) => void;
}

export const LessonViewer: React.FC<LessonViewerProps> = ({
  lesson,
  profile,
  onLessonComplete,
  onBackToMap,
  onOpenChatWithContext
}) => {
  // Tabs: 'story' | 'challenges' | 'vocab' | 'rule'
  const [activeTab, setActiveTab] = useState<'story' | 'challenges' | 'vocab' | 'rule'>('story');
  
  // Active Speech Tracking
  const [activeSpeakingId, setActiveSpeakingId] = useState<string | null>(null);
  const [autoReadQuestions, setAutoReadQuestions] = useState<boolean>(true);

  // Challenge state
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [feedback, setFeedback] = useState<{
    status: 'correct' | 'wrong_with_hint' | 'final_explanation' | null;
    message: string;
  }>({ status: null, message: '' });
  const [earnedStarsInSession, setEarnedStarsInSession] = useState(0);
  const [isChallengeSetCompleted, setIsChallengeSetCompleted] = useState(false);

  const isGirl = profile.heroType === 'girl';
  const currentChallenge = lesson.challenges[currentChallengeIdx];

  // Stop audio on unmount or lesson change
  useEffect(() => {
    return () => {
      stopSpeaking();
    };
  }, [lesson.id, activeTab]);

  // Welcome sound when lesson opens
  useEffect(() => {
    sounds.playWelcomeLesson();
  }, [lesson.id]);

  // Audio helper using high-clarity pronunciation stream
  const playSpeech = (textToRead: string, id: string) => {
    if (activeSpeakingId === id) {
      stopSpeaking();
      setActiveSpeakingId(null);
    } else {
      sounds.playClick();
      setActiveSpeakingId(id);
      speakArabic(
        textToRead,
        () => setActiveSpeakingId(null),
        () => setActiveSpeakingId(id)
      );
    }
  };

  // Auto-read question when entering question or switching questions
  useEffect(() => {
    if (activeTab === 'challenges' && !isChallengeSetCompleted && currentChallenge && autoReadQuestions) {
      const timer = setTimeout(() => {
        const questionText = `السُّؤَالُ: ${currentChallenge.question}`;
        playSpeech(questionText, `question-${currentChallengeIdx}`);
      }, 350);
      return () => {
        clearTimeout(timer);
        stopSpeaking();
      };
    }
  }, [currentChallengeIdx, activeTab, isChallengeSetCompleted, autoReadQuestions]);

  // Challenge Option Check
  const handleCheckAnswer = (option: string) => {
    setSelectedOption(option);
    sounds.playButtonTap();

    const isCorrect = option === currentChallenge.correctAnswer;

    if (isCorrect) {
      // Correct answer! Play joyous celebratory sounds
      sounds.playCheerSuccess();
      sounds.playStar();

      const starsToAdd = attemptCount === 0 ? currentChallenge.points : Math.max(5, currentChallenge.points - 5);
      setEarnedStarsInSession((prev) => prev + starsToAdd);

      const successPraise = isGirl 
        ? `أَحْسَنْتِ يَا بَطَلَتَنَا ${profile.name}! إِجَابَةٌ صَحِيحَةٌ نَمُوذَجِيَّةٌ! ⭐ (+${starsToAdd} نَجْمَة)`
        : `أَحْسَنْتَ يَا بَطَلَنَا ${profile.name}! إِجَابَةٌ صَحِيحَةٌ نَمُوذَجِيَّةٌ! ⭐ (+${starsToAdd} نَجْمَة)`;

      const fullMessage = `${successPraise} - ${currentChallenge.explanation}`;
      setFeedback({
        status: 'correct',
        message: fullMessage
      });

      // Voice praise feedback with child's name
      const voicePraise = isGirl
        ? `أَحْسَنْتِ يَا بَطَلَتَنَا ${profile.name}! إِجَابَةٌ صَحِيحَةٌ وَرَائِعَةٌ. ${currentChallenge.explanation}`
        : `أَحْسَنْتَ يَا بَطَلَنَا ${profile.name}! إِجَابَةٌ صَحِيحَةٌ وَرَائِعَةٌ. ${currentChallenge.explanation}`;

      playSpeech(voicePraise, `feedback-${currentChallengeIdx}`);
    } else {
      // First wrong attempt -> Gentle scaffolding with hint and second chance
      if (attemptCount === 0) {
        sounds.playHint();
        setAttemptCount(1);
        const retryPraise = isGirl 
          ? `مُحَاوَلَةٌ جَيِّدَةٌ يَا بَطَلَتَنَا ${profile.name}! فَكِّرِي مَرَّةً أُخْرَى مَعَ هَذَا التَّلْمِيحِ الذَّكِيِّ:`
          : `مُحَاوَلَةٌ جَيِّدَةٌ يَا بَطَلَنَا ${profile.name}! فَكِّرْ مَرَّةً أُخْرَى مَعَ هَذَا التَّلْمِيحِ الذَّكِيِّ:`;

        const fullMessage = `${retryPraise} ${currentChallenge.hint}`;
        setFeedback({
          status: 'wrong_with_hint',
          message: fullMessage
        });

        // Voice hint feedback
        playSpeech(`مُحَاوَلَةٌ طَيِّبَةٌ، اسْتَمِعْ لِلتَّلْمِيحِ: ${currentChallenge.hint}`, `feedback-${currentChallengeIdx}`);
      } else {
        // Second wrong attempt -> give kind explanation
        sounds.playHint();
        const fullMessage = `لَا بَأْسَ يَا بَطَلُ، نَحْنُ هُنَا لِنَتَعَلَّمَ وَنُكَرِّرَ الْمُحَاوَلَةَ كَمَا تَعَلَّمْنَا فِي كِتَابِ الْوَزَارَةِ! الإِجَابَةُ الصَّحِيحَةُ هِيَ: «${currentChallenge.correctAnswer}». ${currentChallenge.explanation}`;
        setFeedback({
          status: 'final_explanation',
          message: fullMessage
        });

        // Voice explanation feedback
        playSpeech(`الإِجَابَةُ الصَّحِيحَةُ هِيَ: ${currentChallenge.correctAnswer}. ${currentChallenge.explanation}`, `feedback-${currentChallengeIdx}`);
      }
    }
  };

  // Next Challenge
  const handleNextChallenge = () => {
    sounds.playTransition();
    if (currentChallengeIdx < lesson.challenges.length - 1) {
      setCurrentChallengeIdx((prev) => prev + 1);
      setSelectedOption(null);
      setAttemptCount(0);
      setFeedback({ status: null, message: '' });
    } else {
      // Completed all challenges in lesson!
      setIsChallengeSetCompleted(true);
      sounds.playFanfare();
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
      onLessonComplete(lesson.id, earnedStarsInSession);
    }
  };

  return (
    <div id="lesson-viewer-root" className="space-y-6 pb-20 max-w-5xl mx-auto">
      
      {/* Lesson Navigation Header */}
      <div className="flex items-center justify-between gap-3 bg-white p-4 rounded-2xl border-2 border-amber-200 shadow-xs">
        <button
          id="back-to-map-button"
          onClick={() => {
            stopSpeaking();
            sounds.playClick();
            onBackToMap();
          }}
          className="flex items-center gap-1.5 text-xs md:text-sm font-bold text-stone-600 hover:text-amber-800 bg-stone-100 hover:bg-amber-100 px-3 py-2 rounded-xl transition"
        >
          <ChevronRight className="w-4 h-4" />
          <span>الْعَوْدَةُ لِلْخَرِيطَةِ</span>
        </button>

        <div className="text-center">
          <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full">
            {lesson.categoryLabel}
          </span>
          <h2 className="text-lg md:text-xl font-black text-stone-900 mt-0.5">
            {lesson.title}
          </h2>
        </div>

        <div className="flex items-center gap-1 text-xs font-black bg-amber-50 text-amber-900 border border-amber-200 px-3 py-1.5 rounded-xl">
          <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          <span>+{earnedStarsInSession} ⭐</span>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <button
          id="tab-story-btn"
          onClick={() => {
            sounds.playTabSwitch();
            setActiveTab('story');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition whitespace-nowrap ${
            activeTab === 'story'
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>الْقِصَّةُ وَالْمُلَخَّصُ الصَّوْتِيُّ</span>
        </button>

        <button
          id="tab-challenges-btn"
          onClick={() => {
            sounds.playTabSwitch();
            setActiveTab('challenges');
          }}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition whitespace-nowrap ${
            activeTab === 'challenges'
              ? 'bg-amber-500 text-white shadow-md'
              : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>أَنْشِطَةُ وَتَدْرِيبَاتُ الْكِتَابِ ({lesson.challenges.length})</span>
        </button>

        {lesson.vocabulary && lesson.vocabulary.length > 0 && (
          <button
            id="tab-vocab-btn"
            onClick={() => {
              sounds.playTabSwitch();
              setActiveTab('vocab');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition whitespace-nowrap ${
              activeTab === 'vocab'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>مُفْرَدَاتِي الْجَدِيدَةُ</span>
          </button>
        )}

        {lesson.grammarOrSpellingRule && (
          <button
            id="tab-rule-btn"
            onClick={() => {
              sounds.playTabSwitch();
              setActiveTab('rule');
            }}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm transition whitespace-nowrap ${
              activeTab === 'rule'
                ? 'bg-amber-500 text-white shadow-md'
                : 'bg-white text-stone-600 hover:bg-stone-50 border border-stone-200'
            }`}
          >
            <Lightbulb className="w-4 h-4" />
            <span>الْقَاعِدَةُ التَّعْلِيمِيَّةُ</span>
          </button>
        )}
      </div>

      {/* TAB 1: STORY & NARRATIVE */}
      {activeTab === 'story' && (
        <div className="space-y-6">
          
          {/* Audio Narrator Box */}
          <div 
            id="audio-narrator-card"
            className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-3xl border-2 border-amber-300 p-6 shadow-sm space-y-4"
          >
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-3 border-b border-amber-200">
              <div className="flex items-center gap-3">
                <div className={`w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-3xl shadow-md ${activeSpeakingId === 'summary' ? 'animate-bounce ring-4 ring-amber-300' : ''}`}>
                  🤖
                </div>
                <div>
                  <h3 className="text-lg font-black text-stone-900">
                    الْمُلَخَّصُ وَالشَّرْحُ الصَّوْتِيُّ لِلدَّرْسِ
                  </h3>
                  <p className="text-xs text-stone-600 font-bold">
                    بِصَوْتٍ عَرَبِيٍّ وَاضِحٍ وَمُعَبِّرٍ لِكُلِّ كَلِمَةٍ مَعَ التَّشْكِيلِ
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  id="play-narration-btn"
                  onClick={() => playSpeech(lesson.summaryNarrative, 'summary')}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-black text-sm transition transform active:scale-95 shadow-md ${
                    activeSpeakingId === 'summary'
                      ? 'bg-rose-500 hover:bg-rose-600 text-white ring-4 ring-rose-300'
                      : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white'
                  }`}
                >
                  {activeSpeakingId === 'summary' ? (
                    <>
                      <VolumeX className="w-5 h-5 animate-spin" />
                      <span>إِيقَافُ الشَّرْحِ ⏹️</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-5 h-5 animate-pulse" />
                      <span>اسْتَمِعْ لِلشَّرْحِ والْمُلَخَّصِ 🔊</span>
                    </>
                  )}
                </button>

                <button
                  id="ask-tutor-from-lesson-btn"
                  onClick={() => onOpenChatWithContext(`اشرح لي درس: ${lesson.title}`)}
                  className="flex items-center gap-1.5 text-xs font-bold bg-purple-100 hover:bg-purple-200 text-purple-800 px-3.5 py-2.5 rounded-2xl transition"
                >
                  <Bot className="w-4 h-4" />
                  <span>اسْأَلِ الرُّوبُوتَ</span>
                </button>
              </div>
            </div>

            {/* Speaking Status Banner */}
            {activeSpeakingId === 'summary' && (
              <div className="flex items-center justify-between bg-amber-100/80 px-4 py-2 rounded-xl text-amber-900 text-xs font-black border border-amber-300 animate-pulse">
                <div className="flex items-center gap-2">
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-500 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-amber-600"></span>
                  </span>
                  <span>الرُّوبُوتُ الْمُعَلِّمُ يَقْرَأُ الشَّرْحَ الآَنَ بِصَوْتٍ عَرَبِيٍّ نَقِيٍّ... 🎙️</span>
                </div>
                <span className="text-[11px] font-bold text-stone-600">اضْغَطْ إِيقَافَ الشَّرْحِ عِنْدَ الانْتِهَاءِ</span>
              </div>
            )}

            {/* Summary Text formatted with authentic textbook diacritics */}
            <div className="bg-white/95 p-6 rounded-2xl border border-amber-200 textbook-tashkeel font-naskh text-lg md:text-xl text-stone-900 leading-[2.3] text-right shadow-xs">
              {lesson.summaryNarrative}
            </div>

            {/* Interactive Phonics & Sentence-by-Sentence Highlight Reader */}
            <InteractiveCurriculumReader
              text={lesson.summaryNarrative}
              title={`الْقِرَاءَةُ النَّمُوذَجِيَّةُ الْمُعَبِّرَةُ لِـ (${lesson.title})`}
            />
          </div>

          {/* Poetry Verses (If lesson is a poem) */}
          {lesson.poeticVerses && lesson.poeticVerses.length > 0 && (
            <div className="bg-white rounded-3xl border-2 border-rose-200 p-6 md:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                <h3 className="text-xl font-black text-rose-900 flex items-center gap-2">
                  <span>🎵</span>
                  <span>أَبْيَاتُ النَّشِيدِ كَمَا فِي الْكِتَابِ الْمَدْرَسِيِّ</span>
                </h3>
                <button
                  onClick={() => {
                    const allVersesText = lesson.poeticVerses?.map(v => `${v.firstHemistich} ... ${v.secondHemistich}`).join(' . ');
                    if (allVersesText) playSpeech(allVersesText, 'verses');
                  }}
                  className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition ${
                    activeSpeakingId === 'verses'
                      ? 'bg-rose-500 text-white border-rose-600 ring-2 ring-rose-300'
                      : 'text-rose-700 bg-rose-50 border-rose-200 hover:bg-rose-100'
                  }`}
                >
                  {activeSpeakingId === 'verses' ? 'إِيقَافُ الإِنْشَادِ ⏹️' : 'إِنْشَادُ الأَبْيَاتِ 🎶'}
                </button>
              </div>

              <div className="space-y-4 py-2">
                {lesson.poeticVerses.map((verse, idx) => (
                  <div 
                    key={idx}
                    className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-12 bg-amber-50/40 p-4 rounded-2xl border border-amber-100 text-center font-black textbook-tashkeel font-naskh text-lg md:text-2xl text-stone-900"
                  >
                    <span className="text-stone-950">{verse.firstHemistich}</span>
                    <span className="text-amber-500 hidden sm:inline">✦</span>
                    <span className="text-stone-950">{verse.secondHemistich}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Full Reading Passage (If available) */}
          {lesson.storyPassage && (
            <div className="bg-white rounded-3xl border-2 border-stone-200 p-6 md:p-8 shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="text-xl font-black text-stone-900 flex items-center gap-2">
                  <span>📖</span>
                  <span>نَصُّ الْقِرَاءَةِ الْمُعْتَمَدِ</span>
                </h3>
                <button
                  onClick={() => playSpeech(lesson.storyPassage || '', 'passage')}
                  className={`text-xs font-bold px-3.5 py-1.5 rounded-xl transition ${
                    activeSpeakingId === 'passage'
                      ? 'bg-stone-800 text-white'
                      : 'text-stone-600 bg-stone-100 hover:bg-stone-200'
                  }`}
                >
                  {activeSpeakingId === 'passage' ? 'إِيقَافُ الْقِرَاءَةِ ⏹️' : 'قِرَاءَةٌ جَهْرِيَّةٌ 🔊'}
                </button>
              </div>

              <p className="textbook-tashkeel font-naskh text-lg md:text-xl leading-[2.3] font-normal text-stone-900 text-right">
                {lesson.storyPassage}
              </p>
            </div>
          )}

          {/* CTA to start exercises */}
          <div className="text-center pt-2">
            <button
              id="goto-challenges-cta-btn"
              onClick={() => {
                sounds.playTransition();
                setActiveTab('challenges');
              }}
              className="inline-flex items-center gap-2 py-3.5 px-8 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black text-base md:text-lg rounded-2xl shadow-lg transition transform active:scale-95"
            >
              <span>انْتَقِلْ إِلَى أَنْشِطَةِ وَتَدْرِيبَاتِ الْكِتَابِ</span>
              <ArrowLeft className="w-5 h-5" />
            </button>
          </div>

        </div>
      )}

      {/* TAB 2: INTERACTIVE CHALLENGES */}
      {activeTab === 'challenges' && (
        <div id="challenges-view-card" className="space-y-6">
          
          {!isChallengeSetCompleted ? (
            <div className="bg-white rounded-3xl border-2 border-amber-300 p-6 md:p-8 shadow-md space-y-6">
              
              {/* Progress & Indicator with Voice Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
                <div className="flex items-center gap-3 text-xs font-bold text-stone-600">
                  <span className="bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                    النَّشَاطُ {currentChallengeIdx + 1} مِنْ {lesson.challenges.length}
                  </span>
                  <div className="flex items-center gap-1 text-amber-700 font-extrabold bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span>قِيمَةُ النَّشَاطِ: {currentChallenge.points} نُجُوم</span>
                  </div>
                </div>

                {/* Question Audio Toggle */}
                <label className="flex items-center gap-2 cursor-pointer select-none bg-amber-50/70 hover:bg-amber-100/70 px-3 py-1.5 rounded-xl border border-amber-200 transition">
                  <input
                    type="checkbox"
                    checked={autoReadQuestions}
                    onChange={(e) => setAutoReadQuestions(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500 cursor-pointer"
                  />
                  <span className="text-xs font-black text-stone-700 flex items-center gap-1">
                    <span>🔊</span>
                    <span>إِلْقَاءٌ صَوْتِيٌّ تِلْقَائِيٌّ لِلسُّؤَالِ</span>
                  </span>
                </label>
              </div>

              {/* Question Box with Prominent Voice Narration Button */}
              <div className="bg-amber-50/50 p-5 rounded-2xl border-2 border-amber-200/80 space-y-3 text-right">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-amber-700 uppercase tracking-wide flex items-center gap-1.5">
                    <span>📝</span>
                    <span>السُّؤَالُ مِنْ أَنْشِطَةِ الْكِتَابِ الْمَدْرَسِيِّ:</span>
                  </span>

                  {/* Read Aloud Button for the Question */}
                  <button
                    id="speak-question-btn"
                    onClick={() => playSpeech(`السُّؤَالُ: ${currentChallenge.question}`, `question-${currentChallengeIdx}`)}
                    className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-black transition transform active:scale-95 shadow-xs ${
                      activeSpeakingId === `question-${currentChallengeIdx}`
                        ? 'bg-rose-500 text-white ring-2 ring-rose-300'
                        : 'bg-amber-500 hover:bg-amber-600 text-white'
                    }`}
                    title="استمع لإلقاء السؤال"
                  >
                    <Volume2 className={`w-4 h-4 ${activeSpeakingId === `question-${currentChallengeIdx}` ? 'animate-bounce' : ''}`} />
                    <span>
                      {activeSpeakingId === `question-${currentChallengeIdx}` ? 'إِيقَافُ الصَّوْتِ ⏹️' : 'اسْتَمِعْ لِلسُّؤَالِ 🔊'}
                    </span>
                  </button>
                </div>

                <h3 className="text-xl md:text-2xl font-black text-stone-950 textbook-tashkeel font-naskh leading-[2.2]">
                  {currentChallenge.question}
                </h3>
              </div>

              {/* Options */}
              {currentChallenge.options && (
                <div className="grid grid-cols-1 gap-3 pt-1">
                  {currentChallenge.options.map((option, idx) => {
                    const isSelected = selectedOption === option;
                    let buttonClass = 'border-stone-200 bg-stone-50 hover:bg-amber-50 hover:border-amber-300 text-stone-800';

                    if (isSelected) {
                      if (feedback.status === 'correct') {
                        buttonClass = 'border-emerald-500 bg-emerald-100 text-emerald-950 ring-2 ring-emerald-300';
                      } else if (feedback.status === 'wrong_with_hint' || feedback.status === 'final_explanation') {
                        buttonClass = 'border-rose-400 bg-rose-50 text-rose-950';
                      } else {
                        buttonClass = 'border-amber-500 bg-amber-100 text-amber-950';
                      }
                    }

                    return (
                      <div
                        key={idx}
                        className={`p-3 md:p-4 rounded-2xl border-2 font-bold text-base md:text-lg text-right transition-all flex items-center justify-between gap-3 ${buttonClass}`}
                      >
                        <button
                          id={`option-btn-${idx}`}
                          onClick={() => handleCheckAnswer(option)}
                          disabled={feedback.status === 'correct'}
                          className="flex-1 text-right textbook-tashkeel font-naskh text-lg md:text-xl font-bold"
                        >
                          {option}
                        </button>

                        <div className="flex items-center gap-2 shrink-0">
                          {/* Listen to this specific option */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              playSpeech(option, `opt-${idx}`);
                            }}
                            className={`p-2 rounded-xl transition ${
                              activeSpeakingId === `opt-${idx}`
                                ? 'bg-amber-500 text-white'
                                : 'text-stone-400 hover:text-amber-600 hover:bg-amber-100'
                            }`}
                            title="استمع للخيار"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>

                          {isSelected && feedback.status === 'correct' && (
                            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                          )}
                          {isSelected && (feedback.status === 'wrong_with_hint' || feedback.status === 'final_explanation') && (
                            <XCircle className="w-6 h-6 text-rose-500" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Feedback Callout with Spoken Scaffolding Hint */}
              {feedback.status && (
                <div
                  id="challenge-feedback-box"
                  className={`p-5 rounded-2xl border-2 text-right transition-all leading-relaxed ${
                    feedback.status === 'correct'
                      ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                      : 'bg-amber-50 border-amber-300 text-amber-950'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 flex-1">
                      <div className="text-2xl mt-0.5">
                        {feedback.status === 'correct' ? '🎉' : '💡'}
                      </div>
                      <div className="space-y-1">
                        <p className="font-bold text-base md:text-lg textbook-tashkeel font-naskh leading-[2.1]">
                          {feedback.message}
                        </p>
                      </div>
                    </div>

                    {/* Button to repeat feedback audio */}
                    <button
                      onClick={() => playSpeech(feedback.message, `feedback-replay`)}
                      className="p-2 rounded-xl bg-white/80 hover:bg-white text-stone-600 hover:text-amber-700 border border-stone-200 shrink-0"
                      title="إعادة الاستماع للشرح"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Bottom Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-stone-100">
                <button
                  id="ask-hint-button"
                  onClick={() => {
                    sounds.playHint();
                    setFeedback({
                      status: 'wrong_with_hint',
                      message: `تَلْمِيحٌ مُسَاعِدٌ: ${currentChallenge.hint}`
                    });
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-2 rounded-xl transition"
                >
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>أُرِيدُ تَلْمِيحاً ذَكِيّاً</span>
                </button>

                {(feedback.status === 'correct' || feedback.status === 'final_explanation') && (
                  <button
                    id="next-challenge-btn"
                    onClick={handleNextChallenge}
                    className="flex items-center gap-2 py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-sm md:text-base rounded-xl shadow-md transition transform active:scale-95"
                  >
                    <span>{currentChallengeIdx < lesson.challenges.length - 1 ? 'النَّشَاطُ التَّالِي' : 'إِتْمَامُ الدَّرْسِ'}</span>
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                )}
              </div>

            </div>
          ) : (
            /* Lesson Finished Card */
            <div 
              id="lesson-completion-card"
              className="bg-white rounded-3xl border-4 border-amber-400 p-8 text-center space-y-6 shadow-xl"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-amber-100 rounded-full text-5xl animate-bounce shadow-inner">
                🏆
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl md:text-3xl font-black text-stone-900">
                  {isGirl ? `مُبَارَكٌ يَا بَطَلَتَنَا ${profile.name}!` : `مُبَارَكٌ يَا بَطَلَنَا ${profile.name}!`}
                </h3>
                <p className="text-stone-600 font-bold text-sm md:text-base max-w-md mx-auto">
                  أَتْمَمْتَ جَمِيعَ أَنْشِطَةِ «{lesson.title}» بِنَجَاحٍ بَاهِرٍ وَحَقَّقْتَ نُجُوماً جَدِيدَةً!
                </p>
              </div>

              <div className="inline-block bg-amber-50 border-2 border-amber-300 px-6 py-3 rounded-2xl">
                <span className="text-xs font-bold text-stone-500 block">إِجْمَالِيُّ النُّجُومِ الْمُكْتَسَبَةِ</span>
                <span className="text-3xl font-black text-amber-600">+{earnedStarsInSession} ⭐</span>
              </div>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
                <button
                  id="return-to-map-completed-btn"
                  onClick={() => {
                    sounds.playClick();
                    onBackToMap();
                  }}
                  className="w-full sm:w-auto py-3.5 px-8 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black rounded-xl shadow-md transition"
                >
                  مُوَاصَلَةُ الْمَغَامَرَةِ فِي الْخَرِيطَةِ 🗺️
                </button>

                <button
                  id="retry-exercises-btn"
                  onClick={() => {
                    sounds.playClick();
                    setCurrentChallengeIdx(0);
                    setSelectedOption(null);
                    setAttemptCount(0);
                    setFeedback({ status: null, message: '' });
                    setIsChallengeSetCompleted(false);
                  }}
                  className="w-full sm:w-auto py-3.5 px-6 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold rounded-xl transition"
                >
                  إِعَادَةُ الأَنْشِطَةِ لِلتَّمَيُّزِ 🔄
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 3: VOCABULARY */}
      {activeTab === 'vocab' && lesson.vocabulary && (
        <div className="bg-white rounded-3xl border-2 border-amber-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="text-xl font-black text-stone-900 flex items-center gap-2">
              <span>📚</span>
              <span>مُفْرَدَاتُ الدَّرْسِ الْجَدِيدَةُ (الْمَعْنَى - الْمُضَادُّ - الْجَمْعُ)</span>
            </h3>
            <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1 rounded-xl">
              كِتَابُ الْوَزَارَةِ
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {lesson.vocabulary.map((v, idx) => (
              <div
                key={idx}
                className="bg-amber-50/40 p-4 rounded-2xl border border-amber-200/80 text-right space-y-2 hover:shadow-xs transition"
              >
                <div className="flex items-center justify-between pb-1 border-b border-amber-100">
                  <span className="text-xl font-black text-amber-950 textbook-tashkeel font-naskh">{v.word}</span>
                  <button
                    onClick={() => playSpeech(`الْكَلِمَةُ: ${v.word}. ${v.meaning ? `مَعْنَاهَا: ${v.meaning}.` : ''} ${v.opposite ? `مُضَادُّهَا: ${v.opposite}.` : ''}`, `vocab-${idx}`)}
                    className={`p-1.5 rounded-lg transition ${
                      activeSpeakingId === `vocab-${idx}` 
                        ? 'text-white bg-amber-500 ring-2 ring-amber-300' 
                        : 'text-stone-400 hover:text-amber-600 hover:bg-amber-100'
                    }`}
                    title="استمع للنطق والشرح"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                </div>

                {v.meaning && (
                  <p className="text-sm font-bold text-stone-800 textbook-tashkeel font-naskh">
                    <span className="text-stone-400 font-normal">الْمَعْنَى: </span>
                    {v.meaning}
                  </p>
                )}

                {v.opposite && (
                  <p className="text-sm font-bold text-rose-800 textbook-tashkeel font-naskh">
                    <span className="text-stone-400 font-normal">الْمُضَادُّ: </span>
                    {v.opposite}
                  </p>
                )}

                {v.plural && (
                  <p className="text-sm font-bold text-indigo-800 textbook-tashkeel font-naskh">
                    <span className="text-stone-400 font-normal">الْجَمْعُ: </span>
                    {v.plural}
                  </p>
                )}

                {v.singular && (
                  <p className="text-sm font-bold text-teal-800 textbook-tashkeel font-naskh">
                    <span className="text-stone-400 font-normal">الْمُفْرَدُ: </span>
                    {v.singular}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: GRAMMAR / SPELLING RULE */}
      {activeTab === 'rule' && lesson.grammarOrSpellingRule && (
        <div className="bg-white rounded-3xl border-2 border-indigo-200 p-6 md:p-8 shadow-sm space-y-6">
          <div className="pb-3 border-b border-indigo-100 flex items-center justify-between">
            <h3 className="text-xl font-black text-indigo-950 flex items-center gap-2">
              <span>💡</span>
              <span className="textbook-tashkeel font-naskh">{lesson.grammarOrSpellingRule.title}</span>
            </h3>
            <button
              onClick={() => playSpeech(`${lesson.grammarOrSpellingRule?.title}. ${lesson.grammarOrSpellingRule?.ruleExplanation || ''}`, 'rule')}
              className={`text-xs font-bold px-3.5 py-1.5 rounded-xl border transition ${
                activeSpeakingId === 'rule'
                  ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                  : 'text-indigo-700 bg-indigo-50 border-indigo-200 hover:bg-indigo-100'
              }`}
            >
              {activeSpeakingId === 'rule' ? 'إِيقَافُ الصَّوْتِ ⏹️' : 'اسْتَمِعْ لِشَرْحِ الْقَاعِدَةِ 🔊'}
            </button>
          </div>

          {/* Explanation Box */}
          <div className="bg-indigo-50/50 p-6 rounded-2xl border border-indigo-200 whitespace-pre-line text-stone-900 text-right textbook-tashkeel font-naskh text-lg md:text-xl leading-[2.3]">
            {lesson.grammarOrSpellingRule.ruleExplanation}
          </div>

          {/* Textbook Examples */}
          <div className="space-y-3">
            <h4 className="text-sm font-black text-stone-700 text-right">
              أَمْثِلَةٌ مِنْ أَنْشِطَةِ الْكِتَابِ:
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {lesson.grammarOrSpellingRule.examples.map((ex, idx) => (
                <div 
                  key={idx}
                  className="bg-white p-4 rounded-2xl border border-stone-200 text-right space-y-1 shadow-2xs"
                >
                  <p className="text-base font-black text-stone-900">{ex.original}</p>
                  <p className="text-xs font-bold text-indigo-600">{ex.note}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
