"use client";

import { motion } from "framer-motion";
import { ArrowRight, BookOpenText, BrainCircuit, FileSearch, Play, ShieldCheck } from "lucide-react";
import { ArchiveScene } from "@/components/game/archive-scene";
import { GameCard } from "@/components/ui/game-card";
import { PixelButton } from "@/components/ui/pixel-button";
import { XPBar } from "@/components/ui/xp-bar";
import { useProgress } from "@/components/providers/progress-provider";
import { contentRepository } from "@/lib/repository";
import { getLevel, getNextRank, getRank } from "@/lib/scoring";

export default function HomePage() {
  const { progress } = useProgress();
  const rank = getRank(progress.xp);
  const nextRank = getNextRank(progress.xp);
  const firstIncomplete = contentRepository.getMissions().find((mission) => progress.xp >= mission.unlockAtXp && !progress.completedMissions[mission.id]) ?? contentRepository.getMissions()[0];
  const completed = Object.keys(progress.completedMissions).length;

  return (
    <div className="space-y-6">
      <section className="grid min-h-[650px] overflow-hidden border border-white/10 bg-[#0a0b17]/80 lg:grid-cols-[1.05fr_.95fr]">
        <div className="relative z-10 flex flex-col justify-center p-6 sm:p-10 lg:p-14">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-oldGold"><span className="signal-pulse h-2 w-2 bg-acid" /> Sistema de lectura forense activo</p>
            <h1 aria-label="UMBRAL" data-text="UMBRAL" className="glitch-title mt-5 font-display text-6xl font-black uppercase leading-[.82] tracking-[.04em] text-white sm:text-8xl xl:text-9xl">UMBRAL</h1>
            <p className="mt-4 font-display text-2xl font-black uppercase tracking-wide text-neonCyan sm:text-4xl">Archivo de lectura jurídica</p>
            <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg">Los textos complejos han sido clasificados como expedientes. Lee, conecta indicios, reconstruye argumentos y convierte la comprensión en tu habilidad principal.</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              <PixelButton href={`/mission/${firstIncomplete.id}`} variant="primary"><Play size={17} /> Iniciar investigación</PixelButton>
              <PixelButton href="/dashboard" variant="cyan"><ArrowRight size={17} /> Centro de mando</PixelButton>
              <PixelButton href="/missions" variant="gold"><FileSearch size={17} /> Archivo de textos</PixelButton>
              <PixelButton href="/training" variant="ghost"><BrainCircuit size={17} /> Modo entrenamiento</PixelButton>
            </div>
          </motion.div>
        </div>
        <div className="relative min-h-[360px] border-t border-white/10 bg-[radial-gradient(circle_at_center,rgba(44,247,255,.09),transparent_55%)] lg:border-l lg:border-t-0">
          <div className="absolute left-5 top-5 z-10 border-l-2 border-neonPink pl-3"><p className="hud-label">Nodo tridimensional</p><p className="mt-1 text-xs text-zinc-400">Geometría procedural / assets 0</p></div>
          <div className="hidden h-full lg:block"><ArchiveScene /></div>
          <div className="grid h-full min-h-[360px] place-items-center lg:hidden"><div className="signal-pulse h-28 w-28 rotate-45 border border-neonCyan/40 bg-neonPink/10 shadow-neon" /></div>
          <div className="absolute bottom-5 right-5 z-10 font-mono text-[9px] uppercase tracking-[.2em] text-neonCyan/60">R3F CORE // STABLE</div>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-[1.15fr_.85fr]">
        <GameCard kicker="Estado del investigador" title={`Nivel ${getLevel(progress.xp)} · ${rank.title}`}>
          <XPBar value={progress.xp - rank.minXp} max={Math.max(1, nextRank.minXp - rank.minXp)} label={`Progreso hacia ${nextRank.title}`} />
          <div className="mt-6 grid grid-cols-3 gap-3">
            <HomeMetric label="Expedientes" value={String(completed)} />
            <HomeMetric label="Reliquias" value={String(progress.collectedRelics.length)} />
            <HomeMetric label="Racha" value={`${progress.streak}d`} />
          </div>
        </GameCard>
        <GameCard kicker="Principio operativo" title="Leer no es adivinar">
          <div className="flex gap-4">
            <ShieldCheck className="shrink-0 text-acid" size={34} />
            <p className="text-sm leading-7 text-zinc-400">Cada respuesta debe resistir el expediente: información explícita, inferencias proporcionadas, estructura argumental y límites de la evidencia.</p>
          </div>
          <PixelButton href="/flashcards" variant="ghost" className="mt-5 w-full"><BookOpenText size={16} /> Consultar reliquias conceptuales</PixelButton>
        </GameCard>
      </div>
    </div>
  );
}

function HomeMetric({ label, value }: { label: string; value: string }) {
  return <div className="border border-white/10 bg-black/25 p-3 text-center"><p className="font-display text-2xl font-black text-white">{value}</p><p className="mt-1 text-[9px] font-black uppercase tracking-wider text-zinc-500">{label}</p></div>;
}
