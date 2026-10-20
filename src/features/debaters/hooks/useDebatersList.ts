import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchDebaterStats } from '../api/debatersApi';
import type { DebaterAggregateStats } from '../types/debater.types';

export const useDebatersList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get('q') || '';
  const roleFilter = (searchParams.get('role') as 'all' | 'debaters' | 'interviewers') || 'all';

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
    let list = [...debaters];

    if (roleFilter === 'interviewers') {
      list = list.filter((d) => d.isInterviewer);
    } else if (roleFilter === 'debaters') {
      list = list.filter((d) => !d.isInterviewer);
    }

    if (!searchQuery.trim()) return list;
    const q = searchQuery.toLowerCase().trim();
    return list.filter(
      (d) =>
        d.debaterName.toLowerCase().includes(q) ||
        (d.role && d.role.toLowerCase().includes(q))
    );
  }, [debaters, roleFilter, searchQuery]);

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

  const handleRoleFilterChange = (filter: 'all' | 'debaters' | 'interviewers') => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (filter && filter !== 'all') {
        next.set('role', filter);
      } else {
        next.delete('role');
      }
      return next;
    });
  };

  return {
    debaters: filteredDebaters,
    totalCount: filteredDebaters.length,
    searchQuery,
    roleFilter,
    isLoading,
    isError,
    refetch,
    selectedDebater,
    setSelectedDebater,
    handleSearchChange,
    handleRoleFilterChange
  };
};
