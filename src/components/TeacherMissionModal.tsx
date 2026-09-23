import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TeacherDailyMissions, DailySpellingChallenge } from '../types';
import { allUnits } from '../data';
import { defaultSpellingChallenges } from '../data/spellingBank';
import { sounds } from '../utils/audio';
import { X, CheckCircle2, BookOpen, PenTool, Sparkles, GraduationCap, Save } from 'lucide-react';

interface TeacherMissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMissions: TeacherDailyMissions;
  onSave: (updated: TeacherDailyMissions) => void;
}

export const TeacherMissionModal: React.FC<TeacherMissionModalProps> = ({
  isOpen,
  onClose,
  currentMissions,
  onSave
}) => {
  const [lessonId1, setLessonId1] = useState(currentMissions.lessonId1);
  const [lessonId2, setLessonId2] = useState(currentMissions.lessonId2);
  const [selectedSpellingId, setSelectedSpellingId] = useState(currentMissions.spellingChallenge.id);
  const [teacherName, setTeacherName] = useState(currentMissions.teacherName);
  const [teacherNote, setTeacherNote] = useState(currentMissions.teacherNote);
  const [rewardStars, setRewardStars] = useState(currentMissions.rewardStars);

  if (!isOpen) return null;

  // Flatten all lessons across units for easy selection
  const allAvailableLessons = allUnits.flatMap(u => 
    u.lessons.map(l => ({
      id: l.id,
      title: `${u.title} - ${l.title} (${l.categoryLabel})`,
      category: l.categoryLabel
    }))
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playSuccess();

    const chosenSpelling = defaultSpellingChallenges.find(s => s.id === selectedSpellingId) || defaultSpellingChallenges[0];

    const updated: TeacherDailyMissions = {
      ...currentMissions,
      teacherName: teacherName.trim() || 'الأُسْتَاذُ شَرِيف عَسْقَلَانِي',
      teacherNote: teacherNote.trim() || 'أَبْطَالِي الرَّائِعِينَ، رَكِّزُوا عَلَى مَهَامِ الْيَوْمِ وَقِرَاءَةِ الدُّرُوسِ بِالتَّشْكِيلِ!',
      lessonId1,
      lessonId2,
      spellingChallenge: chosenSpelling,
      rewardStars: Number(rewardStars) || 20,
      assignedDate: new Date().toISOString().split('T')[0]
    };

    onSave(updated);
    onClose();
  };

  return (
    <AnimatePresence>
      <div 
        id="teacher-mission-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-stone-950/70 backdrop-blur-sm overflow-y-auto"
      >
        <motion.div
          id="teacher-mission-card"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.2 }}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-indigo-300 overflow-hidden my-auto flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 p-5 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-3xl shadow-inner">
                👨‍🏫
              </div>
              <div>
                <h3 className="text-xl font-black">لَوْحَةُ تَخْصِيصِ مَهَامِ الْيَوْمِ (لِلْمُعَلِّمِ)</h3>
                <p className="text-indigo-100 text-xs font-semibold">
                  اخْتَرْ دَرْسَيِ الْمُرَاجَعَةِ وَالتَّمْرِينَ الإِمْلائِيَّ لِلطُّلابِ
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4">
            
            {/* Teacher Name & Note */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-black text-stone-700 mb-1">
                  اسْمُ الْمُعَلِّمِ / الْمُشْرِفِ:
                </label>
                <input
                  type="text"
                  value={teacherName}
                  onChange={(e) => setTeacherName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border-2 border-stone-200 rounded-xl text-sm font-bold text-stone-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                  placeholder="الأُسْتَاذُ شَرِيف عَسْقَلَانِي"
                />
              </div>

              <div>
                <label className="block text-xs font-black text-stone-700 mb-1">
                  جَائِزَةُ إِكْمَالِ مَهَامِ الْيَوْمِ (نُجُومٌ إِضَافِيَّةٌ):
                </label>
                <select
                  value={rewardStars}
                  onChange={(e) => setRewardStars(Number(e.target.value))}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border-2 border-stone-200 rounded-xl text-sm font-bold text-stone-800 focus:outline-none focus:border-indigo-500 transition"
                >
                  <option value={15}>+15 ⭐ نَجْمَة</option>
                  <option value={20}>+20 ⭐ نَجْمَة (مُوصَى بِهِ)</option>
                  <option value={30}>+30 ⭐ نَجْمَة (مُكَافَأَةٌ كَبِيرَةٌ)</option>
                </select>
              </div>
            </div>

            {/* Teacher Note Input */}
            <div>
              <label className="block text-xs font-black text-stone-700 mb-1">
                رِسَالَةُ الْمُعَلِّمِ التَّشْجِيعِيَّةُ لِلطَّالِبِ مَعَ الْمَهَامِ:
              </label>
              <textarea
                rows={2}
                value={teacherNote}
                onChange={(e) => setTeacherNote(e.target.value)}
                className="w-full px-3.5 py-2 bg-stone-50 border-2 border-stone-200 rounded-xl text-sm font-bold text-stone-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition"
                placeholder="اكْتُبْ رِسَالَةً قَصِيرَةً تُشَجِّعُ الطَّالِبَ عَلَى مُرَاجَعَةِ دُرُوسِ الْيَوْمِ..."
              />
            </div>

            {/* Revision Lesson 1 */}
            <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-200 space-y-2">
              <label className="block text-xs font-black text-indigo-950 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>دَرْسُ الْمُرَاجَعَةِ الأَوَّلُ:</span>
              </label>
              <select
                value={lessonId1}
                onChange={(e) => setLessonId1(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border-2 border-indigo-200 rounded-xl text-xs md:text-sm font-bold text-stone-800 focus:outline-none focus:border-indigo-600 transition"
              >
                {allAvailableLessons.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Revision Lesson 2 */}
            <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-200 space-y-2">
              <label className="block text-xs font-black text-indigo-950 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <span>دَرْسُ الْمُرَاجَعَةِ الثَّانِي:</span>
              </label>
              <select
                value={lessonId2}
                onChange={(e) => setLessonId2(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border-2 border-indigo-200 rounded-xl text-xs md:text-sm font-bold text-stone-800 focus:outline-none focus:border-indigo-600 transition"
              >
                {allAvailableLessons.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Spelling Challenge Selection */}
            <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 space-y-2">
              <label className="block text-xs font-black text-amber-950 flex items-center gap-1.5">
                <PenTool className="w-4 h-4 text-amber-600" />
                <span>التَّمْرِينُ الإِمْلائِيُّ الْقَصِيرُ لِلْيَوْمِ:</span>
              </label>
              <select
                value={selectedSpellingId}
                onChange={(e) => setSelectedSpellingId(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border-2 border-amber-200 rounded-xl text-xs md:text-sm font-bold text-stone-800 focus:outline-none focus:border-amber-600 transition"
              >
                {defaultSpellingChallenges.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.title} - ({s.correctAnswer})
                  </option>
                ))}
              </select>

              {/* Show preview of selected spelling question */}
              {(() => {
                const sp = defaultSpellingChallenges.find(s => s.id === selectedSpellingId);
                if (!sp) return null;
                return (
                  <div className="text-xs bg-white/90 p-2.5 rounded-xl border border-amber-200 text-stone-700 mt-2">
                    <p className="font-bold text-amber-900 mb-1">{sp.question}</p>
                    <p className="text-[11px] text-stone-500 font-semibold">{sp.ruleSummary}</p>
                  </div>
                );
              })()}
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-black text-sm md:text-base rounded-2xl shadow-md transition transform active:scale-95 flex items-center justify-center gap-2"
              >
                <Save className="w-4 h-4" />
                <span>حِفْظُ وَاعْتِمَادُ مَهَامِ الْيَوْمِ لِلطَّالِبِ</span>
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
