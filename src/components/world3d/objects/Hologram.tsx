import { Sparkles } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type * as THREE from 'three';

interface Props {
  sparkleCount: number;
}

/** Quả cầu hologram: 2 lớp TorusKnot xoay ngược chiều, hạt sáng Violet/Cyan bao quanh. */
export const Hologram = ({ sparkleCount }: Props) => {
  const outer = useRef<THREE.Mesh>(null);
  const inner = useRef<THREE.Mesh>(null);
  const light = useRef<THREE.PointLight>(null);

  useFrame(({ clock }, delta) => {
    if (outer.current) {
      outer.current.rotation.y += delta * 0.35;
      outer.current.rotation.x += delta * 0.12;
    }
    if (inner.current) {
      inner.current.rotation.y -= delta * 0.6;
      inner.current.rotation.z -= delta * 0.2;
    }
    if (light.current) light.current.intensity = 18 + Math.sin(clock.elapsedTime * 2) * 6;
  });

  return (
    <group position={[0, 2.2, 0]}>
      <mesh ref={outer}>
        <torusKnotGeometry args={[1, 0.08, 220, 16, 2, 3]} />
        <meshStandardMaterial color="#a78bfa" emissive="#8b5cf6" emissiveIntensity={2.6} toneMapped={false} wireframe />
      </mesh>
      <mesh ref={inner} scale={0.6}>
        <torusKnotGeometry args={[1, 0.18, 180, 20, 3, 5]} />
        <meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={3} toneMapped={false} />
      </mesh>
      <pointLight ref={light} color="#8b5cf6" distance={12} decay={2} />
      <Sparkles count={sparkleCount} scale={[5, 4, 5]} size={3} speed={0.4} color="#a78bfa" />
      <Sparkles count={Math.round(sparkleCount / 2)} scale={[4, 3, 4]} size={2} speed={0.6} color="#22d3ee" />
      <mesh position={[0, -2.15, 0]}>
        <cylinderGeometry args={[1.4, 1.6, 0.15, 48]} />
        <meshStandardMaterial color="#111827" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, -2.06, 0]} rotation-x={-Math.PI / 2}>
        <ringGeometry args={[1.2, 1.35, 64]} />
        <meshBasicMaterial color={[0.5, 2.5, 3]} toneMapped={false} />
      </mesh>
    </group>
  );
};
