import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';

const tags = ['content map', 'conversion seam', 'responsive span', 'cms layer'];

const BlueprintCanvas = () => {
  const x = useMotionValue(50);
  const y = useMotionValue(50);
  const smoothX = useSpring(x, { stiffness: 80, damping: 22 });
  const smoothY = useSpring(y, { stiffness: 80, damping: 22 });
  const [coords, setCoords] = useState({ x: 50, y: 50 });

  useEffect(() => {
    const move = event => {
      const next = { x: event.clientX, y: event.clientY };
      setCoords(next);
      x.set(next.x);
      y.set(next.y);
    };
    window.addEventListener('pointermove', move);
    return () => window.removeEventListener('pointermove', move);
  }, [x, y]);

  return (
    <section className="blueprint-grid relative isolate min-h-[92svh] overflow-hidden px-5 pb-16 pt-28 md:px-10 lg:pl-28">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 opacity-50"
        style={{
          background: `radial-gradient(420px circle at ${coords.x}px ${coords.y}px, rgba(87, 196, 255, .18), transparent 45%)`,
        }}
      />
      <div className="relative z-10 mx-auto grid max-w-[1500px] gap-10 lg:grid-cols-[1.05fr_.95fr] lg:items-end">
        <div className="relative min-h-[62vh] border-l border-t border-[color:var(--grid)] pl-5 pt-8 md:pl-10">
          <div className="blueprint-label -left-3 -top-3">sheet 00 / atelier</div>
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mono text-sm uppercase tracking-[.35em] text-[color:var(--accent)]">
            The Blueprint Atelier
          </motion.p>
          <motion.h1 initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .08 }} className="mt-5 max-w-5xl text-[clamp(4rem,13vw,13rem)] font-black uppercase leading-[.76] tracking-[-.09em] text-[color:var(--ink)]">
            Sites met constructie.
          </motion.h1>
          <p className="mt-8 max-w-xl text-lg leading-8 text-slate-300 md:ml-[18%]">
            Wij ontwerpen digitale gebouwen: inhoud als fundering, interface als routing, Supabase als machinekamer. Geen template-flow, maar een getekend systeem dat bezoekers door uw verhaal stuurt.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3 md:ml-[18%]">
            <Link to="/portfolio" className="blueprint-button">Open case index</Link>
            <Link to="/contact" className="blueprint-link">Start een build →</Link>
          </div>
        </div>

        <motion.div className="relative h-[520px] overflow-hidden rounded-[2rem] border border-[color:var(--grid)] bg-[color:var(--panel)]/70 p-5 shadow-blueprint" style={{ x: smoothX, y: smoothY }} transition={{ type: 'spring' }}>
          <div className="absolute left-8 top-8 h-40 w-40 border border-[color:var(--accent)]/50" />
          <div className="absolute right-10 top-20 h-72 w-48 rotate-6 border border-dashed border-[color:var(--grid)] bg-[color:var(--bg)]/45" />
          <div className="absolute bottom-12 left-14 h-36 w-[70%] -rotate-3 border border-[color:var(--grid)] bg-cyan-950/20" />
          {tags.map((tag, index) => (
            <motion.span
              key={tag}
              className="blueprint-tag absolute"
              style={{ left: `${14 + index * 17}%`, top: `${18 + (index % 2) * 44}%` }}
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 4 + index, ease: 'easeInOut' }}
            >
              {tag}
            </motion.span>
          ))}
          <div className="absolute bottom-6 right-6 text-right mono text-xs uppercase tracking-[.28em] text-slate-400">cursor light / grid parallax</div>
        </motion.div>
      </div>
    </section>
  );
};

export default BlueprintCanvas;
