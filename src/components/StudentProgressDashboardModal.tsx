import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Trophy, 
  Star, 
  BookOpen, 
  Calculator, 
  Sparkles, 
  Award, 
  CheckCircle2, 
  Flame, 
  TrendingUp, 
  PieChart as PieIcon, 
  BarChart3, 
  Compass, 
  Layers, 
  ArrowRight, 
  RotateCcw,
  Zap,
  Target
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { UserProfile, SubjectType } from '../types';
import { mathChapters } from '../curriculum/math/mathCurriculum';
import { englishUnits } from '../curriculum/english/englishCurriculum';
import { arabicUnits } from '../curriculum/arabic/arabicCurriculum';
import { sounds } from '../utils/audio';

interface StudentProgressDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSelectSubject?: (subject: SubjectType) => void;
  onOpenArabicQuiz?: (unitId?: number) => void;
  onOpenGames?: () => void;
}

export const StudentProgressDashboardModal: React.FC<StudentProgressDashboardModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSelectSubject,
  onOpenArabicQuiz,
  onOpenGames
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'math' | 'english' | 'arabic'>('overview');

  if (!isOpen) return null;

  // 1. Math Statistics
  let totalMathLessons = 0;
  mathChapters.forEach((ch) => {
    totalMathLessons += ch.lessons.length;
  });
  const completedMathLessons = profile.completedLessons.filter((id) => id.startsWith('math-') || id.startsWith('m')).length;
  const mathPercentage = Math.min(100, Math.round((completedMathLessons / Math.max(1, totalMathLessons)) * 100));

  // 2. English Statistics
  let totalEnglishLessons = 0;
  englishUnits.forEach((u) => {
    totalEnglishLessons += u.lessons.length;
  });
  const completedEnglishLessons = profile.completedLessons.filter((id) => id.startsWith('eng-') || id.startsWith('english')).length;
  const englishPercentage = Math.min(100, Math.round((completedEnglishLessons / Math.max(1, totalEnglishLessons)) * 100));

  // 3. Arabic Statistics
  let totalArabicLessons = 0;
  arabicUnits.forEach((u) => {
    totalArabicLessons += u.lessons.length;
  });
  const completedArabicLessons = profile.completedLessons.filter(
    (id) => (id.startsWith('u1-') || id.startsWith('u2-') || id.startsWith('u3-') || id.startsWith('arabic')) && !id.startsWith('math') && !id.startsWith('eng')
  ).length;
  const arabicPercentage = Math.min(100, Math.round((completedArabicLessons / Math.max(1, totalArabicLessons)) * 100));

  // Total Completed Lessons
  const totalCompleted = profile.completedLessons.length;
  const totalLessonsAll = totalMathLessons + totalEnglishLessons + totalArabicLessons;
  const overallPercentage = Math.min(100, Math.round((totalCompleted / Math.max(1, totalLessonsAll)) * 100));

  // Data for BarChart (Progress by Subject)
  const barChartData = [
    {
      subject: 'الرياضيات 🧮',
      مكتمل: completedMathLessons,
      متبقي: Math.max(0, totalMathLessons - completedMathLessons),
      نسبة_الإنجاز: mathPercentage,
      total: totalMathLessons
    },
    {
      subject: 'Connect 3 🇬🇧',
      مكتمل: completedEnglishLessons,
      متبقي: Math.max(0, totalEnglishLessons - completedEnglishLessons),
      نسبة_الإنجاز: englishPercentage,
      total: totalEnglishLessons
    },
    {
      subject: 'اللغة العربية 📖',
      مكتمل: completedArabicLessons,
      متبقي: Math.max(0, totalArabicLessons - completedArabicLessons),
      نسبة_الإنجاز: arabicPercentage,
      total: totalArabicLessons
    }
  ];

  // Data for RadarChart (Skills Assessment)
  const radarData = [
    { skill: 'العمليات الحسابية', value: Math.max(35, Math.min(100, 30 + mathPercentage * 0.7)) },
    { skill: 'المفردات الإنجليزية', value: Math.max(35, Math.min(100, 30 + englishPercentage * 0.7)) },
    { skill: 'الفهم القرائي', value: Math.max(40, Math.min(100, 35 + arabicPercentage * 0.65)) },
    { skill: 'القواعد والأساليب', value: Math.max(35, Math.min(100, 30 + arabicPercentage * 0.7)) },
    { skill: 'سرعة الحل والتركيز', value: Math.max(50, Math.min(100, 45 + (profile.solvedChallenges.length || 0) * 3)) },
    { skill: 'تحديات الأذكياء', value: Math.max(40, Math.min(100, 40 + (profile.totalStars > 200 ? 55 : (profile.totalStars / 4)))) }
  ];

  // Data for PieChart (Effort Distribution)
  const pieData = [
    { name: 'الرياضيات', value: Math.max(1, completedMathLessons || 1), color: '#10b981' },
    { name: 'الإنجليزي Connect', value: Math.max(1, completedEnglishLessons || 1), color: '#0284c7' },
    { name: 'اللغة العربية', value: Math.max(1, completedArabicLessons || 1), color: '#f59e0b' }
  ];

  // Learning Trajectory Data (AreaChart)
  const areaData = [
    { stage: 'البداية', stars: 20, points: 50 },
    { stage: 'الوحدة 1', stars: Math.max(40, Math.round(profile.totalStars * 0.3)), points: 150 },
    { stage: 'الوحدة 2', stars: Math.max(80, Math.round(profile.totalStars * 0.6)), points: 320 },
    { stage: 'الوحدة 3', stars: Math.max(120, Math.round(profile.totalStars * 0.85)), points: 480 },
    { stage: 'المستوى الحالي', stars: profile.totalStars, points: profile.totalStars * 5 }
  ];

  const COLORS = ['#10b981', '#0284c7', '#f59e0b'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-indigo-950/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border-4 border-indigo-200 overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-indigo-700 via-sky-600 to-emerald-600 text-white p-5 flex items-center justify-between shadow-md relative overflow-hidden">
          <div className="absolute top-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
          
          <div className="relative z-10 flex items-center gap-3.5">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center text-3xl shadow-inner border border-white/30">
              📊
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-white/25 text-white text-[11px] font-black px-2.5 py-0.5 rounded-full">
                  لَوْحَةُ الإِنْجَازِ وَالتَّقَدُّمِ
                </span>
                <span className="text-yellow-300 text-xs font-black flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-300" />
                  <span>{profile.totalStars} نَجْمَةً</span>
                </span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-white">
                تَقْرِيرُ إِبْدَاعِ الْبَطَلِ: {profile.name}
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="relative z-10 p-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white transition active:scale-95"
            title="إغلاق اللوحة"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 p-2 flex items-center justify-center gap-2 overflow-x-auto">
          <button
            onClick={() => {
              setActiveTab('overview');
              sounds.playClick();
            }}
            className={`px-4 py-2 rounded-xl font-black text-xs md:text-sm flex items-center gap-1.5 transition-all ${
              activeTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-300'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>نَظْرَةٌ شَامِلَةٌ وَرُسُومٌ بَيَانِيَّةٌ</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('math');
              sounds.playClick();
            }}
            className={`px-4 py-2 rounded-xl font-black text-xs md:text-sm flex items-center gap-1.5 transition-all ${
              activeTab === 'math'
                ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-300'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>الرِّيَاضِيَّاتُ (10 فُصُولٍ)</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('english');
              sounds.playClick();
            }}
            className={`px-4 py-2 rounded-xl font-black text-xs md:text-sm flex items-center gap-1.5 transition-all ${
              activeTab === 'english'
                ? 'bg-sky-600 text-white shadow-sm ring-2 ring-sky-300'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>Connect 3 وَالْقَامُوسُ</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('arabic');
              sounds.playClick();
            }}
            className={`px-4 py-2 rounded-xl font-black text-xs md:text-sm flex items-center gap-1.5 transition-all ${
              activeTab === 'arabic'
                ? 'bg-amber-600 text-white shadow-sm ring-2 ring-amber-300'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>📖</span>
            <span>اللُّغَةُ الْعَرَبِيَّةُ وَالاخْتِبَارَاتُ</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
          
          {/* 1. Fast Metrics Row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 p-3.5 rounded-2xl">
              <div className="flex items-center justify-between text-amber-600 mb-1">
                <span className="text-[11px] font-black">النُّجُومُ الذَّهَبِيَّةُ</span>
                <Star className="w-4 h-4 fill-amber-500" />
              </div>
              <p className="text-2xl font-black text-amber-700">{profile.totalStars}</p>
              <p className="text-[10px] font-bold text-amber-600/80">نِقَاطُ التَّفَوُّقِ الْمُحَقَّقَةِ</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-200 p-3.5 rounded-2xl">
              <div className="flex items-center justify-between text-emerald-600 mb-1">
                <span className="text-[11px] font-black">الدُّرُوسُ الْمُكْتَمَلَةُ</span>
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-emerald-700">{totalCompleted} / {totalLessonsAll}</p>
              <p className="text-[10px] font-bold text-emerald-600/80">مِنْ إِجْمَالِيِّ الْمَحَطَّاتِ</p>
            </div>

            <div className="bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-200 p-3.5 rounded-2xl">
              <div className="flex items-center justify-between text-sky-600 mb-1">
                <span className="text-[11px] font-black">مُعَدَّلُ الإِنْجَازِ الْعَامُّ</span>
                <Target className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-sky-700">{overallPercentage}%</p>
              <p className="text-[10px] font-bold text-sky-600/80">نِسْبَةُ إِتْقَانِ الْمِنْهَاجِ</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 p-3.5 rounded-2xl">
              <div className="flex items-center justify-between text-purple-600 mb-1">
                <span className="text-[11px] font-black">الأَوْسِمَةُ الْمُفَعَّلَةُ</span>
                <Award className="w-4 h-4" />
              </div>
              <p className="text-2xl font-black text-purple-700">{profile.unlockedBadges.length} أَوْسِمَةٍ</p>
              <p className="text-[10px] font-bold text-purple-600/80">أَوْسِمَةُ الشَّجَاعَةِ وَالتَّفَوُّقِ</p>
            </div>
          </div>

          {/* TAB 1: OVERVIEW WITH RECHARTS */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              
              {/* Main BarChart: Subject Completion & Comparison */}
              <div className="bg-white border-2 border-slate-200 rounded-3xl p-4 md:p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
                  <div>
                    <h3 className="text-base md:text-lg font-black text-slate-900 flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-indigo-600" />
                      <span>مُعَدَّلُ إِتْقَانِ وَإِنْجَازِ كُلِّ مَادَّةٍ عَلَى حِدَة (Recharts)</span>
                    </h3>
                    <p className="text-xs font-semibold text-slate-500">
                      مُقَارَنَةٌ بَصَرِيَّةٌ بَيْنَ الدُّرُوسِ الْمُكْتَمَلَةِ وَالْمُتَبَقِّيَةِ لِكُلِّ مَادَّةٍ دِرَاسِيَّةٍ
                    </p>
                  </div>
                  <span className="text-xs font-black bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-xl border border-indigo-200 self-start sm:self-auto">
                    الصَّفُّ الثَّالِثُ الِابْتِدَائِيُّ 🎒
                  </span>
                </div>

                <div className="h-64 sm:h-72 w-full" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={barChartData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="subject" tick={{ fill: '#334155', fontWeight: 'bold', fontSize: 12 }} />
                      <YAxis tick={{ fill: '#64748b', fontSize: 11 }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1e293b',
                          borderColor: '#334155',
                          borderRadius: '1rem',
                          color: '#fff',
                          fontWeight: 'bold',
                          direction: 'rtl'
                        }}
                      />
                      <Legend />
                      <Bar dataKey="مكتمل" fill="#10b981" radius={[8, 8, 0, 0]} name="المكتمل" />
                      <Bar dataKey="متبقي" fill="#cbd5e1" radius={[8, 8, 0, 0]} name="المتبقي" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Two Column Grid: Radar & Pie Charts */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. RadarChart: Academic Skills Profile */}
                <div className="bg-white border-2 border-slate-200 rounded-3xl p-4 md:p-5 shadow-xs">
                  <div className="mb-2">
                    <h3 className="text-sm md:text-base font-black text-slate-900 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-purple-600" />
                      <span>رَادَارُ مَهَارَاتِ الطَّالِبِ الشَّامِلَةِ</span>
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-500">
                      قِيَاسُ مُسْتَوَى التَّفَوُّقِ فِي الْحِسَابِ، الْقِرَاءَةِ، الْقَوَاعِدِ، وَالسُّرْعَةِ
                    </p>
                  </div>

                  <div className="h-60 w-full" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
                        <PolarGrid stroke="#e2e8f0" />
                        <PolarAngleAxis dataKey="skill" tick={{ fill: '#475569', fontSize: 10, fontWeight: 'bold' }} />
                        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 9 }} />
                        <Radar name="المهارة" dataKey="value" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.45} />
                        <Tooltip />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* 2. PieChart / Effort Breakdown */}
                <div className="bg-white border-2 border-slate-200 rounded-3xl p-4 md:p-5 shadow-xs">
                  <div className="mb-2">
                    <h3 className="text-sm md:text-base font-black text-slate-900 flex items-center gap-2">
                      <PieIcon className="w-4 h-4 text-emerald-600" />
                      <span>تَوْزِيعُ الْإِنْجَازِ بَيْنَ الْمَوَادِّ الثَّلَاثِ</span>
                    </h3>
                    <p className="text-[11px] font-semibold text-slate-500">
                      نِسْبَةُ الْحِصَصِ وَالْمَهَامِّ الْمُنْجَزَةِ فِي كُلِّ مَادَّةٍ
                    </p>
                  </div>

                  <div className="h-60 w-full" dir="ltr">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          outerRadius={75}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} (${((percent || 0) * 100).toFixed(0)}%)`}
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

              </div>

              {/* Progress Trajectory (AreaChart) */}
              <div className="bg-gradient-to-br from-indigo-50/50 to-sky-50/50 border-2 border-indigo-100 rounded-3xl p-4 md:p-5">
                <div className="mb-3">
                  <h3 className="text-sm md:text-base font-black text-indigo-950 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-orange-500" />
                    <span>مُنْحَنَى تَصَاعُدِ النُّجُومِ وَالْخِبْرَةِ التَّرَاكُمِيَّةِ</span>
                  </h3>
                  <p className="text-[11px] font-semibold text-slate-600">
                    مُعَدَّلُ حَصْدِ النُّجُومِ كُلَّمَا تَقَدَّمَ الطَّالِبُ فِي الْمَرَاحِلِ
                  </p>
                </div>

                <div className="h-44 w-full" dir="ltr">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={areaData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ff" />
                      <XAxis dataKey="stage" tick={{ fill: '#3730a3', fontSize: 11, fontWeight: 'bold' }} />
                      <YAxis tick={{ fill: '#4338ca', fontSize: 10 }} />
                      <Tooltip />
                      <Area type="monotone" dataKey="stars" stroke="#4f46e5" fill="#818cf8" fillOpacity={0.35} name="النجوم" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

            </div>
          )}

          {/* TAB 2: MATH DRILLDOWN */}
          {activeTab === 'math' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 border-2 border-emerald-300 p-4 rounded-3xl flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-emerald-950">مَنْهَجُ الرِّيَاضِيَّاتِ - 10 فُصُولٍ شَامِلَةٍ</h3>
                  <p className="text-xs font-bold text-emerald-800">
                    قَوَاعِدُ الضَّرْبِ • الْوَقْتُ الْمُنْقَضِي • الْمُحِيطُ وَالْمَسَاحَةُ • الْكُسُورُ الاعْتِيَادِيَّةُ
                  </p>
                </div>
                <div className="text-center bg-white px-4 py-2 rounded-2xl border border-emerald-200">
                  <p className="text-xs text-slate-500 font-bold">الإِنْجَازُ</p>
                  <p className="text-xl font-black text-emerald-600">{mathPercentage}%</p>
                </div>
              </div>

              {/* Chapters List Progress */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {mathChapters.map((ch) => {
                  const chCompleted = ch.lessons.filter((l) => profile.completedLessons.includes(l.id)).length;
                  const chPct = Math.round((chCompleted / ch.lessons.length) * 100);

                  return (
                    <div key={ch.id} className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-800">
                          الفصل {ch.chapterNumber}: {ch.title}
                        </span>
                        <span className="text-xs font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
                          {chPct}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-emerald-500 h-2 rounded-full transition-all" style={{ width: `${chPct}%` }}></div>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{ch.themeDescription}</p>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    sounds.playClick();
                    onSelectSubject?.('math');
                    onClose();
                  }}
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs md:text-sm px-5 py-2.5 rounded-2xl shadow-md transition active:scale-95"
                >
                  <Calculator className="w-4 h-4" />
                  <span>الانْتِقَالُ إِلَى فُصُولِ الرِّيَاضِيَّاتِ 🚀</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: ENGLISH DRILLDOWN */}
          {activeTab === 'english' && (
            <div className="space-y-4">
              <div className="bg-sky-50 border-2 border-sky-300 p-4 rounded-3xl flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-sky-950">Connect 3 & English Phonix Hub</h3>
                  <p className="text-xs font-bold text-sky-800">
                    6 مَحَطَّاتٍ شَامِلَةٍ • قَامُوسُ 1000 كَلِمَةٍ نَاطِقٌ • صَوْتِيَّاتُ ee و ea • قَوَاعِدُ الْمُحَادَثَةِ
                  </p>
                </div>
                <div className="text-center bg-white px-4 py-2 rounded-2xl border border-sky-200">
                  <p className="text-xs text-slate-500 font-bold">الإِنْجَازُ</p>
                  <p className="text-xl font-black text-sky-600">{englishPercentage}%</p>
                </div>
              </div>

              {/* Units Progress */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {englishUnits.map((u) => {
                  const uCompleted = u.lessons.filter((l) => profile.completedLessons.includes(l.id)).length;
                  const uPct = Math.round((uCompleted / u.lessons.length) * 100);

                  return (
                    <div key={u.id} className="p-3.5 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-slate-800">
                          Unit {u.unitNumber}: {u.title}
                        </span>
                        <span className="text-xs font-black text-sky-600 bg-sky-50 px-2 py-0.5 rounded-lg">
                          {uPct}%
                        </span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                        <div className="bg-sky-500 h-2 rounded-full transition-all" style={{ width: `${uPct}%` }}></div>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium line-clamp-1">{u.titleAr}</p>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    sounds.playClick();
                    onSelectSubject?.('english');
                    onClose();
                  }}
                  className="flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-black text-xs md:text-sm px-5 py-2.5 rounded-2xl shadow-md transition active:scale-95"
                >
                  <BookOpen className="w-4 h-4" />
                  <span>الانْتِقَالُ إِلَى مَنْهَجِ Connect 3 🚀</span>
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: ARABIC DRILLDOWN & QUIZZES */}
          {activeTab === 'arabic' && (
            <div className="space-y-4">
              <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-3xl flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-black text-amber-950">مَنْهَجُ اللُّغَةِ الْعَرَبِيَّةِ وَاخْتِبَارَاتُ الْوَحْدَاتِ</h3>
                  <p className="text-xs font-bold text-amber-800">
                    الْعَمَلُ وَالأَمَلُ • الأَصْدِقَاءُ وَالْقِيَمُ • عَالَمِي الصَّغِيرُ • اخْتِبَارَاتٌ قَصِيرَةٌ مَعَ تَصْحِيحٍ فَوْرِيٍّ
                  </p>
                </div>
                <div className="text-center bg-white px-4 py-2 rounded-2xl border border-amber-200">
                  <p className="text-xs text-slate-500 font-bold">الإِنْجَازُ</p>
                  <p className="text-xl font-black text-amber-600">{arabicPercentage}%</p>
                </div>
              </div>

              {/* Units and Quizzes Fast Access */}
              <div className="space-y-3">
                <p className="text-xs font-black text-slate-800">اخْتِبَارَاتُ الْوَحْدَاتِ التَّفَاعُلِيَّةِ (تصحيح وتغذية راجعة فورية):</p>
                
                {[1, 2, 3].map((uId) => {
                  const unitTitles = [
                    'اخْتِبَارُ الْوَحْدَةِ الأُولَى: العَمَلُ وَالأَمَلُ (ازرع نبتة، لوحة أدهم، الاستفهام)',
                    'اخْتِبَارُ الْوَحْدَةِ الثَّانِيَةِ: مَنْ نَكُونُ؟ (التعاون، الصحة، أسلوب النهي والنفي)',
                    'اخْتِبَارُ الْوَحْدَةِ الثَّالِثَةِ: عَالَمِي الصَّغِيرُ (البيئة، الاكتشافات، التنوين والترقيم)'
                  ];

                  return (
                    <div key={uId} className="p-4 bg-white border-2 border-amber-200 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs hover:border-amber-400 transition">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-black text-base">
                          {uId}
                        </div>
                        <div>
                          <p className="text-xs md:text-sm font-black text-slate-800">{unitTitles[uId - 1]}</p>
                          <p className="text-[11px] font-bold text-amber-700">6 أَسْئِلَةٍ شَامِلَةٍ • تَصْحِيحٌ آلِيٌّ • نُجُومٌ إِضَافِيَّةٌ ⭐</p>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          sounds.playClick();
                          onOpenArabicQuiz?.(uId);
                          onClose();
                        }}
                        className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-black text-xs px-4 py-2 rounded-xl shadow-xs transition active:scale-95 shrink-0"
                      >
                        <span>ابْدَأِ الاخْتِبَارَ 📝</span>
                      </button>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => {
                    sounds.playClick();
                    onSelectSubject?.('arabic');
                    onClose();
                  }}
                  className="flex items-center gap-2 bg-amber-600 hover:bg-amber-700 text-white font-black text-xs md:text-sm px-5 py-2.5 rounded-2xl shadow-md transition active:scale-95"
                >
                  <span>الانْتِقَالُ إِلَى دُرُوسِ اللُّغَةِ الْعَرَبِيَّةِ 🚀</span>
                </button>
              </div>
            </div>
          )}

          {/* Quick Creative Games Banner */}
          <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 text-white p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎮</span>
              <div>
                <h4 className="font-black text-sm md:text-base">هَلْ تُرِيدُ زِيَادَةَ نُجُومِكَ فِي لَوْحَةِ الإِنْجَازِ؟</h4>
                <p className="text-purple-100 text-xs font-semibold">
                  الْعَبْ أَلْعَابَ التَّحَدِّي الذَّكِيَّةَ (صَائِدُ الْكُوَيْكِبَاتِ • مُحَقِّقُ الْكَلِمَاتِ وَالأَضْدَادِ)!
                </p>
              </div>
            </div>
            <button
              onClick={() => {
                sounds.playButtonTap();
                onOpenGames?.();
                onClose();
              }}
              className="bg-amber-400 hover:bg-amber-500 text-amber-950 font-black text-xs md:text-sm px-4 py-2 rounded-xl shadow-sm transition active:scale-95 whitespace-nowrap"
            >
              افْتَحْ أَلْعَابَ الأَبْطَالِ 🚀
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
