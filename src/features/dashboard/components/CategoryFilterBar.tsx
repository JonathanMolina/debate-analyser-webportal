import { FC } from 'react';

export interface CategoryFilterBarProps {
  categories: string[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
}

export const CategoryFilterBar: FC<CategoryFilterBarProps> = ({
  categories,
  selectedCategory,
  onSelectCategory
}) => {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none select-none">
      {categories.map((cat) => {
        const isSelected = selectedCategory === cat;
        return (
          <button
            key={cat}
            type="button"
            onClick={() => onSelectCategory(cat)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
              isSelected
                ? 'bg-primary text-black font-semibold shadow-sm shadow-primary/20'
                : 'bg-surface border border-border text-text-muted hover:text-text-main hover:bg-surface-hover'
            }`}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
};
