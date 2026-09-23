import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Trophy, Star, Volume2, Sparkles, X, CheckCircle2, ArrowRight, Award, Flame, RefreshCw, Zap, Heart, Brain, Search, Crosshair, Radio } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sounds, speakEnglish, speakArabic, stopSpeaking } from '../utils/audio';

interface EducationalGamesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddStars: (stars: number) => void;
  studentName: string;
}

type GameType = 'mathRocket' | 'englishHunter' | 'arabicTreasure' | 'princessGarden' | 'candyKitchen' | 'speedChampion' | 'galaxyBlaster' | 'mysteryDetective';

interface GameQuestion {
  question: string;
  options: string[];
  correct: string;
  hint: string;
  audioText?: string;
  isEnglishAudio?: boolean;
}

const MATH_QUESTIONS: GameQuestion[] = [
  { question: 'احْسُبْ سَرِيعاً: 6 × 7 = ؟', options: ['42', '36', '48'], correct: '42', hint: '6 مَرَّاتٍ 7' },
  { question: 'احْسُبْ ذِهْنِيّاً: 8 × 9 = ؟', options: ['72', '81', '64'], correct: '72', hint: 'أَقَلُّ مِنْ 80 بِـ 8' },
  { question: 'قِسْمَةٌ عَادِلَةٌ: 36 ÷ 6 = ؟', options: ['6', '5', '7'], correct: '6', hint: '6 × 6 = 36' },
  { question: 'سَاعَةٌ ذَكِيَّةٌ: السَّاعَةُ الْكَامِلَةُ تَحْتَوِي عَلَى كَمْ دَقِيقَةً؟', options: ['60 دَقِيقَةً', '30 دَقِيقَةً', '45 دَقِيقَةً'], correct: '60 دَقِيقَةً', hint: 'دَوْرَةٌ كَامِلَةٌ' },
  { question: 'تَفْكِيكُ الأَعْدَادِ: 8 × 7 = (8 × 5) + (8 × ...)', options: ['2', '3', '4'], correct: '2', hint: '7 تَتَفَكَّكُ إِلَى 5 + 2' },
  { question: 'أَيُّ الْكَسْرَيْنِ أَكْبَرُ: 1/2 أَمْ 1/4؟', options: ['1/2 (نِصْفٌ)', '1/4 (رُبْعٌ)', 'مُتَسَاوِيَانِ'], correct: '1/2 (نِصْفٌ)', hint: 'الْمَقَامُ الأَصْغَرُ هُوَ الأَكْبَرُ فِي نَفْسِ الْبَسْطِ' },
  { question: 'مُحِيطُ الْمُرَبَّعِ الَّذِي طُولُ ضِلْعِهِ 5 سَم = ؟', options: ['20 سَم', '25 سَم', '15 سَم'], correct: '20 سَم', hint: '5 + 5 + 5 + 5' },
  { question: 'مَسَاحَةُ مُسْتَطِيلٍ طُولُهُ 6 وَعَرْضُهُ 4 = ؟', options: ['24', '20', '10'], correct: '24', hint: 'الطُّولُ × الْعَرْضُ' }
];

const ENGLISH_QUESTIONS: GameQuestion[] = [
  { question: 'How do you feel? I feel ... (سَعِيدٌ)', options: ['happy', 'sad', 'tired'], correct: 'happy', hint: 'Happy means cheerful', audioText: 'happy', isEnglishAudio: true },
  { question: 'What\'s the matter? I have a ... (صُدَاعٌ)', options: ['headache', 'cold', 'fever'], correct: 'headache', hint: 'Pain in the head', audioText: 'headache', isEnglishAudio: true },
  { question: 'Choose the correct phonics for "sleep":', options: ['ee', 'ea', 'ai'], correct: 'ee', hint: 's - l - e - e - p', audioText: 'sleep', isEnglishAudio: true },
  { question: 'Animal at the zoo with a long neck:', options: ['giraffe', 'elephant', 'hippo'], correct: 'giraffe', hint: 'Giraffe', audioText: 'giraffe', isEnglishAudio: true },
  { question: 'Circus performer who makes people laugh:', options: ['clown', 'acrobat', 'trapeze'], correct: 'clown', hint: 'Funny makeup', audioText: 'clown', isEnglishAudio: true },
  { question: 'Take your ... (دَوَاءَكَ):', options: ['medicine', 'book', 'chair'], correct: 'medicine', hint: 'Prescribed by the doctor', audioText: 'medicine', isEnglishAudio: true }
];

