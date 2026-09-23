import React from 'react';
import { SubjectType } from '../types';
import { Calculator, BookOpen, Sparkles, BookMarked, Trophy, Users } from 'lucide-react';
import { sounds } from '../utils/audio';

interface SubjectSelectorProps {
  activeSubject: SubjectType;
  onSelectSubject: (subject: SubjectType) => void;
  onOpenDictionary: () => void;
  onOpenRewardGame: () => void;
  onOpenOnlineStudents: () => void;
  onlineCount: number;
}

export const SubjectSelector: React.FC<SubjectSelectorProps> = ({
  activeSubject,
  onSelectSubject,
  onOpenDictionary,
  onOpenRewardGame,
  onOpenOnlineStudents,
  onlineCount
}) => {
  return (
    <div className="bg-white/90 backdrop-blur-md border-b-2 border-indigo-100 sticky top-14 sm:top-16 z-30 shadow-xs py-2 px-2 sm:px-4">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2">
        {/* Main Subject Buttons: Playful 3D-Bouncy kid design */}
        <div className="grid grid-cols-3 sm:flex items-center gap-1.5 sm:gap-2.5 w-full md:w-auto">
          {/* Math Button */}
          <button
            onClick={() => {
              sounds.playTabSwitch();
              onSelectSubject('math');
            }}
            className={`py-2 px-2 sm:px-5 rounded-2xl font-black text-xs sm:text-sm transition-all transform flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 active:scale-95 ${
              activeSubject === 'math'
                ? 'bg-gradient-to-r from-orange-500 via-amber-500 to-amber-600 text-white shadow-lg ring-3 ring-orange-300 scale-102'
                : 'bg-white hover:bg-orange-50 text-slate-700 border-2 border-orange-200/80'
            }`}
          >
            <div className="flex items-center gap-1">
              <span className="text-base sm:text-lg animate-wiggle">📐</span>
              <span>الرِّيَاضِيَّاتُ</span>
            </div>
            <span className={`text-[9px] sm:text-[10px] hidden md:inline px-2 py-0.5 rounded-full font-bold ${
              activeSubject === 'math' ? 'bg-black/20 text-white' : 'bg-orange-100 text-orange-800'
            }`}>
              10 فُصُولٍ
            </span>
          </button>

          {/* English Button */}
          <button
            onClick={() => {
              sounds.playTabSwitch();
              onSelectSubject('english');
            }}
            className={`py-2 px-2 sm:px-5 rounded-2xl font-black text-xs sm:text-sm transition-all transform flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 active:scale-95 ${
              activeSubject === 'english'
                ? 'bg-gradient-to-r from-sky-500 via-blue-500 to-indigo-600 text-white shadow-lg ring-3 ring-sky-300 scale-102'
                : 'bg-white hover:bg-sky-50 text-slate-700 border-2 border-sky-200/80'
            }`}
          >
            <div className="flex items-center gap-1">
              <span className="text-base sm:text-lg animate-float">🔤</span>
              <span>Connect 3</span>
            </div>
            <span className={`text-[9px] sm:text-[10px] hidden md:inline px-2 py-0.5 rounded-full font-bold ${
              activeSubject === 'english' ? 'bg-black/20 text-white' : 'bg-sky-100 text-sky-800'
            }`}>
              English
            </span>
          </button>

          {/* Arabic Button */}
          <button
            onClick={() => {
              sounds.playTabSwitch();
              onSelectSubject('arabic');
            }}
            className={`py-2 px-2 sm:px-5 rounded-2xl font-black text-xs sm:text-sm transition-all transform flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 active:scale-95 ${
              activeSubject === 'arabic'
                ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-green-600 text-white shadow-lg ring-3 ring-emerald-300 scale-102'
                : 'bg-white hover:bg-emerald-50 text-slate-700 border-2 border-emerald-200/80'
            }`}
          >
            <div className="flex items-center gap-1">
              <span className="text-base sm:text-lg animate-sparkle">📖</span>
              <span>اللُّغَةُ الْعَرَبِيَّةُ</span>
            </div>
            <span className={`text-[9px] sm:text-[10px] hidden md:inline px-2 py-0.5 rounded-full font-bold ${
              activeSubject === 'arabic' ? 'bg-black/20 text-white' : 'bg-emerald-100 text-emerald-800'
            }`}>
              أَنَاشِيد وَقِصَص
            </span>
          </button>
        </div>

        {/* Action Tools */}
        <div className="hidden sm:flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Dictionary Shortcut */}
          <button
            onClick={onOpenDictionary}
            className="px-3.5 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-900 rounded-2xl font-black text-xs flex items-center gap-1.5 transition-all shadow-xs active:scale-95 border border-sky-300"
            title="قاموس 1000 كلمة إنجليزية مترجمة مع النطق الصوتي"
          >
            <BookMarked className="w-4 h-4 text-sky-600" />
            <span>قَامُوسُ 1000 كَلِمَةٍ 🔊</span>
          </button>

          {/* Points Reward Game */}
          <button
            onClick={onOpenRewardGame}
            className="px-3.5 py-1.5 bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 text-white rounded-2xl font-black text-xs flex items-center gap-1.5 shadow-md transition-transform hover:scale-105 active:scale-95"
            title="لعبة تقفيل النقاط وجوائز النجوم"
          >
            <Trophy className="w-4 h-4 text-yellow-200 animate-wiggle" />
            <span>لُعْبَةُ التَّقْفِيلِ 🎯</span>
          </button>

          {/* Live Online Students Ticker */}
          <button
            onClick={onOpenOnlineStudents}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border-2 border-emerald-300 text-emerald-800 rounded-2xl font-black text-xs flex items-center gap-1.5 transition-all shadow-xs"
            title="الطلاب المتواجدون أونلاين الآن"
          >
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>أَوْنْلَايْن: <strong className="text-emerald-950 font-black">{onlineCount}</strong></span>
          </button>
        </div>
      </div>
    </div>
  );
};
