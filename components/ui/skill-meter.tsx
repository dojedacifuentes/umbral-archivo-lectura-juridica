import type { SkillId } from "@/lib/types";

export const skillLabels: Record<SkillId, string> = {
  literal: "Lectura literal",
  inference: "Inferencia",
  vocabulary: "Vocabulario",
  argument: "Estructura argumental",
  critical: "Lectura crítica",
  synthesis: "Síntesis",
};

export function SkillMeter({ skill, value }: { skill: SkillId; value: number }) {
  const percentage = Math.min(100, Math.round((value / 650) * 100));
  return (
    <div className="border-l-2 border-neonCyan/40 pl-3">
      <div className="flex items-center justify-between gap-3 text-xs">
        <span className="font-bold text-zinc-200">{skillLabels[skill]}</span>
        <span className="font-mono text-neonCyan">{percentage}%</span>
      </div>
      <div className="mt-2 h-1.5 bg-white/10"><div className="h-full bg-neonCyan" style={{ width: `${percentage}%` }} /></div>
    </div>
  );
}
