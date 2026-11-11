import { Sparkles, Text } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import type { Vec3 } from '../config';
import { Laptop } from '../objects/Laptop';
import { ScreenPanel, type ScreenLine } from '../objects/ScreenPanel';
import { ServerRacks } from '../objects/ServerRack';
import { Telescope } from '../objects/Telescope';
import { GiftBox } from '../objects/Vault';

interface Props {
  hiQuality: boolean;
}

const Desk = ({ position, size, color = '#1f2937' }: { position: Vec3; size: [number, number]; color?: string }) => (
  <group position={position}>
    <mesh position={[0, 0.78, 0]} castShadow receiveShadow>
      <boxGeometry args={[size[0], 0.08, size[1]]} />
      <meshStandardMaterial color={color} metalness={0.8} roughness={0.3} />
    </mesh>
    {[
      [-1, -1],
      [1, -1],
      [-1, 1],
      [1, 1],
    ].map(([sx, sz]) => (
      <mesh key={`${sx}${sz}`} position={[(sx * (size[0] - 0.2)) / 2, 0.38, (sz * (size[1] - 0.2)) / 2]} castShadow>
        <boxGeometry args={[0.08, 0.76, 0.08]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} />
      </mesh>
    ))}
  </group>
);

/* ───────────── Workshop (0, -24) ───────────── */

const CLAUDE_LINES: ScreenLine[] = [
  { text: '$ claude', color: '#86efac' },
  { text: '> Dựng workflow "AI Lead Inbox" cho spa', color: '#e2e8f0' },
  { text: '● Đọc yêu cầu… lập kế hoạch 4 bước', color: '#a7f3d0' },
  { text: '  1. Webhook nhận form  2. LLM trích xuất JSON', color: '#94a3b8' },
  { text: '  3. Ghi Google Sheets  4. Báo Telegram', color: '#94a3b8' },
  { text: '✓ workflow.json đã tạo · 3/3 test pass', color: '#4ade80' },
];

const DOCKER_COLORS = ['#2496ed', '#1d63ed', '#38bdf8'];

const Workshop = () => (
  <group>
    <Desk position={[0, 0, -31]} size={[3.6, 1.8]} />
    <group position={[0, 0.82, -30.75]} scale={0.9}>
      <Laptop />
    </group>
    <group position={[0, 2.35, -31.82]}>
      <ScreenPanel width={5.2} height={2.2} title="CLAUDE CODE · terminal" accent="#22c55e" lines={CLAUDE_LINES} />
    </group>

    {/* Kệ hộp Docker */}
    <group position={[6.6, 0, -30.65]}>
      {[0.05, 0.8, 1.55, 2.3].map((y) => (
        <mesh key={y} position={[0, y, 0]} castShadow receiveShadow>
          <boxGeometry args={[2.4, 0.06, 2.5]} />
          <meshStandardMaterial color="#334155" metalness={0.85} roughness={0.35} />
        </mesh>
      ))}
      {[-1.15, 1.15].map((x) => (
        <mesh key={x} position={[x, 1.2, 0]}>
          <boxGeometry args={[0.08, 2.4, 2.5]} />
          <meshStandardMaterial color="#1e293b" metalness={0.85} roughness={0.35} />
        </mesh>
      ))}
      {[0, 1, 2].flatMap((shelf) =>
        [-0.7, 0, 0.7].map((x, i) => (
          <mesh key={`${shelf}-${x}`} position={[x, 0.08 + shelf * 0.75 + 0.27, (i - 1) * 0.5]} castShadow>
            <boxGeometry args={[0.55, 0.5, 0.7]} />
            <meshStandardMaterial
              color={DOCKER_COLORS[(shelf + i) % 3]}
              metalness={0.3}
              roughness={0.4}
              emissive={DOCKER_COLORS[(shelf + i) % 3]}
              emissiveIntensity={0.35}
            />
          </mesh>
        )),
      )}
      <Text position={[0, 2.65, 1.26]} fontSize={0.22} anchorX="center">
        docker compose
        <meshBasicMaterial color={[0.4, 1.6, 3]} toneMapped={false} />
      </Text>
    </group>
  </group>
);

/* ───────────── Automation Lab (24, 0) ───────────── */

