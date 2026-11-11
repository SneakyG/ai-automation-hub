import { Instance, Instances, type PositionMesh } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useMemo, useRef } from 'react';
import type { Vec3 } from '../config';

const Led = ({ position, phase, speed }: { position: Vec3; phase: number; speed: number }) => {
  const ref = useRef<PositionMesh>(null);
  useFrame(({ clock }) => {
    if (!ref.current) return;
    const on = Math.sin(clock.elapsedTime * speed + phase) > 0.2;
    if (on) ref.current.color.setRGB(0.3, 3.2, 1.2);
    else ref.current.color.setRGB(0.05, 0.25, 0.12);
  });
  return <Instance ref={ref} position={position} />;
};

interface Props {
  racks: Vec3[];
}

/** Dãy tủ server; toàn bộ đèn LED dùng chung một InstancedMesh. */
export const ServerRacks = ({ racks }: Props) => {
  const leds = useMemo(
    () =>
      racks.flatMap((rack, r) =>
        Array.from({ length: 12 }, (_, i) => ({
          key: `${r}-${i}`,
          position: [rack[0] - 0.25 + (i % 3) * 0.25, rack[1] + 0.35 + Math.floor(i / 3) * 0.45, rack[2] + 0.41] as Vec3,
          phase: (r * 12 + i) * 1.7,
          speed: 2 + ((r + i) % 5),
        })),
      ),
    [racks],
  );

  return (
    <group>
      {racks.map((p) => (
        <mesh key={p.join(',')} position={[p[0], p[1] + 1, p[2]]} castShadow receiveShadow>
          <boxGeometry args={[0.9, 2, 0.8]} />
          <meshStandardMaterial color="#111827" metalness={0.8} roughness={0.35} />
        </mesh>
      ))}
      <Instances limit={leds.length}>
        <boxGeometry args={[0.1, 0.06, 0.02]} />
        <meshBasicMaterial toneMapped={false} />
        {leds.map((l) => (
          <Led key={l.key} position={l.position} phase={l.phase} speed={l.speed} />
        ))}
      </Instances>
    </group>
  );
};
