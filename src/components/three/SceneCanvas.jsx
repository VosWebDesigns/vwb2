import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Float } from '@react-three/drei';
import * as THREE from 'three';

const CYAN = '#8cd6ff';
const LIME = '#d6f57a';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Abstract particle field ── */
function ParticleField({ count = 1600 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    const radius = 16;
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = radius * Math.cbrt(Math.random());
      arr[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      arr[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      arr[i * 3 + 2] = r * Math.cos(phi);
    }
    return arr;
  }, [count]);

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.015;
    ref.current.rotation.x += dt * 0.006;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        sizeAttenuation
        color={CYAN}
        transparent
        opacity={0.6}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Glowing wireframe sculptures ── */
function WireShape({ geometry, position, rotation, color, speed = 0.2 }) {
  const ref = useRef();
  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.x += dt * speed * 0.4;
    ref.current.rotation.y += dt * speed * 0.6;
  });
  return (
    <Float speed={1.1} rotationIntensity={0.4} floatIntensity={0.9}>
      <mesh ref={ref} position={position} rotation={rotation}>
        {geometry}
        <meshBasicMaterial color={color} wireframe transparent opacity={0.16} />
      </mesh>
    </Float>
  );
}

/* ── Floating glass "browser windows" ── */
function FloatingWindow({ position, rotation, scale = 1, accent = CYAN }) {
  return (
    <Float speed={0.9} rotationIntensity={0.25} floatIntensity={1.1}>
      <group position={position} rotation={rotation} scale={scale}>
        {/* panel */}
        <mesh>
          <planeGeometry args={[2.6, 1.7]} />
          <meshBasicMaterial color="#0b1a2e" transparent opacity={0.35} side={THREE.DoubleSide} />
        </mesh>
        {/* frame */}
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(2.6, 1.7)]} />
          <lineBasicMaterial color={accent} transparent opacity={0.5} />
        </lineSegments>
        {/* title bar */}
        <mesh position={[0, 0.72, 0.01]}>
          <planeGeometry args={[2.6, 0.26]} />
          <meshBasicMaterial color={accent} transparent opacity={0.18} side={THREE.DoubleSide} />
        </mesh>
        {/* window dots */}
        {[-1.12, -0.98, -0.84].map((x, i) => (
          <mesh key={i} position={[x, 0.72, 0.02]}>
            <circleGeometry args={[0.035, 16]} />
            <meshBasicMaterial color={accent} transparent opacity={0.8} />
          </mesh>
        ))}
        {/* content lines */}
        {[0.3, 0.1, -0.1, -0.35].map((y, i) => (
          <mesh key={i} position={[-0.3 - i * 0.06, y, 0.02]}>
            <planeGeometry args={[1.7 - i * 0.3, 0.045]} />
            <meshBasicMaterial color={accent} transparent opacity={0.22} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

/* ── Camera parallax driven by pointer + scroll ── */
function Rig() {
  const scrollRef = useRef(0);
  useFrame((state, dt) => {
    if (typeof window !== 'undefined') {
      const max = document.body.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? window.scrollY / max : 0;
    }
    const px = prefersReducedMotion ? 0 : state.pointer.x;
    const py = prefersReducedMotion ? 0 : state.pointer.y;
    const targetX = px * 1.1;
    const targetY = py * 0.7 + scrollRef.current * 1.6;
    const targetZ = 9 - scrollRef.current * 2.2;
    const damp = 1 - Math.pow(0.0015, dt);
    state.camera.position.x += (targetX - state.camera.position.x) * damp;
    state.camera.position.y += (targetY - state.camera.position.y) * damp;
    state.camera.position.z += (targetZ - state.camera.position.z) * damp;
    state.camera.lookAt(0, scrollRef.current * 1.2, 0);
  });
  return null;
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 8, 6]} intensity={40} color={CYAN} />
      <pointLight position={[-10, -6, 4]} intensity={26} color={LIME} />

      <ParticleField count={prefersReducedMotion ? 700 : 1600} />

      <WireShape geometry={<icosahedronGeometry args={[1.6, 0]} />} position={[-5.5, 1.5, -3]} rotation={[0.4, 0.2, 0]} color={CYAN} speed={0.25} />
      <WireShape geometry={<torusKnotGeometry args={[1, 0.3, 80, 8]} />} position={[5.5, -1.8, -4]} rotation={[1, 0.4, 0]} color={LIME} speed={0.18} />
      <WireShape geometry={<octahedronGeometry args={[1.7, 0]} />} position={[3, 3.4, -6]} rotation={[0.2, 0.6, 0]} color={CYAN} speed={0.3} />
      <WireShape geometry={<dodecahedronGeometry args={[1.3, 0]} />} position={[-6.5, -2.6, -5]} rotation={[0.3, 0, 0.4]} color={LIME} speed={0.22} />
      <WireShape geometry={<boxGeometry args={[2, 2, 2, 3, 3, 3]} />} position={[0, -3.6, -7]} rotation={[0.3, 0.3, 0]} color={CYAN} speed={0.15} />

      <FloatingWindow position={[-3.4, 0.4, 0.5]} rotation={[0, 0.5, 0]} scale={0.95} accent={CYAN} />
      <FloatingWindow position={[3.6, 1.4, -1]} rotation={[0, -0.5, 0.05]} scale={0.8} accent={LIME} />
      <FloatingWindow position={[2.6, -2.4, 0]} rotation={[0.05, -0.35, 0]} scale={0.7} accent={CYAN} />

      <Rig />
    </>
  );
}

const SceneCanvas = () => (
  <div
    className="pointer-events-none fixed inset-0 z-0"
    aria-hidden="true"
    style={{ opacity: 0.85 }}
  >
    <Canvas
      dpr={[1, 1.8]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 9], fov: 55 }}
      frameloop={prefersReducedMotion ? 'demand' : 'always'}
    >
      <Suspense fallback={null}>
        <Scene />
      </Suspense>
    </Canvas>
  </div>
);

export default SceneCanvas;
