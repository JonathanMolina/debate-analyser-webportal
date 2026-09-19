import { FC } from 'react';
import { useDashboardFeed } from '../hooks/useDashboardFeed';
import { DisclaimerBanner } from '@/components/DisclaimerBanner/DisclaimerBanner';
import { SearchInput } from '@/components/SearchInput/SearchInput';
import { CategoryFilterBar } from './CategoryFilterBar';
import { DebateCard } from './DebateCard';
import { TopDebatersPanel } from './TopDebatersPanel';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Film, FilterX, Database, UserCheck } from 'lucide-react';
import { Button } from '@/components/Button/Button';

export const DashboardView: FC = () => {
  const {
    debates,
    topDebaters,
    categories,
    searchQuery,
    selectedCategory,
    selectedDebater,
    isLoading,
    handleSearchChange,
    handleCategoryChange,
    handleDebaterFilter,
    handleClearFilters
  } = useDashboardFeed();

  const isFiltered = Boolean(searchQuery.trim() || selectedCategory !== 'Todos' || selectedDebater);

  return (
    <div className="space-y-6 pb-8">
      {/* 1. Banner de Imparcialidade e Análise Algorítmica */}
      <DisclaimerBanner />

      {/* 2. Barra de Busca e Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="w-full sm:max-w-md">
          <SearchInput
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            onClear={() => handleSearchChange('')}
            placeholder="Buscar debates por tema ou participante..."
          />
        </div>

        {selectedDebater && (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-primary/15 border border-primary/30 text-xs font-mono text-primary animate-fadeIn">
            <UserCheck size={13} />
            <span>Filtrado por: <strong>{selectedDebater}</strong></span>
            <button
              type="button"
              onClick={() => handleDebaterFilter('')}
              className="ml-1 text-text-muted hover:text-text-main cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      {/* 3. Barra de Categorias */}
      <CategoryFilterBar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleCategoryChange}
      />

      {/* 4. Grid Principal estilo YouTube + Painel Lateral Top 10 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Feed de Debates (3 colunas em tela grande) */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-text-main flex items-center gap-2">
              <Film size={18} className="text-primary" />
              <span>Debates Processados</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-surface-elevated text-text-muted border border-border">
                {debates.length}
              </span>
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-3 p-4 bg-surface rounded-2xl border border-border">
                  <Skeleton className="aspect-video w-full rounded-xl" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))}
            </div>
          ) : debates.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {debates.map((debate) => (
                <DebateCard key={debate.id} debate={debate} />
              ))}
            </div>
          ) : (
            <div className="p-12 text-center bg-surface border border-border rounded-2xl space-y-3">
              <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center mx-auto text-text-muted">
                {isFiltered ? <FilterX size={22} /> : <Database size={22} className="text-primary" />}
              </div>
              <h3 className="font-bold text-base text-text-main">
                {isFiltered
                  ? 'Nenhum debate encontrado para esta busca'
                  : 'Nenhum debate processado ainda no Supabase'}
              </h3>
              <p className="text-xs text-text-muted max-w-md mx-auto leading-relaxed">
                {isFiltered
                  ? 'Tente ajustar ou limpar os filtros de busca para visualizar os registros.'
                  : 'Ainda não há debates concluídos armazenados no banco de dados. Assim que novos debates forem processados e sincronizados pelo pipeline ETL, eles aparecerão aqui automaticamente.'}
              </p>
              {isFiltered && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearFilters}
                >
                  Limpar filtros
                </Button>
              )}
            </div>
          )}
        </div>

        {/* Painel Top 10 Debatedores (1 coluna lateral) */}
        <div className="lg:col-span-1">
          <TopDebatersPanel
            topDebaters={topDebaters}
            selectedDebater={selectedDebater}
            onSelectDebater={handleDebaterFilter}
          />
        </div>
      </div>
    </div>
  );
};
