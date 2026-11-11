import { useFrame } from '@react-three/fiber';
import { easing } from 'maath';
import { useRef } from 'react';
import * as THREE from 'three';
import type { Vec3 } from './config';

interface Props {
  position: Vec3;
  target: Vec3;
  parallax?: number;
}

/** Camera trượt mượt tới vị trí của từng phòng, kèm parallax nhẹ theo chuột. */
export const CameraRig = ({ position, target, parallax = 1 }: Props) => {
  const look = useRef(new THREE.Vector3(...target));
  const goal = useRef(new THREE.Vector3());

  useFrame((state, delta) => {
    const { pointer, camera } = state;
    goal.current.set(position[0] + pointer.x * 1.4 * parallax, position[1] + pointer.y * 0.7 * parallax, position[2]);
    easing.damp3(camera.position, goal.current, 0.65, delta);
    easing.damp3(look.current, target, 0.5, delta);
    camera.lookAt(look.current);
  });

  return null;
};
