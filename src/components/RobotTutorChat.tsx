import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, Lesson } from '../types';
import { sounds, speakArabic, stopSpeaking } from '../utils/audio';
import { findCurriculumMatch } from '../data/curriculumMaster';
import curriculumReferenceData from '../data/curriculumReference.json';
import { InteractiveCurriculumReader } from './InteractiveCurriculumReader';
import { 
  Bot, 
  Send, 
  X, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  HelpCircle, 
  Loader2, 
  BookOpen, 
  ShieldCheck, 
  Music, 
  Award, 
  Star, 
  Lightbulb, 
  Compass,
  CheckCircle2,
  BookMarked,
  Layers,
  ChevronDown,
  Check,
  GraduationCap
} from 'lucide-react';

interface RobotTutorChatProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  currentLesson?: Lesson | null;
  initialQuery?: string;
}

export interface MatchedCurriculumCard {
  type: 'poem' | 'grammar' | 'story' | 'spelling';
  title: string;
  unitTitle?: string;
  badgeLabel: string;
  data: any;
}

interface ChatMessage {
  id: string;
  sender: 'tutor' | 'user';
  text: string;
  timestamp: string;
  curriculumCard?: MatchedCurriculumCard;
}

// Arabic Text Normalizer for ultra-resilient matching (strips diacritics & standardizes letters)
export function normalizeArabic(text: string): string {
  if (!text) return "";
  return text
    .replace(/[\u064B-\u065F\u0670]/g, "") // remove tashkeel/diacritics
    .replace(/[إأآا]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[^\u0600-\u06FFa-zA-Z0-9\s]/g, " ")
    .toLowerCase()
    .trim();
}

// Stop words list to prevent single-preposition substring matching bugs (like 'في' or 'من')
const STOP_WORDS = new Set(['في', 'من', 'عن', 'علي', 'على', 'الي', 'إلى', 'ما', 'هو', 'هي', 'هل', 'كم', 'يا', 'مع', 'ان', 'أن']);

