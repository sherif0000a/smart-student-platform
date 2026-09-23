import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Volume2, X, BookOpen, Sparkles, Filter, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { englishDictionary1000 } from '../curriculum';
import { DictionaryWord } from '../types';
import { speakEnglish, sounds } from '../utils/audio';

interface EnglishDictionaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName?: string;
}

const CATEGORIES: { id: string; label: string; icon: string }[] = [
  { id: 'all', label: 'الْكُلُّ', icon: '📚' },
  { id: 'school', label: 'الْمَدْرَسَةُ وَالتَّعَلُّمُ', icon: '🏫' },
  { id: 'actions', label: 'الأَفْعَالُ وَالْحَرَكَةُ', icon: '🏃' },
  { id: 'animals', label: 'الْحَيَوَانَاتُ', icon: '🦁' },
  { id: 'family', label: 'الْعَائِلَةُ وَالأَصْدِقَاءُ', icon: '👨‍👩‍👧' },
  { id: 'food', label: 'الأَطْعِمَةُ وَالْمَشْرُوبَاتُ', icon: '🍎' },
  { id: 'emotions', label: 'الْمَشَاعِرُ وَالصِّفَاتُ', icon: '😊' },
  { id: 'places', label: 'الأَمَاكِنُ وَمَعَالِمُ مِصْرَ', icon: '🏛️' },
  { id: 'jobs', label: 'الْمِهَنُ وَالْوَظَائِفُ', icon: '👨‍⚕️' },
  { id: 'nature', label: 'الطَّبِيعَةُ وَالأَلْوَانُ', icon: '🌈' },
  { id: 'numbers', label: 'الأَرْقَامُ وَالْعَدُّ', icon: '🔢' },
  { id: 'body', label: 'أَعْضَاءُ الْجِسْمِ', icon: '👁️' },
  { id: 'time', label: 'الْوَقْتُ وَالتَّقْوِيمُ', icon: '⏰' }
];

function normalizeSearchText(text: string): string {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670]/g, '') // remove diacritics (tashkeel)
    .replace(/[إأآا]/g, 'ا')
    .replace(/[ةه]/g, 'ه')
    .replace(/[ىي]/g, 'ي')
    .replace(/ئ/g, 'ي')
    .replace(/ؤ/g, 'و')
    .trim();
}

function wordMatchesQuery(item: DictionaryWord, q: string, rawQ: string): boolean {
  if (!q) return true;

  const normWord = item.word.toLowerCase();
  const normAr = normalizeSearchText(item.arabicMeaning);
  const normPron = normalizeSearchText(item.pronunciationGuide || '');
  const normExEn = item.exampleEn?.toLowerCase() || '';
  const normExAr = normalizeSearchText(item.exampleAr || '');

  // 1. Direct contains check
  if (
    normWord.includes(q) ||
    normAr.includes(q) ||
    normPron.includes(q) ||
    normExEn.includes(q) ||
    normExAr.includes(q)
  ) {
    return true;
  }

  // 2. Arabic definite article "الـ" stripping (e.g. "المدرسة" -> "مدرسة", "الفيل" -> "فيل", "الساعة" -> "ساعة")
  if (q.startsWith('ال') && q.length > 3) {
    const strippedQ = q.slice(2);
    if (
      normAr.includes(strippedQ) ||
      normPron.includes(strippedQ) ||
      normExAr.includes(strippedQ)
    ) {
      return true;
    }
  }

  // 3. Item arabic meaning has "الـ" and query doesn't
  if (normAr.startsWith('ال') && normAr.length > 3) {
    const strippedAr = normAr.slice(2);
    if (strippedAr.includes(q)) return true;
  }

  // 4. Reverse search: child typed "معنى كلمة مدرسة" -> includes item "مدرسه"
  if (q.length > 4 && normAr.length >= 3 && q.includes(normAr)) {
    return true;
  }

  // 5. Multi-word search token matching
  const tokens = q.split(/\s+/).filter(t => t.length > 1);
  if (tokens.length > 1) {
    const anyTokenMatch = tokens.some(t => {
      const cleanT = t.startsWith('ال') && t.length > 3 ? t.slice(2) : t;
      return normWord.includes(t) || normAr.includes(t) || normAr.includes(cleanT);
    });
    if (anyTokenMatch) return true;
  }

  // 6. English plurals and endings (e.g. "cats" -> "cat", "apples" -> "apple")
  const lowerRaw = rawQ.toLowerCase();
  if (lowerRaw.endsWith('s') && lowerRaw.length > 3) {
    const singular = lowerRaw.slice(0, -1);
    if (normWord === singular || normWord.startsWith(singular)) return true;
  }

  return false;
}

