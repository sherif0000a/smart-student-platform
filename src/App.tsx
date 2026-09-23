import React, { useState, useEffect, useRef } from 'react';
import { 
  UserProfile, 
  Lesson, 
  TeacherDailyMissions, 
  Badge, 
  SubjectType, 
  MathChapter, 
  EnglishUnit,
  UserRole,
  TeacherAccount,
  ClassroomAnnouncement
} from './types';
import { allUnits } from './data';
import { mathChapters, englishUnits } from './curriculum';
import { initialTeacherDailyMissions } from './data/spellingBank';
import { checkForNewBadges } from './utils/badgeSystem';
import { NavigationHeader } from './components/NavigationHeader';
import { SubjectSelector } from './components/SubjectSelector';
import { AdventureMap } from './components/AdventureMap';
import { LessonViewer } from './components/LessonViewer';
import { MathHubView } from './components/MathHubView';
import { MathChapterViewer } from './components/MathChapterViewer';
import { EnglishHubView } from './components/EnglishHubView';
import { EnglishUnitViewer } from './components/EnglishUnitViewer';
import { RewardGameModal } from './components/RewardGameModal';
import { EnglishDictionaryModal } from './components/EnglishDictionaryModal';
import { OnlineStudentsModal } from './components/OnlineStudentsModal';
import { LoginModal } from './components/LoginModal';
import { StudentWelcomeCelebrationModal } from './components/StudentWelcomeCelebrationModal';
import { TeacherClassroomDashboardModal } from './components/TeacherClassroomDashboardModal';
import { AdminSupervisorPanel } from './components/AdminSupervisorPanel';
import { EducationalGamesModal } from './components/EducationalGamesModal';
import { RobotTutorChat } from './components/RobotTutorChat';
import { CertificateModal } from './components/CertificateModal';
import { ProfileBadgesModal } from './components/ProfileBadgesModal';
import { BadgeCelebrationModal } from './components/BadgeCelebrationModal';
import { DailyMissionsCard } from './components/DailyMissionsCard';
import { TeacherMissionModal } from './components/TeacherMissionModal';
import { FloatingRobotButton } from './components/FloatingRobotButton';
import { MalekDedicationModal } from './components/MalekDedicationModal';
import { TeacherClassroomHubModal } from './components/TeacherClassroomHubModal';
import { AnnouncementDetailsModal } from './components/AnnouncementDetailsModal';
import { SendCertificateWhatsAppModal } from './components/SendCertificateWhatsAppModal';
import { StudentProgressDashboardModal } from './components/StudentProgressDashboardModal';
import { ArabicUnitQuizModal } from './components/ArabicUnitQuizModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { sendPresencePing } from './utils/presenceManager';
import { sounds, stopSpeaking } from './utils/audio';
import { getActiveSession, clearActiveSession, getAnnouncements, getStudentsList } from './utils/authStorage';
import { Megaphone, Volume2, Sparkles, BookOpen } from 'lucide-react';

const STORAGE_KEY = 'al_talib_al_mujtahid_hero_profile_v2';
const TEACHER_MISSIONS_KEY = 'arabic_adventure_teacher_missions_v1';
const DAILY_TASKS_KEY = 'arabic_adventure_daily_tasks_v1';

