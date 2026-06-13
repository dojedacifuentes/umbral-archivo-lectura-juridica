import { CaseFile } from "@/components/game/case-file";
import { GameCard } from "@/components/ui/game-card";
import { PixelButton } from "@/components/ui/pixel-button";
import { contentRepository } from "@/lib/repository";

export default function CaseFilePage() {
  const text = contentRepository.getText("contrato-ambiguo")!;
  const mission = contentRepository.getMission("mision-contrato")!;
  return (
    <div className="space-y-6">
      <header><p className="hud-label text-neonPink">Modo caso / investigación narrativa</p><h1 className="mt-2 font-display text-4xl font-black uppercase text-white sm:text-6xl">Caso 001: El contrato ambiguo</h1><p className="mt-4 max-w-3xl text-sm leading-7 text-zinc-400">Tres piezas, una expresión discutida y dos lecturas rivales. Separa hechos de valoraciones antes de elegir una interpretación.</p></header>
      <CaseFile text={text} />
      <GameCard kicker="Protocolo de cierre" title="Objetivos del investigador">
        <div className="grid gap-3 text-sm text-zinc-300 sm:grid-cols-2 lg:grid-cols-4">
          {["Aislar información relevante","Distinguir hecho y opinión","Detectar la ambigüedad","Justificar la lectura más coherente"].map((item, index) => <div key={item} className="border border-white/10 bg-black/25 p-4"><span className="font-mono text-neonCyan">0{index + 1}</span><p className="mt-2 leading-6">{item}</p></div>)}
        </div>
        <PixelButton href={`/mission/${mission.id}`} className="mt-6 w-full sm:w-auto">Entrar al interrogatorio</PixelButton>
      </GameCard>
    </div>
  );
}
