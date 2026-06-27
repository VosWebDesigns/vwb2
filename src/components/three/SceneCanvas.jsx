import React, { Suspense, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Stars } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, ChromaticAberration, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';

const GOLD   = '#c9a96e';
const VIOLET = '#8a5cf6';
const CREAM  = '#f0ebe3';
const DEEP   = '#0d0820';

const prefersReducedMotion =
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Data Lattice — neural network node-edge visualization ── */
function DataLattice({ count = 60 }) {
  const nodesRef   = useRef();
  const edgesRef   = useRef();
  const pulseRef   = useRef([]);
  const timeRef    = useRef(0);

  const { nodePositions, edgePositions, edgeColors } = useMemo(() => {
    const positions = [];
    const spread = 12;
    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi   = Math.acos(Math.random() * 2 - 1);
      const r     = spread * (0.3 + Math.random() * 0.7);
      positions.push([
        r * Math.sin(phi) * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta) * 0.6,
        r * Math.cos(phi) - 14,
      ]);
    }

    const maxEdgeDist = 6.5;
    const ep = [];
    const ec = [];
    const gC = new THREE.Color(GOLD);
    const vC = new THREE.Color(VIOLET);

    for (let i = 0; i < positions.length; i++) {
      for (let j = i + 1; j < positions.length; j++) {
        const dx = positions[i][0] - positions[j][0];
        const dy = positions[i][1] - positions[j][1];
        const dz = positions[i][2] - positions[j][2];
        const d  = Math.sqrt(dx * dx + dy * dy + dz * dz);
        if (d < maxEdgeDist) {
          ep.push(...positions[i], ...positions[j]);
          const c = Math.random() > 0.5 ? gC : vC;
          ec.push(c.r, c.g, c.b, c.r, c.g, c.b);
        }
      }
    }

    return {
      nodePositions: new Float32Array(positions.flat()),
      edgePositions:  new Float32Array(ep),
      edgeColors:     new Float32Array(ec),
    };
  }, [count]);

  useFrame((state, dt) => {
    if (prefersReducedMotion) return;
    timeRef.current += dt;
    const t = timeRef.current;
    if (nodesRef.current) {
      nodesRef.current.rotation.y += dt * 0.018;
      nodesRef.current.rotation.x = Math.sin(t * 0.12) * 0.06;
    }
    if (edgesRef.current) {
      edgesRef.current.rotation.y += dt * 0.018;
      edgesRef.current.rotation.x = Math.sin(t * 0.12) * 0.06;
      if (edgesRef.current.material) {
        edgesRef.current.material.opacity = 0.18 + Math.sin(t * 0.4) * 0.06;
      }
    }
  });

  return (
    <group>
      {/* Edge lines */}
      <lineSegments ref={edgesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={edgePositions.length / 3}
            array={edgePositions}
            itemSize={3}
          />
          <bufferAttribute
            attach="attributes-color"
            count={edgeColors.length / 3}
            array={edgeColors}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          vertexColors
          transparent
          opacity={0.20}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>

      {/* Node points */}
      <points ref={nodesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            count={nodePositions.length / 3}
            array={nodePositions}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          size={0.12}
          sizeAttenuation
          color={GOLD}
          transparent
          opacity={0.75}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
        />
      </points>
    </group>
  );
}

/* ── Abstract data stream — rising particle ribbon ── */
function DataStream({ count = 200 }) {
  const ref  = useRef();
  const time = useRef(0);

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const gC  = new THREE.Color(GOLD);
    const vC  = new THREE.Color(VIOLET);
    for (let i = 0; i < count; i++) {
      const t  = i / count;
      pos[i * 3]     = (Math.random() - 0.5) * 2.5 + 3;
      pos[i * 3 + 1] = -10 + t * 22;
      pos[i * 3 + 2] = -18;
      const c = Math.random() > 0.6 ? gC : vC;
      col[i * 3]     = c.r;
      col[i * 3 + 1] = c.g;
      col[i * 3 + 2] = c.b;
    }
    return { positions: pos, colors: col };
  }, [count]);

  const posRef = useRef(positions.slice());

  useFrame((_, dt) => {
    if (prefersReducedMotion || !ref.current) return;
    time.current += dt;
    const attr = ref.current.geometry.attributes.position;
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const y = posRef.current[i * 3 + 1] + dt * (1.2 + t * 0.4);
      if (y > 12) posRef.current[i * 3 + 1] = -10;
      else        posRef.current[i * 3 + 1] = y;
      posRef.current[i * 3] = (Math.random() - 0.5) * 0.008 + posRef.current[i * 3];
      attr.array[i * 3]     = posRef.current[i * 3];
      attr.array[i * 3 + 1] = posRef.current[i * 3 + 1];
    }
    attr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={count}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.06}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Glowing hex grid floor ── */
function HexGrid() {
  const ref    = useRef();
  const pulseT = useRef(0);

  useFrame((_, dt) => {
    if (!ref.current || prefersReducedMotion) return;
    pulseT.current += dt;
    ref.current.position.z = ((pulseT.current * 0.18) % 2);
    if (ref.current.material) {
      ref.current.material.opacity = 0.08 + Math.sin(pulseT.current * 0.6) * 0.03;
    }
  });

  const grid = useMemo(() => {
    const g = new THREE.GridHelper(
      120, 60,
      new THREE.Color(GOLD).multiplyScalar(0.22),
      new THREE.Color(GOLD).multiplyScalar(0.07)
    );
    g.material.transparent = true;
    g.material.opacity = 0.10;
    g.material.blending = THREE.AdditiveBlending;
    g.material.depthWrite = false;
    return g;
  }, []);

  return <primitive ref={ref} object={grid} position={[0, -6, -12]} />;
}

