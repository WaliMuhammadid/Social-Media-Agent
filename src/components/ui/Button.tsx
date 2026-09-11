import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', icon, children, disabled, ...props }, ref) => {
    const variants = {
      primary:
        'bg-indigo-600 text-white hover:bg-indigo-500 shadow-sm shadow-indigo-900/30 border border-indigo-500/50 active:scale-[0.98]',
      secondary:
        'bg-slate-800 text-slate-200 hover:bg-slate-700/80 border border-slate-700/60 active:scale-[0.98]',
      outline:
        'bg-transparent text-slate-300 border border-slate-700/80 hover:bg-slate-800/60 hover:text-white active:scale-[0.98]',
      ghost:
        'bg-transparent text-slate-400 hover:text-white hover:bg-slate-800/50',
      danger:
        'bg-rose-600/10 text-rose-400 hover:bg-rose-600/20 border border-rose-500/30 active:scale-[0.98]',
    };

    const sizes = {
      sm: 'h-8 px-2.5 text-xs rounded-lg gap-1.5',
      md: 'h-9 px-3.5 text-sm rounded-lg gap-2',
      lg: 'h-10 px-4 text-base rounded-xl gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed cursor-pointer',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {icon && <span className="shrink-0">{icon}</span>}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
