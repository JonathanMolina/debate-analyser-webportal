import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchDebaterStats } from '@/features/debaters/api/debatersApi';
import type { RankingSortField } from '../types/ranking.types';
import type { DebaterAggregateStats } from '@/features/debaters/types/debater.types';

export const useRankingLeaderboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();

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
    let list = [...debaterStats];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter((s) => s.debaterName.toLowerCase().includes(q));
    }

    list.sort((a, b) => {
      let valA = 0;
      let valB = 0;

      switch (sortField) {
        case 'avgScore':
          valA = a.avgScore;
          valB = b.avgScore;
          break;
        case 'winRate':
          valA = a.winRate;
          valB = b.winRate;
          break;
        case 'debatesCount':
          valA = a.debatesCount;
          valB = b.debatesCount;
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
      return b.avgScore - a.avgScore;
    });

    return list;
  }, [debaterStats, searchQuery, sortField, sortDirection]);

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
    sortField,
    sortDirection,
    searchQuery,
    isLoading,
    isError,
    refetch,
    totalDebaters: debaterStats.length,
    toggleSort,
    handleSearchChange
  };
};
