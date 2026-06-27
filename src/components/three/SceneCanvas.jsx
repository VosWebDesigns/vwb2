import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars, MeshDistortMaterial, Sphere } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';

const GOLD   = '#ccff00';
const VIOLET = '#ff3f00';
const CREAM  = '#e8ffb3';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Morphing gold orb at center ── */
function GoldOrb() {
  const meshRef = useRef();

  useFrame((state) => {
    if (!meshRef.current) return;
    meshRef.current.rotation.z += 0.003;
    meshRef.current.rotation.y += 0.006;
  });

  return (
    <Float speed={0.4} rotationIntensity={0.08} floatIntensity={0.28}>
      <Sphere ref={meshRef} args={[2.2, 64, 64]} position={[0.5, 0.2, -14]}>
        <MeshDistortMaterial
          color={GOLD}
          emissive={GOLD}
          emissiveIntensity={0.12}
          distort={0.32}
          speed={1.8}
          roughness={0.28}
          metalness={0.85}
          transparent
          opacity={0.80}
        />
      </Sphere>
    </Float>
  );
}

/* ── Orbital rings around the orb ── */
function OrbitalRings() {
  const r1 = useRef();
  const r2 = useRef();
  const r3 = useRef();

  useFrame((_, dt) => {
    if (r1.current) r1.current.rotation.z += dt * 0.18;
    if (r2.current) r2.current.rotation.x += dt * 0.13;
    if (r3.current) r3.current.rotation.y += dt * 0.10;
  });

  return (
    <group position={[0.5, 0.2, -14]}>
      <mesh ref={r1} rotation={[Math.PI / 3.5, 0, 0]}>
        <torusGeometry args={[3.6, 0.018, 8, 120]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.28} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={r2} rotation={[0, Math.PI / 5, Math.PI / 4]}>
        <torusGeometry args={[4.4, 0.012, 8, 100]} />
        <meshBasicMaterial color={VIOLET} transparent opacity={0.18} blending={THREE.AdditiveBlending} />
      </mesh>
      <mesh ref={r3} rotation={[Math.PI / 2, 0.4, 0]}>
        <torusGeometry args={[2.8, 0.009, 8, 80]} />
        <meshBasicMaterial color={CREAM} transparent opacity={0.10} blending={THREE.AdditiveBlending} />
      </mesh>
    </group>
  );
}

/* ── Elegant particle field (gold + violet + cream) ── */
function ParticleField({ count = 1400 }) {
  const ref = useRef();

  const { positions, colors, sizes } = useMemo(() => {
    const pos  = new Float32Array(count * 3);
    const col  = new Float32Array(count * 3);
    const sz   = new Float32Array(count);
    const gC   = new THREE.Color(GOLD);
    const vC   = new THREE.Color(VIOLET);
    const wC   = new THREE.Color(CREAM);
    const r    = 20;

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(Math.random() * 2 - 1);
      const dist  = r * Math.cbrt(Math.random());
      pos[i * 3]     = dist * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = dist * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = dist * Math.cos(phi);
      const t = Math.random();
      const c = t < 0.55 ? gC : t < 0.80 ? vC : wC;
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
      sz[i] = Math.random() * 0.06 + 0.02;
    }
    return { positions: pos, colors: col, sizes: sz };
  }, [count]);

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.009;
    ref.current.rotation.x += dt * 0.004;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color"    count={count} array={colors}    itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.05}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.65}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Minimal grid floor (barely visible) ── */
function GridFloor() {
  const grid = useMemo(() => {
    return new THREE.GridHelper(
      100, 50,
      new THREE.Color(GOLD).multiplyScalar(0.15),
      new THREE.Color(GOLD).multiplyScalar(0.05)
    );
  }, []);

  useFrame((state) => {
    grid.position.z = (state.clock.elapsedTime * 0.22) % 2;
  });

  return <primitive object={grid} position={[0, -5.5, -12]} />;
}

/* ── Premium floating geometry ── */
function WireShape({ geometry, position, rotation, color = GOLD, emissive = GOLD, speed = 0.2, opacity = 0.16 }) {
  const meshRef = useRef();

  useFrame((_, dt) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += dt * speed * 0.35;
      meshRef.current.rotation.y += dt * speed * 0.55;
    }
  });

  return (
    <Float speed={0.9} rotationIntensity={0.28} floatIntensity={0.75}>
      <group position={position} rotation={rotation}>
        <mesh ref={meshRef}>
          {geometry}
          <meshStandardMaterial
            color={color}
            emissive={emissive}
            emissiveIntensity={0.4}
            wireframe
            transparent
            opacity={opacity}
          />
        </mesh>
      </group>
    </Float>
  );
}

