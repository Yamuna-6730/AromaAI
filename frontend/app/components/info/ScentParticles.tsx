'use client';

import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Points, PointMaterial } from '@react-three/drei';

interface Props {
  scentMode: 'floral' | 'fresh' | 'woody' | 'fruity';
}

const PARTICLE_CONFIG = {
  floral: { color: '#FFD6E0', size: 0.15, count: 150 }, // Pink Petals
  fresh: { color: '#CFF7F0', size: 0.08, count: 300 },  // Aqua Mist
  woody: { color: '#E6D3B3', size: 0.05, count: 400 },  // Dust
  fruity: { color: '#FFE5B4', size: 0.12, count: 200 }, // Glowing Spheres
};

export function ScentParticles({ scentMode }: Props) {
  const pointsRef = useRef<THREE.Points>(null);
  const config = PARTICLE_CONFIG[scentMode];

  const positions = useMemo(() => {
    const pos = new Float32Array(config.count * 3);
    for (let i = 0; i < config.count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return pos;
  }, [config.count]);

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += 0.001;
      pointsRef.current.rotation.x += 0.0005;
      
      // Gentle floating motion
      pointsRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
    }
  });

  return (
    <group>
      <Points ref={pointsRef} positions={positions} stride={3}>
        <PointMaterial
          transparent
          vertexColors={false}
          color={config.color}
          size={config.size}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.4}
          blending={THREE.AdditiveBlending}
        />
      </Points>
    </group>
  );
}
