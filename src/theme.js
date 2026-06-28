/**
 * Central design token registry.
 * Import from any component for consistent values — mirrors the CSS vars in index.css.
 */

export const colors = {
  bg:      '#06060c',
  surface: '#0d0d1c',
  ink:     '#06060c',
  accent:  '#c9a96e',  // warm gold
  accent2: '#8a5cf6',  // electric violet
  accent3: '#f0ebe3',  // warm cream
  muted:   '#6b6880',
  panel:   'rgba(10, 10, 20, 0.88)',
  stroke:  'rgba(201, 169, 110, 0.12)',
  stroke2: 'rgba(138, 92, 246, 0.12)',
};

export const fonts = {
  heading: '"Sora", Inter, system-ui, sans-serif',
  body:    'Inter, system-ui, sans-serif',
  serif:   '"Cormorant Garamond", Georgia, serif',
  mono:    '"Space Mono", ui-monospace, monospace',
};

export const easing = {
  cinematic:  'power4.out',
  reveal:     'power3.out',
  elastic:    'back.out(1.8)',
  inOut:      'power3.inOut',
  expo:       'expo.out',
  smooth:     'power2.inOut',
  scrub:      'none',          // always use with ScrollTrigger scrub
};

export const duration = {
  fast:   0.35,
  base:   0.7,
  slow:   1.1,
  xslow:  1.6,
};

export const spacing = {
  section:  { py: '7rem',  mobile: '4.5rem' },
  container: 'min(100% - 2rem, 1180px)',
};

/** Shared Three.js material defaults for consistent scene look */
export const three = {
  gold:   '#c9a96e',
  violet: '#8a5cf6',
  cream:  '#f0ebe3',
  additive: 2, // THREE.AdditiveBlending
};
