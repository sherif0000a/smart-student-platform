import { Unit } from '../../types';
import { unit1Data } from '../../data/unit1Data';
import { unit2Data } from '../../data/unit2Data';
import { unit3Data } from '../../data/unit3Data';
export { defaultSpellingChallenges, initialTeacherDailyMissions } from '../../data/spellingBank';

export const arabicUnits: Unit[] = [unit1Data, unit2Data, unit3Data];

export function findArabicLessonById(lessonId: string) {
  if (!lessonId) return null;
  const cleanId = lessonId.toLowerCase().replace(/_/g, '-').trim();
  for (const unit of arabicUnits) {
    const found = unit.lessons.find((l) => {
      const lId = l.id.toLowerCase().replace(/_/g, '-').trim();
      return lId === cleanId || l.id === lessonId;
    });
    if (found) return { lesson: found, unit };
  }
  return null;
}
