"use client";

import { useState } from "react";
import { Award, CalendarDays, Gem, RotateCcw, ShieldAlert } from "lucide-react";
import { GameCard } from "@/components/ui/game-card";
import { PixelButton } from "@/components/ui/pixel-button";
import { SkillMeter } from "@/components/ui/skill-meter";
import { useProgress } from "@/components/providers/progress-provider";
import { contentRepository } from "@/lib/repository";
import { getLevel, getRank } from "@/lib/scoring";
import type { SkillId } from "@/lib/types";

export default function ProfilePage() {
  const { progress, resetProgress } = useProgress();
  const [confirming, setConfirming] = useState(false);
  const rank = getRank(progress.xp);
  const achievements = contentRepository.getAchievements();
  const history = Object.entries(progress.completedMissions).sort((a, b) => b[1].completedAt.localeCompare(a[1].completedAt));

  return (
    <div className="space-y-6">
      <GameCard kicker="Identidad del investigador" title={`Nivel ${getLevel(progress.xp)} · ${rank.title}`}>
        <div className="grid gap-5 lg:grid-cols-[.65fr_1.35fr]">
          <div className="grid place-items-center border border-neonPink/20 bg-neonPink/5 p-8 text-center"><div className="grid h-28 w-28 place-items-center border border-neonPink/50 bg-[#121122] font-display text-5xl font-black text-white shadow-pink">U</div><p className="mt-4 text-xs font-black uppercase tracking-[0.2em] text-neonPink">Investigador del Umbral</p><p className="mt-2 font-mono text-sm text-zinc-500">{progress.xp} XP acumulados</p></div>
          <div className="grid gap-4 sm:grid-cols-2">{(Object.keys(progress.skillXp) as SkillId[]).map((skill) => <SkillMeter key={skill} skill={skill} value={progress.skillXp[skill]} />)}</div>
        </div>
      </GameCard>

      <div className="grid gap-5 xl:grid-cols-2">
        <GameCard kicker="Insignias" title="Logros del archivo">
          <div className="grid gap-3 sm:grid-cols-2">
            {achievements.map((achievement) => { const unlocked = progress.unlockedAchievements.includes(achievement.id); return <div key={achievement.id} className={`border p-4 ${unlocked ? "border-oldGold/35 bg-oldGold/5" : "border-white/8 bg-black/20 opacity-45"}`}><Award size={19} className={unlocked ? "text-oldGold" : "text-zinc-600"} /><p className="mt-3 font-bold text-white">{achievement.title}</p><p className="mt-1 text-xs leading-5 text-zinc-500">{achievement.description}</p></div>; })}
          </div>
        </GameCard>
        <GameCard kicker="Bitácora" title="Últimos expedientes">
          {history.length ? <div className="space-y-2">{history.slice(0, 6).map(([id, record]) => { const mission = contentRepository.getMission(id); return <div key={id} className="flex items-center justify-between gap-4 border border-white/10 bg-black/25 p-3"><div><p className="text-sm font-bold text-white">{mission?.title ?? id}</p><p className="mt-1 flex items-center gap-1 text-[10px] text-zinc-600"><CalendarDays size={12} /> {new Date(record.completedAt).toLocaleDateString("es-CL")}</p></div><div className="text-right"><p className="font-mono text-neonCyan">{record.accuracy}%</p><p className="text-[9px] uppercase text-zinc-600">+{record.xpEarned} XP</p></div></div>; })}</div> : <div className="grid min-h-48 place-items-center border border-dashed border-white/10 text-center text-sm text-zinc-600">La bitácora todavía está vacía.</div>}
        </GameCard>
      </div>

      <GameCard kicker="Control local" title="Reiniciar progreso">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"><div className="flex gap-3"><ShieldAlert className="shrink-0 text-blood" /><p className="max-w-2xl text-sm leading-6 text-zinc-400">Elimina XP, misiones, reliquias, logros y racha guardados en este navegador. El contenido del juego no se modifica.</p></div>{!confirming ? <PixelButton variant="danger" onClick={() => setConfirming(true)}><RotateCcw size={16} /> Solicitar reinicio</PixelButton> : <div className="flex gap-2"><PixelButton variant="ghost" onClick={() => setConfirming(false)}>Cancelar</PixelButton><PixelButton variant="danger" onClick={() => { resetProgress(); setConfirming(false); }}>Confirmar borrado</PixelButton></div>}</div>
      </GameCard>
    </div>
  );
}
