import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { sounds, speakArabic } from '../utils/audio';
import { UserProfile } from '../types';
import { 
  Heart, 
  Crown, 
  Sparkles, 
  Award, 
  Users, 
  Share2, 
  Printer, 
  X, 
  Star, 
  CheckCircle2, 
  Send,
  BookOpen
} from 'lucide-react';

interface MalekDedicationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: UserProfile;
  onSwitchHero: (name: string, heroType: 'boy' | 'girl') => void;
}

const DEFAULT_CLASSMATES = [
  { name: 'مَالِك', heroType: 'boy' as const, tag: 'بَطَلُ الإِهْدَاءِ 👑', avatar: '👦' },
  { name: 'يُوسُف', heroType: 'boy' as const, tag: 'فَارِسُ الإِمْلَاءِ ⭐', avatar: '👦' },
  { name: 'مَرْيَم', heroType: 'girl' as const, tag: 'أَمِيرَةُ النَّحْوِ 🌸', avatar: '👧' },
  { name: 'عُمَر', heroType: 'boy' as const, tag: 'عَبْقَرِيُّ الْقِرَاءَةِ 📚', avatar: '👦' },
  { name: 'هُنَا', heroType: 'girl' as const, tag: 'نَجْمَةُ الأَنَاشِيدِ 🎶', avatar: '👧' },
  { name: 'كَرِيم', heroType: 'boy' as const, tag: 'بَطَلُ الْقِيَمِ 🛡️', avatar: '👦' },
  { name: 'فَرِيدَة', heroType: 'girl' as const, tag: 'فَرَاشَةُ الْفَصْلِ 🦋', avatar: '👧' },
  { name: 'حَمْزَة', heroType: 'boy' as const, tag: 'مُكْتَشِفُ الْكَلِمَاتِ 🔍', avatar: '👦' },
  { name: 'نُور', heroType: 'girl' as const, tag: 'ضِيَاءُ الْفَصْلِ 💡', avatar: '👧' },
  { name: 'سَيْف', heroType: 'boy' as const, tag: 'فَارِسُ التَّحَدِّي ⚔️', avatar: '👦' }
];

