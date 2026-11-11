import { Grid, Text } from '@react-three/drei';
import { useMemo } from 'react';
import * as THREE from 'three';
import { CORRIDORS, DOORS, ROOMS, WALLS, WALL_H, type Rect, type WallSegment } from './map';

interface Props {
  hiQuality: boolean;
}

const WALL_T = 0.3;
const center = (r: Rect) => ({ x: (r.minX + r.maxX) / 2, z: (r.minZ + r.maxZ) / 2, w: r.maxX - r.minX, d: r.maxZ - r.minZ });

/** Sàn + trần cho một vùng chữ nhật. */
const Slab = ({ rect, color, grid }: { rect: Rect; color: string; grid: boolean }) => {
  const c = center(rect);
  return (
    <group position={[c.x, 0, c.z]}>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <planeGeometry args={[c.w, c.d]} />
        <meshStandardMaterial color="#0b1120" metalness={0.75} roughness={0.38} />
      </mesh>
      {grid && (
        <Grid
          position={[0, 0.01, 0]}
          args={[c.w, c.d]}
          cellSize={1}
          cellThickness={0.6}
          cellColor="#1e293b"
          sectionSize={4}
          sectionThickness={1.1}
          sectionColor={color}
          fadeDistance={30}
          fadeStrength={1.5}
        />
      )}
      <mesh rotation-x={Math.PI / 2} position={[0, WALL_H, 0]}>
        <planeGeometry args={[c.w, c.d]} />
        <meshStandardMaterial color="#070b14" metalness={0.6} roughness={0.6} />
      </mesh>
    </group>
  );
};

const Wall = ({ wall, hiQuality }: { wall: WallSegment; hiQuality: boolean }) => {
  const size: [number, number, number] = wall.along === 'x' ? [wall.length + WALL_T, WALL_H, WALL_T] : [WALL_T, WALL_H, wall.length + WALL_T];
  const ledSize: [number, number, number] = wall.along === 'x' ? [wall.length, 0.06, 0.04] : [0.04, 0.06, wall.length];
  const off = WALL_T / 2 + 0.03;
  const ledX = wall.x + wall.inward[0] * off;
  const ledZ = wall.z + wall.inward[1] * off;

  if (wall.glass) {
    return (
      <group>
        <mesh position={[wall.x, WALL_H / 2, wall.z]}>
          <boxGeometry args={[size[0], size[1], 0.08]} />
          {hiQuality ? (
            <meshPhysicalMaterial color="#c4b5fd" transmission={1} thickness={0.2} roughness={0.04} ior={1.45} metalness={0} />
          ) : (
            <meshPhysicalMaterial color="#c4b5fd" transparent opacity={0.12} roughness={0.05} />
          )}
        </mesh>
        {/* Khung kính */}
        {[-1, -0.5, 0, 0.5, 1].map((k) => (
          <mesh key={k} position={[wall.x + (k * wall.length) / 2, WALL_H / 2, wall.z]}>
            <boxGeometry args={[0.12, WALL_H, 0.16]} />
            <meshStandardMaterial color="#1e1b4b" metalness={0.9} roughness={0.3} />
          </mesh>
        ))}
        <mesh position={[ledX, 0.04, ledZ]}>
          <boxGeometry args={ledSize} />
          <meshBasicMaterial color={new THREE.Color(wall.color).multiplyScalar(3)} toneMapped={false} />
        </mesh>
      </group>
    );
  }

  return (
    <group>
      <mesh position={[wall.x, WALL_H / 2, wall.z]} castShadow receiveShadow>
        <boxGeometry args={size} />
        <meshStandardMaterial color="#111827" metalness={0.85} roughness={0.42} />
      </mesh>
      {/* LED chân tường và mép trần */}
      <mesh position={[ledX, 0.05, ledZ]}>
        <boxGeometry args={ledSize} />
        <meshBasicMaterial color={new THREE.Color(wall.color).multiplyScalar(3)} toneMapped={false} />
      </mesh>
      <mesh position={[ledX, WALL_H - 0.06, ledZ]}>
        <boxGeometry args={ledSize} />
        <meshBasicMaterial color={new THREE.Color(wall.color).multiplyScalar(1.4)} toneMapped={false} />
      </mesh>
    </group>
  );
};

