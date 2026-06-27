import React, { useId } from 'react';

const NoiseBg = ({ opacity = 0.028, zIndex = 9997, blendMode = 'overlay' }) => {
  const id = useId().replace(/:/g, '');

  return (
    <>
      <svg
        style={{ position: 'absolute', width: 0, height: 0 }}
        aria-hidden="true"
      >
        <defs>
          <filter id={`noise-${id}`}>
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.80"
              numOctaves="4"
              stitchTiles="stitch"
            />
            <feColorMatrix type="saturate" values="0" />
          </filter>
        </defs>
      </svg>
      <div
        aria-hidden="true"
        className="noise-layer"
        style={{
          filter: `url(#noise-${id})`,
          opacity,
          mixBlendMode: blendMode,
          zIndex,
        }}
      />
    </>
  );
};

export default NoiseBg;
