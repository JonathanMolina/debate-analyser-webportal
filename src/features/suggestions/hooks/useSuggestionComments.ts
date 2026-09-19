import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchComments, addComment } from '../api/suggestionsApi';
import type { SuggestionComment } from '../types/suggestion.types';

export const useSuggestionComments = (suggestionId: string) => {
  const queryClient = useQueryClient();
  const [authorName, setAuthorName] = useState<string>('');
  const [content, setContent] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const queryKey = ['suggestion-comments', suggestionId];

  const {
    data: comments = [],
    isLoading,
    isError,
    refetch
  } = useQuery<SuggestionComment[]>({
    queryKey,
    queryFn: () => fetchComments(suggestionId),
    enabled: Boolean(suggestionId)
  });

  const mutation = useMutation({
    mutationFn: addComment,
    onSuccess: (result) => {
      if (result.success) {
        setContent('');
        setErrorMessage(null);
        queryClient.invalidateQueries({ queryKey });
        queryClient.invalidateQueries({ queryKey: ['debate-suggestions'] });
      } else {
        setErrorMessage(result.error || 'Erro ao publicar comentário.');
      }
    },
    onError: () => {
      setErrorMessage('Erro inesperado de comunicação.');
    }
  });

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      setErrorMessage('Por favor, digite seu comentário.');
      return;
    }

    setErrorMessage(null);
    await mutation.mutateAsync({
      suggestionId,
      authorName: authorName.trim() || 'Anônimo',
      content: content.trim()
    });
  };

  return {
    comments,
    isLoading,
    isError,
    authorName,
    setAuthorName,
    content,
    setContent,
    errorMessage,
    isSubmitting: mutation.isPending,
    handleSubmitComment,
    refetch
  };
};
