"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Points } from "three";

function seeded(index: number) {
  const value = Math.sin(index * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

function Dust({ mode }: { mode: string }) {
  const ref = useRef<Points>(null);
  const [active, setActive] = useState(false);
  const positions = useMemo(() => {
    const count = 220;
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i += 1) {
      array[i * 3] = (seeded(i + 1) - 0.5) * 8;
      array[i * 3 + 1] = (seeded(i + 101) - 0.5) * 5;
      array[i * 3 + 2] = (seeded(i + 201) - 0.5) * 2;
    }
    return array;
  }, []);

  useEffect(() => {
    let timeout: number | undefined;
    function onScroll() {
      setActive(true);
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => setActive(false), 600);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    if (!active) return;
    const speed = mode === "ifr" ? 0.08 : mode === "validation" ? 0.11 : 0.045;
    ref.current.rotation.z = Math.sin(clock.elapsedTime * speed) * 0.06;
    ref.current.rotation.x = Math.cos(clock.elapsedTime * speed) * 0.025;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#5f584f" size={0.018} transparent opacity={0.55} sizeAttenuation />
    </points>
  );
}

export function ParticleField({ mode = "ambient", className = "" }: { mode?: string; className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 -z-10 opacity-45 ${className}`} aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 5], fov: 55 }} dpr={[1, 1.5]}>
        <Dust mode={mode} />
      </Canvas>
    </div>
  );
}
