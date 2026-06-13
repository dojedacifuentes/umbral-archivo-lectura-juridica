"use client";

import { Award, CalendarClock, FileStack, Gem, RadioTower } from "lucide-react";
import { GameCard } from "@/components/ui/game-card";
import { PixelButton } from "@/components/ui/pixel-button";
import { SkillMeter, skillLabels } from "@/components/ui/skill-meter";
import { XPBar } from "@/components/ui/xp-bar";
import { useProgress } from "@/components/providers/progress-provider";
import { contentRepository } from "@/lib/repository";
import { getLevel, getNextRank, getRank } from "@/lib/scoring";
import type { SkillId } from "@/lib/types";

export default function DashboardPage() {
  const { progress } = useProgress();
  const rank = getRank(progress.xp);
  const next = getNextRank(progress.xp);
  const missions = contentRepository.getMissions();
  const recommended = missions.find((mission) => progress.xp >= mission.unlockAtXp && !progress.completedMissions[mission.id]) ?? missions[missions.length - 1];
  const completed = Object.keys(progress.completedMissions).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 border-b border-white/10 pb-5 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="hud-label text-neonCyan">Centro de mando / investigador activo</p><h1 className="mt-2 font-display text-4xl font-black uppercase text-white sm:text-5xl">Panel de progreso</h1></div>
        <p className="max-w-lg text-sm leading-6 text-zinc-500">El archivo adapta la recomendación según XP y expedientes cerrados. No hay nube: todo permanece en este dispositivo.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">
        <GameCard kicker={`Nivel ${getLevel(progress.xp)}`} title={rank.title}>
          <XPBar value={progress.xp - rank.minXp} max={Math.max(1, next.minXp - rank.minXp)} label={`Siguiente rango: ${next.title}`} />
          <div className="mt-6 grid gap-3 sm:grid-cols-4">
            <DashMetric icon={FileStack} label="Misiones" value={`${completed}/${missions.length}`} />
            <DashMetric icon={Gem} label="Reliquias" value={String(progress.collectedRelics.length)} />
            <DashMetric icon={Award} label="Logros" value={String(progress.unlockedAchievements.length)} />
            <DashMetric icon={CalendarClock} label="Racha" value={`${progress.streak} días`} />
          </div>
        </GameCard>

        <GameCard kicker="Señal prioritaria" title="Siguiente expediente">
          <div className="flex items-start gap-4"><RadioTower className="signal-pulse shrink-0 text-neonPink" /><div><p className="font-mono text-xs text-neonCyan">{recommended.code}</p><h2 className="mt-1 text-xl font-black text-white">{recommended.title}</h2><p className="mt-3 text-sm leading-6 text-zinc-400">{recommended.briefing}</p></div></div>
          <PixelButton href={`/mission/${recommended.id}`} className="mt-5 w-full">Interceptar archivo</PixelButton>
        </GameCard>
      </div>

      <div className="grid gap-5 xl:grid-cols-[1fr_1fr]">
        <GameCard kicker="Matriz cognitiva" title="Habilidades lectoras">
          <div className="grid gap-5 sm:grid-cols-2">
            {(Object.keys(progress.skillXp) as SkillId[]).map((skill) => <SkillMeter key={skill} skill={skill} value={progress.skillXp[skill]} />)}
          </div>
        </GameCard>
        <GameCard kicker="Inventario" title="Reliquias recuperadas">
          {progress.collectedRelics.length ? <div className="grid gap-2 sm:grid-cols-2">{progress.collectedRelics.map((relic) => <div key={relic} className="flex items-center gap-3 border border-oldGold/20 bg-oldGold/5 p-3 text-sm text-amber-100"><Gem size={16} className="text-oldGold" />{relic}</div>)}</div> : <EmptyState copy="Aún no hay reliquias. Cierra un expediente para recuperar la primera." />}
        </GameCard>
      </div>
    </div>
  );
}

function DashMetric({ icon: Icon, label, value }: { icon: typeof Award; label: string; value: string }) { return <div className="border border-white/10 bg-black/25 p-3"><Icon size={16} className="text-neonCyan" /><p className="mt-3 font-display text-2xl font-black text-white">{value}</p><p className="text-[9px] font-black uppercase tracking-wider text-zinc-500">{label}</p></div>; }
function EmptyState({ copy }: { copy: string }) { return <div className="grid min-h-44 place-items-center border border-dashed border-white/10 p-6 text-center text-sm leading-6 text-zinc-500">{copy}</div>; }
