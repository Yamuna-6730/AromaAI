'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshPhysicalMaterial, CylinderGeometry, SphereGeometry, MeshStandardMaterial, Color } from 'three';
import * as THREE from 'three';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';

interface Props {
  scentMode: 'floral' | 'fresh' | 'woody' | 'fruity';
}

const MODE_COLORS = {
  floral: '#FFC0CB', // Pink
  fresh: '#A8E6CF',  // Mint
  woody: '#C8A97E',  // Amber/Beige
  fruity: '#FFD1A1', // Peach
};

export function PerfumeBottle({ scentMode }: Props) {
  const liquidRef = useRef<THREE.Mesh>(null);
  
  // Custom Material for Liquid
  const liquidColor = useMemo(() => new Color(MODE_COLORS[scentMode]), [scentMode]);

  useFrame((state) => {
    if (liquidRef.current) {
        // Subtle wave effect for liquid
        const mat = liquidRef.current.material as MeshStandardMaterial;
        mat.color.lerp(liquidColor, 0.05);
        liquidRef.current.position.y = -0.1 + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  return (
    <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
      <group scale={[0.5, 0.5, 0.5]}> {/* Reduced scale for more elegant proportions */}
        {/* 🧴 BOTTLE CAP (PREMIUM) */}
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[0.3, 0.3, 0.5, 32]} />
          <meshStandardMaterial 
            color="#FFFFFF" 
            metalness={0.9} 
            roughness={0.1} 
            envMapIntensity={2} 
          />
        </mesh>

        {/* 🧴 NECK */}
        <mesh position={[0, 1, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.3, 32]} />
          <meshStandardMaterial color="#FFFFFF" metalness={0.8} />
        </mesh>

        {/* 🧼 GLASS BOTTLE (SHELL) */}
        <mesh position={[0, -0.1, 0]}>
          <cylinderGeometry args={[0.8, 0.8, 2.2, 64]} />
          <MeshTransmissionMaterial
            backside
            samples={16}
            thickness={0.2}
            chromaticAberration={0.02}
            anisotropy={0.1}
            distortion={0}
            distortionScale={0}
            temporalDistortion={0}
            ior={1.5}
            color="#ffffff"
            transparent
            opacity={0.3}
          />
        </mesh>

        {/* 💧 LIQUID CORE */}
        <mesh ref={liquidRef} position={[0, -0.2, 0]}>
          <cylinderGeometry args={[0.73, 0.73, 1.8, 64]} />
          <meshStandardMaterial 
            color={MODE_COLORS[scentMode]} 
            transparent 
            opacity={0.8} 
            roughness={0} 
            metalness={0.3}
            emissive={MODE_COLORS[scentMode]}
            emissiveIntensity={0.2}
          />
        </mesh>

        {/* 🕯️ BASE REFLECTION */}
        <mesh position={[0, -1.2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[0.9, 32]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.1} />
        </mesh>
      </group>
    </Float>
  );
}
