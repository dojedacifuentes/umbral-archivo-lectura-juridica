import { GameCard } from "@/components/ui/game-card";
import { PixelButton } from "@/components/ui/pixel-button";

export default function NotFound() {
  return <div className="mx-auto max-w-2xl"><GameCard kicker="Error 404" title="Archivo fuera de índice"><p className="text-sm leading-7 text-zinc-400">La ruta solicitada no existe o fue retirada del registro.</p><PixelButton href="/" className="mt-5">Regresar al Umbral</PixelButton></GameCard></div>;
}
