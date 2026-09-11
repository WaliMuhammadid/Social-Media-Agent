import React from 'react';
import { cn } from '@/lib/utils';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glow?: boolean;
  glowColor?: 'indigo' | 'emerald' | 'amber' | 'rose' | 'sky';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, glow = false, glowColor = 'indigo', children, ...props }, ref) => {
    const glowColors = {
      indigo: 'hover:border-indigo-500/40 hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.15)]',
      emerald: 'hover:border-emerald-500/40 hover:shadow-[0_0_20px_-5px_rgba(16,185,129,0.15)]',
      amber: 'hover:border-amber-500/40 hover:shadow-[0_0_20px_-5px_rgba(245,158,11,0.15)]',
      rose: 'hover:border-rose-500/40 hover:shadow-[0_0_20px_-5px_rgba(244,63,94,0.15)]',
      sky: 'hover:border-sky-500/40 hover:shadow-[0_0_20px_-5px_rgba(14,165,233,0.15)]',
    };

    return (
      <div
        ref={ref}
        className={cn(
          'rounded-xl border border-slate-800/80 bg-slate-900/60 backdrop-blur-md p-5 text-slate-100 shadow-lg transition-all duration-200',
          glow && glowColors[glowColor],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center justify-between gap-3 pb-3 border-b border-slate-800/60 mb-4', className)}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLHeadingElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn('text-base font-semibold leading-none tracking-tight text-white flex items-center gap-2', className)}
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-xs text-slate-400 leading-relaxed', className)}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';
