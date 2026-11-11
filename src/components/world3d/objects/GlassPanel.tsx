import { Float, Html, MeshTransmissionMaterial, RoundedBox } from '@react-three/drei';
import type { Vec3 } from '../config';

interface Props {
  position: Vec3;
  rotationY?: number;
  label: string;
  value: string;
  hiQuality: boolean;
}

/** Bảng HUD kính mờ nổi trong không gian, hiển thị một chỉ số thật từ ứng dụng. */
export const GlassPanel = ({ position, rotationY = 0, label, value, hiQuality }: Props) => (
  <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.4}>
    <group position={position} rotation-y={rotationY}>
      <RoundedBox args={[2.2, 1.3, 0.08]} radius={0.06} smoothness={4}>
        {hiQuality ? (
          <MeshTransmissionMaterial
            samples={4}
            resolution={256}
            thickness={0.4}
            roughness={0.25}
            transmission={1}
            ior={1.3}
            chromaticAberration={0.04}
            backside={false}
            color="#c7d2fe"
          />
        ) : (
          <meshPhysicalMaterial color="#1e293b" transparent opacity={0.55} roughness={0.2} metalness={0.1} />
        )}
      </RoundedBox>
      <mesh position={[0, -0.68, 0]}>
        <boxGeometry args={[2.2, 0.03, 0.09]} />
        <meshBasicMaterial color={[0.4, 2.2, 3]} toneMapped={false} />
      </mesh>
      <Html transform position={[0, 0, 0.06]} distanceFactor={4} pointerEvents="none">
        <div className="w-44 select-none text-center">
          <p className="text-[10px] uppercase tracking-widest text-cyan-200/80">{label}</p>
          <p className="text-2xl font-bold text-white drop-shadow-[0_0_8px_rgba(34,211,238,0.8)]">{value}</p>
        </div>
      </Html>
    </group>
  </Float>
);
