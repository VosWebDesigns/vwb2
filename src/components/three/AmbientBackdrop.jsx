import React from 'react';

/**
 * Pure-CSS futuristic backdrop used as a graceful fallback when WebGL is
 * unavailable or the user prefers reduced motion. No JS animation, no canvas —
 * keeps the sci-fi aesthetic without any runtime cost or failure surface.
 */
export const StaticBackdrop = () => (
  <div className="pointer-events-none fixed inset-0 z-0" aria-hidden="true">
    <div
      className="absolute inset-0"
      style={{
        background:
          'radial-gradient(ellipse 70% 50% at 50% -5%, rgba(201,169,110,.12), transparent 60%),' +
          'radial-gradient(ellipse 50% 50% at 85% 80%, rgba(138,92,246,.06), transparent 60%),' +
          'radial-gradient(ellipse 60% 60% at 10% 50%, rgba(30,20,50,.18), transparent 60%)',
      }}
    />
    <div className="absolute inset-0 sci-fi-grid [mask-image:radial-gradient(ellipse_at_center,black_10%,transparent_75%)]" />
  </div>
);

/**
 * Catches any render/runtime error from the lazy 3D canvas (e.g. WebGL context
 * creation failure on locked-down browsers) and degrades to the static backdrop
 * so the rest of the site keeps working.
 */
export class CanvasErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { failed: false };
  }

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error) {
    // Non-fatal: the visual layer is decorative. Log for observability only.
    console.warn('WEBGL_CANVAS_FALLBACK', error?.message || error);
  }

  render() {
    if (this.state.failed) return <StaticBackdrop />;
    return this.props.children;
  }
}

let cachedWebGL = null;
export const isWebGLAvailable = () => {
  if (cachedWebGL !== null) return cachedWebGL;
  if (typeof window === 'undefined') return false;
  try {
    const canvas = document.createElement('canvas');
    cachedWebGL = Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (_e) {
    cachedWebGL = false;
  }
  return cachedWebGL;
};
