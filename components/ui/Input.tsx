import React from 'react';

import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const generatedId = React.useId();
  const inputId = id || generatedId;

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-[var(--md-sys-color-on-surface)] mb-2"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full px-4 py-3 rounded-lg border-2 border-[var(--md-sys-color-outline)]',
          'bg-[var(--md-sys-color-surface)] text-[var(--md-sys-color-on-surface)]',
          'focus:border-[var(--md-sys-color-primary)] focus:outline-none',
          'transition-standard',
          'disabled:bg-gray-100 disabled:text-gray-500',
          error && 'border-[var(--md-sys-color-error)]',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-[var(--md-sys-color-error)]">{error}</p>}
    </div>
  );
}
