import { describe, expect, it } from "vitest";
import { calculateMissionResult, evaluateAnswer } from "./scoring";
import type { Question } from "./types";

const question: Question = {
  id: "q1",
  type: "multiple",
  prompt: "Prueba",
  options: [{ id: "a", label: "A" }],
  answer: "a",
  explanation: "",
  hint: "",
  skill: "literal",
};

describe("scoring", () => {
  it("evalua respuestas simples y secuencias", () => {
    expect(evaluateAnswer(question, "a")).toBe(true);
    expect(evaluateAnswer({ ...question, answer: ["a", "b"] }, ["a", "b"])).toBe(true);
  });

  it("aplica penalizacion por pistas sin anular la recompensa", () => {
    const result = calculateMissionResult({
      missionId: "m1",
      questions: [question],
      answers: { q1: "a" },
      hintsUsed: 3,
      baseXp: 100,
      primarySkill: "literal",
    });
    expect(result.accuracy).toBe(100);
    expect(result.xpEarned).toBeGreaterThan(20);
    expect(result.xpEarned).toBeLessThan(100);
  });
});
