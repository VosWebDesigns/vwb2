import React from 'react';

const ROW_1 = [
  'Three.js', 'WebGL', 'GSAP', 'React 18', 'Supabase', 'Tailwind CSS',
  'Vite 4', 'Figma', 'TypeScript', 'Node.js', 'PostgreSQL', 'Vercel',
];

const ROW_2 = [
  'ScrollTrigger', 'Framer Motion', 'Lenis Scroll', 'ShadcnUI', 'Radix UI',
  'Resend', 'Sentry', 'Plausible', 'PWA', 'Core Web Vitals', 'Open Graph', 'Schema.org',
];

const MarqueeRow = ({ items, reverse = false, accent = false }) => (
  <div className="relative overflow-hidden py-2.5">
    <div
      className={`flex w-max gap-8 ${reverse ? 'animate-[marquee-reverse_32s_linear_infinite]' : 'animate-[marquee_26s_linear_infinite]'}`}
    >
      {[...items, ...items].map((item, i) => (
        <span
          key={i}
          className={`flex items-center gap-2.5 whitespace-nowrap font-mono text-[11px] uppercase tracking-[.24em] ${accent ? 'text-[rgba(214,245,122,.55)]' : 'text-[rgba(140,214,255,.4)]'}`}
        >
          <span
            className={`h-1 w-1 rounded-full ${accent ? 'bg-[var(--accent2)]' : 'bg-[var(--accent)]'}`}
          />
          {item}
        </span>
      ))}
    </div>
  </div>
);

const TechMarquee = () => (
  <div className="relative overflow-hidden border-y border-[rgba(140,214,255,.1)] bg-[rgba(8,16,30,.65)] backdrop-blur-sm">
    {/* Left/right fades */}
    <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-20 bg-gradient-to-r from-[#020810] to-transparent" />
    <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-20 bg-gradient-to-l from-[#020810] to-transparent" />

    {/* Horizontal rule between rows */}
    <div className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-[rgba(140,214,255,.07)]" />

    <MarqueeRow items={ROW_1} />
    <MarqueeRow items={ROW_2} reverse accent />
  </div>
);

export default TechMarquee;
