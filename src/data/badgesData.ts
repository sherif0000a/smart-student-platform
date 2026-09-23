import { Badge } from '../types';

export const allBadges: Badge[] = [
  // --- Unit Completion Badges (As explicitly requested) ---
  {
    id: 'unit_1_complete',
    title: 'وَسَامُ الْوَحْدَةِ الأُولَى (الْعَمَلُ وَالأَمَلُ)',
    description: 'أَتَمَّ جَمِيعَ دُرُوسِ وَأَنْشِطَةِ الْوَحْدَةِ الأُولَى بِكَامِلِهَا كَمَا فِي كِتَابِ الْوَزَارَةِ',
    icon: '🐝',
    category: 'unit',
    unitId: 1
  },
  {
    id: 'unit_2_complete',
    title: 'وَسَامُ الْوَحْدَةِ الثَّانِيَةِ (صِفَاتِي الْجَمِيلَةُ)',
    description: 'أَتَمَّ جَمِيعَ دُرُوسِ وَأَنْشِطَةِ الْوَحْدَةِ الثَّانِيَةِ بِكَامِلِهَا وَأَتْقَنَ قِصَّةَ الْبَطَلِ الْخَفِيِّ',
    icon: '☀️',
    category: 'unit',
    unitId: 2
  },
  {
    id: 'unit_3_complete',
    title: 'وَسَامُ الْوَحْدَةِ الثَّالِثَةِ (أَدَبُ بَلَدِي)',
    description: 'أَتَمَّ جَمِيعَ دُرُوسِ وَأَنْشِطَةِ الْوَحْدَةِ الثَّالِثَةِ بِكَامِلِهَا وَتَعَرَّفَ عَلَى أَدَبِ وَتَارِيخِ مِصْرَ',
    icon: '📜',
    category: 'unit',
    unitId: 3
  },
  {
    id: 'curriculum_complete',
    title: 'وَسَامُ تَاجِ الْمَنْهَجِ وَفَارِسِ اللُّغَةِ',
    description: 'أَنْجَزَ كَافَّةَ دُرُوسِ الْمَنْهَجِ الْمَدْرَسِيِّ لِلصَّفِّ الثَّالِثِ الابْتِدَائِيِّ كَامِلاً بِمَرَاتِبِ الشَّرَفِ!',
    icon: '👑',
    category: 'unit'
  },

  // --- Achievement & Progress Badges ---
  {
    id: 'first_step',
    title: 'خُطْوَةُ الْبِدَايَةِ',
    description: 'حَلَّ أَوَّلَ نَشَاطٍ بِنَجَاحٍ فِي مَغَامَرَةِ اللُّغَةِ الْعَرَبِيَّةِ',
    icon: '🌟',
    category: 'achievement',
    requiredStars: 10
  },
  {
    id: 'spelling_champion',
    title: 'فَارِسُ الإِمْلَاءِ وَالتَّهْجِئَةِ',
    description: 'أَتْقَنَ التَّمَارِينَ الإِمْلائِيَّةَ وَفَرَّقَ بَيْنَ التَّاءِ الْمَرْبُوطَةِ وَالْمَفْتُوحَةِ وَالْهَاءِ',
    icon: '✍️',
    category: 'achievement',
    requiredStars: 40
  },
  {
    id: 'perseverance',
    title: 'وَسَامُ الْمُحَاوَلَةِ وَالتَّكْرَارِ',
    description: 'تَعَلَّمَ مِنْ دَرْسِ (كَرِّرِي الْمُحَاوَلَةَ) وَحَقَّقَ ٥٠ نَجْمَةً',
    icon: '🎨',
    category: 'achievement',
    requiredStars: 50
  },
  {
    id: 'hidden_hero',
    title: 'وَسَامُ الْبَطَلِ الْخَفِيِّ',
    description: 'قَدَّرَ أَبْطَالَ الْمَدْرَسَةِ وَأَتْقَنَ أَسْمَاءَ الإِشَارَةِ',
    icon: '🛡️',
    category: 'achievement',
    requiredStars: 90
  },
  {
    id: 'giving_heart',
    title: 'وَسَامُ السَّعَادَةِ فِي الْمُسَاعَدَةِ',
    description: 'تَعَلَّمَ مُسَاعَدَةَ الآخَرِينَ وَحَصَلَ عَلَى ١٧٠ نَجْمَةً',
    icon: '💖',
    category: 'achievement',
    requiredStars: 170
  },
  {
    id: 'brave_voice',
    title: 'وَسَامُ الشَّجَاعَةِ وَالمُبَادَرَةِ',
    description: 'تَعَلَّمَ مِنْ قِصَّةِ (أَوَّلُ مَنْ رَفَعَ يَدَهُ) وَأَتْقَنَ النَّفْيَ',
    icon: '✋',
    category: 'achievement',
    requiredStars: 220
  },
  {
    id: 'inventor_badge',
    title: 'وَسَامُ الْمُبْتَكِرِ الصَّغِيرِ',
    description: 'شَارَكَ فِي صُنْدُوقِ الابْتِكَارِ وَحِمَايَةِ الْبِيئَةِ',
    icon: '📦',
    category: 'achievement',
    requiredStars: 300
  },
  {
    id: 'patriot_champion',
    title: 'فَارِسُ مِصْرَ وَبَطَلُ الْوَطَنِ',
    description: 'أَتَمَّ كَافَّةَ مَرَاحِلِ مَغَامَرَةِ اللُّغَةِ الْعَرَبِيَّةِ بِامْتِيَازٍ!',
    icon: '🏆',
    category: 'special',
    requiredStars: 390
  }
];
