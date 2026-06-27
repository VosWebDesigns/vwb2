import React from 'react';
import { cn } from '@/lib/utils';

const GlassCard = ({ children, className = '', glow = false, accent = false }) => (
  <div
    className={cn(
      'relative rounded-2xl border border-[rgba(140,214,255,.14)] bg-[rgba(12,22,40,.78)] backdrop-blur-xl transition-all duration-500',
      glow && 'hover:border-[rgba(140,214,255,.35)] hover:shadow-[0_0_40px_rgba(140,214,255,.12)]',
      accent && 'border-[rgba(214,245,122,.18)] hover:border-[rgba(214,245,122,.35)]',
      className
    )}
  >
    {children}
  </div>
);

export default GlassCard;
