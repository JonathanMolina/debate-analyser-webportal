import { FC, useRef, useState, useEffect, useCallback, ComponentType } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import type { DebateTabId } from '../types/debate.types';

export interface DebateTabItem {
  id: DebateTabId;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  count?: number;
  mobileOnly?: boolean;
}

export interface DebateTabsNavProps {
  tabs: DebateTabItem[];
  activeTab: DebateTabId;
  onTabChange: (tabId: DebateTabId) => void;
}

export const DebateTabsNav: FC<DebateTabsNavProps> = ({
  tabs,
  activeTab,
  onTabChange
}) => {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const activeTabRef = useRef<HTMLButtonElement | null>(null);
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(false);
  const [isGridExpanded, setIsGridExpanded] = useState<boolean>(false);

  const checkScrollability = useCallback(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = scrollContainerRef.current;
    if (!el) return;

    checkScrollability();
    el.addEventListener('scroll', checkScrollability, { passive: true });
    window.addEventListener('resize', checkScrollability);

    return () => {
      el.removeEventListener('scroll', checkScrollability);
      window.removeEventListener('resize', checkScrollability);
    };
  }, [checkScrollability, tabs]);

  // Centraliza a aba ativa quando mudar no container horizontal
  useEffect(() => {
    if (activeTabRef.current && scrollContainerRef.current) {
      if (typeof activeTabRef.current.scrollIntoView === 'function') {
        activeTabRef.current.scrollIntoView({
          behavior: 'smooth',
          inline: 'center',
          block: 'nearest'
        });
      }
    }
  }, [activeTab]);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = scrollContainerRef.current;
    if (!el) return;

    const scrollAmount = direction === 'left' ? -200 : 200;
    if (typeof el.scrollBy === 'function') {
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    } else {
      el.scrollLeft += scrollAmount;
    }
  };

  const handleTabClick = (tabId: DebateTabId) => {
    onTabChange(tabId);
    if (isGridExpanded) {
      setIsGridExpanded(false);
    }
  };

  return (
    <div className="w-full space-y-2">
      {/* Barra superior de controle apenas no mobile: indicador e toggle para ver todas */}
      <div className="flex md:hidden items-center justify-between pb-0.5 px-0.5 select-none">
        <span className="text-[11px] font-mono uppercase tracking-wider text-text-muted">
          Seções do debate
        </span>
        <button
          type="button"
          onClick={() => setIsGridExpanded((prev) => !prev)}
          aria-expanded={isGridExpanded}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-surface border border-border text-text-main hover:border-primary/40 transition-colors"
        >
          <LayoutGrid size={13} className="text-primary" />
          <span>{isGridExpanded ? 'Modo Barra' : 'Ver todas'}</span>
          {isGridExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
        </button>
      </div>

      {/* Container Adaptativo de Abas (Carrossel no Mobile, Grade se expandido, Flex-Wrap no Desktop) */}
      <div className="relative group">
        {/* Seta esquerda no mobile */}
        {!isGridExpanded && canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            aria-label="Rolar abas para a esquerda"
            className="md:hidden absolute left-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-r-lg bg-surface/95 text-text-main border-y border-r border-border shadow-md backdrop-blur-sm transition-transform active:scale-95"
          >
            <ChevronLeft size={16} />
          </button>
        )}

        {/* Gradiente fade esquerdo no mobile */}
        {!isGridExpanded && canScrollLeft && (
          <div className="md:hidden pointer-events-none absolute left-0 top-0 bottom-0 w-8 bg-gradient-to-r from-canvas via-canvas/60 to-transparent z-5" />
        )}

        {/* Lista Unificada de Abas */}
        <div
          ref={scrollContainerRef}
          role="tablist"
          className={
            isGridExpanded
              ? 'grid grid-cols-2 gap-1.5 p-2 bg-surface/70 border border-border rounded-xl animate-fadeIn md:flex md:flex-wrap md:items-center md:gap-2 md:p-1.5 md:bg-surface/50 md:border md:border-border/80 md:rounded-2xl'
              : 'flex items-center gap-1.5 p-1 overflow-x-auto scroll-smooth scrollbar-none select-none md:flex-wrap md:overflow-visible md:gap-2 md:p-1.5 md:bg-surface/50 md:border md:border-border/80 md:rounded-2xl'
          }
        >
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                ref={isActive ? activeTabRef : null}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleTabClick(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 sm:px-3.5 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                  isGridExpanded ? 'justify-between w-full' : 'whitespace-nowrap shrink-0 md:shrink'
                } ${
                  tab.mobileOnly ? 'lg:hidden' : ''
                } ${
                  isActive
                    ? 'bg-surface-elevated text-primary border border-primary/30 shadow-sm font-bold'
                    : 'bg-surface/50 md:bg-transparent text-text-muted hover:text-text-main hover:bg-surface-hover/60 border border-border/60 md:border-transparent'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Icon size={15} className="shrink-0" />
                  <span className="truncate">{tab.label}</span>
                </div>
                {tab.count !== undefined && (
                  <span
                    className={`text-[10px] font-mono px-1.5 py-0.5 rounded-full shrink-0 ${
                      isActive
                        ? 'bg-primary/20 text-primary border border-primary/30'
                        : 'bg-canvas text-text-muted border border-border'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Gradiente fade direito no mobile */}
        {!isGridExpanded && canScrollRight && (
          <div className="md:hidden pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-canvas via-canvas/60 to-transparent z-5" />
        )}

        {/* Seta direita no mobile */}
        {!isGridExpanded && canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            aria-label="Rolar abas para a direita"
            className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-10 p-1.5 rounded-l-lg bg-surface/95 text-text-main border-y border-l border-border shadow-md backdrop-blur-sm transition-transform active:scale-95"
          >
            <ChevronRight size={16} />
          </button>
        )}
      </div>
    </div>
  );
};
