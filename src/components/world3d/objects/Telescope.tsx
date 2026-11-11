/** Kính thiên văn hướng lên bầu trời sao. */
export const Telescope = () => (
  <group>
    {[0, 1, 2].map((i) => {
      const a = (i * Math.PI * 2) / 3;
      return (
        <mesh key={i} position={[Math.cos(a) * 0.35, 0.6, Math.sin(a) * 0.35]} rotation={[Math.sin(a) * 0.35, 0, -Math.cos(a) * 0.35]} castShadow>
          <cylinderGeometry args={[0.03, 0.04, 1.3, 8]} />
          <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.3} />
        </mesh>
      );
    })}
    <group position={[0, 1.3, 0]} rotation={[0, 0, -0.9]}>
      <mesh castShadow>
        <cylinderGeometry args={[0.16, 0.2, 1.8, 24]} />
        <meshStandardMaterial color="#e2e8f0" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.91, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.02, 24]} />
        <meshBasicMaterial color={[0.6, 2, 3]} toneMapped={false} />
      </mesh>
      <mesh position={[0, -0.5, 0.18]} rotation-x={Math.PI / 2}>
        <cylinderGeometry args={[0.04, 0.04, 0.3, 12]} />
        <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.3} />
      </mesh>
    </group>
  </group>
);
