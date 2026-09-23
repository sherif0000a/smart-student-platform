import { Unit } from '../types';
import { unit1Data } from './unit1Data';
import { unit2Data } from './unit2Data';
import { unit3Data } from './unit3Data';
export { allBadges } from './badgesData';

export const allUnits: Unit[] = [unit1Data, unit2Data, unit3Data];

export function findLessonById(lessonId: string) {
  if (!lessonId) return null;
  const cleanId = lessonId.toLowerCase().replace(/_/g, '-').trim();
  for (const unit of allUnits) {
    const found = unit.lessons.find((l) => {
      const lId = l.id.toLowerCase().replace(/_/g, '-').trim();
      return lId === cleanId || l.id === lessonId;
    });
    if (found) return { lesson: found, unit };
  }
  return null;
}

export function getTotalChallengesCount(): number {
  let count = 0;
  allUnits.forEach((u) => {
    u.lessons.forEach((l) => {
      count += l.challenges.length;
    });
  });
  return count;
}
