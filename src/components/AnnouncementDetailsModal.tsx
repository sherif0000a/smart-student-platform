import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Volume2, 
  Sparkles, 
  CheckCircle2, 
  X, 
  ArrowRight, 
  Calendar, 
  UserCheck, 
  BookOpen, 
  Gamepad2, 
  Settings 
} from 'lucide-react';
import { ClassroomAnnouncement, UserRole, SubjectType } from '../types';
import { sounds, speakArabic } from '../utils/audio';
import confetti from 'canvas-confetti';

interface AnnouncementDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: ClassroomAnnouncement | null;
  currentRole: UserRole;
  onStartSubject: (subject: SubjectType) => void;
  onOpenGames: () => void;
  onOpenTeacherDashboard: () => void;
}

export const AnnouncementDetailsModal: React.FC<AnnouncementDetailsModalProps> = ({
  isOpen,
  onClose,
  announcement,
  currentRole,
  onStartSubject,
  onOpenGames,
  onOpenTeacherDashboard
}) => {
  const [isSpeaking, setIsSpeaking] = React.useState(false);

  if (!isOpen || !announcement) return null;

  const handleSpeak = () => {
    sounds.playClick();
    setIsSpeaking(true);
    const textToRead = `${announcement.badge || 'إعلان الفصل والمهمة اليومية'}: رسالة من ${announcement.senderName}. ${announcement.message}. بالتوفيق لجميع أبطالنا في تقفيل التحديات!`;
    speakArabic(
      textToRead,
      () => setIsSpeaking(false),
      () => setIsSpeaking(true)
    );
  };

  const handleCelebrateAndClose = () => {
    sounds.playCheerSuccess();
    try {
      confetti({ particleCount: 70, spread: 70, origin: { y: 0.6 } });
    } catch {}
    onClose();
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.22 }}
          className="bg-white rounded-3xl shadow-2xl border-4 border-amber-300 w-full max-w-lg overflow-hidden max-h-[92vh] flex flex-col"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-4 sm:p-5 text-white flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-2xl shadow-inner">
                📢
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-wider bg-white/25 px-2.5 py-0.5 rounded-full inline-block mb-0.5">
                  {announcement.badge || 'تَحَدِّي الْيَوْمِ وَإِعْلَانُ الْفَصْلِ'}
                </span>
                <h3 className="text-base sm:text-lg font-black leading-tight">
                  تَفَاصِيلُ التَّحَدِّي الْيَوْمِيِّ 🌟
                </h3>
              </div>
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="w-9 h-9 rounded-xl bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body */}
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4 text-right">
            
            {/* Sender and Date Badge */}
            <div className="flex items-center justify-between bg-amber-50 rounded-2xl p-3 border border-amber-200 text-xs text-amber-950 font-bold">
              <div className="flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-amber-600" />
                <span>الْمُرْسِلُ: <span className="text-amber-900 font-black">{announcement.senderName}</span></span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-500 font-semibold text-[11px]">
                <Calendar className="w-3.5 h-3.5 text-amber-600" />
                <span>{announcement.date || 'اليوم'}</span>
              </div>
            </div>

            {/* Announcement Full Text Box */}
            <div className="bg-gradient-to-br from-amber-50/90 via-orange-50/50 to-yellow-50/90 rounded-2xl p-4 sm:p-5 border-2 border-amber-300 shadow-inner">
              <div className="flex items-start gap-2.5 mb-2">
                <span className="text-2xl">💬</span>
                <h4 className="text-xs font-black text-amber-900 uppercase">نَصُّ الرِّسَالَةِ وَالتَّوْجِيهِ:</h4>
              </div>
              <p className="text-stone-900 font-bold text-sm sm:text-base leading-relaxed text-right whitespace-pre-wrap">
                {announcement.message}
              </p>

              {/* TTS Listen Button */}
              <div className="mt-4 pt-3 border-t border-amber-200/80 flex items-center justify-between">
                <span className="text-[11px] font-bold text-amber-800">
                  اسْتَمِعْ لِصَوْتِ الْمُعَلِّمِ:
                </span>
                <button
                  type="button"
                  onClick={handleSpeak}
                  className={`px-3 py-1.5 rounded-xl text-xs font-black transition flex items-center gap-1.5 shadow-2xs ${
                    isSpeaking
                      ? 'bg-amber-600 text-white animate-pulse'
                      : 'bg-white hover:bg-amber-100 text-amber-900 border border-amber-300'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isSpeaking ? 'جَارٍ الاسْتِمَاعُ... 🔊' : 'اسْتَمِعْ لِلرِّسَالَةِ 🔊'}</span>
                </button>
              </div>
            </div>

            {/* Challenge Roadmap Guide */}
            <div className="bg-white rounded-2xl border-2 border-stone-200 p-4 space-y-2.5">
              <h4 className="text-xs font-black text-stone-800 flex items-center gap-2">
                <Trophy className="w-4 h-4 text-amber-500" />
                <span>مَا هُوَ الْمَطْلُوبُ مِنَ التِّلْمِيذِ الْبَطَلِ؟</span>
              </h4>
              <ul className="space-y-2 text-xs font-bold text-stone-700">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>1. فَتْحُ مَادَّةِ الرِّيَاضِيَّاتِ أَوْ الْمَادَّةِ الْمُحَدَّدَةِ وَإِتْمَامُ الدَّرْسِ الْيَوْمِيِّ.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>2. حَلُّ تَمَارِينِ الْمَنْهَجِ الْمُعْتَمَدَةِ وَتَقْفِيلُ دَرَجَاتِ التَّحَدِّي كَامِلَةً.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>3. خَوْضُ أَلْعَابِ التَّحَدِّي السَّرِيعَةِ لِرَفْعِ رَصِيدِ النُّجُومِ وَاسْتِحْقَاقِ شَهَادَةِ التَّقْدِيرِ!</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onStartSubject('math');
                    onClose();
                  }}
                  className="p-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl font-black text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>تَدْرِيبَاتُ الرِّيَاضِيَّاتِ 🚀</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onOpenGames();
                    onClose();
                  }}
                  className="p-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-2xl font-black text-xs shadow-md transition flex items-center justify-center gap-1.5"
                >
                  <Gamepad2 className="w-4 h-4" />
                  <span>أَلْعَابُ التَّحَدِّي 🎮</span>
                </button>
              </div>

              {(currentRole === 'teacher' || currentRole === 'supervisor') && (
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onOpenTeacherDashboard();
                    onClose();
                  }}
                  className="w-full py-2.5 px-3 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-2xl font-bold text-xs border border-stone-300 transition flex items-center justify-center gap-1.5"
                >
                  <Settings className="w-4 h-4 text-stone-600" />
                  <span>إِدَارَةُ الإِعْلَانِ فِي لَوْحَةِ تَحَكُّمِ الْمُعَلِّمِ 👨‍🏫</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleCelebrateAndClose}
                className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl font-black text-xs shadow-md transition flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-4 h-4 fill-white" />
                <span>أَنَا جَاهِزٌ لِلتَّحَدِّي وَسَأُقَفِّلُ النُّجُومَ! 💪✨</span>
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
