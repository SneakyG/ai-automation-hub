import { useFrame } from '@react-three/fiber';
import { useMemo } from 'react';
import * as THREE from 'three';
import type { Vec3 } from './config';

const vertexShader = /* glsl */ `
  varying vec3 vWorld;
  void main() {
    vec4 world = modelMatrix * vec4(position, 1.0);
    vWorld = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
  }
`;

const fragmentShader = /* glsl */ `
  uniform float uTime;
  uniform vec3 uColorA;
  uniform vec3 uColorB;
  uniform vec2 uCenter;
  uniform float uRadius;
  varying vec3 vWorld;

  float gridLine(vec2 p, float size) {
    vec2 q = p / size;
    vec2 g = abs(fract(q - 0.5) - 0.5) / fwidth(q);
    return 1.0 - min(min(g.x, g.y), 1.0);
  }

  void main() {
    vec2 p = vWorld.xz;
    float d = length(p - uCenter);
    float fine = gridLine(p, 1.0);
    float coarse = gridLine(p, 5.0);
    float wave = 0.5 + 0.5 * sin(d * 0.55 - uTime * 2.2);
    float fade = 1.0 - smoothstep(uRadius * 0.35, uRadius, d);
    vec3 color = mix(uColorA, uColorB, wave) * (1.2 + wave * 2.2);
    float alpha = (fine * 0.25 + coarse * 0.85) * fade * (0.35 + 0.65 * wave);
    gl_FragColor = vec4(color, alpha);
  }
`;

interface Props {
  center: Vec3;
  radius?: number;
  colorA?: string;
  colorB?: string;
}

/** Sàn lưới laser phát sáng, sóng neon lan từ tâm phòng. */
export const GridFloor = ({ center, radius = 18, colorA = '#6366f1', colorB = '#22d3ee' }: Props) => {
  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        toneMapped: false,
        uniforms: {
          uTime: { value: 0 },
          uColorA: { value: new THREE.Color(colorA) },
          uColorB: { value: new THREE.Color(colorB) },
          uCenter: { value: new THREE.Vector2(center[0], center[2]) },
          uRadius: { value: radius },
        },
      }),
    [center, radius, colorA, colorB],
  );

  useFrame((_, delta) => {
    material.uniforms.uTime.value += delta;
  });

  return (
    <group position={center}>
      <mesh rotation-x={-Math.PI / 2} receiveShadow>
        <circleGeometry args={[radius, 64]} />
        <meshStandardMaterial color="#0a0f1e" metalness={0.85} roughness={0.35} />
      </mesh>
      <mesh rotation-x={-Math.PI / 2} position-y={0.01} material={material}>
        <circleGeometry args={[radius, 64]} />
      </mesh>
    </group>
  );
};