/* ── Floating glass UI panels (more refined) ── */
function FloatingPanel({ position, rotation, scale = 1, variant = 0 }) {
  const groupRef = useRef();
  const accent   = variant === 0 ? GOLD : VIOLET;
  const w = 2.6, h = 1.75;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      if (child.material && i > 3) {
        child.material.opacity = 0.12 + Math.sin(t * 0.55 + i * 1.2) * 0.06;
      }
    });
  });

  const lines = variant === 0
    ? [[0.38, w - 0.4], [0.14, w - 0.75], [-0.08, w - 0.55], [-0.32, w - 0.9]]
    : [[0.32, 1.4], [0.06, 0.9], [-0.2, 1.85], [-0.46, 1.2]];

  return (
    <Float speed={0.7} rotationIntensity={0.18} floatIntensity={0.85}>
      <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
        <mesh>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial color="#04040a" transparent opacity={0.50} side={THREE.DoubleSide} />
        </mesh>
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(w, h)]} />
          <lineBasicMaterial color={accent} transparent opacity={0.42} />
        </lineSegments>
        <mesh position={[0, h / 2 - 0.13, 0.01]}>
          <planeGeometry args={[w, 0.25]} />
          <meshBasicMaterial color={accent} transparent opacity={0.14} side={THREE.DoubleSide} />
        </mesh>
        {[-1.1, -0.95, -0.80].map((x, i) => (
          <mesh key={i} position={[x, h / 2 - 0.13, 0.02]}>
            <circleGeometry args={[0.038, 16]} />
            <meshBasicMaterial color={accent} transparent opacity={0.80} />
          </mesh>
        ))}
        {lines.map(([y, lineW], i) => (
          <mesh key={i} position={[0, y, 0.02]}>
            <planeGeometry args={[lineW, 0.038]} />
            <meshBasicMaterial color={accent} transparent opacity={0.15} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

/* ── Camera parallax ── */
function Rig() {
  const scrollRef = useRef(0);

  useFrame((state, dt) => {
    if (typeof window !== 'undefined') {
      const max = document.body.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? window.scrollY / max : 0;
    }
    const px = prefersReducedMotion ? 0 : state.pointer.x;
    const py = prefersReducedMotion ? 0 : state.pointer.y;
    const targetX = px * 1.25;
    const targetY = py * 0.75 + scrollRef.current * 1.8;
    const targetZ = 9.5 - scrollRef.current * 2.5;
    const damp    = 1 - Math.pow(0.001, dt);
    state.camera.position.x += (targetX - state.camera.position.x) * damp;
    state.camera.position.y += (targetY - state.camera.position.y) * damp;
    state.camera.position.z += (targetZ - state.camera.position.z) * damp;
    state.camera.lookAt(0, scrollRef.current * 1.2, 0);
  });
  return null;
}

function Scene() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const count    = prefersReducedMotion ? 300 : isMobile ? 500 : 1400;

  return (
    <>
      <Stars radius={90} depth={55} count={prefersReducedMotion ? 200 : 700} factor={3.5} saturation={0} fade />

      {/* Lime key + signal red fill */}
      <ambientLight intensity={0.18} />
      <pointLight position={[8, 6, 6]}   intensity={55}  color={GOLD}   />
      <pointLight position={[-10, -5, 4]} intensity={30}  color={VIOLET} />
      <pointLight position={[0, 14, 2]}   intensity={18}  color="#f0ffe0" />
      <pointLight position={[4, -2, 10]}  intensity={12}  color={GOLD}   />

      <ParticleField count={count} />
      <GoldOrb />
      <OrbitalRings />
      <GridFloor />

      {/* Premium wireframe geometry */}
      <WireShape geometry={<icosahedronGeometry args={[1.7, 0]} />}  position={[-5.5, 1.5, -3]}   rotation={[0.4, 0.2, 0]}   color={GOLD}   emissive={GOLD}   speed={0.20} opacity={0.18} />
      <WireShape geometry={<torusKnotGeometry args={[1, 0.3, 90, 8]} />} position={[5.5, -1.8, -4]} rotation={[1, 0.4, 0]}  color={VIOLET} emissive={VIOLET} speed={0.14} opacity={0.14} />
      <WireShape geometry={<octahedronGeometry args={[1.8, 0]} />}   position={[3.2, 3.4, -6]}    rotation={[0.2, 0.6, 0]}   color={GOLD}   emissive={GOLD}   speed={0.26} opacity={0.16} />
      <WireShape geometry={<dodecahedronGeometry args={[1.4, 0]} />} position={[-6.5, -2.6, -5]}  rotation={[0.3, 0, 0.4]}   color={VIOLET} emissive={VIOLET} speed={0.18} opacity={0.12} />
      <WireShape geometry={<boxGeometry args={[2, 2, 2, 3, 3, 3]} />} position={[0, -4.5, -8]}   rotation={[0.3, 0.3, 0]}   color={GOLD}   emissive={GOLD}   speed={0.11} opacity={0.14} />
      <WireShape geometry={<tetrahedronGeometry args={[1.6, 0]} />}  position={[-2.2, 4.2, -9]}   rotation={[0.1, 0.5, 0.2]} color={VIOLET} emissive={VIOLET} speed={0.16} opacity={0.12} />

      {/* Floating UI panels */}
      <FloatingPanel position={[-3.4, 0.4, 0.5]}  rotation={[0, 0.5, 0]}       scale={0.9}  variant={0} />
      <FloatingPanel position={[3.6, 1.4, -1]}    rotation={[0, -0.5, 0.05]}   scale={0.76} variant={1} />
      <FloatingPanel position={[2.6, -2.4, 0]}    rotation={[0.05, -0.35, 0]}  scale={0.65} variant={0} />
      <FloatingPanel position={[-4.2, -1.8, -2]}  rotation={[-0.1, 0.4, 0.05]} scale={0.58} variant={1} />

      {/* Post-processing */}
      {!prefersReducedMotion && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.35}
            luminanceSmoothing={0.9}
            intensity={0.8}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.25} darkness={0.65} />
        </EffectComposer>
      )}

      <Rig />
    </>
  );
}

const SceneCanvas = () => {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  return (
    <div
      className="pointer-events-none fixed inset-0 z-0"
      aria-hidden="true"
      style={{ opacity: 0.90 }}
    >
      <Canvas
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping, toneMappingExposure: 1.2 }}
        camera={{ position: [0, 0, 9.5], fov: 50 }}
        frameloop={prefersReducedMotion ? 'demand' : 'always'}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default SceneCanvas;
