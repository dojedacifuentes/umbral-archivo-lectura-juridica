import achievementsData from "@/data/achievements.json";
import flashcardsData from "@/data/flashcards.json";
import missionsData from "@/data/missions.json";
import textsData from "@/data/texts.json";
import type { Achievement, FlashcardData, Mission, ReadingText } from "@/lib/types";

// This boundary can later be replaced by a Supabase-backed implementation.
export const contentRepository = {
  getTexts: () => textsData as ReadingText[],
  getText: (id: string) => (textsData as ReadingText[]).find((text) => text.id === id),
  getMissions: () => missionsData as Mission[],
  getMission: (id: string) => (missionsData as Mission[]).find((mission) => mission.id === id),
  getFlashcards: () => flashcardsData as FlashcardData[],
  getAchievements: () => achievementsData as Achievement[],
};
