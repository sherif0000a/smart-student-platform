import React, { useState, useEffect } from 'react';
import { Rocket, Trophy, Star, Volume2, Sparkles, X, CheckCircle2, ArrowRight, Award, Flame, RefreshCw, Zap, Heart, Brain } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds, speakEnglish, speakArabic, stopSpeaking } from '../utils/audio';

interface EducationalGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStars: (stars: number) => void;
  studentName: string;
}

type GameType = 'mathRocket' | 'englishHunter' | 'arabicTreasure' | 'princessGarden' | 'speedChampion';

interface GameQuestion {
  question: string;
  options: string[];
  correct: string;
  hint: string;
  audioText?: string;
  isEnglishAudio?: boolean;
}

const MATH_QUESTIONS: GameQuestion[] = [
  { question: 'احْسُبْ سَرِيعاً: 6 × 7 = ؟', options: ['42', '36', '48'], correct: '42', hint: '6 مَرَّاتٍ 7' },
  { question: 'احْسُبْ ذِهْنِيّاً: 8 × 9 = ؟', options: ['72', '81', '64'], correct: '72', hint: 'أَقَلُّ مِنْ 80 بِـ 8' },
  { question: 'قِسْمَةٌ عَادِلَةٌ: 36 ÷ 6 = ؟', options: ['6', '5', '7'], correct: '6', hint: '6 × 6 = 36' },
  { question: 'سَاعَةٌ ذَكِيَّةٌ: السَّاعَةُ الْكَامِلَةُ تَحْتَوِي عَلَى كَمْ دَقِيقَةً؟', options: ['60 دَقِيقَةً', '30 دَقِيقَةً', '45 دَقِيقَةً'], correct: '60 دَقِيقَةً', hint: 'دَوْرَةٌ كَامِلَةٌ' },
  { question: 'تَفْكِيكُ الأَعْدَادِ: 8 × 7 = (8 × 5) + (8 × ...)', options: ['2', '3', '4'], correct: '2', hint: '7 تَتَفَكَّكُ إِلَى 5 + 2' },
  { question: 'أَيُّ الْكَسْرَيْنِ أَكْبَرُ: 1/2 أَمْ 1/4؟', options: ['1/2 (نِصْفٌ)', '1/4 (رُبْعٌ)', 'مُتَسَاوِيَانِ'], correct: '1/2 (نِصْفٌ)', hint: 'الْمَقَامُ الأَصْغَرُ هُوَ الأَكْبَرُ فِي نَفْسِ الْبَسْطِ' },
  { question: 'مُحِيطُ الْمُرَبَّعِ الَّذِي طُولُ ضِلْعِهِ 5 سَم = ؟', options: ['20 سَم', '25 سَم', '15 سَم'], correct: '20 سَم', hint: '5 + 5 + 5 + 5' },
  { question: 'مَسَاحَةُ مُسْتَطِيلٍ طُولُهُ 6 وَعَرْضُهُ 4 = ؟', options: ['24', '20', '10'], correct: '24', hint: 'الطُّولُ × الْعَرْضُ' }
];

const ENGLISH_QUESTIONS: GameQuestion[] = [
  { question: 'How do you feel? I feel ... (سَعِيدٌ)', options: ['happy', 'sad', 'tired'], correct: 'happy', hint: 'Happy means cheerful', audioText: 'happy', isEnglishAudio: true },
  { question: 'What\'s the matter? I have a ... (صُدَاعٌ)', options: ['headache', 'cold', 'fever'], correct: 'headache', hint: 'Pain in the head', audioText: 'headache', isEnglishAudio: true },
  { question: 'Choose the correct phonics for "sleep":', options: ['ee', 'ea', 'ai'], correct: 'ee', hint: 's - l - e - e - p', audioText: 'sleep', isEnglishAudio: true },
  { question: 'Animal at the zoo with a long neck:', options: ['giraffe', 'elephant', 'hippo'], correct: 'giraffe', hint: 'Giraffe', audioText: 'giraffe', isEnglishAudio: true },
  { question: 'Circus performer who makes people laugh:', options: ['clown', 'acrobat', 'trapeze'], correct: 'clown', hint: 'Funny makeup', audioText: 'clown', isEnglishAudio: true },
  { question: 'Take your ... (دَوَاءَكَ):', options: ['medicine', 'book', 'chair'], correct: 'medicine', hint: 'Prescribed by the doctor', audioText: 'medicine', isEnglishAudio: true }
];

