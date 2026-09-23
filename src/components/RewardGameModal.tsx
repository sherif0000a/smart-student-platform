import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles, X, RefreshCw, Volume2, Award, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds } from '../utils/audio';

interface RewardGameModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  isGirl: boolean;
  currentStars: number;
  onAddStars: (stars: number) => void;
}

interface BalloonTarget {
  id: number;
  x: number; // percentage 10-85
  y: number; // percentage 10-80
  color: string;
  points: number;
  label: string;
  icon: string;
  speed: number;
}

const BALLOON_COLORS = [
  'bg-gradient-to-br from-pink-500 to-rose-600 border-pink-300',
  'bg-gradient-to-br from-amber-400 to-orange-500 border-yellow-200',
  'bg-gradient-to-br from-cyan-400 to-blue-600 border-cyan-200',
  'bg-gradient-to-br from-emerald-400 to-green-600 border-emerald-200',
  'bg-gradient-to-br from-purple-500 to-indigo-600 border-purple-200'
];

const TARGET_ICONS = ['⭐', '🌟', '💎', '🚀', '🍎', '🏆', '🎯', '⚡'];

export const RewardGameModal: React.FC<RewardGameModalProps> = ({
  isOpen,
  onClose,
  studentName,
  isGirl,
  currentStars,
  onAddStars
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameScore, setGameScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(25);
  const [combo, setCombo] = useState(0);
  const [balloons, setBalloons] = useState<BalloonTarget[]>([]);
  const [gameOver, setGameOver] = useState(false);
  const [starsEarned, setStarsEarned] = useState(0);
  const timerRef = useRef<any>(null);
  const spawnRef = useRef<any>(null);

  useEffect(() => {
    if (!isOpen) {
      clearInterval(timerRef.current);
      clearInterval(spawnRef.current);
      setIsPlaying(false);
      setGameOver(false);
    }
  }, [isOpen]);

  const startGame = () => {
    setGameScore(0);
    setTimeLeft(25);
    setCombo(0);
    setGameOver(false);
    setStarsEarned(0);
    setIsPlaying(true);
    sounds.playButtonTap();

    // Spawn initial balloons
    const initial: BalloonTarget[] = Array.from({ length: 5 }, (_, i) => createBalloon(i));
    setBalloons(initial);

    // Timer countdown
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Continuous spawn
    spawnRef.current = setInterval(() => {
      setBalloons(prev => {
        if (prev.length >= 7) return prev;
        return [...prev, createBalloon(Date.now() + Math.random())];
      });
    }, 1200);
  };

  const createBalloon = (id: number): BalloonTarget => {
    return {
      id,
      x: 10 + Math.random() * 75,
      y: 15 + Math.random() * 65,
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      points: Math.floor(Math.random() * 3) + 1, // 1, 2, or 3 points
      label: `+${Math.floor(Math.random() * 3) + 1}`,
      icon: TARGET_ICONS[Math.floor(Math.random() * TARGET_ICONS.length)],
      speed: 1 + Math.random() * 2
    };
  };

  const popBalloon = (id: number, points: number) => {
    sounds.playBalloonPop();
    const newCombo = combo + 1;
    setCombo(newCombo);
    const addedPoints = points * (newCombo > 3 ? 2 : 1);
    setGameScore(prev => prev + addedPoints);

    if (newCombo % 4 === 0) {
      sounds.playBonusScore();
    }

    setBalloons(prev => prev.filter(b => b.id !== id));
  };

  const endGame = () => {
    clearInterval(timerRef.current);
    clearInterval(spawnRef.current);
    setIsPlaying(false);
    setGameOver(true);
    sounds.playLevelUp();

    // Convert game score to real stars (1 star per 4 points, min 3 stars)
    const earned = Math.max(3, Math.round(gameScore / 3));
    setStarsEarned(earned);
    onAddStars(earned);

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 25 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.88, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 bg-white/20 rounded-2xl text-2xl">🎯</span>
            <div>
              <h2 className="text-xl font-bold">لُعْبَةُ صَائِدِ النُّجُومِ وَالْبَالُونَاتِ</h2>
              <p className="text-xs text-amber-100">
                مُكَافَأَةُ تَقْفِيلِ النِّقَاطِ لِلْبَطَلِ {studentName} 🌟
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content area */}
        <div className="p-5 flex-1 flex flex-col">
          {!isPlaying && !gameOver && (
            <div className="text-center py-8 space-y-4">
              <div className="text-6xl animate-bounce">🎈⭐🎯</div>
              <h3 className="text-2xl font-black text-slate-800">
                {isGirl ? `مَرْحَبَى بِكِ يَا بَطَلَتَنَا ${studentName}!` : `مَرْحَبَى بِكَ يَا بَطَلَنَا ${studentName}!`}
              </h3>
              <p className="text-slate-600 max-w-md mx-auto text-sm">
                هَذِهِ لُعْبَةٌ تَشْجِيعِيَّةٌ خَاصَّةٌ لَكَ عِنْدَ إِتْمَامِ نِقَاطِكَ! فَرْقِعِ الْبَالُونَاتِ وَاصْطَدِ النُّجُومَ بِأَسْرَعِ مَا يُمْكِنُ قَبْلَ انْتِهَاءِ الْوَقْتِ لِتَرْبَحَ نُجُوماً حَقِيقِيَّةً تُضَافُ لِحِسَابِكَ!
              </p>

              <div className="flex justify-center gap-4 py-2">
                <div className="bg-amber-50 border border-amber-200 px-4 py-2 rounded-2xl flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                  <span className="font-bold text-amber-900">نُجُومُكَ الْحَالِيَّةُ: {currentStars}</span>
                </div>
                <div className="bg-blue-50 border border-blue-200 px-4 py-2 rounded-2xl flex items-center gap-2">
                  <Zap className="w-5 h-5 text-blue-500" />
                  <span className="font-bold text-blue-900">الْوَقْتُ: 25 ثَانِيَةً</span>
                </div>
              </div>

              <button
                onClick={startGame}
                className="px-8 py-3.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-lg rounded-2xl shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center gap-2 mx-auto"
              >
                <span>انْطَلِقْ لِلَّعِبِ الآنَ!</span>
                <Sparkles className="w-5 h-5" />
              </button>
            </div>
          )}

          {isPlaying && (
            <div className="flex-1 flex flex-col">
              {/* Score bar */}
              <div className="flex items-center justify-between bg-slate-100 p-3 rounded-2xl mb-3">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <span className="font-bold text-slate-800">النِّقَاطُ:</span>
                  <span className="text-2xl font-black text-amber-600">{gameScore}</span>
                </div>
                {combo > 1 && (
                  <div className="bg-orange-500 text-white px-3 py-0.5 rounded-full text-xs font-bold animate-pulse">
                    كُومْبُو رَائِعٌ! x{combo} 🔥
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-700">الْوَقْتُ:</span>
                  <span className={`text-xl font-black ${timeLeft <= 5 ? 'text-red-600 animate-ping' : 'text-slate-900'}`}>
                    {timeLeft}ث
                  </span>
                </div>
              </div>

              {/* Game arena */}
              <div className="relative w-full h-80 bg-gradient-to-b from-sky-100 via-blue-50 to-amber-50 rounded-3xl border-2 border-dashed border-sky-300 overflow-hidden select-none cursor-crosshair">
                {balloons.map(b => (
                  <button
                    key={b.id}
                    onClick={() => popBalloon(b.id, b.points)}
                    style={{ left: `${b.x}%`, top: `${b.y}%` }}
                    className={`absolute -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full border-2 shadow-lg flex flex-col items-center justify-center text-white transform active:scale-75 hover:scale-110 transition-transform ${b.color}`}
                  >
                    <span className="text-xl">{b.icon}</span>
                    <span className="text-[10px] font-black">{b.label}</span>
                  </button>
                ))}
              </div>
              <p className="text-xs text-center text-slate-500 mt-2 font-medium">
                اضْغَطْ عَلَى الْبَالُونَاتِ وَالنُّجُومِ لِفَرْقَعَتِهَا وَجَمْعِ النِّقَاطِ! 🎈
              </p>
            </div>
          )}

          {gameOver && (
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="text-6xl animate-bounce">🏆🌟🎉</div>
              <h3 className="text-2xl font-black text-slate-900">
                {isGirl ? `أَحْسَنْتِ صُنْعاً يَا عَبْقَرِيَّةَ الْفَصْلِ!` : `أَحْسَنْتَ صُنْعاً يَا عَبْقَرِيَّ الْفَصْلِ!`}
              </h3>
              <p className="text-slate-600 text-sm">
                حَقَّقْتَ نَتِيجَةً رَائِعَةً فِي سِبَاقِ صَيْدِ النُّجُومِ!
              </p>

              <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-2xl max-w-sm mx-auto space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-600">نِقَاطُ اللُّعْبَةِ:</span>
                  <span className="font-bold text-slate-900 text-lg">{gameScore}</span>
                </div>
                <div className="flex justify-between items-center text-base border-t border-amber-200 pt-2">
                  <span className="font-bold text-amber-900">النُّجُومُ الْمُكْتَسَبَةُ لِحِسَابِكَ:</span>
                  <span className="font-black text-amber-600 text-2xl flex items-center gap-1">
                    +{starsEarned} <Star className="w-6 h-6 fill-amber-500 text-amber-500" />
                  </span>
                </div>
              </div>

              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={startGame}
                  className="px-6 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl transition-colors flex items-center gap-2"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>الَّعِبْ مَرَّةً أُخْرَى</span>
                </button>
                <button
                  onClick={onClose}
                  className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl shadow transition-colors flex items-center gap-2"
                >
                  <Award className="w-4 h-4" />
                  <span>اسْتِلَامُ النُّجُومِ وَالْعَوْدَةُ</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
