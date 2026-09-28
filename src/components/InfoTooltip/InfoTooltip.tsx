import { FC, useState, useRef, useEffect, ReactNode, useId } from 'react';
import { HelpCircle } from 'lucide-react';

export interface InfoTooltipProps {
  content: ReactNode;
  title?: string;
  children?: ReactNode;
  showIcon?: boolean;
  position?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  className?: string;
  iconClassName?: string;
  iconSize?: number;
  triggerAriaLabel?: string;
}

export const InfoTooltip: FC<InfoTooltipProps> = ({
  content,
  title,
  children,
  showIcon = true,
  position = 'top',
  align = 'center',
  className = '',
  iconClassName = 'text-text-muted hover:text-primary transition-colors',
  iconSize = 13,
  triggerAriaLabel = 'Mais informações'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();

  // Fecha ao clicar fora (suporte robusto para smartphones e desktop)
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e: MouseEvent | TouchEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleOpen = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setIsOpen((prev) => !prev);
  };

  const handleMouseEnter = () => {
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    setIsOpen(false);
  };

  // Posicionamento responsivo e refinado
  const positionClasses = {
    top: 'bottom-full mb-2',
    bottom: 'top-full mt-2',
    left: 'right-full mr-2',
    right: 'left-full ml-2'
  }[position];

  const alignClasses = {
    start: 'left-0',
    center: 'left-1/2 -translate-x-1/2',
    end: 'right-0'
  }[align];

  return (
    <span
      ref={containerRef}
      className={`relative inline-flex items-center align-middle gap-1 ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Elemento acompanhado (se fornecido) */}
      {children}

      {/* Botão de Trigger (Ícone de Informação) */}
      {showIcon && (
        <button
          type="button"
          onClick={toggleOpen}
          aria-describedby={isOpen ? tooltipId : undefined}
          aria-expanded={isOpen}
          aria-label={triggerAriaLabel}
          className={`inline-flex items-center justify-center p-0.5 rounded-full hover:bg-surface-elevated focus:outline-none focus:ring-1 focus:ring-primary/50 transition-colors cursor-pointer shrink-0 ${iconClassName}`}
        >
          <HelpCircle size={iconSize} aria-hidden="true" />
        </button>
      )}

      {/* Se children for clicável sem ícone dedicado, também aceita toggle no próprio children quando showIcon = false */}
      {!showIcon && children && (
        <button
          type="button"
          onClick={toggleOpen}
          aria-describedby={isOpen ? tooltipId : undefined}
          aria-expanded={isOpen}
          aria-label={triggerAriaLabel}
          className="inline-flex items-center cursor-pointer"
        >
          {children}
        </button>
      )}

      {/* Popover / Tooltip Container */}
      {isOpen && (
        <div
          id={tooltipId}
          role="tooltip"
          onClick={(e) => e.stopPropagation()}
          className={`absolute ${positionClasses} ${alignClasses} z-50 w-64 max-w-[85vw] p-3 rounded-xl bg-surface-elevated border border-border shadow-2xl text-left font-sans text-xs text-text-main animate-fadeIn pointer-events-auto leading-relaxed`}
        >
          {title && (
            <div className="font-bold text-[12px] text-primary mb-1 border-b border-border/60 pb-1">
              {title}
            </div>
          )}
          <div className="text-[11px] text-text-muted leading-snug">
            {content}
          </div>
        </div>
      )}
    </span>
  );
};
