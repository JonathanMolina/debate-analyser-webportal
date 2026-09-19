import { FC, HTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const Skeleton: FC<HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        clsx('animate-pulse bg-surface-elevated/70 rounded-xl', className)
      )}
      {...props}
    />
  );
};
