import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchDebaterStats } from '../api/debatersApi';
import type { DebaterAggregateStats } from '../types/debater.types';

export const useDebatersList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';

  const [selectedDebater, setSelectedDebater] = useState<DebaterAggregateStats | null>(null);

  const {
    data: debaters = [],
    isLoading,
    isError,
    refetch
  } = useQuery({
    queryKey: ['debaterStats'],
    queryFn: fetchDebaterStats
  });

  const filteredDebaters = useMemo(() => {
    if (!searchQuery.trim()) return debaters;
    const q = searchQuery.toLowerCase().trim();
    return debaters.filter(
      (d) =>
        d.debaterName.toLowerCase().includes(q) ||
        (d.role && d.role.toLowerCase().includes(q))
    );
  }, [debaters, searchQuery]);

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
    debaters: filteredDebaters,
    totalCount: debaters.length,
    searchQuery,
    isLoading,
    isError,
    refetch,
    selectedDebater,
    setSelectedDebater,
    handleSearchChange
  };
};
