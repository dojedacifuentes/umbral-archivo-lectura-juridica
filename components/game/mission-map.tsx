import { MissionCard } from "@/components/game/mission-card";
import { contentRepository } from "@/lib/repository";
import type { WorldId } from "@/lib/types";

const worldData: Record<WorldId, { title: string; copy: string; code: string }> = {
  literal: { title: "Distrito Literal", copy: "Hechos, sujetos, fechas y condiciones expresas.", code: "Z-01" },
  inferential: { title: "Callejón Inferencial", copy: "Conecta indicios sin convertir sospechas en certezas.", code: "Z-02" },
  argumental: { title: "Tribunal Argumental", copy: "Tesis, premisas, estructura y síntesis.", code: "Z-03" },
  philosophical: { title: "Archivo Filosófico", copy: "Conceptos, límites y desacuerdo razonable.", code: "Z-04" },
  jurist: { title: "Cámara del Jurista", copy: "Expedientes, normas y contexto aplicado.", code: "Z-05" },
  boss: { title: "Cámara del Texto Opaco", copy: "Todas las habilidades bajo presión.", code: "Z-Ω" },
};

export function MissionMap() {
  const missions = contentRepository.getMissions();
  return (
    <div className="space-y-8">
      {(Object.keys(worldData) as WorldId[]).map((world) => {
        const data = worldData[world];
        const worldMissions = missions.filter((mission) => mission.world === world);
        return (
          <section key={world}>
            <div className="mb-4 flex items-end justify-between gap-4 border-b border-white/10 pb-3">
              <div>
                <p className="font-mono text-[10px] font-black tracking-[0.24em] text-neonPink">{data.code}</p>
                <h2 className="font-display text-3xl font-black uppercase text-white">{data.title}</h2>
                <p className="mt-1 text-sm text-zinc-500">{data.copy}</p>
              </div>
              <span className="hidden font-mono text-xs text-zinc-700 sm:block">{String(worldMissions.length).padStart(2, "0")} ARCHIVOS</span>
            </div>
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {worldMissions.map((mission) => <MissionCard key={mission.id} mission={mission} />)}
            </div>
          </section>
        );
      })}
    </div>
  );
}
