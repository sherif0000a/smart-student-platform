import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Phone, MessageSquare, X, GraduationCap, CheckCircle, Code } from 'lucide-react';
import { sounds } from '../utils/audio';

interface DeveloperBadgeProps {
  compact?: boolean;
}

export const DeveloperBadge: React.FC<DeveloperBadgeProps> = ({ compact = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleOpenTribute = () => {
    sounds.playClick();
    setIsModalOpen(true);
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpenTribute}
        className="group relative inline-flex items-center gap-1.5 px-2.5 py-1 bg-slate-900/90 hover:bg-slate-800 text-amber-300 hover:text-amber-200 rounded-full border border-amber-400/40 hover:border-amber-300 shadow-xs transition-all duration-200 active:scale-95 text-xs font-bold cursor-pointer"
        title="بصمة المطور: أ/ شريف عسقلاني"
      >
        <span className="w-5 h-5 rounded-full bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center text-[10px] shadow-2xs shrink-0 font-black">
          👨‍🏫
        </span>
        <span className="text-[11px] tracking-tight">
          <span className="text-stone-300 ml-1">المطور:</span>
          <strong className="text-amber-300 group-hover:text-amber-100 font-extrabold">أ/ شريف</strong>
        </span>
        <Sparkles className="w-3 h-3 text-amber-400 opacity-80 group-hover:opacity-100 animate-pulse" />
      </button>

      {/* Developer Profile Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 15 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 15 }}
              transition={{ type: 'spring', damping: 25, stiffness: 350 }}
              className="w-full max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl border border-stone-200 text-right flex flex-col"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white relative">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-3.5 left-3.5 p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition"
                  aria-label="إغلاق"
                >
                  <X className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-400 to-amber-500 text-slate-950 flex items-center justify-center text-2xl shadow-md shrink-0">
                    👨‍🏫
                  </div>
                  <div>
                    <span className="text-[11px] bg-amber-400/20 text-amber-300 border border-amber-400/30 px-2 py-0.5 rounded-md font-bold">
                      رُؤْيَةٌ وَإِشْرَافٌ تَعْلِيمِيٌّ
                    </span>
                    <h2 className="text-lg font-black text-white mt-1">
                      الأُسْتَاذُ شَرِيف عَسْقَلَانِي
                    </h2>
                    <p className="text-[11px] text-stone-300">
                      مُعَلِّمٌ وَمُطَوِّرُ مَنْظُومَةِ «الطَّالِبِ الْمُجْتَهِدِ»
                    </p>
                  </div>
                </div>
              </div>

              {/* Body */}
              <div className="p-5 space-y-3.5 text-stone-800 text-sm">
                <div className="p-3.5 bg-amber-50/70 rounded-xl border border-amber-200/80 text-xs sm:text-sm text-stone-700 leading-relaxed">
                  «تَمَّ إِعْدَادُ وَتَطْوِيرُ هَذِهِ الْمَنَصَّةِ التَّعْلِيمِيَّةِ بِحِرْصٍ وَإِتْقَانٍ؛ لِتَخْفِيفِ عِبْءِ الْمُذَاكَرَةِ عَنْ أَوْلِيَاءِ الأُمُورِ، وَتَقْدِيمِ تَجْرِبَةٍ شَيِّقَةٍ لِأَبْطَالِنَا تَجْمَعُ بَيْنَ الْمُتْعَةِ وَإِتْقَانِ الْمَنْهَجِ الدِّرَاسِيِّ بِالْكَامِلِ!»
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 bg-indigo-50 rounded-lg border border-indigo-100">
                    <div className="flex items-center gap-1.5 text-indigo-900 font-bold mb-0.5">
                      <GraduationCap className="w-3.5 h-3.5 text-indigo-600" />
                      <span>3 مَوَادَّ مُعْتَمَدَةٍ</span>
                    </div>
                    <p className="text-[10px] text-stone-600">
                      الرِّيَاضِيَّاتُ، Connect 3، وَاللُّغَةُ الْعَرَبِيَّةُ.
                    </p>
                  </div>

                  <div className="p-2.5 bg-emerald-50 rounded-lg border border-emerald-100">
                    <div className="flex items-center gap-1.5 text-emerald-900 font-bold mb-0.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span>مُعَلِّمٌ ذَكِيٌّ 24/7</span>
                    </div>
                    <p className="text-[10px] text-stone-600">
                      رُوبُوتٌ مُسَاعِدٌ وَاقْتِرَاحُ الدُّرُوسِ الْمُنَاسِبَةِ.
                    </p>
                  </div>
                </div>

                {/* Contact Card */}
                <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="text-[11px] font-bold text-stone-900">لِلتَّوَاصُلِ وَالْمُلَاحَظَاتِ:</div>
                      <div className="text-xs font-mono font-bold text-emerald-700" dir="ltr">01080997505</div>
                    </div>
                  </div>
                  <a
                    href="https://wa.me/201080997505"
                    target="_blank"
                    rel="noreferrer"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition shadow-xs"
                  >
                    <MessageSquare className="w-3 h-3" />
                    <span>وَاتْسَاب</span>
                  </a>
                </div>
              </div>

              {/* Footer */}
              <div className="bg-stone-50 p-3.5 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[11px] text-stone-500 font-medium">
                  بِالتَّوْفِيقِ لِجَمِيعِ أَبْطَالِنَا 🌟
                </span>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="bg-slate-800 hover:bg-slate-900 text-white px-4 py-1.5 rounded-lg font-bold text-xs transition"
                >
                  إِغْلَاقٌ
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
