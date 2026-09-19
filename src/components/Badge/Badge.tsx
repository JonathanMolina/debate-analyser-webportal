import { FC, ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface BadgeProps {
  children: ReactNode;
  variant?: 'primary' | 'true' | 'disputed' | 'false' | 'neutral' | 'outline';
  className?: string;
}

export const Badge: FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  className
}) => {
  const base =
    'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-medium select-none';

  const variants = {
    primary: 'bg-primary/15 text-primary border border-primary/30',
    true: 'bg-status-true/20 text-emerald-300 border border-status-true/40',
    disputed: 'bg-status-disputed/20 text-yellow-300 border border-status-disputed/40',
    false: 'bg-status-false/20 text-rose-300 border border-status-false/40',
    neutral: 'bg-surface-elevated text-text-muted border border-border',
    outline: 'bg-transparent text-text-muted border border-border'
  };

  return (
    <span className={twMerge(clsx(base, variants[variant], className))}>
      {children}
    </span>
  );
};
