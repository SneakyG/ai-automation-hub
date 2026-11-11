import { CORRIDORS, DOORS, MAP_BOUNDS, ROOMS, type RoomDef, type RoomId } from './map';
import type { PlayerStatus } from './PlayerController';

interface Props {
  status: PlayerStatus | null;
  onTeleport: (room: RoomDef) => void;
  /** Hệ số phóng to khi hiển thị (0.62 ở góc, lớn hơn khi mở bản đồ toàn màn hình bằng phím M). */
  zoom?: number;
}

const S = 2.4;
const W = (MAP_BOUNDS.maxX - MAP_BOUNDS.minX) * S;
const H = (MAP_BOUNDS.maxZ - MAP_BOUNDS.minZ) * S;
const px = (x: number) => (x - MAP_BOUNDS.minX) * S;
const pz = (z: number) => (z - MAP_BOUNDS.minZ) * S;

const SHORT: Record<RoomId, string> = {
  lobby: 'Lobby',
  workshop: 'Workshop',
  lab: 'Lab',
  vault: 'Vault',
  summit: 'Summit',
  forge: 'Forge',
};

/** Bản đồ 2D góc màn hình: phòng hiện tại sáng lên, click phòng để dịch chuyển. */
export const Minimap = ({ status, onTeleport, zoom = 0.62 }: Props) => (
  <div className="rounded-xl border border-white/10 bg-slate-950/70 p-2 backdrop-blur">
    <svg width={W * zoom} height={H * zoom} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Bản đồ trạm">
      {CORRIDORS.map((c) => (
        <rect key={c.id} x={px(c.rect.minX)} y={pz(c.rect.minZ)} width={(c.rect.maxX - c.rect.minX) * S} height={(c.rect.maxZ - c.rect.minZ) * S} fill="#1e293b" />
      ))}
      {ROOMS.map((room) => {
        const active = status?.room === room.id;
        const { rect } = room;
        return (
          <g key={room.id} className="cursor-pointer" onClick={() => onTeleport(room)}>
            <title>{`Dịch chuyển tới ${room.name}`}</title>
            <rect
              x={px(rect.minX)}
              y={pz(rect.minZ)}
              width={(rect.maxX - rect.minX) * S}
              height={(rect.maxZ - rect.minZ) * S}
              rx={4}
              fill={active ? room.color : '#0f172a'}
              fillOpacity={active ? 0.35 : 1}
              stroke={room.color}
              strokeWidth={active ? 3 : 1.5}
              className="transition-all hover:fill-opacity-60"
            />
            <text x={px((rect.minX + rect.maxX) / 2)} y={pz((rect.minZ + rect.maxZ) / 2) + 4} textAnchor="middle" fontSize={11} fill="#e2e8f0" className="pointer-events-none select-none">
              {ROOMS.indexOf(room) + 1}. {SHORT[room.id]}
            </text>
          </g>
        );
      })}
      {DOORS.map((d) => (
        <rect
          key={d.id}
          x={px(d.x) - (d.normal === 'z' ? 4.8 : 1.5)}
          y={pz(d.z) - (d.normal === 'z' ? 1.5 : 4.8)}
          width={d.normal === 'z' ? 9.6 : 3}
          height={d.normal === 'z' ? 3 : 9.6}
          fill={d.color}
          className="pointer-events-none"
        />
      ))}
      {status && (
        <g transform={`translate(${px(status.x)} ${pz(status.z)})`} className="pointer-events-none">
          <line x1={0} y1={0} x2={-Math.sin(status.yaw) * 14} y2={-Math.cos(status.yaw) * 14} stroke="#fff" strokeWidth={2} />
          <circle r={4.5} fill="#fff" stroke="#22d3ee" strokeWidth={2} />
        </g>
      )}
    </svg>
    <p className="mt-1 text-center text-[10px] text-slate-400">Phím 1–6 hoặc click phòng để dịch chuyển · M: bản đồ lớn</p>
  </div>
);
