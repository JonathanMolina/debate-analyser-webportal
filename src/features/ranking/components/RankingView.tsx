import { FC, useState } from 'react';
import { Trophy, Users, Award, ShieldCheck, ArrowUpDown } from 'lucide-react';
import { useRankingLeaderboard } from '../hooks/useRankingLeaderboard';
import { RankingPodium } from './RankingPodium';
import { RankingTable } from './RankingTable';
import { SearchInput } from '@/components/SearchInput/SearchInput';
import { DebaterDetailModal } from '@/features/debaters/components/DebaterDetailModal';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import type { DebaterAggregateStats } from '@/features/debaters/types/debater.types';
import type { RankingSortField } from '../types/ranking.types';

export const RankingView: FC = () => {
  const {
    rankingList,
    podium,
    sortField,
    sortDirection,
    searchQuery,
    isLoading,
    totalDebaters,
    toggleSort,
    handleSearchChange
  } = useRankingLeaderboard();

  const [selectedDebater, setSelectedDebater] = useState<DebaterAggregateStats | null>(null);

  const sortOptions: { id: RankingSortField; label: string }[] = [
    { id: 'avgScore', label: 'Score Geral' },
    { id: 'winRate', label: 'Taxa de Vitórias' },
    { id: 'fewestFallacies', label: 'Menor Incidência de Falácias' },
    { id: 'avgDataDensity', label: 'Densidade de Dados' },
    { id: 'avgDirectAnswerRate', label: 'Respostas Diretas' },
    { id: 'avgEmotionalControl', label: 'Controle Emocional' },
    { id: 'factCheckAccuracy', label: 'Precisão Factual' }
  ];

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-text-main flex items-center gap-2.5">
              <Trophy size={24} className="text-primary" />
              <span>Ranking Geral de Debatedores</span>
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              Critérios Algorítmicos
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1 max-w-2xl">
            Classificação técnica consolidada a partir dos debates auditados. O score geral pondera alegações embasadas, ausência de falácias, controle tonal e taxa de resposta direta.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center font-mono">
          <div className="bg-surface border border-border px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-2">
            <Users size={14} className="text-primary" />
            <span className="text-text-muted">Debatedores:</span>
            <span className="font-bold text-text-main">{totalDebaters}</span>
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Skeleton className="h-56 rounded-2xl" />
          <Skeleton className="h-64 rounded-2xl" />
          <Skeleton className="h-56 rounded-2xl" />
        </div>
      ) : (
        <RankingPodium
          podium={podium}
          onSelectDebater={setSelectedDebater}
        />
      )}

      {/* Filter and Sorting Options Bar */}
      <div className="space-y-3 pt-2">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          <div className="w-full sm:max-w-md">
            <SearchInput
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              onClear={() => handleSearchChange('')}
              placeholder="Buscar no ranking..."
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 scrollbar-none">
            <span className="text-[11px] text-text-muted font-mono whitespace-nowrap flex items-center gap-1 mr-1">
              <ArrowUpDown size={12} /> Ordenar por:
            </span>
            {sortOptions.map((opt) => {
              const isActive = sortField === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleSort(opt.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-primary text-black font-bold shadow-sm shadow-primary/20'
                      : 'bg-surface border border-border text-text-muted hover:text-text-main hover:bg-surface-hover'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Full Ranking Table */}
      {isLoading ? (
        <Skeleton className="h-96 w-full rounded-2xl" />
      ) : (
        <RankingTable
          rankingList={rankingList}
          sortField={sortField}
          sortDirection={sortDirection}
          onToggleSort={toggleSort}
          onSelectDebater={setSelectedDebater}
        />
      )}

      {/* Debater Modal on click */}
      <DebaterDetailModal
        debater={selectedDebater}
        onClose={() => setSelectedDebater(null)}
      />
    </div>
  );
};
