import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { sounds, speakArabic } from '../utils/audio';
import { allUnits } from '../data';
import { ClassroomStudent, HeroOfTheDayAnnouncement, UserProfile } from '../types';
import { 
  X, 
  Tv, 
  Trophy, 
  Users, 
  Printer, 
  Share2, 
  Sparkles, 
  CheckCircle2, 
  BookOpen, 
  Volume2, 
  Plus, 
  RotateCcw,
  GraduationCap,
  Crown,
  Star,
  Award,
  Search,
  UserPlus
} from 'lucide-react';

interface TeacherClassroomHubModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLesson: (lesson: any) => void;
  profile?: UserProfile;
  onHeroAnnounced?: (announcement: HeroOfTheDayAnnouncement) => void;
}

const DEFAULT_STUDENTS: ClassroomStudent[] = [
  {
    id: 'student-1',
    name: 'سَلْمَى أَحْمَد',
    heroType: 'girl',
    stars: 480,
    completedLessonsCount: 12,
    accuracy: 96,
    lastActive: 'الْيَوْمَ',
    isHeroOfDay: false
  },
  {
    id: 'student-2',
    name: 'زِيَاد مَحْمُود',
    heroType: 'boy',
    stars: 390,
    completedLessonsCount: 10,
    accuracy: 92,
    lastActive: 'الْيَوْمَ',
    isHeroOfDay: false
  },
  {
    id: 'student-3',
    name: 'مَرْيَم عُمَر',
    heroType: 'girl',
    stars: 520,
    completedLessonsCount: 14,
    accuracy: 98,
    lastActive: 'أَمْسِ',
    isHeroOfDay: false
  },
  {
    id: 'student-4',
    name: 'أَحْمَد خَالِد',
    heroType: 'boy',
    stars: 340,
    completedLessonsCount: 9,
    accuracy: 89,
    lastActive: 'مُنْذُ يَوْمَيْنِ',
    isHeroOfDay: false
  },
  {
    id: 'student-5',
    name: 'نُور حُسَيْن',
    heroType: 'girl',
    stars: 450,
    completedLessonsCount: 11,
    accuracy: 94,
    lastActive: 'الْيَوْمَ',
    isHeroOfDay: false
  }
];

