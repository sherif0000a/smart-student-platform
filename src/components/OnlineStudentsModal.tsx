import React, { useState, useEffect } from 'react';
import { Users, X, Sparkles, Star, Award, Heart, MessageCircle, Send, RefreshCw, Zap } from 'lucide-react';
import { LiveOnlineStudent } from '../types';
import { fetchLiveOnlineStudents } from '../utils/presenceManager';
import { sounds } from '../utils/audio';

interface OnlineStudentsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStudentId: string;
  currentStudentName: string;
  currentStars: number;
}

export const OnlineStudentsModal: React.FC<OnlineStudentsModalProps> = ({
  isOpen,
  onClose,
  currentStudentId,
  currentStudentName,
  currentStars
}) => {
  const [students, setStudents] = useState<LiveOnlineStudent[]>([]);
  const [loading, setLoading] = useState(false);
  const [sentCheerTo, setSentCheerTo] = useState<Record<string, string>>({});

  const fetchOnlineList = async () => {
    try {
      setLoading(true);
      const list = await fetchLiveOnlineStudents(currentStudentId);
      setStudents(list);
    } catch (err) {
      console.warn('Failed to fetch online students:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchOnlineList();
      const interval = setInterval(fetchOnlineList, 5000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const sendCheer = (studentId: string, studentName: string, cheerMsg: string) => {
    sounds.playCheerSuccess();
    setSentCheerTo(prev => ({ ...prev, [studentId]: cheerMsg }));
    setTimeout(() => {
      setSentCheerTo(prev => {
        const copy = { ...prev };
        delete copy[studentId];
        return copy;
      });
    }, 4000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl max-h-[85vh] bg-white rounded-3xl shadow-2xl border-4 border-emerald-300 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-500 via-teal-600 to-green-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-white/20 rounded-2xl text-2xl">👥</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black">زُمَلَاءُ الدِّرَاسَةِ الْمُتَّصِلُونَ الآنَ</h2>
                <span className="bg-emerald-300 text-slate-900 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {students.length} بَطَلٍ حَقِيقِيٍّ
                </span>
              </div>
              <p className="text-xs text-emerald-100">
                تَوَاصَلْ وَشَجِّعْ زُمَلَاءَكَ الأَبْطَالَ فِي مَنَصَّةِ الطَّالِبِ الْمُجْتَهِدِ 🌟
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={fetchOnlineList}
              className={`p-2 rounded-full hover:bg-white/20 text-white transition-all ${loading ? 'animate-spin' : ''}`}
              title="تَحْدِيثُ الْقَائِمَةِ"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Info Banner */}
        <div className="bg-emerald-50 p-3 border-b border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-bold">حَالَةُ الاتِّصَالِ: نَشِطٌ مُبَاشَرَةً عَبْرَ الْخَادِمِ</span>
          </div>
          <span className="text-[11px] text-emerald-700">تَحْدِيثٌ تِلْقَائِيٌّ كُلَّ 10 ثَوَانٍ</span>
        </div>

        {/* Students List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {students.map(st => {
            const isSelf = st.id === currentStudentId || st.name === currentStudentName;
            const cheerMessage = sentCheerTo[st.id];

            return (
              <div
                key={st.id}
                className={`p-3.5 rounded-2xl border-2 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  isSelf
                    ? 'bg-amber-50/70 border-amber-300 ring-2 ring-amber-200'
                    : 'bg-white border-slate-200 hover:border-emerald-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="text-3xl p-1.5 bg-slate-100 rounded-2xl shadow-inner border border-slate-200">
                    {st.avatar || (st.isGirl ? '👧' : '👦')}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900 text-sm">{st.name}</span>
                      {isSelf && (
                        <span className="bg-amber-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black">
                          أَنْتَ (حِسَابُكَ)
                        </span>
                      )}
                      <span className="text-[10px] font-bold text-slate-500">
                        {st.gradeLevel || 'الصف الثالث الابتدائي'}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-600 mt-1">
                      <span className="flex items-center gap-1 font-bold text-amber-600">
                        <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                        <span>{isSelf ? currentStars : st.stars} نَجْمَةٍ</span>
                      </span>

                      {st.currentLesson && (
                        <span className="bg-sky-100 text-sky-800 text-[10px] px-2 py-0.5 rounded-md font-bold">
                          يَتَعَلَّمُ الآنَ: {st.currentLesson}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Interaction & Cheers */}
                <div className="flex items-center gap-1.5 self-end sm:self-center">
                  {cheerMessage ? (
                    <div className="bg-emerald-600 text-white text-xs px-3 py-1.5 rounded-xl font-bold animate-bounce shadow">
                      {cheerMessage}
                    </div>
                  ) : !isSelf ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => sendCheer(st.id, st.name, 'بَطَلٌ مُتَمَيِّزٌ! 🌟')}
                        className="px-2.5 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-xl text-xs font-bold transition-all hover:scale-105"
                        title="إرسال تشجيع"
                      >
                        🌟 بَطَلٌ
                      </button>
                      <button
                        onClick={() => sendCheer(st.id, st.name, 'عَبْقَرِيٌّ يَا بَطَلُ! 🚀')}
                        className="px-2.5 py-1 bg-sky-50 hover:bg-sky-100 text-sky-800 border border-sky-200 rounded-xl text-xs font-bold transition-all hover:scale-105"
                        title="إرسال تشجيع"
                      >
                        🚀 عَبْقَرِيٌّ
                      </button>
                      <button
                        onClick={() => sendCheer(st.id, st.name, 'أَحْسَنْتَ صُنْعاً! 👏')}
                        className="px-2.5 py-1 bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-200 rounded-xl text-xs font-bold transition-all hover:scale-105"
                        title="إرسال تشجيع"
                      >
                        👏 أَحْسَنْتَ
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-amber-700 font-bold bg-amber-100 px-2.5 py-1 rounded-xl">
                      مُتَّصِلٌ وَنَشِطٌ الآنَ 🟢
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
          مِيزَةُ التَّوَاصُلِ الْحَقِيقِيِّ لِتَشْجِيعِ الطُّلابِ الْمُجْتَهِدِينَ عَلَى التَّفَوُّقِ مَعاً! 🏆
        </div>
      </div>
    </div>
  );
};
