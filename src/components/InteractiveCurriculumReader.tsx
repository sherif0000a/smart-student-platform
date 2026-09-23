import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, SkipBack, RotateCcw, Volume2, VolumeX, Sparkles, Gauge } from 'lucide-react';
import { speakArabic, stopSpeaking, splitArabicSentences, sounds } from '../utils/audio';

interface InteractiveCurriculumReaderProps {
  text: string;
  title?: string;
  autoPlay?: boolean;
  onFinished?: () => void;
  className?: string;
}

export const InteractiveCurriculumReader: React.FC<InteractiveCurriculumReaderProps> = ({
  text,
  title = 'الْقِرَاءَةُ النَّمُوذَجِيَّةُ الْمُعَبِّرَةُ',
  autoPlay = false,
  onFinished,
  className = ''
}) => {
  const sentences = splitArabicSentences(text);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(0.85); // 0.85 is ideal for 3rd grade Arabic phonics
  const isPlayingRef = useRef<boolean>(false);
  const sentenceTimerRef = useRef<any>(null);

  useEffect(() => {
    isPlayingRef.current = isPlaying;
  }, [isPlaying]);

  // Clean up on unmount and listen to global stop
  useEffect(() => {
    const handleGlobalStop = () => {
      if (sentenceTimerRef.current) {
        clearTimeout(sentenceTimerRef.current);
        sentenceTimerRef.current = null;
      }
      setIsPlaying(false);
    };

    window.addEventListener('al-talib-audio-stopped', handleGlobalStop);

    return () => {
      window.removeEventListener('al-talib-audio-stopped', handleGlobalStop);
      if (sentenceTimerRef.current) {
        clearTimeout(sentenceTimerRef.current);
        sentenceTimerRef.current = null;
      }
      stopSpeaking();
    };
  }, []);

  const playSentenceAt = (index: number) => {
    if (sentenceTimerRef.current) {
      clearTimeout(sentenceTimerRef.current);
      sentenceTimerRef.current = null;
    }

    if (index < 0 || index >= sentences.length) {
      setIsPlaying(false);
      onFinished?.();
      return;
    }

    setCurrentIndex(index);
    setIsPlaying(true);

    const sentence = sentences[index];
    speakArabic(
      sentence,
      () => {
        // onEnd
        if (isPlayingRef.current) {
          if (index + 1 < sentences.length) {
            // Small natural breath pause between sentences (450ms)
            sentenceTimerRef.current = setTimeout(() => {
              if (isPlayingRef.current) {
                playSentenceAt(index + 1);
              }
            }, 450);
          } else {
            setIsPlaying(false);
            sounds.playSuccess();
            onFinished?.();
          }
        }
      },
      () => {
        // onStart
      },
      speed
    );
  };

  const handleTogglePlay = () => {
    sounds.playButtonTap();
    if (sentenceTimerRef.current) {
      clearTimeout(sentenceTimerRef.current);
      sentenceTimerRef.current = null;
    }
    if (isPlaying) {
      setIsPlaying(false);
      stopSpeaking();
    } else {
      playSentenceAt(currentIndex);
    }
  };

  const handleNext = () => {
    sounds.playButtonTap();
    if (currentIndex + 1 < sentences.length) {
      playSentenceAt(currentIndex + 1);
    }
  };

  const handlePrev = () => {
    sounds.playButtonTap();
    if (currentIndex > 0) {
      playSentenceAt(currentIndex - 1);
    }
  };

  const handleRestart = () => {
    sounds.playButtonTap();
    playSentenceAt(0);
  };

  const handleSentenceClick = (index: number) => {
    sounds.playButtonTap();
    playSentenceAt(index);
  };

  const cycleSpeed = () => {
    sounds.playButtonTap();
    const speeds = [0.75, 0.85, 1.0];
    const currentPos = speeds.indexOf(speed);
    const nextSpeed = speeds[(currentPos + 1) % speeds.length];
    setSpeed(nextSpeed);
    if (isPlaying) {
      // Re-trigger current sentence with new speed
      playSentenceAt(currentIndex);
    }
  };

  if (sentences.length === 0) {
    return null;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-gradient-to-br from-purple-50/90 to-indigo-50/80 border-2 border-purple-200/80 rounded-2xl p-4 shadow-sm ${className}`}
    >
      {/* Reader Top Bar */}
      <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-purple-200/60 flex-wrap">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center text-sm shadow-xs">
            🔊
          </span>
          <div>
            <h4 className="text-xs font-black text-purple-950 flex items-center gap-1.5">
              <span>{title}</span>
              {isPlaying && (
                <span className="inline-flex items-center gap-1 text-[10px] text-emerald-700 bg-emerald-100/90 px-2 py-0.5 rounded-full font-bold animate-pulse">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  جَارٍ الإِلْقَاءُ
                </span>
              )}
            </h4>
            <p className="text-[10px] text-purple-700 font-semibold">
              الْجُمْلَةُ {currentIndex + 1} مِنْ {sentences.length} • انْقُرْ عَلَى أَيِّ جُمْلَةٍ لِلاسْتِمَاعِ إِلَيْهَا
            </p>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="flex items-center gap-1.5">
          {/* Speed Toggle */}
          <button
            type="button"
            onClick={cycleSpeed}
            className="flex items-center gap-1 text-[11px] font-bold bg-white text-purple-900 px-2.5 py-1.5 rounded-xl border border-purple-200 hover:bg-purple-100 transition shadow-2xs"
            title="تغيير سرعة القراءة لتناسب استيعاب الطفل"
          >
            <Gauge className="w-3.5 h-3.5 text-purple-600" />
            <span>{speed === 0.75 ? 'مُتَمَهِّلٌ (0.75x)' : speed === 0.85 ? 'هَادِئٌ (0.85x)' : 'عَادِيٌّ (1.0x)'}</span>
          </button>

          {/* Previous Sentence */}
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="p-1.5 rounded-xl bg-white text-purple-800 border border-purple-200 hover:bg-purple-100 disabled:opacity-40 disabled:pointer-events-none transition shadow-2xs"
            title="الجملة السابقة"
          >
            <SkipForward className="w-4 h-4 rotate-180" />
          </button>

          {/* Play/Pause Button */}
          <button
            type="button"
            onClick={handleTogglePlay}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-black text-xs text-white shadow-sm transition transform active:scale-95 ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-purple-600 hover:bg-purple-700'
            }`}
            title={isPlaying ? 'إيقاف مؤقت' : 'بدء القراءة الجهرية'}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-white" />
                <span>إِيقَافٌ</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-white" />
                <span>اسْتَمِعْ الآنَ</span>
              </>
            )}
          </button>

          {/* Next Sentence */}
          <button
            type="button"
            onClick={handleNext}
            disabled={currentIndex + 1 >= sentences.length}
            className="p-1.5 rounded-xl bg-white text-purple-800 border border-purple-200 hover:bg-purple-100 disabled:opacity-40 disabled:pointer-events-none transition shadow-2xs"
            title="الجملة التالية"
          >
            <SkipBack className="w-4 h-4 rotate-180" />
          </button>

          {/* Restart from beginning */}
          <button
            type="button"
            onClick={handleRestart}
            className="p-1.5 rounded-xl bg-white text-purple-700 border border-purple-200 hover:bg-purple-100 transition shadow-2xs"
            title="إعادة القراءة من البداية"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Visual Interactive Text Body (Highlighted by Sentence) */}
      <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
        {sentences.map((sentence, idx) => {
          const isActive = idx === currentIndex && isPlaying;
          const isCurrentPaused = idx === currentIndex && !isPlaying;

          return (
            <motion.div
              key={idx}
              onClick={() => handleSentenceClick(idx)}
              whileHover={{ scale: 1.005 }}
              className={`p-2.5 rounded-xl cursor-pointer transition text-right leading-relaxed font-bold select-none text-sm md:text-base border ${
                isActive
                  ? 'bg-amber-100/95 border-amber-300 text-amber-950 shadow-xs ring-2 ring-amber-400/40'
                  : isCurrentPaused
                  ? 'bg-purple-100/60 border-purple-300/80 text-purple-950'
                  : 'bg-white/70 border-purple-100 text-stone-800 hover:bg-white hover:border-purple-200'
              }`}
            >
              <div className="flex items-start gap-2">
                <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono shrink-0 mt-0.5 ${
                  isActive ? 'bg-amber-500 text-white font-bold' : 'bg-purple-100 text-purple-700'
                }`}>
                  {idx + 1}
                </span>
                <span className="flex-1">{sentence}</span>
                {isActive && (
                  <span className="text-sm shrink-0 animate-bounce">
                    🔊
                  </span>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};