const RACKS: Vec3[] = [17.5, 18.45, 19.4, 20.35, 28.5, 29.45, 30.4, 31.35].flatMap((x) => [
  [x, 0, -7.35] as Vec3,
  [x, 0, 6.55] as Vec3,
]);

const RAG_LINES: ScreenLine[] = [
  { text: 'Chatbot RAG · Supabase pgvector', color: '#c7d2fe' },
  { text: 'Độ chính xác trả lời: 94% · Latency 1.2s', color: '#a5b4fc', size: 0.045 },
];
const RAG_NODES = ['Webhook', 'Embed', 'Vector DB', 'Claude', 'Trả lời'];

const Cable = ({ from, to, color }: { from: Vec3; to: Vec3; color: [number, number, number] }) => {
  const geometry = useMemo(() => {
    const a = new THREE.Vector3(...from);
    const b = new THREE.Vector3(...to);
    const mid = a.clone().lerp(b, 0.5);
    mid.y = 3.85;
    return new THREE.TubeGeometry(new THREE.CatmullRomCurve3([a, mid, b]), 32, 0.035, 6, false);
  }, [from, to]);
  return (
    <mesh geometry={geometry}>
      <meshBasicMaterial color={color} toneMapped={false} />
    </mesh>
  );
};

const CABLES: { from: Vec3; to: Vec3; color: [number, number, number] }[] = [
  { from: [18.5, 3.2, -7.35], to: [31.6, 3.6, -2], color: [0.6, 0.8, 3] },
  { from: [20, 3.2, 6.55], to: [31.6, 3.6, 2], color: [2.2, 0.6, 3] },
  { from: [29.5, 3.2, -7.35], to: [31.6, 3.7, -1], color: [0.4, 2.4, 3] },
  { from: [29.5, 3.2, 6.55], to: [31.6, 3.7, 1], color: [2.6, 0.5, 3] },
];

const Lab = () => (
  <group>
    <group scale={[1, 1.6, 1]}>
      <ServerRacks racks={RACKS} />
    </group>
    {CABLES.map((c, i) => (
      <Cable key={i} {...c} />
    ))}
    <group position={[31.8, 2.1, 0]} rotation-y={-Math.PI / 2}>
      <ScreenPanel width={7} height={3} title="AUTOMATION LAB · RAG pipeline" accent="#818cf8" lines={RAG_LINES} nodes={RAG_NODES} />
    </group>
    <pointLight position={[29, 2, 0]} color="#a855f7" intensity={10} distance={10} decay={1.6} />
    <pointLight position={[19, 2, 0]} color="#3b82f6" intensity={8} distance={10} decay={1.6} />
  </group>
);

/* ───────────── Commercial Vault (0, 24) ───────────── */

const GOLD: [number, number, number] = [3, 2, 0.4];

