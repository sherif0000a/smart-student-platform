import React, { useState, useEffect } from 'react';
import { User, Sparkles, Trophy, BookOpen, Calculator, Award, Shield, KeyRound, UserCheck, GraduationCap, ChevronLeft, Lock } from 'lucide-react';
import { sounds } from '../utils/audio';
import { UserRole, UserProfile, TeacherAccount } from '../types';
import { getStudentsList, getTeachersList, getSupervisorConfig, addStudent, setActiveSession } from '../utils/authStorage';

interface LoginModalProps {
  isOpen: boolean;
  onLoginSuccess: (role: UserRole, account: UserProfile | TeacherAccount | { name: string; role: 'supervisor' }) => void;
}

const AVATARS = [
  { id: 'hero-boy', icon: '👦', label: 'بَطَلٌ' },
  { id: 'hero-girl', icon: '👧', label: 'بَطَلَةٌ' },
  { id: 'lion', icon: '🦁', label: 'الأَسَدُ' },
  { id: 'rocket', icon: '🚀', label: 'رَائِدٌ' },
  { id: 'star', icon: '🌟', label: 'نَجْمٌ' },
  { id: 'crown', icon: '👑', label: 'تَاجٌ' },
  { id: 'dolphin', icon: '🐬', label: 'دُلْفِينٌ' },
  { id: 'falcon', icon: '🦅', label: 'صَقْرٌ' }
];

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onLoginSuccess
}) => {
  const [activeTab, setActiveTab] = useState<UserRole>('student');
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [teachers, setTeachers] = useState<TeacherAccount[]>([]);

  // Student Form State
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [isNewStudentMode, setIsNewStudentMode] = useState<boolean>(false);
  const [newStudentName, setNewStudentName] = useState<string>('');
  const [newStudentIsGirl, setNewStudentIsGirl] = useState<boolean>(false);
  const [newStudentAvatar, setNewStudentAvatar] = useState<string>('🦁');
  const [studentPin, setStudentPin] = useState<string>('');

  // Teacher Form State
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('');
  const [teacherPin, setTeacherPin] = useState<string>('');

  // Supervisor Form State
  const [supervisorPin, setSupervisorPin] = useState<string>('');

  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      const stuList = getStudentsList();
      const teaList = getTeachersList();
      setStudents(stuList);
      setTeachers(teaList);
      if (stuList.length > 0 && !selectedStudentId) {
        setSelectedStudentId(stuList[0].id || '');
      }
      if (teaList.length > 0 && !selectedTeacherId) {
        setSelectedTeacherId(teaList[0].id);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle Student Login
  const handleStudentLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isNewStudentMode) {
      const cleanName = newStudentName.trim();
      if (!cleanName || cleanName.length < 2) {
        setErrorMessage('مِنْ فَضْلِكَ اكْتُبِ اسْمَكَ الْكَرِيمَ (حَرْفَيْنِ عَلَى الأَقَلِّ)!');
        sounds.playHint();
        return;
      }
      const created = addStudent({
        name: cleanName,
        heroType: newStudentIsGirl ? 'girl' : 'boy',
        avatar: newStudentAvatar,
        pin: studentPin || '123'
      });
      sounds.playCheerSuccess();
      setActiveSession({ role: 'student', user: created, loginTime: new Date().toISOString() });
      onLoginSuccess('student', created);
      return;
    }

    const currentStudent = students.find(s => s.id === selectedStudentId);
    if (!currentStudent) {
      setErrorMessage('اخْتَرْ حِسَابَ التِّلْمِيذِ لِلْمُتَابَعَةِ!');
      sounds.playHint();
      return;
    }

    // Check PIN (if student has a pin set, verify it, or default 123)
    if (currentStudent.pin && studentPin && studentPin.trim() !== currentStudent.pin.trim()) {
      setErrorMessage('كَلِمَةُ الْمُرُورِ غَيْرُ صَحِيحَةٍ! (الافْتِرَاضِيَّةُ: 123)');
      sounds.playHint();
      return;
    }

    sounds.playCheerSuccess();
    setActiveSession({ role: 'student', user: currentStudent, loginTime: new Date().toISOString() });
    onLoginSuccess('student', currentStudent);
  };

  // Handle Teacher Login
  const handleTeacherLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const currentTeacher = teachers.find(t => t.id === selectedTeacherId);
    if (!currentTeacher) {
      setErrorMessage('مِنْ فَضْلِكَ اخْتَرْ اسْمَ الْمُعَلِّمِ!');
      sounds.playHint();
      return;
    }

    if (teacherPin.trim() !== currentTeacher.pin.trim()) {
      setErrorMessage('كَلِمَةُ مُرُورِ الْمُعَلِّمِ غَيْرُ صَحِيحَةٍ! (الافْتِرَاضِيَّةُ: 1234)');
      sounds.playHint();
      return;
    }

    sounds.playCheerSuccess();
    setActiveSession({ role: 'teacher', user: currentTeacher, loginTime: new Date().toISOString() });
    onLoginSuccess('teacher', currentTeacher);
  };

  // Handle Supervisor Login
  const handleSupervisorLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    const supervisorConfig = getSupervisorConfig();
    if (supervisorPin.trim() !== supervisorConfig.adminPin.trim()) {
      setErrorMessage('كَلِمَةُ مُرُورِ الْمُشْرِفِ غَيْرُ صَحِيحَةٍ! (الافْتِرَاضِيَّةُ: 2025)');
      sounds.playHint();
      return;
    }

    sounds.playCheerSuccess();
    const supervisorUser = {
      name: supervisorConfig.adminName,
      role: 'supervisor' as const
    };
    setActiveSession({ role: 'supervisor', user: supervisorUser, loginTime: new Date().toISOString() });
    onLoginSuccess('supervisor', supervisorUser);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden flex flex-col">
        {/* Banner */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 text-white text-center space-y-2 relative">
          <div className="text-4xl animate-bounce">🎓🌟</div>
          <h1 className="text-2xl md:text-3xl font-black tracking-wide">مَنَصَّةُ الطَّالِبِ الْمُجْتَهِدِ</h1>
          <p className="text-amber-100 text-xs font-bold">
            بَوَّابَةُ التَّفَوُّقِ لِلصَّفِّ الثَّالِثِ الِابْتِدَائِيِّ (رِيَاضِيَّاتٌ • إِنْجِلِيزِيٌّ • عَرَبِيٌّ)
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-3 bg-stone-100 p-1.5 border-b border-stone-200">
          <button
            type="button"
            onClick={() => {
              setActiveTab('student');
              setErrorMessage('');
              sounds.playClick();
            }}
            className={`py-2.5 px-2 rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'student'
                ? 'bg-amber-500 text-white shadow-md scale-102'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span>🎒</span>
            <span>دُخُولُ التِّلْمِيذِ</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('teacher');
              setErrorMessage('');
              sounds.playClick();
            }}
            className={`py-2.5 px-2 rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'teacher'
                ? 'bg-sky-600 text-white shadow-md scale-102'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span>👨‍🏫</span>
            <span>دُخُولُ الْمُعَلِّمِ</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('supervisor');
              setErrorMessage('');
              sounds.playClick();
            }}
            className={`py-2.5 px-2 rounded-2xl font-black text-xs md:text-sm flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'supervisor'
                ? 'bg-purple-700 text-white shadow-md scale-102'
                : 'text-stone-600 hover:bg-stone-200'
            }`}
          >
            <span>🛠️</span>
            <span>الْمُشْرِفُ (شريف)</span>
          </button>
        </div>

        {/* Tab 1: Student Login */}
        {activeTab === 'student' && (
          <form onSubmit={handleStudentLogin} className="p-6 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-stone-100">
              <span className="text-xs font-black text-stone-800 flex items-center gap-1.5">
                <span>🌟</span>
                <span>اخْتَرْ بَطَلَكَ لِبَدْءِ التَّعَلُّمِ:</span>
              </span>
              <button
                type="button"
                onClick={() => {
                  setIsNewStudentMode(!isNewStudentMode);
                  setErrorMessage('');
                  sounds.playClick();
                }}
                className="text-xs font-bold text-amber-600 hover:text-amber-700 underline"
              >
                {isNewStudentMode ? '← اخْتِيَارُ تِلْمِيذٍ مُسَجَّلٍ' : '➕ إِضَافَةُ بَطَلٍ جَدِيدٍ'}
              </button>
            </div>

            {!isNewStudentMode ? (
              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2.5 max-h-48 overflow-y-auto p-1">
                  {students.map(stu => (
                    <button
                      key={stu.id}
                      type="button"
                      onClick={() => {
                        setSelectedStudentId(stu.id || '');
                        sounds.playButtonTap();
                      }}
                      className={`p-3 rounded-2xl border-2 flex items-center gap-2.5 transition-all text-right ${
                        selectedStudentId === stu.id
                          ? 'border-amber-500 bg-amber-50 text-amber-950 font-black shadow-sm ring-2 ring-amber-300'
                          : 'border-stone-200 hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      <span className="text-2xl">{stu.avatar}</span>
                      <div className="truncate">
                        <div className="font-bold text-sm truncate">{stu.name}</div>
                        <div className="text-[11px] text-amber-600 font-bold">{stu.totalStars} ⭐ نَجْمَة</div>
                      </div>
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">
                    كَلِمَةُ مُرُورِ التِّلْمِيذِ (اخْتِيَارِيٌّ / افْتِرَاضِيٌّ 123):
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={studentPin}
                      onChange={e => setStudentPin(e.target.value)}
                      placeholder="123"
                      className="w-full px-4 py-2.5 bg-stone-50 border-2 border-stone-200 rounded-xl text-stone-800 font-bold focus:outline-none focus:border-amber-500"
                    />
                    <KeyRound className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-3 animate-fadeIn">
                <div className="space-y-1">
                  <label className="block text-xs font-black text-stone-800">اسْمُ الْبَطَلِ الْجَدِيدِ:</label>
                  <input
                    type="text"
                    value={newStudentName}
                    onChange={e => setNewStudentName(e.target.value)}
                    placeholder="مِثْلَ: مَالِك، نُور، سَارَة، يُوسُف..."
                    className="w-full px-4 py-2.5 bg-stone-50 border-2 border-stone-200 rounded-xl text-stone-900 font-bold focus:outline-none focus:border-amber-500"
                    autoFocus
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setNewStudentIsGirl(false);
                      setNewStudentAvatar('🦁');
                      sounds.playClick();
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border-2 transition ${
                      !newStudentIsGirl ? 'border-sky-500 bg-sky-50 text-sky-900 font-black' : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    👦 بَطَلٌ (وَلَدٌ)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewStudentIsGirl(true);
                      setNewStudentAvatar('🌟');
                      sounds.playClick();
                    }}
                    className={`py-2 rounded-xl text-xs font-bold border-2 transition ${
                      newStudentIsGirl ? 'border-pink-500 bg-pink-50 text-pink-900 font-black' : 'border-stone-200 text-stone-600'
                    }`}
                  >
                    👧 بَطَلَةٌ (بِنْتٌ)
                  </button>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">اخْتَرْ رَمْزَكَ:</label>
                  <div className="grid grid-cols-4 gap-1.5">
                    {AVATARS.map(av => (
                      <button
                        key={av.id}
                        type="button"
                        onClick={() => {
                          setNewStudentAvatar(av.icon);
                          sounds.playButtonTap();
                        }}
                        className={`p-2 rounded-xl border-2 text-center transition ${
                          newStudentAvatar === av.icon ? 'border-amber-500 bg-amber-50 ring-2 ring-amber-300' : 'border-stone-200'
                        }`}
                      >
                        <span className="text-xl block">{av.icon}</span>
                        <span className="text-[10px] font-bold text-stone-600">{av.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-stone-700">كَلِمَةُ مُرُورٍ خَفِيفَةٌ لِلْحِمَايَةِ (مَثَلاً 123):</label>
                  <input
                    type="password"
                    value={studentPin}
                    onChange={e => setStudentPin(e.target.value)}
                    placeholder="123"
                    className="w-full px-4 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-bold"
                  />
                </div>
              </div>
            )}

            {errorMessage && <p className="text-rose-600 text-xs font-bold animate-shake">{errorMessage}</p>}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-600 text-white font-black text-base rounded-2xl shadow-lg transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <span>انْطَلِقْ لِمُغَامَرَةِ التَّفَوُّقِ! 🚀</span>
            </button>
          </form>
        )}

        {/* Tab 2: Teacher Login */}
        {activeTab === 'teacher' && (
          <form onSubmit={handleTeacherLogin} className="p-6 space-y-4">
            <div className="bg-sky-50 border border-sky-200 p-3 rounded-2xl flex items-center gap-2.5">
              <span className="text-2xl">👨‍🏫</span>
              <p className="text-xs font-bold text-sky-900 leading-relaxed">
                مَرْحَبًا بِكَ يَا مُعَلِّمَنَا الْفَاضِلَ! سَجِّلْ دُخُولَكَ لِمُتَابَعَةِ تَلاَمِيذِ فَصْلِكَ وَإِرْسَالِ التَّحَدِّيَاتِ.
              </p>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-stone-800">اخْتَرْ اسْمَ الْمُعَلِّمِ:</label>
              <select
                value={selectedTeacherId}
                onChange={e => setSelectedTeacherId(e.target.value)}
                className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-300 rounded-2xl font-bold text-stone-900 focus:outline-none focus:border-sky-500"
              >
                {teachers.map(t => (
                  <option key={t.id} value={t.id}>
                    {t.name} ({t.className})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-stone-800">
                كَلِمَةُ مُرُورِ الْمُعَلِّمِ (الافْتِرَاضِيَّةُ: 1234):
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={teacherPin}
                  onChange={e => {
                    setTeacherPin(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="أَدْخِلْ كَلِمَةَ الْمُرُورِ..."
                  className="w-full px-4 py-3 bg-stone-50 border-2 border-stone-300 rounded-2xl font-bold text-stone-900 focus:outline-none focus:border-sky-500"
                  autoFocus
                />
                <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-3.5" />
              </div>
            </div>

            {errorMessage && <p className="text-rose-600 text-xs font-bold">{errorMessage}</p>}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-700 hover:to-indigo-700 text-white font-black text-base rounded-2xl shadow-lg transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <span>دُخُولُ لَوْحَةِ الْمُعَلِّمِ 👨‍🏫</span>
            </button>
          </form>
        )}

        {/* Tab 3: Supervisor Login */}
        {activeTab === 'supervisor' && (
          <form onSubmit={handleSupervisorLogin} className="p-6 space-y-4">
            <div className="bg-purple-50 border border-purple-200 p-3 rounded-2xl flex items-center gap-2.5">
              <Shield className="w-6 h-6 text-purple-700 shrink-0" />
              <div>
                <h4 className="text-xs font-black text-purple-950">قِسْمُ الْمُشْرِفِ وَالْمُطَوِّرِ الْعَامِّ</h4>
                <p className="text-[11px] text-purple-800">
                  خَاصٌّ بِالأُسْتَاذِ شَرِيف عَسْقَلَانِي لإِدَارَةِ الْمُعَلِّمِينَ وَالتَّلاَمِيذِ وَالإِعْدَادَاتِ.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-black text-stone-800">
                كَلِمَةُ سِرِّ الْمُشْرِفِ الْعَامِّ (الافْتِرَاضِيَّةُ: 2025):
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={supervisorPin}
                  onChange={e => {
                    setSupervisorPin(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="أَدْخِلْ الرَّمْزَ السِّرِّيَّ لِلْمُشْرِفِ..."
                  className="w-full px-4 py-3 bg-stone-50 border-2 border-purple-300 rounded-2xl font-bold text-stone-900 focus:outline-none focus:border-purple-600"
                  autoFocus
                />
                <KeyRound className="w-4 h-4 text-purple-400 absolute left-3 top-3.5" />
              </div>
            </div>

            <p className="text-[11px] text-stone-500 font-medium">
              💡 تَنْبِيهٌ: الْمُعَلِّمُونَ لَا يَمْلِكُونَ صَلَاحِيَّةَ دُخُولِ هَذَا الْقِسْمِ.
            </p>

            {errorMessage && <p className="text-rose-600 text-xs font-bold">{errorMessage}</p>}

            <button
              type="submit"
              className="w-full py-3.5 bg-gradient-to-r from-purple-700 via-indigo-700 to-purple-800 hover:from-purple-800 hover:to-indigo-800 text-white font-black text-base rounded-2xl shadow-lg transition-transform hover:scale-[1.02] active:scale-95 flex items-center justify-center gap-2"
            >
              <span>دُخُولُ لَوْحَةِ تَحَكُّمِ الْمُشْرِفِ 🛠️</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
