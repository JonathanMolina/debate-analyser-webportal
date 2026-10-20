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
  const selectedType = (searchParams.get('type') as 'all' | 'debate' | 'sabatina') || 'all';

  const {
    data: rawDebates = [],
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

  // Filtrar debates por tipo (Debates tradicionais vs Sabatinas)
  const debates = useMemo(() => {
    if (selectedType === 'debate') {
      return rawDebates.filter((d) => d.debateType !== 'sabatina');
    }
    if (selectedType === 'sabatina') {
      return rawDebates.filter((d) => d.debateType === 'sabatina');
    }
    return rawDebates;
  }, [rawDebates, selectedType]);

  // Top 10 debaters sorted by avgScore (excluindo entrevistadores)
  const topDebaters = useMemo(() => {
    return [...debaterStats]
      .filter((s) => !s.isInterviewer && s.debatesCount > 0)
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

  const handleTypeChange = (type: 'all' | 'debate' | 'sabatina') => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (type && type !== 'all') {
        next.set('type', type);
      } else {
        next.delete('type');
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
    selectedType,
    isLoading: isLoadingDebates || isLoadingStats,
    isError: isErrorDebates,
    refetchDebates,
    handleSearchChange,
    handleTypeChange,
    handleCategoryChange,
    handleDebaterFilter,
    handleClearFilters
  };
};
