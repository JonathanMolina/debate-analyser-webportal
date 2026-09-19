import { FC, InputHTMLAttributes } from 'react';
import { Search, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  onClear?: () => void;
}

export const SearchInput: FC<SearchInputProps> = ({
  value,
  onChange,
  onClear,
  placeholder = 'Buscar debates, temas ou debatedores...',
  className,
  ...props
}) => {
  return (
    <div className={twMerge(clsx('relative flex items-center w-full', className))}>
      <Search
        size={16}
        className="absolute left-3.5 text-text-muted pointer-events-none"
      />
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full h-11 pl-10 pr-10 bg-surface border border-border rounded-xl text-sm text-text-main placeholder:text-text-muted focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all font-sans"
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 p-1 rounded-md text-text-muted hover:text-text-main hover:bg-surface-hover cursor-pointer"
          title="Limpar busca"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
