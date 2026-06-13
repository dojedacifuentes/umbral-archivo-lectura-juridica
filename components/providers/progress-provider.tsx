"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { contentRepository } from "@/lib/repository";
import { applyMissionResult, DEFAULT_PROGRESS, mergeProgress, STORAGE_KEY } from "@/lib/progress";
import { playSound } from "@/lib/sound";
import type { Achievement, MissionResult, SkillId, UserProgress } from "@/lib/types";

interface ProgressContextValue {
  progress: UserProgress;
  hydrated: boolean;
  lastAchievement: Achievement | null;
  beginMission: (missionId: string) => void;
  completeMission: (result: MissionResult, relic: string) => void;
  grantTrainingXp: (amount: number, skill: SkillId) => void;
  toggleSound: () => void;
  resetProgress: () => void;
  dismissAchievement: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [hydrated, setHydrated] = useState(false);
  const [lastAchievement, setLastAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      setProgress(mergeProgress(stored ? JSON.parse(stored) : null));
    } catch {
      setProgress(DEFAULT_PROGRESS);
    } finally {
      setHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (hydrated) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [hydrated, progress]);

  const value = useMemo<ProgressContextValue>(
    () => ({
      progress,
      hydrated,
      lastAchievement,
      beginMission: (missionId) => {
        setProgress((current) => ({ ...current, currentMissionId: missionId }));
        playSound("open", progress.soundEnabled);
      },
      completeMission: (result, relic) => {
        setProgress((current) => {
          const next = applyMissionResult(current, result, relic, contentRepository.getAchievements());
          const unlockedId = next.unlockedAchievements.find((id) => !current.unlockedAchievements.includes(id));
          if (unlockedId) {
            setLastAchievement(contentRepository.getAchievements().find((item) => item.id === unlockedId) ?? null);
            playSound("unlock", current.soundEnabled);
          } else {
            playSound(result.accuracy >= 60 ? "correct" : "incorrect", current.soundEnabled);
          }
          return next;
        });
      },
      grantTrainingXp: (amount, skill) => {
        setProgress((current) => ({
          ...current,
          xp: current.xp + amount,
          skillXp: { ...current.skillXp, [skill]: current.skillXp[skill] + amount },
        }));
      },
      toggleSound: () => setProgress((current) => ({ ...current, soundEnabled: !current.soundEnabled })),
      resetProgress: () => {
        setProgress(DEFAULT_PROGRESS);
        window.localStorage.removeItem(STORAGE_KEY);
      },
      dismissAchievement: () => setLastAchievement(null),
    }),
    [hydrated, lastAchievement, progress],
  );

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error("useProgress must be used inside ProgressProvider");
  return context;
}
