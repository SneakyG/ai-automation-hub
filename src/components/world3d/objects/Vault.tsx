import { Float } from '@react-three/drei';
import type { Vec3 } from '../config';

/** Két sắt vàng/bạc vẽ từ khối cơ bản. */
export const Vault = () => (
  <group>
    <mesh castShadow receiveShadow position={[0, 1, 0]}>
      <boxGeometry args={[1.8, 2, 1.4]} />
      <meshStandardMaterial color="#cbd5e1" metalness={1} roughness={0.22} />
    </mesh>
    <mesh position={[0, 1, 0.71]} rotation-x={Math.PI / 2}>
      <cylinderGeometry args={[0.6, 0.6, 0.08, 48]} />
      <meshStandardMaterial color="#d4af37" metalness={1} roughness={0.18} />
    </mesh>
    <mesh position={[0, 1, 0.78]}>
      <torusGeometry args={[0.32, 0.04, 16, 48]} />
      <meshStandardMaterial color="#fde68a" metalness={1} roughness={0.15} emissive="#f59e0b" emissiveIntensity={0.6} />
    </mesh>
    {[0, 1, 2].map((i) => (
      <mesh key={i} position={[0, 1, 0.78]} rotation-z={(i * Math.PI) / 3}>
        <boxGeometry args={[0.6, 0.05, 0.05]} />
        <meshStandardMaterial color="#fde68a" metalness={1} roughness={0.15} />
      </mesh>
    ))}
    <mesh position={[0, 0.04, 0]}>
      <boxGeometry args={[2, 0.08, 1.6]} />
      <meshStandardMaterial color="#0f172a" metalness={0.8} roughness={0.4} />
    </mesh>
  </group>
);

interface GiftProps {
  position: Vec3;
  color: string;
  glow: [number, number, number];
  size?: number;
}

/** Hộp quà phát sáng: tượng trưng cho một gói dịch vụ. */
export const GiftBox = ({ position, color, glow, size = 0.7 }: GiftProps) => (
  <Float speed={2} rotationIntensity={0.6} floatIntensity={0.6}>
    <group position={position}>
      <mesh castShadow>
        <boxGeometry args={[size, size, size]} />
        <meshStandardMaterial color={color} metalness={0.3} roughness={0.35} emissive={color} emissiveIntensity={0.5} />
      </mesh>
      <mesh>
        <boxGeometry args={[size * 1.02, size * 1.02, size * 0.18]} />
        <meshBasicMaterial color={glow} toneMapped={false} />
      </mesh>
      <mesh>
        <boxGeometry args={[size * 0.18, size * 1.02, size * 1.02]} />
        <meshBasicMaterial color={glow} toneMapped={false} />
      </mesh>
    </group>
  </Float>
);
