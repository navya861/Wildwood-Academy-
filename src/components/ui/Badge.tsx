import React from 'react';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  variant?: 'success' | 'warning' | 'info' | 'danger' | 'amber' | 'sage';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'sage', children, className }: BadgeProps) {
  const styles = {
    success: 'bg-moss/20 text-moss-300 border-moss/40',
    warning: 'bg-lantern/20 text-lantern-glow border-lantern/40',
    info: 'bg-blue-950/40 text-blue-300 border-blue-700/40',
    danger: 'bg-red-950/40 text-red-300 border-red-700/40',
    amber: 'bg-lantern/25 text-lantern-amber border-lantern/50 font-semibold',
    sage: 'bg-sage/15 text-sage-light border-sage/30',
  }[variant];

  return (
    <span className={twMerge('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border', styles, className)}>
      {children}
    </span>
  );
}
