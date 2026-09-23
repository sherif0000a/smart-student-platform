import { UserProfile, Badge } from '../types';
import { allBadges } from '../data/badgesData';
import { unit1Data } from '../data/unit1Data';
import { unit2Data } from '../data/unit2Data';
import { unit3Data } from '../data/unit3Data';

export interface BadgeProgress {
  badge: Badge;
  isUnlocked: boolean;
  progressPercent: number;
  currentCount: number;
  targetCount: number;
  hintText: string;
}

export function computeUserBadges(profile: UserProfile): {
  allProgress: BadgeProgress[];
  unlockedBadges: Badge[];
  lockedBadges: Badge[];
  newlyUnlockedIds: string[];
} {
  const completed = new Set(profile.completedLessons || []);
  const stars = profile.totalStars || 0;

  const unit1LessonIds = unit1Data.lessons.map(l => l.id);
  const unit2LessonIds = unit2Data.lessons.map(l => l.id);
  const unit3LessonIds = unit3Data.lessons.map(l => l.id);
  const allLessonIds = [...unit1LessonIds, ...unit2LessonIds, ...unit3LessonIds];

  const unit1DoneCount = unit1LessonIds.filter(id => completed.has(id)).length;
  const unit2DoneCount = unit2LessonIds.filter(id => completed.has(id)).length;
  const unit3DoneCount = unit3LessonIds.filter(id => completed.has(id)).length;
  const totalDoneCount = allLessonIds.filter(id => completed.has(id)).length;

  const previouslyUnlocked = new Set(profile.unlockedBadges || []);
  const eligibleUnlockedIds = new Set<string>();

  const allProgress: BadgeProgress[] = allBadges.map((badge) => {
    let isUnlocked = false;
    let progressPercent = 0;
    let currentCount = 0;
    let targetCount = 1;
    let hintText = '';

    if (badge.id === 'unit_1_complete') {
      currentCount = unit1DoneCount;
      targetCount = unit1LessonIds.length;
      progressPercent = Math.min(100, Math.round((currentCount / targetCount) * 100));
      isUnlocked = currentCount >= targetCount;
      hintText = `${currentCount} مِنْ ${targetCount} دُرُوسٍ مُكْتَمَلَةٍ فِي الْوَحْدَةِ الأُولَى`;
    } else if (badge.id === 'unit_2_complete') {
      currentCount = unit2DoneCount;
      targetCount = unit2LessonIds.length;
      progressPercent = Math.min(100, Math.round((currentCount / targetCount) * 100));
      isUnlocked = currentCount >= targetCount;
      hintText = `${currentCount} مِنْ ${targetCount} دُرُوسٍ مُكْتَمَلَةٍ فِي الْوَحْدَةِ الثَّانِيَةِ`;
    } else if (badge.id === 'unit_3_complete') {
      currentCount = unit3DoneCount;
      targetCount = unit3LessonIds.length;
      progressPercent = Math.min(100, Math.round((currentCount / targetCount) * 100));
      isUnlocked = currentCount >= targetCount;
      hintText = `${currentCount} مِنْ ${targetCount} دُرُوسٍ مُكْتَمَلَةٍ فِي الْوَحْدَةِ الثَّالِثَةِ`;
    } else if (badge.id === 'curriculum_complete') {
      currentCount = totalDoneCount;
      targetCount = allLessonIds.length;
      progressPercent = Math.min(100, Math.round((currentCount / targetCount) * 100));
      isUnlocked = currentCount >= targetCount;
      hintText = `${currentCount} مِنْ ${targetCount} دَرْساً فِي الْمَنْهَجِ كَامِلاً`;
    } else {
      // Star/Activity threshold badges
      targetCount = badge.requiredStars || 10;
      currentCount = stars;
      progressPercent = Math.min(100, Math.round((currentCount / targetCount) * 100));
      isUnlocked = currentCount >= targetCount;
      hintText = `${currentCount} مِنْ ${targetCount} ⭐ نَجْمَة`;
    }

    if (isUnlocked) {
      eligibleUnlockedIds.add(badge.id);
    }

    return {
      badge: {
        ...badge,
        isUnlocked
      },
      isUnlocked,
      progressPercent,
      currentCount,
      targetCount,
      hintText
    };
  });

  const unlockedBadges = allProgress.filter(p => p.isUnlocked).map(p => p.badge);
  const lockedBadges = allProgress.filter(p => !p.isUnlocked).map(p => p.badge);

  // Determine newly unlocked that were not in user's profile before
  const newlyUnlockedIds = Array.from(eligibleUnlockedIds).filter(id => !previouslyUnlocked.has(id));

  return {
    allProgress,
    unlockedBadges,
    lockedBadges,
    newlyUnlockedIds
  };
}

export function checkForNewBadges(oldProfile: UserProfile, newProfile: UserProfile): Badge[] {
  const oldRes = computeUserBadges(oldProfile);
  const newRes = computeUserBadges(newProfile);

  const oldUnlockedSet = new Set(oldRes.unlockedBadges.map(b => b.id));
  return newRes.unlockedBadges.filter(b => !oldUnlockedSet.has(b.id));
}
