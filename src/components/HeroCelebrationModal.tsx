import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HeroOfTheDayAnnouncement } from '../types';
import { sounds, speakArabic, stopSpeaking } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Trophy, 
  Crown, 
  Sparkles, 
  Star, 
  Award, 
  Volume2, 
  VolumeX, 
  X,
  CheckCircle2
} from 'lucide-react';

interface HeroCelebrationModalProps {
  announcement: HeroOfTheDayAnnouncement | null;
  isOpen: boolean;
  onClaim: (bonusStars: number) => void;
  onClose: () => void;
}

export const HeroCelebrationModal: React.FC<HeroCelebrationModalProps> = ({
  announcement,
  isOpen,
  onClaim,
  onClose
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(false);

  useEffect(() => {
    if (isOpen && announcement) {
      // Trigger celebration fanfare sound and confetti
      try {
        sounds.playFanfare();
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {}

      // Play joyful voice congratulation
      const audioText = `مُبَارَكٌ لَكَ يَا ${announcement.studentName}! لَقَدْ تَمَّ اخْتِيَارُكَ بَطَلَ الْيَوْمِ فِي الْفَصْلِ بِوَاسِطَةِ الأُسْتَاذِ شَرِيف عَسْقَلَانِي!`;
      setIsPlayingAudio(true);
      const audio = speakArabic(
        audioText,
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(true)
      );

      return () => {
        audio.stop();
        stopSpeaking();
      };
    }
  }, [isOpen, announcement]);

  if (!isOpen || !announcement) return null;

  const handleToggleVoice = () => {
    if (isPlayingAudio) {
      stopSpeaking();
      setIsPlayingAudio(false);
    } else {
      const audioText = `مُبَارَكٌ لَكَ يَا ${announcement.studentName}! لَقَدْ تَمَّ اخْتِيَارُكَ بَطَلَ الْيَوْمِ فِي الْفَصْلِ بِوَاسِطَةِ الأُسْتَاذِ شَرِيف عَسْقَلَانِي!`;
      setIsPlayingAudio(true);
      speakArabic(
        audioText,
        () => setIsPlayingAudio(false),
        () => setIsPlayingAudio(true)
      );
    }
  };

  return (
    <AnimatePresence>
      <div 
        id="hero-of-the-day-modal-root"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/75 backdrop-blur-sm"
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 20 }}
          className="relative w-full max-w-lg bg-gradient-to-b from-amber-50 via-white to-amber-100/60 rounded-3xl border-4 border-amber-400 shadow-2xl p-6 sm:p-8 text-center overflow-hidden"
        >
          {/* Shimmering Top Crown Badge */}
          <div className="flex justify-center mb-3">
            <motion.div 
              animate={{ rotate: [-5, 5, -5], scale: [1, 1.08, 1] }}
              transition={{ repeat: Infinity, duration: 2.5 }}
              className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-4 border-white shadow-xl flex items-center justify-center text-4xl"
            >
              👑
            </motion.div>
          </div>

          <div className="inline-flex items-center gap-2 bg-amber-200/80 border border-amber-400 text-amber-950 px-3.5 py-1 rounded-full text-xs font-black mb-3 shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>إِعْلَانٌ رَسْمِيٌّ مِنْ مُعَلِّمِ الْفَصْلِ 📣</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-amber-950 mb-1">
            🌟 بَطَلُ الْيَوْمِ فِي الْفَصْلِ 🌟
          </h2>
          <p className="text-sm font-bold text-stone-600 mb-4">
            تَهْنِئَةٌ خَاصَّةٌ مُهْدَاةٌ لِلْبَطَلِ الْمُجْتَهِدِ:
          </p>

          {/* Student Crown Nameplate */}
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white p-4 rounded-2xl shadow-lg border-2 border-amber-300 mb-4 flex items-center justify-between">
            <div className="text-right">
              <span className="text-[11px] text-amber-200 font-bold block">
                تَتْوِيجُ الْبَطَلِ:
              </span>
              <p className="text-xl sm:text-2xl font-black text-white">
                {announcement.studentName} 🏆
              </p>
            </div>
            <div className="flex items-center gap-1.5 bg-amber-400 text-amber-950 px-3 py-1.5 rounded-xl font-black text-xs shadow-md">
              <Star className="w-4 h-4 fill-amber-950" />
              <span>+{announcement.bonusStars} نُجُوم</span>
            </div>
          </div>

          {/* Teacher Dedicated Message */}
          <div className="bg-white/90 border-2 border-amber-200 rounded-2xl p-4 text-right mb-5 shadow-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-indigo-900 flex items-center gap-1">
                <Award className="w-4 h-4 text-amber-600" />
                <span>رِسَالَةُ الْمُعَلِّمِ: {announcement.teacherName}</span>
              </span>
              <button
                type="button"
                onClick={handleToggleVoice}
                className={`p-1.5 rounded-lg border transition ${
                  isPlayingAudio 
                    ? 'bg-amber-600 text-white border-amber-700' 
                    : 'bg-amber-100 text-amber-900 border-amber-300 hover:bg-amber-200'
                }`}
                title="الاستماع لصوت التهنئة"
              >
                {isPlayingAudio ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-stone-800 text-xs sm:text-sm font-bold leading-relaxed">
              «{announcement.congratulationMessage}»
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button
              id="claim-hero-reward-btn"
              onClick={() => {
                sounds.playSuccess();
                onClaim(announcement.bonusStars);
              }}
              className="w-full bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white font-black text-base py-3.5 rounded-2xl shadow-lg hover:shadow-xl transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5 text-white" />
              <span>اسْتِلَامُ وِسَامِ بَطَلِ الْيَوْمِ (+{announcement.bonusStars} ⭐)</span>
            </button>

            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="w-full text-stone-500 hover:text-stone-800 text-xs font-bold py-2 transition"
            >
              إِغْلَاقُ النَّافِذَةِ
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
