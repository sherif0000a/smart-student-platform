import React from 'react';
import { englishUnits, englishDictionary1000 } from '../curriculum';
import { EnglishUnit } from '../types';
import { BookOpen, Trophy, ChevronLeft, Volume2, Sparkles, BookMarked, Headphones } from 'lucide-react';
import { sounds } from '../utils/audio';

interface EnglishHubViewProps {
  onSelectUnit: (unit: EnglishUnit) => void;
  onOpenDictionary: () => void;
  onOpenRewardGame: () => void;
  studentName: string;
  isGirl: boolean;
}

export const EnglishHubView: React.FC<EnglishHubViewProps> = ({
  onSelectUnit,
  onOpenDictionary,
  onOpenRewardGame,
  studentName,
  isGirl
}) => {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Banner */}
      <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 rounded-3xl p-6 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-4 border-2 border-sky-300">
        <div className="space-y-1 text-center md:text-right">
          <div className="flex items-center gap-2 justify-center md:justify-start">
            <span className="p-2 bg-white/20 rounded-2xl text-2xl">🔤</span>
            <span className="bg-white/20 text-white text-xs font-black px-3 py-1 rounded-full">
              Connect 3 & El-Moasser (Primary 3)
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-black">
            English Connect 3 Adventures
          </h1>
          <p className="text-sky-100 text-sm max-w-xl">
            6 وحدات دراسية متكاملة + قاموس 1000 كلمة إنجليزية بنطق صوتي واضح وكتابة طريقة النطق بالعربية للأطفال!
          </p>
        </div>

        <div className="flex flex-wrap gap-2 self-stretch md:self-auto justify-center">
          <button
            onClick={onOpenDictionary}
            className="bg-white hover:bg-sky-50 text-sky-950 font-black text-sm px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <BookMarked className="w-5 h-5 text-sky-600" />
            <span>قَامُوسُ 1000 كَلِمَةٍ 📖</span>
          </button>
          <button
            onClick={onOpenRewardGame}
            className="bg-amber-400 hover:bg-amber-300 text-slate-900 font-black text-sm px-5 py-3 rounded-2xl shadow-xl flex items-center gap-2 transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <Trophy className="w-5 h-5 text-amber-900" />
            <span>لُعْبَةُ الْجَوَائِزِ 🎯</span>
          </button>
        </div>
      </div>

      {/* Dictionary Callout Card */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-5 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-14 h-14 rounded-2xl bg-amber-500 text-white flex items-center justify-center text-3xl shadow-md shrink-0">
            🔊
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900">
                قَامُوسُ الطَّالِبِ الْمُجْتَهِدِ الإِنْجِلِيزِيُّ (1000 كَلِمَةٍ)
              </h2>
              <span className="text-[10px] font-black bg-amber-400 text-slate-900 px-2 py-0.5 rounded-full">
                {englishDictionary1000.length} كَلِمَةٍ
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              مُقَسَّمٌ حَسَبَ الْفِئَاتِ (حَيَوَانَاتٌ، مَدْرَسَةٌ، أَفْعَالٌ، طَعَامٌ، أَمَاكِنُ) مَعَ تَسْجِيلٍ صَوْتِيٍّ وَطَرِيقَةِ نُطْقٍ عَرَبِيَّةٍ سَهْلَةٍ!
            </p>
          </div>
        </div>

        <button
          onClick={onOpenDictionary}
          className="px-5 py-2.5 bg-gradient-to-r from-sky-600 to-blue-700 hover:from-sky-700 hover:to-blue-800 text-white rounded-2xl text-xs font-black shadow transition-transform hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          افْتَحِ الْقَامُوسَ الصَّوْتِيَّ الآنَ 📖
        </button>
      </div>

      {/* Units Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {englishUnits.map((unit) => (
          <div
            key={unit.id}
            onClick={() => {
              sounds.playClick();
              onSelectUnit(unit);
            }}
            className="group bg-white rounded-3xl p-5 border-2 border-slate-200 hover:border-sky-400 hover:shadow-xl transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${unit.color} text-white flex items-center justify-center text-xl font-black shadow-md group-hover:scale-110 transition-transform`}>
                    {unit.unitNumber}
                  </div>
                  <div>
                    <span className="text-[11px] font-bold text-sky-600 bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                      UNIT {unit.unitNumber}
                    </span>
                    <h2 className="text-lg font-black text-slate-900 group-hover:text-sky-700 transition-colors mt-0.5">
                      {unit.title}
                    </h2>
                  </div>
                </div>

                <span className="p-2 bg-slate-50 group-hover:bg-sky-600 group-hover:text-white rounded-2xl text-slate-400 transition-colors">
                  <ChevronLeft className="w-5 h-5" />
                </span>
              </div>

              <p className="text-sm font-bold text-slate-700">
                {unit.titleAr}
              </p>

              {/* Outcomes chips */}
              <div className="space-y-1 pt-1">
                {unit.outcomes.slice(0, 3).map((out, i) => (
                  <div key={i} className="text-xs text-slate-500 flex items-center gap-1.5">
                    <span className="text-sky-500">✓</span>
                    <span>{out}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 mt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1 text-sky-700">
                <Headphones className="w-3.5 h-3.5" />
                <span>مُزَوَّدٌ بِنُطْقٍ صَوْتِيٍّ</span>
              </span>
              <span className="text-sky-600 font-black group-hover:translate-x-[-4px] transition-transform flex items-center gap-1">
                <span>ادْرُسِ الْوَحْدَةَ</span>
                <span>←</span>
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
