import { FC, memo } from 'react';
import { User } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useDebaterImage } from './useDebaterImage';

export type DebaterAvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type DebaterAvatarShape = 'full' | 'xl' | '2xl';

export interface DebaterAvatarProps {
  name: string;
  photoUrl?: string;
  debaterId?: string;
  size?: DebaterAvatarSize;
  shape?: DebaterAvatarShape;
  className?: string;
  imgClassName?: string;
  border?: boolean;
}

const SIZE_CONTAINER: Record<DebaterAvatarSize, string> = {
  xs: 'w-4 h-4 min-w-4 min-h-4 text-[9px]',
  sm: 'w-7 h-7 min-w-7 min-h-7 text-xs',
  md: 'w-9 h-9 min-w-9 min-h-9 text-sm',
  lg: 'w-14 h-14 min-w-14 min-h-14 text-lg',
  xl: 'w-20 h-20 min-w-20 min-h-20 text-2xl'
};

const SIZE_ICON: Record<DebaterAvatarSize, number> = {
  xs: 10,
  sm: 14,
  md: 18,
  lg: 26,
  xl: 34
};

const SHAPE_CLASSES: Record<DebaterAvatarShape, string> = {
  full: 'rounded-full',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl'
};

export const DebaterAvatar: FC<DebaterAvatarProps> = memo(({
  name,
  photoUrl,
  debaterId,
  size = 'md',
  shape = 'full',
  className = '',
  imgClassName = '',
  border = true
}) => {
  const { resolvedUrl, isLoaded, hasError } = useDebaterImage(
    photoUrl,
    name,
    debaterId
  );

  const containerClasses = twMerge(
    clsx(
      'relative flex items-center justify-center overflow-hidden shrink-0 select-none bg-surface-elevated',
      SIZE_CONTAINER[size],
      SHAPE_CLASSES[shape],
      border && 'border border-border',
      className
    )
  );

  const initial = name?.trim() ? name.trim().charAt(0).toUpperCase() : '';

  // Se a imagem estiver carregada da memória com sucesso
  if (isLoaded && resolvedUrl) {
    return (
      <div className={containerClasses} title={name} aria-label={name}>
        <img
          src={resolvedUrl}
          alt={name}
          className={twMerge('w-full h-full object-cover', imgClassName)}
          loading="lazy"
        />
      </div>
    );
  }

  // Fallback quando não há foto ou quando ocorreu erro no carregamento
  return (
    <div
      className={twMerge(containerClasses, hasError && 'bg-primary/10 text-primary')}
      title={name}
      aria-label={name}
    >
      {initial ? (
        <span className="font-bold font-mono leading-none">{initial}</span>
      ) : (
        <User size={SIZE_ICON[size]} className="text-text-muted" />
      )}
    </div>
  );
});

DebaterAvatar.displayName = 'DebaterAvatar';