const ARABIC_QUESTIONS: GameQuestion[] = [
  { question: 'اخْتَرْ الْكَلِمَةَ الْمَكْتُوبَةَ بِشَكْلٍ صَحِيحٍ:', options: ['مَدْرَسَةٌ', 'مَدْرَسَهْ', 'مَدْرَسَتْ'], correct: 'مَدْرَسَةٌ', hint: 'تَنْطِقُ هَاءً عِنْدَ الْوَقْفِ وَتَاءً عِنْدَ الْوَصْلِ' },
  { question: 'كَلِمَةُ «الشَّمْسُ» بِهَا:', options: ['لَامٌ شَمْسِيَّةٌ', 'لَامٌ قَمَرِيَّةٌ'], correct: 'لَامٌ شَمْسِيَّةٌ', hint: 'اللَّامُ تُكْتَبُ وَلَا تُنْطَقُ وَبَعْدَهَا شَدَّةٌ' },
  { question: 'كَلِمَةُ «الْقَمَرُ» بِهَا:', options: ['لَامٌ قَمَرِيَّةٌ', 'لَامٌ شَمْسِيَّةٌ'], correct: 'لَامٌ قَمَرِيَّةٌ', hint: 'اللَّامُ تُكْتَبُ وَتُنْطَقُ وَعَلَيْهَا سُكُونٌ' },
  { question: 'التَّنْوِينُ بِالْفَتْحِ لِكَلِمَةِ «كِتَاب»: ', options: ['كِتَاباً', 'كِتَابن', 'كِتَابٌ'], correct: 'كِتَاباً', hint: 'نَضَعُ أَلِفَ تَنْوِينِ الْفَتْحِ' },
  { question: 'أَدَاةُ الاسْتِفْهَامِ لِلسُّؤَالِ عَنِ الزَّمَانِ:', options: ['مَتَى', 'أَيْنَ', 'كَيْفَ'], correct: 'مَتَى', hint: 'مَثَلاً: مَتَى تَسْتَيْقِظُ؟' },
  { question: 'مُضَادُّ كَلِمَةِ «الشُّجَاع»: ', options: ['الْجَبَانُ', 'الْقَوِيُّ', 'الذَّكِيُّ'], correct: 'الْجَبَانُ', hint: 'عَكْسُ الشَّجَاعَةِ' }
];

// Special Princess & Bloom Game tailored for girls and gentle learners
const PRINCESS_GARDEN_QUESTIONS: GameQuestion[] = [
  { question: '🌸 بَاقَاتُ الْوُرُودِ: فِي حَدِيقَةِ الأَمِيرَةِ 4 بَاقَاتٍ، فِي كُلِّ بَاقَةٍ 5 وَرْدَاتٍ جَمِيلَةٍ. كَمْ وَرْدَةً فِي الْمَجْمُوعِ؟', options: ['20 وَرْدَةً', '15 وَرْدَةً', '25 وَرْدَةً'], correct: '20 وَرْدَةً', hint: '4 × 5 = 20' },
  { question: '💖 كَلِمَاتٌ رَقِيقَةٌ: كَيْفَ نَقُولُ «مِنْ فَضْلِكِ» بِلُطْفٍ بِاللُّغَةِ الإِنْجِلِيزِيَّةِ؟', options: ['Please', 'Thank you', 'Sorry'], correct: 'Please', hint: 'Always say please with a smile', audioText: 'Please', isEnglishAudio: true },
  { question: '🎨 أَلْوَانُ الْبَهْجَةِ: أَيُّ الأَلْوَانِ الآتِيَةِ هُوَ «الْوَرْدِيُّ» بِالإِنْجِلِيزِيَّةِ؟', options: ['pink', 'blue', 'green'], correct: 'pink', hint: 'Pink is a lovely soft color', audioText: 'pink', isEnglishAudio: true },
  { question: '🦋 فَرَاشَةُ الرَّبِيعِ: كَلِمَةُ «فَرَاشَة» هِيَ اسْمٌ ...', options: ['مُؤَنَّثٌ', 'مُذَكَّرٌ', 'حَرْفٌ'], correct: 'مُؤَنَّثٌ', hint: 'تَنْتَهِي بِتَاءٍ مَرْبُوطَةٍ' },
  { question: '👑 تَاجُ الأَخْلاقِ: عِنْدَمَا أُسَاعِدُ أُمِّي فِي تَرْتِيبِ غُرْفَتِي، أَنَا بِنْتٌ ...', options: ['مُهَذَّبَةٌ وَبَارَّةٌ', 'كَسُولَةٌ', 'مُتَرَدِّدَةٌ'], correct: 'مُهَذَّبَةٌ وَبَارَّةٌ', hint: 'الْبِرُّ بِالْوَالِدَيْنِ مِنْ أَجْمَلِ الصِّفَاتِ' },
  { question: '👗 أَنَاقَةُ Connect 3: Choose the correct word: «She wears a pretty ... (فُسْتَانٌ)»', options: ['dress', 'pen', 'desk'], correct: 'dress', hint: 'Dress means a pretty gown', audioText: 'dress', isEnglishAudio: true },
  { question: '⏰ سَاعَةُ حَفْلَةِ الشَّايِ: بَدَأَتِ الْحَفْلَةُ 4:00 وَاسْتَمَرَّتْ نِصْفَ سَاعَةٍ (30 دَقِيقَةً). مَتَى تَنْتَهِي؟', options: ['4:30', '4:15', '5:00'], correct: '4:30', hint: '4:00 + 30 دَقِيقَةً' },
  { question: '🍎 صِحَّةٌ وَنَضَارَةٌ: أَيُّ الْأَطْعِمَةِ التَّالِيَةِ صِحِّيٌّ لِلنَّشَاطِ وَالْجَمَالِ؟', options: ['الْفَوَاكِهُ وَالْخَضْرَاوَاتُ', 'الْحَلْوَى الْمُلَوَّنَةُ كَثِيراً', 'الْمَشْرُوبَاتُ الْغَازِيَّةُ'], correct: 'الْفَوَاكِهُ وَالْخَضْرَاوَاتُ', hint: 'الْفِيتَامِينَاتُ تَمْنَحُ الطَّاقَةَ وَالنَّضَارَةَ' }
];