export const EnglishDictionaryModal: React.FC<EnglishDictionaryModalProps> = ({
  isOpen,
  onClose,
  studentName
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [speakingWordId, setSpeakingWordId] = useState<string | null>(null);
  const [practiceMode, setPracticeMode] = useState(false);
  const [practiceIndex, setPracticeIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);

  const filteredWords = useMemo(() => {
    const rawQ = searchQuery.trim();
    if (!rawQ) {
      return englishDictionary1000.filter(item => selectedCategory === 'all' || item.category === selectedCategory);
    }

    const q = normalizeSearchText(rawQ);

    // First try matching within selected category
    const categoryMatches = englishDictionary1000.filter(item => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      if (!matchCat) return false;
      return wordMatchesQuery(item, q, rawQ);
    });

    if (categoryMatches.length > 0) {
      return categoryMatches;
    }

    // Search across all items in dictionary
    return englishDictionary1000.filter(item => wordMatchesQuery(item, q, rawQ));
  }, [searchQuery, selectedCategory]);

  const handlePronounce = (word: DictionaryWord) => {
    sounds.playButtonTap();
    setSpeakingWordId(word.id);
    speakEnglish(word.word, () => {
      setSpeakingWordId(null);
    });
  };

  const handleNextPractice = () => {
    setIsRevealed(false);
    sounds.playTransition();
    setPracticeIndex(prev => (prev + 1) % filteredWords.length);
  };

  const handlePrevPractice = () => {
    setIsRevealed(false);
    sounds.playTransition();
    setPracticeIndex(prev => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  if (!isOpen) return null;

  const currentPracticeWord = filteredWords[practiceIndex] || filteredWords[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 25 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 24, stiffness: 280 }}
        className="relative w-full max-w-4xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border-4 border-sky-300 overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-sky-500 via-blue-600 to-indigo-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-white/20 rounded-2xl text-2xl">📖</span>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black">قَامُوسُ الطَّالِبِ الْمُجْتَهِدِ الإِنْجِلِيزِيُّ الذَّكِيُّ</h2>
                <span className="bg-amber-400 text-slate-900 text-xs px-2.5 py-0.5 rounded-full font-bold">
                  {englishDictionary1000.length} كَلِمَةٍ مَنْطُوقَةٍ
                </span>
              </div>
              <p className="text-xs text-sky-100">
                مُتَرْجَمٌ بِالْعَرَبِيَّةِ مَعَ كِتَابَةِ النُّطْقِ الصَّوْتِيِّ وَأَمْثِلَةٍ سَهْلَةٍ لِلطِّفْلِ 🌟
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setPracticeMode(!practiceMode);
                sounds.playButtonTap();
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                practiceMode ? 'bg-amber-400 text-slate-900' : 'bg-white/20 hover:bg-white/30 text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{practiceMode ? 'عَرْضُ الْقَائِمَةِ' : 'بِطَاقَاتُ التَّحَدِّي'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-white/20 text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search & Categories Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-2.5">
          <div className="relative">
            <Search className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="ابْحَثْ عَنْ أَيِّ كَلِمَةٍ بِالإِنْجِلِيزِيَّةِ أَوْ بِالْمَعْنَى الْعَرَبِيِّ (مِثْلَ: elephant, مدرسة, cat, سعيد, clock)..."
              className="w-full pl-4 pr-11 py-2.5 bg-white border border-slate-300 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium text-slate-800 shadow-inner"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  setSearchQuery('');
                }}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 px-2 py-0.5 rounded-full transition"
              >
                مَسْحُ الْبَحْثِ ✕
              </button>
            )}
          </div>

          {/* Quick Keywords Chips for Children */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none text-[11px] font-bold text-slate-600">
            <span className="text-slate-400 text-xs shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>كَلِمَاتٌ سَرِيعَةٌ:</span>
            </span>
            {[
              { q: 'school', label: 'مدرسة 🏫' },
              { q: 'elephant', label: 'فيل 🐘' },
              { q: 'happy', label: 'سعيد 😊' },
              { q: 'cat', label: 'قطة 🐱' },
              { q: 'family', label: 'عائلة 👨‍👩‍👧' },
              { q: 'water', label: 'ماء 💧' },
              { q: 'clock', label: 'ساعة ⏰' },
              { q: 'book', label: 'كتاب 📖' }
            ].map(item => (
              <button
                key={item.q}
                type="button"
                onClick={() => {
                  sounds.playButtonTap();
                  setSearchQuery(item.q);
                }}
                className="px-2.5 py-1 bg-white hover:bg-sky-50 hover:text-sky-700 hover:border-sky-300 border border-slate-200 rounded-xl shrink-0 transition"
              >
                {item.label}
              </button>
            ))}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {CATEGORIES.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  sounds.playClick();
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                  selectedCategory === cat.id
                    ? 'bg-sky-600 text-white shadow'
                    : 'bg-white hover:bg-slate-200 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Content Body */}
        <div className="p-4 flex-1 overflow-y-auto">
          {practiceMode && currentPracticeWord ? (
            /* Flashcard Practice Mode */
            <div className="max-w-md mx-auto py-6 space-y-5">
              <div className="text-center">
                <span className="text-xs font-bold bg-sky-100 text-sky-800 px-3 py-1 rounded-full">
                  بِطَاقَةُ كَلِمَةِ {practiceIndex + 1} مِنْ {filteredWords.length}
                </span>
              </div>

              <div className="bg-gradient-to-br from-sky-50 to-blue-50 border-2 border-sky-300 rounded-3xl p-6 shadow-lg text-center space-y-4">
                <div className="flex justify-center">
                  <button
                    onClick={() => handlePronounce(currentPracticeWord)}
                    className="p-4 bg-sky-600 hover:bg-sky-700 active:scale-95 text-white rounded-full shadow-lg transition-transform"
                    title="اسْتَمِعْ لِلنُّطْقِ الْوَاضِحِ"
                  >
                    <Volume2 className="w-8 h-8" />
                  </button>
                </div>

                <h3 className="text-4xl font-black text-slate-900 tracking-wide">
                  {currentPracticeWord.word}
                </h3>

                <div className="bg-white/80 border border-sky-200 py-1.5 px-3 rounded-xl inline-block text-sm font-bold text-sky-700">
                  طَرِيقَةُ النُّطْقِ: «{currentPracticeWord.pronunciationGuide}»
                </div>

                {isRevealed ? (
                  <div className="pt-3 border-t border-sky-200 space-y-2 animate-fadeIn">
                    <p className="text-2xl font-black text-emerald-700">
                      {currentPracticeWord.arabicMeaning}
                    </p>
                    <p className="text-xs text-slate-600 bg-white p-2.5 rounded-xl border border-sky-100">
                      <span className="font-bold text-slate-800">مِثَالٌ: </span>
                      {currentPracticeWord.exampleEn}
                      <br />
                      <span className="text-slate-500">{currentPracticeWord.exampleAr}</span>
                    </p>
                  </div>
                ) : (
                  <div className="pt-2">
                    <button
                      onClick={() => {
                        setIsRevealed(true);
                        sounds.playHint();
                      }}
                      className="px-5 py-2 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs shadow transition-all"
                    >
                      اكْشِفِ الْمَعْنَى وَالْمِثَالَ 💡
                    </button>
                  </div>
                )}
              </div>

              {/* Navigation */}
              <div className="flex justify-between items-center px-4">
                <button
                  onClick={handlePrevPractice}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 rounded-xl font-bold text-slate-700 text-xs flex items-center gap-1"
                >
                  <ChevronRight className="w-4 h-4" />
                  <span>السَّابِقَةُ</span>
                </button>
                <button
                  onClick={handleNextPractice}
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold text-xs flex items-center gap-1 shadow"
                >
                  <span>التَّالِيَةُ</span>
                  <ChevronLeft className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* Grid Catalog of Words */
            <div>
              <div className="flex items-center justify-between text-xs text-slate-500 mb-3 px-1">
                <span>
                  عَدَدُ الْكَلِمَاتِ الْمَعْرُوضَةِ: <strong>{filteredWords.length}</strong>
                </span>
                <span className="text-sky-600 font-bold">
                  اضْغَطْ عَلَى أَيِّ سَمَّاعَةٍ لِسَمَاعِ النُّطْقِ الْوَاضِحِ 🔊
                </span>
              </div>

              {filteredWords.length === 0 ? (
                <div className="text-center py-10 text-slate-600 space-y-3 bg-sky-50/60 rounded-3xl p-6 border-2 border-dashed border-sky-200">
                  <div className="text-4xl">🌟</div>
                  <h4 className="font-black text-slate-800 text-sm">
                    تَرْجَمَةٌ فَوْرِيَّةٌ وَنُطْقٌ صَوْتِيٌّ لِـ «{searchQuery}»
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    اضْغَطْ لِتَرْجَمَةِ هَذِهِ الْكَلِمَةِ أَوْ الْجُمْلَةِ فَوْراً مَعَ النُّطْقِ الْهَادِئِ الْمُخَصَّصِ لِلأَطْفَالِ:
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playButtonTap();
                        speakEnglish(searchQuery);
                      }}
                      className="px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white rounded-xl text-xs font-bold shadow flex items-center gap-1.5 transition"
                    >
                      <Volume2 className="w-4 h-4" />
                      <span>انْطِقْ هَذِهِ الْكَلِمَةَ بِهُدُوءٍ 🔊</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="px-4 py-2.5 bg-stone-200 hover:bg-stone-300 text-stone-800 rounded-xl text-xs font-bold transition"
                    >
                      مَسْحُ الْبَحْثِ وَعَرْضُ الْكُلِّ
                    </button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {filteredWords.map(word => {
                    const isSpeaking = speakingWordId === word.id;
                    return (
                      <div
                        key={word.id}
                        className="bg-white p-3.5 rounded-2xl border border-slate-200 hover:border-sky-400 hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-lg font-black text-slate-900">{word.word}</span>
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">
                                {word.partOfSpeech}
                              </span>
                            </div>
                            <div className="text-xs font-bold text-sky-600 mt-0.5">
                              النُّطْقُ: «{word.pronunciationGuide}»
                            </div>
                          </div>

                          <button
                            onClick={() => handlePronounce(word)}
                            className={`p-2 rounded-xl border transition-all ${
                              isSpeaking
                                ? 'bg-amber-500 text-white border-amber-600 scale-110 animate-pulse'
                                : 'bg-sky-50 text-sky-700 border-sky-200 hover:bg-sky-100'
                            }`}
                            title="اسْتَمِعْ لِلنُّطْقِ"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="mt-2 pt-2 border-t border-slate-100">
                          <p className="text-sm font-bold text-emerald-700">{word.arabicMeaning}</p>
                          <p className="text-[11px] text-slate-500 mt-1 line-clamp-1 italic">
                            {word.exampleEn}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
          مُصَمَّمٌ لِمَنْهَجِ الصَّفِّ الثَّالِثِ الابْتِدَائِيِّ - لِتَعْلِيمِ الطِّفْلِ النُّطْقَ الصَّحِيحَ وَالْمَعَانِي بِسُهُولَةٍ 🌟
        </div>
      </motion.div>
    </div>
  );
};
