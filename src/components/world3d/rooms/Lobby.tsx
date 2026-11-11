import { useProgress } from '../../../hooks/useProgress';
import { formatUsd } from '../../../utils/date';
import { GlassPanel } from '../objects/GlassPanel';
import { Hologram } from '../objects/Hologram';

interface Props {
  hiQuality: boolean;
}

const HEX_GLOW: [number, number, number] = [0.3, 2.4, 3];

/** Lobby lục giác: bệ hologram Data Orb, các bảng kính hiển thị chỉ số thật, vòng LED lục giác dưới sàn. */
export const Lobby = ({ hiQuality }: Props) => {
  const p = useProgress();

  return (
    <group>
      {/* Bệ lục giác */}
      <mesh position={[0, 0.1, 0]} rotation-y={Math.PI / 6} castShadow receiveShadow>
        <cylinderGeometry args={[2.3, 2.5, 0.2, 6]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.25} />
      </mesh>
      <mesh position={[0, 0.21, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 6]}>
        <ringGeometry args={[1.9, 2.05, 6]} />
        <meshBasicMaterial color={HEX_GLOW} toneMapped={false} />
      </mesh>
      <group position={[0, 0.2, 0]}>
        <Hologram sparkleCount={hiQuality ? 80 : 30} />
      </group>

      {/* Vòng LED lục giác trên sàn */}
      {[4.2, 6.6].map((r) => (
        <mesh key={r} position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 6]}>
          <ringGeometry args={[r, r + 0.08, 6]} />
          <meshBasicMaterial color={HEX_GLOW} toneMapped={false} transparent opacity={0.7} />
        </mesh>
      ))}

      {/* Hero Stats */}
      <GlassPanel position={[-4.6, 2.3, -4.6]} rotationY={Math.PI / 4} label="Tiến độ 90 ngày" value={`${p.progressPct}%`} hiQuality={hiQuality} />
      <GlassPanel position={[4.6, 2.3, -4.6]} rotationY={-Math.PI / 4} label="Thu nhập YTD" value={formatUsd(p.incomeYtd)} hiQuality={hiQuality} />
      <GlassPanel position={[-4.6, 2.3, 4.6]} rotationY={(3 * Math.PI) / 4} label="Giờ tuần này" value={`${p.hoursThisWeek}h`} hiQuality={hiQuality} />
      <GlassPanel position={[4.6, 2.3, 4.6]} rotationY={(-3 * Math.PI) / 4} label="XP" value={`${p.xp}/${p.xpTotal}`} hiQuality={hiQuality} />
    </group>
  );
};