// Speed Champion Mental Quiz
const SPEED_CHAMPION_QUESTIONS: GameQuestion[] = [
  { question: '⚡ احْسُبْ فِي ثَوَانٍ: 30 ÷ 5 = ؟', options: ['6', '5', '7'], correct: '6', hint: '6 × 5 = 30' },
  { question: '⚡ نِصْفُ السَّاعَةِ = كَمْ دَقِيقَةً؟', options: ['30 دَقِيقَةً', '15 دَقِيقَةً', '20 دَقِيقَةً'], correct: '30 دَقِيقَةً', hint: '60 ÷ 2 = 30' },
  { question: '⚡ مُضَادُّ كَلِمَةِ «سَعِيد» (Happy) هُوَ:', options: ['sad', 'tired', 'hot'], correct: 'sad', hint: 'Sad means unhappy', audioText: 'sad', isEnglishAudio: true },
  { question: '⚡ كَلِمَةُ «مَسْرُورٌ» بِهَا تَنْوِينٌ بِـ:', options: ['الضَّمِّ', 'الْفَتْحِ', 'الْكَسْرِ'], correct: 'الضَّمِّ', hint: 'ضَمَّتَانِ فَوْقَ الرَّاءِ' },
  { question: '⚡ جَدْوَلُ الضَّرْبِ السَّرِيعُ: 7 × 8 = ؟', options: ['56', '54', '64'], correct: '56', hint: '7 × 8 = 56' },
  { question: '⚡ مُحِيطُ مُثَلَّثٍ مُتَسَاوِي الأَضْلاعِ طُولُ ضِلْعِهِ 4 سَم = ؟', options: ['12 سَم', '16 سَم', '8 سَم'], correct: '12 سَم', hint: '4 + 4 + 4 = 12' }
];

