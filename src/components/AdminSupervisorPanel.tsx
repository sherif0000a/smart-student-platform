import React, { useState, useEffect } from 'react';
import { TeacherAccount, UserProfile, SupervisorConfig, ClassroomAnnouncement, LiveOnlineStudent } from '../types';
import { 
  getSupervisorConfig, 
  saveSupervisorConfig, 
  getTeachersList, 
  addTeacher, 
  deleteTeacher, 
  getStudentsList, 
  addStudent, 
  deleteStudent,
  getAnnouncements,
  addAnnouncement
} from '../utils/authStorage';
import { fetchLiveOnlineStudents } from '../utils/presenceManager';
import { sounds } from '../utils/audio';
import { 
  ShieldCheck, 
  UserPlus, 
  Trash2, 
  Send, 
  Users, 
  Key, 
  Phone, 
  Lock, 
  X, 
  CheckCircle2, 
  GraduationCap, 
  Settings,
  Sparkles,
  Award
} from 'lucide-react';

interface AdminSupervisorPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onRefreshData?: () => void;
}

export const AdminSupervisorPanel: React.FC<AdminSupervisorPanelProps> = ({
  isOpen,
  onClose,
  onRefreshData
}) => {
  const [activeTab, setActiveTab] = useState<'teachers' | 'students' | 'config' | 'broadcast'>('teachers');
  const [config, setConfig] = useState<SupervisorConfig>(getSupervisorConfig());
  const [teachers, setTeachers] = useState<TeacherAccount[]>([]);
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [liveStudents, setLiveStudents] = useState<LiveOnlineStudent[]>([]);
  const [announcements, setAnnouncements] = useState<ClassroomAnnouncement[]>([]);

  // New Teacher Fields
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherPin, setNewTeacherPin] = useState('1234');
  const [newTeacherClass, setNewTeacherClass] = useState('الصف الثالث - التفوق');
  const [newTeacherSubject, setNewTeacherSubject] = useState<'math' | 'arabic' | 'english'>('math');

  // New Student Fields
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentPin, setNewStudentPin] = useState('123');
  const [newStudentGender, setNewStudentGender] = useState<'boy' | 'girl'>('boy');

  // Config Fields
  const [adminName, setAdminName] = useState(config.adminName);
  const [adminPin, setAdminPin] = useState(config.adminPin);
  const [adminPhone, setAdminPhone] = useState(config.adminPhone);

  // Broadcast Field
  const [broadcastText, setBroadcastText] = useState('');
  const [alertFeedback, setAlertFeedback] = useState('');

  const refreshLivePresence = async () => {
    try {
      const live = await fetchLiveOnlineStudents();
      setLiveStudents(live);
    } catch {}
  };

  useEffect(() => {
    if (isOpen) {
      loadAll();
      refreshLivePresence();
      const interval = setInterval(refreshLivePresence, 4000);
      return () => clearInterval(interval);
    }
  }, [isOpen]);

  const loadAll = () => {
    const c = getSupervisorConfig();
    setConfig(c);
    setAdminName(c.adminName);
    setAdminPin(c.adminPin);
    setAdminPhone(c.adminPhone);
    setTeachers(getTeachersList());
    setStudents(getStudentsList());
    setAnnouncements(getAnnouncements());
  };

  if (!isOpen) return null;

  const handleAddTeacher = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim()) return;

    addTeacher({
      name: newTeacherName.trim(),
      pin: newTeacherPin.trim() || '1234',
      className: newTeacherClass.trim(),
      subject: newTeacherSubject
    });

    sounds.playCheerSuccess();
    setNewTeacherName('');
    setAlertFeedback(`تَمَّتْ إِضَافَةُ الْمُعَلِّمِ (${newTeacherName.trim()}) بِنَجَاحٍ!`);
    loadAll();
    onRefreshData?.();
    setTimeout(() => setAlertFeedback(''), 4000);
  };

  const handleDeleteTeacher = (id: string, name: string) => {
    if (window.confirm(`هَلْ أَنْتَ مُتَأَكِّدٌ مِنْ حَذْفِ حِسَابِ الْمُعَلِّمِ «${name}»؟`)) {
      deleteTeacher(id);
      sounds.playClick();
      loadAll();
      onRefreshData?.();
    }
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudentName.trim()) return;

    addStudent({
      name: newStudentName.trim(),
      heroType: newStudentGender,
      avatar: newStudentGender === 'girl' ? '👧' : '👦',
      pin: newStudentPin.trim() || '123'
    });

    sounds.playCheerSuccess();
    setNewStudentName('');
    setAlertFeedback(`تَمَّتْ إِضَافَةُ التِّلْمِيذِ (${newStudentName.trim()}) بِنَجَاحٍ!`);
    loadAll();
    onRefreshData?.();
    setTimeout(() => setAlertFeedback(''), 4000);
  };

  const handleDeleteStudent = (id: string, name: string) => {
    if (window.confirm(`هَلْ تُرِيدُ حَذْفَ التِّلْمِيذِ «${name}» نِهَائِيّاً؟`)) {
      deleteStudent(id);
      sounds.playClick();
      loadAll();
      onRefreshData?.();
    }
  };

  const handleSaveConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const updated: SupervisorConfig = {
      ...config,
      adminName: adminName.trim(),
      adminPin: adminPin.trim() || '2025',
      adminPhone: adminPhone.trim()
    };
    saveSupervisorConfig(updated);
    sounds.playCheerSuccess();
    setAlertFeedback('تَمَّ حِفْظُ إِعْدَادَاتِ الْمُشْرِفِ وَالْمُطَوِّرِ بِنَجَاحٍ! 🔐');
    loadAll();
    setTimeout(() => setAlertFeedback(''), 4000);
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;

    addAnnouncement({
      senderName: config.adminName,
      senderRole: 'supervisor',
      message: broadcastText.trim(),
      badge: 'تَنْبِيهٌ إِدَارِيٌّ عَامٌّ'
    });

    sounds.playCheerSuccess();
    setBroadcastText('');
    setAlertFeedback('تَمَّ إِرْسَالُ الإِعْلَانِ الْعَامِّ لِجَمِيعِ التَّلَامِيذِ وَالْمُعَلِّمِينَ! 📢');
    loadAll();
    onRefreshData?.();
    setTimeout(() => setAlertFeedback(''), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-4 border-purple-600 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Banner */}
        <div className="bg-gradient-to-r from-purple-800 via-indigo-800 to-purple-900 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-3 bg-white/20 rounded-2xl text-2xl shadow">🛠️</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black">قِسْمُ الْمُشْرِفِ وَالْمُطَوِّرِ الْعَامِّ</h2>
                <span className="text-[11px] bg-amber-400 text-slate-900 font-black px-2 py-0.5 rounded-full">
                  صَلَاحِيَاتٌ خَاصَّةٌ
                </span>
              </div>
              <p className="text-xs text-purple-200 font-bold mt-0.5">
                مُنْشِئُ وَمُطَوِّرُ الْمَنَصَّةِ: {config.adminName} (واتساب: {config.adminPhone})
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

        {/* Navigation Tabs */}
        <div className="grid grid-cols-4 bg-purple-50 p-2 border-b border-purple-200 text-xs font-black">
          <button
            type="button"
            onClick={() => setActiveTab('teachers')}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'teachers' ? 'bg-purple-700 text-white shadow' : 'text-purple-900 hover:bg-purple-100'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>إِدَارَةُ الْمُعَلِّمِينَ ({teachers.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('students')}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'students' ? 'bg-purple-700 text-white shadow' : 'text-purple-900 hover:bg-purple-100'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>إِدَارَةُ التَّلَامِيذِ ({students.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('broadcast')}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'broadcast' ? 'bg-purple-700 text-white shadow' : 'text-purple-900 hover:bg-purple-100'
            }`}
          >
            <Send className="w-4 h-4" />
            <span>بَثُّ الإِعْلَانَاتِ 📢</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('config')}
            className={`py-2.5 rounded-xl transition flex items-center justify-center gap-1.5 ${
              activeTab === 'config' ? 'bg-purple-700 text-white shadow' : 'text-purple-900 hover:bg-purple-100'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>إِعْدَادَاتُ السِّرِّ 🔐</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-stone-50">
          {alertFeedback && (
            <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-800 rounded-2xl text-xs font-black flex items-center gap-2 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>{alertFeedback}</span>
            </div>
          )}

          {/* TAB 1: TEACHERS MANAGEMENT */}
          {activeTab === 'teachers' && (
            <div className="space-y-5">
              {/* Add Teacher Card */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                <h3 className="text-sm font-black text-stone-800 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-purple-600" />
                  <span>إِضَافَةُ مُعَلِّمٍ جَدِيدٍ لِلْمَنَصَّةِ:</span>
                </h3>

                <form onSubmit={handleAddTeacher} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  <input
                    type="text"
                    value={newTeacherName}
                    onChange={e => setNewTeacherName(e.target.value)}
                    placeholder="اسْمُ الْمُعَلِّمِ (مَثَلاً: أ. أحمد)..."
                    className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-purple-600"
                  />
                  <input
                    type="text"
                    value={newTeacherClass}
                    onChange={e => setNewTeacherClass(e.target.value)}
                    placeholder="الْفَصْلُ (الصف الثالث - أ)"
                    className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900"
                  />
                  <input
                    type="text"
                    value={newTeacherPin}
                    onChange={e => setNewTeacherPin(e.target.value)}
                    placeholder="كَلِمَةُ الْمُرُورِ (1234)"
                    className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900"
                  />
                  <button
                    type="submit"
                    className="py-2 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-xl shadow transition active:scale-95"
                  >
                    ➕ حِفْظُ الْمُعَلِّمِ
                  </button>
                </form>
              </div>

              {/* Teachers List */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                <h3 className="text-sm font-black text-stone-800 flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-600" />
                  <span>الْمُعَلِّمُونَ الْمُسَجَّلُونَ فِي الْمَنَصَّةِ:</span>
                </h3>

                <div className="divide-y divide-stone-100">
                  {teachers.map(t => (
                    <div key={t.id} className="py-3 flex items-center justify-between gap-3">
                      <div>
                        <div className="font-bold text-xs text-stone-900 flex items-center gap-2">
                          <span>👨‍🏫 {t.name}</span>
                          <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-2 py-0.5 rounded-md">
                            {t.className}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500 font-semibold mt-0.5">
                          كَلِمَةُ الْمُرُورِ (PIN): <span className="font-mono text-purple-700 font-bold">{t.pin}</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteTeacher(t.id, t.name)}
                        className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                        title="حذف المعلم"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STUDENTS MANAGEMENT */}
          {activeTab === 'students' && (
            <div className="space-y-5">
              {/* Add Student Card */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                <h3 className="text-sm font-black text-stone-800 flex items-center gap-2">
                  <UserPlus className="w-4 h-4 text-emerald-600" />
                  <span>إِضَافَةُ تِلْمِيذٍ جَدِيدٍ:</span>
                </h3>

                <form onSubmit={handleAddStudent} className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                  <input
                    type="text"
                    value={newStudentName}
                    onChange={e => setNewStudentName(e.target.value)}
                    placeholder="اسْمُ التِّلْمِيذِ (مَثَلاً: مَالِك)..."
                    className="px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-emerald-600"
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
                  <button
                    type="submit"
                    className="py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs rounded-xl shadow transition active:scale-95"
                  >
                    ➕ حِفْظُ التِّلْمِيذِ
                  </button>
                </form>
              </div>

              {/* Students Table */}
              <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
                <h3 className="text-sm font-black text-stone-800 flex items-center gap-2">
                  <Users className="w-4 h-4 text-sky-600" />
                  <span>جَمِيعُ التَّلَامِيذِ الْمُسَجَّلِينَ ({students.length}):</span>
                </h3>

                <div className="divide-y divide-stone-100 max-h-80 overflow-y-auto">
                  {students.map(s => {
                    const liveMatch = liveStudents.find(o => 
                      (s.id && o.id === s.id) || 
                      (o.name && s.name && o.name.trim().toLowerCase() === s.name.trim().toLowerCase())
                    );
                    const isOnline = !!liveMatch;

                    return (
                      <div key={s.id} className={`py-2.5 px-2 rounded-xl transition flex items-center justify-between gap-3 ${isOnline ? 'bg-emerald-50/70 border border-emerald-200' : ''}`}>
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <span className="text-2xl">{s.avatar}</span>
                            {isOnline && (
                              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 rounded-full border-2 border-white animate-pulse" />
                            )}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-stone-900 flex items-center gap-2">
                              <span>{s.name}</span>
                              <span className="text-[10px] text-stone-400 font-mono">PIN: {s.pin || '123'}</span>
                            </div>
                            <div className="text-[11px] text-amber-600 font-bold flex items-center gap-2">
                              <span>{s.totalStars} ⭐ نَجْمَة</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-black ${isOnline ? 'bg-emerald-200 text-emerald-800' : 'bg-stone-100 text-stone-500'}`}>
                                {isOnline ? '🟢 مُتَّصِلٌ الآنَ' : '⚪ غَيْرُ نَشِطٍ'}
                              </span>
                              {isOnline && liveMatch?.currentActivity && (
                                <span className="text-[10px] text-emerald-700 font-medium">
                                  ({liveMatch.currentActivity})
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleDeleteStudent(s.id || '', s.name)}
                          className="p-1.5 text-stone-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                          title="حذف التلميذ"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Newly connected students from other phones */}
                {(() => {
                  const unreg = liveStudents.filter(ls => 
                    !students.some(s => 
                      (s.id && ls.id === s.id) || 
                      (s.name && ls.name && s.name.trim().toLowerCase() === ls.name.trim().toLowerCase())
                    )
                  );
                  if (unreg.length === 0) return null;

                  return (
                    <div className="mt-3 p-3 bg-emerald-50 rounded-xl border-2 border-dashed border-emerald-300">
                      <div className="text-xs font-black text-emerald-900 mb-2 flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                        <span>أَبْطَالٌ مُتَّصِلُونَ الآنَ مِنْ هَوَاتِفَ أُخْرَى ({unreg.length}):</span>
                      </div>
                      <div className="space-y-1.5">
                        {unreg.map(u => (
                          <div key={u.id} className="bg-white p-2 rounded-lg border border-emerald-200 flex items-center justify-between text-xs">
                            <div className="flex items-center gap-2">
                              <span>{u.avatar || '👦'}</span>
                              <span className="font-bold text-stone-800">{u.name}</span>
                              <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded-full">
                                🟢 مُتَّصِلٌ ({u.currentActivity || 'يَتَعَلَّمُ'})
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                addStudent({
                                  name: u.name,
                                  heroType: u.heroType || (u.isGirl ? 'girl' : 'boy'),
                                  avatar: u.avatar || (u.isGirl ? '👧' : '👦'),
                                  pin: '123'
                                });
                                sounds.playCheerSuccess();
                                loadAll();
                                refreshLivePresence();
                                onRefreshData?.();
                              }}
                              className="px-2.5 py-0.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-bold"
                            >
                              ➕ حِفْظٌ
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

          {/* TAB 3: BROADCAST ANNOUNCEMENTS */}
          {activeTab === 'broadcast' && (
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
              <h3 className="text-sm font-black text-stone-800 flex items-center gap-2">
                <Send className="w-4 h-4 text-purple-600" />
                <span>إِرْسَالُ بَيَانٍ أَوْ إِعْلَانٍ عَامٍّ لِجَمِيعِ الْمُسْتَخْدِمِينَ:</span>
              </h3>

              <form onSubmit={handleSendBroadcast} className="space-y-3">
                <textarea
                  value={broadcastText}
                  onChange={e => setBroadcastText(e.target.value)}
                  placeholder="اكْتُبْ إِعْلَانَكَ الرَّسْمِيَّ هُنَا (يَظْهَرُ لِكُلِّ الْمُعَلِّمِينَ وَالتَّلَامِيذِ)..."
                  className="w-full p-3 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900 focus:outline-none focus:border-purple-600 h-24 resize-none"
                />
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-black text-xs rounded-xl shadow flex items-center gap-1.5 transition active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>بَثُّ الإِعْلَانِ الْعَامِّ الآنَ 📢</span>
                </button>
              </form>

              <div className="pt-3 border-t border-stone-100 space-y-2">
                <h4 className="text-xs font-black text-stone-700">سِجِلُّ الإِعْلَانَاتِ السَّابِقَةِ:</h4>
                <div className="space-y-2">
                  {announcements.map(ann => (
                    <div key={ann.id} className="p-3 bg-stone-50 border border-stone-200 rounded-xl text-xs space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-bold text-purple-900">
                        <span>{ann.senderName} ({ann.badge})</span>
                        <span className="text-stone-400">{ann.date}</span>
                      </div>
                      <p className="text-stone-700 font-medium">{ann.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SUPERVISOR CONFIG */}
          {activeTab === 'config' && (
            <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
              <h3 className="text-sm font-black text-stone-800 flex items-center gap-2">
                <Settings className="w-4 h-4 text-purple-600" />
                <span>إِعْدَادَاتُ حِسَابِ الْمُشْرِفِ وَكَلِمَةِ السِّرِّ:</span>
              </h3>

              <form onSubmit={handleSaveConfig} className="space-y-3 max-w-md">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">اسْمُ الْمُشْرِفِ وَالْمُطَوِّرِ:</label>
                  <input
                    type="text"
                    value={adminName}
                    onChange={e => setAdminName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">كَلِمَةُ سِرِّ الْمُشْرِفِ (PIN):</label>
                  <input
                    type="password"
                    value={adminPin}
                    onChange={e => setAdminPin(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">رَقْمُ الْوَاتْسَاب لِلتَّوَاصُلِ:</label>
                  <input
                    type="text"
                    value={adminPhone}
                    onChange={e => setAdminPhone(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-bold text-stone-900"
                  />
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-purple-700 hover:bg-purple-800 text-white font-black text-xs rounded-xl shadow transition active:scale-95"
                >
                  حِفْظُ الإِعْدَادَاتِ 💾
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
