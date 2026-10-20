import { FC, useState } from 'react';
import { Trophy, Users, Award, ShieldCheck, ArrowUpDown, Radio } from 'lucide-react';
import { useRankingLeaderboard } from '../hooks/useRankingLeaderboard';
import { RankingPodium } from './RankingPodium';
import { RankingTable } from './RankingTable';
import { SearchInput } from '@/components/SearchInput/SearchInput';
import { DebaterDetailModal } from '@/features/debaters/components/DebaterDetailModal';
import { Skeleton } from '@/components/Skeleton/Skeleton';
import type { DebaterAggregateStats } from '@/features/debaters/types/debater.types';
import type { RankingSortField } from '../types/ranking.types';
import { SeoHead } from '@/features/seo';

export const RankingView: FC = () => {
  const {
    rankingList,
    podium,
    mode,
    sortField,
    sortDirection,
    searchQuery,
    isLoading,
    totalDebaters,
    toggleSort,
    handleModeChange,
    handleSearchChange
  } = useRankingLeaderboard();

  const [selectedDebater, setSelectedDebater] = useState<DebaterAggregateStats | null>(null);
  const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://argumeta.com.br';

  const sortOptions: { id: RankingSortField; label: string }[] = [
    { id: 'avgScore', label: 'Score Geral' },
    ...(mode === 'debate' ? [{ id: 'winRate' as const, label: 'Taxa de Vitórias' }] : []),
    { id: 'fewestFallacies', label: 'Menor Incidência de Falácias' },
    { id: 'avgDataDensity', label: 'Densidade de Dados' },
    { id: 'avgDirectAnswerRate', label: 'Respostas Diretas' },
    { id: 'avgEmotionalControl', label: 'Controle Emocional' },
    { id: 'factCheckAccuracy', label: 'Precisão Factual' }
  ];

  return (
    <div className="space-y-6 pb-12">
      <SeoHead
        title={mode === 'sabatina' ? 'Ranking Geral de Sabatinas' : 'Ranking Geral de Debatedores'}
        description="Classificação técnica e imparcial dos melhores debatedores segundo métricas de argumentação, precisão factual, controle emocional e menor taxa de falácias."
        keywords={['ranking debatedores', 'ranking sabatinas', 'melhores debatedores', 'pontuação de debates', 'precisão factual', 'falácias lógicas', 'Argumeta']}
        canonicalUrl={`${siteUrl}/ranking`}
      />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-text-main flex items-center gap-2.5">
              {mode === 'sabatina' ? <Radio size={24} className="text-primary" /> : <Trophy size={24} className="text-primary" />}
              <span>{mode === 'sabatina' ? 'Ranking de Sabatinas' : 'Ranking Geral de Debatedores'}</span>
            </h1>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
              Critérios Algorítmicos
            </span>
          </div>
          <p className="text-xs text-text-muted mt-1 max-w-2xl">
            {mode === 'sabatina'
              ? 'Classificação técnica individual em sabatinas e entrevistas. Mede a consistência retórica e argumentativa do candidato frente a entrevistadores.'
              : 'Classificação técnica consolidada a partir dos debates analisados. O score geral pondera alegações embasadas, ausência de falácias, controle tonal e taxa de resposta direta.'}
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-center font-mono flex-wrap">
          <div className="flex items-center gap-1.5 p-1 bg-surface border border-border rounded-xl text-xs font-medium">
            <button
              type="button"
              onClick={() => handleModeChange('debate')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                mode === 'debate'
                  ? 'bg-primary text-black font-semibold shadow-xs'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              <span>⚔️ Debates</span>
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('sabatina')}
              className={`px-3 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                mode === 'sabatina'
                  ? 'bg-primary text-black font-semibold shadow-xs'
                  : 'text-text-muted hover:text-text-main'
              }`}
            >
              <Radio size={12} />
              <span>🎙️ Sabatinas</span>
            </button>
          </div>

          <div className="bg-surface border border-border px-3.5 py-1.5 rounded-xl text-xs flex items-center gap-2">
            <Users size={14} className="text-primary" />
            <span className="text-text-muted">{mode === 'sabatina' ? 'Sabatinados:' : 'Debatedores:'}</span>
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
          mode={mode}
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
              placeholder={mode === 'sabatina' ? 'Buscar sabatinado pelo nome...' : 'Buscar no ranking...'}
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
          mode={mode}
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
