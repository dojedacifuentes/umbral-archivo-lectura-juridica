"use client";

import { useMemo, useState } from "react";
import { Gem } from "lucide-react";
import { Flashcard } from "@/components/game/flashcard";
import { contentRepository } from "@/lib/repository";

export default function FlashcardsPage() {
  const cards = contentRepository.getFlashcards();
  const categories = useMemo(() => ["Todas", ...Array.from(new Set(cards.map((card) => card.category)))], [cards]);
  const [category, setCategory] = useState("Todas");
  const visible = category === "Todas" ? cards : cards.filter((card) => card.category === category);

  return (
    <div>
      <header className="flex flex-col gap-5 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
        <div><p className="hud-label text-oldGold">Inventario conceptual</p><h1 className="mt-2 font-display text-4xl font-black uppercase text-white sm:text-6xl">Reliquias de lectura</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500">Conceptos, definiciones y ejemplos reunidos como cartas. Cada pieza fue escrita para el juego y puede reutilizarse sin dependencias externas.</p></div>
        <div className="flex items-center gap-2 text-xs text-oldGold"><Gem size={18} /> {visible.length} reliquias visibles</div>
      </header>
      <div className="mt-5 flex gap-2 overflow-x-auto pb-2">
        {categories.map((item) => <button key={item} onClick={() => setCategory(item)} className={`shrink-0 border px-3 py-2 text-[10px] font-black uppercase tracking-wider ${category === item ? "border-neonCyan/50 bg-neonCyan/10 text-neonCyan" : "border-white/10 bg-white/[0.03] text-zinc-500 hover:text-white"}`}>{item}</button>)}
      </div>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {visible.map((card) => <Flashcard key={card.id} card={card} />)}
      </div>
    </div>
  );
}