const ARABIC_QUESTIONS: GameQuestion[] = [
  { question: 'اخْتَرْ الْكَلِمَةَ الْمَكْتُوبَةَ بِشَكْلٍ صَحِيحٍ:', options: ['مَدْرَسَةٌ', 'مَدْرَسَهْ', 'مَدْرَسَتْ'], correct: 'مَدْرَسَةٌ', hint: 'تَنْطِقُ هَاءً عِنْدَ الْوَقْفِ وَتَاءً عِنْدَ الْوَصْلِ' },
  { question: 'كَلِمَةُ «الشَّمْسُ» بِهَا:', options: ['لَامٌ شَمْسِيَّةٌ', 'لَامٌ قَمَرِيَّةٌ'], correct: 'لَامٌ شَمْسِيَّةٌ', hint: 'اللَّامُ تُكْتَبُ وَلَا تُنْطَقُ وَبَعْدَهَا شَدَّةٌ' },
  { question: 'كَلِمَةُ «الْقَمَرُ» بِهَا:', options: ['لَامٌ قَمَرِيَّةٌ', 'لَامٌ شَمْسِيَّةٌ'], correct: 'لَامٌ قَمَرِيَّةٌ', hint: 'اللَّامُ تُكْتَبُ وَتُنْطَقُ وَعَلَيْهَا سُكُونٌ' },
  { question: 'التَّنْوِينُ بِالْفَتْحِ لِكَلِمَةِ «كِتَاب»: ', options: ['كِتَاباً', 'كِتَابن', 'كِتَابٌ'], correct: 'كِتَاباً', hint: 'نَضَعُ أَلِفَ تَنْوِينِ الْفَتْحِ' },
  { question: 'أَدَاةُ الاسْتِفْهَامِ لِلسُّؤَالِ عَنِ الزَّمَانِ:', options: ['مَتَى', 'أَيْنَ', 'كَيْفَ'], correct: 'مَتَى', hint: 'مَثَلاً: مَتَى تَسْتَيْقِظُ؟' },
  { question: 'مُضَادُّ كَلِمَةِ «الشُّجَاع»: ', options: ['الْجَبَانُ', 'الْقَوِيُّ', 'الذَّكِيُّ'], correct: 'الْجَبَانُ', hint: 'عَكْسُ الشَّجَاعَةِ' }
];

// Special Princess & Bloom Game tailored for girls and gentle learners
const PRINCESS_GARDEN_QUESTIONS: GameQuestion[] = [
  { question: '🌸 بَاقَاتُ الْوُرُودِ: فِي حَدِيقَةِ الأَمِيرَةِ 4 بَاقَاتٍ، فِي كُلِّ بَاقَةٍ 5 وَرْدَاتٍ جَمِيلَةٍ. كَمْ وَرْدَةً فِي الْمَجْمُوعِ؟', options: ['20 وَرْدَةً', '15 وَرْدَةً', '25 وَرْدَةً'], correct: '20 وَرْدَةً', hint: '4 × 5 = 20' },
  { question: '💖 كَلِمَاتٌ رَقِيقَةٌ: كَيْفَ نَقُولُ «مِنْ فَضْلِكِ» بِلُطْفٍ بِاللُّغَةِ الإِنْجِلِيزِيَّةِ؟', options: ['Please', 'Thank you', 'Sorry'], correct: 'Please', hint: 'Always say please with a smile', audioText: 'Please', isEnglishAudio: true },
  { question: '🎨 أَلْوَانُ الْبَهْجَةِ: أَيُّ الأَلْوَانِ الآتِيَةِ هُوَ «الْوَرْدِيُّ» بِالإِنْجِلِيزِيَّةِ؟', options: ['pink', 'blue', 'green'], correct: 'pink', hint: 'Pink is a lovely soft color', audioText: 'pink', isEnglishAudio: true },
  { question: '🦋 فَرَاشَةُ الرَّبِيعِ: كَلِمَةُ «فَرَاشَة» هِيَ اسْمٌ ...', options: ['مُؤَنَّثٌ', 'مُذَكَّرٌ', 'حَرْفٌ'], correct: 'مُؤَنَّثٌ', hint: 'تَنْتَهِي بِتَاءٍ مَرْبُوطَةٍ' },
  { question: '👑 تَاجُ الأَخْلاقِ: عِنْدَمَا أُسَاعِدُ أُمِّي فِي تَرْتِيبِ غُرْفَتِي، أَنَا بِنْتٌ ...', options: ['مُهَذَّبَةٌ وَبَارَّةٌ', 'كَسُولَةٌ', 'مُتَرَدِّدَةٌ'], correct: 'مُهَذَّبَةٌ وَبَارَّةٌ', hint: 'الْبِرُّ بِالْوَالِدَيْنِ مِنْ أَجْمَلِ الصِّفَاتِ' },
  { question: '👗 أَنَاقَةُ Connect 3: Choose the correct word: «She wears a pretty ... (فُسْتَانٌ)»', options: ['dress', 'pen', 'desk'], correct: 'dress', hint: 'Dress means a pretty gown', audioText: 'dress', isEnglishAudio: true },
  { question: '⏰ سَاعَةُ حَفْلَةِ الشَّايِ: بَدَأَتِ الْحَفْلَةُ 4:00 وَاسْتَمَرَّتْ نِصْفَ سَاعَةٍ (30 دَقِيقَةً). مَتَى تَنْتَهِي؟', options: ['4:30', '4:15', '5:00'], correct: '4:30', hint: '4:00 + 30 دَقِيقَةً' },
  { question: '🍎 صِحَّةٌ وَنَضَارَةٌ: أَيُّ الْأَطْعِمَةِ التَّالِيَةِ صِحِّيٌّ لِلنَّشَاطِ وَالْجَمَالِ؟', options: ['الْفَوَاكِهُ وَالْخَضْرَاوَاتُ', 'الْحَلْوَى الْمُلَوَّنَةُ كَثِيراً', 'الْمَشْرُوبَاتُ الْغَازِيَّةُ'], correct: 'الْفَوَاكِهُ وَالْخَضْرَاوَاتُ', hint: 'الْفِيتَامِينَاتُ تَمْنَحُ الطَّاقَةَ وَالنَّضَارَةَ' }
];

