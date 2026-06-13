"use client";

import { ArrowLeft, BookOpenText, RefreshCcw, Trophy } from "lucide-react";
import { GameCard } from "@/components/ui/game-card";
import { PixelButton } from "@/components/ui/pixel-button";
import { skillLabels } from "@/components/ui/skill-meter";
import type { Mission, MissionResult } from "@/lib/types";

export function ResultScreen({ result, mission, onRetry }: { result: MissionResult; mission: Mission; onRetry: () => void }) {
  const diagnosis = result.accuracy >= 85 ? "Lectura de alta precisión" : result.accuracy >= 60 ? "Expediente resuelto con zonas inestables" : "Archivo incompleto: requiere entrenamiento dirigido";
  return (
    <div className="mx-auto max-w-5xl space-y-5">
      <GameCard kicker="Informe de investigación cerrado" title={mission.title}>
        <div className="grid gap-6 lg:grid-cols-[.7fr_1.3fr]">
          <div className="grid place-items-center border border-neonCyan/20 bg-neonCyan/5 p-6 text-center">
            <Trophy className="text-oldGold" size={42} />
            <p className="mt-4 font-display text-6xl font-black text-white">{result.accuracy}%</p>
            <p className="mt-2 text-xs font-black uppercase tracking-[0.2em] text-neonCyan">Precisión de lectura</p>
          </div>
          <div>
            <p className="hud-label">Diagnóstico</p>
            <h2 className="mt-2 font-display text-3xl font-black uppercase text-white">{diagnosis}</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <Metric label="XP ganado" value={`+${result.xpEarned}`} />
              <Metric label="Aciertos" value={`${result.correct}/${result.total}`} />
              <Metric label="Pistas" value={String(result.hintsUsed)} />
            </div>
            <div className="mt-6 border-l-2 border-neonPink/50 pl-4">
              <p className="text-xs font-black uppercase tracking-wider text-neonPink">Habilidad reforzada</p>
              <p className="mt-1 text-sm text-zinc-300">{skillLabels[result.primarySkill]}</p>
            </div>
            <div className="mt-4 border-l-2 border-oldGold/50 pl-4">
              <p className="text-xs font-black uppercase tracking-wider text-oldGold">Recomendación</p>
              <p className="mt-1 text-sm leading-6 text-zinc-400">{result.mistakes.length ? `Entrena ${result.mistakes.map((skill) => skillLabels[skill]).join(", ").toLowerCase()} antes del siguiente archivo.` : "Avanza al siguiente expediente y mantén el criterio de evidencia."}</p>
            </div>
          </div>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-3">
          <PixelButton variant="ghost" onClick={onRetry}><RefreshCcw size={16} /> Repetir</PixelButton>
          <PixelButton href="/missions" variant="cyan"><ArrowLeft size={16} /> Volver al mapa</PixelButton>
          <PixelButton href="/flashcards" variant="gold"><BookOpenText size={16} /> Abrir reliquias</PixelButton>
        </div>
      </GameCard>
    </div>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return <div className="border border-white/10 bg-black/25 p-3"><p className="text-[9px] font-black uppercase tracking-wider text-zinc-500">{label}</p><p className="mt-1 font-mono text-xl font-black text-white">{value}</p></div>;
}
