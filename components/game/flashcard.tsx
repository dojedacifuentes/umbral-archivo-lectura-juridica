"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { RotateCcw } from "lucide-react";
import { useProgress } from "@/components/providers/progress-provider";
import { playSound } from "@/lib/sound";
import type { FlashcardData } from "@/lib/types";

const rarityStyles = {
  comun: "border-white/15 text-zinc-300",
  rara: "border-neonCyan/45 text-neonCyan",
  epica: "border-neonPink/50 text-neonPink",
  legendaria: "border-oldGold/60 text-oldGold shadow-gold",
};

export function Flashcard({ card }: { card: FlashcardData }) {
  const [flipped, setFlipped] = useState(false);
  const { progress } = useProgress();
  return (
    <motion.button
      type="button"
      onClick={() => { setFlipped((value) => !value); playSound("flip", progress.soundEnabled); }}
      whileHover={{ y: -4 }}
      className={`pixel-corners relative min-h-72 w-full overflow-hidden border bg-[#101120]/95 p-5 text-left ${rarityStyles[card.rarity]}`}
    >
      <div className="absolute right-3 top-3 text-[9px] font-black uppercase tracking-[0.22em]">{card.rarity}</div>
      <div className="flex h-full min-h-60 flex-col justify-between">
        {!flipped ? (
          <>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-zinc-500">{card.category}</p>
              <h3 className="mt-8 font-display text-3xl font-black uppercase leading-none text-white">{card.concept}</h3>
            </div>
            <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-zinc-500"><RotateCcw size={15} /> Voltear reliquia</p>
          </>
        ) : (
          <>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em]">Registro descifrado</p>
              <p className="mt-5 text-sm font-bold leading-6 text-white">{card.definition}</p>
              <p className="mt-5 border-l-2 border-current pl-3 text-xs leading-6 text-zinc-400">Ejemplo: {card.example}</p>
            </div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-600">Toca para volver</p>
          </>
        )}
      </div>
    </motion.button>
  );
}
