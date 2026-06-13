"use client";

import { BookKey, X } from "lucide-react";
import type { GlossaryEntry } from "@/lib/types";

export function GlossaryPanel({ entries, open, onClose }: { entries: GlossaryEntry[]; open: boolean; onClose: () => void }) {
  if (!open) return null;
  return (
    <aside className="absolute inset-y-0 right-0 z-30 w-full max-w-sm border-l border-neonCyan/25 bg-[#0b0c19]/98 p-5 shadow-2xl backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <p className="flex items-center gap-2 font-display text-xl font-black uppercase text-white"><BookKey className="text-neonCyan" /> Glosario activo</p>
        <button onClick={onClose} aria-label="Cerrar glosario" className="text-zinc-500 hover:text-white"><X /></button>
      </div>
      <div className="mt-6 space-y-4">
        {entries.map((entry) => (
          <div key={entry.term} className="border-l-2 border-neonPink/50 bg-white/[0.03] px-4 py-3">
            <p className="font-bold text-neonPink">{entry.term}</p>
            <p className="mt-1 text-sm leading-6 text-zinc-400">{entry.definition}</p>
          </div>
        ))}
      </div>
    </aside>
  );
}
