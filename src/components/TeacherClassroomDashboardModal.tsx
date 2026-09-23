import React, { useState, useEffect } from 'react';
import { TeacherAccount, UserProfile, ClassroomAnnouncement } from '../types';
import { getStudentsList, addStudent, deleteStudent, getAnnouncements, addAnnouncement } from '../utils/authStorage';
import { sounds } from '../utils/audio';
import { UserPlus, Trash2, Send, Users, Star, Award, ShieldAlert, X, MessageSquare, CheckCircle, Sparkles, Phone, Smartphone } from 'lucide-react';
import { SendCertificateWhatsAppModal } from './SendCertificateWhatsAppModal';

interface TeacherClassroomDashboardModalProps {
  isOpen: boolean;
  teacher: TeacherAccount;
  onClose: () => void;
  onRefreshData?: () => void;
}

export const TeacherClassroomDashboardModal: React.FC<TeacherClassroomDashboardModalProps> = ({
  isOpen,
  teacher,
  onClose,
  onRefreshData
}) => {
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [announcements, setAnnouncements] = useState<ClassroomAnnouncement[]>([]);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGender, setNewStudentGender] = useState<'boy' | 'girl'>('boy');
  const [newStudentPin, setNewStudentPin] = useState('123');
  const [newStudentPhone, setNewStudentPhone] = useState('01080997505');
  const [announcementText, setAnnouncementText] = useState('');
  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [certStudentId, setCertStudentId] = useState<string | undefined>(undefined);

  useEffect(() => {
    if (isOpen) {
      loadData();
    }
  }, [isOpen]);

  const loadData = () => {
    setStudents(getStudentsList());
    setAnnouncements(getAnnouncements());
  };

  if (!isOpen) return null;

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    addStudent({
      name: newStudentName.trim(),
      heroType: newStudentGender,
      avatar: newStudentGender === 'girl' ? '👧' : '👦',
      pin: newStudentPin.trim() || '123',
      parentPhone: newStudentPhone.trim() || '01080997505'
    });

    sounds.playCheerSuccess();
    setNewStudentName('');
    setNewStudentPhone('01080997505');
    setFeedbackMsg(`تَمَّتْ إِضَافَةُ التِّلْمِيذِ (${newStudentName.trim()}) بِنَجَاحٍ! ⭐`);
    loadData();
    onRefreshData?.();
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  const handleOpenCertModal = (studentId?: string) => {
    sounds.playClick();
    setCertStudentId(studentId || students[0]?.id);
    setIsCertModalOpen(true);
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (window.confirm(`هَلْ أَنْتَ مُتَأَكِّدٌ مِنْ حَذْفِ التِّلْمِيذِ «${name}»؟`)) {
      deleteStudent(id);
      sounds.playClick();
      loadData();
      onRefreshData?.();
    }
  };

  const handleSendAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementText.trim()) return;

    addAnnouncement({
      senderName: teacher.name,
      senderRole: 'teacher',
      message: announcementText.trim(),
      badge: 'مُهِمَّةٌ مِنْ الْمُعَلِّمِ'
    });

    sounds.playCheerSuccess();
    setAnnouncementText('');
    setFeedbackMsg('تَمَّ نَشْرُ الرِّسَالَةِ لِجَمِيعِ التَّلَامِيذِ بِنَجَاحٍ! 📢');
    loadData();
    onRefreshData?.();
    setTimeout(() => setFeedbackMsg(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border-4 border-sky-400 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-600 via-indigo-600 to-sky-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-white/20 rounded-2xl text-2xl">👨‍🏫</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black">{teacher.name}</h2>
                <span className="text-xs bg-amber-400 text-slate-900 font-black px-2 py-0.5 rounded-full">
                  {teacher.className}
                </span>
              </div>
              <p className="text-xs text-sky-100 font-bold">
                أَهْلاً بِكَ يَا صَانِعَ الأَجْيَالِ! لَوْحَةُ تَحَكُّمِ فَصْلِكَ وَتَلَامِيذِكَ ✨
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-2 bg-white/15 hover:bg-white/30 rounded-xl transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-stone-50">
          {feedbackMsg && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-black flex items-center gap-2 animate-fadeIn">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>{feedbackMsg}</span>
            </div>
          )}

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center justify-between">
              <div>
                <div className="text-xs text-stone-500 font-bold">إِجْمَالِيُّ التَّلَامِيذِ</div>
                <div className="text-2xl font-black text-sky-700">{students.length} بَطَلاً</div>
              </div>
              <Users className="w-8 h-8 text-sky-500" />
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center justify-between">
              <div>
                <div className="text-xs text-stone-500 font-bold">التَّلَامِيذُ الْمُتَّصِلُونَ</div>
                <div className="text-2xl font-black text-emerald-600">
                  {students.filter(s => s.onlineStatus === 'online').length} تِلْمِيذاً
                </div>
              </div>
              <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs flex items-center justify-between">
              <div>
                <div className="text-xs text-stone-500 font-bold">مَجْمُوعُ النُّجُومِ</div>
                <div className="text-2xl font-black text-amber-600">
                  {students.reduce((acc, s) => acc + s.totalStars, 0)} ⭐
                </div>
              </div>
              <Award className="w-8 h-8 text-amber-500" />
            </div>
          </div>

          {/* Quick Certificate Submission Banner */}
          <div className="bg-gradient-to-r from-emerald-600 via-green-600 to-emerald-700 p-4 rounded-2xl text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-3 text-right">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-2xl shadow-inner shrink-0">
                🏆
              </div>
              <div>
                <h4 className="font-black text-sm">تَسْلِيمُ شَهَادَةِ تَقْدِيرٍ لِلطَّالِبِ عَبْرَ الْوَاتْسَابِ 📱</h4>
                <p className="text-emerald-100 text-xs font-bold">
                  اخْتَرِ الطَّالِبَ الْمُتَفَوِّقَ وَأَرْسِلِ الشَّهَادَةَ الْمُعْتَمَدَةَ لِوَلِيِّ أَمْرِهِ بِضَغْطَةِ زِرٍّ وَاحِدَةٍ!
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleOpenCertModal()}
              className="w-full sm:w-auto px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-900 font-black text-xs rounded-xl shadow transition transform active:scale-95 flex items-center justify-center gap-1.5 shrink-0"
            >
              <Award className="w-4 h-4 text-stone-900" />
              <span>إِرْسَالُ شَهَادَةِ تَقْدِيرٍ الآنَ 🌟</span>
            </button>
          </div>

          {/* Section 1: Send Classroom Announcement / Task */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-black text-stone-800 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-sky-600" />
              <span>إِرْسَالُ إِعْلَانٍ أَوْ مُهِمَّةٍ لِتَلَامِيذِ الْفَصْلِ:</span>
            </h3>

            <form onSubmit={handleSendAnnouncement} className="space-y-2">
              <textarea
                value={announcementText}
                onChange={e => setAnnouncementText(e.target.value)}
                placeholder="اكْتُبْ كَلِمَةَ تَشْجِيعٍ أَوْ مُهِمَّةً (مَثَلاً: يَا أَبْطَالَ فَصْلِنَا، الْيَوْمَ مَطْلُوبٌ حَلُّ جَدْوَلِ ضَرْبِ 7 وَحَفْظِ نَشِيدِ أَصْحَابِ الْمِهَنِ!)..."
                className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-sky-500 h-20 resize-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs rounded-xl shadow flex items-center gap-1.5 transition active:scale-95"
              >
                <Send className="w-4 h-4" />
                <span>إِرْسَالُ الإِعْلَانِ الآنَ 📢</span>
              </button>
            </form>
          </div>

          {/* Section 2: Add New Student */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <h3 className="text-sm font-black text-stone-800 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-emerald-600" />
              <span>إِضَافَةُ تِلْمِيذٍ جَدِيدٍ لِلْفَصْلِ مَعَ رَقْمِ الْوَاتْسَابِ:</span>
            </h3>

            <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-5 gap-2">
              <input
                type="text"
                value={newStudentName}
                onChange={e => setNewStudentName(e.target.value)}
                placeholder="اسْمُ التِّلْمِيذِ..."
                className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-emerald-500"
              />
              <select
                value={newStudentGender}
                onChange={e => setNewStudentGender(e.target.value as 'boy' | 'girl')}
                className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900"
              >
                <option value="boy">👦 بَطَلٌ (وَلَدٌ)</option>
                <option value="girl">👧 بَطَلَةٌ (بِنْتٌ)</option>
              </select>
              <input
                type="text"
                value={newStudentPin}
                onChange={e => setNewStudentPin(e.target.value)}
                placeholder="كَلِمَةُ الْمُرُورِ (123)"
                className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900"
              />
              <input
                type="tel"
                value={newStudentPhone}
                onChange={e => setNewStudentPhone(e.target.value)}
                placeholder="رقم الواتساب..."
                className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 text-left font-mono"
              />
              <button
                type="submit"
                className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow transition active:scale-95"
              >
                ➕ حِفْظُ التِّلْمِيذِ
              </button>
            </form>
          </div>

          {/* Section 3: Students Roster */}
          <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-stone-800 flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-600" />
                <span>قَائِمَةُ تَلَامِيذِ الْفَصْلِ ({students.length}):</span>
              </h3>
            </div>

            <div className="divide-y divide-stone-100 max-h-60 overflow-y-auto">
              {students.map(s => (
                <div key={s.id} className="py-2.5 flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl">{s.avatar}</span>
                    <div>
                      <div className="font-bold text-xs text-stone-900 flex items-center gap-1.5">
                        <span>{s.name}</span>
                        <span className="text-[10px] text-stone-400 font-normal">PIN: {s.pin || '123'}</span>
                      </div>
                      <div className="text-[11px] text-amber-600 font-bold flex items-center gap-2">
                        <span className="flex items-center gap-0.5">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                          <span>{s.totalStars} نَجْمَة</span>
                        </span>
                        {s.parentPhone && (
                          <span className="text-[10px] text-stone-400 font-mono" dir="ltr">
                            📱 {s.parentPhone}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenCertModal(s.id)}
                      className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-lg text-xs font-black transition flex items-center gap-1 border border-emerald-200 shadow-2xs"
                      title="إرسال شهادة تقدير عبر الواتساب"
                    >
                      <Award className="w-3.5 h-3.5 text-emerald-600" />
                      <span>شَهَادَةٌ 📱</span>
                    </button>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                      {s.onlineStatus === 'online' ? '🟢 أُونْلَايْن' : '⚪ غَيْرُ نَشِطٍ'}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleDeleteStudent(s.id || '', s.name)}
                      className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="حذف التلميذ"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Supervisor Protection Note */}
          <div className="bg-amber-50 border border-amber-200 p-3 rounded-xl flex items-center gap-2 text-xs text-amber-900 font-bold">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              مُلَاحَظَةٌ: صَلَاحِيَاتُ الْمُعَلِّمِ مُحَدَّدَةٌ بِإِدَارَةِ فَصْلِهِ وَإِرْسَالِ الْمَهَامِّ. إِدَارَةُ الْمُعَلِّمِينَ وَالإِعْدَادَاتِ الْعَامَّةِ مَحْصُورَةٌ لِلْمُشْرِفِ وَالْمُطَوِّرِ (الأُسْتَاذِ شَرِيف عَسْقَلَانِي).
            </span>
          </div>
        </div>

        {/* WhatsApp Certificate Modal */}
        <SendCertificateWhatsAppModal
          isOpen={isCertModalOpen}
          onClose={() => setIsCertModalOpen(false)}
          students={students}
          teacherName={teacher.name}
          initialStudentId={certStudentId}
        />
      </div>
    </div>
  );
};