export default function App() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [currentRole, setCurrentRole] = useState<UserRole>('student');
  const [currentTeacher, setCurrentTeacher] = useState<TeacherAccount | null>(null);

  // Authentication & Management Modals
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isStudentCelebrationOpen, setIsStudentCelebrationOpen] = useState(false);
  const [isTeacherDashboardOpen, setIsTeacherDashboardOpen] = useState(false);
  const [isSupervisorPanelOpen, setIsSupervisorPanelOpen] = useState(false);
  const [isEducationalGamesOpen, setIsEducationalGamesOpen] = useState(false);

  // General App Modals
  const [isBadgesModalOpen, setIsBadgesModalOpen] = useState(false);
  const [isCertificateOpen, setIsCertificateOpen] = useState(false);
  const [isTeacherModalOpen, setIsTeacherModalOpen] = useState(false);
  const [isDedicationOpen, setIsDedicationOpen] = useState(false);
  const [isTeacherHubOpen, setIsTeacherHubOpen] = useState(false);
  const [isRewardGameOpen, setIsRewardGameOpen] = useState(false);
  const [isDictionaryOpen, setIsDictionaryOpen] = useState(false);
  const [isOnlineStudentsOpen, setIsOnlineStudentsOpen] = useState(false);
  const [isAnnouncementDetailsOpen, setIsAnnouncementDetailsOpen] = useState(false);
  const [isSendWhatsAppCertOpen, setIsSendWhatsAppCertOpen] = useState(false);
  const [isProgressDashboardOpen, setIsProgressDashboardOpen] = useState(false);
  const [isArabicQuizOpen, setIsArabicQuizOpen] = useState(false);
  const [activeQuizUnitId, setActiveQuizUnitId] = useState<number>(1);
  const [newlyUnlockedBadge, setNewlyUnlockedBadge] = useState<Badge | null>(null);

  // Subject Navigation
  const [activeSubject, setActiveSubject] = useState<SubjectType>('math');
  const [selectedMathChapter, setSelectedMathChapter] = useState<MathChapter | null>(null);
  const [selectedEnglishUnit, setSelectedEnglishUnit] = useState<EnglishUnit | null>(null);
  const [selectedArabicUnitId, setSelectedArabicUnitId] = useState<number>(1);
  const [selectedArabicLesson, setSelectedArabicLesson] = useState<Lesson | null>(null);

  // AI Chat Tutor
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInitialQuery, setChatInitialQuery] = useState('');

  // Online Presence state
  const [onlineCount, setOnlineCount] = useState<number>(1);
  const studentIdRef = useRef<string>(`student-${Math.random().toString(36).substring(2, 9)}`);

  // Classroom Announcements
  const [announcements, setAnnouncements] = useState<ClassroomAnnouncement[]>([]);

  // Teacher Daily Missions State
  const [teacherMissions, setTeacherMissions] = useState<TeacherDailyMissions>(() => {
    try {
      const saved = localStorage.getItem(TEACHER_MISSIONS_KEY);
      if (saved) return JSON.parse(saved);
    } catch {}
    return initialTeacherDailyMissions;
  });

  // Daily Completed Tasks state
  const [dailyCompletedTasks, setDailyCompletedTasks] = useState<string[]>(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const saved = localStorage.getItem(`${DAILY_TASKS_KEY}_${today}`);
      if (saved) return JSON.parse(saved);
    } catch {}
    return [];
  });

  // Check Session on initial load: app MUST start on Login Screen if no active session
  useEffect(() => {
    setAnnouncements(getAnnouncements());
    const session = getActiveSession();
    if (session) {
      setCurrentRole(session.role);
      if (session.role === 'student') {
        setProfile(session.user as UserProfile);
      } else if (session.role === 'teacher') {
        setCurrentTeacher(session.user as TeacherAccount);
      }
      setIsLoginModalOpen(false);
    } else {
      // Must open on login modal as explicitly requested
      setIsLoginModalOpen(true);
    }
  }, []);

  // Presence Heartbeat Loop (Multi-device, Server, & Cross-tab sync) - Optimized for mobile performance
  const activityRef = useRef('');
  useEffect(() => {
    if (activeSubject === 'math') {
      activityRef.current = selectedMathChapter ? `رياضيات: فصل ${selectedMathChapter.chapterNumber}` : 'منهج الرياضيات (10 فصول)';
    } else if (activeSubject === 'english') {
      activityRef.current = selectedEnglishUnit ? `English: Unit ${selectedEnglishUnit.unitNumber}` : 'English Connect 3';
    } else {
      activityRef.current = selectedArabicLesson ? `لغة عربية: ${selectedArabicLesson.title}` : 'خريطة اللغة العربية';
    }
  }, [activeSubject, selectedMathChapter, selectedEnglishUnit, selectedArabicLesson]);

  useEffect(() => {
    const studentName = profile?.name || 'مَالِك';
    const isGirl = profile?.heroType === 'girl';
    const avatar = profile?.avatar || (isGirl ? '👧' : '👦');
    const stars = profile?.totalStars || 15;

    const sendHeartbeat = async () => {
      try {
        const liveList = await sendPresencePing({
          studentId: studentIdRef.current,
          name: studentName,
          isGirl,
          avatar,
          stars,
          subject: activeSubject === 'math' ? 'الرِّيَاضِيَّاتُ' : activeSubject === 'english' ? 'اللُّغَةُ الإِنْجِلِيزِيَّةُ' : 'اللُّغَةُ الْعَرَبِيَّةُ',
          currentActivity: activityRef.current
        });
        if (liveList && liveList.length > 0) {
          setOnlineCount(liveList.length);
        }
      } catch {
        setOnlineCount(prev => Math.max(1, prev));
      }
    };

    sendHeartbeat();
    const interval = setInterval(sendHeartbeat, 15000);
    return () => clearInterval(interval);
  }, [profile?.name, profile?.avatar, profile?.heroType, profile?.totalStars, activeSubject]);

  // Login handler
  const handleLoginSuccess = (role: UserRole, account: UserProfile | TeacherAccount | { name: string; role: 'supervisor' }) => {
    setCurrentRole(role);
    setIsLoginModalOpen(false);

    if (role === 'student') {
      const studentAcc = account as UserProfile;
      setProfile(studentAcc);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(studentAcc));
      setIsStudentCelebrationOpen(true);
    } else if (role === 'teacher') {
      const teacherAcc = account as TeacherAccount;
      setCurrentTeacher(teacherAcc);
      setIsTeacherDashboardOpen(true);
    } else if (role === 'supervisor') {
      setIsSupervisorPanelOpen(true);
    }
  };

  const handleSwitchAccount = () => {
    stopSpeaking();
    clearActiveSession();
    setIsLoginModalOpen(true);
  };

  // Switch Subject
  const handleSelectSubject = (subject: SubjectType) => {
    stopSpeaking();
    sounds.playClick();
    setActiveSubject(subject);
    setSelectedMathChapter(null);
    setSelectedEnglishUnit(null);
    setSelectedArabicLesson(null);

    if (profile) {
      const updated = { ...profile, activeSubject: subject };
      setProfile(updated);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      } catch {}
    }
  };

  // Add stars
  const handleAddStars = (starsToAdd: number) => {
    if (!profile) return;
    const updatedStars = (profile.totalStars || 0) + starsToAdd;
    const updatedProfile: UserProfile = {
      ...profile,
      totalStars: updatedStars
    };

    const newBadges = checkForNewBadges(profile, updatedProfile);
    if (newBadges.length > 0) {
      setNewlyUnlockedBadge(newBadges[0]);
      updatedProfile.unlockedBadges = Array.from(new Set([...updatedProfile.unlockedBadges, ...newBadges.map(b => b.id)]));
    }

    setProfile(updatedProfile);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedProfile));
    } catch {}
  };

  // Teacher mission save
  const handleSaveTeacherMissions = (missions: TeacherDailyMissions) => {
    setTeacherMissions(missions);
    try {
      localStorage.setItem(TEACHER_MISSIONS_KEY, JSON.stringify(missions));
    } catch {}
    sounds.playCheerSuccess();
  };

  // Save profile edits
  const handleSaveProfile = (newProfile: UserProfile) => {
    setProfile(newProfile);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newProfile));
    } catch {}
  };

  // Default active profile fallback
  const activeProfile: UserProfile = profile || {
    name: 'مَالِك',
    heroType: 'boy',
    avatar: '👦',
    totalStars: 25,
    completedLessons: [],
    solvedChallenges: [],
    unlockedBadges: ['explorer']
  };

  const isGirl = activeProfile.heroType === 'girl';
  const latestAnnouncement = announcements.length > 0 ? announcements[0] : null;

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex flex-col bg-slate-50/50 text-slate-800 font-sans">
        
        {/* Top Header */}
        <NavigationHeader
          profile={activeProfile}
          currentRole={currentRole}
          onOpenProfile={() => setIsLoginModalOpen(true)}
          onOpenBadges={() => setIsBadgesModalOpen(true)}
          onOpenCertificate={() => setIsCertificateOpen(true)}
          onOpenDedication={() => setIsDedicationOpen(true)}
          onOpenTeacherHub={() => {
            if (currentRole === 'teacher' && currentTeacher) {
              setIsTeacherDashboardOpen(true);
            } else {
              setIsTeacherHubOpen(true);
            }
          }}
          onOpenSupervisorPanel={() => setIsSupervisorPanelOpen(true)}
          onOpenEducationalGames={() => setIsEducationalGamesOpen(true)}
          onOpenProgressDashboard={() => setIsProgressDashboardOpen(true)}
          onOpenArabicQuizzes={() => {
            setActiveQuizUnitId(selectedArabicUnitId || 1);
            setIsArabicQuizOpen(true);
          }}
          onSwitchAccount={handleSwitchAccount}
          onToggleChat={() => setIsChatOpen(!isChatOpen)}
          isChatOpen={isChatOpen}
          onReturnToMap={() => {
            stopSpeaking();
            setSelectedMathChapter(null);
            setSelectedEnglishUnit(null);
            setSelectedArabicLesson(null);
          }}
          isInsideLesson={Boolean(selectedMathChapter || selectedEnglishUnit || selectedArabicLesson)}
          onOpenRewardGame={() => setIsRewardGameOpen(true)}
          onOpenOnlineStudents={() => setIsOnlineStudentsOpen(true)}
          onOpenDictionary={() => setIsDictionaryOpen(true)}
          onOpenSendWhatsAppCertificate={() => setIsSendWhatsAppCertOpen(true)}
          onlineCount={onlineCount}
        />

      {/* Classroom Announcement Bar (if available) */}
      {latestAnnouncement && (
        <div className="bg-amber-100/90 border-b border-amber-300 py-2 px-4 shadow-2xs">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-amber-950 font-bold truncate">
              <span className="p-1 bg-amber-400 text-slate-900 rounded-lg text-xs font-black shrink-0">
                📢 {latestAnnouncement.badge || 'إِعْلَانُ الْفَصْلِ'}:
              </span>
              <span className="truncate">{latestAnnouncement.message}</span>
              <span className="text-[10px] text-amber-800 shrink-0 font-normal">
                ({latestAnnouncement.senderName})
              </span>
            </div>
            <button
              onClick={() => {
                sounds.playClick();
                setIsAnnouncementDetailsOpen(true);
              }}
              className="bg-amber-200/80 hover:bg-amber-300 text-amber-950 px-2.5 py-1 rounded-xl font-black shrink-0 text-[11px] transition shadow-2xs active:scale-95 flex items-center gap-1 border border-amber-300"
            >
              <span>🔍</span>
              <span>عَرْضُ التَّفَاصِيلِ ←</span>
            </button>
          </div>
        </div>
      )}

      {/* Subject Navigation Bar */}
      <SubjectSelector
        activeSubject={activeSubject}
        onSelectSubject={handleSelectSubject}
        onOpenDictionary={() => setIsDictionaryOpen(true)}
        onOpenRewardGame={() => setIsRewardGameOpen(true)}
        onOpenOnlineStudents={() => setIsOnlineStudentsOpen(true)}
        onlineCount={onlineCount}
        showOnlineCount={currentRole === 'teacher' || currentRole === 'supervisor'}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6">
        
        {/* 1. MATH SUBJECT VIEW */}
        {activeSubject === 'math' && (
          selectedMathChapter ? (
            <MathChapterViewer
              chapter={selectedMathChapter}
              onBack={() => {
                stopSpeaking();
                setSelectedMathChapter(null);
              }}
              onCompleteExercise={(_, pts) => handleAddStars(pts)}
              onOpenRewardGame={() => setIsEducationalGamesOpen(true)}
              studentName={activeProfile.name}
              isGirl={isGirl}
            />
          ) : (
            <MathHubView
              onSelectChapter={(chapter) => {
                stopSpeaking();
                sounds.playButtonTap();
                setSelectedMathChapter(chapter);
              }}
              onOpenRewardGame={() => setIsEducationalGamesOpen(true)}
              completedLessonsCount={activeProfile.completedLessons.length}
              studentName={activeProfile.name}
              isGirl={isGirl}
            />
          )
        )}

        {/* 2. ENGLISH CONNECT 3 SUBJECT VIEW */}
        {activeSubject === 'english' && (
          selectedEnglishUnit ? (
            <EnglishUnitViewer
              unit={selectedEnglishUnit}
              onBack={() => {
                stopSpeaking();
                setSelectedEnglishUnit(null);
              }}
              onCompleteExercise={(_, pts) => handleAddStars(pts)}
              onOpenDictionary={() => setIsDictionaryOpen(true)}
              onOpenRewardGame={() => setIsEducationalGamesOpen(true)}
              studentName={activeProfile.name}
              isGirl={isGirl}
            />
          ) : (
            <EnglishHubView
              onSelectUnit={(unit) => {
                stopSpeaking();
                sounds.playButtonTap();
                setSelectedEnglishUnit(unit);
              }}
              onOpenDictionary={() => setIsDictionaryOpen(true)}
              onOpenRewardGame={() => setIsEducationalGamesOpen(true)}
              studentName={activeProfile.name}
              isGirl={isGirl}
            />
          )
        )}

        {/* 3. ARABIC SUBJECT VIEW */}
        {activeSubject === 'arabic' && (
          selectedArabicLesson ? (
            <LessonViewer
              lesson={selectedArabicLesson}
              profile={activeProfile}
              onLessonComplete={(lessonId: string, earnedStars: number) => {
                handleAddStars(earnedStars);
              }}
              onBackToMap={() => {
                stopSpeaking();
                setSelectedArabicLesson(null);
              }}
              onOpenChatWithContext={(message: string) => {
                setChatInitialQuery(message);
                setIsChatOpen(true);
              }}
            />
          ) : (
            <div className="space-y-6">
              {/* Daily Missions Card */}
              <DailyMissionsCard
                missions={teacherMissions}
                profile={activeProfile}
                completedTasks={dailyCompletedTasks}
                onCompleteTask={(taskId: string, stars: number) => {
                  if (!dailyCompletedTasks.includes(taskId)) {
                    const today = new Date().toISOString().split('T')[0];
                    const nextTasks = [...dailyCompletedTasks, taskId];
                    setDailyCompletedTasks(nextTasks);
                    try {
                      localStorage.setItem(`${DAILY_TASKS_KEY}_${today}`, JSON.stringify(nextTasks));
                    } catch {}
                    handleAddStars(stars);
                    sounds.playCheerSuccess();
                  }
                }}
                onSelectLesson={(lesson) => {
                  stopSpeaking();
                  sounds.playButtonTap();
                  setSelectedArabicLesson(lesson);
                }}
                onOpenTeacherModal={() => setIsTeacherModalOpen(true)}
                onOpenDetailsModal={() => {
                  sounds.playClick();
                  setIsAnnouncementDetailsOpen(true);
                }}
              />

              {/* Adventure Map */}
              <AdventureMap
                profile={activeProfile}
                selectedUnitId={selectedArabicUnitId}
                onSelectUnit={(unitId) => setSelectedArabicUnitId(unitId)}
                onSelectLesson={(lesson) => {
                  stopSpeaking();
                  sounds.playButtonTap();
                  setSelectedArabicLesson(lesson);
                }}
                onOpenQuiz={(unitId) => {
                  setActiveQuizUnitId(unitId);
                  setIsArabicQuizOpen(true);
                }}
              />
            </div>
          )
        )}

      </main>

      {/* Floating AI Robot Tutor Button */}
      <FloatingRobotButton
        isOpen={isChatOpen}
        onClick={() => {
          sounds.playButtonTap();
          setIsChatOpen(true);
        }}
        studentName={activeProfile.name}
      />

      {/* ================= MODALS ================= */}

      {/* 1. Main Role-Based Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* 2. Student Celebratory Welcome Modal */}
      <StudentWelcomeCelebrationModal
        isOpen={isStudentCelebrationOpen}
        student={activeProfile}
        onClose={() => setIsStudentCelebrationOpen(false)}
        onSelectSubject={handleSelectSubject}
        onOpenGames={() => setIsEducationalGamesOpen(true)}
      />

      {/* 3. Teacher Classroom Dashboard Modal */}
      {currentTeacher && (
        <TeacherClassroomDashboardModal
          isOpen={isTeacherDashboardOpen}
          teacher={currentTeacher}
          onClose={() => setIsTeacherDashboardOpen(false)}
          onRefreshData={() => setAnnouncements(getAnnouncements())}
        />
      )}

      {/* 4. Admin Supervisor & Developer Settings Panel */}
      <AdminSupervisorPanel
        isOpen={isSupervisorPanelOpen}
        onClose={() => setIsSupervisorPanelOpen(false)}
        onRefreshData={() => setAnnouncements(getAnnouncements())}
      />

      {/* 5. Educational Challenge Games Modal */}
      <EducationalGamesModal
        isOpen={isEducationalGamesOpen}
        onClose={() => setIsEducationalGamesOpen(false)}
        onAddStars={handleAddStars}
        studentName={activeProfile.name}
      />

      {/* 6. Points Reward Game Modal */}
      <RewardGameModal
        isOpen={isRewardGameOpen}
        onClose={() => setIsRewardGameOpen(false)}
        studentName={activeProfile.name}
        isGirl={isGirl}
        currentStars={activeProfile.totalStars}
        onAddStars={handleAddStars}
      />

      {/* 7. 1000 Words English Dictionary Modal */}
      <EnglishDictionaryModal
        isOpen={isDictionaryOpen}
        onClose={() => setIsDictionaryOpen(false)}
        studentName={activeProfile.name}
      />

      {/* 8. Real-time Live Online Students Modal */}
      <OnlineStudentsModal
        isOpen={isOnlineStudentsOpen}
        onClose={() => setIsOnlineStudentsOpen(false)}
        currentStudentId={studentIdRef.current}
        currentStudentName={activeProfile.name}
        currentStars={activeProfile.totalStars}
      />

      {/* 9. Profile & Badges Modal */}
      <ProfileBadgesModal
        isOpen={isBadgesModalOpen}
        onClose={() => setIsBadgesModalOpen(false)}
        profile={activeProfile}
        onOpenEditProfile={() => {
          setIsBadgesModalOpen(false);
          setIsLoginModalOpen(true);
        }}
        onOpenCertificate={() => {
          setIsBadgesModalOpen(false);
          setIsCertificateOpen(true);
        }}
      />

      {/* 10. Badge Celebration Modal */}
      <BadgeCelebrationModal
        badge={newlyUnlockedBadge}
        isOpen={Boolean(newlyUnlockedBadge)}
        onClose={() => setNewlyUnlockedBadge(null)}
        profile={activeProfile}
      />

      {/* 11. Teacher Mission Modal */}
      <TeacherMissionModal
        isOpen={isTeacherModalOpen}
        onClose={() => setIsTeacherModalOpen(false)}
        currentMissions={teacherMissions}
        onSave={handleSaveTeacherMissions}
      />

      {/* 12. AI Robot Tutor Chat */}
      <RobotTutorChat
        isOpen={isChatOpen}
        onClose={() => {
          setIsChatOpen(false);
          setChatInitialQuery('');
        }}
        profile={activeProfile}
        currentLesson={selectedArabicLesson}
        initialQuery={chatInitialQuery}
      />

      {/* 13. Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        profile={activeProfile}
      />

      {/* 14. Malek Royal Dedication Modal */}
      <MalekDedicationModal
        isOpen={isDedicationOpen}
        onClose={() => setIsDedicationOpen(false)}
        currentProfile={activeProfile}
        onSwitchHero={(name, heroType) => {
          const updated: UserProfile = {
            ...activeProfile,
            name,
            heroType,
            avatar: heroType === 'girl' ? '👧' : '👦'
          };
          handleSaveProfile(updated);
        }}
      />

      {/* 15. Teacher Smartboard Hub */}
      <TeacherClassroomHubModal
        isOpen={isTeacherHubOpen}
        onClose={() => setIsTeacherHubOpen(false)}
        onSelectLesson={(lesson) => {
          setActiveSubject('arabic');
          setSelectedArabicLesson(lesson);
        }}
      />

      {/* 16. Announcement & Daily Challenge Details Modal */}
      <AnnouncementDetailsModal
        isOpen={isAnnouncementDetailsOpen}
        onClose={() => setIsAnnouncementDetailsOpen(false)}
        announcement={latestAnnouncement}
        currentRole={currentRole}
        onStartSubject={(subject) => {
          setActiveSubject(subject);
          setSelectedMathChapter(null);
          setSelectedEnglishUnit(null);
          setSelectedArabicLesson(null);
        }}
        onOpenGames={() => setIsEducationalGamesOpen(true)}
        onOpenTeacherDashboard={() => {
          if (currentRole === 'teacher' && currentTeacher) {
            setIsTeacherDashboardOpen(true);
          } else {
            setIsTeacherModalOpen(true);
          }
        }}
      />

      {/* 17. Send Certificate WhatsApp Modal */}
      <SendCertificateWhatsAppModal
        isOpen={isSendWhatsAppCertOpen}
        onClose={() => setIsSendWhatsAppCertOpen(false)}
        students={getStudentsList()}
        teacherName={currentTeacher?.name || 'الأُسْتَاذُ شَرِيف عَسْقَلَانِي'}
      />

      {/* 18. Student Progress Dashboard Modal (Recharts) */}
      <StudentProgressDashboardModal
        isOpen={isProgressDashboardOpen}
        onClose={() => setIsProgressDashboardOpen(false)}
        profile={activeProfile}
        onSelectSubject={handleSelectSubject}
        onOpenArabicQuiz={(uId) => {
          setActiveQuizUnitId(uId || 1);
          setIsArabicQuizOpen(true);
        }}
        onOpenGames={() => setIsEducationalGamesOpen(true)}
      />

      {/* 19. Arabic End-of-Unit Quiz Modal */}
      <ArabicUnitQuizModal
        isOpen={isArabicQuizOpen}
        onClose={() => setIsArabicQuizOpen(false)}
        unitId={activeQuizUnitId}
        studentName={activeProfile.name}
        onAddStars={handleAddStars}
      />

      {/* Footer Attribution */}
      <footer className="bg-white border-t border-slate-200 py-6 px-4 text-center text-xs font-bold text-slate-500 no-print">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>
            مَنَصَّةُ الطَّالِبِ الْمُجْتَهِدِ - الصَّفُّ الثَّالِثُ الابْتِدَائِيُّ (رِيَاضِيَّاتٌ • إِنْجِلِيزِيٌّ • عَرَبِيٌّ)
          </p>
          <div className="inline-flex items-center gap-2">
            <span>فِكْرَةٌ وَإِعْدَادٌ وَتَطْوِيرٌ:</span>
            <a
              id="developer-whatsapp-footer-link"
              href="https://wa.me/201080997505"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 hover:text-emerald-900 px-3.5 py-1.5 rounded-full border border-emerald-300 font-black shadow-xs transition transform hover:scale-105 active:scale-95 group"
              title="تواصل مباشر عبر واتساب مع الأستاذ شريف عسقلاني (01080997505)"
            >
              <span className="text-base group-hover:scale-110 transition">💬</span>
              <span>الأُسْتَاذُ شَرِيف عَسْقَلَانِي (واتساب)</span>
              <span className="bg-emerald-600 text-white text-[10px] px-1.5 py-0.5 rounded-full font-mono">01080997505</span>
            </a>
          </div>
        </div>
      </footer>

      </div>
    </ErrorBoundary>
  );
}
