import type { ReactNode } from "react";

export function GameCard({
  kicker,
  title,
  action,
  children,
  className = "",
}: {
  kicker?: string;
  title?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`arcade-panel pixel-corners pixel-border overflow-hidden ${className}`}>
      {(kicker || title || action) && (
        <header className="flex flex-col gap-3 border-b border-white/10 bg-black/25 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div>
            {kicker && <p className="text-[10px] font-black uppercase tracking-[0.28em] text-neonCyan">{kicker}</p>}
            {title && <h2 className="mt-1 font-display text-2xl font-black uppercase tracking-wide text-white">{title}</h2>}
          </div>
          {action}
        </header>
      )}
      <div className="p-4 sm:p-6">{children}</div>
    </section>
  );
}
