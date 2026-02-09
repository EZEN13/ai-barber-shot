'use client';

import { ReactNode, ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  children: ReactNode;
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  children,
  isLoading = false,
  fullWidth = false,
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100';

  const variants = {
    primary: 'bg-[var(--accent)] text-black hover:bg-[var(--accent-hover)] shadow-lg shadow-[var(--accent)]/20',
    secondary: 'bg-[var(--card-bg)] text-white hover:bg-[var(--card-border)] border border-[var(--card-border)]',
    outline: 'bg-transparent text-[var(--accent)] border-2 border-[var(--accent)] hover:bg-[var(--accent)]/10',
    ghost: 'bg-transparent text-[var(--muted)] hover:text-white hover:bg-white/5',
  };

  const sizes = {
    sm: 'text-sm px-3 py-2 gap-1.5',
    md: 'text-base px-4 py-2.5 gap-2',
    lg: 'text-lg px-6 py-3 gap-2',
    xl: 'text-xl px-8 py-4 gap-3',
  };

  return (
    <button
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span>Загрузка...</span>
        </>
      ) : (
        <>
          {icon}
          {children}
        </>
      )}
    </button>
  );
}
