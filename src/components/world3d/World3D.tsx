import { KeyboardControls, PerformanceMonitor } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { Cpu, Gauge, Keyboard, LayoutGrid, Map as MapIcon, MousePointer2, Sparkles, X } from 'lucide-react';
import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { SectionHeader } from '../common/SectionHeader';
import { ClassicView } from './ClassicView';
import { ROOMS, createDoorState, type RoomDef, type RoomId } from './map';
import { Minimap } from './Minimap';
import { KEY_MAP, type PlayerStatus, type TeleportTarget } from './PlayerController';
import { Scene } from './Scene';
import { useGraphicsStore, type GraphicsMode } from './useGraphicsStore';

const MODES: { id: GraphicsMode; label: string; icon: typeof Sparkles }[] = [
  { id: 'hi', label: 'Hi-End', icon: Sparkles },
  { id: 'lite', label: 'Tiết kiệm GPU', icon: Gauge },
  { id: 'classic', label: '2D Classic', icon: LayoutGrid },
];

export const World3D = () => {
  const mode = useGraphicsStore((s) => s.mode);
  const setMode = useGraphicsStore((s) => s.setMode);
  const doors = useMemo(createDoorState, []);
  const [status, setStatus] = useState<PlayerStatus | null>(null);
  const [locked, setLocked] = useState(false);
  const [panelRoom, setPanelRoom] = useState<RoomDef | null>(null);
  const [teleport, setTeleport] = useState<TeleportTarget | null>(null);
  const [dpr, setDpr] = useState(1.5);
  const [mapOpen, setMapOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const hiQuality = mode === 'hi';

  const currentRoom = status && status.room !== 'corridor' ? ROOMS.find((r) => r.id === status.room) : undefined;

  const onInteract = useCallback((id: RoomId) => {
    const room = ROOMS.find((r) => r.id === id);
    if (!room) return;
    setPanelRoom(room);
    document.exitPointerLock();
  }, []);

  /** Khóa chuột lại vào canvas (phải gọi trong một thao tác click/phím của người dùng). */
  const relock = useCallback(() => {
    const canvas = containerRef.current?.querySelector('canvas');
    // Trình duyệt có thể từ chối; khi đó người dùng bấm nút "Tiếp tục khám phá" là được.
    Promise.resolve(canvas?.requestPointerLock()).catch(() => undefined);
  }, []);

  const onTeleport = useCallback((room: RoomDef) => {
    setPanelRoom(null);
    setTeleport({ ...room.spawn, nonce: Date.now() });
  }, []);

  /** Click phòng trên bản đồ lớn: dịch chuyển, đóng bản đồ và khóa chuột lại ngay. */
  const onMapTeleport = useCallback(
    (room: RoomDef) => {
      onTeleport(room);
      setMapOpen(false);
      relock();
    },
    [onTeleport, relock],
  );

  // Phím tắt: 1–6 dịch chuyển tức thì (không cần con trỏ), M mở/đóng bản đồ lớn.
  useEffect(() => {
    if (mode === 'classic') return;
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat || panelRoom) return;
      const n = /^Digit([1-6])$/.exec(e.code)?.[1];
      if (n) {
        const room = ROOMS[Number(n) - 1];
        if (room) onTeleport(room);
        return;
      }
      if (e.code === 'KeyM') {
        setMapOpen((open) => {
          if (!open) document.exitPointerLock();
          return !open;
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mode, panelRoom, onTeleport]);

  const onLock = useCallback(() => {
    setLocked(true);
    setMapOpen(false);
    // Bỏ focus khỏi nút "vào trạm" để phím Space không kích hoạt nút.
    if (document.activeElement instanceof HTMLElement) document.activeElement.blur();
  }, []);
  const onUnlock = useCallback(() => setLocked(false), []);

  return (
    <div>
      <SectionHeader
        title="Không gian 3D · Trạm nghiên cứu"
        subtitle="Đi bộ góc nhìn thứ nhất qua 6 phòng của lộ trình. Cửa trượt tự mở khi bạn tới gần; đứng cạnh màn hình/bệ điều khiển và bấm E để mở mục tương ứng."
        action={
          <div className="flex flex-wrap gap-1 rounded-xl border border-slate-800 bg-navy-900 p-1">
            {MODES.map(({ id, label, icon: Icon }) => (
              <button key={id} type="button" onClick={() => setMode(id)} className={mode === id ? 'btn-primary py-1.5' : 'btn py-1.5 text-slate-400 hover:text-white'}>
                <Icon size={14} /> {label}
              </button>
            ))}
          </div>
        }
      />

      {mode === 'classic' ? (
        <ClassicView />
      ) : (
        <KeyboardControls map={KEY_MAP}>
          <div ref={containerRef} className="relative h-[calc(100vh-12rem)] min-h-[460px] overflow-hidden rounded-2xl border border-slate-800 bg-black">
            <Canvas
              shadows={hiQuality}
              dpr={mode === 'lite' ? 1 : [1, Math.min(2, dpr)]}
              camera={{ fov: 70, near: 0.05, far: 320, position: [0, 1.7, 5.5] }}
              gl={{ antialias: mode === 'lite', powerPreference: 'high-performance' }}
            >
              <PerformanceMonitor onDecline={() => setDpr(1)} onIncline={() => setDpr(2)} />
              <Suspense fallback={null}>
                <Scene
                  hiQuality={hiQuality}
                  focusMode={panelRoom !== null}
                  doors={doors}
                  teleport={teleport}
                  onStatus={setStatus}
                  onInteract={onInteract}
                  onLock={onLock}
                  onUnlock={onUnlock}
                />
              </Suspense>
            </Canvas>

            {/* Tâm ngắm */}
            {locked && <div className="pointer-events-none absolute left-1/2 top-1/2 h-1.5 w-1.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80 shadow-[0_0_6px_#22d3ee]" />}

            {/* HUD phòng hiện tại */}
            <div className="pointer-events-none absolute left-3 top-3 rounded-xl border border-white/10 bg-slate-950/60 px-3 py-2 backdrop-blur">
              <p className="text-[10px] uppercase tracking-widest text-slate-400">Vị trí</p>
              <p className="text-sm font-semibold" style={{ color: currentRoom?.color ?? '#cbd5e1' }}>
                {currentRoom ? currentRoom.name : 'Hành lang'}
              </p>
              {currentRoom && <p className="text-[11px] text-slate-400">{currentRoom.subtitle}</p>}
            </div>

            {status?.nearTerminal && !panelRoom && currentRoom && (
              <div className="pointer-events-none absolute bottom-16 left-1/2 -translate-x-1/2 rounded-lg border border-white/15 bg-slate-950/75 px-4 py-2 text-sm text-white backdrop-blur">
                <kbd className="mr-2 rounded bg-white/15 px-1.5 py-0.5 font-mono text-xs">E</kbd>
                {currentRoom.info.title}
              </div>
            )}

            {/* z-20: nằm trên lớp phủ để vẫn click được khi đã thả chuột (Esc) */}
            <div className="absolute right-3 top-3 z-20">
              <Minimap status={status} onTeleport={onTeleport} />
            </div>

            <div className="pointer-events-none absolute bottom-3 left-3 flex items-center gap-2 rounded-lg bg-slate-950/60 px-3 py-1.5 text-[11px] text-slate-400 backdrop-blur">
              <Cpu size={12} /> {hiQuality ? 'Hi-End: bóng đổ · N8AO · Bloom · DOF' : 'Tiết kiệm GPU: tắt bóng đổ và hậu kỳ'}
            </div>

            {/* Lớp phủ vào trạm */}
            {/* Luôn giữ nút trong DOM: PointerLockControls chỉ gắn listener vào phần tử có sẵn lúc mount. */}
            <div className={`absolute inset-0 z-10 place-items-center bg-slate-950/55 backdrop-blur-[2px] ${!locked && !panelRoom && !mapOpen ? 'grid' : 'hidden'}`}>
                <div className="max-w-sm rounded-2xl border border-white/10 bg-slate-950/80 p-6 text-center">
                  <button id="enter-facility" type="button" className="btn-primary w-full py-3 text-base">
                    <MousePointer2 size={18} /> {status ? 'Tiếp tục khám phá' : 'Bấm để vào trạm'}
                  </button>
                  <div className="mt-4 grid grid-cols-2 gap-2 text-left text-xs text-slate-300">
                    <p className="flex items-center gap-1.5">
                      <Keyboard size={13} /> WASD / ← ↑ → ↓: đi
                    </p>
                    <p>Shift: chạy · Space: nhảy</p>
                    <p>Chuột: nhìn quanh</p>
                    <p>E: tương tác</p>
                    <p>Esc: thả chuột</p>
                    <p>1–6: dịch chuyển nhanh</p>
                    <p className="col-span-2">M: mở bản đồ lớn rồi click phòng để dịch chuyển</p>
                  </div>
                </div>
            </div>

            {mapOpen && (
              <div className="absolute inset-0 z-30 grid place-items-center bg-slate-950/70 backdrop-blur-sm">
                <div className="relative rounded-2xl border border-white/10 bg-slate-950/80 p-4">
                  <div className="mb-2 flex items-center justify-between gap-6">
                    <p className="flex items-center gap-2 text-sm font-semibold text-white">
                      <MapIcon size={16} /> Bản đồ trạm · click phòng để dịch chuyển
                    </p>
                    <button type="button" aria-label="Đóng bản đồ" onClick={() => setMapOpen(false)} className="text-slate-400 hover:text-white">
                      <X size={18} />
                    </button>
                  </div>
                  <Minimap status={status} onTeleport={onMapTeleport} zoom={1.6} />
                </div>
              </div>
            )}

            <AnimatePresence>
              {panelRoom && (
                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  className="absolute left-1/2 top-1/2 z-30 w-96 max-w-[calc(100%-1.5rem)] -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-slate-950/85 p-6 backdrop-blur-md"
                  style={{ boxShadow: `0 0 40px ${panelRoom.color}33` }}
                >
                  <button type="button" aria-label="Đóng" onClick={() => setPanelRoom(null)} className="absolute right-3 top-3 text-slate-400 hover:text-white">
                    <X size={18} />
                  </button>
                  <p className="text-xs uppercase tracking-widest" style={{ color: panelRoom.color }}>
                    {panelRoom.name} · {panelRoom.subtitle}
                  </p>
                  <h3 className="mt-1 text-lg font-semibold text-white">{panelRoom.info.title}</h3>
                  <p className="mt-2 text-sm text-slate-300">{panelRoom.info.description}</p>
                  <div className="mt-5 flex gap-2">
                    <a href={`#${panelRoom.info.section}`} className="btn-primary flex-1">
                      {panelRoom.info.actionLabel}
                    </a>
                    <button type="button" className="btn-ghost" onClick={() => setPanelRoom(null)}>
                      Ở lại trạm
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </KeyboardControls>
      )}
    </div>
  );
};
