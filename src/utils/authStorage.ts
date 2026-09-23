import { TeacherAccount, SupervisorConfig, ClassroomAnnouncement, UserProfile, UserRole } from '../types';

const SUPERVISOR_STORAGE_KEY = 'al_talib_supervisor_config_v1';
const TEACHERS_STORAGE_KEY = 'al_talib_teachers_list_v1';
const STUDENTS_STORAGE_KEY = 'al_talib_students_list_v1';
const ANNOUNCEMENTS_STORAGE_KEY = 'al_talib_announcements_v1';
const CURRENT_SESSION_KEY = 'al_talib_active_session_v1';

export const DEFAULT_SUPERVISOR_CONFIG: SupervisorConfig = {
  adminPin: '2025',
  adminName: 'الأستاذ شريف عسقلاني (المطور والمشرف العام)',
  adminPhone: '01080997505',
  allowStudentRegistration: true
};

export const DEFAULT_TEACHERS: TeacherAccount[] = [
  {
    id: 'teacher-1',
    name: 'الأستاذ شريف عسقلاني',
    pin: '1234',
    subject: 'math',
    className: 'الصف الثالث - أبطال التفوق',
    createdAt: '2025-01-01',
    dailyAnnouncement: 'مرحباً بعباقرة الصف الثالث! اليوم لدينا تحديات شيقة في الرياضيات وجدول الضرب!'
  },
  {
    id: 'teacher-2',
    name: 'معلمة اللغة العربية والإنجليزية',
    pin: '1234',
    subject: 'arabic',
    className: 'الصف الثالث - فرسان المعرفة',
    createdAt: '2025-01-01',
    dailyAnnouncement: 'تدربوا على قراءة نشيد أصحاب المهن والكلمات الجديدة اليوم يا أبطال!'
  }
];

export const DEFAULT_STUDENTS: UserProfile[] = [
  {
    id: 'student-malek',
    name: 'مَالِك',
    role: 'student',
    pin: '123',
    heroType: 'boy',
    avatar: '🦁',
    grade: 'الصف الثالث الابتدائي',
    totalStars: 135,
    activeSubject: 'math',
    completedLessons: ['lesson-1', 'lesson-2', 'math-1-1'],
    solvedChallenges: ['m1-1-e1', 'm1-1-e2'],
    unlockedBadges: ['explorer', 'speedster'],
    parentPhone: '01080997505',
    onlineStatus: 'online',
    lastSeen: 'الآن'
  },
  {
    id: 'student-farida',
    name: 'فَرِيدَة',
    role: 'student',
    pin: '123',
    heroType: 'girl',
    avatar: '🌟',
    grade: 'الصف الثالث الابتدائي',
    totalStars: 160,
    activeSubject: 'arabic',
    completedLessons: ['lesson-1', 'lesson-2', 'lesson-3'],
    solvedChallenges: ['ch-1', 'ch-2'],
    unlockedBadges: ['reader', 'scholar'],
    parentPhone: '01080997505',
    onlineStatus: 'online',
    lastSeen: 'منذ دقيقة'
  },
  {
    id: 'student-omar',
    name: 'عُمَر',
    role: 'student',
    pin: '123',
    heroType: 'boy',
    avatar: '🚀',
    grade: 'الصف الثالث الابتدائي',
    totalStars: 95,
    activeSubject: 'english',
    completedLessons: ['lesson-1'],
    solvedChallenges: ['en-1'],
    unlockedBadges: ['explorer'],
    parentPhone: '01080997505',
    onlineStatus: 'online',
    lastSeen: 'منذ 3 دقائق'
  },
  {
    id: 'student-salma',
    name: 'سَلْمَى',
    role: 'student',
    pin: '123',
    heroType: 'girl',
    avatar: '🦄',
    grade: 'الصف الثالث الابتدائي',
    totalStars: 110,
    activeSubject: 'math',
    completedLessons: ['math-1-1', 'math-1-2'],
    solvedChallenges: ['m1-1-e1'],
    unlockedBadges: ['speedster'],
    parentPhone: '01080997505',
    onlineStatus: 'online',
    lastSeen: 'الآن'
  }
];

export const DEFAULT_ANNOUNCEMENTS: ClassroomAnnouncement[] = [
  {
    id: 'ann-1',
    senderName: 'الأستاذ شريف عسقلاني',
    senderRole: 'teacher',
    message: 'أهلاً وسهلاً بجميع طلابنا الأحباء في منصة الطالب المجتهد! من يقفل تدريبات الرياضيات اليوم يحصل على 20 نجمة إضافية 🌟',
    date: 'اليوم',
    badge: 'تحدي اليوم'
  }
];