// Special Magic Candy Kitchen Game for girls and creative learners
const CANDY_KITCHEN_QUESTIONS: GameQuestion[] = [
  { question: '🧁 صِينِيَّةُ الْكَبْ كَيْك: خَبَزْتِ 3 صَوَانٍ، فِي كُلِّ صِينِيَّةٍ 4 كَعْكَاتٍ لَذِيذَةٍ. كَمْ كَعْكَةً فِي الْمَجْمُوعِ؟', options: ['12 كَعْكَةً', '7 كَعْكَاتٍ', '15 كَعْكَةً'], correct: '12 كَعْكَةً', hint: '3 × 4 = 12' },
  { question: '🍓 لَذَّةُ Connect 3: كَيْفَ نَقُولُ «فَرَاوْلَة» بِالإِنْجِلِيزِيَّةِ؟', options: ['strawberry', 'apple', 'banana'], correct: 'strawberry', hint: 'Strawberry is a sweet red fruit', audioText: 'strawberry', isEnglishAudio: true },
  { question: '🍰 كُسُورُ الْوَصْفَةِ: وَضَعْتِ 1/2 كُوبٍ مِنَ السُّكَّرِ، وَأُخْتُكِ وَضَعَتْ 1/4 كُوبٍ. أَيُّكُمَا وَضَعَتْ كَمِّيَّةً أَكْبَرَ؟', options: ['أَنْتِ (1/2 كُوبٍ)', 'أُخْتُكِ (1/4 كُوبٍ)', 'مُتَسَاوِيَانِ'], correct: 'أَنْتِ (1/2 كُوبٍ)', hint: 'النِّصْفُ (1/2) أَكْبَرُ مِنَ الرُّبْعِ (1/4)' },
  { question: '🍪 كَلِمَةُ «بَسْكَوِيتٌ» هِيَ اسْمٌ ...', options: ['مُذَكَّرٌ', 'مُؤَنَّثٌ'], correct: 'مُذَكَّرٌ', hint: 'نَقُولُ: هَذَا بَسْكَوِيتٌ لَذِيذٌ' },
  { question: '🍯 عَسَلٌ صَافٍ: كَيْفَ نَقُولُ «عَسَلٌ» بِاللُّغَةِ الإِنْجِلِيزِيَّةِ؟', options: ['honey', 'milk', 'water'], correct: 'honey', hint: 'Sweet bees make golden honey', audioText: 'honey', isEnglishAudio: true },
  { question: '⏰ سَاعَةُ الْفُرْنِ: وُضِعَتِ الْكَعْكَةُ السَّاعَةَ 5:00 وَتَحْتَاجُ 20 دَقِيقَةً (ثُلُثَ سَاعَةٍ). مَتَى تُصْبِحُ جَاهِزَةً؟', options: ['5:20 (الْخَامِسَةُ وَالثُّلُثُ)', '5:15', '5:30'], correct: '5:20 (الْخَامِسَةُ وَالثُّلُثُ)', hint: '5:00 + 20 دَقِيقَةً' },
  { question: '🍽️ أَدَبُ الطَّعَامِ: قَبْلَ أَنْ نَبْدَأَ بِتَنَاوُلِ الطَّعَامِ وَالْحَلْوَى، نَقُولُ:', options: ['بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', 'شُكْراً لَكُمْ', 'إِلَى اللِّقَاءِ'], correct: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', hint: 'سُنَّةُ نَبِيِّنَا الْكَرِيمِ قَبْلَ كُلِّ طَعَامٍ' },
  { question: '🍦 Ice cream flavours: What flavour is «vanilla»?', options: ['فَانِيلْيَا', 'شُوكُولَاتَة', 'فَرَاوْلَة'], correct: 'فَانِيلْيَا', hint: 'Vanilla flavour', audioText: 'vanilla', isEnglishAudio: true }
];

// Creative Game 1: Galaxy Asteroid Blaster (Space Defender)
const GALAXY_BLASTER_QUESTIONS: GameQuestion[] = [
  { question: '🪐 لَيْزَرُ الْكُوَيْكِبَاتِ: احْسُبْ سَرِيعاً لِتَفْجِيرِ النَّيْزَكِ: 9 × 7 = ؟', options: ['63', '56', '72'], correct: '63', hint: '9 × 7 = 63' },
  { question: '🚀 دَافِعُ الصَّارُوخِ الْفَضَائِيِّ: 72 ÷ 8 = ؟', options: ['9', '8', '7'], correct: '9', hint: '8 × 9 = 72' },
  { question: '🛡️ دِرْعُ الْحِمَايَةِ: أَيُّ الْكُسُورِ يُكَافِئُ النِّصْفَ (1/2)؟', options: ['2/4', '1/3', '3/8'], correct: '2/4', hint: '2 نِصْفُ الأَرْبَعَةِ' },
  { question: '🛸 مَسَارُ الرِّحْلَةِ: جَمْعُ كَلِمَةِ «كَوْكَبٌ» فِي الْفَضَاءِ:', options: ['كَوَاكِبُ', 'كَوْكَبَاتٌ', 'أَكْوَابٌ'], correct: 'كَوَاكِبُ', hint: 'جَمْعُ تَكْسِيرٍ لِكَوْكَبٍ' },
  { question: '⭐ Space Station Phonics: Choose the letters for "st_ _" (نَجْمٌ):', options: ['ar', 'er', 'ir'], correct: 'ar', hint: 's - t - a - r', audioText: 'star', isEnglishAudio: true },
  { question: '⚡ زَمَنُ الدَّوَرَانِ: 3 سَاعَاتٍ كَامِلَةٍ = كَمْ دَقِيقَةً؟', options: ['180 دَقِيقَةً', '120 دَقِيقَةً', '90 دَقِيقَةً'], correct: '180 دَقِيقَةً', hint: '3 × 60 = 180' },
  { question: '☄️ تَفْكِيكُ الْكُوَيْكِبِ: 8 × 6 = (8 × 5) + (8 × ...؟)', options: ['1', '2', '3'], correct: '1', hint: '5 + 1 = 6' },
  { question: '🌌 رَصْدُ الأَبْعَادِ: مُحِيطُ مُثَلَّثٍ مُتَسَاوِي الأَضْلاعِ طُولُ ضِلْعِهِ 6 سَم = ؟', options: ['18 سَم', '24 سَم', '12 سَم'], correct: '18 سَم', hint: '6 + 6 + 6 = 18' }
];

// Creative Game 2: Mystery Word Detective (Vault Solver)
const MYSTERY_DETECTIVE_QUESTIONS: GameQuestion[] = [
  { question: '🕵️‍♂️ لُغْزُ الْمُحَقِّقِ: أَنَا أَدَاةُ اسْتِفْهَامٍ أَسْأَلُ عَنِ السَّبَبِ وَالْعِلَّةِ، فَمَنْ أَنَا؟', options: ['لِمَاذَا', 'كَيْفَ', 'مَتَى'], correct: 'لِمَاذَا', hint: 'تَسْأَلُ: لِمَاذَا نَتَعَلَّمُ؟' },
  { question: '🔍 شَفْرَةُ الْمُرَادَفَاتِ: مُرَادِفُ كَلِمَةِ «مَبْهُورٌ» فِي دُرُوسِنَا:', options: ['مُنْدَهِشٌ وَمُتَعَجِّبٌ', 'غَاضِبٌ', 'خَائِفٌ'], correct: 'مُنْدَهِشٌ وَمُتَعَجِّبٌ', hint: 'يَشْعُرُ بِالإِعْجَابِ وَالدَّهْشَةِ' },
  { question: '🔐 عَكْسُ السِّرِّ: مُضَادُّ كَلِمَةِ «الصَّالِحُ» فِي الْقِصَّةِ:', options: ['الْفَاسِدُ', 'الْكَبِيرُ', 'الضَّعِيفُ'], correct: 'الْفَاسِدُ', hint: 'عَكْسُ الصَّلاحِ' },
  { question: '🐾 Mystery Animal Clue: I have black and white stripes and live in Africa:', options: ['zebra', 'lion', 'monkey'], correct: 'zebra', hint: 'Striped horse-like animal', audioText: 'zebra', isEnglishAudio: true },
  { question: '🗝️ لُغْزُ الإِمْلاءِ: أَيُّ الْكَلِمَاتِ الآتِيَةِ مَبْدُوءَةٌ بِـ «هَمْزَةِ قَطْعٍ» ظَاهِرَةٍ؟', options: ['أَحْمَدُ', 'انْتَبَهَ', 'اسْتَمَعَ'], correct: 'أَحْمَدُ', hint: 'الْهَمْزَةُ مَكْتُوبَةٌ فَوْقَ الأَلِفِ (أ)' },
  { question: '⏰ شَفْرَةُ السَّاعَةِ: إِذَا كَانَتِ السَّاعَةُ 3:45، فَإِنَّهَا تَعْنِي:', options: ['الرَّابِعَةُ إِلَّا رُبْعاً', 'الثَّالِثَةُ وَالرُّبْعُ', 'الرَّابِعَةُ وَالنِّصْفُ'], correct: 'الرَّابِعَةُ إِلَّا رُبْعاً', hint: 'بَقِيَ 15 دَقِيقَةً لِتَكُونَ 4:00' },
  { question: '📜 لُغْزُ النَّصِيحَةِ: «... تُؤَجِّلْ عَمَلَ الْيَوْمِ إِلَى الْغَدِ»:', options: ['لَا (نَهْيٌ)', 'لَمْ (نَفْيٌ)', 'كَيْفَ'], correct: 'لَا (نَهْيٌ)', hint: 'أُسْلُوبُ نَهْيٍ عَنِ التَّأْجِيلِ' },
  { question: '🍎 Detective Health Clue: What should you drink daily to keep bones strong?', options: ['milk', 'cola', 'tea'], correct: 'milk', hint: 'Rich in calcium', audioText: 'milk', isEnglishAudio: true }
];

export const EducationalGamesModal: React.FC<EducationalGamesModalProps> = ({
  isOpen,
  onClose,
  onAddStars,
  studentName
}) => {
  const [currentGame, setCurrentGame] = useState<GameType>('mathRocket');
  const [score, setScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isAnswerChecked, setIsAnswerChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showSummary, setShowSummary] = useState<boolean>(false);

  const getQuestionList = (): GameQuestion[] => {
    switch (currentGame) {
      case 'mathRocket': return MATH_QUESTIONS;
      case 'englishHunter': return ENGLISH_QUESTIONS;
      case 'arabicTreasure': return ARABIC_QUESTIONS;
      case 'princessGarden': return PRINCESS_GARDEN_QUESTIONS;
      case 'candyKitchen': return CANDY_KITCHEN_QUESTIONS;
      case 'speedChampion': return SPEED_CHAMPION_QUESTIONS;
      case 'galaxyBlaster': return GALAXY_BLASTER_QUESTIONS;
      case 'mysteryDetective': return MYSTERY_DETECTIVE_QUESTIONS;
    }
  };

  const questions = getQuestionList();
  const currentQ = questions[currentIndex % questions.length];

  useEffect(() => {
    if (isOpen && currentQ.audioText) {
      if (currentQ.isEnglishAudio) {
        speakEnglish(currentQ.audioText);
      } else {
        speakArabic(currentQ.audioText);
      }
    }
    return () => {
      stopSpeaking();
    };
  }, [currentIndex, currentGame, isOpen]);

  if (!isOpen) return null;

  const handleSelectOption = (opt: string) => {
    if (isAnswerChecked) return;
    sounds.playButtonTap();
    setSelectedOption(opt);
    setIsAnswerChecked(true);

    const correct = opt === currentQ.correct;
    setIsCorrect(correct);

    if (correct) {
      sounds.playCheerSuccess();
      const newCombo = combo + 1;
      setCombo(newCombo);
      const points = 5 + newCombo * 2;
      setScore(prev => prev + points);
      onAddStars(points);

      try {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch {}
    } else {
      sounds.playHint();
      setCombo(0);
    }
  };

  const handleNextQuestion = () => {
    sounds.playClick();
    setSelectedOption(null);
    setIsAnswerChecked(false);
    if (currentIndex + 1 >= questions.length) {
      setShowSummary(true);
    } else {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const handleRestartGame = () => {
    sounds.playClick();
    setCurrentIndex(0);
    setScore(0);
    setCombo(0);
    setSelectedOption(null);
    setIsAnswerChecked(false);
    setShowSummary(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-xs">
      <motion.div
        initial={{ scale: 0.88, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
        className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border-4 border-amber-400 overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Arcade Top Banner */}
        <div className={`p-4 sm:p-5 text-white flex items-center justify-between transition-colors ${
          currentGame === 'princessGarden' 
            ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-purple-600'
            : currentGame === 'galaxyBlaster'
            ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950'
            : currentGame === 'mysteryDetective'
            ? 'bg-gradient-to-r from-amber-900 via-stone-900 to-amber-950'
            : 'bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-700'
        }`}>
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-white/20 rounded-2xl text-2xl shadow">
              {currentGame === 'princessGarden' 
                ? '🌸' 
                : currentGame === 'galaxyBlaster' 
                ? '🪐' 
                : currentGame === 'mysteryDetective' 
                ? '🕵️‍♂️' 
                : '🎮'}
            </span>
            <div>
              <h2 className="text-lg sm:text-xl font-black">
                {currentGame === 'princessGarden' 
                  ? 'قَصْرُ الأَمِيرَاتِ وَحَدِيقَةُ الْوُرُودِ 🌸' 
                  : currentGame === 'galaxyBlaster'
                  ? 'صَائِدُ الْكُوَيْكِبَاتِ وَالْفَضَاءِ 🪐'
                  : currentGame === 'mysteryDetective'
                  ? 'مُحَقِّقُ الأَلْغَازِ وَخَزِينَةُ الأَسْرَارِ 🕵️‍♂️'
                  : 'أَلْعَابُ التَّحَدِّي وَتَقْفِيلِ النُّجُومِ 🌟'}
              </h2>
              <p className="text-xs text-purple-100 font-bold">
                {currentGame === 'galaxyBlaster'
                  ? 'دَمِّرِ النَّيَازِكَ بِإِجَابَاتِكَ الذَّكِيَّةِ وَاحْمِ مَحَطَّةَ الْفَضَاءِ!'
                  : currentGame === 'mysteryDetective'
                  ? 'اكْتَشِفِ الأَدِلَّةَ، حُلَّ الأَلْغَازَ، وَافْتَحْ خَزِينَةَ الأَسْرَارِ الْمَغْلَقَةَ!'
                  : 'الْعَبْ، تَحَدَّ نَفْسَكَ، وَاكْسِبْ نُجُوماً حَقِيقِيَّةً لِحِسَابِكَ!'}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopSpeaking();
              sounds.playClick();
              onClose();
            }}
            className="p-2 bg-white/15 hover:bg-white/30 rounded-xl transition text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Game Mode Selector (8 Games: Including 2 Brand New Creative Games) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 bg-stone-100 p-1.5 border-b border-stone-200 text-xs font-black gap-1">
          <button
            onClick={() => {
              setCurrentGame('galaxyBlaster');
              handleRestartGame();
            }}
            className={`py-2 px-1 rounded-xl transition flex items-center justify-center gap-1 ${
              currentGame === 'galaxyBlaster' ? 'bg-indigo-900 text-white shadow ring-2 ring-indigo-400' : 'text-stone-700 hover:bg-indigo-100/70 bg-indigo-50/60'
            }`}
          >
            <Crosshair className="w-3.5 h-3.5 text-indigo-300" />
            <span className="truncate">الْفَضَاءُ 🪐</span>
          </button>

          <button
            onClick={() => {
              setCurrentGame('mysteryDetective');
              handleRestartGame();
            }}
            className={`py-2 px-1 rounded-xl transition flex items-center justify-center gap-1 ${
              currentGame === 'mysteryDetective' ? 'bg-amber-800 text-white shadow ring-2 ring-amber-400' : 'text-stone-700 hover:bg-amber-100/70 bg-amber-50/60'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-amber-200" />
            <span className="truncate">الْمُحَقِّقُ 🕵️‍♂️</span>
          </button>

          <button
            onClick={() => {
              setCurrentGame('princessGarden');
              handleRestartGame();
            }}
            className={`py-2 px-1 rounded-xl transition flex items-center justify-center gap-1 ${
              currentGame === 'princessGarden' ? 'bg-pink-600 text-white shadow' : 'text-stone-700 hover:bg-pink-100/70 bg-pink-50/60'
            }`}
          >
            <Heart className="w-3.5 h-3.5 fill-current" />
            <span className="truncate">الأَمِيرَاتُ 🌸</span>
          </button>

          <button
            onClick={() => {
              setCurrentGame('candyKitchen');
              handleRestartGame();
            }}
            className={`py-2 px-1 rounded-xl transition flex items-center justify-center gap-1 ${
              currentGame === 'candyKitchen' ? 'bg-rose-500 text-white shadow' : 'text-stone-700 hover:bg-rose-100/70 bg-rose-50/60'
            }`}
          >
            <span className="text-sm">🧁</span>
            <span className="truncate">الْحَلْوَيَاتُ 🍓</span>
          </button>

          <button
            onClick={() => {
              setCurrentGame('mathRocket');
              handleRestartGame();
            }}
            className={`py-2 px-1 rounded-xl transition flex items-center justify-center gap-1 ${
              currentGame === 'mathRocket' ? 'bg-amber-500 text-white shadow' : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Rocket className="w-3.5 h-3.5" />
            <span className="truncate">الرِّيَاضِيَّاتُ 🚀</span>
          </button>

          <button
            onClick={() => {
              setCurrentGame('englishHunter');
              handleRestartGame();
            }}
            className={`py-2 px-1 rounded-xl transition flex items-center justify-center gap-1 ${
              currentGame === 'englishHunter' ? 'bg-sky-600 text-white shadow' : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span className="truncate">Connect 3 🔤</span>
          </button>

          <button
            onClick={() => {
              setCurrentGame('arabicTreasure');
              handleRestartGame();
            }}
            className={`py-2 px-1 rounded-xl transition flex items-center justify-center gap-1 ${
              currentGame === 'arabicTreasure' ? 'bg-emerald-600 text-white shadow' : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="truncate">الْعَرَبِيَّةُ 🏴‍☠️</span>
          </button>

          <button
            onClick={() => {
              setCurrentGame('speedChampion');
              handleRestartGame();
            }}
            className={`py-2 px-1 rounded-xl transition flex items-center justify-center gap-1 ${
              currentGame === 'speedChampion' ? 'bg-indigo-600 text-white shadow' : 'text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Brain className="w-3.5 h-3.5" />
            <span className="truncate">الذَّكَاءُ ⚡</span>
          </button>
        </div>

        {/* Score & Combo Bar */}
        <div className="bg-stone-50 px-4 sm:px-5 py-2 flex items-center justify-between border-b border-stone-200 text-xs font-bold">
          <div className="flex items-center gap-3">
            <span className="text-amber-600 font-black flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-500" />
              <span>نِقَاطُكَ: {score}</span>
            </span>
            {combo > 1 && (
              <span className="bg-orange-500 text-white px-2 py-0.5 rounded-full text-[10px] font-black flex items-center gap-1 animate-bounce">
                <Flame className="w-3 h-3 fill-white" />
                <span>كُومْبُو x{combo}!</span>
              </span>
            )}
          </div>
          <span className="text-stone-500">
            السُّؤَالُ {currentIndex + 1} مِنْ {questions.length}
          </span>
        </div>

        {/* Game Stage Area */}
        <div className="p-4 sm:p-6 space-y-4 overflow-y-auto bg-gradient-to-b from-white to-stone-50">
          {!showSummary ? (
            <div className="space-y-4">
              {/* Question Card */}
              <div className={`p-5 rounded-2xl border-2 text-center space-y-2 ${
                currentGame === 'princessGarden'
                  ? 'bg-pink-50/70 border-pink-200'
                  : 'bg-amber-50/70 border-amber-200'
              }`}>
                <span className="text-3xl">
                  {currentGame === 'princessGarden' ? '🌸' : currentGame === 'mathRocket' ? '🚀' : currentGame === 'englishHunter' ? '🎯' : currentGame === 'speedChampion' ? '⚡' : '💎'}
                </span>
                <h3 className="text-base sm:text-lg font-black text-slate-900 leading-relaxed">
                  {currentQ.question}
                </h3>

                {currentQ.audioText && (
                  <button
                    type="button"
                    onClick={() => {
                      if (currentQ.isEnglishAudio) {
                        speakEnglish(currentQ.audioText!);
                      } else {
                        speakArabic(currentQ.audioText!);
                      }
                    }}
                    className="inline-flex items-center gap-1 px-3 py-1 bg-white hover:bg-stone-100 rounded-full text-xs font-bold text-sky-700 shadow-xs border border-sky-200"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>اسْتَمِعْ لِلنُّطْقِ الْهَادِئِ 🔊</span>
                  </button>
                )}
              </div>

              {/* Options */}
              <div className="grid grid-cols-1 gap-2.5">
                {currentQ.options.map((opt, i) => {
                  const isSelected = selectedOption === opt;
                  let btnStyle = 'bg-white border-2 border-stone-200 text-stone-800 hover:border-amber-400 hover:bg-amber-50/40';

                  if (isAnswerChecked) {
                    if (opt === currentQ.correct) {
                      btnStyle = 'bg-emerald-500 text-white border-2 border-emerald-600 shadow-md scale-102';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-500 text-white border-2 border-rose-600 shadow-md';
                    } else {
                      btnStyle = 'bg-stone-100 text-stone-400 border-2 border-stone-200 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={isAnswerChecked}
                      onClick={() => handleSelectOption(opt)}
                      className={`p-3.5 rounded-2xl font-black text-sm transition transform active:scale-98 flex items-center justify-between ${btnStyle}`}
                    >
                      <span className="flex items-center gap-2">
                        <span className="w-7 h-7 rounded-xl bg-black/10 flex items-center justify-center text-xs">
                          {i + 1}
                        </span>
                        <span>{opt}</span>
                      </span>

                      {isAnswerChecked && opt === currentQ.correct && (
                        <CheckCircle2 className="w-5 h-5 text-white animate-bounce" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback and Next */}
              {isAnswerChecked && (
                <div className={`p-4 rounded-2xl flex items-center justify-between text-xs font-black animate-fadeIn ${
                  isCorrect ? 'bg-emerald-100 text-emerald-950 border border-emerald-300' : 'bg-rose-100 text-rose-950 border border-rose-300'
                }`}>
                  <div>
                    <p className="text-sm">
                      {isCorrect ? '🌟 إِجَابَةٌ رَائِعَةٌ وَعَبْقَرِيَّةٌ!' : '💡 حَاوِلْ مَرَّةً أُخْرَى!'}
                    </p>
                    {!isCorrect && (
                      <p className="font-bold opacity-80 mt-0.5">
                        التَّلْمِيحُ: {currentQ.hint}
                      </p>
                    )}
                  </div>

                  <button
                    onClick={handleNextQuestion}
                    className="px-4 py-2 bg-slate-900 hover:bg-black text-white rounded-xl flex items-center gap-1 shadow-md transition transform active:scale-95"
                  >
                    <span>التَّالِي</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Summary End Stage */
            <div className="text-center py-6 space-y-4 animate-fadeIn">
              <div className="w-20 h-20 mx-auto rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-4xl shadow-inner border-2 border-amber-300">
                🏆
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-black text-slate-900">
                  أَحْسَنْتَ يَا {studentName}! أَتْمَمْتَ جَوْلَةَ التَّحَدِّي!
                </h3>
                <p className="text-xs text-stone-600 font-bold">
                  حَصَلْتَ عَلَى <strong>{score}</strong> نُقْطَةً ذَهَبِيَّةً أُضِيفَتْ إِلَى حِسَابِكَ!
                </p>
              </div>

              <div className="pt-4 flex items-center justify-center gap-2">
                <button
                  onClick={handleRestartGame}
                  className="px-5 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-black text-xs shadow-md transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>الْعَبْ مَرَّةً أُخْرَى 🔄</span>
                </button>

                <button
                  onClick={onClose}
                  className="px-5 py-3 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-2xl font-black text-xs transition"
                >
                  الْعَوْدَةُ لِلْمَنْهَجِ
                </button>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
