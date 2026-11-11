import { Bloom, ChromaticAberration, DepthOfField, EffectComposer, N8AO, Vignette } from '@react-three/postprocessing';
import { useMemo } from 'react';
import { Vector2 } from 'three';

interface Props {
  /** true khi đang mở bảng thông tin: bật DOF làm mờ hậu cảnh. */
  focusMode: boolean;
}

/** Chuỗi hậu kỳ cho chế độ Hi-End: SSAO (N8AO), Bloom cho neon, DOF khi mở bảng, Vignette. */
export const Effects = ({ focusMode }: Props) => {
  const aberration = useMemo(() => new Vector2(0.0005, 0.0005), []);

  return (
    <EffectComposer multisampling={0}>
      <N8AO halfRes aoRadius={1.2} intensity={2.5} distanceFalloff={0.6} />
      <Bloom mipmapBlur luminanceThreshold={0.8} luminanceSmoothing={0.2} intensity={1.2} radius={0.7} />
      <DepthOfField focusDistance={0.005} focalLength={0.02} bokehScale={focusMode ? 6 : 0} />
      <ChromaticAberration offset={aberration} />
      <Vignette eskil={false} offset={0.25} darkness={0.75} />
    </EffectComposer>
  );
};
