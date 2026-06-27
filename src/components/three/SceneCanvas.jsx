import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

const CYAN = '#8cd6ff';
const LIME = '#d6f57a';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Infinite grid floor that scrolls forward ── */
function GridFloor() {
  const grid = useMemo(() => {
    const g = new THREE.GridHelper(
      100, 50,
      new THREE.Color(0x8cd6ff).multiplyScalar(0.2),
      new THREE.Color(0x8cd6ff).multiplyScalar(0.07)
    );
    return g;
  }, []);

  useFrame((state) => {
    grid.position.z = (state.clock.elapsedTime * 0.28) % 2;
  });

  return <primitive object={grid} position={[0, -5.5, -12]} />;
}

/* ── Multi-color particle cloud ── */
function ParticleField({ count = 1800 }) {
  const ref = useRef();
  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const cC = new THREE.Color(CYAN);
    const lC = new THREE.Color(LIME);
    const wC = new THREE.Color(0xffffff);
    const radius = 18;
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = radius * Math.cbrt(Math.random());
      pos[i * 3]     = r * Math.sin(phi) * Math.cos(theta);
      pos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pos[i * 3 + 2] = r * Math.cos(phi);
      const t = Math.random();
      const c = t < 0.58 ? cC : t < 0.84 ? lC : wC;
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.y += dt * 0.013;
    ref.current.rotation.x += dt * 0.005;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.72}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Central wireframe sphere with animated orbital rings ── */
function CoreSphere() {
  const innerRef = useRef();
  const ring1Ref = useRef();
  const ring2Ref = useRef();

  useFrame((_, dt) => {
    if (innerRef.current) {
      innerRef.current.rotation.y += dt * 0.07;
      innerRef.current.rotation.x += dt * 0.03;
    }
    if (ring1Ref.current) ring1Ref.current.rotation.z += dt * 0.11;
    if (ring2Ref.current) ring2Ref.current.rotation.x += dt * 0.085;
  });

  return (
    <Float speed={0.3} rotationIntensity={0.07} floatIntensity={0.22}>
      <group position={[0.5, 0.2, -13]}>
        <mesh ref={innerRef}>
          <sphereGeometry args={[2.4, 14, 10]} />
          <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.1} />
        </mesh>
        <mesh ref={ring1Ref} rotation={[Math.PI / 3.2, 0, 0]}>
          <torusGeometry args={[3.5, 0.018, 8, 80]} />
          <meshBasicMaterial color={CYAN} transparent opacity={0.32} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh ref={ring2Ref} rotation={[0, Math.PI / 4, Math.PI / 3]}>
          <torusGeometry args={[3.0, 0.013, 8, 64]} />
          <meshBasicMaterial color={LIME} transparent opacity={0.22} blending={THREE.AdditiveBlending} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[2.6, 0.01, 8, 64]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.08} blending={THREE.AdditiveBlending} />
        </mesh>
      </group>
    </Float>
  );
}

/* ── Wireframe geometry with optional orbital ring ── */
function WireShape({ geometry, position, rotation, color, speed = 0.2, orbit = false }) {
  const meshRef = useRef();
  const orbitRef = useRef();

  useFrame((_, dt) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += dt * speed * 0.4;
      meshRef.current.rotation.y += dt * speed * 0.6;
    }
    if (orbitRef.current) orbitRef.current.rotation.z += dt * speed * 0.9;
  });

  return (
    <Float speed={1.05} rotationIntensity={0.38} floatIntensity={0.88}>
      <group position={position} rotation={rotation}>
        <mesh ref={meshRef}>
          {geometry}
          <meshBasicMaterial color={color} wireframe transparent opacity={0.22} />
        </mesh>
        {orbit && (
          <mesh ref={orbitRef} rotation={[Math.PI / 5, 0, 0]}>
            <torusGeometry args={[2.5, 0.016, 8, 64]} />
            <meshBasicMaterial color={color} transparent opacity={0.26} blending={THREE.AdditiveBlending} />
          </mesh>
        )}
      </group>
    </Float>
  );
}

/* ── Floating glass "UI panels" ── */
function FloatingPanel({ position, rotation, scale = 1, accent = CYAN, variant = 0 }) {
  const groupRef = useRef();
  const w = 2.8, h = 1.88;

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    groupRef.current.children.forEach((child, i) => {
      if (child.material && i > 3) {
        child.material.opacity = 0.14 + Math.sin(t * 0.65 + i * 1.15) * 0.07;
      }
    });
  });

  const lines = variant === 0
    ? [[0.4, w - 0.38], [0.18, w - 0.72], [-0.05, w - 0.52], [-0.28, w - 0.88], [-0.54, w - 0.32]]
    : [[0.36, 1.55], [0.1, 0.92], [-0.18, 1.98], [-0.44, 1.28]];

  return (
    <Float speed={0.82} rotationIntensity={0.22} floatIntensity={0.98}>
      <group ref={groupRef} position={position} rotation={rotation} scale={scale}>
        {/* Panel body */}
        <mesh>
          <planeGeometry args={[w, h]} />
          <meshBasicMaterial color="#030e1c" transparent opacity={0.44} side={THREE.DoubleSide} />
        </mesh>
        {/* Frame border */}
        <lineSegments>
          <edgesGeometry args={[new THREE.PlaneGeometry(w, h)]} />
          <lineBasicMaterial color={accent} transparent opacity={0.55} />
        </lineSegments>
        {/* Title bar background */}
        <mesh position={[0, h / 2 - 0.14, 0.01]}>
          <planeGeometry args={[w, 0.27]} />
          <meshBasicMaterial color={accent} transparent opacity={0.17} side={THREE.DoubleSide} />
        </mesh>
        {/* Traffic light dots */}
        {[-1.2, -1.03, -0.86].map((x, i) => (
          <mesh key={i} position={[x, h / 2 - 0.14, 0.02]}>
            <circleGeometry args={[0.042, 16]} />
            <meshBasicMaterial color={accent} transparent opacity={0.88} />
          </mesh>
        ))}
        {/* Content lines */}
        {lines.map(([y, lineW], i) => (
          <mesh key={i} position={[0, y, 0.02]}>
            <planeGeometry args={[lineW, 0.044]} />
            <meshBasicMaterial color={accent} transparent opacity={0.17} side={THREE.DoubleSide} />
          </mesh>
        ))}
      </group>
    </Float>
  );
}