// Structured Curriculum Reference Retriever Function
export function retrieveFromCurriculumReference(query: string): MatchedCurriculumCard | null {
  const normQuery = normalizeArabic(query);
  if (!normQuery) return null;

  // Check if query is explicitly asking about Math topics
  const isMathQuery = normQuery.includes('ساعه') || normQuery.includes('وقت') || normQuery.includes('دقائق') ||
    normQuery.includes('عقرب') || normQuery.includes('رياضيات') || normQuery.includes('ضرب') || 
    normQuery.includes('جدول') || normQuery.includes('قسمه') || normQuery.includes('كسور') || 
    normQuery.includes('محيط') || normQuery.includes('مساحه');

  // Math clock special recognition
  if (normQuery.includes('ساعه') || normQuery.includes('وقت') || normQuery.includes('عقرب') || normQuery.includes('دقائق')) {
    return {
      type: 'grammar',
      title: 'السَّاعَةُ وَقِرَاءَةُ الْوَقْتِ وَالْمُدَّةِ الزَّمَنِيَّةِ ⏰',
      unitTitle: 'الرِّيَاضِيَّاتُ - الْفَصْلُ الثَّانِي',
      badgeLabel: 'دَرْسُ السَّاعَةِ الْمُعْتَمَدُ ⏰',
      data: {
        title: 'السَّاعَةُ وَقِرَاءَةُ الْوَقْتِ وَالْمُدَّةِ الزَّمَنِيَّةِ',
        unitTitle: 'الرِّيَاضِيَّاتُ (كِتَابُ الْوَزَارَةِ وَسِلَاحُ التِّلْمِيذِ)',
        summary: `⏰ شَرْحُ دَرْسِ السَّاعَةِ وَقِرَاءَةِ الْوَقْتِ وَالْمُدَّةِ الزَّمَنِيَّةِ:
1️⃣ عَقْرَبُ السَّاعَاتِ (الْقَصِيرُ): يُشِيرُ إِلَى رَقَمِ السَّاعَةِ.
2️⃣ عَقْرَبُ الدَّقَائِقِ (الطَّوِيلُ): نَضْرِبُ رَقَمَهُ فِي 5 لِمَعْرِفَةِ الدَّقَائِقِ!
• عِنْدَ 12 ⬅️ تَمَاماً (:00)
• عِنْدَ 3 ⬅️ وَالرُّبْعُ (:15 دَقِيقَةً)
• عِنْدَ 6 ⬅️ وَالنِّصْفُ (:30 دَقِيقَةً)
• عِنْدَ 9 ⬅️ إِلَّا رُبْعاً (:45 دَقِيقَةً)
3️⃣ الْوَقْتُ الْمُنْقَضِي = وَقْتُ النِّهَايَةِ - وَقْتُ الْبِدَايَةِ!`,
        tools: [
          { tool: '1 سَاعَة', usage: 'تُسَاوِي', example: '60 دَقِيقَةً' },
          { tool: 'نِصْفُ سَاعَةٍ', usage: 'تُسَاوِي', example: '30 دَقِيقَةً' },
          { tool: 'رُبْعُ سَاعَةٍ', usage: 'تُسَاوِي', example: '15 دَقِيقَةً' },
          { tool: 'ثُلْثُ سَاعَةٍ', usage: 'تُسَاوِي', example: '20 دَقِيقَةً' }
        ],
        goldenRule: 'عِنْدَ حِسَابِ الدَّقَائِقِ، اقْفِزْ بِـ 5 دَقَائِقَ مَعَ كُلِّ رَقَمٍ عَلَى السَّاعَةِ!'
      }
    };
  }

  // Math Multiplication Tables recognition
  if (normQuery.includes('ضرب') || normQuery.includes('جدول الضرب') || normQuery.includes('جدول')) {
    return {
      type: 'grammar',
      title: 'جَدَاوِلُ الضَّرْبِ وَطُرُقُ الْحِفْظِ السَّرِيعَةِ 🧮',
      unitTitle: 'الرِّيَاضِيَّاتُ - كِتَابُ الْوَزَارَةِ وَسِلَاحُ التِّلْمِيذِ',
      badgeLabel: 'عَبَاقِرَةُ جَدْوَلِ الضَّرْبِ 🧮',
      data: {
        title: 'جَدَاوِلُ الضَّرْبِ لِلصَّفِّ الثَّالِثِ الابْتِدَائِيِّ',
        unitTitle: 'الرِّيَاضِيَّاتُ - الْفَصْلُ الثَّانِي وَالثَّالِثُ',
        summary: `🧮 شَرْحُ وَأَسْرَارُ جَدْوَلِ الضَّرْبِ:
• الضَّرْبُ هُوَ: جَمْعٌ مُتَكَرِّرٌ لِنَفْسِ الْعَدَدِ! (مِثَالٌ: 3 × 4 يَعْنِي 4 + 4 + 4 = 12).
• خَاصِّيَّةُ الإِبْدَالِ: 6 × 7 هِيَ نَفْسُهَا 7 × 6 = 42!
• خَاصِّيَّةُ التَّوْزِيعِ: يُمْكِنُ تَفْكِيكُ الأَعْدَادِ الْكَبِيرَةِ: 8 × 7 = (8 × 5) + (8 × 2) = 40 + 16 = 56!`,
        tools: [
          { tool: 'جَدْوَل 6', usage: 'الأَعْدَادُ الزَّوْجِيَّةُ تَنْتَهِي بِنَفْسِ الرَّقَمِ', example: '6 × 4 = 24 ، 6 × 6 = 36 ، 6 × 8 = 48' },
          { tool: 'جَدْوَل 9', usage: 'مَجْمُوعُ رَقَمَيِ النَّاتِجِ دَائِماً 9', example: '9 × 2 = 18 (1+8=9) ، 9 × 5 = 45 (4+5=9)' },
          { tool: 'الضَّرْبُ فِي 0', usage: 'أَيُّ عَدَدٍ فِي 0 يُسَاوِي 0 دَائِماً', example: '999 × 0 = 0' },
          { tool: 'الضَّرْبُ فِي 1', usage: 'الْعُنْصُرُ الْمُحَايِدُ الضَّرْبِيُّ', example: '25 × 1 = 25' }
        ],
        goldenRule: 'احْفَظِ الْمُرَبَّعَاتِ: 5×5=25 ، 6×6=36 ، 7×7=49 ، 8×8=64 ، 9×9=81!'
      }
    };
  }

  // Math Fractions recognition
  if (normQuery.includes('كسور') || normQuery.includes('كسر') || normQuery.includes('نصف') || normQuery.includes('ربع') || normQuery.includes('ثلث')) {
    return {
      type: 'grammar',
      title: 'مَفْهُومُ الْكُسُورِ وَالْكُسُورِ الْمُتَكَافِئَةِ 🥧',
      unitTitle: 'الرِّيَاضِيَّاتُ - كِتَابُ الْوَزَارَةِ',
      badgeLabel: 'دَرْسُ الْكُسُورِ 🥧',
      data: {
        title: 'الْكُسُورُ لِلصَّفِّ الثَّالِثِ الابْتِدَائِيِّ',
        unitTitle: 'الرِّيَاضِيَّاتُ - الْفَصْلُ الرَّابِعُ',
        summary: `🥧 مَفْهُومُ الْكَسْرِ:
• الْبَسْطُ (الرَّقَمُ الْعُلْوِيُّ): عَدَدُ الأَجْزَاءِ الْمُلَوَّنَةِ أَوِ الْمَأْخُوذَةِ.
• الْمَقَامُ (الرَّقَمُ السُّفْلِيُّ): عَدَدُ جَمِيعِ الأَجْزَاءِ الْمُتَسَاوِيَةِ لِلْوَاحِدِ الصَّحِيحِ.
• قَاعِدَةُ الْمُقَارَنَةِ: إِذَا تَسَاوَى الْبَسْطُ، فَالْمَقَامُ الأَصْغَرُ هُوَ الْكَسْرُ الأَكْبَرُ! (1/2 أَكْبَرُ مِنْ 1/4).`,
        tools: [
          { tool: '1/2 (النِّصْفُ)', usage: 'يُكَافِئُ', example: '2/4 وَ 3/6 وَ 4/8' },
          { tool: '1/3 (الثُّلْثُ)', usage: 'يُكَافِئُ', example: '2/6 وَ 3/9' },
          { tool: '1/4 (الرُّبْعُ)', usage: 'يُكَافِئُ', example: '2/8 وَ 3/12' },
          { tool: 'الْوَاحِدُ الصَّحِيحُ', usage: 'يُسَاوِي', example: '2/2 = 3/3 = 4/4 = 5/5' }
        ],
        goldenRule: 'الْكَسْرُ هُوَ جُزْءٌ مِنْ كُلٍّ، وَيَجِبُ أَنْ تَكُونَ كُلُّ الأَجْزَاءِ مُتَسَاوِيَةً تَمَاماً!'
      }
    };
  }

  // Math Perimeter & Area recognition
  if (normQuery.includes('محيط') || normQuery.includes('مساحه') || normQuery.includes('مستطيل') || normQuery.includes('مربع')) {
    return {
      type: 'grammar',
      title: 'الْمُحِيطُ وَالْمَسَاحَةُ وَالأَشْكَالُ الْهَنْدَسِيَّةُ 📐',
      unitTitle: 'الرِّيَاضِيَّاتُ - كِتَابُ الْوَزَارَةِ',
      badgeLabel: 'قَوَانِينُ الْمُحِيطِ وَالْمَسَاحَةِ 📐',
      data: {
        title: 'الْمُحِيطُ وَالْمَسَاحَةُ',
        unitTitle: 'الرِّيَاضِيَّاتُ - الْفَصْلُ الثَّالِثُ',
        summary: `📐 الْفَرْقُ بَيْنَ الْمُحِيطِ وَالْمَسَاحَةِ:
1️⃣ الْمُحِيطُ (السِّيَاجُ الْخَارِجِيُّ): مَجْمُوعُ أَطْوَالِ أَضْلاعِ الشَّكْلِ.
• مُحِيطُ الْمُرَبَّعِ = طُولُ الضِّلْعِ × 4
• مُحِيطُ الْمُسْتَطِيلِ = (الطُّولُ + الْعَرْضُ) × 2
2️⃣ الْمَسَاحَةُ (الْبِلَاطُ الدَّاخِلِيُّ): عَدَدُ الْوِحْدَاتِ الْمُرَبَّعَةِ دَاخِلَ الشَّكْلِ.
• مَسَاحَةُ الْمُرَبَّعِ = طُولُ الضِّلْعِ × نَفْسِهِ
• مَسَاحَةُ الْمُسْتَطِيلِ = الطُّولُ × الْعَرْضُ`,
        tools: [
          { tool: 'مُرَبَّع ضِلْعُهُ 5 سم', usage: 'مُحِيطُهُ: 5 × 4 = 20 سم', example: 'مَسَاحَتُهُ: 5 × 5 = 25 سم²' },
          { tool: 'مُسْتَطِيل 6 × 3 سم', usage: 'مُحِيطُهُ: (6+3)×2 = 18 سم', example: 'مَسَاحَتُهُ: 6 × 3 = 18 سم²' }
        ],
        goldenRule: 'الْمُحِيطُ يُقَاسُ بِالسَّنْتِيمِتْرِ (سم)، أَمَّا الْمَسَاحَةُ فَتُقَاسُ بِالسَّنْتِيمِتْرِ الْمُرَبَّعِ (سم²)!'
      }
    };
  }

  // English Connect 3 & Phonics recognition
  if (normQuery.includes('connect') || normQuery.includes('انجليزي') || normQuery.includes('فونكس') || normQuery.includes('phonics') || normQuery.includes('مشاعر') || normQuery.includes('feelings')) {
    return {
      type: 'grammar',
      title: 'مَنْهَجُ اللُّغَةِ الإِنْجِلِيزِيَّةِ CONNECT 3 🔤',
      unitTitle: 'Connect 3 - Primary 3',
      badgeLabel: 'CONNECT 3 كِتَابُ الْوَزَارَةِ 🔤',
      data: {
        title: 'قَوَاعِدُ وَمُفْرَدَاتُ Connect 3',
        unitTitle: 'Connect 3 - Ministry Book',
        summary: `🔤 أَهَمُّ مَحَاوِرِ مَنْهَجِ CONNECT 3:
1️⃣ Unit 1 (I feel happy): التَّعْبِيرُ عَنِ الْمَشَاعِرِ:
• How do you feel? -> I feel happy / excited / tired / hungry / thirsty / angry / sad.
2️⃣ Phonics (ee & ea):
• ee: sleep, green, meet, bee, feel.
• ea: eat, leaf, clean, meat, team.
3️⃣ Unit 2 (What's the matter?): الصِّحَّةُ وَالْعِلَاجُ:
• What's the matter? -> I have a headache / cold / cough / fever. My stomach hurts.`,
        tools: [
          { tool: 'feel + adjective', usage: 'لِلتَّعْبِيرِ عَنِ الإِحْسَاسِ', example: 'I feel thirsty (أنا أشعر بالعطش)' },
          { tool: 'have + illness', usage: 'لِلتَّعْبِيرِ عَنِ التَّعَبِ', example: 'I have a headache (عندي صداع)' },
          { tool: 'Can I have...?', usage: 'لِلطَّلَبِ الْمُهَذَّبِ', example: 'Can I have some water, please?' }
        ],
        goldenRule: 'لِتَحْوِيلِ الشُّعُورِ إِلَى صِفَةٍ: نضيف un- مِثْلَ: happy -> unhappy!'
      }
    };
  }

  // 1. Search Poems (only if not a math query)
  if (!isMathQuery && curriculumReferenceData?.poems) {
    const matchedPoem = curriculumReferenceData.poems.find((p) => {
      const normTitle = normalizeArabic(p.title);
      if (normTitle && normTitle.length >= 3 && (normQuery.includes(normTitle) || normTitle.includes(normQuery))) return true;
      if (p.keywords?.some((k) => {
        const normK = normalizeArabic(k);
        if (!normK || STOP_WORDS.has(normK) || normK.length < 3) return false;
        return normQuery.includes(normK);
      })) return true;
      return p.verses?.some((v) => {
        const normV1 = normalizeArabic(v.first);
        const normV2 = normalizeArabic(v.second);
        return (normV1 && normV1.length >= 4 && normQuery.includes(normV1)) || (normV2 && normV2.length >= 4 && normQuery.includes(normV2));
      });
    });
    if (matchedPoem) {
      return {
        type: 'poem',
        title: matchedPoem.title,
        unitTitle: matchedPoem.unitTitle,
        badgeLabel: 'نَشِيدٌ مَدْرَسِيٌّ رَسْمِيٌّ 🎵',
        data: matchedPoem
      };
    }
  }

  // 2. Search Grammar Rules (strictly avoid stop words like "في" or "من")
  if (!isMathQuery && curriculumReferenceData?.grammarRules) {
    const matchedGrammar = curriculumReferenceData.grammarRules.find((g) => {
      const normTitle = normalizeArabic(g.title);
      // Require title match or specific multi-character keyword match
      if (normTitle && normTitle.length >= 4 && normQuery.includes(normTitle)) return true;
      return g.keywords?.some((k) => {
        const normK = normalizeArabic(k);
        if (!normK || STOP_WORDS.has(normK) || normK.length < 3) return false;
        // Require keyword match as a distinct word or prominent phrase
        return normQuery.includes(normK);
      });
    });
    if (matchedGrammar) {
      return {
        type: 'grammar',
        title: matchedGrammar.title,
        unitTitle: matchedGrammar.unitTitle,
        badgeLabel: 'قَاعِدَةٌ نَحْوِيَّةٌ مُقَرَّرَةٌ ✍️',
        data: matchedGrammar
      };
    }
  }

  // 3. Search Stories and Reading Passages
  if (!isMathQuery && curriculumReferenceData?.storiesAndReading) {
    const matchedStory = curriculumReferenceData.storiesAndReading.find((s) => {
      const normTitle = normalizeArabic(s.title);
      if (normTitle && normTitle.length >= 4 && normQuery.includes(normTitle)) return true;
      return s.keywords?.some((k) => {
        const normK = normalizeArabic(k);
        if (!normK || STOP_WORDS.has(normK) || normK.length < 3) return false;
        return normQuery.includes(normK);
      });
    });
    if (matchedStory) {
      return {
        type: 'story',
        title: matchedStory.title,
        unitTitle: matchedStory.unitTitle,
        badgeLabel: 'قِصَّةُ قِرَاءَةٍ وَاسْتِمَاعٍ 📖',
        data: matchedStory
      };
    }
  }

  // 4. Search Spelling Rules
  if (!isMathQuery && curriculumReferenceData?.spellingRules) {
    const matchedSpelling = curriculumReferenceData.spellingRules.find((sp) => {
      const normTitle = normalizeArabic(sp.title);
      if (normTitle && normTitle.length >= 4 && normQuery.includes(normTitle)) return true;
      return sp.keywords?.some((k) => {
        const normK = normalizeArabic(k);
        if (!normK || STOP_WORDS.has(normK) || normK.length < 3) return false;
        return normQuery.includes(normK);
      });
    });
    if (matchedSpelling) {
      return {
        type: 'spelling',
        title: matchedSpelling.title,
        badgeLabel: 'قَاعِدَةٌ إِمْلائِيَّةٌ ✏️',
        data: matchedSpelling
      };
    }
  }

  return null;
}

