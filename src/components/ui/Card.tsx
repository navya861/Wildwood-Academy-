import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export { Badge } from './Badge';
export { ProgressBar } from './ProgressBar';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'woodland' | 'parchment' | 'dark';
  interactive?: boolean;
}

export function Card({
  className,
  variant = 'woodland',
  interactive = false,
  children,
  ...props
}: CardProps) {
  const variantStyles = {
    woodland: 'woodland-panel p-5',
    parchment: 'parchment-panel p-5',
    dark: 'bg-forest-900/90 border border-forest-600/30 rounded-xl p-5 shadow-forest',
  }[variant];

  const interactiveStyles = interactive ? 'hover-shimmer cursor-pointer' : '';

  return (
    <div className={twMerge(clsx(variantStyles, interactiveStyles, className))} {...props}>
      {children}
    </div>
  );
}
