import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import { DOORS, DOOR_WIDTH, WALL_H, type DoorDef, type DoorState } from './map';

const DOOR_H = 3;
const PANEL_W = DOOR_WIDTH / 2;

const SlidingDoor = ({ door, doors }: { door: DoorDef; doors: DoorState }) => {
  const left = useRef<THREE.Group>(null);
  const rightPanel = useRef<THREE.Group>(null);
  const status = useRef<THREE.MeshBasicMaterial>(null);
  const glow = new THREE.Color(door.color).multiplyScalar(3);

  useFrame(() => {
    const open = doors[door.id];
    const slide = open * (PANEL_W - 0.15);
    if (left.current) left.current.position.x = -PANEL_W / 2 - slide;
    if (rightPanel.current) rightPanel.current.position.x = PANEL_W / 2 + slide;
    // Đèn trạng thái: đỏ khi đóng, màu phòng khi mở.
    if (status.current) status.current.color.setRGB(3, 0.3, 0.3).lerp(glow, open);
  });

  const panel = (
    <>
      <mesh castShadow>
        <boxGeometry args={[PANEL_W, DOOR_H, 0.12]} />
        <meshStandardMaterial color="#1f2937" metalness={0.95} roughness={0.28} />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, 0, s * 0.065]}>
          <boxGeometry args={[0.06, DOOR_H * 0.8, 0.01]} />
          <meshBasicMaterial color={glow} toneMapped={false} />
        </mesh>
      ))}
    </>
  );

  return (
    <group position={[door.x, 0, door.z]} rotation-y={door.normal === 'z' ? 0 : Math.PI / 2}>
      <group ref={left} position={[-PANEL_W / 2, DOOR_H / 2, 0]}>
        {panel}
      </group>
      <group ref={rightPanel} position={[PANEL_W / 2, DOOR_H / 2, 0]}>
        {panel}
      </group>
      {/* Lanh tô phía trên cửa */}
      <mesh position={[0, (DOOR_H + WALL_H) / 2, 0]}>
        <boxGeometry args={[DOOR_WIDTH, WALL_H - DOOR_H, 0.3]} />
        <meshStandardMaterial color="#111827" metalness={0.85} roughness={0.4} />
      </mesh>
      {/* Khung phát sáng */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * (DOOR_WIDTH / 2 - 0.04), DOOR_H / 2, 0]}>
          <boxGeometry args={[0.08, DOOR_H, 0.34]} />
          <meshBasicMaterial color={glow} toneMapped={false} />
        </mesh>
      ))}
      <mesh position={[0, DOOR_H + 0.04, 0]}>
        <boxGeometry args={[DOOR_WIDTH, 0.08, 0.34]} />
        <meshBasicMaterial ref={status} color={glow} toneMapped={false} />
      </mesh>
    </group>
  );
};

/** Cửa trượt sci-fi: 2 cánh trượt vào trong tường; độ mở lấy từ doorState do PlayerController cập nhật. */
export const Doors = ({ doors }: { doors: DoorState }) => (
  <>
    {DOORS.map((d) => (
      <SlidingDoor key={d.id} door={d} doors={doors} />
    ))}
  </>
);
