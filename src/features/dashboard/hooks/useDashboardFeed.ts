import { useMemo } from 'react';
import { useSearchParams } from 'react-router';
import { useQuery } from '@tanstack/react-query';
import { fetchDebatesList } from '@/features/debates/api/debatesApi';
import { fetchDebaterStats } from '@/features/debaters/api/debatersApi';

export const useDashboardFeed = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get('q') || '';
  const selectedCategory = searchParams.get('category') || 'Todos';
  const selectedDebater = searchParams.get('debater') || '';

  const {
    data: debates = [],
    isLoading: isLoadingDebates,
    isError: isErrorDebates,
    refetch: refetchDebates
  } = useQuery({
    queryKey: ['debates', searchQuery, selectedCategory, selectedDebater],
    queryFn: () =>
      fetchDebatesList({
        searchQuery,
        category: selectedCategory,
        debaterId: selectedDebater
      })
  });

  const {
    data: debaterStats = [],
    isLoading: isLoadingStats
  } = useQuery({
    queryKey: ['debaterStats'],
    queryFn: fetchDebaterStats
  });

  // Top 10 debaters sorted by avgScore
  const topDebaters = useMemo(() => {
    return [...debaterStats]
      .sort((a, b) => b.avgScore - a.avgScore)
      .slice(0, 10);
  }, [debaterStats]);

  const categories = useMemo(() => {
    return [
      'Todos',
      'Negócios & Gestão',
      'Economia & Políticas Públicas',
      'Sociedade & Meio Ambiente',
      'Ciência & Tecnologia',
      'Eleições & Democracia'
    ];
  }, []);

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

  const handleCategoryChange = (cat: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (cat && cat !== 'Todos') {
        next.set('category', cat);
      } else {
        next.delete('category');
      }
      return next;
    });
  };

  const handleDebaterFilter = (debaterId: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (debaterId) {
        next.set('debater', debaterId);
      } else {
        next.delete('debater');
      }
      return next;
    });
  };

  const handleClearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  return {
    debates,
    topDebaters,
    categories,
    searchQuery,
    selectedCategory,
    selectedDebater,
    isLoading: isLoadingDebates || isLoadingStats,
    isError: isErrorDebates,
    refetchDebates,
    handleSearchChange,
    handleCategoryChange,
    handleDebaterFilter,
    handleClearFilters
  };
};
