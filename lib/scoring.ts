import type { MissionResult, Question, SkillId } from "@/lib/types";

export function normalizeAnswer(value: string) {
  return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toLowerCase();
}

export function evaluateAnswer(question: Question, response: string | string[]) {
  if (Array.isArray(question.answer)) {
    if (!Array.isArray(response) || response.length !== question.answer.length) return false;
    return question.answer.every((answer, index) => answer === response[index]);
  }

  return typeof response === "string" && normalizeAnswer(response) === normalizeAnswer(question.answer);
}

export function calculateMissionResult({
  missionId,
  questions,
  answers,
  hintsUsed,
  baseXp,
  primarySkill,
}: {
  missionId: string;
  questions: Question[];
  answers: Record<string, string | string[]>;
  hintsUsed: number;
  baseXp: number;
  primarySkill: SkillId;
}): MissionResult {
  const failedSkills: SkillId[] = [];
  const skillHits: Record<SkillId, number> = { literal: 0, inference: 0, vocabulary: 0, argument: 0, critical: 0, synthesis: 0 };
  const correct = questions.filter((question) => {
    const valid = evaluateAnswer(question, answers[question.id] ?? "");
    if (!valid) failedSkills.push(question.skill);
    if (valid) skillHits[question.skill] += 1;
    return valid;
  }).length;
  const accuracy = questions.length ? Math.round((correct / questions.length) * 100) : 0;
  const hintPenalty = Math.min(0.35, hintsUsed * 0.08);
  const xpEarned = Math.max(20, Math.round(baseXp * (0.45 + accuracy / 180) * (1 - hintPenalty)));
  const skillGains = (Object.keys(skillHits) as SkillId[]).reduce<Record<SkillId, number>>((gains, skill) => {
    gains[skill] = correct > 0 ? Math.round((xpEarned * skillHits[skill]) / correct) : skill === primarySkill ? xpEarned : 0;
    return gains;
  }, { literal: 0, inference: 0, vocabulary: 0, argument: 0, critical: 0, synthesis: 0 });

  return {
    missionId,
    score: Math.round(accuracy * 10 + Math.max(0, 300 - hintsUsed * 45)),
    accuracy,
    correct,
    total: questions.length,
    hintsUsed,
    xpEarned,
    primarySkill,
    mistakes: Array.from(new Set(failedSkills)),
    skillGains,
  };
}

export const ranks = [
  { minXp: 0, title: "Lector Novato" },
  { minXp: 180, title: "Aprendiz del Archivo" },
  { minXp: 420, title: "Interprete Forense" },
  { minXp: 760, title: "Analista del Umbral" },
  { minXp: 1200, title: "Jurista Hermeneutico" },
  { minXp: 1800, title: "Maestro del Texto Opaco" },
] as const;

export function getRank(xp: number) {
  return ranks.reduce((current, rank) => (xp >= rank.minXp ? rank : current), ranks[0]);
}

export function getLevel(xp: number) {
  return ranks.findIndex((rank) => rank.title === getRank(xp).title) + 1;
}

export function getNextRank(xp: number) {
  return ranks.find((rank) => rank.minXp > xp) ?? ranks[ranks.length - 1];
}