export const MalekDedicationModal: React.FC<MalekDedicationModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSwitchHero
}) => {
  const [classmates, setClassmates] = useState(DEFAULT_CLASSMATES);
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentGender, setNewStudentGender] = useState<'boy' | 'girl'>('boy');
  const [copySuccess, setCopySuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'dedication' | 'classmates' | 'certificate'>('dedication');

  if (!isOpen) return null;

  const triggerRoyalCelebration = () => {
    sounds.playCheerSuccess();
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#f59e0b', '#ec4899', '#8b5cf6', '#10b981', '#3b82f6']
    });
    speakArabic('إِهْدَاءٌ مَلَكِيٌّ خَاصٌّ لِلْبَطَلِ مَالِك وَلِجَمِيعِ زُمَلائِهِ الْمُتَفَوِّقِينَ فِي الصَّفِّ الثَّالِثِ الابْتِدَائِيِّ!');
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newStudentName.trim();
    if (!trimmed) return;

    sounds.playButtonTap();
    const newEntry = {
      name: trimmed,
      heroType: newStudentGender,
      tag: newStudentGender === 'boy' ? 'بَطَلٌ جَدِيدٌ 🌟' : 'بَطَلَةٌ جَدِيدَةٌ 🌟',
      avatar: newStudentGender === 'girl' ? '👧' : '👦'
    };

    setClassmates((prev) => [newEntry, ...prev]);
    setNewStudentName('');
    onSwitchHero(trimmed, newStudentGender);
    confetti({ particleCount: 50, spread: 60 });
  };

  const handleCopyShareLink = () => {
    sounds.playClick();
    const textToShare = `🎁 إهداء خاص للبطل مالك ولجميع أبطال الصف الثالث الابتدائي ومعلميهم الأفاضل!\n\nيسر الأستاذ شريف عسقلاني إهداء هذا التطبيق التفاعلي الممتع (مغامرة اللغة العربية) لتسهيل حفظ الأناشيد وإتقان القواعد النحوية والإملائية مع المعلم الروبوت الذكي:\n${window.location.origin}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(textToShare);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Royal Golden Header */}
        <div className="relative bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white p-5 sm:p-6 text-center">
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

          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-100 text-amber-900 border-4 border-white shadow-xl mb-3 animate-bounce">
            <Crown className="w-8 h-8 text-amber-600 fill-amber-400" />
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-white tracking-wide">
            بَاقَةُ الإِهْدَاءِ الْمَلَكِيَّةِ 👑
          </h2>
          <p className="text-amber-100 font-bold text-xs sm:text-sm mt-1">
            إِهْدَاءٌ خَاصٌّ لِلْبَطَلِ مَالِك وَرِفَاقِ فَصْلِهِ الْمُتَمَيِّزِينَ وَمُعَلِّمِيهِمْ الأَفَاضِلِ
          </p>

          {/* Navigation Tabs */}
          <div className="flex items-center justify-center gap-2 mt-4">
            <button
              onClick={() => { sounds.playClick(); setActiveTab('dedication'); }}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition ${
                activeTab === 'dedication'
                  ? 'bg-white text-amber-900 shadow-md'
                  : 'bg-amber-600/60 text-white hover:bg-amber-600'
              }`}
            >
              💌 كَلِمَةُ الإِهْدَاءِ
            </button>
            <button
              onClick={() => { sounds.playClick(); setActiveTab('classmates'); }}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition ${
                activeTab === 'classmates'
                  ? 'bg-white text-amber-900 shadow-md'
                  : 'bg-amber-600/60 text-white hover:bg-amber-600'
              }`}
            >
              ⭐ نُجُومُ الْفَصْلِ ({classmates.length})
            </button>
            <button
              onClick={() => { sounds.playClick(); setActiveTab('certificate'); }}
              className={`px-4 py-1.5 rounded-full text-xs font-black transition ${
                activeTab === 'certificate'
                  ? 'bg-white text-amber-900 shadow-md'
                  : 'bg-amber-600/60 text-white hover:bg-amber-600'
              }`}
            >
              📜 وَثِيقَةُ الْفَخْرِ
            </button>
          </div>
        </div>

        {/* Tab 1: Dedication Message */}
        {activeTab === 'dedication' && (
          <div className="p-5 sm:p-6 space-y-5">
            {/* Heartfelt Dedication Box */}
            <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-amber-200 rounded-2xl p-5 relative overflow-hidden shadow-sm">
              <div className="absolute top-2 left-2 text-amber-200 text-6xl select-none pointer-events-none opacity-40">
                ❤️
              </div>
              <div className="flex items-center gap-2 text-amber-900 font-black text-sm mb-2">
                <Heart className="w-5 h-5 text-red-500 fill-red-400 animate-pulse" />
                <span>رِسَالَةٌ مِنَ الأَبِ وَالْمُعَلِّمِ: شَرِيف عَسْقَلَانِي</span>
              </div>
              <p className="text-stone-800 text-sm sm:text-base leading-relaxed font-bold font-naskh text-justify">
                «إِلَى قُرَّةِ عَيْنِي وَابْنِي الْحَبِيبِ <span className="text-amber-700 font-black">الْبَطَلِ مَالِك</span>، وَإِلَى جَمِيعِ أَصْدِقَائِهِ وَزُمَلائِهِ النُّجَبَاءِ فِي الصَّفِّ الثَّالِثِ الابْتِدَائِيِّ، وَإِلَى مُعَلِّمِيهِ الأَفَاضِلِ الَّذِينَ يُضِيئُونَ طَرِيقَ الْعِلْمِ.. 
                <br /><br />
                أُهْدِيكُمْ هَذِهِ الْمَغَامَرَةَ التَّعْلِيمِيَّةَ التَّفَاعُلِيَّةَ، لِتَكُونَ مَعَكُمْ فِي الْفَصْلِ وَالْبَيْتِ؛ تَحْفَظُونَ بِهَا الأَنَاشِيدَ، وَتَتْقِنُونَ النَّحْوَ وَالإِمْلَاءَ، وَتَتَحَدَّثُونَ مَعَ الرُّوبُوتِ الْمُعَلِّمِ بِكُلِّ ثِقَةٍ وَفَرَحٍ!»
              </p>

              <div className="mt-4 pt-3 border-t border-amber-200 flex items-center justify-between flex-wrap gap-2">
                <div className="text-xs font-black text-amber-800">
                  صُنِعَتْ بِحُبٍّ وَفَخْرٍ لِفَصْلِ مَالِك 🏫
                </div>
                <button
                  onClick={triggerRoyalCelebration}
                  className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-black px-4 py-2 rounded-xl shadow transition transform active:scale-95 flex items-center gap-1.5"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>تَفْجِيرُ نُجُومِ التَّهْنِئَةِ 🎉</span>
                </button>
              </div>
            </div>

            {/* Quick Share to Class WhatsApp */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-right">
                <p className="text-emerald-950 font-black text-sm">
                  مُشَارَكَةُ اللُّعْبَةِ مَعَ مُعَلِّمِي وَأَبْطَالِ الْفَصْلِ
                </p>
                <p className="text-emerald-700 text-xs font-medium">
                  انْسَخْ رِسَالَةَ الإِهْدَاءِ لِإِرْسَالِهَا فِي جُرُوبِ وَاتْسَابِ الْفَصْلِ أَوِ الْمَدْرَسَةِ
                </p>
              </div>
              <button
                onClick={handleCopyShareLink}
                className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs px-4 py-2.5 rounded-xl shadow transition flex items-center justify-center gap-2 whitespace-nowrap"
              >
                {copySuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-200" />
                    <span>تَمَّ النَّسْخُ بِنَجَاحٍ! ✅</span>
                  </>
                ) : (
                  <>
                    <Share2 className="w-4 h-4" />
                    <span>نَسْخُ رَابِطِ الإِهْدَاءِ 📋</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Classmates Roster */}
        {activeTab === 'classmates' && (
          <div className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-black text-stone-900 text-base">
                  لَوْحَةُ شَرَفِ زُمَلَاءِ الْفَصْلِ 🌟
                </h3>
                <p className="text-xs text-stone-500 font-bold">
                  انْقُرْ عَلَى اسْمِ أَيِّ تِلْمِيذٍ لِتَفْعِيلِ شَخْصِيَّتِهِ وَاللَّعِبِ بِاسْمِهِ!
                </p>
              </div>
              <span className="bg-amber-100 text-amber-900 text-xs font-black px-3 py-1 rounded-full border border-amber-300">
                {classmates.length} أَبْطَال
              </span>
            </div>

            {/* Grid of Classmates */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto p-1">
              {classmates.map((student, idx) => {
                const isSelected = currentProfile.name === student.name;
                return (
                  <button
                    key={`${student.name}-${idx}`}
                    onClick={() => {
                      sounds.playClick();
                      onSwitchHero(student.name, student.heroType);
                      confetti({ particleCount: 30, spread: 50 });
                    }}
                    className={`p-3 rounded-2xl border-2 text-right transition transform active:scale-95 flex items-center gap-2.5 ${
                      isSelected
                        ? 'bg-amber-100 border-amber-500 shadow-md ring-2 ring-amber-300'
                        : 'bg-stone-50 hover:bg-amber-50 border-stone-200 hover:border-amber-300'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-xl shadow-xs">
                      {student.avatar}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-xs text-stone-900 truncate">
                        {student.name}
                      </p>
                      <p className="text-[10px] font-bold text-amber-700 truncate">
                        {student.tag}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Add Custom Classmate Form */}
            <form onSubmit={handleAddStudent} className="pt-3 border-t border-stone-200">
              <p className="text-xs font-black text-stone-700 mb-2">
                ➕ أَضِفْ اسْمَ زَمِيلٍ أَوْ زَمِيلَةٍ جَدِيدَةٍ فِي الْفَصْلِ:
              </p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newStudentName}
                  onChange={(e) => setNewStudentName(e.target.value)}
                  placeholder="اكْتُبِ اسْمَ التِّلْمِيذِ هُنَا..."
                  className="flex-1 bg-stone-50 border-2 border-stone-300 rounded-xl px-3 py-2 text-xs font-bold text-stone-800 focus:outline-none focus:border-amber-500"
                />
                <select
                  value={newStudentGender}
                  onChange={(e) => setNewStudentGender(e.target.value as 'boy' | 'girl')}
                  className="bg-stone-50 border-2 border-stone-300 rounded-xl px-2 py-2 text-xs font-bold text-stone-800"
                >
                  <option value="boy">بَطَلٌ 👦</option>
                  <option value="girl">بَطَلَةٌ 👧</option>
                </select>
                <button
                  type="submit"
                  className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-black px-4 py-2 rounded-xl shadow transition"
                >
                  إِضَافَة
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tab 3: Printable Royal Document */}
        {activeTab === 'certificate' && (
          <div className="p-5 sm:p-6 space-y-4">
            <div 
              id="printable-malek-dedication"
              className="bg-gradient-to-br from-amber-50 via-white to-amber-50 border-4 border-double border-amber-400 rounded-2xl p-6 text-center space-y-3 relative shadow-inner"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-amber-500 text-white shadow-md">
                <Crown className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-black text-amber-950">
                وَثِيقَةُ إِهْدَاءِ وَتَقْدِيرٍ مَلَكِيَّة
              </h3>
              <p className="text-xs text-stone-600 font-bold">
                تُهْدَى هَذِهِ الْمَغَامَرَةُ التَّعْلِيمِيَّةُ الْمُبَارَكَةُ إِلَى:
              </p>
              <div className="inline-block bg-amber-100 border-2 border-amber-300 px-6 py-2 rounded-2xl text-amber-950 font-black text-xl shadow-xs">
                ⭐ الْبَطَلُ مَالِك شَرِيف عَسْقَلَانِي ⭐
              </div>
              <p className="text-xs font-bold text-stone-700 leading-relaxed max-w-md mx-auto">
                وَإِلَى كَافَّةِ زُمَلائِهِ الْمُتَفَوِّقِينَ وَمُعَلِّمِيهِ الأَجِلَّاءِ فِي الصَّفِّ الثَّالِثِ الابْتِدَائِيِّ، تَقْدِيراً لِعَزِيمَتِهِمْ فِي حُبِّ وَإِتْقَانِ لُغَةِ الْقُرْآنِ الْكَرِيمِ.
              </p>
              <div className="pt-3 border-t border-amber-200 flex items-center justify-between text-[11px] font-black text-amber-900">
                <span>إِعْدَادٌ وَإِهْدَاءٌ: الأُسْتَاذُ شَرِيف عَسْقَلَانِي</span>
                <span>الْعَامُ الدِّرَاسِيُّ: ٢٠٢٦ - مِصْرُ 🇪🇬</span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => window.print()}
                className="bg-stone-800 hover:bg-stone-900 text-white text-xs font-black px-5 py-2.5 rounded-xl shadow transition flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                <span>طِبَاعَةُ وَثِيقَةِ الإِهْدَاءِ</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-stone-50 border-t border-stone-200 px-5 py-3 text-center text-xs font-bold text-stone-500">
          مَغَامَرَةُ اللُّغَةِ الْعَرَبِيَّةِ - إِعْدَادٌ وَتَطْوِيرٌ: الأُسْتَاذُ شَرِيف عَسْقَلَانِي 🌟
        </div>

      </div>
    </div>
  );
};
