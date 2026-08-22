"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useRef } from "react";
import type { Group, Mesh } from "three";
import { scrollSignal } from "@/lib/scroll-signal";

const COBALT = "#c8ff3d";

/** Frame-rate independent approach — the same easing at 60fps and 120fps. */
const damp = (current: number, target: number, lambda: number, delta: number) =>
  current + (target - current) * (1 - Math.exp(-lambda * delta));

function Form() {
  const group = useRef<Group>(null);
  const shell = useRef<Mesh>(null);
  const core = useRef<Mesh>(null);
  const ring = useRef<Mesh>(null);

  /* Smoothed copy of the scroll signal. Reading it raw would inherit the
     browser's scroll quantisation and make the form step rather than turn. */
  const t = useRef(0);
  const spin = useRef(0);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;

    // 0 while the hero is at rest, 1 once it has fully scrolled away.
    t.current = damp(t.current, scrollSignal.hero, 6, delta);
    const p = t.current;

    // Idle rotation, accelerated by scroll rather than replaced by it.
    spin.current += delta * (0.22 + p * 2.4);
    g.rotation.y = spin.current;

    // Pointer keeps its say — scroll leans the form, the cursor steers it.
    g.rotation.x = damp(g.rotation.x, state.pointer.y * 0.35 + p * 0.6, 4, delta);
    g.rotation.z = damp(g.rotation.z, state.pointer.x * -0.2 - p * 0.45, 4, delta);

    // The morph: the shell opens out as the solid core collapses into it.
    if (shell.current) {
      const s = 1 + p * 0.42;
      shell.current.scale.setScalar(s);
      shell.current.rotation.z = -spin.current * 0.35;
    }
    if (core.current) {
      core.current.scale.setScalar(0.62 - p * 0.34);
      core.current.rotation.x = -spin.current * 0.6;
    }
    // A ring that tips from face-on to edge-on across the pass.
    if (ring.current) {
      ring.current.rotation.x = Math.PI / 2 - p * 1.15;
      ring.current.rotation.y = spin.current * 0.5;
      ring.current.scale.setScalar(1 + p * 0.25);
    }

    state.camera.position.z = damp(state.camera.position.z, 4 - p * 0.75, 4, delta);
  });

  return (
    <group ref={group}>
      <mesh ref={shell}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshBasicMaterial color={COBALT} wireframe />
      </mesh>
      <mesh ref={core} scale={0.62}>
        <icosahedronGeometry args={[1.35, 0]} />
        <meshBasicMaterial color={COBALT} />
      </mesh>
      <mesh ref={ring} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.85, 0.012, 8, 96]} />
        <meshBasicMaterial color={COBALT} />
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
