import { useEffect, useMemo } from 'react';
import * as THREE from 'three';

export interface ScreenLine {
  text: string;
  color?: string;
  size?: number;
}

interface Props {
  width: number;
  height: number;
  title: string;
  accent: string;
  lines: ScreenLine[];
  /** Vẽ thêm sơ đồ node nối nhau (dùng cho màn hình RAG). */
  nodes?: string[];
  intensity?: number;
}

const PX = 160;

/** Màn hình phát sáng: nội dung vẽ một lần lên CanvasTexture (không cần font tải ngoài). */
export const ScreenPanel = ({ width, height, title, accent, lines, nodes, intensity = 1.4 }: Props) => {
  const texture = useMemo(() => {
    const c = document.createElement('canvas');
    c.width = Math.round(width * PX);
    c.height = Math.round(height * PX);
    const ctx = c.getContext('2d');
    if (ctx) {
      const g = ctx.createLinearGradient(0, 0, 0, c.height);
      g.addColorStop(0, '#050a18');
      g.addColorStop(1, '#0b1226');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = accent;
      ctx.lineWidth = 6;
      ctx.strokeRect(8, 8, c.width - 16, c.height - 16);
      ctx.fillStyle = accent;
      ctx.font = `bold ${Math.round(c.height * 0.09)}px sans-serif`;
      ctx.fillText(title, 36, c.height * 0.15);
      let y = c.height * 0.27;
      for (const line of lines) {
        const size = Math.round(c.height * (line.size ?? 0.055));
        ctx.font = `${size}px monospace`;
        ctx.fillStyle = line.color ?? '#cbd5e1';
        ctx.fillText(line.text, 36, y);
        y += size * 1.45;
      }
      if (nodes?.length) {
        const top = y + c.height * 0.04;
        const boxW = (c.width - 72) / nodes.length - 30;
        const boxH = c.height * 0.14;
        nodes.forEach((label, i) => {
          const x = 36 + i * (boxW + 30);
          ctx.strokeStyle = accent;
          ctx.lineWidth = 4;
          ctx.strokeRect(x, top, boxW, boxH);
          ctx.fillStyle = '#e0e7ff';
          ctx.font = `bold ${Math.round(boxH * 0.3)}px sans-serif`;
          ctx.fillText(label, x + 14, top + boxH * 0.62, boxW - 24);
          if (i < nodes.length - 1) {
            ctx.beginPath();
            ctx.moveTo(x + boxW, top + boxH / 2);
            ctx.lineTo(x + boxW + 30, top + boxH / 2);
            ctx.stroke();
          }
        });
      }
    }
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 4;
    return t;
  }, [width, height, title, accent, lines, nodes]);

  useEffect(() => () => texture.dispose(), [texture]);

  return (
    <group>
      <mesh position={[0, 0, -0.04]}>
        <boxGeometry args={[width + 0.15, height + 0.15, 0.06]} />
        <meshStandardMaterial color="#0f172a" metalness={0.9} roughness={0.3} />
      </mesh>
      <mesh>
        <planeGeometry args={[width, height]} />
        <meshStandardMaterial color="black" emissive="white" emissiveMap={texture} emissiveIntensity={intensity} toneMapped={false} />
      </mesh>
    </group>
  );
};