// Speed Champion Mental Quiz
const SPEED_CHAMPION_QUESTIONS: GameQuestion[] = [
  { question: '⚡ احْسُبْ فِي ثَوَانٍ: 30 ÷ 5 = ؟', options: ['6', '5', '7'], correct: '6', hint: '6 × 5 = 30' },
  { question: '⚡ نِصْفُ السَّاعَةِ = كَمْ دَقِيقَةً؟', options: ['30 دَقِيقَةً', '15 دَقِيقَةً', '20 دَقِيقَةً'], correct: '30 دَقِيقَةً', hint: '60 ÷ 2 = 30' },
  { question: '⚡ مُضَادُّ كَلِمَةِ «سَعِيد» (Happy) هُوَ:', options: ['sad', 'tired', 'hot'], correct: 'sad', hint: 'Sad means unhappy', audioText: 'sad', isEnglishAudio: true },
  { question: '⚡ كَلِمَةُ «مَسْرُورٌ» بِهَا تَنْوِينٌ بِـ:', options: ['الضَّمِّ', 'الْفَتْحِ', 'الْكَسْرِ'], correct: 'الضَّمِّ', hint: 'ضَمَّتَانِ فَوْقَ الرَّاءِ' },
  { question: '⚡ جَدْوَلُ الضَّرْبِ السَّرِيعُ: 7 × 8 = ؟', options: ['56', '54', '64'], correct: '56', hint: '7 × 8 = 56' },
  { question: '⚡ مُحِيطُ مُثَلَّثٍ مُتَسَاوِي الأَضْلاعِ طُولُ ضِلْعِهِ 4 سَم = ؟', options: ['12 سَم', '16 سَم', '8 سَم'], correct: '12 سَم', hint: '4 + 4 + 4 = 12' }
];

