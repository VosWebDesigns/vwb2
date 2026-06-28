import React from 'react';
import { cn } from '@/lib/utils';

const GlassCard = ({ children, className = '', glow = false, accent = false }) => (
  <div
    className={cn(
      'relative rounded-2xl border border-[rgba(201,169,110,.12)] bg-[rgba(8,8,18,.82)] backdrop-blur-xl transition-all duration-500',
      glow && 'hover:border-[rgba(201,169,110,.32)] hover:shadow-[0_0_40px_rgba(201,169,110,.10)]',
      accent && 'border-[rgba(138,92,246,.18)] hover:border-[rgba(138,92,246,.35)]',
      className
    )}
  >
    {children}
  </div>
);

export default GlassCard;
