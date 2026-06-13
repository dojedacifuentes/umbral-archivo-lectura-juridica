import type { Achievement, MissionResult, UserProgress } from "@/lib/types";

export const STORAGE_KEY = "umbral-reader-progress-v1";

export const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  streak: 0,
  lastStudyDate: null,
  completedMissions: {},
  skillXp: { literal: 0, inference: 0, vocabulary: 0, argument: 0, critical: 0, synthesis: 0 },
  unlockedAchievements: [],
  collectedRelics: [],
  soundEnabled: true,
  currentMissionId: null,
};

function dayStamp(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function updateStreak(progress: UserProgress) {
  const today = dayStamp();
  if (progress.lastStudyDate === today) return { streak: progress.streak, lastStudyDate: today };
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return {
    streak: progress.lastStudyDate === dayStamp(yesterday) ? progress.streak + 1 : 1,
    lastStudyDate: today,
  };
}

export function mergeProgress(value?: Partial<UserProgress> | null): UserProgress {
  return {
    ...DEFAULT_PROGRESS,
    ...value,
    completedMissions: { ...DEFAULT_PROGRESS.completedMissions, ...value?.completedMissions },
    skillXp: { ...DEFAULT_PROGRESS.skillXp, ...value?.skillXp },
    unlockedAchievements: Array.from(new Set(value?.unlockedAchievements ?? [])),
    collectedRelics: Array.from(new Set(value?.collectedRelics ?? [])),
  };
}

export function applyMissionResult(
  progress: UserProgress,
  result: MissionResult,
  relic: string,
  achievements: Achievement[],
) {
  const streak = updateStreak(progress);
  const nextSkillXp = (Object.keys(progress.skillXp) as Array<keyof typeof progress.skillXp>).reduce((skills, skill) => {
    skills[skill] = progress.skillXp[skill] + result.skillGains[skill];
    return skills;
  }, { ...progress.skillXp });
  const next: UserProgress = {
    ...progress,
    ...streak,
    xp: progress.xp + result.xpEarned,
    currentMissionId: null,
    completedMissions: {
      ...progress.completedMissions,
      [result.missionId]: {
        score: result.score,
        accuracy: result.accuracy,
        xpEarned: result.xpEarned,
        hintsUsed: result.hintsUsed,
        completedAt: new Date().toISOString(),
      },
    },
    skillXp: nextSkillXp,
    collectedRelics: Array.from(new Set([...progress.collectedRelics, relic])),
  };

  const completed = Object.keys(next.completedMissions).length;
  const unlocks = achievements
    .filter((achievement) => {
      if (achievement.condition === "first-mission") return completed >= 1;
      if (achievement.condition === "three-missions") return completed >= 3;
      if (achievement.condition === "perfect") return result.accuracy === 100;
      if (achievement.condition === "no-hints") return result.hintsUsed === 0;
      if (achievement.condition === "streak-3") return next.streak >= 3;
      if (achievement.condition === "xp-1000") return next.xp >= 1000;
      return false;
    })
    .map((achievement) => achievement.id);

  return { ...next, unlockedAchievements: Array.from(new Set([...next.unlockedAchievements, ...unlocks])) };
}
