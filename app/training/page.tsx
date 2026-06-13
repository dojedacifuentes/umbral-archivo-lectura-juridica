"use client";

import { useMemo, useState } from "react";
import { ArrowRight, BrainCircuit, RotateCcw, Zap } from "lucide-react";
import { QuestionPanel } from "@/components/reader/question-panel";
import { GameCard } from "@/components/ui/game-card";
import { PixelButton } from "@/components/ui/pixel-button";
import { useProgress } from "@/components/providers/progress-provider";
import { contentRepository } from "@/lib/repository";
import { evaluateAnswer } from "@/lib/scoring";
import type { Question } from "@/lib/types";

export default function TrainingPage() {
  const questions = useMemo(() => contentRepository.getTexts().slice(0, 5).map((text) => text.questions[0]), []);
  const { grantTrainingXp } = useProgress();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [checked, setChecked] = useState(false);
  const [hints, setHints] = useState<string[]>([]);
  const [finished, setFinished] = useState(false);
  const current = questions[index];
  const value = answers[current.id] ?? (current.type === "sequence" ? current.options.map((item) => item.id) : undefined);

  const score = questions.filter((question) => evaluateAnswer(question, answers[question.id] ?? "")).length;

  function next() {
    if (index < questions.length - 1) { setIndex((value) => value + 1); setChecked(false); return; }
    const earned = score * 22 + (evaluateAnswer(current, value ?? "") && !answers[current.id] ? 22 : 0);
    grantTrainingXp(Math.max(10, earned), "inference");
    setFinished(true);
  }

  function reset() { setIndex(0); setAnswers({}); setChecked(false); setHints([]); setFinished(false); }

  if (finished) {
    return <div className="mx-auto max-w-3xl"><GameCard kicker="Entrenamiento completado" title="Pulso lector estabilizado"><div className="grid place-items-center py-8 text-center"><Zap className="text-oldGold" size={44} /><p className="mt-5 font-display text-7xl font-black text-white">{score}/5</p><p className="mt-3 max-w-md text-sm leading-7 text-zinc-400">Cinco decisiones rápidas registradas. La velocidad solo cuenta cuando conserva la evidencia.</p><div className="mt-7 flex flex-col gap-3 sm:flex-row"><PixelButton onClick={reset}><RotateCcw size={16} /> Repetir ronda</PixelButton><PixelButton href="/missions" variant="cyan">Ir a misiones</PixelButton></div></div></GameCard></div>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-5">
      <header className="text-center"><p className="hud-label text-neonCyan">Modo entrenamiento / 5 pulsos</p><h1 className="mt-2 font-display text-4xl font-black uppercase text-white sm:text-6xl">Inferencia relámpago</h1><p className="mx-auto mt-3 max-w-2xl text-sm leading-7 text-zinc-500">Una pregunta por expediente. Feedback inmediato, recompensa breve y cero consecuencias sobre el mapa.</p></header>
      <GameCard kicker={`Pulso ${index + 1} de ${questions.length}`} title="Decisión rápida" action={<BrainCircuit className="text-neonPink" />}>
        <QuestionPanel
          question={current}
          value={value}
          checked={checked}
          hintVisible={hints.includes(current.id)}
          onChange={(answer) => setAnswers((state) => ({ ...state, [current.id]: answer }))}
          onCheck={() => { setAnswers((state) => ({ ...state, [current.id]: value ?? "" })); setChecked(true); }}
          onHint={() => setHints((state) => [...state, current.id])}
        />
        {checked && <PixelButton onClick={next} className="mt-5 w-full" variant="primary">{index === questions.length - 1 ? "Cerrar entrenamiento" : "Siguiente pulso"}<ArrowRight size={16} /></PixelButton>}
      </GameCard>
    </div>
  );
}
