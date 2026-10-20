import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchDebaterStats } from '@/features/debaters/api/debatersApi';
import type { RankingSortField } from '../types/ranking.types';
import type { DebaterAggregateStats } from '@/features/debaters/types/debater.types';

export const useRankingLeaderboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const mode = (searchParams.get('mode') as 'debate' | 'sabatina') || 'debate';
  const sortField = (searchParams.get('sort') as RankingSortField) || 'avgScore';
  const sortDirection = (searchParams.get('dir') as 'asc' | 'desc') || 'desc';
  const searchQuery = searchParams.get('q') || '';

  const {
    data: debaterStats = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['debaterStats'],
    queryFn: fetchDebaterStats
  });

  const sortedRanking = useMemo(() => {
    // Excluir entrevistadores de rankings competitivos
    let list = debaterStats.filter((s) => !s.isInterviewer);

    // Filtrar participantes por modalidade
    if (mode === 'sabatina') {
      list = list.filter((s) => (s.sabatinasCount ?? 0) > 0);
    } else {
      list = list.filter((s) => s.debatesCount > 0);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((s) => s.debaterName.toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      let valA = 0;
      let valB = 0;

      switch (sortField) {
        case 'avgScore':
          valA = mode === 'sabatina' ? (a.avgSabatinaScore ?? a.avgScore) : a.avgScore;
          valB = mode === 'sabatina' ? (b.avgSabatinaScore ?? b.avgScore) : b.avgScore;
          break;
        case 'winRate':
          valA = a.winRate;
          valB = b.winRate;
          break;
        case 'debatesCount':
          valA = mode === 'sabatina' ? (a.sabatinasCount ?? 0) : a.debatesCount;
          valB = mode === 'sabatina' ? (b.sabatinasCount ?? 0) : b.debatesCount;
          break;
        case 'avgDataDensity':
          valA = a.avgDataDensity;
          valB = b.avgDataDensity;
          break;
        case 'avgDirectAnswerRate':
          valA = a.avgDirectAnswerRate;
          valB = b.avgDirectAnswerRate;
          break;
        case 'avgEmotionalControl':
          valA = a.avgEmotionalControl;
          valB = b.avgEmotionalControl;
          break;
        case 'fewestFallacies':
          // Menos falácias é melhor
          valA = -a.avgFallaciesPerDebate;
          valB = -b.avgFallaciesPerDebate;
          break;
        case 'factCheckAccuracy':
          valA = a.factCheckAccuracy;
          valB = b.factCheckAccuracy;
          break;
      }

      if (valA !== valB) {
        return sortDirection === 'desc' ? valB - valA : valA - valB;
      }
      // Desempate por Score Geral
      const scoreA = mode === 'sabatina' ? (a.avgSabatinaScore ?? a.avgScore) : a.avgScore;
      const scoreB = mode === 'sabatina' ? (b.avgSabatinaScore ?? b.avgScore) : b.avgScore;
      return scoreB - scoreA;
    });

    return list;
  }, [debaterStats, mode, searchQuery, sortField, sortDirection]);

  // Pódio dos Top 3 (baseado na ordenação atual)
  const podium = useMemo(() => {
    return sortedRanking.slice(0, 3);
  }, [sortedRanking]);

  const toggleSort = (field: RankingSortField) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (sortField === field) {
        next.set('dir', sortDirection === 'desc' ? 'asc' : 'desc');
      } else {
        next.set('sort', field);
        next.set('dir', 'desc');
      }
      return next;
    });
  };

  const handleModeChange = (newMode: 'debate' | 'sabatina') => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newMode === 'sabatina') {
        next.set('mode', 'sabatina');
        if (sortField === 'winRate') {
          next.set('sort', 'avgScore');
        }
      } else {
        next.delete('mode');
      }
      return next;
    });
  };

  const handleSearchChange = (val: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (val.trim()) {
        next.set('q', val);
      } else {
        next.delete('q');
      }
      return next;
    });
  };

  return {
    rankingList: sortedRanking,
    podium,
    mode,
    sortField,
    sortDirection,
    searchQuery,
    isLoading,
    isError,
    refetch,
    totalDebaters: sortedRanking.length,
    toggleSort,
    handleModeChange,
    handleSearchChange
  };
};