/* ── Premium particle field ── */
function ParticleField({ count = 1400 }) {
  const ref = useRef();

  const { positions, colors } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const gC  = new THREE.Color(GOLD);
    const vC  = new THREE.Color(VIOLET);
    const wC  = new THREE.Color(CREAM);
    const r   = 24;

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
    }
    return { positions: pos, colors: col };
  }, [count]);

  useFrame((_, dt) => {
    if (!ref.current || prefersReducedMotion) return;
    ref.current.rotation.y += dt * 0.007;
    ref.current.rotation.x += dt * 0.003;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color"    count={count} array={colors}    itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        size={0.045}
        sizeAttenuation
        vertexColors
        transparent
        opacity={0.55}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Glowing wireframe geometry ── */
function WireShape({ geometry, position, rotation = [0,0,0], color = GOLD, speed = 0.2, opacity = 0.16 }) {
  const meshRef = useRef();

  useFrame((_, dt) => {
    if (meshRef.current && !prefersReducedMotion) {
      meshRef.current.rotation.x += dt * speed * 0.35;
      meshRef.current.rotation.y += dt * speed * 0.55;
    }
  });

  return (
    <Float speed={0.9} rotationIntensity={0.22} floatIntensity={0.7}>
      <group position={position} rotation={rotation}>
        <mesh ref={meshRef}>
          {geometry}
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.55}
            wireframe
            transparent
            opacity={opacity}
          />
        </mesh>
      </group>
    </Float>
  );
}

/* ── Camera rig with scroll parallax ── */
function Rig() {
  const scrollNorm = useRef(0);

  useFrame((state, dt) => {
    if (typeof window !== 'undefined') {
      const max = document.body.scrollHeight - window.innerHeight;
      scrollNorm.current = max > 0 ? window.scrollY / max : 0;
    }
    const s  = scrollNorm.current;
    const px = prefersReducedMotion ? 0 : state.pointer.x;
    const py = prefersReducedMotion ? 0 : state.pointer.y;

    const targetX = px * 1.4;
    const targetY = py * 0.8 + s * 1.6;
    const targetZ = 9.5 - s * 3.2;

    const damp = 1 - Math.pow(0.001, dt);
    state.camera.position.x += (targetX - state.camera.position.x) * damp;
    state.camera.position.y += (targetY - state.camera.position.y) * damp;
    state.camera.position.z += (targetZ - state.camera.position.z) * damp;
    state.camera.lookAt(0, s * 1.0, 0);
  });

  return null;
}

/* ── Full scene ── */
function Scene() {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const count    = prefersReducedMotion ? 200 : isMobile ? 400 : 1400;

  return (
    <>
      <Stars radius={100} depth={60} count={prefersReducedMotion ? 150 : 600} factor={3.2} saturation={0} fade />

      <ambientLight intensity={0.18} />
      <pointLight position={[10, 8, 6]}   intensity={80}  color={GOLD}   />
      <pointLight position={[-12, -6, 4]} intensity={45}  color={VIOLET} />
      <pointLight position={[0, 16, 2]}   intensity={25}  color="#fff8f0" />
      <pointLight position={[5, -3, 12]}  intensity={18}  color={GOLD}   />
      <pointLight position={[-5, 8, -8]}  intensity={20}  color={VIOLET} />

      <ParticleField count={count} />
      <DataLattice count={isMobile ? 30 : 55} />
      <DataStream count={isMobile ? 80 : 180} />
      <HexGrid />

      <WireShape
        geometry={<icosahedronGeometry args={[1.8, 0]} />}
        position={[-5.5, 1.8, -3]}
        rotation={[0.4, 0.2, 0]}
        color={GOLD}
        speed={0.20}
        opacity={0.20}
      />
      <WireShape
        geometry={<torusKnotGeometry args={[1.1, 0.32, 96, 8]} />}
        position={[5.8, -1.6, -4]}
        rotation={[1, 0.4, 0]}
        color={VIOLET}
        speed={0.13}
        opacity={0.15}
      />
      <WireShape
        geometry={<octahedronGeometry args={[1.9, 0]} />}
        position={[3.4, 3.6, -6]}
        rotation={[0.2, 0.6, 0]}
        color={GOLD}
        speed={0.24}
        opacity={0.18}
      />
      <WireShape
        geometry={<dodecahedronGeometry args={[1.5, 0]} />}
        position={[-6.2, -2.8, -5]}
        rotation={[0.3, 0, 0.4]}
        color={VIOLET}
        speed={0.17}
        opacity={0.13}
      />
      <WireShape
        geometry={<torusGeometry args={[2, 0.04, 8, 80]} />}
        position={[1, 5, -10]}
        rotation={[Math.PI / 3, 0.3, 0]}
        color={GOLD}
        speed={0.09}
        opacity={0.14}
      />
      <WireShape
        geometry={<tetrahedronGeometry args={[1.7, 0]} />}
        position={[-2.4, 4.4, -9]}
        rotation={[0.1, 0.5, 0.2]}
        color={VIOLET}
        speed={0.15}
        opacity={0.13}
      />

      {!prefersReducedMotion && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.28}
            luminanceSmoothing={0.85}
            intensity={1.4}
            mipmapBlur
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={[0.0008, 0.0006]}
          />
          <Noise
            opacity={0.032}
            blendFunction={BlendFunction.ADD}
          />
          <Vignette eskil={false} offset={0.22} darkness={0.72} />
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
      style={{ opacity: 0.92 }}
    >
      <Canvas
        dpr={isMobile ? [1, 1.5] : [1, 2]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: 'high-performance',
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.3,
        }}
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
