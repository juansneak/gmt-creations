"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useLoader } from "@react-three/fiber";
import { STLLoader } from "three-stdlib";

function STLModel() {
  const geometry = useLoader(STLLoader, "/assets/eiffel_tower.stl");
  
  return (
    <mesh geometry={geometry} scale={0.1} position={[0, -1, 0]}>
      <meshStandardMaterial color="lightblue" />
    </mesh>
  );
}

export default function ThreeScene() {
  return (
    <div style={{ width: "100vw", height: "100vh", background: "black" }}>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} />
        <OrbitControls />
        <STLModel />
      </Canvas>
    </div>
  );
}
