"use client";

import { ArrowDown, ArrowUp, CheckCircle2, Lightbulb, XCircle } from "lucide-react";
import { PixelButton } from "@/components/ui/pixel-button";
import { evaluateAnswer } from "@/lib/scoring";
import type { Question } from "@/lib/types";

export function QuestionPanel({
  question,
  value,
  checked,
  hintVisible,
  onChange,
  onCheck,
  onHint,
}: {
  question: Question;
  value?: string | string[];
  checked: boolean;
  hintVisible: boolean;
  onChange: (value: string | string[]) => void;
  onCheck: () => void;
  onHint: () => void;
}) {
  const correct = checked ? evaluateAnswer(question, value ?? "") : false;
  const sequence = Array.isArray(value) ? value : question.options.map((option) => option.id);

  function move(id: string, direction: -1 | 1) {
    const current = [...sequence];
    const index = current.indexOf(id);
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= current.length) return;
    [current[index], current[nextIndex]] = [current[nextIndex], current[index]];
    onChange(current);
  }

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[10px] font-black uppercase tracking-[0.22em] text-neonPink">Desafío / {question.type}</p>
        <h2 className="mt-2 text-lg font-bold leading-7 text-white">{question.prompt}</h2>
      </div>

      {question.type === "sequence" ? (
        <div className="space-y-2">
          {sequence.map((id, index) => {
            const option = question.options.find((item) => item.id === id)!;
            return (
              <div key={id} className="flex items-center gap-3 border border-white/10 bg-black/25 p-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center border border-neonCyan/25 font-mono text-xs text-neonCyan">{index + 1}</span>
                <span className="flex-1 text-sm leading-6 text-zinc-300">{option.label}</span>
                <button disabled={checked || index === 0} onClick={() => move(id, -1)} className="p-2 text-zinc-500 hover:text-white disabled:opacity-20" aria-label="Mover arriba"><ArrowUp size={16} /></button>
                <button disabled={checked || index === sequence.length - 1} onClick={() => move(id, 1)} className="p-2 text-zinc-500 hover:text-white disabled:opacity-20" aria-label="Mover abajo"><ArrowDown size={16} /></button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="grid gap-2">
          {question.options.map((option, index) => {
            const selected = value === option.id;
            return (
              <button key={option.id} type="button" disabled={checked} onClick={() => onChange(option.id)} className={`group flex items-start gap-3 border p-3 text-left transition ${selected ? "border-neonCyan/55 bg-neonCyan/10 text-white" : "border-white/10 bg-black/25 text-zinc-400 hover:border-white/25 hover:text-zinc-200"}`}>
                <span className={`grid h-7 w-7 shrink-0 place-items-center border font-mono text-xs ${selected ? "border-neonCyan text-neonCyan" : "border-white/15 text-zinc-600"}`}>{String.fromCharCode(65 + index)}</span>
                <span className="pt-0.5 text-sm leading-6">{option.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {hintVisible && !checked && <div className="border-l-2 border-oldGold bg-oldGold/5 px-4 py-3 text-sm leading-6 text-amber-100/80"><span className="font-bold text-oldGold">Pista:</span> {question.hint}</div>}

      {checked && (
        <div className={`border p-4 ${correct ? "border-acid/40 bg-acid/5" : "border-blood/50 bg-blood/5"}`}>
          <p className={`flex items-center gap-2 font-black ${correct ? "text-acid" : "text-red-300"}`}>{correct ? <CheckCircle2 size={18} /> : <XCircle size={18} />}{correct ? "Lectura verificada. La pista encaja." : "La interpretación no resiste el expediente."}</p>
          <p className="mt-2 text-sm leading-6 text-zinc-300">{question.explanation}</p>
          {question.evidence && <p className="mt-2 font-mono text-xs text-neonCyan">Evidencia: “{question.evidence}”</p>}
        </div>
      )}

      <div className="flex flex-col gap-2 sm:flex-row">
        <PixelButton variant="gold" className="flex-1" onClick={onHint} disabled={checked || hintVisible}><Lightbulb size={16} /> {hintVisible ? "Pista utilizada" : "Solicitar pista"}</PixelButton>
        <PixelButton variant="cyan" className="flex-1" onClick={onCheck} disabled={checked || (question.type !== "sequence" && !value)}>Verificar lectura</PixelButton>
      </div>
    </div>
  );
}
