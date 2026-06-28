import React from 'react';

/**
 * Reusable glassmorphic panel — frosted blur, subtle border glow, soft shadow.
 * Designed to float over dark/abstract backgrounds without obscuring depth.
 *
 * Props:
 *   variant   — 'gold' | 'violet' | 'neutral'  (border glow color)
 *   hover     — boolean — enable lift+glow on hover (default: true)
 *   cutCorner — boolean — apply diagonal clip to bottom-left corner (cyberpunk look)
 *   className — additional Tailwind/CSS classes
 *   style     — inline style overrides
 */
const GlassPanel = ({
  children,
  variant = 'gold',
  hover = true,
  cutCorner = false,
  className = '',
  style = {},
  as: Tag = 'div',
  ...rest
}) => {
  const borderColor = {
    gold:    'rgba(201,169,110,.14)',
    violet:  'rgba(138,92,246,.14)',
    neutral: 'rgba(255,255,255,.07)',
  }[variant];

  const hoverBorder = {
    gold:    'rgba(201,169,110,.32)',
    violet:  'rgba(138,92,246,.32)',
    neutral: 'rgba(255,255,255,.15)',
  }[variant];

  const hoverShadow = {
    gold:    '0 0 50px rgba(201,169,110,.10), 0 24px 80px rgba(0,0,0,.45), inset 0 0 60px rgba(201,169,110,.025)',
    violet:  '0 0 50px rgba(138,92,246,.10), 0 24px 80px rgba(0,0,0,.45), inset 0 0 60px rgba(138,92,246,.025)',
    neutral: '0 24px 80px rgba(0,0,0,.45)',
  }[variant];

  const clipPath = cutCorner
    ? 'polygon(0 0, calc(100% - 20px) 0, 100% 20px, 100% 100%, 20px 100%, 0 calc(100% - 20px))'
    : undefined;

  return (
    <Tag
      className={`glass-panel-base ${className}`}
      style={{
        border: `1px solid ${borderColor}`,
        background: 'rgba(8, 8, 18, 0.78)',
        backdropFilter: 'blur(22px) saturate(1.35)',
        WebkitBackdropFilter: 'blur(22px) saturate(1.35)',
        boxShadow: '0 12px 60px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.04)',
        transition: hover ? 'border-color .4s ease, box-shadow .4s ease, transform .4s ease' : undefined,
        clipPath,
        ...style,
      }}
      onMouseEnter={hover ? (e) => {
        e.currentTarget.style.borderColor = hoverBorder;
        e.currentTarget.style.boxShadow = hoverShadow;
        e.currentTarget.style.transform = 'translateY(-4px)';
      } : undefined}
      onMouseLeave={hover ? (e) => {
        e.currentTarget.style.borderColor = borderColor;
        e.currentTarget.style.boxShadow = '0 12px 60px rgba(0,0,0,.35), inset 0 1px 0 rgba(255,255,255,.04)';
        e.currentTarget.style.transform = 'translateY(0)';
      } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
};

export default GlassPanel;
