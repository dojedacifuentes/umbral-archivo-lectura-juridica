import { MissionMap } from "@/components/game/mission-map";

export default function MissionsPage() {
  return (
    <div>
      <header className="mb-8 max-w-4xl">
        <p className="hud-label text-neonCyan">Cartografía del archivo</p>
        <h1 className="mt-2 font-display text-4xl font-black uppercase text-white sm:text-6xl">Mapa de misiones</h1>
        <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">Avanza desde la precisión literal hasta el Texto Opaco. Cada zona entrena una operación lectora distinta y desbloquea herramientas para la siguiente.</p>
      </header>
      <MissionMap />
    </div>
  );
}
