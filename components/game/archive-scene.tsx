"use client";

import { useEffect, useState } from "react";
import { Canvas } from "@react-three/fiber";

const towers = [
  [-4.2, -1.3, -1.5, 1.1, 3.1], [-2.8, -1.5, -2.4, 0.8, 2.7], [-1.5, -1.2, -3.2, 1.2, 3.5],
  [1.3, -1.4, -3, 1.1, 3], [2.7, -1.1, -2.1, 0.9, 3.8], [4, -1.4, -1.2, 1.2, 2.6],
] as const;

function Core() {
  return (
    <group rotation={[0.1, 0.2, 0]}>
      <mesh position={[0, 0.2, 0]} rotation={[0.5, 0.4, 0]}>
        <octahedronGeometry args={[1.15, 0]} />
        <meshStandardMaterial color="#ff3fbd" emissive="#7d124f" emissiveIntensity={1.4} wireframe />
      </mesh>
      <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 4]}>
        <torusGeometry args={[1.65, 0.035, 8, 64]} />
        <meshBasicMaterial color="#2cf7ff" />
      </mesh>
    </group>
  );
}

function City() {
  return (
    <group position={[0, -1.8, 0]}>
      {towers.map(([x, y, z, width, height], index) => (
        <mesh key={index} position={[x, y + height / 2, z]}>
          <boxGeometry args={[width, height, width]} />
          <meshStandardMaterial color="#11152b" emissive={index % 2 ? "#0b5f68" : "#4a123d"} emissiveIntensity={0.35} roughness={0.8} />
        </mesh>
      ))}
      <gridHelper args={[20, 30, "#2cf7ff", "#231a4b"]} position={[0, 0, 0]} />
    </group>
  );
}

export function ArchiveScene() {
  const [desktop, setDesktop] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 1024px)");
    const sync = () => setDesktop(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  if (!desktop) return null;

  return (
    <div className="h-full min-h-[320px] w-full" aria-label="Núcleo tridimensional del archivo">
      <Canvas camera={{ position: [0, 1.2, 7.5], fov: 48 }} dpr={1} frameloop="demand" gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[3, 4, 5]} color="#2cf7ff" intensity={18} distance={12} />
        <pointLight position={[-4, 2, 2]} color="#ff3fbd" intensity={14} distance={10} />
        <fog attach="fog" args={["#070711", 7, 16]} />
        <Core />
        <City />
      </Canvas>
    </div>
  );
}
