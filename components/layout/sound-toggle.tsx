"use client";

import { Volume2, VolumeX } from "lucide-react";
import { useProgress } from "@/components/providers/progress-provider";

export function SoundToggle() {
  const { progress, toggleSound } = useProgress();
  return (
    <button
      type="button"
      onClick={toggleSound}
      aria-label={progress.soundEnabled ? "Desactivar sonido" : "Activar sonido"}
      className="pixel-corners flex items-center gap-2 border border-white/15 bg-white/5 px-3 py-2 text-xs font-black uppercase tracking-wider text-zinc-200 hover:border-neonCyan/50"
    >
      {progress.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
      <span className="hidden sm:inline">{progress.soundEnabled ? "Audio on" : "Audio off"}</span>
    </button>
  );
}