export const EducationalGamesModal: React.FC<EducationalGamesModalProps> = ({
  isOpen,
  onClose,
  onAddStars,
  studentName
}) => {
  const [currentGame, setCurrentGame] = useState<GameType>('mathRocket');
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const getQuestionList = (): GameQuestion[] => {
    switch (currentGame) {
      case 'mathRocket': return MATH_QUESTIONS;
      case 'englishHunter': return ENGLISH_QUESTIONS;
      case 'arabicTreasure': return ARABIC_QUESTIONS;
      case 'princessGarden': return PRINCESS_GARDEN_QUESTIONS;
      case 'speedChampion': return SPEED_CHAMPION_QUESTIONS;
    }
  };

  const questions = getQuestionList();
  const currentQ = questions[currentIndex % questions.length];

  useEffect(() => {
    if (isOpen && currentQ.audioText) {
      if (currentQ.isEnglishAudio) {
        speakEnglish(currentQ.audioText);
      } else {
        speakArabic(currentQ.audioText);
      }
    }
    return () => {
      stopSpeaking();
    };
  }, [currentIndex, currentGame, isOpen]);

  if (!isOpen) return null;

  const handleSelectOption = (opt: string) => {
    if (isAnswerChecked) return;
    sounds.playButtonTap();
    setSelectedOption(opt);
    setIsAnswerChecked(true);

    const correct = opt === currentQ.correct;
    setIsCorrect(correct);

    if (correct) {
      sounds.playCheerSuccess();
      const newCombo = combo + 1;
      setCombo(newCombo);
      const points = 5 + newCombo * 2;
      setScore(prev => prev + points);
      onAddStars(points);

      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}
    } else {
      sounds.playHint();
      setCombo(0);
    }
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    setSelectedOption(null);
    setIsAnswerChecked(false);
    if (currentIndex + 1 >= questions.length) {
      setShowSummary(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleRestartGame = () => {
    sounds.playClick();
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setShowSummary(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Arcade Top Banner */}
        <div className={`p-4 sm:p-5 text-white flex items-center justify-between transition-colors ${
          currentGame === 'princessGarden' 
            ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600'
            : 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700'
        }`}>
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-white/20 rounded-2xl text-2xl shadow">
              {currentGame === 'princessGarden' ? '🌸' : '🎮'}
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black">
                {currentGame === 'princessGarden' ? 'قَصْرُ الأَمِيرَاتِ وَحَدِيقَةُ الْوُرُودِ 🌸' : 'أَلْعَابُ التَّحَدِّي وَتَقْفِيلِ النُّجُومِ 🌟'}
              </h2>
              <p className="text-xs text-purple-100 font-bold">
                الْعَبْ، تَحَدَّ نَفْسَكَ، وَاكْسِبْ نُجُوماً حَقِيقِيَّةً لِحِسَابِكَ!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopSpeaking();
              sounds.playClick();
              onClose();
            }}
            className="p-2 bg-white/15 hover:bg-white/30 rounded-xl transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Game Mode Selector (Mobile Optimized 5 Games) */}
        <div className="grid grid-cols-2 sm:grid-cols-5 bg-stone-100 p-1.5 border-b border-stone-200 text-xs font-black gap-1">
          <button
            onClick={() => {
              setCurrentGame('princessGarden');
              handleRestartGame();
            }}
            className={`py-2 px-1 rounded-xl transition flex items-center justify-center gap-1 col-span-2 sm:col-span-1 ${
              currentGame === 'princessGarden' ? 'bg-pink-600 text-white shadow' : 'text-stone-700 hover:bg-pink-100/70 bg-pink-50/50'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span className="truncate">حَدِيقَةُ الأَمِيرَاتِ 🌸</span>
          </button>

          <button
            onClick={() => {
              setCurrentGame('mathRocket');
              handleRestartGame();
            }}
            className={`py-2 px-1 rounded-xl transition flex items-center justify-center gap-1 ${
              currentGame === 'mathRocket' ? 'bg-amber-500 text-white shadow' : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span className="truncate">الرِّيَاضِيَّاتُ 🚀</span>
          </button>

          <button
            onClick={() => {
              setCurrentGame('englishHunter');
              handleRestartGame();
            }}
            className={`py-2 px-1 rounded-xl transition flex items-center justify-center gap-1 ${
              currentGame === 'englishHunter' ? 'bg-sky-600 text-white shadow' : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="truncate">Connect 3 🔤</span>
          </button>

          <button
            onClick={() => {
              setCurrentGame('arabicTreasure');
              handleRestartGame();
            }}
            className={`py-2 px-1 rounded-xl transition flex items-center justify-center gap-1 ${
              currentGame === 'arabicTreasure' ? 'bg-emerald-600 text-white shadow' : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="truncate">الْعَرَبِيَّةُ 🏴‍☠️</span>
          </button>

          <button
            onClick={() => {
              setCurrentGame('speedChampion');
              handleRestartGame();
            }}
            className={`py-2 px-1 rounded-xl transition flex items-center justify-center gap-1 col-span-2 sm:col-span-1 ${
              currentGame === 'speedChampion' ? 'bg-indigo-600 text-white shadow' : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span className="truncate">الذَّكَاءُ السَّرِيعُ ⚡</span>
          </button>
        </div>

        {/* Score & Combo Bar */}
        <div className="bg-stone-50 px-4 sm:px-5 py-2 flex items-center justify-between border-b border-stone-200 text-xs font-bold">
          <div className="flex items-center gap-3">
            <span className="text-amber-600 font-black flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>نِقَاطُكَ: {score}</span>
            </span>
            {combo > 1 && (
              <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 animate-bounce">
                <Flame className="w-3 h-3 fill-white" />
                <span>كُومْبُو x{combo}!</span>
              </span>
            )}
          </div>
          <span className="text-stone-500">
            السُّؤَالُ {currentIndex + 1} مِنْ {questions.length}
          </span>
        </div>

        {/* Game Stage Area */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto bg-gradient-to-b from-white to-stone-50">
          {!showSummary ? (
            <div className="space-y-4">
              {/* Question Card */}
              <div className={`p-5 rounded-2xl border-2 text-center space-y-2 ${
                currentGame === 'princessGarden'
                  ? 'bg-pink-50/70 border-pink-200'
                  : 'bg-amber-50/70 border-amber-200'
              }`}>
                <span className="text-3xl">
                  {currentGame === 'princessGarden' ? '🌸' : currentGame === 'mathRocket' ? '🚀' : currentGame === 'englishHunter' ? '🎯' : currentGame === 'speedChampion' ? '⚡' : '💎'}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-relaxed">
                  {currentQ.question}
                </h3>

                {currentQ.audioText && (
                  <button
                    type="button"
                    onClick={() => {
                      if (currentQ.isEnglishAudio) {
                        speakEnglish(currentQ.audioText!);
                      } else {
                        speakArabic(currentQ.audioText!);
                      }
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-stone-100 rounded-full text-xs font-bold text-sky-700 shadow-xs border border-sky-200"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>اسْتَمِعْ لِلنُّطْقِ الْهَادِئِ 🔊</span>
                  </button>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2.5">
                {currentQ.options.map((opt, i) => {
                  const isSelected = selectedOption === opt;
                  let btnStyle = 'bg-white border-2 border-stone-200 text-stone-800 hover:border-amber-400 hover:bg-amber-50/40';

                  if (isAnswerChecked) {
                    if (opt === currentQ.correct) {
                      btnStyle = 'bg-emerald-500 text-white border-2 border-emerald-600 shadow-md scale-102';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-500 text-white border-2 border-rose-600 shadow-md';
                    } else {
                      btnStyle = 'bg-stone-100 text-stone-400 border-2 border-stone-200 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={isAnswerChecked}
                      onClick={() => handleSelectOption(opt)}
                      className={`p-3.5 rounded-2xl font-black text-sm transition transform active:scale-98 flex items-center justify-between ${btnStyle}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-black/10 flex items-center justify-center text-xs">
                          {i + 1}
                        </span>
                        <span>{opt}</span>
                      </span>

                      {isAnswerChecked && opt === currentQ.correct && (
                        <CheckCircle2 className="w-5 h-5 text-white animate-bounce" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Next */}
              {isAnswerChecked && (
                <div className={`p-4 rounded-2xl flex items-center justify-between text-xs font-black animate-fadeIn ${
                  isCorrect ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' : 'bg-rose-100 text-rose-950 border border-rose-300'
                }`}>
                  <div>
                    <p className="text-sm">
                      {isCorrect ? '🌟 إِجَابَةٌ رَائِعَةٌ وَعَبْقَرِيَّةٌ!' : '💡 حَاوِلْ مَرَّةً أُخْرَى!'}
                    </p>
                    {!isCorrect && (
                      <p className="font-bold opacity-80 mt-0.5">
                        التَّلْمِيحُ: {currentQ.hint}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl flex items-center gap-1 shadow-md transition transform active:scale-95"
                  >
                    <span>التَّالِي</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Summary End Stage */
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-4xl shadow-inner border-2 border-amber-300">
                🏆
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900">
                  أَحْسَنْتَ يَا {studentName}! أَتْمَمْتَ جَوْلَةَ التَّحَدِّي!
                </h3>
                <p className="text-xs text-stone-600 font-bold">
                  حَصَلْتَ عَلَى <strong>{score}</strong> نُقْطَةً ذَهَبِيَّةً أُضِيفَتْ إِلَى حِسَابِكَ!
                </p>
              </div>

              <div className="pt-4 flex items-center justify-center gap-2">
                <button
                  onClick={handleRestartGame}
                  className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>الْعَبْ مَرَّةً أُخْرَى 🔄</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-3 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-2xl font-black text-xs transition"
                >
                  الْعَوْدَةُ لِلْمَنْهَجِ
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
