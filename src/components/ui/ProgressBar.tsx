import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ProgressBarProps {
  value: number; // 0 - 100
  max?: number;
  className?: string;
  showText?: boolean;
  color?: 'lantern' | 'moss' | 'sage';
}

export function ProgressBar({
  value,
  max = 100,
  className,
  showText = false,
  color = 'moss',
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  const barColors = {
    moss: 'bg-gradient-to-r from-forest-600 via-moss to-moss-400',
    lantern: 'bg-gradient-to-r from-lantern-warm via-lantern to-lantern-glow',
    sage: 'bg-gradient-to-r from-sage-dark to-sage',
  }[color];

  return (
    <div className={twMerge('w-full', className)}>
      <div className="flex justify-between items-center mb-1 text-xs text-sage">
        {showText && <span>Progress</span>}
        {showText && <span className="font-semibold text-parchment">{percent}%</span>}
      </div>
      <div className="w-full bg-forest-900/80 rounded-full h-2.5 overflow-hidden border border-forest-700/40 p-0.5">
        <div
          className={twMerge('h-full rounded-full transition-all duration-500', barColors)}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
