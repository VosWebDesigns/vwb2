import React from 'react';

const ITEMS = [
  'Three.js', 'WebGL', 'GSAP', 'React 18', 'Supabase', 'Tailwind CSS',
  'Vite', 'Figma', 'TypeScript', 'Node.js', 'Three.js', 'WebGL',
  'GSAP', 'React 18', 'Supabase', 'Tailwind CSS', 'Vite', 'Figma',
];

const TechMarquee = () => (
  <div className="relative overflow-hidden border-y border-[rgba(140,214,255,.1)] bg-[rgba(8,16,30,.6)] py-4 backdrop-blur-sm">
    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#020810]" />
    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#020810]" />
    <div className="flex w-max animate-[marquee_28s_linear_infinite] gap-10">
      {[...ITEMS, ...ITEMS].map((item, i) => (
        <span
          key={i}
          className="flex items-center gap-3 font-mono text-xs uppercase tracking-[.26em] text-slate-400"
        >
          <span className="h-1 w-1 rounded-full bg-[var(--accent)]" />
          {item}
        </span>
      ))}
    </div>
  </div>
);

export default TechMarquee;
