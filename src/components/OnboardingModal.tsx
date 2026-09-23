import React, { useState } from 'react';
import { HeroType, UserProfile } from '../types';
import { sounds } from '../utils/audio';
import { Sparkles, User, Award, CheckCircle2 } from 'lucide-react';

interface OnboardingModalProps {
  initialProfile?: UserProfile | null;
  isOpen: boolean;
  onSave: (profile: UserProfile) => void;
  onClose?: () => void;
}

const AVATARS = [
  { id: 'boy_hero', label: 'بَطَلٌ شُجَاعٌ', icon: '👦', type: 'boy' as HeroType },
  { id: 'girl_hero', label: 'بَطَلَةٌ مُبْدِعَةٌ', icon: '👧', type: 'girl' as HeroType },
  { id: 'robot_companion', label: 'الرُّوبُوتُ الذَّكِيُّ', icon: '🤖', type: 'boy' as HeroType },
  { id: 'star_scholar', label: 'عَالِمُ الْمُسْتَقْبَلِ', icon: '🧑‍🎓', type: 'boy' as HeroType },
  { id: 'flower_explorer', label: 'مُسْتَكْشِفَةُ الأَمَلِ', icon: '🧕', type: 'girl' as HeroType },
];

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  initialProfile,
  isOpen,
  onSave,
  onClose
}) => {
  const [name, setName] = useState(initialProfile?.name || 'مَالِك');
  const [heroType, setHeroType] = useState<HeroType>(initialProfile?.heroType || 'boy');
  const [selectedAvatar, setSelectedAvatar] = useState(initialProfile?.avatar || 'boy_hero');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    sounds.playFanfare();

    onSave({
      name: name.trim(),
      heroType,
      avatar: selectedAvatar,
      totalStars: initialProfile?.totalStars || 0,
      completedLessons: initialProfile?.completedLessons || [],
      solvedChallenges: initialProfile?.solvedChallenges || [],
      unlockedBadges: initialProfile?.unlockedBadges || ['first_step'],
    });
  };

  const isGirl = heroType === 'girl';

  return (
    <div 
      id="onboarding-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm overflow-y-auto"
    >
      <div 
        id="onboarding-modal-card"
        className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden transform transition-all my-8"
      >
        {/* Playful Header */}
        <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-6 text-white text-center relative">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-3 shadow-inner text-4xl animate-bounce">
            🎒
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-wide drop-shadow-sm">
            مَغَامَرَةُ اللُّغَةِ الْعَرَبِيَّةِ
          </h2>
          <p className="text-amber-100 text-sm mt-1 font-semibold">
            الصَّفُّ الثَّالِثُ الابْتِدَائِيُّ - الْفَصْلُ الدِّرَاسِيُّ الأَوَّلُ
          </p>

          {/* Special Attribution Badge */}
          <div className="mt-3 inline-block bg-white/15 px-4 py-1.5 rounded-full border border-white/30 text-xs font-bold text-amber-50">
            تَصْمِيمٌ وَتَطْوِيرٌ: الأُسْتَاذُ شَرِيف عَسْقَلَانِي 🌟
          </div>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-6">
          <div className="text-center">
            <p className="text-lg font-bold text-stone-700">
              {isGirl ? 'أَهْلاً بِكِ يَا بَطَلَتَنَا الرَّائِعَةَ!' : 'أَهْلاً بِكَ يَا بَطَلَنَا الشُّجَاعَ!'}
            </p>
            <p className="text-sm text-stone-500 mt-1">
              اخْتَرْ اسْمَكَ وَشَخْصِيَّتَكَ لِنَبْدَأَ مَغَامَرَتَنَا فِي كِتَابِ الْوَزَارَةِ الرَّسْمِيِّ
            </p>
          </div>

          {/* Student Name Input */}
          <div className="space-y-2">
            <label htmlFor="student-name-input" className="block text-sm font-bold text-stone-700">
              مَا اسْمُكَ يَا بَطَلُ؟
            </label>
            <div className="relative">
              <input
                id="student-name-input"
                type="text"
                required
                maxLength={24}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="اكْتُبِ اسْمَكَ هُنَا (مِثْلَ: مَالِك)"
                className="w-full px-4 py-3 pr-11 bg-amber-50/50 border-2 border-amber-200 rounded-2xl text-lg font-bold text-stone-800 placeholder:text-stone-400 focus:outline-none focus:border-amber-500 focus:bg-white transition"
              />
              <User className="absolute right-3.5 top-3.5 w-5 h-5 text-amber-600" />
            </div>
          </div>

          {/* Hero Type Selection */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-stone-700">
              اخْتَرْ نَوْعَ الْبَطَلِ (لِتَخْصِيصِ كَلِمَاتِ التَّشْجِيعِ):
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                id="select-hero-boy"
                onClick={() => {
                  setHeroType('boy');
                  sounds.playClick();
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border-2 font-bold transition text-base ${
                  heroType === 'boy'
                    ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-sm'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span className="text-2xl">👦</span>
                <span>أَنَا بَطَلٌ (وَلَد)</span>
                {heroType === 'boy' && <CheckCircle2 className="w-4 h-4 text-blue-600" />}
              </button>

              <button
                type="button"
                id="select-hero-girl"
                onClick={() => {
                  setHeroType('girl');
                  sounds.playClick();
                }}
                className={`flex items-center justify-center gap-2 p-3 rounded-2xl border-2 font-bold transition text-base ${
                  heroType === 'girl'
                    ? 'border-pink-500 bg-pink-50 text-pink-800 shadow-sm'
                    : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <span className="text-2xl">👧</span>
                <span>أَنَا بَطَلَةٌ (بِنْت)</span>
                {heroType === 'girl' && <CheckCircle2 className="w-4 h-4 text-pink-600" />}
              </button>
            </div>
          </div>

          {/* Avatar Selector */}
          <div className="space-y-2">
            <label className="block text-sm font-bold text-stone-700">
              اخْتَرْ شَكْلَ رَمْزِكَ (الأَفَاتَار):
            </label>
            <div className="flex items-center justify-center gap-2 flex-wrap">
              {AVATARS.map((av) => {
                const isSelected = selectedAvatar === av.id;
                return (
                  <button
                    key={av.id}
                    id={`avatar-choice-${av.id}`}
                    type="button"
                    onClick={() => {
                      setSelectedAvatar(av.id);
                      sounds.playClick();
                    }}
                    className={`flex flex-col items-center p-2.5 rounded-2xl border-2 transition ${
                      isSelected
                        ? 'border-amber-500 bg-amber-100 shadow-md scale-105'
                        : 'border-stone-200 bg-stone-50 hover:bg-stone-100'
                    }`}
                  >
                    <span className="text-3xl">{av.icon}</span>
                    <span className="text-[11px] font-bold text-stone-600 mt-1">{av.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Start Adventure Button */}
          <div className="pt-2">
            <button
              id="start-adventure-btn"
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:to-orange-700 text-white font-black text-lg md:text-xl rounded-2xl shadow-lg hover:shadow-xl transition transform active:scale-95 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-6 h-6 animate-spin text-amber-200" />
              <span>انْطَلِقْ فِي الْمَغَامَرَةِ الآنَ!</span>
            </button>
          </div>

          {initialProfile && onClose && (
            <div className="text-center">
              <button
                type="button"
                onClick={onClose}
                className="text-xs text-stone-400 hover:text-stone-600 font-bold"
              >
                إِلْغَاءٌ وَالْعَوْدَةُ لِلَّعِبِ
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
