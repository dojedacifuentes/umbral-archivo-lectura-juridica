export type WorldId =
  | "literal"
  | "inferential"
  | "argumental"
  | "philosophical"
  | "jurist"
  | "boss";

export type SkillId =
  | "literal"
  | "inference"
  | "vocabulary"
  | "argument"
  | "critical"
  | "synthesis";

export type Difficulty = 1 | 2 | 3 | 4 | 5;
export type QuestionType = "multiple" | "true-false" | "thesis" | "premise" | "synthesis" | "sequence";

export interface QuestionOption {
  id: string;
  label: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  prompt: string;
  options: QuestionOption[];
  answer: string | string[];
  explanation: string;
  hint: string;
  evidence?: string;
  skill: SkillId;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
}

export interface ReadingText {
  id: string;
  title: string;
  category: "Derecho" | "Filosofia" | "Literatura" | "Academico";
  difficulty: Difficulty;
  world: WorldId;
  content: string[];
  keyPhrases: string[];
  glossary: GlossaryEntry[];
  questions: Question[];
  estimatedTime: number;
  rewards: { xp: number; relic: string };
}

export interface Mission {
  id: string;
  code: string;
  title: string;
  briefing: string;
  textId: string;
  world: WorldId;
  skill: SkillId;
  difficulty: Difficulty;
  rewardXp: number;
  relic: string;
  unlockAtXp: number;
  boss?: boolean;
}

export interface FlashcardData {
  id: string;
  concept: string;
  definition: string;
  example: string;
  category: string;
  rarity: "comun" | "rara" | "epica" | "legendaria";
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  condition: "first-mission" | "three-missions" | "perfect" | "no-hints" | "streak-3" | "xp-1000";
}

export interface MissionRecord {
  score: number;
  accuracy: number;
  xpEarned: number;
  hintsUsed: number;
  completedAt: string;
}

export interface UserProgress {
  xp: number;
  streak: number;
  lastStudyDate: string | null;
  completedMissions: Record<string, MissionRecord>;
  skillXp: Record<SkillId, number>;
  unlockedAchievements: string[];
  collectedRelics: string[];
  soundEnabled: boolean;
  currentMissionId: string | null;
}

export interface MissionResult {
  missionId: string;
  score: number;
  accuracy: number;
  correct: number;
  total: number;
  hintsUsed: number;
  xpEarned: number;
  primarySkill: SkillId;
  mistakes: SkillId[];
  skillGains: Record<SkillId, number>;
}