// Supervisor Config
export function getSupervisorConfig(): SupervisorConfig {
  try {
    const raw = localStorage.getItem(SUPERVISOR_STORAGE_KEY);
    if (!raw) return DEFAULT_SUPERVISOR_CONFIG;
    return { ...DEFAULT_SUPERVISOR_CONFIG, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SUPERVISOR_CONFIG;
  }
}

export function saveSupervisorConfig(config: SupervisorConfig): void {
  localStorage.setItem(SUPERVISOR_STORAGE_KEY, JSON.stringify(config));
}

// Teachers List
export function getTeachersList(): TeacherAccount[] {
  try {
    const raw = localStorage.getItem(TEACHERS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(DEFAULT_TEACHERS));
      return DEFAULT_TEACHERS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_TEACHERS;
  }
}

export function saveTeachersList(teachers: TeacherAccount[]): void {
  localStorage.setItem(TEACHERS_STORAGE_KEY, JSON.stringify(teachers));
}

export function addTeacher(teacher: Omit<TeacherAccount, 'id' | 'createdAt'>): TeacherAccount {
  const list = getTeachersList();
  const newTeacher: TeacherAccount = {
    ...teacher,
    id: `teacher-${Date.now()}`,
    createdAt: new Date().toISOString().split('T')[0]
  };
  list.push(newTeacher);
  saveTeachersList(list);
  return newTeacher;
}

export function deleteTeacher(id: string): void {
  const list = getTeachersList().filter(t => t.id !== id);
  saveTeachersList(list);
}

// Students List
export function getStudentsList(): UserProfile[] {
  try {
    const raw = localStorage.getItem(STUDENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(DEFAULT_STUDENTS));
      return DEFAULT_STUDENTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_STUDENTS;
  }
}

export function saveStudentsList(students: UserProfile[]): void {
  localStorage.setItem(STUDENTS_STORAGE_KEY, JSON.stringify(students));
}

export function addStudent(studentData: Partial<UserProfile> & { name: string }): UserProfile {
  const list = getStudentsList();
  const newStudent: UserProfile = {
    id: `student-${Date.now()}`,
    name: studentData.name.trim(),
    role: 'student',
    pin: studentData.pin?.trim() || '123',
    heroType: studentData.heroType || 'boy',
    avatar: studentData.avatar || (studentData.heroType === 'girl' ? '🌟' : '🦁'),
    grade: 'الصف الثالث الابتدائي',
    totalStars: 20,
    activeSubject: studentData.activeSubject || 'math',
    completedLessons: [],
    solvedChallenges: [],
    unlockedBadges: ['explorer'],
    parentPhone: studentData.parentPhone?.trim() || '01080997505',
    onlineStatus: 'online',
    lastSeen: 'الآن'
  };
  list.push(newStudent);
  saveStudentsList(list);
  return newStudent;
}

export function updateStudentInList(student: UserProfile): void {
  const list = getStudentsList();
  const index = list.findIndex(s => s.id === student.id || s.name === student.name);
  if (index !== -1) {
    list[index] = student;
  } else {
    list.push(student);
  }
  saveStudentsList(list);
}

export function deleteStudent(idOrName: string): void {
  const list = getStudentsList().filter(s => s.id !== idOrName && s.name !== idOrName);
  saveStudentsList(list);
}

// Classroom Announcements
export function getAnnouncements(): ClassroomAnnouncement[] {
  try {
    const raw = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(DEFAULT_ANNOUNCEMENTS));
      return DEFAULT_ANNOUNCEMENTS;
    }
    return JSON.parse(raw);
  } catch {
    return DEFAULT_ANNOUNCEMENTS;
  }
}

export function addAnnouncement(ann: Omit<ClassroomAnnouncement, 'id' | 'date'>): ClassroomAnnouncement {
  const list = getAnnouncements();
  const newAnn: ClassroomAnnouncement = {
    ...ann,
    id: `ann-${Date.now()}`,
    date: 'الآن'
  };
  list.unshift(newAnn);
  // Keep last 20 announcements
  if (list.length > 20) list.pop();
  localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(list));
  return newAnn;
}

// Active Session Storage
export interface ActiveSession {
  role: UserRole;
  user: UserProfile | TeacherAccount | { name: string; role: 'supervisor' };
  loginTime: string;
}

export function getActiveSession(): ActiveSession | null {
  try {
    const raw = sessionStorage.getItem(CURRENT_SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setActiveSession(session: ActiveSession): void {
  sessionStorage.setItem(CURRENT_SESSION_KEY, JSON.stringify(session));
}

export function clearActiveSession(): void {
  sessionStorage.removeItem(CURRENT_SESSION_KEY);
}
