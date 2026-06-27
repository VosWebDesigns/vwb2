import React from 'react';

const ROW_1 = [
  'Three.js', 'WebGL', 'GSAP', 'Spline', 'React 18', 'Supabase', 'Tailwind CSS',
  'Vite 4', 'Figma', 'TypeScript', 'Node.js', 'PostgreSQL', 'Vercel',
];

const ROW_2 = [
  'ScrollTrigger', 'Framer Motion', 'Lenis Scroll', 'Blender', 'ShadcnUI', 'Radix UI',
  'Resend', 'Sentry', 'PWA', 'Core Web Vitals', 'Open Graph', 'Schema.org',
];

const MarqueeRow = ({ items, reverse = false, red = false }) => (
  <div className="relative overflow-hidden py-3">
    <div
      className={`flex w-max gap-9 ${
        reverse
          ? 'animate-[marquee-reverse_34s_linear_infinite]'
          : 'animate-[marquee_28s_linear_infinite]'
      }`}
    >
      {[...items, ...items].map((item, i) => (
        <span
          key={i}
          className="flex items-center gap-2.5 whitespace-nowrap font-mono text-[10px] uppercase tracking-[.24em]"
          style={{ color: red ? 'rgba(255,63,0,.42)' : 'rgba(204,255,0,.35)' }}
        >
          <span
            className="h-1 w-1 rounded-full flex-shrink-0"
            style={{ background: red ? 'var(--accent2)' : 'var(--accent)' }}
          />
          {item}
        </span>
      ))}
    </div>
  </div>
);

const TechMarquee = () => (
  <div
    className="relative overflow-hidden backdrop-blur-sm"
    style={{
      borderTop: '1px solid rgba(204,255,0,.07)',
      borderBottom: '1px solid rgba(204,255,0,.07)',
      background: 'rgba(6,6,8,.75)',
    }}
  >
    {/* Left/right fades */}
    <div
      className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24"
      style={{ background: 'linear-gradient(to right, #060608, transparent)' }}
    />
    <div
      className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24"
      style={{ background: 'linear-gradient(to left, #060608, transparent)' }}
    />

    {/* Center divider */}
    <div
      className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2"
      style={{ background: 'rgba(204,255,0,.05)' }}
    />

    <MarqueeRow items={ROW_1} />
    <MarqueeRow items={ROW_2} reverse red />
  </div>
);

export default TechMarquee;
