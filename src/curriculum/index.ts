// Centralized Curriculum Hub for Platform "الطالب المجتهد"
// Enables easy modification, question addition, and subject switching

export * from './math/mathCurriculum';
export * from './english/englishCurriculum';
export * from './english/englishDictionary1000';
export * from './arabic/arabicCurriculum';

import { mathChapters } from './math/mathCurriculum';
import { englishUnits } from './english/englishCurriculum';
import { arabicUnits } from './arabic/arabicCurriculum';
import { englishDictionary1000 } from './english/englishDictionary1000';

export interface SubjectMeta {
  id: 'math' | 'english' | 'arabic';
  title: string;
  subtitle: string;
  badge: string;
  iconName: string;
  accentGradient: string;
  buttonGradient: string;
  totalUnitsOrChapters: number;
}

export const subjectCatalog: Record<'math' | 'english' | 'arabic', SubjectMeta> = {
  math: {
    id: 'math',
    title: 'الرِّيَاضِيَّاتُ',
    subtitle: 'الْمَنْهَجُ الْمِصْرِيُّ الْمُطَوَّرُ - الصَّفُّ الثَّالِثُ الابْتِدَائِيُّ (10 فُصُولٍ مَعَ تَحَدِّي الأَذْكِيَاءِ)',
    badge: '10 فصول كاملة',
    iconName: 'Calculator',
    accentGradient: 'from-amber-500 via-orange-500 to-amber-600',
    buttonGradient: 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700',
    totalUnitsOrChapters: mathChapters.length
  },
  english: {
    id: 'english',
    title: 'English Connect 3',
    subtitle: 'Connect 3 & El-Moasser (6 Units + 1000 Words Pronounced Child Dictionary)',
    badge: '6 وحدات + قاموس 1000 كلمة',
    iconName: 'BookOpen',
    accentGradient: 'from-sky-500 via-blue-500 to-indigo-600',
    buttonGradient: 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700',
    totalUnitsOrChapters: englishUnits.length
  },
  arabic: {
    id: 'arabic',
    title: 'اللُّغَةُ الْعَرَبِيَّةُ',
    subtitle: 'مُغَامَرَاتُ اللُّغَةِ الْعَرَبِيَّةِ، الْقِرَاءَةُ، الإِمْلَاءُ، وَالأَسَالِيبُ لِلصَّفِّ الثَّالِثِ',
    badge: '3 وحدات تفاعلية',
    iconName: 'Sparkles',
    accentGradient: 'from-emerald-500 via-teal-500 to-green-600',
    buttonGradient: 'bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700',
    totalUnitsOrChapters: arabicUnits.length
  }
};

export function getDictionaryWordsCount(): number {
  return englishDictionary1000.length;
}
