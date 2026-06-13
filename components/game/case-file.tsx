import { FileWarning, Mail, ScrollText } from "lucide-react";
import type { ReadingText } from "@/lib/types";

export function CaseFile({ text }: { text: ReadingText }) {
  const icons = [ScrollText, Mail, FileWarning];
  const labels = ["Cláusula", "Comunicación previa", "Conducta posterior"];
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {text.content.map((item, index) => {
        const Icon = icons[index] ?? FileWarning;
        return (
          <article key={index} className="pixel-corners border border-white/10 bg-black/30 p-5">
            <div className="flex items-center gap-3 text-neonCyan"><Icon size={20} /><span className="text-[10px] font-black uppercase tracking-[0.2em]">Pieza {index + 1}</span></div>
            <h3 className="mt-4 font-display text-xl font-black uppercase text-white">{labels[index] ?? `Documento ${index + 1}`}</h3>
            <p className="mt-3 text-sm leading-7 text-zinc-400">{item}</p>
          </article>
        );
      })}
    </div>
  );
}
