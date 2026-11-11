import { useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { CODE_LINES } from '../config';

const LINE_H = 26;

/** Laptop vẽ bằng khối cơ bản; màn hình là CanvasTexture chạy dòng code xanh lá. */
export const Laptop = () => {
  const { canvas, ctx, texture } = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = 512;
    c.height = 320;
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return { canvas: c, ctx: c.getContext('2d'), texture: t };
  }, []);
  const tick = useRef(0);
  const offset = useRef(0);

  useEffect(() => () => texture.dispose(), [texture]);

  useFrame((_, delta) => {
    tick.current += delta;
    if (!ctx || tick.current < 0.12) return;
    tick.current = 0;
    offset.current = (offset.current + 1) % CODE_LINES.length;
    ctx.fillStyle = '#020806';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.font = '20px monospace';
    for (let row = 0; row < 11; row += 1) {
      const line = CODE_LINES.at((offset.current + row) % CODE_LINES.length) ?? '';
      ctx.fillStyle = row === 10 ? '#bbf7d0' : '#22c55e';
      ctx.fillText(line, 16, 30 + row * LINE_H);
    }
    if (Math.floor(performance.now() / 500) % 2 === 0) ctx.fillRect(16, 30 + 10 * LINE_H + 6, 12, 4);
    texture.needsUpdate = true;
  });

  return (
    <group>
      <mesh castShadow position={[0, 0.03, 0]}>
        <boxGeometry args={[1.6, 0.06, 1.05]} />
        <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh position={[0, 0.065, 0.1]} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[1.3, 0.55]} />
        <meshStandardMaterial color="#111827" roughness={0.8} />
      </mesh>
      <group position={[0, 0.06, -0.5]} rotation-x={-0.25}>
        <mesh castShadow position={[0, 0.5, 0]}>
          <boxGeometry args={[1.6, 1.0, 0.05]} />
          <meshStandardMaterial color="#1f2937" metalness={0.9} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0.5, 0.03]}>
          <planeGeometry args={[1.45, 0.88]} />
          <meshStandardMaterial color="black" emissive="white" emissiveMap={texture} emissiveIntensity={1.8} toneMapped={false} />
        </mesh>
      </group>
    </group>
  );
};
