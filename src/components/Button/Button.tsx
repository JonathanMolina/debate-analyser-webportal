import { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  icon?: ReactNode;
  isLoading?: boolean;
}

export const Button: FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  icon,
  isLoading,
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all cursor-pointer select-none focus:outline-none focus:ring-2 focus:ring-primary/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none active:scale-[0.98]';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 h-8',
    md: 'text-sm px-4 py-2 h-10',
    lg: 'text-base px-5 py-2.5 h-12'
  };

  const variantStyles = {
    primary:
      'bg-primary text-black hover:bg-primary-hover font-semibold shadow-md shadow-primary/20',
    secondary:
      'bg-surface-elevated text-text-main hover:bg-surface-hover border border-border',
    outline:
      'bg-transparent border border-border text-text-main hover:bg-surface-hover hover:border-text-muted/40',
    ghost:
      'bg-transparent text-text-muted hover:text-text-main hover:bg-surface-hover',
    danger:
      'bg-status-false text-white hover:bg-red-600 shadow-md shadow-red-900/20'
  };

  return (
    <button
      className={twMerge(
        clsx(baseStyles, sizeStyles[size], variantStyles[variant], className)
      )}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {children}
    </button>
  );
};
