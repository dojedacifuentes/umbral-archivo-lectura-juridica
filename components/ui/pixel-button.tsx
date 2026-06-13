"use client";

import Link from "next/link";
import { motion, type HTMLMotionProps } from "framer-motion";
import { playSound } from "@/lib/sound";
import { useProgress } from "@/components/providers/progress-provider";

const variants = {
  primary: "border-neonPink/70 bg-neonPink/15 text-white shadow-pink hover:bg-neonPink/25",
  cyan: "border-neonCyan/70 bg-neonCyan/10 text-white shadow-neon hover:bg-neonCyan/20",
  gold: "border-oldGold/70 bg-oldGold/10 text-amber-50 shadow-gold hover:bg-oldGold/20",
  danger: "border-blood/80 bg-blood/15 text-red-50 hover:bg-blood/25",
  ghost: "border-white/15 bg-white/5 text-zinc-200 hover:bg-white/10",
};

interface PixelButtonProps extends Omit<HTMLMotionProps<"button">, "children"> {
  href?: string;
  variant?: keyof typeof variants;
  onActivate?: () => void;
  children: React.ReactNode;
}

export function PixelButton({ href, variant = "primary", className = "", children, onClick, onActivate, ...props }: PixelButtonProps) {
  const { progress } = useProgress();
  const styles = `pixel-corners inline-flex items-center justify-center gap-2 border px-4 py-3 text-sm font-black uppercase tracking-[0.09em] transition focus:outline-none focus:ring-2 focus:ring-neonCyan disabled:cursor-not-allowed disabled:opacity-45 ${variants[variant]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={styles} onClick={() => { playSound("click", progress.soundEnabled); onActivate?.(); }}>
        {children}
      </Link>
    );
  }

  return (
    <motion.button
      whileHover={props.disabled ? undefined : { y: -2 }}
      whileTap={props.disabled ? undefined : { y: 1, scale: 0.99 }}
      className={styles}
      onClick={(event) => {
        playSound("click", progress.soundEnabled);
        onClick?.(event);
      }}
      {...props}
    >
      {children}
    </motion.button>
  );
}
