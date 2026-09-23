import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Unit, Lesson, UserProfile } from '../types';
import { allUnits } from '../data';
import { sounds } from '../utils/audio';
import { 
  Sparkles, 
  CheckCircle, 
  Play, 
  Star, 
  Award, 
  BookOpen, 
  Headphones, 
  HelpCircle, 
  Volume2, 
  Music, 
  HeartHandshake
} from 'lucide-react';

interface AdventureMapProps {
  profile: UserProfile;
  selectedUnitId: number;
  onSelectUnit: (unitId: number) => void;
  onSelectLesson: (lesson: Lesson) => void;
}

export const AdventureMap: React.FC<AdventureMapProps> = ({
  profile,
  selectedUnitId,
  onSelectUnit,
  onSelectLesson,
}) => {
  const currentUnit = allUnits.find((u) => u.id === selectedUnitId) || allUnits[0];
  const isGirl = profile.heroType === 'girl';

  // Calculate unit completion
  const getUnitCompletion = (unit: Unit) => {
    const total = unit.lessons.length;
    const completed = unit.lessons.filter((l) => profile.completedLessons.includes(l.id)).length;
    return {
      completed,
      total,
      percentage: Math.round((completed / total) * 100)
    };
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'listening':
        return <Headphones className="w-5 h-5 text-amber-600" />;
      case 'reading':
        return <BookOpen className="w-5 h-5 text-emerald-600" />;
      case 'grammar':
        return <HelpCircle className="w-5 h-5 text-indigo-600" />;
      case 'spelling':
        return <Volume2 className="w-5 h-5 text-purple-600" />;
      case 'poetry':
        return <Music className="w-5 h-5 text-rose-600" />;
      case 'family_reading':
        return <HeartHandshake className="w-5 h-5 text-teal-600" />;
      case 'unit_assessment':
        return <Award className="w-5 h-5 text-amber-500" />;
      default:
        return <BookOpen className="w-5 h-5 text-amber-600" />;
    }
  };

  return (
    <div id="adventure-map-container" className="space-y-6 pb-16">
      
      {/* Welcome & Motivational Banner */}
      <div 
        id="motivational-hero-banner"
        className="relative overflow-hidden bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 rounded-3xl p-6 md:p-8 text-white shadow-xl"
      >
        <div className="absolute top-0 left-0 -translate-x-6 -translate-y-6 w-40 h-40 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-right space-y-2">
            <div className="inline-flex items-center gap-2 bg-white/20 px-3.5 py-1 rounded-full text-xs font-bold text-amber-100">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>مَرْحَباً بِكَ فِي بَوَّابَةِ الْمُغَامَرَةِ</span>
            </div>
            <h1 className="text-2xl md:text-4xl font-black tracking-tight">
              {isGirl ? `أَهْلاً بِكِ يَا بَطَلَتَنَا ${profile.name}!` : `أَهْلاً بِكَ يَا بَطَلَنَا ${profile.name}!`}
            </h1>
            <p className="text-amber-100 text-sm md:text-base font-semibold max-w-xl">
              اخْتَرْ إِحْدَى الْوَحْدَاتِ الثَّلَاثِ وَانْطَلِقْ فِي رِحْلَةِ التَّعَلُّمِ، حَلِّ الأَنْشِطَةِ، وَجَمْعِ نُجُومِ الأَبْطَالِ ⭐
            </p>
          </div>

          <div className="flex items-center gap-4 bg-white/15 backdrop-blur-md px-5 py-4 rounded-2xl border border-white/25">
            <div className="text-center">
              <p className="text-xs text-amber-100 font-bold">النُّجُومُ الْمُحَقَّقَةُ</p>
              <p className="text-2xl md:text-3xl font-black text-yellow-300 flex items-center justify-center gap-1">
                <span>{profile.totalStars}</span>
                <span>⭐</span>
              </p>
            </div>
            <div className="h-10 w-px bg-white/20"></div>
            <div className="text-center">
              <p className="text-xs text-amber-100 font-bold">الدُّرُوسُ الْمُنْجَزَةُ</p>
              <p className="text-2xl md:text-3xl font-black text-white">
                {profile.completedLessons.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 3 Units Selection Tabs */}
      <div className="space-y-3">
        <h2 className="text-lg md:text-xl font-black text-stone-800 flex items-center gap-2">
          <span>🗺️</span>
          <span>خَرِيطَةُ وَحْدَاتِ الْكِتَابِ الْمَدْرَسِيِّ</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {allUnits.map((unit) => {
            const stats = getUnitCompletion(unit);
            const isSelected = unit.id === selectedUnitId;

            return (
              <button
                key={unit.id}
                id={`unit-card-${unit.id}`}
                onClick={() => {
                  sounds.playClick();
                  onSelectUnit(unit.id);
                }}
                className={`text-right p-5 rounded-3xl border-3 transition-all transform duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'border-amber-500 bg-white shadow-xl scale-[1.02] ring-4 ring-amber-200/50 animate-gentle-glow'
                    : 'border-stone-200 bg-white/80 hover:bg-white hover:border-amber-300 shadow-sm hover:shadow'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-black px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                      الْوَحْدَةُ {unit.numberArabic}
                    </span>
                    <span className="text-2xl">
                      {unit.id === 1 ? '🌱' : unit.id === 2 ? '❤️' : '🏛️'}
                    </span>
                  </div>

                  <h3 className="text-xl font-black text-stone-900 mb-1">
                    {unit.title}
                  </h3>
                  <p className="text-xs text-stone-500 font-semibold leading-relaxed mb-4">
                    {unit.themeDescription}
                  </p>
                </div>

                {/* Progress bar */}
                <div className="pt-2 border-t border-stone-100 space-y-1.5">
                  <div className="flex justify-between text-xs font-bold text-stone-600">
                    <span>تَقَدُّمُ الْوَحْدَةِ</span>
                    <span>{stats.percentage}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-stone-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full bg-gradient-to-r ${unit.bannerColor} rounded-full transition-all duration-500`}
                      style={{ width: `${stats.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Unit Lessons List */}
      <div 
        id="unit-lessons-roadmap"
        className="bg-white rounded-3xl border-2 border-amber-200 p-6 md:p-8 shadow-sm space-y-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-2">
          <div>
            <span className="text-xs font-bold text-amber-700">
              دُرُوسُ الْوَحْدَةِ {currentUnit.numberArabic}
            </span>
            <h3 className="text-2xl font-black text-stone-900">
              {currentUnit.title}
            </h3>
          </div>

          <div className="text-xs font-bold text-stone-500 bg-stone-50 px-3 py-1.5 rounded-xl border border-stone-200">
            إِجْمَالِيُّ الدُّرُوسِ: {currentUnit.lessons.length} مَحَطَّاتٍ
          </div>
        </div>

        {/* Roadmap Nodes */}
        <AnimatePresence mode="wait">
          <motion.div 
            key={currentUnit.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {currentUnit.lessons.map((lesson, index) => {
              const isCompleted = profile.completedLessons.includes(lesson.id);

              return (
                <motion.div
                  key={lesson.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.03 }}
                  whileHover={{ y: -3, transition: { duration: 0.12 } }}
                  id={`lesson-item-${lesson.id}`}
                  className={`relative p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                    isCompleted
                      ? 'border-emerald-300 bg-emerald-50/40 hover:bg-emerald-50 shadow-xs'
                      : 'border-stone-200 bg-stone-50/50 hover:bg-amber-50/50 hover:border-amber-300 shadow-xs'
                  }`}
                >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="inline-flex items-center gap-1.5 text-xs font-black px-2.5 py-1 rounded-lg bg-white border border-stone-200 shadow-2xs">
                      {getCategoryIcon(lesson.category)}
                      <span className="text-stone-700">{lesson.categoryLabel}</span>
                    </span>

                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-xs font-black text-emerald-700 bg-emerald-100 px-2.5 py-1 rounded-full">
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>مُكْتَمَلٌ</span>
                      </span>
                    ) : (
                      <span className="text-xs font-bold text-amber-700 bg-amber-100/70 px-2.5 py-1 rounded-full">
                        {lesson.challenges.length} أَنْشِطَة ⭐
                      </span>
                    )}
                  </div>

                  <h4 className="text-lg font-black text-stone-900 mb-1">
                    {lesson.title}
                  </h4>
                  <p className="text-xs text-stone-600 line-clamp-2 font-medium leading-relaxed mb-4">
                    {lesson.summaryNarrative}
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/60 flex items-center justify-between">
                  <span className="text-[11px] font-bold text-stone-400">
                    الْمَحَطَّةُ {index + 1}
                  </span>

                  <button
                    id={`start-lesson-btn-${lesson.id}`}
                    onClick={() => {
                      sounds.playClick();
                      onSelectLesson(lesson);
                    }}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs md:text-sm font-black transition transform active:scale-95 shadow-sm ${
                      isCompleted
                        ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                        : 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white animate-calm-pulse'
                    }`}
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isCompleted ? 'إِعَادَةُ التَّدْرِيبِ' : 'ابْدَأِ الْمُغَامَرَةَ'}</span>
                  </button>
                </div>
                </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>
      </div>

    </div>
  );
};
