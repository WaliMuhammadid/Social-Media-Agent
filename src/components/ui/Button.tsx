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
        'bg-[#0064E0] text-white hover:bg-[#0052b4] shadow-sm active:scale-[0.98] border border-transparent font-medium',
      secondary:
        'bg-gray-100 text-gray-800 hover:bg-gray-200 border border-transparent active:scale-[0.98] font-medium',
      outline:
        'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 hover:text-gray-900 active:scale-[0.98] shadow-sm font-medium',
      ghost:
        'bg-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100 font-medium',
      danger:
        'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200 active:scale-[0.98] font-medium',
    };

    const sizes = {
      sm: 'h-8 px-3 text-xs rounded-md gap-1.5',
      md: 'h-9 px-4 text-sm rounded-lg gap-2',
      lg: 'h-10 px-5 text-sm rounded-lg gap-2.5',
    };

    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          'inline-flex items-center justify-center transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0064E0] disabled:opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed cursor-pointer',
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
