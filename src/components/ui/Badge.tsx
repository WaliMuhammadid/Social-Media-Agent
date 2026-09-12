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
  let activeVariant = variant;
  let label = children;

  if (status) {
    switch (status) {
      case 'working':
        activeVariant = 'success';
        label = children || 'Active / Running';
        break;
      case 'waiting_approval':
        activeVariant = 'warning';
        label = children || 'Pending Approval';
        break;
      case 'idle':
        activeVariant = 'info';
        label = children || 'Idle';
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

  // Enterprise pastel backgrounds with crisp legible text and subtle borders
  const variantStyles = {
    default: 'bg-gray-100 text-gray-700 border-gray-200',
    success: 'bg-emerald-50 text-emerald-800 border-emerald-200/80 font-semibold',
    warning: 'bg-amber-50 text-amber-800 border-amber-200/80 font-semibold',
    danger: 'bg-red-50 text-red-800 border-red-200/80 font-semibold',
    info: 'bg-blue-50 text-blue-700 border-blue-200/80 font-semibold',
    purple: 'bg-purple-50 text-purple-800 border-purple-200/80 font-semibold',
  };

  const dotStyles = {
    default: 'bg-gray-500',
    success: 'bg-emerald-600',
    warning: 'bg-amber-600',
    danger: 'bg-red-600',
    info: 'bg-blue-600',
    purple: 'bg-purple-600',
  };

  const sizeStyles = {
    sm: 'text-[11px] font-medium px-2 py-0.5 gap-1.5',
    md: 'text-xs font-medium px-2.5 py-1 gap-1.5',
    lg: 'text-sm font-medium px-3 py-1.5 gap-2',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border transition-colors shadow-2xs',
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
