import React, { useRef, useEffect, Suspense, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ArrowRight } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const GOLD   = '#c9a96e';
const VIOLET = '#8a5cf6';
const CREAM  = '#f0ebe3';

const RING_COUNT   = 28;
const RING_SPACING = 5;
const TUNNEL_DEPTH = RING_COUNT * RING_SPACING; // total Z distance

// Bridge object for GSAP → R3F communication (module-scoped, one instance on page).
const bridge = { progress: 0 };

/* ── Tunnel geometry ── */
function TunnelRings() {
  const rings = useMemo(() =>
    Array.from({ length: RING_COUNT }).map((_, i) => ({
      z:       -(i * RING_SPACING),
      radius:  3.2 + Math.sin(i * 0.55) * 0.9,
      rotZ:    i * 0.07,
      isGold:  i % 3 !== 1,
      opacity: 0.06 + (i / RING_COUNT) * 0.18,
      tubeR:   i % 5 === 0 ? 0.025 : 0.012,
    })), []
  );

  return (
    <group>
      {rings.map((r, i) => (
        <mesh key={i} position={[0, 0, r.z]} rotation={[0, 0, r.rotZ]}>
          <torusGeometry args={[r.radius, r.tubeR, 6, 90]} />
          <meshBasicMaterial
            color={r.isGold ? GOLD : VIOLET}
            transparent
            opacity={r.opacity}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}

      {/* Cross-accent rings for depth perspective */}
      {Array.from({ length: 8 }).map((_, i) => (
        <mesh key={`cross-${i}`} position={[0, 0, -(i * 14 + 7)]} rotation={[Math.PI / 2, 0, i * 0.4]}>
          <torusGeometry args={[1.6, 0.006, 4, 30]} />
          <meshBasicMaterial
            color={VIOLET}
            transparent
            opacity={0.06}
            blending={THREE.AdditiveBlending}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
}

/* ── Particle stream inside tunnel ── */
function TunnelParticles({ count = 300 }) {
  const ref = useRef();
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const r = 1.5 + Math.random() * 2;
      arr[i * 3]     = Math.cos(angle) * r;
      arr[i * 3 + 1] = Math.sin(angle) * r;
      arr[i * 3 + 2] = -(Math.random() * TUNNEL_DEPTH);
    }
    return arr;
  }, [count]);

  useFrame((_, dt) => {
    if (!ref.current) return;
    ref.current.rotation.z += dt * 0.04;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        color={GOLD}
        size={0.04}
        sizeAttenuation
        transparent
        opacity={0.45}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/* ── Lights ── */
function TunnelLights() {
  return (
    <>
      <ambientLight intensity={0.1} />
      <pointLight position={[0, 0, -TUNNEL_DEPTH * 0.3]} intensity={120} color={GOLD}   decay={2} />
      <pointLight position={[4, 2, -TUNNEL_DEPTH * 0.6]} intensity={60}  color={VIOLET} decay={2} />
      <pointLight position={[0, 0, -10]}                 intensity={30}  color={CREAM}  decay={2} />
    </>
  );
}

/* ── Camera rig driven by bridge.progress ── */
function ScrollRig() {
  useFrame(({ camera }) => {
    const p    = bridge.progress;
    const ease = p; // already eased by GSAP scrub

    // Fly from z=10 to z=-(TUNNEL_DEPTH-10)
    const targetZ = 10 - ease * (TUNNEL_DEPTH - 12);
    // Slight sinusoidal drift
    const targetX = Math.sin(ease * Math.PI * 2.5) * 0.9;
    const targetY = Math.cos(ease * Math.PI * 1.8) * 0.55;

    camera.position.z += (targetZ - camera.position.z) * 0.12;
    camera.position.x += (targetX - camera.position.x) * 0.12;
    camera.position.y += (targetY - camera.position.y) * 0.12;
    camera.lookAt(camera.position.x * 0.15, camera.position.y * 0.15, camera.position.z - 18);
  });
  return null;
}

/* ── Main section component ── */
const ScrollCamera3D = ({ modelUrl }) => {
  const sectionRef = useRef(null);
  const phase1Ref  = useRef(null);
  const phase2Ref  = useRef(null);
  const phase3Ref  = useRef(null);
  const canvasRef  = useRef(null);

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    bridge.progress = 0;

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start:   'top top',
          end:     '+=280%',
          pin:     true,
          scrub:   1.4,
          anticipatePin: 1,
        },
      });

      // Camera flies through tunnel
      tl.to(bridge, { progress: 1, ease: 'none', duration: 3 }, 0);

      // Phase 1 text — enters at 5%, exits at 38%
      tl.fromTo(phase1Ref.current,
        { opacity: 0, y: 28, clipPath: 'inset(0 0 100% 0)' },
        { opacity: 1, y: 0,  clipPath: 'inset(0 0 0% 0)', ease: 'power3.out', duration: 0.25 }, 0.05
      );
      tl.fromTo(phase1Ref.current,
        { opacity: 1, y: 0  },
        { opacity: 0, y: -28, duration: 0.2 }, 0.35
      );

      // Phase 2 text — enters at 45%, exits at 72%
      tl.fromTo(phase2Ref.current,
        { opacity: 0, y: 28 },
        { opacity: 1, y: 0,  ease: 'power3.out', duration: 0.25 }, 0.48
      );
      tl.fromTo(phase2Ref.current,
        { opacity: 1, y: 0  },
        { opacity: 0, y: -28, duration: 0.2 }, 0.72
      );

      // Phase 3 CTA — enters at 78%, stays
      tl.fromTo(phase3Ref.current,
        { opacity: 0, y: 20, scale: 0.96 },
        { opacity: 1, y: 0,  scale: 1, ease: 'power3.out', duration: 0.28 }, 0.80
      );

      // Canvas fades out near end (reveal the next section)
      tl.fromTo(canvasRef.current,
        { opacity: 0.95 },
        { opacity: 0.3, duration: 0.4 }, 2.6
      );
    });

    return () => ctx.revert();
  }, []);

  const textPhaseStyle = { position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', opacity: 0, willChange: 'opacity, transform' };

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
      style={{ background: 'var(--bg)' }}
      aria-label="Technologie showcase sectie"
    >
      {/* 3D Canvas */}
      <div ref={canvasRef} className="absolute inset-0" aria-hidden="true">
        {!isMobile ? (
          <Canvas
            dpr={[1, 1.5]}
            gl={{ alpha: true, antialias: false, powerPreference: 'high-performance', toneMapping: THREE.ACESFilmicToneMapping }}
            camera={{ position: [0, 0, 10], fov: 55 }}
            frameloop="always"
          >
            <Suspense fallback={null}>
              <TunnelLights />
              <TunnelRings />
              <TunnelParticles count={250} />
              <ScrollRig />
            </Suspense>
          </Canvas>
        ) : (
          /* Mobile: CSS-only gradient tunnel suggestion */
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(ellipse 60% 80% at 50% 50%, rgba(201,169,110,.06), transparent 70%),
                radial-gradient(ellipse 40% 60% at 50% 50%, rgba(138,92,246,.04), transparent 60%)
              `,
            }}
          />
        )}

        {/* Vignette overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'radial-gradient(ellipse 75% 75% at 50% 50%, transparent 30%, rgba(6,6,12,.7) 100%)' }}
        />
      </div>

      {/* Phase 1 — TECHNOLOGIE */}
      <div ref={phase1Ref} className="relative z-10 text-center px-5" style={textPhaseStyle}>
        <p className="section-eyebrow mb-5">Onze technologie-stack</p>
        <h2
          className="font-heading font-black uppercase leading-[.88]"
          style={{
            fontSize: 'clamp(3rem, 12vw, 12rem)',
            letterSpacing: '-.065em',
            color: 'var(--accent3)',
            textShadow: '0 0 120px rgba(201,169,110,.12)',
          }}
        >
          CUTTING
          <br />
          <em
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
              fontWeight: 600,
              color: 'var(--accent)',
              fontSize: '1.06em',
              letterSpacing: '-.025em',
            }}
          >
            edge
          </em>
        </h2>
      </div>

      {/* Phase 2 — tech stack names */}
      <div ref={phase2Ref} className="relative z-10 text-center px-5" style={textPhaseStyle}>
        <p className="section-eyebrow mb-5">Gebouwd met</p>
        <div
          className="font-mono font-black leading-tight"
          style={{ fontSize: 'clamp(1rem, 2.4vw, 2.2rem)', letterSpacing: '.1em', color: 'rgba(240,235,227,.35)' }}
        >
          {['Three.js', '·', 'GSAP', '·', 'Lenis', '·', 'React', '·', 'Supabase'].map((t, i) => (
            <span
              key={i}
              style={t !== '·' ? { color: 'var(--accent3)' } : { color: 'rgba(201,169,110,.3)' }}
            >
              {t}{' '}
            </span>
          ))}
        </div>
        <p
          className="mt-5 max-w-xl mx-auto text-sm md:text-base leading-8"
          style={{ color: 'rgba(240,235,227,.38)' }}
        >
          Realtime 3D, cinematische scroll-animaties, en sub-2s laadtijden — gebouwd voor indruk én voor conversie.
        </p>
      </div>

      {/* Phase 3 — CTA */}
      <div ref={phase3Ref} className="relative z-10 text-center px-5" style={textPhaseStyle}>
        <p className="section-eyebrow mb-5">Klaar om te bouwen?</p>
        <h2
          className="font-heading font-black uppercase leading-[.9]"
          style={{
            fontSize: 'clamp(2.5rem, 9vw, 9rem)',
            letterSpacing: '-.06em',
            color: 'var(--accent3)',
          }}
        >
          ZONDER
          <br />
          <em
            style={{
              fontFamily: '"Cormorant Garamond", serif',
              fontStyle: 'italic',
              fontWeight: 600,
              color: 'var(--accent)',
              fontSize: '1.06em',
              letterSpacing: '-.025em',
            }}
          >
            grenzen
          </em>
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <Link to="/contact" className="glow-button">
            Start een project <ArrowRight size={15} />
          </Link>
          <Link to="/diensten" className="ghost-button">
            Bekijk diensten
          </Link>
        </div>
      </div>

      {/* Bottom gradient fade to next section */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none z-20"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--bg))' }}
      />
    </section>
  );
};

export default ScrollCamera3D;
