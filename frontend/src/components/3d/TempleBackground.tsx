"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Sparkles, Float, Stars, Environment, Text } from "@react-three/drei";
import * as THREE from "three";

function MysticalParticles() {
  const particlesRef = useRef<THREE.Points>(null);
  const count = 3000;

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 40;
      pos[i * 3 + 1] = Math.random() * 20 - 5;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 40;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (particlesRef.current) {
      particlesRef.current.rotation.y = state.clock.elapsedTime * 0.05;
      particlesRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        color="#50c878"
        transparent
        opacity={0.6}
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

function FloatingOrb() {
  const orbRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (orbRef.current) {
      const scale = 1 + Math.sin(state.clock.elapsedTime * 2) * 0.1;
      orbRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={orbRef} position={[0, 2, -5]}>
        <sphereGeometry args={[1.5, 64, 64]} />
        <meshStandardMaterial 
          color="#50c878" 
          emissive="#50c878"
          emissiveIntensity={2}
          wireframe
          transparent
          opacity={0.3}
        />
        <pointLight color="#50c878" intensity={5} distance={20} decay={2} />
      </mesh>
    </Float>
  );
}

export default function TempleBackground() {
  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none z-0 bg-[#040a06]">
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }} gl={{ antialias: false, alpha: false }}>
        <fog attach="fog" args={['#040a06', 10, 30]} />
        <ambientLight intensity={0.2} />
        
        {/* Mysterious Temple Silhouette lighting */}
        <spotLight 
          position={[0, 10, 5]} 
          angle={0.5} 
          penumbra={1} 
          intensity={2} 
          color="#8a9a5b" 
        />

        <FloatingOrb />
        <MysticalParticles />
        <Sparkles count={400} scale={25} size={2} speed={0.4} opacity={0.3} color="#e8dfc8" />
        <Stars radius={50} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        
        {/* Subtle ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -5, 0]}>
          <planeGeometry args={[100, 100]} />
          <meshStandardMaterial color="#0a1f11" roughness={0.8} metalness={0.2} />
        </mesh>
      </Canvas>
    </div>
  );
}
