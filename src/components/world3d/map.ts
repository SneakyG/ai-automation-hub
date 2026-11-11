import { OBJECT_INFO, type ObjectInfo } from './config';

export interface Rect {
  minX: number;
  maxX: number;
  minZ: number;
  maxZ: number;
}

export type RoomId = 'lobby' | 'workshop' | 'lab' | 'vault' | 'summit' | 'forge';
export type Side = 'n' | 's' | 'e' | 'w';

export interface Opening {
  side: Side;
  center: number;
  width: number;
}

export interface RoomDef {
  id: RoomId;
  name: string;
  subtitle: string;
  rect: Rect;
  color: string;
  openings: Opening[];
  spawn: { x: number; z: number; yaw: number };
  terminal: { x: number; z: number };
  info: ObjectInfo;
  glassSide?: Side;
}

export interface CorridorDef {
  id: string;
  rect: Rect;
  axis: 'ns' | 'ew';
}

export interface DoorDef {
  id: RoomId;
  x: number;
  z: number;
  /** Trục pháp tuyến của mặt cửa: 'z' = cửa nằm ngang theo trục X. */
  normal: 'x' | 'z';
  color: string;
}

export const WALL_H = 4;
export const PLAYER_RADIUS = 0.35;
export const EYE_HEIGHT = 1.7;
export const DOOR_WIDTH = 4;
const HALF = 8;

const square = (cx: number, cz: number, half = HALF): Rect => ({ minX: cx - half, maxX: cx + half, minZ: cz - half, maxZ: cz + half });

export const ROOMS: RoomDef[] = [
  {
    id: 'lobby',
    name: 'Trung tâm điều hành',
    subtitle: 'Lobby · Control Center',
    rect: square(0, 0),
    color: '#22d3ee',
    openings: [
      { side: 'n', center: 0, width: DOOR_WIDTH },
      { side: 's', center: 0, width: DOOR_WIDTH },
      { side: 'e', center: 0, width: DOOR_WIDTH },
      { side: 'w', center: 0, width: DOOR_WIDTH },
    ],
    spawn: { x: 0, z: 5.5, yaw: 0 },
    terminal: { x: 0, z: 0 },
    info: OBJECT_INFO.hologram,
  },
  {
    id: 'workshop',
    name: 'Workshop',
    subtitle: 'Ngày 1–30 · Khởi động',
    rect: square(0, -24),
    color: '#22c55e',
    openings: [{ side: 's', center: 0, width: DOOR_WIDTH }],
    spawn: { x: 0, z: -18, yaw: 0 },
    terminal: { x: 0, z: -29.6 },
    info: OBJECT_INFO.laptop,
  },
  {
    id: 'lab',
    name: 'Automation Lab',
    subtitle: 'Ngày 31–60 · Tăng tốc',
    rect: square(24, 0),
    color: '#818cf8',
    openings: [{ side: 'w', center: 0, width: DOOR_WIDTH }],
    spawn: { x: 18, z: 0, yaw: -Math.PI / 2 },
    terminal: { x: 30, z: 0 },
    info: OBJECT_INFO.servers,
  },
  {
    id: 'vault',
    name: 'Commercial Vault',
    subtitle: 'Ngày 61–90 · Đóng gói',
    rect: square(0, 24),
    color: '#f59e0b',
    openings: [
      { side: 'n', center: 0, width: DOOR_WIDTH },
      { side: 's', center: 0, width: DOOR_WIDTH },
    ],
    spawn: { x: 0, z: 18, yaw: Math.PI },
    terminal: { x: 4.8, z: 26.4 },
    info: OBJECT_INFO.vault,
  },
  {
    id: 'summit',
    name: 'The Summit',
    subtitle: 'Tháng 4–6 · Scale',
    rect: square(0, 48),
    color: '#e879f9',
    openings: [{ side: 'n', center: 0, width: DOOR_WIDTH }],
    spawn: { x: 0, z: 42, yaw: Math.PI },
    terminal: { x: 3.5, z: 53 },
    info: OBJECT_INFO.telescope,
    glassSide: 's',
  },
  {
    id: 'forge',
    name: 'Alchemist Forge',
    subtitle: 'Xưởng chế tạo Prompt',
    rect: square(-24, 0),
    color: '#f97316',
    openings: [{ side: 'e', center: 0, width: DOOR_WIDTH }],
    spawn: { x: -18, z: 0, yaw: Math.PI / 2 },
    terminal: { x: -24, z: 3.2 },
    info: OBJECT_INFO.forge,
  },
];

