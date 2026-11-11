import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import type * as THREE from 'three';
import { ForgeCore } from '../objects/ForgeCore';
import { ScreenPanel, type ScreenLine } from '../objects/ScreenPanel';

interface Props {
  hiQuality: boolean;
}

const CX = -24;

const VAR_LINES: ScreenLine[] = [
  { text: '{{NICHE}}          spa · nha khoa · bất động sản', color: '#fdba74' },
  { text: '{{VẤN_ĐỀ}}         lead trả lời chậm, nhập liệu tay', color: '#fdba74' },
  { text: '{{QUỸ_THỜI_GIAN}}  10–15 giờ / tuần', color: '#fde68a' },
  { text: '{{THU_NHẬP}}       $300 → $1.000+ / tháng', color: '#fde68a' },
  { text: '{{STACK}}          n8n · Claude · Supabase', color: '#fdba74' },
  { text: '' },
  { text: '→ Bấm E ở bệ điều khiển để mở Prompt Studio', color: '#94a3b8', size: 0.045 },
];

const TUBE_COLORS: [number, number, number][] = [
  [3, 1.1, 0.2],
  [0.4, 2.6, 3],
  [2.6, 0.5, 3],
  [0.4, 3, 1],
  [3, 2.2, 0.3],
  [3, 0.4, 1.2],
];

const Tube = ({ x, color, phase }: { x: number; color: [number, number, number]; phase: number }) => {
  const liquid = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (liquid.current) liquid.current.scale.y = 0.75 + Math.sin(clock.elapsedTime * 1.5 + phase) * 0.15;
  });
  return (
    <group position={[x, 1.05, -7.4]}>
      <mesh>
        <cylinderGeometry args={[0.16, 0.16, 1.1, 20, 1, true]} />
        <meshPhysicalMaterial color="#e2e8f0" transparent opacity={0.18} roughness={0.05} />
      </mesh>
      <mesh ref={liquid} position={[0, -0.1, 0]}>
        <cylinderGeometry args={[0.13, 0.13, 0.8, 16]} />
        <meshBasicMaterial color={color} toneMapped={false} />
      </mesh>
    </group>
  );
};

/** Alchemist Forge: lõi năng lượng, kệ ống nghiệm phát sáng, bảng biến số prompt. */
export const Forge = ({ hiQuality }: Props) => (
  <group>
    {/* Đế lò */}
    <mesh position={[CX, 0.2, 0]} castShadow receiveShadow>
      <cylinderGeometry args={[2.2, 2.4, 0.4, 32]} />
      <meshStandardMaterial color="#1c1917" metalness={0.9} roughness={0.35} />
    </mesh>
    <mesh position={[CX, 0.41, 0]} rotation-x={-Math.PI / 2}>
      <ringGeometry args={[1.8, 2, 48]} />
      <meshBasicMaterial color={[3, 1, 0.2]} toneMapped={false} />
    </mesh>
    <group position={[CX, 0, 0]} scale={0.72}>
      <ForgeCore sparkleCount={hiQuality ? 60 : 20} />
    </group>

    {/* Bệ điều khiển (terminal) */}
    <group position={[CX, 0, 3.2]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.9, 1, 0.5]} />
        <meshStandardMaterial color="#292524" metalness={0.85} roughness={0.35} />
      </mesh>
      <mesh position={[0, 1.02, 0.05]} rotation-x={-0.6}>
        <planeGeometry args={[0.8, 0.4]} />
        <meshBasicMaterial color={[3, 1.2, 0.3]} toneMapped={false} />
      </mesh>
    </group>

    {/* Kệ ống nghiệm dọc tường bắc */}
    <mesh position={[CX, 0.45, -7.4]} castShadow>
      <boxGeometry args={[13, 0.9, 0.9]} />
      <meshStandardMaterial color="#1c1917" metalness={0.8} roughness={0.4} />
    </mesh>
    {Array.from({ length: 12 }, (_, i) => (
      <Tube key={i} x={CX - 6 + i * 1.1} color={TUBE_COLORS[i % TUBE_COLORS.length]} phase={i * 0.9} />
    ))}

    {/* Bảng biến số prompt ở tường tây */}
    <group position={[-31.8, 2.1, 0]} rotation-y={Math.PI / 2}>
      <ScreenPanel width={6.4} height={2.8} title="PROMPT VARIABLES" accent="#f97316" lines={VAR_LINES} />
    </group>
    <Text position={[CX, 3.55, -7.75]} fontSize={0.4} anchorX="center">
      ALCHEMIST FORGE
      <meshBasicMaterial color={[3, 1.2, 0.3]} toneMapped={false} />
    </Text>
  </group>
);
