import { OrbitControls, Sphere, MeshDistortMaterial } from '@react-three/drei';

export function Scene3D() {
  return (
    <>
      <OrbitControls enableZoom={false} />
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <Sphere args={[1, 100, 200]}>
        <MeshDistortMaterial
          color="#4f46e5"
          attach="material"
          speed={1.5}
          distort={0.5}
        />
      </Sphere>
    </>
  );
}