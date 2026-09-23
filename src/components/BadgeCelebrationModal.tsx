import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, UserProfile } from '../types';
import { sounds, playPraiseVoice } from '../utils/audio';
import confetti from 'canvas-confetti';
import { Sparkles, Trophy, Check, ArrowRight } from 'lucide-react';

interface BadgeCelebrationModalProps {
  badge: Badge | null;
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
}

export const BadgeCelebrationModal: React.FC<BadgeCelebrationModalProps> = ({
  badge,
  isOpen,
  onClose,
  profile
}) => {
  useEffect(() => {
    if (isOpen && badge) {
      sounds.playFanfare();
      const isGirl = profile.heroType === 'girl';
      playPraiseVoice(
        profile.name,
        isGirl,
        isGirl
          ? `مَبْرُوكٌ يَا بَطَلَتَنَا ${profile.name}! لَقَدْ حَصَلْتِ عَلَى ${badge.title}!`
          : `مَبْرُوكٌ يَا بَطَلَنَا ${profile.name}! لَقَدْ حَصَلْتَ عَلَى ${badge.title}!`
      );

      // Launch joyful colorful confetti
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 }
        });
      } catch {
        // Ignore confetti error
      }
    }
  }, [isOpen, badge]);

  if (!isOpen || !badge) return null;

  const isGirl = profile.heroType === 'girl';

  return (
    <AnimatePresence>
      <div 
        id="badge-celebration-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/75 backdrop-blur-md"
      >
        <motion.div
          id="badge-celebration-card"
          initial={{ opacity: 0, scale: 0.7, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ type: 'spring', damping: 18, stiffness: 260 }}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden text-center relative p-6 md:p-8 space-y-5"
        >
          {/* Header Banner */}
          <div className="inline-flex items-center gap-1.5 bg-amber-100 text-amber-900 px-4 py-1 rounded-full text-xs font-black border border-amber-300">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>وَسَامٌ رَقْمِيٌّ جَدِيدٌ مُكْتَسَبٌ!</span>
          </div>

          {/* Big Animated Badge Icon */}
          <motion.div 
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', damping: 12, stiffness: 180, delay: 0.15 }}
            className="w-28 h-28 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 shadow-xl flex items-center justify-center text-6xl ring-4 ring-amber-300/60"
          >
            {badge.icon}
          </motion.div>

          {/* Title & Congratulations */}
          <div className="space-y-1.5">
            <p className="text-xs font-bold text-amber-700">
              {isGirl ? 'مُبَارَكٌ لَكِ يَا بَطَلَتَنَا الْمُبْدِعَةَ' : 'مُبَارَكٌ لَكَ يَا بَطَلَنَا الشُّجَاعَ'} <span className="font-black text-stone-900">{profile.name}</span>
            </p>
            <h3 className="text-2xl font-black text-stone-900">
              {badge.title}
            </h3>
            <p className="text-sm font-bold text-stone-600 leading-relaxed px-2">
              {badge.description}
            </p>
          </div>

          {/* Badge Category Tag */}
          <div className="inline-block bg-purple-50 text-purple-900 border border-purple-200 px-3 py-1 rounded-xl text-xs font-bold">
            {badge.category === 'unit' 
              ? '🏆 جَائِزَةُ إِتْمَامِ الْوَحْدَةِ الدِّرَاسِيَّةِ بِالْكَامِلِ' 
              : '🌟 إِتْقَانُ مَهَارَةٍ وَتَفَوُّقٌ مَنْهَجِيٌّ'}
          </div>

          {/* Action Button */}
          <div>
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="w-full py-3 px-6 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-base rounded-2xl shadow-md transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              <span>مُوَاصَلَةُ التَّعَلُّمِ وَالتَّأَلُّقِ</span>
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
