"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import * as THREE from "three";
import { Environment, Sparkles } from "@react-three/drei";

function Particles() {
  const count = 3000;
  const mesh = useRef<THREE.InstancedMesh>(null);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const t = Math.random() * 100;
      const factor = 20 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const xFactor = -50 + Math.random() * 100;
      const yFactor = -50 + Math.random() * 100;
      const zFactor = -50 + Math.random() * 100;
      temp.push({ t, factor, speed, xFactor, yFactor, zFactor, mx: 0, my: 0 });
    }
    return temp;
  }, [count]);

  useFrame((state) => {
    particles.forEach((particle, i) => {
      let { t, factor, speed, xFactor, yFactor, zFactor } = particle;
      t = particle.t += speed / 2;
      const a = Math.cos(t) + Math.sin(t * 1) / 10;
      const b = Math.sin(t) + Math.cos(t * 2) / 10;
      const s = Math.cos(t);
      
      dummy.position.set(
        (particle.mx / 10) * a + xFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 1) * factor) / 10,
        (particle.my / 10) * b + yFactor + Math.sin((t / 10) * factor) + (Math.cos(t * 2) * factor) / 10,
        (particle.my / 10) * b + zFactor + Math.cos((t / 10) * factor) + (Math.sin(t * 3) * factor) / 10
      );
      dummy.scale.set(s, s, s);
      dummy.rotation.set(s * 5, s * 5, s * 5);
      dummy.updateMatrix();
      
      if (mesh.current) {
        mesh.current.setMatrixAt(i, dummy.matrix);
      }
    });
    if (mesh.current) {
      mesh.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[0.08, 0]} />
      <meshBasicMaterial color="#50c878" transparent opacity={0.4} />
    </instancedMesh>
  );
}

function GlowingLeaves() {
  return (
    <Sparkles count={500} scale={12} size={2} speed={0.4} opacity={0.6} color="#8a9a5b" />
  );
}

export default function ForestBackground() {
  return (
    <div className="fixed inset-0 z-[-1] pointer-events-none">
      <Canvas camera={{ fov: 75, position: [0, 0, 15] }}>
        <color attach="background" args={["#081a10"]} />
        <ambientLight intensity={0.2} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} color="#50c878" />
        <pointLight position={[-10, -10, -10]} color="#8a9a5b" intensity={0.5} />
        <Particles />
        <GlowingLeaves />
        <fog attach="fog" args={["#081a10", 5, 25]} />
      </Canvas>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#081a10]/50 to-[#081a10] pointer-events-none" />
    </div>
  );
}
