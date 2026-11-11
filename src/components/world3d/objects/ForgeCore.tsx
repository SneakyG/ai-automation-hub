import { Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type * as THREE from 'three';

interface Props {
  sparkleCount: number;
}

const RINGS = [
  { radius: 1.5, tilt: 0.3, speed: 0.9, color: [3, 1.2, 0.3] as [number, number, number] },
  { radius: 1.9, tilt: -0.9, speed: -0.6, color: [2.5, 0.6, 3] as [number, number, number] },
  { radius: 2.3, tilt: 1.4, speed: 0.4, color: [0.4, 2.4, 3] as [number, number, number] },
];

/** Lò rèn năng lượng: lõi Icosahedron đập theo nhịp thở, 3 vòng Torus xoay quanh. */
export const ForgeCore = ({ sparkleCount }: Props) => {
  const core = useRef<THREE.Mesh>(null);
  const coreMat = useRef<THREE.MeshStandardMaterial>(null);
  const rings = useRef<(THREE.Mesh | null)[]>([]);
  const light = useRef<THREE.PointLight>(null);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const pulse = 0.5 + 0.5 * Math.sin(t * 2.4);
    if (core.current) {
      core.current.scale.setScalar(0.85 + pulse * 0.2);
      core.current.rotation.y += delta * 0.5;
      core.current.rotation.x += delta * 0.3;
    }
    if (coreMat.current) coreMat.current.emissiveIntensity = 2 + pulse * 3;
    if (light.current) light.current.intensity = 10 + pulse * 20;
    rings.current.forEach((ring, i) => {
      const cfg = RINGS.at(i);
      if (ring && cfg) ring.rotation.z += delta * cfg.speed;
    });
  });

  return (
    <group position={[0, 2.2, 0]}>
      <mesh ref={core}>
        <icosahedronGeometry args={[0.8, 1]} />
        <meshStandardMaterial ref={coreMat} color="#fb923c" emissive="#f97316" emissiveIntensity={3} flatShading toneMapped={false} />
      </mesh>
      {RINGS.map((r, i) => (
        <group key={r.radius} rotation-x={r.tilt}>
          <mesh
            ref={(el) => {
              rings.current[i] = el;
            }}
          >
            <torusGeometry args={[r.radius, 0.04, 16, 128]} />
            <meshBasicMaterial color={r.color} toneMapped={false} />
          </mesh>
        </group>
      ))}
      <pointLight ref={light} color="#f97316" distance={14} decay={2} />
      <Sparkles count={sparkleCount} scale={[5, 4, 5]} size={4} speed={0.8} color="#fdba74" />
      <mesh position={[0, -2.1, 0]}>
        <cylinderGeometry args={[1.8, 2.2, 0.3, 6]} />
        <meshStandardMaterial color="#1c1917" metalness={0.9} roughness={0.35} />
      </mesh>
    </group>
  );
};
