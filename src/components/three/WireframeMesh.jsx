import React, { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float } from '@react-three/drei';
import * as THREE from 'three';

const GOLD   = '#c9a96e';
const VIOLET = '#8a5cf6';

/**
 * Reusable animated wireframe mesh.
 * Falls back to a procedural icosahedron when no modelUrl is provided.
 *
 * Props:
 *   modelUrl       — optional path to a .glb file (e.g. '/models/wireframe-abstract.glb')
 *   position       — THREE.Vector3-compatible array [x, y, z]
 *   rotation       — THREE.Euler-compatible array [x, y, z]
 *   scale          — number or [x, y, z]
 *   color          — hex string (default: gold)
 *   emissive       — hex string (default: same as color)
 *   emissiveIntensity — number (default: 0.4)
 *   opacity        — number 0-1 (default: 0.16)
 *   speed          — rotation speed multiplier (default: 0.2)
 *   floatIntensity — Float component float amount (default: 0.6)
 *   geometry       — JSX geometry element to use instead of icosahedron (e.g. <torusKnotGeometry />)
 */

function ProceduralMesh({ color, emissive, emissiveIntensity, opacity, speed, geometry }) {
  const meshRef = useRef();

  useFrame((_, dt) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.x += dt * speed * 0.35;
    meshRef.current.rotation.y += dt * speed * 0.55;
  });

  return (
    <mesh ref={meshRef}>
      {geometry || <icosahedronGeometry args={[1.6, 0]} />}
      <meshStandardMaterial
        color={color}
        emissive={emissive}
        emissiveIntensity={emissiveIntensity}
        wireframe
        transparent
        opacity={opacity}
      />
    </mesh>
  );
}

function GltfMesh({ url, color, emissive, emissiveIntensity, opacity, speed }) {
  const { scene } = useGLTF(url);
  const ref = useRef();

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * speed * 0.5;
  });

  // Override materials to match wireframe aesthetic
  scene.traverse((child) => {
    if (child.isMesh) {
      child.material = new THREE.MeshStandardMaterial({
        color,
        emissive,
        emissiveIntensity,
        wireframe: true,
        transparent: true,
        opacity,
      });
    }
  });

  return <primitive ref={ref} object={scene} />;
}

const WireframeMesh = ({
  modelUrl,
  position       = [0, 0, 0],
  rotation       = [0, 0, 0],
  scale          = 1,
  color          = GOLD,
  emissive,
  emissiveIntensity = 0.4,
  opacity        = 0.16,
  speed          = 0.2,
  floatIntensity = 0.6,
  geometry,
}) => {
  const resolvedEmissive = emissive ?? color;

  return (
    <Float speed={0.9} rotationIntensity={0.28} floatIntensity={floatIntensity}>
      <group position={position} rotation={rotation} scale={scale}>
        {modelUrl ? (
          <Suspense fallback={null}>
            <GltfMesh
              url={modelUrl}
              color={color}
              emissive={resolvedEmissive}
              emissiveIntensity={emissiveIntensity}
              opacity={opacity}
              speed={speed}
            />
          </Suspense>
        ) : (
          <ProceduralMesh
            color={color}
            emissive={resolvedEmissive}
            emissiveIntensity={emissiveIntensity}
            opacity={opacity}
            speed={speed}
            geometry={geometry}
          />
        )}
      </group>
    </Float>
  );
};

export default WireframeMesh;
