import { Environment, Lightformer, PointerLockControls, Stars } from '@react-three/drei';
import { Architecture } from './Architecture';
import { Doors } from './Door';
import { Effects } from './Effects';
import type { DoorState, RoomId } from './map';
import { PlayerController, type PlayerStatus, type TeleportTarget } from './PlayerController';
import { Forge } from './rooms/Forge';
import { Lobby } from './rooms/Lobby';
import { Tower } from './rooms/Tower';

interface Props {
  hiQuality: boolean;
  focusMode: boolean;
  doors: DoorState;
  teleport: TeleportTarget | null;
  onStatus: (status: PlayerStatus) => void;
  onInteract: (room: RoomId) => void;
  onLock: () => void;
  onUnlock: () => void;
}

/** Trạm khép kín: kiến trúc, cửa trượt, 6 phòng, người chơi và hậu kỳ. */
export const Scene = ({ hiQuality, focusMode, doors, teleport, onStatus, onInteract, onLock, onUnlock }: Props) => (
  <>
    <color attach="background" args={['#02030a']} />
    <Stars radius={150} depth={60} count={hiQuality ? 4000 : 1200} factor={5} saturation={0} fade speed={0.4} />

    <ambientLight intensity={0.06} />
    <hemisphereLight args={['#334155', '#020617', 0.2]} />

    {/* Phản chiếu cho kim loại, dựng bằng Lightformer (không tải file HDR). */}
    <Environment resolution={256} frames={1}>
      <Lightformer form="rect" intensity={1.6} color="#6366f1" position={[0, 6, -10]} scale={[20, 4, 1]} />
      <Lightformer form="rect" intensity={1.2} color="#22d3ee" position={[-10, 3, 4]} rotation-y={Math.PI / 2} scale={[12, 2, 1]} />
      <Lightformer form="ring" intensity={2} color="#f97316" position={[10, 8, 6]} scale={3} />
    </Environment>

    <Architecture hiQuality={hiQuality} />
    <Doors doors={doors} />
    <Lobby hiQuality={hiQuality} />
    <Tower hiQuality={hiQuality} />
    <Forge hiQuality={hiQuality} />

    <PlayerController doors={doors} enabled={!focusMode} teleport={teleport} onStatus={onStatus} onInteract={onInteract} />
    <PointerLockControls selector="#enter-facility" onLock={onLock} onUnlock={onUnlock} />

    {hiQuality && <Effects focusMode={focusMode} />}
  </>
);
