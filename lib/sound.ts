export type SoundName = "click" | "correct" | "incorrect" | "level-up" | "unlock" | "open" | "flip" | "boss";

export function playSound(name: SoundName, enabled: boolean) {
  if (!enabled || typeof window === "undefined") return;
  const audio = new Audio(`/sounds/${name}.wav`);
  audio.volume = name === "incorrect" ? 0.18 : 0.24;
  void audio.play().catch(() => undefined);
}
