"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { ArrowRight, Clock3, Crosshair, LockKeyhole, RotateCcw } from "lucide-react";
import { TextReader } from "@/components/reader/text-reader";
import { QuestionPanel } from "@/components/reader/question-panel";
import { ResultScreen } from "@/components/game/result-screen";
import { GameCard } from "@/components/ui/game-card";
import { PixelButton } from "@/components/ui/pixel-button";
import { useProgress } from "@/components/providers/progress-provider";
import { contentRepository } from "@/lib/repository";
import { calculateMissionResult, evaluateAnswer } from "@/lib/scoring";
import { playSound } from "@/lib/sound";
import type { MissionResult } from "@/lib/types";

export default function MissionPage() {
  const params = useParams<{ id: string }>();
  const mission = contentRepository.getMission(params.id);
  const text = mission ? contentRepository.getText(mission.textId) : undefined;
  const { progress, beginMission, completeMission } = useProgress();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [checked, setChecked] = useState<string[]>([]);
  const [hints, setHints] = useState<string[]>([]);
  const [result, setResult] = useState<MissionResult | null>(null);

  useEffect(() => {
    if (mission) {
      beginMission(mission.id);
      if (mission.boss) playSound("boss", progress.soundEnabled);
    }
    // Run only when the route changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mission?.id]);

  const question = text?.questions[index];
  const currentValue = useMemo(() => {
    if (!question) return undefined;
    if (answers[question.id] !== undefined) return answers[question.id];
    return question.type === "sequence" ? question.options.map((option) => option.id) : undefined;
  }, [answers, question]);

  if (!mission || !text) {
    return <GameCard title="Expediente no encontrado" kicker="Error de archivo"><p className="text-zinc-400">La ruta no corresponde a una misión registrada.</p><PixelButton href="/missions" className="mt-5">Volver al mapa</PixelButton></GameCard>;
  }

  if (progress.xp < mission.unlockAtXp) {
    return <GameCard title="Acceso denegado" kicker="Nivel insuficiente"><div className="grid min-h-64 place-items-center text-center"><div><LockKeyhole className="mx-auto text-zinc-600" size={48} /><p className="mt-4 text-zinc-400">Este expediente requiere {mission.unlockAtXp} XP.</p><PixelButton href="/missions" variant="ghost" className="mt-5">Volver al mapa</PixelButton></div></div></GameCard>;
  }

  if (!question) {
    return <GameCard title="Expediente sin desafíos" kicker="Error de contenido"><p className="text-zinc-400">El texto no contiene una pregunta válida para esta etapa.</p><PixelButton href="/missions" className="mt-5">Volver al mapa</PixelButton></GameCard>;
  }

  function resetRun() {
    setIndex(0); setAnswers({}); setChecked([]); setHints([]); setResult(null);
  }

  function verify() {
    if (!question) return;
    const value = currentValue ?? "";
    setAnswers((current) => ({ ...current, [question.id]: value }));
    setChecked((current) => Array.from(new Set([...current, question.id])));
    playSound(evaluateAnswer(question, value) ? "correct" : "incorrect", progress.soundEnabled);
  }

  function advance() {
    if (!text || !mission) return;
    if (index < text.questions.length - 1) {
      setIndex((current) => current + 1);
      return;
    }
    const finalResult = calculateMissionResult({ missionId: mission.id, questions: text.questions, answers, hintsUsed: hints.length, baseXp: mission.rewardXp, primarySkill: mission.skill });
    setResult(finalResult);
    completeMission(finalResult, mission.relic);
  }

  if (result) return <ResultScreen result={result} mission={mission} onRetry={resetRun} />;

  return (
    <div className="space-y-4">
      <header className="grid gap-3 border border-white/10 bg-black/30 p-4 sm:grid-cols-[1fr_auto] sm:items-center">
        <div><p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-neonPink"><Crosshair size={14} /> Misión {mission.code} / {mission.boss ? "Boss textual" : "Investigación"}</p><p className="mt-1 text-sm text-zinc-400">{mission.briefing}</p></div>
        <div className="flex gap-3 text-[10px] font-black uppercase tracking-wider text-zinc-500"><span className="flex items-center gap-1"><Clock3 size={13} /> {text.estimatedTime} min</span><span>{index + 1}/{text.questions.length} desafíos</span></div>
      </header>

      <div className="grid gap-4 xl:grid-cols-[1.16fr_.84fr]">
        <TextReader text={text} />
        <aside className="border border-white/10 bg-[#0d0e1c]/95 p-4 sm:p-6">
          <div className="mb-5">
            <div className="flex justify-between text-[9px] font-black uppercase tracking-wider text-zinc-500"><span>Progreso del expediente</span><span>{Math.round(((index + (checked.includes(question.id) ? 1 : 0)) / text.questions.length) * 100)}%</span></div>
            <div className="mt-2 h-1.5 bg-white/10"><div className="h-full bg-gradient-to-r from-neonPink to-neonCyan transition-all" style={{ width: `${((index + (checked.includes(question.id) ? 1 : 0)) / text.questions.length) * 100}%` }} /></div>
          </div>
          <QuestionPanel
            question={question}
            value={currentValue}
            checked={checked.includes(question.id)}
            hintVisible={hints.includes(question.id)}
            onChange={(value) => setAnswers((current) => ({ ...current, [question.id]: value }))}
            onCheck={verify}
            onHint={() => setHints((current) => Array.from(new Set([...current, question.id])))}
          />
          {checked.includes(question.id) && (
            <PixelButton onClick={advance} className="mt-5 w-full" variant={index === text.questions.length - 1 ? "primary" : "cyan"}>
              {index === text.questions.length - 1 ? "Cerrar investigación" : "Siguiente capa"} <ArrowRight size={16} />
            </PixelButton>
          )}
          <button onClick={resetRun} className="mt-5 flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-zinc-600 hover:text-zinc-300"><RotateCcw size={13} /> Reiniciar expediente</button>
        </aside>
      </div>
    </div>
  );
}
