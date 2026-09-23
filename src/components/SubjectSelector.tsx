import React from 'react';
import { SubjectType } from '../types';
import { Calculator, BookOpen, Sparkles, BookMarked, Trophy, Users } from 'lucide-react';
import { subjectCatalog } from '../curriculum';
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
    <div className="bg-white/95 backdrop-blur-md border-b border-slate-200 sticky top-14 sm:top-16 z-30 shadow-xs py-1.5 sm:py-2 px-2 sm:px-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-1.5 sm:gap-2.5">
        {/* Main Subject Buttons: Grid on mobile, flex on desktop for zero waste */}
        <div className="grid grid-cols-3 sm:flex items-center gap-1.5 sm:gap-2 w-full md:w-auto">
          {/* Math Button */}
          <button
            onClick={() => {
              sounds.playTabSwitch();
              onSelectSubject('math');
            }}
            className={`py-2 px-1.5 sm:px-4 rounded-xl font-black text-xs sm:text-sm transition-all flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 shadow-2xs ${
              activeSubject === 'math'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-md ring-2 ring-amber-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-1">
              <Calculator className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>الرِّيَاضِيَّاتُ</span>
            </div>
            <span className="text-[9px] sm:text-[10px] hidden md:inline px-1.5 py-0.2 rounded-full bg-black/15 font-normal">
              10 فُصُولٍ
            </span>
          </button>

          {/* English Button */}
          <button
            onClick={() => {
              sounds.playTabSwitch();
              onSelectSubject('english');
            }}
            className={`py-2 px-1.5 sm:px-4 rounded-xl font-black text-xs sm:text-sm transition-all flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 shadow-2xs ${
              activeSubject === 'english'
                ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md ring-2 ring-sky-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Connect 3</span>
            </div>
            <span className="text-[9px] sm:text-[10px] hidden md:inline px-1.5 py-0.2 rounded-full bg-black/15 font-normal">
              English
            </span>
          </button>

          {/* Arabic Button */}
          <button
            onClick={() => {
              sounds.playTabSwitch();
              onSelectSubject('arabic');
            }}
            className={`py-2 px-1.5 sm:px-4 rounded-xl font-black text-xs sm:text-sm transition-all flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 shadow-2xs ${
              activeSubject === 'arabic'
                ? 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-md ring-2 ring-emerald-300'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            <div className="flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>اللُّغَةُ الْعَرَبِيَّةُ</span>
            </div>
            <span className="text-[9px] sm:text-[10px] hidden md:inline px-1.5 py-0.2 rounded-full bg-black/15 font-normal">
              إِمْلَاء وَدُرُوس
            </span>
          </button>
        </div>

        {/* Action Tools (hidden on smallest screens to maximize content viewport) */}
        <div className="hidden sm:flex items-center gap-2 w-full md:w-auto justify-end">
          {/* Dictionary Shortcut */}
          <button
            onClick={onOpenDictionary}
            className="px-3 py-1.5 bg-sky-100 hover:bg-sky-200 text-sky-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs active:scale-95"
            title="قاموس 1000 كلمة إنجليزية مترجمة مع النطق الصوتي"
          >
            <BookMarked className="w-4 h-4 text-sky-600" />
            <span>قَامُوسُ 1000 كَلِمَةٍ 🔊</span>
          </button>

          {/* Points Reward Game */}
          <button
            onClick={onOpenRewardGame}
            className="px-3 py-1.5 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-slate-900 rounded-xl font-black text-xs flex items-center gap-1.5 shadow transition-transform hover:scale-105 active:scale-95"
            title="لعبة تقفيل النقاط وجوائز النجوم"
          >
            <Trophy className="w-4 h-4 text-amber-950" />
            <span>لُعْبَةُ التَّقْفِيلِ 🎯</span>
          </button>

          {/* Live Online Students Ticker */}
          <button
            onClick={onOpenOnlineStudents}
            className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all"
            title="الطلاب المتواجدون أونلاين الآن"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <Users className="w-3.5 h-3.5 text-emerald-600" />
            <span>أَوْنْلَايْن: <strong>{onlineCount}</strong></span>
          </button>
        </div>
      </div>
    </div>
  );
};
