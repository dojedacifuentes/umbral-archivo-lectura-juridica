"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpenText, BrainCircuit, CircleUserRound, Map, Radar } from "lucide-react";
import { SoundToggle } from "@/components/layout/sound-toggle";
import { AchievementToast } from "@/components/layout/achievement-toast";
import { useProgress } from "@/components/providers/progress-provider";
import { getLevel, getRank } from "@/lib/scoring";

const nav = [
  { href: "/dashboard", label: "Centro", icon: Radar },
  { href: "/missions", label: "Mapa", icon: Map },
  { href: "/training", label: "Entrenar", icon: BrainCircuit },
  { href: "/flashcards", label: "Reliquias", icon: BookOpenText },
  { href: "/profile", label: "Perfil", icon: CircleUserRound },
];

export function CyberpunkLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { progress } = useProgress();
  const rank = getRank(progress.xp);

  return (
    <div className="min-h-screen overflow-x-hidden bg-void text-zinc-100">
      <div className="city-layer" aria-hidden="true" />
      <div className="grid-layer" aria-hidden="true" />
      <div className="rain-layer" aria-hidden="true" />
      <div className="scanlines" aria-hidden="true" />

      <header className="sticky top-0 z-50 border-b border-white/10 bg-void/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-3 lg:px-6">
          <Link href="/" className="group shrink-0 focus:outline-none focus:ring-2 focus:ring-neonCyan">
            <p className="font-display text-2xl font-black tracking-[0.14em] text-white">UM<span className="text-neonPink">BRAL</span></p>
            <p className="text-[8px] font-black uppercase tracking-[0.25em] text-neonCyan">Archivo de lectura jurídica</p>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Navegación principal">
            {nav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link key={item.href} href={item.href} className={`pixel-corners flex items-center gap-2 border px-3 py-2 text-[11px] font-black uppercase tracking-wider transition ${active ? "border-neonPink/60 bg-neonPink/15 text-white" : "border-transparent text-zinc-400 hover:border-white/10 hover:text-white"}`}>
                  <item.icon size={14} /> {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <div className="hidden border-r border-white/10 pr-3 text-right sm:block">
              <p className="text-[9px] font-black uppercase tracking-wider text-zinc-500">Nivel {getLevel(progress.xp)}</p>
              <p className="text-xs font-bold text-oldGold">{rank.title}</p>
            </div>
            <SoundToggle />
          </div>
        </div>
      </header>

      <main className="relative z-10 mx-auto min-h-[calc(100vh-72px)] max-w-[1500px] px-4 py-5 pb-24 lg:px-6 lg:py-8 lg:pb-10">{children}</main>

      <nav className="fixed inset-x-3 bottom-3 z-50 grid grid-cols-5 border border-white/10 bg-[#0a0a16]/95 p-1 shadow-2xl backdrop-blur-xl lg:hidden" aria-label="Navegación móvil">
        {nav.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 px-1 py-2 text-[8px] font-black uppercase tracking-wider ${active ? "bg-neonPink/15 text-neonPink" : "text-zinc-500"}`}><item.icon size={17} />{item.label}</Link>;
        })}
      </nav>
      <AchievementToast />
    </div>
  );
}
