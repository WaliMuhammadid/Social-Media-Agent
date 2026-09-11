import React from 'react';
import { cn } from '@/lib/utils';
import { AgentStatus } from '@/types';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  status?: AgentStatus;
  pulse?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  status,
  pulse = false,
  size = 'md',
  className,
  ...props
}) => {
  // Resolve variant from status if provided
  let activeVariant = variant;
  let label = children;

  if (status) {
    switch (status) {
      case 'working':
        activeVariant = 'success';
        label = children || 'Working';
        break;
      case 'waiting_approval':
        activeVariant = 'warning';
        label = children || 'Review Required';
        break;
      case 'idle':
        activeVariant = 'info';
        label = children || 'Idle / Standby';
        break;
      case 'completed':
        activeVariant = 'purple';
        label = children || 'Completed';
        break;
      case 'error':
        activeVariant = 'danger';
        label = children || 'Error';
        break;
      case 'paused':
        activeVariant = 'default';
        label = children || 'Paused';
        break;
    }
  }

  const variantStyles = {
    default: 'bg-slate-800/80 text-slate-300 border-slate-700/60',
    success: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    warning: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    danger: 'bg-rose-500/10 text-rose-400 border-rose-500/30',
    info: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    purple: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
  };

  const dotStyles = {
    default: 'bg-slate-400',
    success: 'bg-emerald-400',
    warning: 'bg-amber-400',
    danger: 'bg-rose-400',
    info: 'bg-sky-400',
    purple: 'bg-violet-400',
  };

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full border transition-colors shadow-sm backdrop-blur-sm',
        variantStyles[activeVariant],
        sizeStyles[size],
        className
      )}
      {...props}
    >
      {(pulse || status === 'working' || status === 'waiting_approval') && (
        <span className="relative flex h-1.5 w-1.5">
          <span
            className={cn(
              'animate-ping absolute inline-flex h-full w-full rounded-full opacity-75',
              dotStyles[activeVariant]
            )}
          />
          <span
            className={cn(
              'relative inline-flex rounded-full h-1.5 w-1.5',
              dotStyles[activeVariant]
            )}
          />
        </span>
      )}
      {label}
    </span>
  );
};
