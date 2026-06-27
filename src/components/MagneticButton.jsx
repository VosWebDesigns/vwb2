import React, { useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';

const MagneticButton = ({
  children,
  as: Tag = 'button',
  to,
  href,
  className = '',
  style = {},
  strength = 0.4,
  type,
  onClick,
  disabled,
  target,
  rel,
  'data-cursor': dataCursor,
  ...props
}) => {
  const wrapRef = useRef(null);

  const handleMouseMove = useCallback((e) => {
    const el = wrapRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    gsap.to(el, {
      x: dx * strength,
      y: dy * strength,
      duration: 0.5,
      ease: 'power3.out',
    });
  }, [strength]);

  const handleMouseLeave = useCallback(() => {
    const el = wrapRef.current;
    if (!el) return;
    gsap.to(el, {
      x: 0,
      y: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.4)',
    });
  }, []);

  const commonProps = {
    ref: wrapRef,
    className,
    style: { display: 'inline-block', ...style },
    'data-magnetic': '',
    ...(dataCursor ? { 'data-cursor': dataCursor } : {}),
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onClick,
    ...props,
  };

  if (to) {
    return (
      <Link to={to} {...commonProps}>
        {children}
      </Link>
    );
  }

  if (href) {
    return (
      <a href={href} target={target} rel={rel} {...commonProps}>
        {children}
      </a>
    );
  }

  return (
    <Tag type={type} disabled={disabled} {...commonProps}>
      {children}
    </Tag>
  );
};

export default MagneticButton;
