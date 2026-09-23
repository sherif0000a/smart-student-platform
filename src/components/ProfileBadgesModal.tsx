import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { UserProfile, Badge } from '../types';
import { computeUserBadges, BadgeProgress } from '../utils/badgeSystem';
import { sounds } from '../utils/audio';
import { 
  X, 
  Award, 
  Star, 
  CheckCircle2, 
  Lock, 
  Sparkles, 
  Trophy, 
  BookOpen, 
  UserCheck, 
  Flame,
  Calendar
} from 'lucide-react';

interface ProfileBadgesModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onOpenEditProfile: () => void;
  onOpenCertificate: () => void;
}

export const ProfileBadgesModal: React.FC<ProfileBadgesModalProps> = ({
  isOpen,
  onClose,
  profile,
  onOpenEditProfile,
  onOpenCertificate
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'units' | 'achievements'>('units');
  const [selectedBadge, setSelectedBadge] = useState<BadgeProgress | null>(null);

  if (!isOpen) return null;

  const { allProgress, unlockedBadges } = computeUserBadges(profile);

  const isGirl = profile.heroType === 'girl';
  const heroBadge = isGirl ? 'بَطَلَتُنَا الْمُبْدِعَةُ' : 'بَطَلُنَا الشُّجَاعُ';

  const filteredBadges = allProgress.filter((p) => {
    if (activeTab === 'units') return p.badge.category === 'unit';
    if (activeTab === 'achievements') return p.badge.category !== 'unit';
    return true;
  });

  return (
    <AnimatePresence>
      <div 
        id="profile-badges-backdrop"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 md:p-6 bg-stone-950/70 backdrop-blur-sm overflow-y-auto"
      >
        <motion.div 
          id="profile-badges-card"
          initial={{ opacity: 0, scale: 0.94, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 16 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border-4 border-amber-300 overflow-hidden my-auto flex flex-col max-h-[90vh]"
        >
          {/* Header Bar */}
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 p-5 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center text-3xl shadow-inner">
                {profile.avatar === 'girl_hero' ? '👧' : profile.avatar === 'robot_companion' ? '🤖' : '👦'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xl md:text-2xl font-black">{profile.name}</h3>
                  <span className="text-xs bg-white/20 px-2.5 py-0.5 rounded-full font-bold">
                    {heroBadge}
                  </span>
                </div>
                <p className="text-amber-100 text-xs font-semibold">
                  مَلَفُّ البَطَلِ وَلَوْحَةُ الأَوْسِمَةِ الرَّقْمِيَّةِ الشَّرَفِيَّةِ
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onOpenEditProfile();
                }}
                className="text-xs font-bold bg-white/20 hover:bg-white/30 text-white px-3 py-1.5 rounded-xl transition"
              >
                تَعْدِيلُ الاسْمِ
              </button>
              <button
                type="button"
                onClick={() => {
                  sounds.playClick();
                  onClose();
                }}
                className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 p-4 bg-amber-50/70 border-b border-amber-200/80 shrink-0 text-center">
            <div className="bg-white p-2.5 rounded-2xl border border-amber-200 shadow-2xs">
              <div className="flex items-center justify-center gap-1 text-amber-500 font-bold text-xs mb-0.5">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>الْـنُّجُومُ</span>
              </div>
              <span className="text-xl font-black text-amber-950">{profile.totalStars}</span>
            </div>

            <div className="bg-white p-2.5 rounded-2xl border border-amber-200 shadow-2xs">
              <div className="flex items-center justify-center gap-1 text-purple-600 font-bold text-xs mb-0.5">
                <Award className="w-4 h-4" />
                <span>الأَوْسِمَةُ</span>
              </div>
              <span className="text-xl font-black text-purple-950">
                {unlockedBadges.length} / {allProgress.length}
              </span>
            </div>

            <div className="bg-white p-2.5 rounded-2xl border border-amber-200 shadow-2xs">
              <div className="flex items-center justify-center gap-1 text-emerald-600 font-bold text-xs mb-0.5">
                <BookOpen className="w-4 h-4" />
                <span>الدُّرُوسُ</span>
              </div>
              <span className="text-xl font-black text-emerald-950">
                {profile.completedLessons?.length || 0}
              </span>
            </div>
          </div>

          {/* Badges Filter Tabs */}
          <div className="px-5 pt-3 pb-1 flex items-center justify-between gap-2 border-b border-stone-200 shrink-0">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  sounds.playTabSwitch();
                  setActiveTab('units');
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition ${
                  activeTab === 'units'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                🥇 أَوْسِمَةُ إِتْمَامِ الْوَحْدَاتِ
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playTabSwitch();
                  setActiveTab('achievements');
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition ${
                  activeTab === 'achievements'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                🌟 أَوْسِمَةُ الإِنْجَازِ وَالنُّجُومِ
              </button>

              <button
                type="button"
                onClick={() => {
                  sounds.playTabSwitch();
                  setActiveTab('all');
                }}
                className={`px-3 py-1.5 rounded-xl font-black text-xs transition ${
                  activeTab === 'all'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                الْكُلُّ ({allProgress.length})
              </button>
            </div>

            <button
              type="button"
              onClick={() => {
                sounds.playClick();
                onOpenCertificate();
              }}
              className="flex items-center gap-1.5 text-xs font-black bg-gradient-to-r from-yellow-400 to-amber-500 text-amber-950 px-3 py-1.5 rounded-xl shadow-2xs hover:shadow transition"
            >
              <Trophy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">عَرْضُ الشَّهَادَةِ</span>
            </button>
          </div>

          {/* Badges Grid */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredBadges.map((item) => {
                const { badge, isUnlocked, progressPercent, hintText } = item;

                return (
                  <motion.div
                    key={badge.id}
                    layout
                    whileHover={{ scale: 1.015 }}
                    onClick={() => {
                      sounds.playButtonTap();
                      setSelectedBadge(item);
                    }}
                    className={`p-3.5 rounded-2xl border-2 transition cursor-pointer flex items-start gap-3 relative overflow-hidden ${
                      isUnlocked
                        ? 'bg-gradient-to-br from-amber-50/80 via-white to-yellow-50/60 border-amber-300 shadow-sm'
                        : 'bg-stone-50/80 border-stone-200 text-stone-400'
                    }`}
                  >
                    {/* Badge Icon */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shrink-0 shadow-sm ${
                      isUnlocked 
                        ? 'bg-gradient-to-tr from-amber-400 to-yellow-300 text-amber-950 ring-2 ring-amber-400/50' 
                        : 'bg-stone-200 text-stone-400 grayscale'
                    }`}>
                      {badge.icon}
                    </div>

                    {/* Badge Details */}
                    <div className="flex-1 min-w-0 text-right">
                      <div className="flex items-center justify-between gap-1 mb-1">
                        <h4 className={`font-black text-sm truncate ${
                          isUnlocked ? 'text-stone-900' : 'text-stone-600'
                        }`}>
                          {badge.title}
                        </h4>
                        {isUnlocked ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-black bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            مُكْتَسَبٌ
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-stone-200 text-stone-600 px-2 py-0.5 rounded-full">
                            <Lock className="w-3 h-3 text-stone-500" />
                            مُقْفَلٌ
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed mb-2">
                        {badge.description}
                      </p>

                      {/* Progress Bar */}
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold">
                          <span className="text-stone-500">{hintText}</span>
                          <span className={isUnlocked ? 'text-amber-700' : 'text-stone-400'}>
                            {progressPercent}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercent}%` }}
                            transition={{ duration: 0.5, ease: 'easeOut' }}
                            className={`h-full rounded-full ${
                              isUnlocked 
                                ? 'bg-gradient-to-r from-amber-400 to-yellow-500' 
                                : 'bg-stone-400'
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Footer Note */}
          <div className="p-3 bg-stone-50 border-t border-stone-200 text-center text-xs font-bold text-stone-500 shrink-0">
            أَتْمِمْ كَافَّةَ دُرُوسِ كُلِّ وَحْدَةٍ لِفَتْحِ وَسَامِهَا الرَّقْمِيِّ وَتَتْوِيجِكَ فَارِساً لِلُّغَةِ الْعَرَبِيَّةِ 🌟
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
