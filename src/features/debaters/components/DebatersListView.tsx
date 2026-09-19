import { FC } from 'react';
import { useDebatersList } from '../hooks/useDebatersList';
import { DebaterCard } from './DebaterCard';
import { DebaterDetailModal } from './DebaterDetailModal';
import { SearchInput } from '@/components/SearchInput/SearchInput';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import { Users, FilterX, Award, ShieldCheck } from 'lucide-react';

export const DebatersListView: FC = () => {
  const {
    debaters,
    totalCount,
    searchQuery,
    isLoading,
    selectedDebater,
    setSelectedDebater,
    handleSearchChange
  } = useDebatersList();

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main flex items-center gap-2.5">
            <Users size={24} className="text-primary" />
            <span>Debatedores & Histórico de Debates</span>
          </h1>
          <p className="text-xs text-text-muted mt-1 max-w-2xl">
            Catálogo completo de debatedores registrados no Argumeta, agregando médias técnicas de oratória, precisão factual, compostura e falácias retóricas apuradas nos debates.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center font-mono">
          <div className="bg-surface border border-border px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-2">
            <Users size={14} className="text-primary" />
            <span className="text-text-muted">Total:</span>
            <span className="font-bold text-text-main">{totalCount}</span>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="max-w-md">
        <SearchInput
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          onClear={() => handleSearchChange('')}
          placeholder="Buscar debatedor por nome ou cargo..."
        />
      </div>

      {/* List Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="p-5 bg-surface border border-border rounded-2xl space-y-4">
              <div className="flex items-center gap-3">
                <Skeleton className="w-14 h-14 rounded-2xl" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </div>
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-9 w-full rounded-xl" />
            </div>
          ))}
        </div>
      ) : debaters.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {debaters.map((debater) => (
            <DebaterCard
              key={debater.debaterId}
              debater={debater}
              onViewDetails={setSelectedDebater}
            />
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-surface border border-border rounded-2xl space-y-3">
          <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center mx-auto text-text-muted">
            {searchQuery ? <FilterX size={22} /> : <Users size={22} className="text-primary" />}
          </div>
          <h3 className="font-bold text-base text-text-main">
            {searchQuery ? 'Nenhum debatedor localizado' : 'Nenhum debatedor cadastrado'}
          </h3>
          <p className="text-xs text-text-muted max-w-sm mx-auto">
            {searchQuery
              ? `Não encontramos nenhum debatedor correspondente ao termo "${searchQuery}".`
              : 'Novos participantes analisados serão exibidos automaticamente nesta lista.'}
          </p>
        </div>
      )}

      {/* Debater Profile Modal */}
      <DebaterDetailModal
        debater={selectedDebater}
        onClose={() => setSelectedDebater(null)}
      />
    </div>
  );
};