export const CORRIDORS: CorridorDef[] = [
  { id: 'c-north', rect: { minX: -2, maxX: 2, minZ: -16, maxZ: -8 }, axis: 'ns' },
  { id: 'c-east', rect: { minX: 8, maxX: 16, minZ: -2, maxZ: 2 }, axis: 'ew' },
  { id: 'c-south', rect: { minX: -2, maxX: 2, minZ: 8, maxZ: 16 }, axis: 'ns' },
  { id: 'c-summit', rect: { minX: -2, maxX: 2, minZ: 32, maxZ: 40 }, axis: 'ns' },
  { id: 'c-west', rect: { minX: -16, maxX: -8, minZ: -2, maxZ: 2 }, axis: 'ew' },
];

export const DOORS: DoorDef[] = [
  { id: 'workshop', x: 0, z: -16, normal: 'z', color: '#22c55e' },
  { id: 'lab', x: 16, z: 0, normal: 'x', color: '#818cf8' },
  { id: 'vault', x: 0, z: 16, normal: 'z', color: '#f59e0b' },
  { id: 'summit', x: 0, z: 40, normal: 'z', color: '#e879f9' },
  { id: 'forge', x: -16, z: 0, normal: 'x', color: '#f97316' },
];

/** Vật cản trong phòng (bàn, tủ, két...) theo tọa độ thế giới. */
export const OBSTACLES: Rect[] = [
  { minX: -2, maxX: 2, minZ: -2, maxZ: 2 },
  { minX: -1.8, maxX: 1.8, minZ: -31.9, maxZ: -30.1 },
  { minX: 5.4, maxX: 7.8, minZ: -31.9, maxZ: -29.4 },
  { minX: 28, maxX: 31.9, minZ: -7.9, maxZ: -6.1 },
  { minX: 28, maxX: 31.9, minZ: 6.1, maxZ: 7.9 },
  { minX: 17, maxX: 21, minZ: -7.9, maxZ: -6.1 },
  { minX: 17, maxX: 21, minZ: 6.1, maxZ: 7.9 },
  { minX: 3.6, maxX: 6, minZ: 28, maxZ: 31.5 },
  { minX: -7.9, maxX: -5.6, minZ: 19, maxZ: 29 },
  { minX: -2, maxX: 2, minZ: 46.2, maxZ: 47.8 },
  { minX: -26.4, maxX: -21.6, minZ: -2.4, maxZ: 2.4 },
  { minX: -30.5, maxX: -17.5, minZ: -7.9, maxZ: -6.9 },
];

const R = PLAYER_RADIUS;

const WALKABLE: Rect[] = [
  ...ROOMS.map(({ rect }) => ({ minX: rect.minX + R, maxX: rect.maxX - R, minZ: rect.minZ + R, maxZ: rect.maxZ - R })),
  ...CORRIDORS.map(({ rect, axis }) =>
    axis === 'ns'
      ? { minX: rect.minX + R, maxX: rect.maxX - R, minZ: rect.minZ - 1, maxZ: rect.maxZ + 1 }
      : { minX: rect.minX - 1, maxX: rect.maxX + 1, minZ: rect.minZ + R, maxZ: rect.maxZ - R },
  ),
];

const inside = (r: Rect, x: number, z: number) => x > r.minX && x < r.maxX && z > r.minZ && z < r.maxZ;

/** Độ mở của từng cửa (0 = đóng, 1 = mở hẳn); PlayerController cập nhật mỗi khung hình. */
export type DoorState = Record<RoomId, number>;

export const createDoorState = (): DoorState => ({ lobby: 1, workshop: 0, lab: 0, vault: 0, summit: 0, forge: 0 });

