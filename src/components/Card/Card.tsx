import { FC, HTMLAttributes, ReactNode } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  interactive?: boolean;
}

export const Card: FC<CardProps> = ({
  children,
  className,
  interactive = false,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-surface border border-border rounded-2xl p-5 transition-all overflow-hidden',
          interactive &&
            'cursor-pointer hover:border-border/90 hover:bg-surface-hover/80 hover:shadow-lg hover:shadow-black/40 hover:-translate-y-0.5',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
};
