"use client";

import { useMemo, useState } from "react";
import { BookOpen, Highlighter, KeyRound } from "lucide-react";
import { GlossaryPanel } from "@/components/reader/glossary-panel";
import type { ReadingText } from "@/lib/types";

function HighlightedText({ text, phrases }: { text: string; phrases: string[] }) {
  const parts = useMemo(() => {
    if (!phrases.length) return [text];
    const escaped = phrases.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    return text.split(new RegExp(`(${escaped.join("|")})`, "gi"));
  }, [phrases, text]);
  return <>{parts.map((part, index) => phrases.some((phrase) => phrase.toLowerCase() === part.toLowerCase()) ? <mark key={index}>{part}</mark> : part)}</>;
}

export function TextReader({ text }: { text: ReadingText }) {
  const [marked, setMarked] = useState<string[]>([]);
  const [glossaryOpen, setGlossaryOpen] = useState(false);

  function togglePhrase(phrase: string) {
    setMarked((current) => current.includes(phrase) ? current.filter((item) => item !== phrase) : [...current, phrase]);
  }

  return (
    <section className="relative h-full min-h-[620px] overflow-hidden border border-white/10 bg-[#0b0c18]/90">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 bg-black/25 p-4">
        <div>
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.25em] text-neonCyan"><BookOpen size={14} /> Documento interceptado</p>
          <h1 className="mt-1 font-display text-2xl font-black uppercase text-white">{text.title}</h1>
        </div>
        <button type="button" onClick={() => setGlossaryOpen(true)} className="pixel-corners flex items-center gap-2 border border-neonCyan/30 bg-neonCyan/5 px-3 py-2 text-xs font-black uppercase tracking-wider text-neonCyan hover:bg-neonCyan/10">
          <KeyRound size={15} /> Glosario
        </button>
      </header>

      <div className="reader-paper p-5 sm:p-7 lg:p-9">
        <div className="mb-6 flex items-center gap-3 border-b border-dashed border-white/10 pb-4 text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">
          <span>{text.category}</span><span>/</span><span>Nivel {text.difficulty}</span><span>/</span><span>{text.estimatedTime} min</span>
        </div>
        <div className="space-y-6 font-serif text-[17px] leading-8 text-zinc-200 sm:text-lg sm:leading-9">
          {text.content.map((paragraph, index) => <p key={index}><HighlightedText text={paragraph} phrases={marked} /></p>)}
        </div>

        <div className="mt-9 border-t border-white/10 pt-5">
          <p className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-neonPink"><Highlighter size={14} /> Marcador de frases clave</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {text.keyPhrases.map((phrase) => (
              <button key={phrase} type="button" onClick={() => togglePhrase(phrase)} className={`border px-3 py-2 text-left text-xs transition ${marked.includes(phrase) ? "border-oldGold/50 bg-oldGold/15 text-oldGold" : "border-white/10 bg-white/[0.03] text-zinc-500 hover:text-zinc-200"}`}>
                “{phrase}”
              </button>
            ))}
          </div>
        </div>
      </div>
      <GlossaryPanel entries={text.glossary} open={glossaryOpen} onClose={() => setGlossaryOpen(false)} />
    </section>
  );
}
