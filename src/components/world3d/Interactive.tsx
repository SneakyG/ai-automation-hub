import { useCursor } from '@react-three/drei';
import { useFrame, type ThreeEvent } from '@react-three/fiber';
import { Select } from '@react-three/postprocessing';
import { easing } from 'maath';
import { useRef, useState, type ReactNode } from 'react';
import type * as THREE from 'three';
import type { ObjectInfo } from './config';

interface Props {
  info: ObjectInfo;
  onSelect: (info: ObjectInfo) => void;
  children: ReactNode;
  lift?: number;
}

/** Vật thể có thể tương tác: hover thì nhích lên và viền sáng, click thì mở bảng thông tin. */
export const Interactive = ({ info, onSelect, children, lift = 0.3 }: Props) => {
  const ref = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  useCursor(hovered);

  useFrame((_, delta) => {
    if (ref.current) easing.damp(ref.current.position, 'y', hovered ? lift : 0, 0.18, delta);
  });

  return (
    <group
      ref={ref}
      onPointerOver={(e: ThreeEvent<PointerEvent>) => {
        e.stopPropagation();
        setHovered(true);
      }}
      onPointerOut={() => setHovered(false)}
      onClick={(e: ThreeEvent<MouseEvent>) => {
        e.stopPropagation();
        onSelect(info);
      }}
    >
      <Select enabled={hovered}>{children}</Select>
    </group>
  );
};
