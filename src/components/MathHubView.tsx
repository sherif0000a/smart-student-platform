import React from 'react';
import { mathChapters } from '../curriculum';
import { MathChapter } from '../types';
import { Calculator, Trophy, Star, ChevronLeft, Sparkles, Brain, CheckCircle2 } from 'lucide-react';
import { sounds } from '../utils/audio';

interface MathHubViewProps {
  onSelectChapter: (chapter: MathChapter) => void;
  onOpenRewardGame: () => void;
  completedLessonsCount: number;
  studentName: string;
  isGirl: boolean;
}

export const MathHubView: React.FC<MathHubViewProps> = ({
  onSelectChapter,
  onOpenRewardGame,
  studentName,
  isGirl
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border-2 border-amber-300">
        <div className="space-y-1 text-center md:text-right">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="p-2 bg-white/20 rounded-2xl text-2xl">📐</span>
            <span className="bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full">
              كِتَابُ الرِّيَاضِيَّاتِ - الصَّفُّ الثَّالِثُ الابْتِدَائِيُّ
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black">
            عَالَمُ الرِّيَاضِيَّاتِ وَتَحَدِّيَاتُ الأَذْكِيَاءِ
          </h1>
          <p className="text-amber-100 text-sm max-w-xl">
            10 فُصُولٍ شَامِلَةٍ مِنْ كِتَابِ الْوَزَارَةِ مَعَ خُطُوَاتِ الْحَلِّ الذَّهَنِيِّ وَأَسْئِلَةِ الْعَبَاقِرَةِ وَلُعْبَةِ جَوَائِزِ النُّجُومِ! 🌟
          </p>
        </div>

        <button
          onClick={onOpenRewardGame}
          className="bg-white hover:bg-amber-100 text-amber-950 font-black text-sm px-6 py-3.5 rounded-2xl shadow-xl flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          <Trophy className="w-5 h-5 text-amber-600" />
          <span>لُعْبَةُ جَوَائِزِ الأَبْطَالِ 🎯</span>
        </button>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mathChapters.map((chapter) => (
          <div
            key={chapter.id}
            onClick={() => {
              sounds.playClick();
              onSelectChapter(chapter);
            }}
            className="group bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-amber-400 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${chapter.color} text-white flex items-center justify-center text-xl font-black shadow-md group-hover:scale-110 transition-transform`}>
                    {chapter.chapterNumber}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                      الْفَصْلُ {chapter.chapterNumber}
                    </span>
                    <h2 className="text-lg font-black text-slate-900 group-hover:text-amber-700 transition-colors mt-0.5">
                      {chapter.title}
                    </h2>
                  </div>
                </div>

                <span className="p-2 bg-slate-50 group-hover:bg-amber-500 group-hover:text-white rounded-2xl text-slate-400 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </span>
              </div>

              <p className="text-xs text-slate-600 leading-relaxed font-medium">
                {chapter.themeDescription}
              </p>

              {/* Badges / Highlights */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                <span className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-xl">
                  {chapter.lessons.length} دُرُوسٍ مَحْلُولَةٍ
                </span>
                <span className="text-[11px] font-black bg-amber-100 text-amber-900 px-2.5 py-1 rounded-xl flex items-center gap-1">
                  <Brain className="w-3.5 h-3.5 text-amber-600" />
                  <span>أَسْئِلَةُ الأَذْكِيَاءِ (Genius)</span>
                </span>
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
              <span>الصَّفُّ الثَّالِثُ الابْتِدَائِيُّ</span>
              <span className="text-amber-600 font-black group-hover:translate-x-[-4px] transition-transform flex items-center gap-1">
                <span>افْتَحِ التَّدْرِيبَاتِ</span>
                <span>←</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
