import { FC } from 'react';
import { Search, Flame, Clock, MessageSquare, Plus, X } from 'lucide-react';
import { Button } from '@/components/Button/Button';
import type { SuggestionSortOption } from '../types/suggestion.types';

export interface SuggestionsFilterBarProps {
  sort: SuggestionSortOption;
  onSortChange: (sort: SuggestionSortOption) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onOpenSuggestModal: () => void;
}

export const SuggestionsFilterBar: FC<SuggestionsFilterBarProps> = ({
  sort,
  onSortChange,
  searchQuery,
  onSearchChange,
  onOpenSuggestModal
}) => {
  const sortOptions: Array<{ id: SuggestionSortOption; label: string; icon: typeof Flame }> = [
    { id: 'top', label: 'Mais Votados', icon: Flame },
    { id: 'recent', label: 'Mais Recentes', icon: Clock },
    { id: 'comments', label: 'Mais Comentados', icon: MessageSquare }
  ];

  return (
    <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 bg-surface/80 border border-border rounded-2xl p-4 shadow-sm">
      {/* Search Input */}
      <div className="relative flex-1 max-w-md">
        <Search
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none"
        />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Buscar por título ou debatedor..."
          className="w-full pl-9 pr-8 py-2 bg-surface-elevated border border-border rounded-xl text-sm text-text-main placeholder:text-text-muted/60 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-text-muted hover:text-text-main transition-colors cursor-pointer"
            aria-label="Limpar busca"
          >
            <X size={14} />
          </button>
        )}
      </div>

      {/* Sort Buttons & CTA */}
      <div className="flex flex-wrap items-center justify-between md:justify-end gap-2 sm:gap-3">
        {/* Sort Pill Buttons */}
        <div className="flex items-center gap-1 bg-surface-elevated/60 p-1 rounded-xl border border-border/80">
          {sortOptions.map((opt) => {
            const Icon = opt.icon;
            const isActive = sort === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => onSortChange(opt.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary text-black font-semibold shadow-sm'
                    : 'text-text-muted hover:text-text-main hover:bg-surface-hover/80'
                }`}
              >
                <Icon size={14} />
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>

        {/* Suggest CTA Button */}
        <Button
          variant="primary"
          size="sm"
          icon={<Plus size={16} />}
          onClick={onOpenSuggestModal}
        >
          Sugerir Debate
        </Button>
      </div>
    </div>
  );
};
