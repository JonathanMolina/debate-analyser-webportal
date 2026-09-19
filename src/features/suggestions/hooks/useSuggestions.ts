import { useSearchParams } from 'react-router';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchSuggestions, createSuggestion } from '../api/suggestionsApi';
import type { SuggestionSortOption, SuggestionInput } from '../types/suggestion.types';

export const useSuggestions = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();

  const sort = (searchParams.get('sort') as SuggestionSortOption) || 'top';
  const searchQuery = searchParams.get('q') || '';

  const {
    data: suggestions = [],
    isLoading,
    isError,
    error,
    refetch
  } = useQuery({
    queryKey: ['debate-suggestions', sort, searchQuery],
    queryFn: () => fetchSuggestions({ sort, search: searchQuery }),
    staleTime: 1000 * 30 // 30 segundos
  });

  const createMutation = useMutation({
    mutationFn: (input: SuggestionInput) => createSuggestion(input),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ['debate-suggestions'] });
      }
    }
  });

  const setSort = (newSort: SuggestionSortOption) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (newSort === 'top') {
        next.delete('sort');
      } else {
        next.set('sort', newSort);
      }
      return next;
    });
  };

  const setSearch = (term: string) => {
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      if (!term.trim()) {
        next.delete('q');
      } else {
        next.set('q', term.trim());
      }
      return next;
    });
  };

  return {
    suggestions,
    isLoading,
    isError,
    error: error instanceof Error ? error.message : null,
    sort,
    setSort,
    searchQuery,
    setSearch,
    refetch,
    createSuggestion: createMutation.mutateAsync,
    isSubmitting: createMutation.isPending
  };
};