/* ── Camera parallax driven by pointer & scroll ── */
function Rig() {
  const scrollRef = useRef(0);
  useFrame((state, dt) => {
    if (typeof window !== 'undefined') {
      const max = document.body.scrollHeight - window.innerHeight;
      scrollRef.current = max > 0 ? window.scrollY / max : 0;
    }
    const px = prefersReducedMotion ? 0 : state.pointer.x;
    const py = prefersReducedMotion ? 0 : state.pointer.y;
    const targetX = px * 1.35;
    const targetY = py * 0.85 + scrollRef.current * 2.0;
    const targetZ = 9.5 - scrollRef.current * 2.8;
    const damp = 1 - Math.pow(0.001, dt);
    state.camera.position.x += (targetX - state.camera.position.x) * damp;
    state.camera.position.y += (targetY - state.camera.position.y) * damp;
    state.camera.position.z += (targetZ - state.camera.position.z) * damp;
    state.camera.lookAt(0, scrollRef.current * 1.35, 0);
  });
  return null;
}

function Scene() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const count = prefersReducedMotion ? 500 : isMobile ? 600 : 1800;
  return (
    <>
      <Stars
        radius={90}
        depth={55}
        count={prefersReducedMotion ? 250 : 900}
        factor={4.5}
        saturation={0}
        fade
      />
      <ambientLight intensity={0.32} />
      <pointLight position={[10, 8, 6]} intensity={55} color={CYAN} />
      <pointLight position={[-10, -6, 4]} intensity={34} color={LIME} />
      <pointLight position={[0, 14, 2]} intensity={24} color="#b0d0ff" />
      <pointLight position={[6, -2, 8]} intensity={18} color={LIME} />

      <ParticleField count={count} />
      <CoreSphere />
      <GridFloor />

      <WireShape geometry={<icosahedronGeometry args={[1.7, 0]} />}  position={[-5.5, 1.5, -3]}   rotation={[0.4, 0.2, 0]}   color={CYAN} speed={0.22} orbit />
      <WireShape geometry={<torusKnotGeometry args={[1, 0.3, 80, 8]} />} position={[5.5, -1.8, -4]} rotation={[1, 0.4, 0]}    color={LIME} speed={0.16} />
      <WireShape geometry={<octahedronGeometry args={[1.8, 0]} />}   position={[3, 3.4, -6]}      rotation={[0.2, 0.6, 0]}   color={CYAN} speed={0.28} orbit />
      <WireShape geometry={<dodecahedronGeometry args={[1.4, 0]} />} position={[-6.5, -2.6, -5]}  rotation={[0.3, 0, 0.4]}   color={LIME} speed={0.2} />
      <WireShape geometry={<boxGeometry args={[2, 2, 2, 3, 3, 3]} />} position={[0, -4.5, -8]}   rotation={[0.3, 0.3, 0]}   color={CYAN} speed={0.13} />
      <WireShape geometry={<tetrahedronGeometry args={[1.6, 0]} />}  position={[-2, 4.2, -9]}     rotation={[0.1, 0.5, 0.2]} color={LIME} speed={0.18} />
      <WireShape geometry={<icosahedronGeometry args={[1.2, 1]} />}  position={[7, 2.8, -7]}      rotation={[0.2, 0.1, 0.4]} color={CYAN} speed={0.14} />

      <FloatingPanel position={[-3.4, 0.4, 0.5]}  rotation={[0, 0.5, 0]}       scale={0.95} accent={CYAN} variant={0} />
      <FloatingPanel position={[3.6, 1.4, -1]}    rotation={[0, -0.5, 0.05]}   scale={0.8}  accent={LIME} variant={1} />
      <FloatingPanel position={[2.6, -2.4, 0]}    rotation={[0.05, -0.35, 0]}  scale={0.7}  accent={CYAN} variant={0} />
      <FloatingPanel position={[-4.2, -1.8, -2]}  rotation={[-0.1, 0.4, 0.05]} scale={0.62} accent={LIME} variant={1} />

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
    style={{ opacity: 0.92 }}
  >
    <Canvas
      dpr={isMobile ? [1, 1.5] : [1, 2]}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 9.5], fov: 52 }}
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