/** Kiểm tra va chạm: điểm phải nằm trong vùng đi được, không chạm vật cản và không xuyên cửa đang đóng. */
export const isWalkable = (x: number, z: number, doors: DoorState): boolean => {
  if (!WALKABLE.some((r) => inside(r, x, z))) return false;
  if (OBSTACLES.some((o) => inside({ minX: o.minX - R, maxX: o.maxX + R, minZ: o.minZ - R, maxZ: o.maxZ + R }, x, z))) return false;
  for (const d of DOORS) {
    if (doors[d.id] > 0.85) continue;
    const across = d.normal === 'z' ? Math.abs(z - d.z) : Math.abs(x - d.x);
    const along = d.normal === 'z' ? Math.abs(x - d.x) : Math.abs(z - d.z);
    if (across < 0.2 + R && along < DOOR_WIDTH / 2) return false;
  }
  return true;
};

export const roomAt = (x: number, z: number): RoomId | 'corridor' => ROOMS.find((r) => inside(r.rect, x, z))?.id ?? 'corridor';

export interface WallSegment {
  key: string;
  x: number;
  z: number;
  length: number;
  /** Tường chạy dọc trục nào. */
  along: 'x' | 'z';
  color: string;
  glass: boolean;
  /** Hướng vào trong phòng, dùng để đặt dải LED chân tường. */
  inward: [number, number];
}

const sideSegments = (room: RoomDef, side: Side): WallSegment[] => {
  const { rect } = room;
  const horizontal = side === 'n' || side === 's';
  const start = horizontal ? rect.minX : rect.minZ;
  const end = horizontal ? rect.maxX : rect.maxZ;
  const fixed = side === 'n' ? rect.minZ : side === 's' ? rect.maxZ : side === 'w' ? rect.minX : rect.maxX;
  const inward: [number, number] = side === 'n' ? [0, 1] : side === 's' ? [0, -1] : side === 'w' ? [1, 0] : [-1, 0];
  const holes = room.openings.filter((o) => o.side === side).map((o) => [o.center - o.width / 2, o.center + o.width / 2] as const);
  const pieces: [number, number][] = [];
  let cursor = start;
  holes
    .slice()
    .sort((a, b) => a[0] - b[0])
    .forEach(([a, b]) => {
      if (a > cursor) pieces.push([cursor, a]);
      cursor = Math.max(cursor, b);
    });
  if (cursor < end) pieces.push([cursor, end]);
  return pieces.map(([a, b], i) => {
    const mid = (a + b) / 2;
    return {
      key: `${room.id}-${side}-${i}`,
      x: horizontal ? mid : fixed,
      z: horizontal ? fixed : mid,
      length: b - a,
      along: horizontal ? 'x' : 'z',
      color: room.color,
      glass: room.glassSide === side,
      inward,
    };
  });
};

export const WALLS: WallSegment[] = [
  ...ROOMS.flatMap((room) => (['n', 's', 'e', 'w'] as Side[]).flatMap((side) => sideSegments(room, side))),
  ...CORRIDORS.flatMap(({ id, rect, axis }) =>
    axis === 'ns'
      ? [
          { key: `${id}-w`, x: rect.minX, z: (rect.minZ + rect.maxZ) / 2, length: rect.maxZ - rect.minZ, along: 'z' as const, color: '#475569', glass: false, inward: [1, 0] as [number, number] },
          { key: `${id}-e`, x: rect.maxX, z: (rect.minZ + rect.maxZ) / 2, length: rect.maxZ - rect.minZ, along: 'z' as const, color: '#475569', glass: false, inward: [-1, 0] as [number, number] },
        ]
      : [
          { key: `${id}-n`, x: (rect.minX + rect.maxX) / 2, z: rect.minZ, length: rect.maxX - rect.minX, along: 'x' as const, color: '#475569', glass: false, inward: [0, 1] as [number, number] },
          { key: `${id}-s`, x: (rect.minX + rect.maxX) / 2, z: rect.maxZ, length: rect.maxX - rect.minX, along: 'x' as const, color: '#475569', glass: false, inward: [0, -1] as [number, number] },
        ],
  ),
];

export const MAP_BOUNDS: Rect = { minX: -32, maxX: 32, minZ: -32, maxZ: 56 };
