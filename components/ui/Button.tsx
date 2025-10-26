import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'filled' | 'outlined' | 'text';
  children: React.ReactNode;
}

export function Button({
  variant = 'filled',
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-full font-medium transition-standard focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variantStyles = {
    filled: 'bg-[var(--md-sys-color-primary)] text-[var(--md-sys-color-on-primary)] hover:shadow-[var(--md-sys-elevation-2)] active:shadow-[var(--md-sys-elevation-1)] disabled:bg-gray-300 disabled:text-gray-500',
    outlined: 'border-2 border-[var(--md-sys-color-outline)] text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-surface-variant)] disabled:border-gray-300 disabled:text-gray-400',
    text: 'text-[var(--md-sys-color-primary)] hover:bg-[var(--md-sys-color-surface-variant)] disabled:text-gray-400',
  };

  return (
    <button
      className={cn(baseStyles, variantStyles[variant], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

