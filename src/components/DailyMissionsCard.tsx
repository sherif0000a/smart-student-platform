import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeacherDailyMissions, UserProfile, Lesson } from '../types';
import { findLessonById, allUnits } from '../data';
import { sounds, playPraiseVoice } from '../utils/audio';
import confetti from 'canvas-confetti';
import { 
  Sparkles, 
  BookOpen, 
  PenTool, 
  CheckCircle2, 
  Star, 
  ChevronDown, 
  ChevronUp, 
  Edit3, 
  Award,
  AlertCircle,
  HelpCircle,
  Volume2
} from 'lucide-react';

interface DailyMissionsCardProps {
  missions: TeacherDailyMissions;
  profile: UserProfile;
  completedTasks: string[]; // ['lesson1', 'lesson2', 'spelling']
  onCompleteTask: (taskId: string, stars: number) => void;
  onSelectLesson: (lesson: Lesson) => void;
  onOpenTeacherModal: () => void;
  onOpenDetailsModal?: () => void;
}

export const DailyMissionsCard: React.FC<DailyMissionsCardProps> = ({
  missions,
  profile,
  completedTasks,
  onCompleteTask,
  onSelectLesson,
  onOpenTeacherModal,
  onOpenDetailsModal
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedSpellingOption, setSelectedSpellingOption] = useState<string | null>(null);
  const [spellingFeedback, setSpellingFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);

  const lesson1Info = findLessonById(missions.lessonId1) || (allUnits[0]?.lessons[0] ? { lesson: allUnits[0].lessons[0], unit: allUnits[0] } : null);
  const lesson2Info = findLessonById(missions.lessonId2) || (allUnits[1]?.lessons[0] ? { lesson: allUnits[1].lessons[0], unit: allUnits[1] } : null);

  const isLesson1Done = completedTasks.includes('lesson1') || (lesson1Info && profile.completedLessons.includes(lesson1Info.lesson.id));
  const isLesson2Done = completedTasks.includes('lesson2') || (lesson2Info && profile.completedLessons.includes(lesson2Info.lesson.id));
  const isSpellingDone = completedTasks.includes('spelling');

  const completedCount = (isLesson1Done ? 1 : 0) + (isLesson2Done ? 1 : 0) + (isSpellingDone ? 1 : 0);
  const isAllDone = completedCount === 3;
  const isRewardClaimed = completedTasks.includes('all_claimed');

  const handleCheckSpelling = (option: string) => {
    if (isSpellingDone) return;
    sounds.playButtonTap();
    setSelectedSpellingOption(option);

    const isCorrect = option === missions.spellingChallenge.correctAnswer;
    if (isCorrect) {
      sounds.playCheerSuccess();
      setSpellingFeedback({
        isCorrect: true,
        text: `أَحْسَنْتَ يَا بَطَلُ! إِجَابَةٌ صَحِيحَةٌ: ${missions.spellingChallenge.explanation}`
      });
      onCompleteTask('spelling', 10);
      try {
        confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
      } catch {}
    } else {
      sounds.playEncourage();
      setSpellingFeedback({
        isCorrect: false,
        text: `حَاوِلْ مَرَّةً أُخْرَى: تَمَعَّنْ فِي ${missions.spellingChallenge.ruleSummary}`
      });
    }
  };

  const handleClaimAllReward = () => {
    if (!isAllDone || isRewardClaimed) return;
    sounds.playFanfare();
    const isGirl = profile.heroType === 'girl';
    playPraiseVoice(
      profile.name,
      isGirl,
      isGirl
        ? `أَحْسَنْتِ يَا بَطَلَتَنَا ${profile.name}! أَتْمَمْتِ مَهَامَ الْيَوْمِ الْمُقَرَّرَةَ مِنَ الْمُعَلِّمِ بِنَجَاحٍ بَاهِرٍ!`
        : `أَحْسَنْتَ يَا بَطَلَنَا ${profile.name}! أَتْمَمْتَ مَهَامَ الْيَوْمِ الْمُقَرَّرَةَ مِنَ الْمُعَلِّمِ بِنَجَاحٍ بَاهِرٍ!`
    );
    onCompleteTask('all_claimed', missions.rewardStars);
    try {
      confetti({ particleCount: 120, spread: 100, origin: { y: 0.5 } });
    } catch {}
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-white rounded-3xl border-3 border-amber-300 shadow-md overflow-hidden mb-6"
    >
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-4 md:px-6 text-white flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-inner">
            📋
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base md:text-lg font-black tracking-wide">
                مَهَامُ الْيَوْمِ الْمُقَرَّرَةُ مِنَ الْمُعَلِّمِ
              </h3>
              <span className="text-[11px] bg-white/20 text-white px-2 py-0.5 rounded-full font-bold">
                {completedCount}/3 مُكْتَمَلَة
              </span>
            </div>
            <p className="text-amber-100 text-xs font-semibold">
              إِشْرَافٌ: <span className="font-bold text-white">{missions.teacherName}</span> 🌟
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Details Button */}
          {onOpenDetailsModal && (
            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenDetailsModal();
              }}
              className="flex items-center gap-1.5 text-xs font-black bg-white text-amber-900 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition shadow-xs active:scale-95"
              title="عرض تفاصيل التحدي اليومي والمطلوب"
            >
              <span>🔍</span>
              <span>عَرْضُ التَّفَاصِيلِ</span>
            </button>
          )}

          {/* Teacher Config Button */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onOpenTeacherModal();
            }}
            className="flex items-center gap-1.5 text-xs font-bold bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-xl transition shadow-2xs"
            title="تخصيص الدروس والأسئلة (خاص بالمعلم)"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>وَضْعُ الْمُعَلِّمِ 👨‍🏫</span>
          </button>

          {/* Toggle Expand */}
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              setIsExpanded(!isExpanded);
            }}
            className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition"
          >
            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="p-4 md:p-6 space-y-4 bg-amber-50/20"
          >
            {/* Teacher Note Box */}
            {missions.teacherNote && (
              <div className="bg-indigo-50/80 border border-indigo-200 rounded-2xl p-3 flex items-start gap-2.5 text-right">
                <span className="text-xl">💬</span>
                <div className="text-xs">
                  <span className="font-black text-indigo-950">رِسَالَةُ الْمُعَلِّمِ لَكَ: </span>
                  <span className="font-bold text-indigo-800">{missions.teacherNote}</span>
                </div>
              </div>
            )}

            {/* Missions List Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              
              {/* Mission 1: Lesson 1 */}
              <motion.div 
                whileHover={{ y: -2 }}
                className={`p-4 rounded-2xl border-2 transition flex flex-col justify-between ${
                  isLesson1Done
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-white border-amber-200 shadow-2xs'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-lg">
                      الْمَهَمَّةُ ١: دَرْسُ مُرَاجَعَةٍ
                    </span>
                    {isLesson1Done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <span className="text-xs font-bold text-stone-400">مَطْلُوب</span>
                    )}
                  </div>
                  <h4 className="font-black text-sm text-stone-900 leading-snug">
                    {lesson1Info?.lesson.title || 'دَرْسُ الْمُرَاجَعَةِ الأَوَّلُ'}
                  </h4>
                  <p className="text-[11px] text-stone-500 font-semibold line-clamp-2">
                    {lesson1Info?.lesson.summaryNarrative || 'رَاجِعْ مَفَاهِيمَ وَأَنْشِطَةَ هَذَا الدَّرْسِ'}
                  </p>
                </div>

                <div className="pt-3 mt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      if (lesson1Info) {
                        onSelectLesson(lesson1Info.lesson);
                        onCompleteTask('lesson1', 5);
                      }
                    }}
                    className={`w-full py-2 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 ${
                      isLesson1Done
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-amber-500 hover:bg-amber-600 text-white shadow-2xs'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isLesson1Done ? 'مُرَاجَعَةٌ مَرَّةً أُخْرَى' : 'ابْدَأِ الْمُرَاجَعَةَ 📖'}</span>
                  </button>
                </div>
              </motion.div>

              {/* Mission 2: Lesson 2 */}
              <motion.div 
                whileHover={{ y: -2 }}
                className={`p-4 rounded-2xl border-2 transition flex flex-col justify-between ${
                  isLesson2Done
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-white border-amber-200 shadow-2xs'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-lg">
                      الْمَهَمَّةُ ٢: دَرْسُ مُرَاجَعَةٍ
                    </span>
                    {isLesson2Done ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <span className="text-xs font-bold text-stone-400">مَطْلُوب</span>
                    )}
                  </div>
                  <h4 className="font-black text-sm text-stone-900 leading-snug">
                    {lesson2Info?.lesson.title || 'دَرْسُ الْمُرَاجَعَةِ الثَّانِي'}
                  </h4>
                  <p className="text-[11px] text-stone-500 font-semibold line-clamp-2">
                    {lesson2Info?.lesson.summaryNarrative || 'رَاجِعْ مَفَاهِيمَ وَأَنْشِطَةَ هَذَا الدَّرْسِ'}
                  </p>
                </div>

                <div className="pt-3 mt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      if (lesson2Info) {
                        onSelectLesson(lesson2Info.lesson);
                        onCompleteTask('lesson2', 5);
                      }
                    }}
                    className={`w-full py-2 px-3 rounded-xl font-black text-xs transition flex items-center justify-center gap-1.5 ${
                      isLesson2Done
                        ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                        : 'bg-amber-500 hover:bg-amber-600 text-white shadow-2xs'
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{isLesson2Done ? 'مُرَاجَعَةٌ مَرَّةً أُخْرَى' : 'ابْدَأِ الْمُرَاجَعَةَ 📖'}</span>
                  </button>
                </div>
              </motion.div>

              {/* Mission 3: Spelling & Phonics Challenge */}
              <motion.div 
                whileHover={{ y: -2 }}
                className={`p-4 rounded-2xl border-2 transition flex flex-col justify-between ${
                  isSpellingDone
                    ? 'bg-emerald-50/70 border-emerald-300'
                    : 'bg-white border-amber-200 shadow-2xs'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-purple-900 bg-purple-100 px-2 py-0.5 rounded-lg flex items-center gap-1">
                      <PenTool className="w-3 h-3 text-purple-700" />
                      <span>الْمَهَمَّةُ ٣: تَمْرِينٌ إِمْلائِيٌّ</span>
                    </span>
                    {isSpellingDone ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-100" />
                    ) : (
                      <span className="text-xs font-bold text-amber-600">+10 ⭐</span>
                    )}
                  </div>
                  <h4 className="font-bold text-xs text-stone-800 leading-snug">
                    {missions.spellingChallenge.question}
                  </h4>

                  {/* Interactive Options */}
                  <div className="grid grid-cols-2 gap-1.5 pt-1">
                    {missions.spellingChallenge.options.map((opt) => {
                      const isChosen = selectedSpellingOption === opt;
                      const isCorrect = opt === missions.spellingChallenge.correctAnswer;

                      return (
                        <button
                          key={opt}
                          type="button"
                          disabled={isSpellingDone}
                          onClick={() => handleCheckSpelling(opt)}
                          className={`p-2 rounded-xl text-xs font-black border transition ${
                            isSpellingDone && isCorrect
                              ? 'bg-emerald-500 text-white border-emerald-600 shadow-xs'
                              : isChosen && !isCorrect
                              ? 'bg-rose-100 text-rose-800 border-rose-300'
                              : 'bg-stone-50 hover:bg-purple-50 text-stone-800 border-stone-200'
                          }`}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation feedback */}
                  {spellingFeedback && (
                    <div className={`p-2 rounded-xl text-[11px] font-bold mt-1 ${
                      spellingFeedback.isCorrect
                        ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                        : 'bg-amber-100 text-amber-900 border border-amber-200'
                    }`}>
                      {spellingFeedback.text}
                    </div>
                  )}
                </div>

                <div className="pt-2 text-[10px] text-stone-500 font-semibold border-t border-stone-100 mt-2">
                  {missions.spellingChallenge.ruleSummary}
                </div>
              </motion.div>

            </div>

            {/* Daily Completion Grand Reward */}
            {isAllDone && (
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-gradient-to-r from-yellow-100 via-amber-100 to-yellow-200 border-2 border-amber-400 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-400 text-stone-900 flex items-center justify-center text-2xl shadow-sm">
                    🏆
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-amber-950">
                      مُبَارَكٌ! لَقَدْ أَتْمَمْتَ كَافَّةَ مَهَامِ الْيَوْمِ الْمُقَرَّرَةِ!
                    </h4>
                    <p className="text-xs text-amber-800 font-bold">
                      {isRewardClaimed 
                        ? 'تَمَّتْ إِضَافَةُ النُّجُومِ الشَّرَفِيَّةِ إِلَى رَصِيدِكَ بِنَجَاحٍ ⭐' 
                        : `اسْتَلِمْ جَائِزَتَكَ الْيَوْمِيَّةَ (+${missions.rewardStars} نَجْمَةً إِضَافِيَّةً)`}
                    </p>
                  </div>
                </div>

                {!isRewardClaimed && (
                  <button
                    type="button"
                    onClick={handleClaimAllReward}
                    className="py-2.5 px-5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs md:text-sm rounded-xl shadow-md transition transform active:scale-95 flex items-center gap-1.5"
                  >
                    <Star className="w-4 h-4 fill-white" />
                    <span>اسْتِلَامُ مُكَافَأَةِ الْمُعَلِّمِ (+{missions.rewardStars} ⭐)</span>
                  </button>
                )}
              </motion.div>
            )}

          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};
