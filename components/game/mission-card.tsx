"use client";

import { Check, LockKeyhole, Skull, Zap } from "lucide-react";
import { PixelButton } from "@/components/ui/pixel-button";
import { useProgress } from "@/components/providers/progress-provider";
import { skillLabels } from "@/components/ui/skill-meter";
import type { Mission } from "@/lib/types";

export function MissionCard({ mission }: { mission: Mission }) {
  const { progress, beginMission } = useProgress();
  const completed = Boolean(progress.completedMissions[mission.id]);
  const unlocked = progress.xp >= mission.unlockAtXp;
  const record = progress.completedMissions[mission.id];

  return (
    <article className={`mission-card pixel-corners border p-4 transition ${completed ? "border-acid/35 bg-acid/5" : unlocked ? "border-neonCyan/25 bg-black/35 hover:-translate-y-1 hover:border-neonCyan/60" : "border-white/8 bg-black/25 opacity-60"}`}>
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] font-black uppercase tracking-[0.24em] text-neonCyan">Expediente {mission.code}</p>
          <h3 className="mt-2 font-display text-2xl font-black uppercase leading-none text-white">{mission.title}</h3>
        </div>
        <div className={`grid h-10 w-10 shrink-0 place-items-center border ${completed ? "border-acid/50 text-acid" : mission.boss ? "border-blood/60 text-blood" : unlocked ? "border-neonPink/50 text-neonPink" : "border-white/15 text-zinc-600"}`}>
          {completed ? <Check /> : !unlocked ? <LockKeyhole /> : mission.boss ? <Skull /> : <Zap />}
        </div>
      </div>
      <p className="mt-4 min-h-20 text-sm leading-6 text-zinc-400">{mission.briefing}</p>
      <div className="mt-4 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-wider">
        <span className="border border-white/10 bg-white/5 px-2 py-1 text-zinc-300">{skillLabels[mission.skill]}</span>
        <span className="border border-oldGold/20 bg-oldGold/5 px-2 py-1 text-oldGold">Dificultad {mission.difficulty}</span>
        <span className="border border-neonPink/20 bg-neonPink/5 px-2 py-1 text-neonPink">+{mission.rewardXp} XP</span>
      </div>
      {record && <p className="mt-4 text-xs text-acid">Lectura verificada: {record.accuracy}% de precisión.</p>}
      <div className="mt-5">
        {unlocked ? (
          <PixelButton href={`/mission/${mission.id}`} variant={mission.boss ? "danger" : completed ? "ghost" : "cyan"} className="w-full" onActivate={() => beginMission(mission.id)}>
            {completed ? "Reabrir expediente" : mission.boss ? "Iniciar confrontación" : "Abrir expediente"}
          </PixelButton>
        ) : (
          <button disabled className="pixel-corners w-full border border-white/10 bg-white/5 px-4 py-3 text-xs font-black uppercase tracking-wider text-zinc-600">Bloqueado hasta {mission.unlockAtXp} XP</button>
        )}
      </div>
    </article>
  );
}
