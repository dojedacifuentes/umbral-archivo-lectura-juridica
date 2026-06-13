export function XPBar({ value, max, label = "XP" }: { value: number; max: number; label?: string }) {
  const percentage = max <= 0 ? 100 : Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div>
      <div className="mb-2 flex justify-between text-[10px] font-black uppercase tracking-[0.18em] text-zinc-400">
        <span>{label}</span>
        <span className="text-neonCyan">{Math.round(value)} / {max}</span>
      </div>
      <div className="h-3 overflow-hidden border border-white/15 bg-black/50 p-[2px]">
        <div className="h-full bg-gradient-to-r from-neonPink via-violet-400 to-neonCyan shadow-neon transition-all" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