export const TeacherClassroomHubModal: React.FC<TeacherClassroomHubModalProps> = ({
  isOpen,
  onClose,
  onSelectLesson,
  profile,
  onHeroAnnounced
}) => {
  const [activeTab, setActiveTab] = useState<'smartboard' | 'tournament' | 'worksheets' | 'invite' | 'students'>('students');
  
  // Team Tournament State for Classroom Smartboard
  const [team1Score, setTeam1Score] = useState(0);
  const [team2Score, setTeam2Score] = useState(0);
  const [team1Name, setTeam1Name] = useState('فَرِيقُ النُّجُومِ ⭐');
  const [team2Name, setTeam2Name] = useState('فَرِيقُ الأَبْطَالِ 🦅');
  
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Student Roster & Hero of the Day state
  const [students, setStudents] = useState<ClassroomStudent[]>(() => {
    try {
      const saved = localStorage.getItem('arabic_students_roster_v2');
      if (saved) return JSON.parse(saved);
    } catch {}
    return DEFAULT_STUDENTS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentType, setNewStudentType] = useState<'boy' | 'girl'>('boy');
  const [coronatingStudent, setCoronatingStudent] = useState<ClassroomStudent | null>(null);
  const [heroMessage, setHeroMessage] = useState('مُبَارَكٌ لَكَ يَا بَطَلَ الْيَوْمِ! الأُسْتَاذُ شَرِيف عَسْقَلَانِي فَخُورٌ بِاجْتِهَادِكَ فِي حَلِّ التَّدْرِيبَاتِ وَإِتْقَانِ اللُّغَةِ الْعَرَبِيَّةِ 🌟');
  const [bonusStars, setBonusStars] = useState(50);
  const [successToast, setSuccessToast] = useState('');

  // Sync current active profile into roster
  useEffect(() => {
    if (!profile?.name) return;
    setStudents((prev) => {
      const existsIndex = prev.findIndex((s) => s.name === profile.name);
      if (existsIndex >= 0) {
        const updated = [...prev];
        updated[existsIndex] = {
          ...updated[existsIndex],
          stars: profile.totalStars,
          completedLessonsCount: profile.completedLessons.length,
          heroType: profile.heroType
        };
        try {
          localStorage.setItem('arabic_students_roster_v2', JSON.stringify(updated));
        } catch {}
        return updated;
      } else {
        const currentStudentEntry: ClassroomStudent = {
          id: `student-active-${Date.now()}`,
          name: profile.name,
          heroType: profile.heroType,
          stars: profile.totalStars,
          completedLessonsCount: profile.completedLessons.length,
          accuracy: 95,
          lastActive: 'الآنَ',
          isHeroOfDay: false
        };
        const updated = [currentStudentEntry, ...prev];
        try {
          localStorage.setItem('arabic_students_roster_v2', JSON.stringify(updated));
        } catch {}
        return updated;
      }
    });
  }, [profile?.name, profile?.totalStars, profile?.completedLessons.length, profile?.heroType]);

  if (!isOpen) return null;

  const handleAddStudent = () => {
    if (!newStudentName.trim()) return;
    const newEntry: ClassroomStudent = {
      id: `student-${Date.now()}`,
      name: newStudentName.trim(),
      heroType: newStudentType,
      stars: 100,
      completedLessonsCount: 3,
      accuracy: 90,
      lastActive: 'الْيَوْمَ',
      isHeroOfDay: false
    };
    const updated = [newEntry, ...students];
    setStudents(updated);
    setNewStudentName('');
    sounds.playSuccess();
    try {
      localStorage.setItem('arabic_students_roster_v2', JSON.stringify(updated));
    } catch {}
  };

  const handleOpenCoronate = (student: ClassroomStudent) => {
    sounds.playClick();
    setCoronatingStudent(student);
    setHeroMessage(`أَحْسَنْتَ يَا بَطَلَنَا ${student.name}! تَمَّ اخْتِيَارُكَ بَطَلَ الْيَوْمِ لِتَمَيُّزِكَ فِي مَنْهَجِ اللُّغَةِ الْعَرَبِيَّةِ مَعَ الأُسْتَاذِ شَرِيف عَسْقَلَانِي! 🌟`);
  };

  const handleConfirmHeroOfTheDay = () => {
    if (!coronatingStudent) return;
    sounds.playFanfare();
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });

    const announcement: HeroOfTheDayAnnouncement = {
      id: `hero-${Date.now()}`,
      studentName: coronatingStudent.name,
      heroType: coronatingStudent.heroType,
      crownedAt: new Date().toLocaleDateString('ar-EG'),
      teacherName: 'الأُسْتَاذ شَرِيف عَسْقَلَانِي',
      congratulationMessage: heroMessage,
      bonusStars: bonusStars,
      isClaimed: false
    };

    // Store in localStorage for student startup detection
    try {
      localStorage.setItem('arabic_hero_of_the_day_announcement', JSON.stringify(announcement));
    } catch {}

    // Update students list
    const updated = students.map((s) => ({
      ...s,
      isHeroOfDay: s.id === coronatingStudent.id
    }));
    setStudents(updated);
    try {
      localStorage.setItem('arabic_students_roster_v2', JSON.stringify(updated));
    } catch {}

    if (onHeroAnnounced) {
      onHeroAnnounced(announcement);
    }

    setCoronatingStudent(null);
    setSuccessToast(`🎉 تَمَّ تَتْوِيجُ «${coronatingStudent.name}» بَطَلاً لِلْيَوْمِ! سَتَظْهَرُ رِسَالَةُ التَّهْنِئَةِ لِلطَّالِبِ عِنْدَ فَتْحِ اللَّعْبَةِ 👑`);
    setTimeout(() => setSuccessToast(''), 5000);
  };

  const filteredStudents = students.filter((s) => 
    s.name.toLowerCase().includes(searchQuery.trim().toLowerCase())
  );

  const handleScore = (team: 1 | 2, points: number) => {
    sounds.playCheerSuccess();
    if (team === 1) {
      setTeam1Score((prev) => Math.max(0, prev + points));
    } else {
      setTeam2Score((prev) => Math.max(0, prev + points));
    }
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { x: team === 1 ? 0.3 : 0.7, y: 0.6 }
    });
  };

  const handleResetScores = () => {
    sounds.playClick();
    setTeam1Score(0);
    setTeam2Score(0);
  };

  const handleCopyTeacherInvite = () => {
    sounds.playClick();
    const message = `📚 سَادَتِي الْمُعَلِّمِينَ وَأَوْلِيَاءَ الأُمُورِ الأَفَاضِل:\n\nيسرنا مشاركتكم منصة «مغامرة اللغة العربية التفاعلية» للصف الثالث الابتدائي (الفصل الدراسي الأول - كتاب الوزارة الرسمي).\n⭐ تشمل الأناشيد مشكولة بالكامل، القواعد والأساليب، والتحديات الإملائية، والمعلم الروبوت التفاعلي.\n\n🔗 رابط المنصة المباشر:\n${window.location.origin}\n\nفكرة وإعداد: الأستاذ شريف عسقلاني 🌟`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(message);
      setCopiedInvite(true);
      setTimeout(() => setCopiedInvite(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-4 border-indigo-200 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="relative bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-800 text-white p-5 sm:p-6">
          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="absolute top-4 left-4 w-9 h-9 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition focus:outline-none"
            title="إغلاق"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-2xl border border-white/20">
              🏫
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-white">
                  حَقِيبَةُ الْمُعَلِّمِ وَالسَّبُّورَةُ التَّفَاعُلِيَّةُ
                </h2>
                <span className="bg-amber-400 text-amber-950 text-[11px] font-black px-2.5 py-0.5 rounded-full">
                  لِلْفَصْلِ الْمَدْرَسِيِّ
                </span>
              </div>
              <p className="text-indigo-200 text-xs sm:text-sm font-bold">
                أَدَوَاتٌ ذَكِيَّةٌ لِمُتَابَعَةِ التَّلَامِيذِ وَعَرْضِ الْمَنْهَجِ وَإِدَارَةِ الْمُنَافَسَاتِ
              </p>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-5 overflow-x-auto pb-1 text-sm scrollbar-none">
            <button
              onClick={() => { sounds.playClick(); setActiveTab('students'); }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'students'
                  ? 'bg-amber-400 text-amber-950 shadow-md'
                  : 'bg-indigo-600/60 text-white hover:bg-indigo-600'
              }`}
            >
              <Crown className="w-4 h-4 text-amber-900" />
              <span>قَائِمَةُ التَّلَامِيذِ وَبَطَلُ الْيَوْمِ 👑</span>
            </button>
            <button
              onClick={() => { sounds.playClick(); setActiveTab('smartboard'); }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'smartboard'
                  ? 'bg-white text-indigo-900 shadow-md'
                  : 'bg-indigo-600/60 text-white hover:bg-indigo-600'
              }`}
            >
              <Tv className="w-4 h-4" />
              <span>عَرْضُ السَّبُّورَةِ التَّفَاعُلِيَّةِ</span>
            </button>
            <button
              onClick={() => { sounds.playClick(); setActiveTab('tournament'); }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'tournament'
                  ? 'bg-white text-indigo-900 shadow-md'
                  : 'bg-indigo-600/60 text-white hover:bg-indigo-600'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>مُسَابَقَةُ الْفَصْلِ (الْفِرَقُ)</span>
            </button>
            <button
              onClick={() => { sounds.playClick(); setActiveTab('worksheets'); }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'worksheets'
                  ? 'bg-white text-indigo-900 shadow-md'
                  : 'bg-indigo-600/60 text-white hover:bg-indigo-600'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>أَوْرَاقُ الْعَمَلِ لِلطِّبَاعَةِ</span>
            </button>
            <button
              onClick={() => { sounds.playClick(); setActiveTab('invite'); }}
              className={`px-4 py-2 rounded-xl text-xs font-black transition whitespace-nowrap flex items-center gap-1.5 ${
                activeTab === 'invite'
                  ? 'bg-white text-indigo-900 shadow-md'
                  : 'bg-indigo-600/60 text-white hover:bg-indigo-600'
              }`}
            >
              <Share2 className="w-4 h-4" />
              <span>دَعْوَةُ الْمُعَلِّمِينَ وَالأَهَالِي</span>
            </button>
          </div>
        </div>

        {/* Tab 0: Students Roster & Hero of the Day */}
        {activeTab === 'students' && (
          <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {successToast && (
              <div className="p-3 bg-emerald-100 border border-emerald-300 text-emerald-950 font-black text-xs rounded-xl flex items-center gap-2 animate-bounce">
                <Sparkles className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successToast}</span>
              </div>
            )}

            {/* Quick Stats Banner */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 p-3.5 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-black">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-stone-500 font-bold block">إِجْمَالِي التَّلَامِيذِ</span>
                  <span className="text-xl font-black text-indigo-950">{students.length} تِلْمِيذٍ</span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 p-3.5 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-black">
                  <Crown className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-stone-500 font-bold block">بَطَلُ الْيَوْمِ الْحَالِي</span>
                  <span className="text-sm font-black text-amber-950">
                    {students.find((s) => s.isHeroOfDay)?.name || 'لَمْ يُحَدَّدْ بَعْد'}
                  </span>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 p-3.5 rounded-2xl flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-black">
                  <Star className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] text-stone-500 font-bold block">مُتَوَسِّطُ النُّجُومِ</span>
                  <span className="text-xl font-black text-emerald-950">
                    {Math.round(students.reduce((acc, s) => acc + s.stars, 0) / (students.length || 1))} ⭐
                  </span>
                </div>
              </div>
            </div>

            {/* Search & Add Bar */}
            <div className="flex flex-col sm:flex-row gap-2.5 items-center justify-between">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-stone-400 absolute right-3 top-3" />
                <input
                  type="text"
                  placeholder="ابْحَثْ عَنِ اسْمِ التِّلْمِيذِ..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pr-9 pl-3 py-2 text-xs font-bold border border-stone-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none"
                />
              </div>

              {/* Add Student Quick Form */}
              <div className="flex items-center gap-1.5 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="اسْمُ التِّلْمِيذِ الْجَدِيدِ..."
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  className="px-3 py-2 text-xs font-bold border border-stone-300 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:outline-none flex-1 sm:w-48"
                />
                <select
                  value={newStudentType}
                  onChange={(e) => setNewStudentType(e.target.value as any)}
                  className="py-2 px-2 text-xs font-bold border border-stone-300 rounded-xl bg-white focus:outline-none"
                >
                  <option value="boy">ولد 👦</option>
                  <option value="girl">بنت 👧</option>
                </select>
                <button
                  onClick={handleAddStudent}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-xl text-xs font-black flex items-center gap-1 shadow transition shrink-0"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>إِضَافَةٌ</span>
                </button>
              </div>
            </div>

            {/* Students List Table */}
            <div className="border border-stone-200 rounded-2xl overflow-hidden shadow-xs">
              <div className="bg-stone-50 px-4 py-2.5 text-xs font-black text-stone-600 grid grid-cols-12 gap-2 border-b border-stone-200 text-right">
                <div className="col-span-4 sm:col-span-3">التِّلْمِيذُ</div>
                <div className="col-span-2 sm:col-span-2 text-center">النُّجُومُ</div>
                <div className="col-span-3 sm:col-span-2 text-center">الدُّرُوسُ</div>
                <div className="hidden sm:block sm:col-span-2 text-center">الدِّقَّةُ</div>
                <div className="col-span-3 sm:col-span-3 text-center">إِشْعَارُ بَطَلِ الْيَوْمِ</div>
              </div>

              <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto">
                {filteredStudents.map((student) => (
                  <div 
                    key={student.id} 
                    className={`px-4 py-3 grid grid-cols-12 gap-2 items-center text-xs font-bold text-right transition ${
                      student.isHeroOfDay ? 'bg-amber-50/70 border-r-4 border-amber-400' : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="col-span-4 sm:col-span-3 flex items-center gap-2">
                      <span className="text-lg">
                        {student.heroType === 'girl' ? '👧' : '👦'}
                      </span>
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="font-black text-stone-900">{student.name}</span>
                          {student.isHeroOfDay && (
                            <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-1.5 py-0.2 rounded-md flex items-center gap-0.5">
                              <Crown className="w-3 h-3" />
                              <span>بَطَلُ الْيَوْمِ</span>
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] text-stone-400 block">{student.lastActive}</span>
                      </div>
                    </div>

                    <div className="col-span-2 sm:col-span-2 text-center font-black text-amber-600">
                      {student.stars} ⭐
                    </div>

                    <div className="col-span-3 sm:col-span-2 text-center text-indigo-900">
                      {student.completedLessonsCount} دَرْساً
                    </div>

                    <div className="hidden sm:block sm:col-span-2 text-center">
                      <span className="bg-emerald-100 text-emerald-800 text-[11px] font-black px-2 py-0.5 rounded-full">
                        {student.accuracy}%
                      </span>
                    </div>

                    <div className="col-span-3 sm:col-span-3 text-center">
                      <button
                        onClick={() => handleOpenCoronate(student)}
                        className={`px-2.5 py-1.5 rounded-xl font-black text-[11px] transition shadow-2xs flex items-center justify-center gap-1 w-full ${
                          student.isHeroOfDay
                            ? 'bg-amber-500 text-white shadow-md'
                            : 'bg-amber-100 hover:bg-amber-200 text-amber-950 border border-amber-300'
                        }`}
                      >
                        <Crown className="w-3.5 h-3.5" />
                        <span>{student.isHeroOfDay ? 'مُتَوَّجٌ 👑' : 'تَتْوِيجٌ 👑'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Modal for Coronating Hero of the Day */}
            {coronatingStudent && (
              <div className="p-4 bg-gradient-to-r from-amber-50 via-yellow-50 to-amber-100 border-2 border-amber-300 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Crown className="w-5 h-5 text-amber-600" />
                    <h4 className="font-black text-sm sm:text-base text-amber-950">
                      تَتْوِيجُ «{coronatingStudent.name}» بَطَلاً لِلْيَوْمِ 👑
                    </h4>
                  </div>
                  <button
                    onClick={() => setCoronatingStudent(null)}
                    className="text-stone-400 hover:text-stone-700 p-1"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-xs text-stone-600 font-bold">
                  سَتَصِلُ هَذِهِ التَّهْنِئَةُ كَنَافِذَةِ تَكْرِيمٍ احْتِفَالِيَّةٍ مُبَاشَرَةً لِلطَّالِبِ عِنْدَ فَتْحِ اللَّعْبَةِ مَعَ صَوْتٍ تَشْجِيعِيٍّ وَمُكَافَأَةِ نُجُومٍ!
                </p>

                <div className="space-y-1">
                  <label className="text-[11px] font-black text-stone-700 block">
                    نَصُّ رِسَالَةِ التَّهْنِئَةِ:
                  </label>
                  <textarea
                    rows={2}
                    value={heroMessage}
                    onChange={(e) => setHeroMessage(e.target.value)}
                    className="w-full p-2 text-xs font-bold border border-amber-300 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-amber-400"
                  />
                </div>

                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <label className="text-xs font-black text-amber-950">
                      مُكَافَأَةُ النُّجُومِ الإِضَافِيَّةِ:
                    </label>
                    <select
                      value={bonusStars}
                      onChange={(e) => setBonusStars(Number(e.target.value))}
                      className="px-2 py-1 text-xs font-black border border-amber-300 rounded-lg bg-white"
                    >
                      <option value={30}>+30 ⭐</option>
                      <option value={50}>+50 ⭐</option>
                      <option value={100}>+100 ⭐</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setCoronatingStudent(null)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold text-stone-600 hover:bg-stone-200"
                    >
                      إِلْغَاءٌ
                    </button>
                    <button
                      onClick={handleConfirmHeroOfTheDay}
                      className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white font-black text-xs px-4 py-2 rounded-xl shadow-md flex items-center gap-1.5 transition active:scale-95"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>إِرْسَالُ إِشْعَارِ التَّهْنِئَةِ «بَطَلُ الْيَوْمِ» 🚀</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 1: Smartboard Quick Lesson Launcher */}
        {activeTab === 'smartboard' && (
          <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
              <div className="space-y-1">
                <span className="text-xs font-black text-amber-900 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>وَضْعُ الْعَرْضِ الْمَدْرَسِيِّ لِلشَّاشَاتِ الْكَبِيرَةِ</span>
                </span>
                <p className="text-xs text-stone-600 font-bold">
                  اخْتَرْ أَيَّ دَرْسٍ لِعَرْضِ النَّصِّ مَشْكُولاً بِخَطٍّ كَبِيرٍ وَتَشْغِيلِ الصَّوْتِ التَّفَاعُلِيِّ أَمَامَ التَّلَامِيذِ.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {allUnits.flatMap((u) => u.lessons).map((lesson) => (
                <div
                  key={lesson.id}
                  className="border border-stone-200 hover:border-indigo-400 bg-stone-50/50 hover:bg-indigo-50/30 rounded-2xl p-3.5 transition flex items-center justify-between text-right"
                >
                  <div className="space-y-1">
                    <span className="text-[11px] font-black text-indigo-700 block">
                      {lesson.categoryLabel}
                    </span>
                    <h4 className="font-black text-sm text-stone-900">{lesson.title}</h4>
                    <span className="text-[11px] text-stone-500 font-bold block">
                      {lesson.challenges.length} تَحَدِّيَاتٍ تَفَاعُلِيَّةٍ
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      sounds.playClick();
                      onSelectLesson(lesson);
                      onClose();
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs px-3 py-2 rounded-xl shadow-xs transition flex items-center gap-1 shrink-0"
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>عَرْضُ الدَّرْسِ 🖥️</span>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 2: Team Tournament Smartboard */}
        {activeTab === 'tournament' && (
          <div className="p-5 sm:p-6 space-y-5">
            <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 text-right">
              <h3 className="font-black text-indigo-950 text-base mb-1">
                تَحْكِيمُ مُسَابَقَاتِ الْفَصْلِ بَيْنَ الْفِرَقِ 🏆
              </h3>
              <p className="text-xs font-bold text-stone-600">
                قَسِّمِ الْفَصْلَ إِلَى فَرِيقَيْنِ، وَأَضِفِ النِّقَاطَ لِكُلِّ إِجَابَةٍ صَحِيحَةٍ مَعَ مُؤَثِّرَاتٍ صَوْتِيَّةٍ مَلِيئَةٍ بِالْحَمَاسِ!
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Team 1 */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-300 rounded-3xl p-5 text-center shadow-sm space-y-3">
                <input
                  type="text"
                  value={team1Name}
                  onChange={(e) => setTeam1Name(e.target.value)}
                  className="font-black text-base text-amber-950 text-center bg-white/70 border border-amber-200 rounded-xl py-1 px-3 w-full"
                />
                <div className="text-5xl font-black text-amber-600 py-2">
                  {team1Score}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleScore(1, 10)}
                    className="bg-amber-500 hover:bg-amber-600 text-white font-black text-xs py-2 px-4 rounded-xl shadow transition"
                  >
                    +10 نِقَاطٍ ⭐
                  </button>
                  <button
                    onClick={() => handleScore(1, 20)}
                    className="bg-amber-600 hover:bg-amber-700 text-white font-black text-xs py-2 px-4 rounded-xl shadow transition"
                  >
                    +20 نُقْطَةً 🌟
                  </button>
                </div>
              </div>

              {/* Team 2 */}
              <div className="bg-gradient-to-br from-purple-50 to-indigo-50 border-2 border-purple-300 rounded-3xl p-5 text-center shadow-sm space-y-3">
                <input
                  type="text"
                  value={team2Name}
                  onChange={(e) => setTeam2Name(e.target.value)}
                  className="font-black text-base text-purple-950 text-center bg-white/70 border border-purple-200 rounded-xl py-1 px-3 w-full"
                />
                <div className="text-5xl font-black text-purple-600 py-2">
                  {team2Score}
                </div>
                <div className="flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleScore(2, 10)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-black text-xs py-2 px-4 rounded-xl shadow transition"
                  >
                    +10 نِقَاطٍ ⭐
                  </button>
                  <button
                    onClick={() => handleScore(2, 20)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs py-2 px-4 rounded-xl shadow transition"
                  >
                    +20 نُقْطَةً 🌟
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleResetScores}
                className="flex items-center gap-1.5 text-stone-500 hover:text-stone-700 font-bold text-xs py-1.5 px-3 rounded-lg border border-stone-200 hover:bg-stone-100 transition"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>إِعَادَةُ ضَبْطِ نَتِيجَةِ الْمُسَابَقَةِ</span>
              </button>
            </div>
          </div>
        )}

        {/* Tab 3: Printable Worksheets */}
        {activeTab === 'worksheets' && (
          <div className="p-5 sm:p-6 space-y-4 max-h-[60vh] overflow-y-auto">
            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-2">
              <div className="space-y-0.5">
                <h4 className="font-black text-stone-900 text-sm">
                  أَوْرَاقُ التَّقْيِيمِ الأُسْبُوعِيِّ لِلصَّفِّ الثَّالِثِ
                </h4>
                <p className="text-xs text-stone-500 font-bold">
                  تَدْرِيبَاتٌ نَمُوذَجِيَّةٌ مُطَابِقَةٌ لِمُوَاصَفَاتِ اخْتِبَارَاتِ وَزَارَةِ التَّرْبِيَةِ وَالتَّعْلِيمِ.
                </p>
              </div>
              <button
                onClick={() => window.print()}
                className="bg-stone-800 hover:bg-stone-900 text-white font-black text-xs px-4 py-2 rounded-xl flex items-center gap-1.5 shadow transition"
              >
                <Printer className="w-4 h-4" />
                <span>طِبَاعَةُ الْوَرَقَةِ الْحَالِيَّةِ 🖨️</span>
              </button>
            </div>

            <div className="border border-stone-200 rounded-2xl p-4 space-y-3 bg-white text-right">
              <div className="border-b pb-2 flex justify-between items-center text-xs font-black text-stone-600">
                <span>اخْتِبَارُ الْوَحْدَةِ الأُولَى: أَصْحَابُ الْفَضْلِ</span>
                <span>الزَّمَنُ: 45 دَقِيقَة</span>
              </div>
              <div className="space-y-2">
                <div className="font-bold text-xs text-stone-800">
                  السُّؤَالُ الأَوَّلُ: نَشِيدُ «أَصْحَابِ الْمِهَنِ»
                </div>
                <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded-xl border border-stone-100 font-bold">
                  «مِصْرُ تَعْلُو بِالْحِرَفْ ... ذَاكَ بَنَّاءٌ يَبْنِي دَاراً ... ذَاكَ نَجَّارٌ يَقْطَعُ أَشْجَاراً»
                </p>
                <ul className="text-xs text-stone-700 space-y-1 font-bold">
                  <li>• اسْتَخْرِجْ كَلِمَةً بِهَا مَدٌّ بِالأَلِفِ: (....................)</li>
                  <li>• مَا فَضْلُ الْبَنَّاءِ فِي الْمُجْتَمَعِ كَمَا وَرَدَ فِي النَّشِيدِ؟ (....................)</li>
                </ul>
              </div>

              <div className="space-y-2 pt-2 border-t">
                <div className="font-bold text-xs text-stone-800">
                  السُّؤَالُ الثَّانِي: الأَسَالِيبُ وَالتَّرَاكِيبُ
                </div>
                <ul className="text-xs text-stone-700 space-y-1 font-bold">
                  <li>• أَكْمِلْ بِأَدَاةِ اسْتِفْهَامٍ مُنَاسِبَةٍ (مَنْ، مَتَى، أَيْنَ، كَمْ)</li>
                  <li>• حَوِّلِ الْجُمْلَةَ إِلَى أُسْلُوبِ نَفْيٍ بِـ (لَمْ) وَ (لَنْ)</li>
                  <li>• اسْتَخْرِجْ حُرُوفَ الْجَرِّ وَحُرُوفَ الْعَطْفِ مِنَ النَّصِّ</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Teacher & Parent WhatsApp Share Invitation */}
        {activeTab === 'invite' && (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200 rounded-2xl p-5 text-right space-y-3">
              <h3 className="font-black text-indigo-950 text-base">
                نَصُّ الدَّعْوَةِ الرَّسْمِيَّةِ لِجُرُوبَاتِ الْفَصْلِ وَالْمَدْرَسَةِ 📲
              </h3>
              <p className="text-stone-700 text-xs sm:text-sm font-bold leading-relaxed bg-white border border-indigo-100 rounded-xl p-4 select-all">
                «سَادَتِي الْمُعَلِّمِينَ وَأَوْلِيَاءَ الأُمُورِ الأَفَاضِل:
                <br />
                نُهْدِيكُمْ رَابِطَ (مَغَامَرَةِ اللُّغَةِ الْعَرَبِيَّةِ) لِتَلَامِيذِ الصَّفِّ الثَّالِثِ الابْتِدَائِيِّ - إِهْدَاءٌ لِلْبَطَلِ مَالِك وَزُمَلائِهِ فِي الْفَصْلِ.
                <br />
                اللُّعْبَةُ مَبْنِيَّةٌ كَامِلاً عَلَى كِتَابِ الْوَزَارَةِ الرَّسْمِيِّ، وَتَحْتَوِي عَلَى أَنَاشِيدَ مُشَكَّلَةٍ، وَتَحَدِّيَاتِ نَحْوٍ وَإِمْلَاءٍ، وَرُوبُوتٍ ذَكِيٍّ مُعَلِّمٍ يُجِيبُ عَلَى كَافَّةِ الأَسْئِلَةِ.»
              </p>

              <button
                onClick={handleCopyTeacherInvite}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-black text-xs sm:text-sm py-3 rounded-xl shadow transition flex items-center justify-center gap-2"
              >
                {copiedInvite ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-200" />
                    <span>تَمَّ نَسْخُ رِسَالَةِ الدَّعْوَةِ بِنَجَاحٍ! ✅</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>نَسْخُ رِسَالَةِ الدَّعْوَةِ لِلْمُعَلِّمِينَ وَالأَهَالِي 📋</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Footer Attribution */}
        <div className="bg-stone-50 border-t border-stone-200 px-5 py-3 text-center text-xs font-bold text-stone-500">
          مُعْتَمَدٌ كَأَدَاةٍ تَعْلِيمِيَّةٍ مُسَانِدَةٍ لِكِتَابِ الْوَزَارَةِ - إِعْدَادٌ: الأُسْتَاذُ شَرِيف عَسْقَلَانِي 🌟
        </div>

      </div>
    </div>
  );
};
