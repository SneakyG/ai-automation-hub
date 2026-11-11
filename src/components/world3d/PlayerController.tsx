import { useKeyboardControls } from '@react-three/drei';
import { useFrame, useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { DOORS, EYE_HEIGHT, ROOMS, WALL_H, isWalkable, roomAt, type DoorState, type RoomId } from './map';

export type Controls = 'forward' | 'backward' | 'left' | 'right' | 'run' | 'jump' | 'interact';

export const KEY_MAP: { name: Controls; keys: string[] }[] = [
  { name: 'forward', keys: ['KeyW', 'ArrowUp'] },
  { name: 'backward', keys: ['KeyS', 'ArrowDown'] },
  { name: 'left', keys: ['KeyA', 'ArrowLeft'] },
  { name: 'right', keys: ['KeyD', 'ArrowRight'] },
  { name: 'run', keys: ['ShiftLeft', 'ShiftRight'] },
  { name: 'jump', keys: ['Space'] },
  { name: 'interact', keys: ['KeyE'] },
];

export interface PlayerStatus {
  room: RoomId | 'corridor';
  nearTerminal: boolean;
  x: number;
  z: number;
  yaw: number;
}

export interface TeleportTarget {
  x: number;
  z: number;
  yaw: number;
  nonce: number;
}

interface Props {
  doors: DoorState;
  enabled: boolean;
  teleport: TeleportTarget | null;
  onStatus: (status: PlayerStatus) => void;
  onInteract: (room: RoomId) => void;
}

const WALK = 3.5;
const RUN = 6;
const DOOR_RANGE = 3.5;
const TERMINAL_RANGE = 3;
const JUMP_SPEED = 4.6; // ≈ cao 1,1 m
const GRAVITY = 9.8;
const MAX_RISE = WALL_H - EYE_HEIGHT - 0.25; // không cho đầu xuyên trần

const forward = new THREE.Vector3();
const right = new THREE.Vector3();
const move = new THREE.Vector3();
const euler = new THREE.Euler(0, 0, 0, 'YXZ');

/** Di chuyển góc nhìn thứ nhất: WASD/mũi tên, Shift chạy, E tương tác. Va chạm tự viết (AABB) nên không cần engine vật lý. */
export const PlayerController = ({ doors, enabled, teleport, onStatus, onInteract }: Props) => {
  const camera = useThree((s) => s.camera);
  const [, getKeys] = useKeyboardControls<Controls>();
  const bob = useRef(0);
  const statusTick = useRef(0);
  const prevInteract = useRef(false);
  const lastStatus = useRef<PlayerStatus | null>(null);
  const rise = useRef(0);
  const velY = useRef(0);
  const prevJump = useRef(false);

  const jumpQueued = useRef(false);

  // Nhảy nghe phím trực tiếp (capture) để không bị nút đang focus "nuốt" mất phím Space; đồng thời chặn cuộn trang.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.key !== ' ') return;
      e.preventDefault();
      if (!e.repeat) jumpQueued.current = true;
    };
    window.addEventListener('keydown', onKey, { capture: true });
    return () => window.removeEventListener('keydown', onKey, { capture: true });
  }, []);

  useEffect(() => {
    const spawn = ROOMS[0].spawn;
    camera.rotation.order = 'YXZ';
    camera.position.set(spawn.x, EYE_HEIGHT, spawn.z);
    camera.rotation.set(0, spawn.yaw, 0);
  }, [camera]);

  useEffect(() => {
    if (!teleport) return;
    camera.rotation.order = 'YXZ';
    camera.position.set(teleport.x, EYE_HEIGHT, teleport.z);
    rise.current = 0;
    velY.current = 0;
    camera.rotation.set(0, teleport.yaw, 0);
    // Mở sẵn cửa của phòng đích để không bị kẹt khi dịch chuyển.
    const target = roomAt(teleport.x, teleport.z);
    if (target !== 'corridor') doors[target] = 1;
  }, [teleport, camera, doors]);

  useFrame((_, rawDelta) => {
    const delta = Math.min(rawDelta, 0.05);
    const keys = getKeys();
    const pos = camera.position;

    // Hướng đi theo góc camera, bỏ thành phần y để không "bay".
    camera.getWorldDirection(forward);
    forward.y = 0;
    forward.normalize();
    right.crossVectors(forward, camera.up).normalize();
    move.set(0, 0, 0);
    if (enabled) {
      if (keys.forward) move.add(forward);
      if (keys.backward) move.sub(forward);
      if (keys.right) move.add(right);
      if (keys.left) move.sub(right);
    }
    const moving = move.lengthSq() > 0;
    if (moving) {
      move.normalize().multiplyScalar((keys.run ? RUN : WALK) * delta);
      // Thử từng trục riêng để trượt dọc theo tường thay vì dừng hẳn.
      if (isWalkable(pos.x + move.x, pos.z, doors)) pos.x += move.x;
      if (isWalkable(pos.x, pos.z + move.z, doors)) pos.z += move.z;
      bob.current += delta * (keys.run ? 14 : 9);
    }
    // Nhảy: bấm Space khi đang đứng trên sàn; trọng lực kéo xuống, trần chặn phía trên.
    const grounded = rise.current <= 0;
    const jumpPressed = !!keys.jump;
    if (enabled && grounded && (jumpQueued.current || (jumpPressed && !prevJump.current))) velY.current = JUMP_SPEED;
    jumpQueued.current = false;
    prevJump.current = jumpPressed;
    if (!grounded || velY.current > 0) {
      velY.current -= GRAVITY * delta;
      rise.current += velY.current * delta;
      if (rise.current > MAX_RISE) {
        rise.current = MAX_RISE;
        velY.current = Math.min(velY.current, 0);
      }
      if (rise.current <= 0) {
        rise.current = 0;
        velY.current = 0;
      }
    }
    const onGround = rise.current <= 0;
    pos.y = EYE_HEIGHT + rise.current + (moving && onGround ? Math.sin(bob.current) * 0.04 : 0);

    // Cửa trượt: mở khi người chơi đến gần, đóng lại khi rời đi (không đóng khi đang đứng giữa khung cửa).
    for (const d of DOORS) {
      const dist = Math.hypot(pos.x - d.x, pos.z - d.z);
      const target = dist < DOOR_RANGE ? 1 : 0;
      doors[d.id] = THREE.MathUtils.damp(doors[d.id], target, 6, delta);
      if (dist < 1) doors[d.id] = Math.max(doors[d.id], 0.9);
    }

    const room = roomAt(pos.x, pos.z);
    const def = room === 'corridor' ? undefined : ROOMS.find((r) => r.id === room);
    const nearTerminal = !!def && Math.hypot(pos.x - def.terminal.x, pos.z - def.terminal.z) < TERMINAL_RANGE;

    const pressed = !!keys.interact;
    if (enabled && pressed && !prevInteract.current && nearTerminal && def) onInteract(def.id);
    prevInteract.current = pressed;

    statusTick.current += delta;
    if (statusTick.current > 0.1) {
      statusTick.current = 0;
      euler.setFromQuaternion(camera.quaternion, 'YXZ');
      const next: PlayerStatus = { room, nearTerminal, x: pos.x, z: pos.z, yaw: euler.y };
      const prev = lastStatus.current;
      const changed =
        !prev ||
        prev.room !== next.room ||
        prev.nearTerminal !== next.nearTerminal ||
        Math.abs(prev.x - next.x) > 0.05 ||
        Math.abs(prev.z - next.z) > 0.05 ||
        Math.abs(prev.yaw - next.yaw) > 0.03;
      if (changed) {
        lastStatus.current = next;
        onStatus(next);
      }
    }
  });

  return null;
};
