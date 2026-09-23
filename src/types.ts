export type HeroType = 'boy' | 'girl';
export type SubjectType = 'math' | 'english' | 'arabic';
export type UserRole = 'student' | 'teacher' | 'supervisor';

export interface UserProfile {
  id?: string;
  name: string;
  role?: UserRole;
  pin?: string;
  heroType: HeroType;
  avatar: string;
  grade?: string;
  totalStars: number;
  activeSubject?: SubjectType;
  completedLessons: string[];
  solvedChallenges: string[];
  unlockedBadges: string[];
  gameHighScore?: number;
  parentPhone?: string;
  onlineStatus?: 'online' | 'busy' | 'away';
  lastSeen?: string;
}

export interface TeacherAccount {
  id: string;
  name: string;
  pin: string;
  subject?: SubjectType;
  className: string;
  createdAt: string;
  dailyAnnouncement?: string;
}

export interface SupervisorConfig {
  adminPin: string;
  adminName: string;
  adminPhone: string;
  allowStudentRegistration: boolean;
}

export interface ClassroomAnnouncement {
  id: string;
  senderName: string;
  senderRole: 'teacher' | 'supervisor';
  message: string;
  date: string;
  badge?: string;
}

// Math Curriculum Types (Extracted directly from the Egyptian Ministry Book)
export interface MathExercise {
  id: string;
  problem: string;
  type: 'fill' | 'choice' | 'step';
  options?: string[];
  correctAnswer: string;
  hint: string;
  explanation: string;
  bookPageRef?: number;
  isGenius?: boolean; // أسئلة الأذكياء
}

export interface MathLessonItem {
  id: string;
  lessonCode: string; // e.g. "1-1", "1-2", "2-1"
  title: string;
  conceptSummary: string;
  voiceExplanation?: string; // الشرح الصوتي المبسط بصوت المعلم للأطفال
  rules: string[];
  solvedExamples: {
    question: string;
    stepByStep: string[];
    result: string;
    bookNote?: string;
  }[];
  exercises: MathExercise[];
  geniusQuestions: MathExercise[];
}

export interface MathChapter {
  id: number;
  chapterNumber: number;
  title: string;
  themeDescription: string;
  color: string;
  iconName: string;
  lessons: MathLessonItem[];
}

// English Curriculum Types (Extracted from Connect Primary 3 & El Moasser)
export interface EnglishExercise {
  id: string;
  question: string;
  type: 'choice' | 'fill' | 'reorder' | 'phonics';
  options?: string[];
  correctAnswer: string;
  hint: string;
  explanation: string;
  isGenius?: boolean;
}

export interface EnglishLessonItem {
  id: string;
  lessonNumber: number;
  title: string;
  topic: string;
  vocabulary: {
    word: string;
    meaningAr: string;
    phonetic: string;
    example: string;
  }[];
  conversation?: {
    speaker: string;
    speakerAr: string;
    text: string;
    translationAr: string;
  }[];
  phonicsFocus?: {
    rule: string;
    sound: string;
    sampleWords: string[];
  };
  languageFocus?: {
    title: string;
    ruleExplanation: string;
    formula: string;
    examples: { en: string; ar: string }[];
  };
  exercises: EnglishExercise[];
  geniusQuestions: EnglishExercise[];
}

export interface EnglishUnit {
  id: number;
  unitNumber: number;
  title: string;
  titleAr: string;
  color: string;
  iconName: string;
  outcomes: string[];
  lessons: EnglishLessonItem[];
}

// 1000 Words English-Arabic Child-Friendly Dictionary
export interface DictionaryWord {
  id: string;
  word: string;
  arabicMeaning: string;
  pronunciationGuide: string; // Egyptian/Arabic simplified phonetics (e.g. "إيليفانت")
  partOfSpeech: 'noun' | 'verb' | 'adjective' | 'expression' | 'preposition' | 'adverb';
  category: 'animals' | 'school' | 'family' | 'food' | 'actions' | 'emotions' | 'places' | 'time' | 'body' | 'numbers' | 'nature' | 'jobs';
  exampleEn: string;
  exampleAr: string;
}

// Real-time Online Classroom Presence
export interface LiveOnlineStudent {
  id: string;
  name: string;
  heroType?: HeroType;
  isGirl?: boolean;
  avatar: string;
  subject?: string;
  gradeLevel?: string;
  currentLesson?: string;
  currentActivity?: string;
  stars: number;
  lastSeen?: string;
  isSelf?: boolean;
}

export type ChallengeType = 
  | 'multiple_choice' 
  | 'true_false' 
  | 'fill_blank' 
  | 'phonics_split' 
  | 'phonics_merge' 
  | 'grammar_choice';

export interface Challenge {
  id: string;
  question: string;
  type: ChallengeType;
  options?: string[];
  correctAnswer: string;
  hint: string; // Gentle curriculum-based hint for 2nd chance
  explanation: string;
  points: number;
  contextSnippet?: string;
}

export interface VocabularyItem {
  word: string;
  meaning?: string;
  opposite?: string;
  plural?: string;
  singular?: string;
  example?: string;
}

export interface RuleSection {
  title: string;
  ruleExplanation: string;
  examples: { original: string; note: string }[];
}

export type LessonCategory = 
  | 'listening' 
  | 'reading' 
  | 'grammar' 
  | 'spelling' 
  | 'poetry' 
  | 'family_reading' 
  | 'unit_assessment';

export interface Lesson {
  id: string;
  unitId: number;
  lessonNumber: string;
  title: string;
  category: LessonCategory;
  categoryLabel: string;
  iconName: string;
  summaryNarrative: string; // Audio-style short engaging narration
  storyPassage?: string; // Full or highlighted reading text
  poeticVerses?: { firstHemistich: string; secondHemistich: string }[];
  vocabulary?: VocabularyItem[];
  grammarOrSpellingRule?: RuleSection;
  challenges: Challenge[];
  familyStoryMoral?: string;
}

export interface Unit {
  id: number;
  numberArabic: string;
  title: string;
  themeDescription: string;
  bannerColor: string;
  accentColor: string;
  iconName: string;
  lessons: Lesson[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  requiredStars?: number;
  category: 'unit' | 'achievement' | 'special';
  unitId?: number;
  isUnlocked?: boolean;
  unlockedAt?: string;
}

export interface DailySpellingChallenge {
  id: string;
  title: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  ruleSummary: string;
}

export interface TeacherDailyMissions {
  id: string;
  teacherName: string;
  teacherNote: string;
  lessonId1: string;
  lessonId2: string;
  spellingChallenge: DailySpellingChallenge;
  rewardStars: number;
  assignedDate: string;
}

export interface ClassroomStudent {
  id: string;
  name: string;
  heroType: HeroType;
  stars: number;
  completedLessonsCount: number;
  accuracy: number;
  lastActive: string;
  isHeroOfDay?: boolean;
}

export interface HeroOfTheDayAnnouncement {
  id: string;
  studentName: string;
  heroType: HeroType;
  crownedAt: string;
  teacherName: string;
  congratulationMessage: string;
  bonusStars: number;
  isClaimed?: boolean;
}
