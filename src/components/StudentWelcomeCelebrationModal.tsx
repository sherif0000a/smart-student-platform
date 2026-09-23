import React, { useEffect } from 'react';
import { Sparkles, Trophy, Star, ArrowRight, Play, Gamepad2, BookOpen, Calculator } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds, speakArabic, stopSpeaking } from '../utils/audio';
import { UserProfile, SubjectType } from '../types';

interface StudentWelcomeCelebrationModalProps {
  isOpen: boolean;
  student: UserProfile;
  onClose: () => void;
  onSelectSubject: (subject: SubjectType) => void;
  onOpenGames: () => void;
}

export const StudentWelcomeCelebrationModal: React.FC<StudentWelcomeCelebrationModalProps> = ({
  isOpen,
  student,
  onClose,
  onSelectSubject,
  onOpenGames
}) => {
  const isGirl = student.heroType === 'girl';

  useEffect(() => {
    if (isOpen) {
      sounds.playCheerSuccess();
      confetti({
        particleCount: 70,
        spread: 80,
        origin: { y: 0.6 }
      });

      const welcomeSpoken = isGirl
        ? `أَهْلاً بِكِ يَا بَطَلَتَنَا الْمُجْتَهِدَةَ ${student.name}! نَحْنُ سُعَدَاءُ جِدّاً بِعَوْدَتِكِ. هَيَّا نَبْدَأُ رِحْلَةَ التَّفَوُّقِ وَحَصْدِ النُّجُومِ!`
        : `أَهْلاً بِكَ يَا بَطَلَنَا الْمُجْتَهِدَ ${student.name}! نَحْنُ سُعَدَاءُ جِدّاً بِعَوْدَتِكَ. هَيَّا نَبْدَأُ رِحْلَةَ التَّفَوُّقِ وَحَصْدِ النُّجُومِ!`;

      speakArabic(welcomeSpoken, undefined, undefined, 0.9);
    }

    return () => {
      stopSpeaking();
    };
  }, [isOpen, student.name, isGirl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/70 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden flex flex-col text-center">
        {/* Colorful Header */}
        <div className="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 p-6 text-white space-y-2 relative">
          <div className="text-5xl animate-bounce">
            {student.avatar || (isGirl ? '👧' : '👦')}
          </div>
          <h2 className="text-2xl md:text-3xl font-black">
            {isGirl ? `مَرْحَبًا بِبَطَلَتِنَا الْمُتَأَلِّقَةِ ${student.name}! 🌟` : `مَرْحَبًا بِبَطَلِنَا الْمُتَأَلِّقِ ${student.name}! 🌟`}
          </h2>
          <p className="text-xs md:text-sm font-bold text-amber-950/80">
            مَنَصَّةُ الطَّالِبِ الْمُجْتَهِدِ تَتَمَنَّى لَكَ يَوْماً تَعْلِيمِيّاً مَلِيئاً بِالْمَرَحِ وَالنَّجَاحِ!
          </p>
        </div>

        {/* Motivation Card */}
        <div className="p-6 space-y-4">
          <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="p-2.5 bg-amber-400 text-slate-900 rounded-xl text-xl shadow">⭐</span>
              <div className="text-right">
                <div className="text-xs font-bold text-stone-500">رَصِيدُ نُجُومِكَ الْحَالِيِّ</div>
                <div className="text-xl font-black text-amber-900">{student.totalStars} نَجْمَة ذَهَبِيَّة</div>
              </div>
            </div>
            <div className="text-left">
              <span className="text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                بَطَلٌ نَشِطٌ الآنَ 🟢
              </span>
            </div>
          </div>

          <div className="text-right space-y-2">
            <h4 className="text-xs font-black text-stone-700">مَاذَا تُرِيدُ أَنْ تَبْدَأَ بِهِ الْيَوْمَ؟</h4>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  onSelectSubject('math');
                  onClose();
                }}
                className="p-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-white font-black text-xs flex flex-col items-center gap-1.5 shadow transition-all hover:scale-105 active:scale-95"
              >
                <Calculator className="w-5 h-5" />
                <span>الرِّيَاضِيَّاتُ 🧮</span>
                <span className="text-[10px] text-amber-100">10 فُصُولٍ</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  onSelectSubject('english');
                  onClose();
                }}
                className="p-3 rounded-2xl bg-sky-600 hover:bg-sky-700 text-white font-black text-xs flex flex-col items-center gap-1.5 shadow transition-all hover:scale-105 active:scale-95"
              >
                <BookOpen className="w-5 h-5" />
                <span>الإِنْجِلِيزِيُّ 🔤</span>
                <span className="text-[10px] text-sky-100">Connect 3</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  onSelectSubject('arabic');
                  onClose();
                }}
                className="p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs flex flex-col items-center gap-1.5 shadow transition-all hover:scale-105 active:scale-95"
              >
                <Sparkles className="w-5 h-5" />
                <span>اللُّغَةُ الْعَرَبِيَّةُ 📖</span>
                <span className="text-[10px] text-emerald-100">أَنَاشِيدٌ وَقِصَصٌ</span>
              </button>
            </div>
          </div>

          {/* Quick Games Shortcut */}
          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              onOpenGames();
              onClose();
            }}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-black text-sm rounded-2xl shadow-md flex items-center justify-center gap-2 transition hover:scale-[1.02] active:scale-95"
          >
            <Gamepad2 className="w-5 h-5" />
            <span>لُعْبَةُ صَارُوخِ الرِّيَاضِيَّاتِ وَصَائِدِ الْكَلِمَاتِ 🎮</span>
          </button>

          <button
            type="button"
            onClick={() => {
              stopSpeaking();
              onClose();
            }}
            className="w-full py-2.5 text-stone-500 hover:text-stone-800 text-xs font-bold transition"
          >
            دُخُولُ الصَّفْحَةِ الرَّئِيسِيَّةِ مُبَاشَرَةً ←
          </button>
        </div>
      </div>
    </div>
  );
};