/** Đèn spot đổ bóng hướng thẳng xuống (target phải được thêm vào scene). */
const ShadowSpot = ({ x, z, color }: { x: number; z: number; color: string }) => {
  const light = useMemo(() => {
    const l = new THREE.SpotLight(color, 60, 14, 0.9, 0.6, 1.6);
    l.position.set(x, WALL_H - 0.15, z);
    l.target.position.set(x, 0, z);
    l.castShadow = true;
    l.shadow.mapSize.set(1024, 1024);
    l.shadow.bias = -0.0005;
    return l;
  }, [x, z, color]);
  return (
    <>
      <primitive object={light} />
      <primitive object={light.target} />
    </>
  );
};

/** Vỏ trạm: sàn/trần, tường kim loại có LED, đèn từng phòng, biển tên trên cửa. */
export const Architecture = ({ hiQuality }: Props) => (
  <group>
    {ROOMS.map((room) => (
      <Slab key={room.id} rect={room.rect} color={room.color} grid={hiQuality} />
    ))}
    {CORRIDORS.map((c) => (
      <Slab key={c.id} rect={c.rect} color="#334155" grid={false} />
    ))}
    {WALLS.map((w) => (
      <Wall key={w.key} wall={w} hiQuality={hiQuality} />
    ))}

    {ROOMS.map((room) => {
      const c = center(room.rect);
      return (
        <group key={room.id}>
          {/* Tấm đèn trần phát sáng */}
          <mesh position={[c.x, WALL_H - 0.02, c.z]} rotation-x={Math.PI / 2}>
            <ringGeometry args={[2.4, 2.6, room.id === 'lobby' ? 6 : 48]} />
            <meshBasicMaterial color={new THREE.Color(room.color).multiplyScalar(2.2)} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
          <pointLight position={[c.x, 3, c.z]} color={room.color} intensity={hiQuality ? 22 : 34} distance={18} decay={1.6} />
          {hiQuality && <ShadowSpot x={c.x} z={c.z} color="#e2e8f0" />}
        </group>
      );
    })}
    {CORRIDORS.map((c) => {
      const m = center(c.rect);
      return (
        <group key={c.id}>
          <pointLight position={[m.x, 3.4, m.z]} color="#94a3b8" intensity={6} distance={8} decay={1.8} />
          <mesh position={[m.x, WALL_H - 0.02, m.z]} rotation-x={Math.PI / 2}>
            <planeGeometry args={c.axis === 'ns' ? [0.4, 6] : [6, 0.4]} />
            <meshBasicMaterial color={[1.6, 1.8, 2]} toneMapped={false} side={THREE.DoubleSide} />
          </mesh>
        </group>
      );
    })}

    {/* Biển tên phòng gắn trên khung cửa, quay về phía người đi tới từ Lobby */}
    {DOORS.map((d) => {
      const room = ROOMS.find((r) => r.id === d.id);
      if (!room) return null;
      const fx = d.normal === 'x' ? -Math.sign(d.x) : 0;
      const fz = d.normal === 'z' ? -Math.sign(d.z) : 0;
      return (
        <group key={d.id} position={[d.x + fx * 0.2, 3.5, d.z + fz * 0.2]} rotation-y={Math.atan2(fx, fz)}>
          <Text fontSize={0.32} color={room.color} anchorX="center" anchorY="middle" outlineWidth={0.005} outlineColor="#000">
            {room.name.toUpperCase()}
            <meshBasicMaterial color={new THREE.Color(room.color).multiplyScalar(2)} toneMapped={false} />
          </Text>
          <Text position={[0, -0.3, 0]} fontSize={0.14} color="#cbd5e1" anchorX="center" anchorY="middle">
            {room.subtitle}
          </Text>
        </group>
      );
    })}
  </group>
);