const VaultRoom = ({ hiQuality }: Props) => (
  <group>
    {/* Két sắt mở hé, quay mặt về phía cửa vào (−z) */}
    <group position={[4.8, 0, 29.8]} rotation-y={Math.PI}>
      <mesh position={[0, 1.1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 2.2, 1.6]} />
        <meshStandardMaterial color="#18181b" metalness={0.95} roughness={0.25} />
      </mesh>
      <mesh position={[0, 1.1, 0.79]}>
        <planeGeometry args={[1.7, 1.7]} />
        <meshBasicMaterial color={GOLD} toneMapped={false} />
      </mesh>
      <group position={[0.9, 1.1, 0.82]} rotation-y={0.75}>
        <mesh position={[-0.9, 0, 0]} castShadow>
          <boxGeometry args={[1.8, 1.8, 0.14]} />
          <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.2} />
        </mesh>
        <mesh position={[-0.9, 0, 0.1]}>
          <torusGeometry args={[0.38, 0.05, 16, 48]} />
          <meshStandardMaterial color="#fde68a" metalness={1} roughness={0.15} emissive="#f59e0b" emissiveIntensity={0.8} />
        </mesh>
      </group>
      <pointLight position={[0, 1.1, 1.3]} color="#fbbf24" intensity={14} distance={6} decay={1.6} />
      <Sparkles count={hiQuality ? 40 : 15} scale={[1.6, 1.6, 1.4]} position={[0, 1.1, 1.2]} size={3} color="#fde68a" speed={0.4} />
    </group>

    {/* 3 gói dịch vụ = 3 hộp quà trên bệ */}
    {[20, 24, 28].map((z, i) => (
      <group key={z}>
        <mesh position={[-6.75, 0.5, z]} castShadow receiveShadow>
          <boxGeometry args={[1.6, 1, 1.6]} />
          <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[-6.75, 1.01, z]} rotation-x={-Math.PI / 2}>
          <ringGeometry args={[0.6, 0.68, 32]} />
          <meshBasicMaterial color={GOLD} toneMapped={false} />
        </mesh>
        <GiftBox position={[-6.75, 1.6, z]} color={['#f59e0b', '#eab308', '#fbbf24'][i]} glow={GOLD} size={0.6} />
      </group>
    ))}

    {/* Bảng $300+ ở tường đông */}
    <group position={[7.8, 2.2, 21]} rotation-y={-Math.PI / 2}>
      <mesh position={[0, 0, -0.03]}>
        <boxGeometry args={[4.4, 2.4, 0.06]} />
        <meshStandardMaterial color="#0a0a0a" metalness={0.9} roughness={0.3} />
      </mesh>
      <Text position={[0, 0.25, 0.02]} fontSize={0.9} anchorX="center" anchorY="middle">
        $300+
        <meshBasicMaterial color={GOLD} toneMapped={false} />
      </Text>
      <Text position={[0, -0.7, 0.02]} fontSize={0.18} color="#fde68a" anchorX="center" anchorY="middle">
        Cổng 3 · Thu nhập định kỳ mỗi tháng + 1 retainer
      </Text>
    </group>
  </group>
);

/* ───────────── The Summit (0, 48) ───────────── */

const NEON_PINK: [number, number, number] = [3, 0.6, 3];

const Summit = () => (
  <group>
    {/* Bàn CEO + ghế */}
    <Desk position={[0, 0, 47]} size={[4, 1.6]} color="#111827" />
    <mesh position={[0, 0.83, 46.5]}>
      <boxGeometry args={[3.6, 0.02, 0.05]} />
      <meshBasicMaterial color={NEON_PINK} toneMapped={false} />
    </mesh>
    <group position={[0, 0, 48.6]}>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[0.7, 0.1, 0.7]} />
        <meshStandardMaterial color="#27272a" roughness={0.5} />
      </mesh>
      <mesh position={[0, 1.05, 0.32]} castShadow>
        <boxGeometry args={[0.7, 1, 0.1]} />
        <meshStandardMaterial color="#27272a" roughness={0.5} />
      </mesh>
      <mesh position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.05, 0.05, 0.5, 8]} />
        <meshStandardMaterial color="#71717a" metalness={0.9} roughness={0.3} />
      </mesh>
    </group>

    {/* Kính thiên văn nhìn ra vũ trụ */}
    <group position={[4.5, 0, 54]} rotation-y={Math.PI / 2}>
      <Telescope />
    </group>

    {/* Neon mục tiêu, đọc được khi bước vào phòng */}
    <Text position={[0, 3.2, 55.5]} rotation-y={Math.PI} fontSize={0.62} anchorX="center" anchorY="middle">
      $1,000+/tháng
      <meshBasicMaterial color={NEON_PINK} toneMapped={false} />
    </Text>

    {/* Hành tinh phía sau tường kính */}
    <mesh position={[-28, 14, 120]}>
      <sphereGeometry args={[12, 48, 48]} />
      <meshStandardMaterial color="#4c1d95" emissive="#7c3aed" emissiveIntensity={0.6} roughness={0.8} />
    </mesh>
    <mesh position={[-28, 14, 120]} rotation={[1.2, 0.2, 0]}>
      <ringGeometry args={[15, 19, 64]} />
      <meshBasicMaterial color={[1.4, 0.8, 2.2]} toneMapped={false} side={THREE.DoubleSide} transparent opacity={0.5} />
    </mesh>
  </group>
);

/** Các phòng giai đoạn: Workshop, Automation Lab, Commercial Vault, The Summit (đặt theo tọa độ thế giới). */
export const Tower = ({ hiQuality }: Props) => (
  <group>
    <Workshop />
    <Lab />
    <VaultRoom hiQuality={hiQuality} />
    <Summit />
  </group>
);
