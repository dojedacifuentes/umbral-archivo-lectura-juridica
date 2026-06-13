"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Award, X } from "lucide-react";
import { useProgress } from "@/components/providers/progress-provider";

export function AchievementToast() {
  const { lastAchievement, dismissAchievement } = useProgress();
  return (
    <AnimatePresence>
      {lastAchievement && (
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-5 right-5 z-[80] w-[min(360px,calc(100vw-2.5rem))] pixel-corners border border-oldGold/70 bg-[#12101f]/95 p-4 shadow-gold backdrop-blur-xl"
        >
          <button className="absolute right-3 top-3 text-zinc-500 hover:text-white" onClick={dismissAchievement} aria-label="Cerrar logro">
            <X size={16} />
          </button>
          <div className="flex gap-3 pr-5">
            <div className="grid h-11 w-11 shrink-0 place-items-center border border-oldGold/50 bg-oldGold/10 text-oldGold"><Award /></div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.24em] text-oldGold">Logro desbloqueado</p>
              <p className="mt-1 font-display text-xl font-black uppercase text-white">{lastAchievement.title}</p>
              <p className="mt-1 text-xs leading-5 text-zinc-400">{lastAchievement.description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