export const RobotTutorChat: React.FC<RobotTutorChatProps> = ({
  isOpen,
  onClose,
  profile,
  currentLesson,
  initialQuery
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'poems' | 'grammar' | 'stories' | 'spelling'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isGirl = profile.heroType === 'girl';
  const studentName = profile.name?.trim() || (isGirl ? 'بَطَلَتَنَا' : 'بَطَلَنَا');
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [activeReaderMsgId, setActiveReaderMsgId] = useState<string | null>(null);

  // Listen for audio stop events
  useEffect(() => {
    const handleGlobalStop = () => {
      setSpeakingMsgId(null);
    };
    window.addEventListener('al-talib-audio-stopped', handleGlobalStop);
    return () => {
      window.removeEventListener('al-talib-audio-stopped', handleGlobalStop);
      stopSpeaking();
    };
  }, []);

  const handleToggleSpeak = (msgId: string, text: string) => {
    if (speakingMsgId === msgId) {
      stopSpeaking();
      setSpeakingMsgId(null);
    } else {
      sounds.playClick();
      setSpeakingMsgId(msgId);
      speakArabic(
        text,
        () => setSpeakingMsgId(null),
        () => setSpeakingMsgId(msgId)
      );
    }
  };

  const handleToggleReader = (msgId: string) => {
    sounds.playButtonTap();
    stopSpeaking();
    setSpeakingMsgId(null);
    setActiveReaderMsgId(activeReaderMsgId === msgId ? null : msgId);
  };

  // Initialize with friendly welcome
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeText = isGirl
        ? `أَهْلاً بِكِ يَا بَطَلَتَنَا الرَّائِعَةَ ${studentName}! 🌟
أَنَا «الرُّوبُوتُ الْمُعَلِّمُ الذَّكِيُّ» لِجَمِيعِ مَوَادِّ الصَّفِّ الثَّالِثِ الِابْتِدَائِيِّ:
🧮 الرِّيَاضِيَّاتُ (جَدَاوِلُ الضَّرْبِ، الْقِسْمَةُ، الْكُسُورُ، الْوَقْتُ، وَالأَشْكَالُ الْهَنْدَسِيَّةُ)
🔤 اللُّغَةُ الإِنْجِلِيزِيَّةُ Connect 3 (مَعَانِي الْكَلِمَاتِ، نُطْقُ الْفُونِكْس، وَالْقَوَاعِدُ)
📖 اللُّغَةُ الْعَرَبِيَّةُ (الأَنَاشِيدُ، الْقِصَصُ، الْقَوَاعِدُ النَّحْوِيَّةُ، وَالإِمْلَاءُ)

اكْتُبِي لِي أَيَّ مَسْأَلَةٍ أَوْ كَلِمَةٍ، وَسَأَقُومُ بِشَرْحِهَا لَكِ خُطْوَةً بِخُطْوَةٍ كَمُعَلِّمِكِ الْمُحِبِّ! 🤖✨`
        : `أَهْلاً بِكَ يَا بَطَلَنَا الشُّجَاعَ ${studentName}! 🌟
أَنَا «الرُّوبُوتُ الْمُعَلِّمُ الذَّكِيُّ» لِجَمِيعِ مَوَادِّ الصَّفِّ الثَّالِثِ الِابْتِدَائِيِّ:
🧮 الرِّيَاضِيَّاتُ (جَدَاوِلُ الضَّرْبِ، الْقِسْمَةُ، الْكُسُورُ، الْوَقْتُ، وَالأَشْكَالُ الْهَنْدَسِيَّةُ)
🔤 اللُّغَةُ الإِنْجِلِيزِيَّةُ Connect 3 (مَعَانِي الْكَلِمَاتِ، نُطْقُ الْفُونِكْس، وَالْقَوَاعِدُ)
📖 اللُّغَةُ الْعَرَبِيَّةُ (الأَنَاشِيدُ، الْقِصَصُ، الْقَوَاعِدُ النَّحْوِيَّةُ، وَالإِمْلَاءُ)

اكْتُبْ لِي أَيَّ مَسْأَلَةٍ أَوْ كَلِمَةٍ، وَسَأَقُومُ بِشَرْحِهَا لَكَ خُطْوَةً بِخُطْوَةٍ كَمُعَلِّمِكَ الْمُحِبِّ! 🤖✨`;

      setMessages([
        {
          id: 'msg-welcome',
          sender: 'tutor',
          text: welcomeText,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    }
  }, [profile.name, profile.heroType]);

  // Handle passed initial query
  useEffect(() => {
    if (initialQuery && isOpen) {
      handleSendMessage(initialQuery);
    }
  }, [initialQuery, isOpen]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const message = (textToSend || inputText).trim();
    if (!message || isLoading) return;

    sounds.playButtonTap();
    const userMsgId = `user-${Date.now()}`;
    const newMsg: ChatMessage = {
      id: userMsgId,
      sender: 'user',
      text: message,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');
    setIsLoading(true);

    // Precise retrieval from local curriculum JSON reference
    const matchedCurriculumCard = retrieveFromCurriculumReference(message);

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message,
          studentName: profile.name,
          heroType: profile.heroType,
          currentLessonTitle: currentLesson?.title || 'عام',
          unitTitle: currentLesson?.unitId ? `الوحدة ${currentLesson.unitId}` : 'منهج الصف الثالث الابتدائي',
          curriculumContext: matchedCurriculumCard ? matchedCurriculumCard.data : undefined
        })
      });

      if (!response.ok) throw new Error('API response not ok');
      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        {
          id: `tutor-${Date.now()}`,
          sender: 'tutor',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          curriculumCard: matchedCurriculumCard || undefined
        }
      ]);
      sounds.playCheerSuccess();
    } catch (err) {
      const praise = isGirl 
        ? `أَحْسَنْتِ يَا بَطَلَتَنَا ${studentName}! ⭐` 
        : `أَحْسَنْتَ يَا بَطَلَنَا ${studentName}! ⭐`;

      let fallbackReply = '';
      if (matchedCurriculumCard) {
        const c = matchedCurriculumCard.data;
        if (matchedCurriculumCard.type === 'poem') {
          fallbackReply = `${praise}\nطَلَبْتَ «${c.title}» مِنْ كِتَابِ الْوَزَارَةِ (${c.unitTitle})، وَإِلَيْكَ الأَبْيَاتَ كَامِلَةً بِالتَّشْكِيلِ:\n\n${c.fullText}`;
          if (c.vocabulary && c.vocabulary.length > 0) {
            fallbackReply += '\n\n📚 أَهَمُّ الْمُفْرَدَاتِ:\n' + c.vocabulary.map((v: any) => `• ${v.word}: ${v.meaning || ''} ${v.opposite ? `(مضادها: ${v.opposite})` : ''} ${v.plural ? `(جمعها: ${v.plural})` : ''}`).join('\n');
          }
          if (c.moral) {
            fallbackReply += `\n\n💡 الْعِبْرَةُ وَالْفَائِدَةُ:\n${c.moral}`;
          }
        } else if (matchedCurriculumCard.type === 'grammar') {
          fallbackReply = `${praise}\nإِلَيْكَ قَاعِدَةَ «${c.title}» كَمَا هِيَ مُقَرَّرَةٌ فِي كِتَابِ الْوَزَارَةِ:\n${c.summary}\n\n`;
          if (c.tools) {
            fallbackReply += '📝 الأَدَوَاتُ وَالأَمْثِلَةُ:\n' + c.tools.map((t: any) => `• ${t.tool || t.type}: ${t.usage || t.meaning} -> ${t.example || t.examples || ''}`).join('\n');
          }
          if (c.goldenRule) {
            fallbackReply += `\n\n⭐ الْقَاعِدَةُ الذَّهَبِيَّةُ:\n${c.goldenRule}`;
          }
        } else if (matchedCurriculumCard.type === 'story') {
          fallbackReply = `${praise}\nإِلَيْكَ دَرْسَ «${c.title}» مِنْ كِتَابِ الْوَزَارَةِ (${c.unitTitle}):\n\n${c.fullPassage}`;
          if (c.vocabulary && c.vocabulary.length > 0) {
            fallbackReply += '\n\n📚 أَهَمُّ مُفْرَدَاتِ الدَّرْسِ:\n' + c.vocabulary.map((v: any) => `• ${v.word}: ${v.meaning || ''} ${v.opposite ? `(مضادها: ${v.opposite})` : ''} ${v.plural ? `(جمعها: ${v.plural})` : ''}`).join('\n');
          }
          if (c.moral) {
            fallbackReply += `\n\n💡 الدَّرْسُ الْمُسْتَفَادُ:\n${c.moral}`;
          }
        } else if (matchedCurriculumCard.type === 'spelling') {
          fallbackReply = `${praise}\nإِلَيْكَ قَاعِدَةَ «${c.title}» الإِمْلائِيَّةَ:\n${c.summary}`;
        }
      } else {
        const legacyMatch = findCurriculumMatch(message);
        if (legacyMatch) {
          fallbackReply = `${praise}\nطَلَبْتَ «${legacyMatch.title}» مِنْ كِتَابِ الْوَزَارَةِ (${legacyMatch.unit})، وَإِلَيْكَ تَفَاصِيلَهُ كَامِلَةً بِالتَّشْكِيلِ:\n\n${legacyMatch.fullText}`;
          if (legacyMatch.vocabulary && legacyMatch.vocabulary.length > 0) {
            fallbackReply += '\n\n📚 أَهَمُّ الْمُفْرَدَاتِ:\n' + legacyMatch.vocabulary.map(v => `• ${v.word}: ${v.meaning || ''} ${v.opposite ? `(مضادها: ${v.opposite})` : ''} ${v.plural ? `(جمعها: ${v.plural})` : ''}`).join('\n');
          }
          if (legacyMatch.moralOrRule) {
            fallbackReply += `\n\n💡 الْفَائِدَةُ وَالْقَاعِدَةُ:\n${legacyMatch.moralOrRule}`;
          }
        } else {
          fallbackReply = `${praise}
أَنَا هُنَا مَعَكَ دَائِماً لِمُسَاعَدَتِكَ فِي أَيِّ سُؤَالٍ! 🤖
هَلْ تَقْصِدُ سُؤَالاً عَنْ دَرْسٍ مُعَيَّنٍ (مِثْلَ: قِصَّةِ «الْبَطَلِ الْخَفِيِّ»، أَوْ نَشِيدِ «أَصْحَابِ الْمِهَنِ»، أَوْ نَشِيدِ «أَخْلَاقُنَا»، أَوْ دَرْسِ «ازْرَعْ نَبْتَةً»)؟
أَمْ تُرِيدُ شَرْحَ قَاعِدَةٍ مِثْلَ (أَدَوَاتِ الاسْتِفْهَامِ، أُسْلُوبِ النَّفْيِ بـ لَمْ وَلَنْ، حُرُوفِ الْجَرِّ وَالْعَطْفِ، أَوْ أَسْمَاءِ الإِشَارَةِ)؟
اكْتُبْ لِي كَلِمَةً مِنْ دَرْسِكَ أَوْ رَقَمَ الصَّفْحَةِ، وَسَأَقُومُ بِشَرْحِهِ لَكَ شَرْحاً مُلَخَّصاً وَتَفْصِيلِيّاً مَعاً فَوْراً! ⭐`;
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `tutor-${Date.now()}`,
          sender: 'tutor',
          text: fallbackReply,
          timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' }),
          curriculumCard: matchedCurriculumCard || undefined
        }
      ]);
      sounds.playCheerSuccess();
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      id="robot-tutor-dialog-root"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-4 bg-stone-900/50 backdrop-blur-xs"
    >
      <div 
        id="robot-tutor-container"
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border-4 border-purple-300 flex flex-col h-[650px] max-h-[94vh] overflow-hidden"
      >
        {/* Tutor Header */}
        <div className="bg-gradient-to-r from-purple-700 via-indigo-600 to-purple-800 p-4 text-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-2xl shadow-inner animate-bounce duration-1000">
              🤖
            </div>
            <div>
              <div className="flex items-center gap-1.5 flex-wrap">
                <h3 className="font-black text-base md:text-lg">
                  الْمُعَلِّمُ الآلِيُّ الذَّكِيُّ
                </h3>
                <span className="flex items-center gap-0.5 text-[10px] bg-amber-400 text-amber-950 font-black px-2 py-0.5 rounded-full shadow-2xs">
                  <Sparkles className="w-3 h-3 fill-amber-950" />
                  <span>مَرْجِعُ الْوَزَارَةِ JSON</span>
                </span>
              </div>
              <p className="text-[11px] text-purple-200 font-bold flex items-center gap-1 mt-0.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>مَنْهَجُ الصَّفِّ الثَّالِثِ - إِعْدَادُ الأُسْتَاذِ شَرِيف عَسْقَلَانِي</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {speakingMsgId && (
              <button
                type="button"
                onClick={() => {
                  stopSpeaking();
                  setSpeakingMsgId(null);
                }}
                className="flex items-center gap-1.5 bg-rose-500 hover:bg-rose-600 text-white font-black text-xs px-3 py-1.5 rounded-xl shadow-md animate-pulse transition"
                title="إيقاف الصوت فوراً"
              >
                <VolumeX className="w-4 h-4" />
                <span>إِيقَافُ الصَّوْتِ 🛑</span>
              </button>
            )}

            <button
              id="close-tutor-modal-btn"
              onClick={() => {
                stopSpeaking();
                setSpeakingMsgId(null);
                sounds.playClick();
                onClose();
              }}
              className="p-2 rounded-xl bg-white/15 hover:bg-white/30 transition text-white"
              title="إغلاق المحادثة"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Personalized Student & Curriculum Bar */}
        <div className="bg-purple-50/90 border-b border-purple-100 px-4 py-2 flex items-center justify-between text-xs font-bold text-purple-900">
          <div className="flex items-center gap-2">
            <span className="text-base">{isGirl ? '👧' : '👦'}</span>
            <span>الْبَطَلُ الْحَالِيُّ: <span className="text-purple-700 font-black">{studentName}</span></span>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <Check className="w-3 h-3 text-emerald-600" />
              <span>استرجاع رسمي دقيق</span>
            </span>
            <span className="text-[11px] text-purple-600 bg-white px-2 py-0.5 rounded-full border border-purple-200">
              {profile.totalStars} ⭐ نَجْمَة
            </span>
          </div>
        </div>

        {/* Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
          {messages.map((m) => {
            const isTutor = m.sender === 'tutor';
            const card = m.curriculumCard;

            return (
              <div
                key={m.id}
                className={`flex gap-2.5 ${isTutor ? 'justify-start' : 'justify-end'}`}
              >
                {isTutor && (
                  <div className="w-9 h-9 rounded-2xl bg-purple-100 border-2 border-purple-300 flex items-center justify-center text-lg shrink-0 shadow-xs">
                    🤖
                  </div>
                )}
                
                <div
                  className={`max-w-[88%] rounded-2xl p-4 text-sm md:text-base leading-[2.2] text-right font-medium font-naskh shadow-xs ${
                    isTutor
                      ? 'bg-white border-2 border-purple-200 text-stone-900 rounded-tr-none'
                      : 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{m.text}</p>

                  {/* Grounded Curriculum Reference Card */}
                  {isTutor && card && (
                    <div className="mt-3 p-3.5 bg-gradient-to-br from-amber-50/70 via-purple-50/40 to-stone-50 rounded-2xl border-2 border-amber-300 text-stone-900 shadow-xs space-y-3">
                      {/* Card Header */}
                      <div className="flex items-center justify-between gap-2 border-b border-amber-200 pb-2 flex-wrap">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs bg-purple-700 text-white font-black px-2 py-0.5 rounded-lg shadow-2xs">
                            {card.badgeLabel}
                          </span>
                          <h4 className="font-black text-purple-950 text-sm md:text-base">
                            «{card.title}»
                          </h4>
                        </div>
                        {card.unitTitle && (
                          <span className="text-[11px] font-bold text-amber-800 bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-300">
                            {card.unitTitle}
                          </span>
                        )}
                      </div>

                      {/* Poetry Card Layout */}
                      {card.type === 'poem' && card.data?.verses && (
                        <div className="space-y-2 bg-white/90 p-3 rounded-xl border border-amber-200">
                          <p className="text-xs text-amber-900 font-bold mb-1">📜 أَبْيَاتُ النَّشِيدِ كَمَا وَرَدَتْ فِي كِتَابِ الْوَزَارَةِ:</p>
                          <div className="space-y-1.5 font-bold text-sm md:text-base text-stone-800">
                            {card.data.verses.map((v: any, idx: number) => (
                              <div key={idx} className="flex items-center justify-between gap-2 p-1.5 bg-purple-50/50 rounded-lg text-xs md:text-sm">
                                <span className="text-purple-900 flex-1 text-right">{v.first}</span>
                                <span className="text-amber-500 font-black px-1">...</span>
                                <span className="text-indigo-900 flex-1 text-left">{v.second}</span>
                              </div>
                            ))}
                          </div>

                          {card.data.vocabulary && card.data.vocabulary.length > 0 && (
                            <div className="mt-2 pt-2 border-t border-amber-100">
                              <p className="text-xs text-purple-900 font-bold mb-1.5">📚 مُفْرَدَاتُ النَّشِيدِ الْمُقَرَّرَةُ:</p>
                              <div className="flex flex-wrap gap-1.5">
                                {card.data.vocabulary.map((vocab: any, vIdx: number) => (
                                  <span key={vIdx} className="text-xs bg-purple-100 text-purple-950 px-2 py-0.5 rounded-lg border border-purple-200 font-medium">
                                    <strong className="text-purple-800">{vocab.word}</strong>: {vocab.meaning}
                                    {vocab.opposite && ` (مضاد: ${vocab.opposite})`}
                                    {vocab.plural && ` (جمع: ${vocab.plural})`}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {card.data.moral && (
                            <div className="mt-2 p-2 bg-amber-100/70 text-amber-950 rounded-lg text-xs font-bold border border-amber-300 flex items-start gap-1.5">
                              <Lightbulb className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                              <span>الْعِبْرَةُ: {card.data.moral}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Grammar Card Layout */}
                      {card.type === 'grammar' && (
                        <div className="space-y-2 bg-white/90 p-3 rounded-xl border border-amber-200">
                          <p className="text-xs text-purple-900 font-bold">{card.data?.summary}</p>

                          {card.data?.tools && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                              {card.data.tools.map((toolItem: any, tIdx: number) => (
                                <div key={tIdx} className="p-2 bg-purple-50/70 border border-purple-200 rounded-xl text-xs space-y-1">
                                  <div className="font-black text-purple-900 flex items-center gap-1">
                                    <span className="w-2 h-2 rounded-full bg-purple-600" />
                                    <span>{toolItem.tool || toolItem.type}</span>
                                  </div>
                                  <p className="text-stone-600">{toolItem.usage || toolItem.meaning}</p>
                                  {(toolItem.example || toolItem.examples) && (
                                    <p className="font-bold text-amber-900 bg-amber-50 p-1 rounded border border-amber-200 text-[11px]">
                                      مِثْلَ: {toolItem.example || toolItem.examples}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}

                          {card.data?.goldenRule && (
                            <div className="mt-2 p-2.5 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs">
                              <Star className="w-4 h-4 fill-white" />
                              <span>الْقَاعِدَةُ الذَّهَبِيَّةُ: {card.data.goldenRule}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Story Card Layout */}
                      {card.type === 'story' && (
                        <div className="space-y-2 bg-white/90 p-3 rounded-xl border border-amber-200 text-xs">
                          {card.data?.characters && (
                            <div className="flex flex-wrap gap-1 mb-1">
                              <span className="font-bold text-stone-700">شَخْصِيَّاتُ الْقِصَّةِ:</span>
                              {card.data.characters.map((c: any, cIdx: number) => (
                                <span key={cIdx} className="bg-indigo-50 text-indigo-900 px-2 py-0.5 rounded border border-indigo-200 font-bold">
                                  {c.name}: {c.role}
                                </span>
                              ))}
                            </div>
                          )}
                          {card.data?.moral && (
                            <div className="p-2 bg-emerald-50 text-emerald-950 rounded-lg font-bold border border-emerald-300 flex items-center gap-1.5">
                              <Award className="w-4 h-4 text-emerald-600 shrink-0" />
                              <span>الْفَائِدَةُ: {card.data.moral}</span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-stone-100/50 text-[11px] opacity-85 flex-wrap gap-2">
                    <span>{m.timestamp}</span>
                    {isTutor && (
                      <div className="flex items-center gap-1.5">
                        {/* Interactive Phonics & Sentence-by-Sentence Highlighting Reader */}
                        <button
                          type="button"
                          onClick={() => handleToggleReader(m.id)}
                          className={`flex items-center gap-1 font-black px-2.5 py-1 rounded-lg transition shadow-2xs ${
                            activeReaderMsgId === m.id
                              ? 'bg-amber-600 text-white'
                              : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                          }`}
                          title="قراءة نموذجية مفسرة مع تظليل كل جملة يقرؤها الروبوت"
                        >
                          <BookMarked className="w-3.5 h-3.5 text-amber-700" />
                          <span>{activeReaderMsgId === m.id ? 'إِغْلاقُ الْقَارِئِ' : 'قَارِئُ الْجُمَلِ الْمُعَبِّرُ 📖✨'}</span>
                        </button>

                        {/* Quick Audio Speech Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleSpeak(m.id, m.text)}
                          className={`flex items-center gap-1 font-bold px-2.5 py-1 rounded-lg transition shadow-2xs ${
                            speakingMsgId === m.id
                              ? 'bg-rose-500 text-white animate-pulse'
                              : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                          }`}
                          title="استماع سريع"
                        >
                          {speakingMsgId === m.id ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5" />
                              <span>إِيقَافٌ</span>
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" />
                              <span>اسْتَمِعْ 🔊</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Embedded Interactive Reader */}
                  {isTutor && activeReaderMsgId === m.id && (
                    <div className="mt-3 pt-3 border-t border-purple-200">
                      <InteractiveCurriculumReader
                        text={m.text}
                        title={card ? `مُشَغِّلُ الْقِرَاءَةِ النَّمُوذَجِيَّةِ لِـ «${card.title}»` : "مُشَغِّلُ الْقِرَاءَةِ النَّمُوذَجِيَّةِ لِلدَّرْسِ"}
                      />
                    </div>
                  )}
                </div>

                {!isTutor && (
                  <div className="w-9 h-9 rounded-2xl bg-amber-200 border-2 border-amber-400 flex items-center justify-center text-lg shrink-0 shadow-xs">
                    {profile.avatar === 'girl_hero' ? '👧' : '👦'}
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex items-center gap-2.5 text-purple-700 text-xs font-bold p-3 bg-purple-50 border border-purple-200 rounded-2xl w-fit shadow-xs">
              <Loader2 className="w-4 h-4 animate-spin text-purple-600" />
              <span>الرُّوبُوتُ يَسْتَرْجِعُ مِن مَرْجِعِ كِتَابِ الْوَزَارَةِ JSON وَيُجَهِّزُ التَّشْجِيعَ لِـ {studentName}...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Structured Curriculum Category Tabs */}
        <div className="px-3 pt-2 bg-stone-100 border-t border-stone-200">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin text-xs font-bold">
            <span className="text-stone-500 font-bold shrink-0 flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-purple-600" />
              <span>مَرْجِعُ الْمَنْهَجِ:</span>
            </span>

            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-2.5 py-1 rounded-xl transition shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-purple-700 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200'
              }`}
            >
              الْكُلُّ 🌟
            </button>

            <button
              onClick={() => setSelectedCategory('poems')}
              className={`px-2.5 py-1 rounded-xl transition shrink-0 ${
                selectedCategory === 'poems'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200'
              }`}
            >
              الأَنَاشِيدُ 🎵
            </button>

            <button
              onClick={() => setSelectedCategory('grammar')}
              className={`px-2.5 py-1 rounded-xl transition shrink-0 ${
                selectedCategory === 'grammar'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200'
              }`}
            >
              الْقَوَاعِدُ ✍️
            </button>

            <button
              onClick={() => setSelectedCategory('stories')}
              className={`px-2.5 py-1 rounded-xl transition shrink-0 ${
                selectedCategory === 'stories'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200'
              }`}
            >
              الْقَصَصُ 📖
            </button>

            <button
              onClick={() => setSelectedCategory('spelling')}
              className={`px-2.5 py-1 rounded-xl transition shrink-0 ${
                selectedCategory === 'spelling'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white text-stone-700 hover:bg-stone-200'
              }`}
            >
              الإِمْلَاءُ ✏️
            </button>
          </div>
        </div>

        {/* Dynamic Chips based on Selected Category */}
        <div className="px-3 py-2 bg-stone-50 border-t border-stone-200/80 flex items-center gap-1.5 overflow-x-auto text-xs whitespace-nowrap scrollbar-thin">
          {selectedCategory === 'all' && (
            <>
              <button
                onClick={() => handleSendMessage('قولي درس البطل الخفي بالتفصيل')}
                className="flex items-center gap-1 bg-white hover:bg-purple-100 text-purple-900 px-3 py-1.5 rounded-xl border border-purple-200 font-bold shadow-2xs transition active:scale-95"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>الْبَطَلُ الْخَفِيُّ 🛡️</span>
              </button>

              <button
                onClick={() => handleSendMessage('أريد كلمات نشيد أصحاب المهن بالتشكيل')}
                className="flex items-center gap-1 bg-white hover:bg-amber-100 text-amber-900 px-3 py-1.5 rounded-xl border border-amber-200 font-bold shadow-2xs transition active:scale-95"
              >
                <Music className="w-3.5 h-3.5 text-amber-600" />
                <span>أَصْحَابُ الْمِهَنِ 📜</span>
              </button>

              <button
                onClick={() => handleSendMessage('أريد كلمات نشيد أخلاقنا')}
                className="flex items-center gap-1 bg-white hover:bg-emerald-100 text-emerald-900 px-3 py-1.5 rounded-xl border border-emerald-200 font-bold shadow-2xs transition active:scale-95"
              >
                <Star className="w-3.5 h-3.5 text-emerald-600" />
                <span>نَشِيدُ أَخْلَاقُنَا 🌟</span>
              </button>

              <button
                onClick={() => handleSendMessage('اشرح لي قاعدة أسلوب النفي بـ لم ولن')}
                className="flex items-center gap-1 bg-white hover:bg-blue-100 text-blue-900 px-3 py-1.5 rounded-xl border border-blue-200 font-bold shadow-2xs transition active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>شَرْحُ النَّفْيِ 💡</span>
              </button>

              <button
                onClick={() => handleSendMessage('ما هي أدوات الاستفهام المقررة علينا؟')}
                className="flex items-center gap-1 bg-white hover:bg-rose-100 text-rose-900 px-3 py-1.5 rounded-xl border border-rose-200 font-bold shadow-2xs transition active:scale-95"
              >
                <HelpCircle className="w-3.5 h-3.5 text-rose-600" />
                <span>أَدَوَاتُ الاسْتِفْهَامِ ❓</span>
              </button>
            </>
          )}

          {selectedCategory === 'poems' && (
            <>
              <button
                onClick={() => handleSendMessage('أريد كلمات نشيد أسرار النجاح بالتشكيل')}
                className="flex items-center gap-1 bg-white hover:bg-amber-100 text-amber-950 px-3 py-1.5 rounded-xl border border-amber-300 font-bold shadow-2xs transition active:scale-95"
              >
                <Music className="w-3.5 h-3.5 text-amber-600" />
                <span>أَسْرَارُ النَّجَاحِ ⭐</span>
              </button>
              <button
                onClick={() => handleSendMessage('أريد كلمات نشيد أصحاب المهن بالتشكيل')}
                className="flex items-center gap-1 bg-white hover:bg-amber-100 text-amber-950 px-3 py-1.5 rounded-xl border border-amber-300 font-bold shadow-2xs transition active:scale-95"
              >
                <Music className="w-3.5 h-3.5 text-amber-600" />
                <span>أَصْحَابُ الْمِهَنِ 📜</span>
              </button>
              <button
                onClick={() => handleSendMessage('أريد كلمات نشيد أخلاقنا بالتشكيل')}
                className="flex items-center gap-1 bg-white hover:bg-amber-100 text-amber-950 px-3 py-1.5 rounded-xl border border-amber-300 font-bold shadow-2xs transition active:scale-95"
              >
                <Music className="w-3.5 h-3.5 text-amber-600" />
                <span>أَخْلَاقُنَا 🌟</span>
              </button>
              <button
                onClick={() => handleSendMessage('أريد كلمات نشيد وطني بالتشكيل')}
                className="flex items-center gap-1 bg-white hover:bg-amber-100 text-amber-950 px-3 py-1.5 rounded-xl border border-amber-300 font-bold shadow-2xs transition active:scale-95"
              >
                <Music className="w-3.5 h-3.5 text-amber-600" />
                <span>نَشِيدُ وَطَنِي 🇪🇬</span>
              </button>
              <button
                onClick={() => handleSendMessage('أريد كلمات نشيد بلادي سلمت بالتشكيل')}
                className="flex items-center gap-1 bg-white hover:bg-amber-100 text-amber-950 px-3 py-1.5 rounded-xl border border-amber-300 font-bold shadow-2xs transition active:scale-95"
              >
                <Music className="w-3.5 h-3.5 text-amber-600" />
                <span>بِلَادِي سَلِمْتِ 🛡️</span>
              </button>
            </>
          )}

          {selectedCategory === 'grammar' && (
            <>
              <button
                onClick={() => handleSendMessage('ما هي أدوات الاستفهام المقررة علينا وكيف نستخدمها؟')}
                className="flex items-center gap-1 bg-white hover:bg-blue-100 text-blue-950 px-3 py-1.5 rounded-xl border border-blue-300 font-bold shadow-2xs transition active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>أَدَوَاتُ الاسْتِفْهَامِ ❓</span>
              </button>
              <button
                onClick={() => handleSendMessage('اشرح لي قاعدة أسلوب النفي بـ لم ولن')}
                className="flex items-center gap-1 bg-white hover:bg-blue-100 text-blue-950 px-3 py-1.5 rounded-xl border border-blue-300 font-bold shadow-2xs transition active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>أُسْلُوبُ النَّفْيِ (لَمْ وَ لَنْ) 💡</span>
              </button>
              <button
                onClick={() => handleSendMessage('اشرح حروف الجر عن وعلى مع الأمثلة')}
                className="flex items-center gap-1 bg-white hover:bg-blue-100 text-blue-950 px-3 py-1.5 rounded-xl border border-blue-300 font-bold shadow-2xs transition active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>حُرُوفُ الْجَرِّ (عَنْ وَ عَلَى) 📍</span>
              </button>
              <button
                onClick={() => handleSendMessage('اشرح حروف العطف فـ وثم')}
                className="flex items-center gap-1 bg-white hover:bg-blue-100 text-blue-950 px-3 py-1.5 rounded-xl border border-blue-300 font-bold shadow-2xs transition active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>حُرُوفُ الْعَطْفِ (فَـ وَ ثُمَّ) 🔗</span>
              </button>
              <button
                onClick={() => handleSendMessage('اشرح درس المفرد والمثنى والجمع')}
                className="flex items-center gap-1 bg-white hover:bg-blue-100 text-blue-950 px-3 py-1.5 rounded-xl border border-blue-300 font-bold shadow-2xs transition active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>الْمُفْرَدُ وَالْمُثَنَّى وَالْجَمْعُ 👥</span>
              </button>
              <button
                onClick={() => handleSendMessage('اشرح أسماء الإشارة هؤلاء وأولئك')}
                className="flex items-center gap-1 bg-white hover:bg-blue-100 text-blue-950 px-3 py-1.5 rounded-xl border border-blue-300 font-bold shadow-2xs transition active:scale-95"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>أَسْمَاءُ الإِشَارَةِ (هَؤُلَاءِ / أُولَئِكَ) 👈</span>
              </button>
            </>
          )}

          {selectedCategory === 'stories' && (
            <>
              <button
                onClick={() => handleSendMessage('قولي قصة البطل الخفي بالتفصيل')}
                className="flex items-center gap-1 bg-white hover:bg-emerald-100 text-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-300 font-bold shadow-2xs transition active:scale-95"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>الْبَطَلُ الْخَفِيُّ (الْعَمُّ أَمِينٌ) 🛡️</span>
              </button>
              <button
                onClick={() => handleSendMessage('احكي لي قصة الزهرة والصبار')}
                className="flex items-center gap-1 bg-white hover:bg-emerald-100 text-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-300 font-bold shadow-2xs transition active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>الزَّهْرَةُ وَالصَّبَّارُ 🌵</span>
              </button>
              <button
                onClick={() => handleSendMessage('احكي لي قصة صندوق الابتكار')}
                className="flex items-center gap-1 bg-white hover:bg-emerald-100 text-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-300 font-bold shadow-2xs transition active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>صُنْدُوقُ الِابْتِكَارِ 📦</span>
              </button>
              <button
                onClick={() => handleSendMessage('احكي لي قصة ورقة من التاريخ')}
                className="flex items-center gap-1 bg-white hover:bg-emerald-100 text-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-300 font-bold shadow-2xs transition active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>وَرَقَةٌ مِنَ التَّارِيخِ 📜</span>
              </button>
              <button
                onClick={() => handleSendMessage('احكي لي قصة ازرع نبتة')}
                className="flex items-center gap-1 bg-white hover:bg-emerald-100 text-emerald-950 px-3 py-1.5 rounded-xl border border-emerald-300 font-bold shadow-2xs transition active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" />
                <span>ازْرَعْ نَبْتَةً 🌱</span>
              </button>
            </>
          )}

          {selectedCategory === 'spelling' && (
            <>
              <button
                onClick={() => handleSendMessage('اشرح قاعدة اللام الشمسية واللام القمرية')}
                className="flex items-center gap-1 bg-white hover:bg-rose-100 text-rose-950 px-3 py-1.5 rounded-xl border border-rose-300 font-bold shadow-2xs transition active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span>اللَّامُ الشَّمْسِيَّةُ وَالْقَمَرِيَّةُ ☀️🌙</span>
              </button>
              <button
                onClick={() => handleSendMessage('اشرح أنواع التنوين الثلاثة')}
                className="flex items-center gap-1 bg-white hover:bg-rose-100 text-rose-950 px-3 py-1.5 rounded-xl border border-rose-300 font-bold shadow-2xs transition active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span>التَّنْوِينُ (فَتْحٌ، ضَمٌّ، كَسْرٌ) ✏️</span>
              </button>
              <button
                onClick={() => handleSendMessage('اشرح الفرق بين التاء المربوطة والمفتوحة والهاء')}
                className="flex items-center gap-1 bg-white hover:bg-rose-100 text-rose-950 px-3 py-1.5 rounded-xl border border-rose-300 font-bold shadow-2xs transition active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-rose-600" />
                <span>التَّاءُ الْمَرْبُوطَةُ وَالْمَفْتُوحَةُ 🎯</span>
              </button>
            </>
          )}
        </div>

        {/* Input Bar with Icons */}
        <div className="p-3 bg-white border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              id="tutor-chat-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="اطْلُبْ أَيَّ نَشِيدٍ أَوْ قَاعِدَةٍ نَحْوِيَّةٍ أَوْ قِصَّةٍ مِنْ كِتَابِ الْوَزَارَةِ..."
              className="flex-1 px-4 py-2.5 bg-stone-50 border-2 border-stone-200 rounded-2xl text-sm font-bold text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-purple-500 focus:bg-white transition text-right shadow-inner"
            />
            <button
              id="send-tutor-msg-btn"
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 text-white rounded-2xl shadow-md transition transform active:scale-95 flex items-center gap-1.5 font-bold text-xs"
            >
              <span>إِرْسَال</span>
              <Send className="w-4 h-4 rotate-180" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
