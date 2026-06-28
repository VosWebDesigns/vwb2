import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

const GOLD   = '#c9a96e';
const VIOLET = '#8a5cf6';
const CREAM  = '#f0ebe3';

/**
 * Reusable floating particle field.
 *
 * Props:
 *   count        — number of particles (default 800)
 *   radius       — bounding sphere radius (default 18)
 *   goldRatio    — 0-1 fraction of gold particles (default 0.55)
 *   violetRatio  — 0-1 fraction of violet particles (rest are cream)
 *   rotateSpeed  — Y-axis rotation speed (default 0.008)
 *   sizeBase     — base point size (default 0.05)
 *   opacity      — overall opacity (default 0.6)
 *   modelUrl     — optional GLTF path to use as spawn volume instead of sphere
 */
const ParticleField = ({
  count       = 800,
  radius      = 18,
  goldRatio   = 0.55,
  violetRatio = 0.25,
  rotateSpeed = 0.008,
  sizeBase    = 0.05,
  opacity     = 0.6,
  // modelUrl not used for particles — kept for API consistency
}) => {
  const ref = useRef();

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const gC  = new THREE.Color(GOLD);
    const vC  = new THREE.Color(VIOLET);
    const wC  = new THREE.Color(CREAM);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(Math.random() * 2 - 1);
      const dist  = radius * Math.cbrt(Math.random());
      pos[i * 3]     = dist * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = dist * Math.cos(phi);
      const t = Math.random();
      const c = t < goldRatio ? gC : t < goldRatio + violetRatio ? vC : wC;
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, [count, radius, goldRatio, violetRatio]);

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * rotateSpeed;
    ref.current.rotation.x += dt * rotateSpeed * 0.45;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color"    count={count} array={colors}    itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={sizeBase}
        sizeAttenuation
        vertexColors
        transparent
        opacity={opacity}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

export default ParticleField;
