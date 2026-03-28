'use client';

import { Canvas, useFrame } from '@react-three/fiber';
import { Environment, Float, ContactShadows, SpotLight } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

function Bottle({ isThinking }: { isThinking?: boolean }) {
  const meshRef = useRef<THREE.Group>(null);
  const liquidRef = useRef<THREE.Mesh>(null);
  
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Parallax interaction using mouse
      const targetX = (state.pointer.x * Math.PI) / 8;
      const targetY = (state.pointer.y * Math.PI) / 8;
      
      const rotSpeed = isThinking ? 1.5 : 0.4;
      meshRef.current.rotation.y += delta * rotSpeed;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, targetY, 0.1);
      meshRef.current.rotation.z = THREE.MathUtils.lerp(meshRef.current.rotation.z, -targetX, 0.1);
    }
    
    if (isThinking && liquidRef.current) {
      liquidRef.current.scale.y = 1 + Math.sin(state.clock.elapsedTime * 4) * 0.05;
      liquidRef.current.position.y = -0.6 + Math.cos(state.clock.elapsedTime * 4) * 0.02;
    }
  });

  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <group ref={meshRef}>
      {/* Bottle Body */}
      <mesh position={[0, -0.2, 0]}>
        <cylinderGeometry args={[1.6, 1.4, 3.8, 64]} />
        <meshPhysicalMaterial
          roughness={0.05}
          transmission={1}
          thickness={2.5}
          ior={1.5}
          color={isDark ? '#5EEAD4' : '#EBE7E0'}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Bottle Neck */}
      <mesh position={[0, 1.9, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.6, 32]} />
        <meshStandardMaterial
          color={isDark ? '#e2e8f0' : '#d4d0d9'}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Bottle Cap */}
      <mesh position={[0, 2.5, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.7, 32]} />
        <meshStandardMaterial
          color={isDark ? '#0f172a' : '#2d2d2d'}
          metalness={0.7}
          roughness={0.2}
        />
      </mesh>

      {/* Liquid inside */}
      <mesh ref={liquidRef} position={[0, -0.6, 0]}>
        <cylinderGeometry args={[1.4, 1.25, 2.8, 64]} />
        <meshPhysicalMaterial
          color={isDark ? '#0d9488' : '#99b8b8'}
          transmission={0.6}
          roughness={0}
          opacity={0.9}
          transparent
        />
      </mesh>
    </group>
  );
}

export default function ThreeDPerfume({ isThinking }: { isThinking?: boolean }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';

  return (
    <div className={`w-full h-full relative z-10 isolate transition-all duration-700 ${isThinking ? 'scale-110 drop-shadow-[0_0_30px_rgba(20,184,166,0.5)]' : 'cursor-pointer'}`}>
      <Canvas camera={{ position: [0, 0, 8], fov: 45 }}>
        <ambientLight intensity={isDark ? 0.2 : 0.6} />
        
        <SpotLight 
          position={[5, 5, 4]} 
          angle={0.3} 
          penumbra={1} 
          intensity={isThinking ? (isDark ? 5 : 4) : (isDark ? 3 : 2)} 
          color={isDark ? "#14b8a6" : (isThinking ? "#99f6e4" : "#ffffff")} 
        />
        
        <Float speed={isThinking ? 4 : 2} rotationIntensity={isThinking ? 0.6 : 0.2} floatIntensity={isThinking ? 1.5 : 1}>
          <Bottle isThinking={isThinking} />
        </Float>
        
        <Environment preset="city" />
        <ContactShadows 
          position={[0, -3.5, 0]} 
          opacity={isDark ? 0.8 : 0.4} 
          scale={12} 
          blur={isThinking ? 4 : 2.5} 
          far={4} 
          color={isDark ? "#14b8a6" : (isThinking ? "#14b8a6" : "#000000")} 
        />
      </Canvas>
    </div>
  );
}
