import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'parchment' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export function Button({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  }[size];

  const variantStyles = {
    primary: 'bg-lantern text-ink font-semibold hover:bg-lantern-glow shadow-lantern focus:ring-lantern active:scale-[0.98]',
    secondary: 'bg-forest-700 hover:bg-forest-600 text-parchment border border-sage/30 hover:border-lantern/50 focus:ring-sage',
    parchment: 'bg-parchment-light hover:bg-parchment text-ink border border-parchment-dark shadow-sm hover:shadow focus:ring-forest',
    ghost: 'text-sage hover:text-parchment hover:bg-forest-700/50 focus:ring-sage/50',
    danger: 'bg-red-900/80 hover:bg-red-800 text-red-100 border border-red-700 focus:ring-red-500',
  }[variant];

  return (
    <button
      className={twMerge(clsx(baseStyles, sizeStyles, variantStyles, className))}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Consulting Lore...</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}
