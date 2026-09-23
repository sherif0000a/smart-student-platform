import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { sounds } from '../utils/audio';
import { Sparkles, MessageCircle, Bot } from 'lucide-react';

interface FloatingRobotButtonProps {
  isOpen: boolean;
  onClick: () => void;
  studentName?: string;
}

export const FloatingRobotButton: React.FC<FloatingRobotButtonProps> = ({
  isOpen,
  onClick,
  studentName = 'يَا بَطَل'
}) => {
  const [isAnimatingClick, setIsAnimatingClick] = useState(false);

  if (isOpen) return null;

  const handleClick = () => {
    if (isAnimatingClick) return;
    
    // Play tactile cheerful audio feedback
    sounds.playClick();
    setIsAnimatingClick(true);

    // Give visual tactile feedback (wiggle & expand) before opening chat dialog
    setTimeout(() => {
      onClick();
      setIsAnimatingClick(false);
    }, 280);
  };

  return (
    <div className="fixed bottom-6 left-6 z-40 select-none">
      <AnimatePresence>
        <motion.div
          key="floating-robot-wrapper"
          initial={{ scale: 0, opacity: 0, y: 60, rotate: -20 }}
          animate={{ scale: 1, opacity: 1, y: 0, rotate: 0 }}
          exit={{ scale: 0, opacity: 0, y: 40 }}
          transition={{
            type: 'spring',
            stiffness: 260,
            damping: 18,
            delay: 0.3
          }}
          className="relative"
        >
          {/* Subtle Attention Floating Tooltip Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ 
              opacity: 1, 
              y: [0, -5, 0],
              transition: {
                y: { repeat: Infinity, duration: 2.2, ease: 'easeInOut' },
                opacity: { delay: 1, duration: 0.4 }
              }
            }}
            className="absolute -top-10 right-0 sm:right-auto sm:left-0 pointer-events-none whitespace-nowrap bg-white text-purple-900 border-2 border-purple-300 text-[11px] font-black px-3 py-1 rounded-full shadow-lg flex items-center gap-1.5 animate-calm-pulse"
          >
            <Sparkles className="w-3 h-3 text-amber-500 fill-amber-400 animate-sparkle" />
            <span>اسْأَلِ الرُّوبُوتَ الذَّكِيَّ!</span>
            <div className="absolute -bottom-1.5 left-6 w-3 h-3 bg-white border-r-2 border-b-2 border-purple-300 transform rotate-45" />
          </motion.div>

          {/* Interactive Action Button with Click Shake & Pulse */}
          <motion.button
            id="floating-robot-trigger"
            onClick={handleClick}
            whileHover={{ 
              scale: 1.08,
              boxShadow: '0 20px 35px -10px rgba(124, 58, 237, 0.5)'
            }}
            whileTap={{ scale: 0.92 }}
            animate={
              isAnimatingClick
                ? {
                    scale: [1, 1.25, 0.9, 1.15, 1],
                    rotate: [0, -12, 12, -8, 8, 0],
                    boxShadow: [
                      '0 0 0 0px rgba(168, 85, 247, 0.8)',
                      '0 0 0 20px rgba(168, 85, 247, 0)',
                      '0 0 0 0px rgba(168, 85, 247, 0)'
                    ],
                    transition: { duration: 0.28, ease: 'easeOut' }
                  }
                : {
                    y: [-2, 2, -2],
                    transition: {
                      repeat: Infinity,
                      duration: 3,
                      ease: 'easeInOut'
                    }
                  }
            }
            className="relative group bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white p-2.5 sm:px-4 sm:py-2.5 rounded-full shadow-xl flex items-center gap-2.5 border border-white/90 focus:outline-none focus:ring-4 focus:ring-purple-300"
            title="تحدث مع الروبوت المعلم لكتاب الوزارة"
            aria-label="اسأل الروبوت الذكي"
          >
            {/* Pulsing Backlight Halo */}
            <span className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-full blur-sm opacity-40 group-hover:opacity-100 transition duration-300 -z-10 animate-pulse" />

            {/* Robot Icon with Antenna Indicator */}
            <div className="relative w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-lg sm:text-xl group-hover:rotate-12 transition transform">
              <span className="text-lg sm:text-xl">🤖</span>
              {/* Antenna Blinking Light */}
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full shadow-xs animate-ping" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-400 border-2 border-white rounded-full shadow-xs" />
            </div>

            {/* Button Label & Call to action */}
            <div className="text-right hidden sm:block">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-xs sm:text-sm text-white tracking-wide">
                  اسْأَلِ الرُّوبُوتَ الذَّكِيَّ
                </span>
                <span className="text-[9px] bg-amber-400 text-amber-950 font-black px-1.5 py-0.5 rounded-md">
                  كِتَابُ الْوَزَارَةِ
                </span>
              </div>
              <p className="text-[9px] font-bold text-purple-200">
                مُتَّصِلٌ بِالأَنَاشِيدِ وَالْقَوَاعِدِ 📚
              </p>
            </div>

            {/* Expanding Touch Indicator for Mobile */}
            <div className="sm:hidden flex items-center justify-center w-4 h-4 bg-white/20 rounded-full">
              <MessageCircle className="w-3 h-3 text-white" />
            </div>
          </motion.button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
