"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group } from "three";

function Form() {
  const group = useRef<Group>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const scroll = useRef(0);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    pointer.current.x = state.pointer.x;
    pointer.current.y = state.pointer.y;
    scroll.current = typeof window !== "undefined" ? window.scrollY : 0;
    const boost = 1 + Math.min(scroll.current / 1200, 2.5);
    g.rotation.y += delta * 0.25 * boost;
    g.rotation.x += (pointer.current.y * 0.35 - g.rotation.x) * 0.05;
    g.rotation.z += (pointer.current.x * -0.2 - g.rotation.z) * 0.05;
  });

  return (
    <group ref={group}>
      <mesh>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshBasicMaterial color="#c8ff3d" wireframe />
      </mesh>
      <mesh scale={0.62}>
        <icosahedronGeometry args={[1.35, 0]} />
        <meshBasicMaterial color="#c8ff3d" />
      </mesh>
    </group>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 4], fov: 45 }}
      dpr={[1, 1.75]}
      gl={{ antialias: true, alpha: true }}
      style={{ background: "transparent" }}
    >
      <Form />
    </Canvas>
  );
}
