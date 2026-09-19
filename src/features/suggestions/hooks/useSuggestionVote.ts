import { useState } from 'react';
import { voteSuggestion } from '../api/suggestionsApi';
import type { VoteType } from '../types/suggestion.types';

const STORAGE_KEY = 'argumeta_suggestion_votes';

const getStoredVotes = (): Record<string, VoteType> => {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Record<string, VoteType>) : {};
  } catch {
    return {};
  }
};

const saveVoteToStorage = (suggestionId: string, vote: VoteType | null) => {
  if (typeof window === 'undefined') return;
  try {
    const votes = getStoredVotes();
    if (vote === null) {
      delete votes[suggestionId];
    } else {
      votes[suggestionId] = vote;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(votes));
  } catch {
    // Silently ignore storage quota or private mode issues
  }
};

export interface UseSuggestionVoteProps {
  suggestionId: string;
  initialLikes: number;
  initialDislikes: number;
}

export const useSuggestionVote = ({
  suggestionId,
  initialLikes,
  initialDislikes
}: UseSuggestionVoteProps) => {
  const [userVote, setUserVote] = useState<VoteType | null>(() => {
    const stored = getStoredVotes();
    return stored[suggestionId] || null;
  });

  const [likesCount, setLikesCount] = useState<number>(initialLikes);
  const [dislikesCount, setDislikesCount] = useState<number>(initialDislikes);
  const [isVoting, setIsVoting] = useState<boolean>(false);

  const handleVote = async (targetVote: VoteType) => {
    if (isVoting) return;

    const previousVote = userVote;
    const nextVote: VoteType | null = userVote === targetVote ? null : targetVote;

    // Cálculo otimista
    let optimisticLikes = likesCount;
    let optimisticDislikes = dislikesCount;

    if (previousVote === 'like') optimisticLikes = Math.max(0, optimisticLikes - 1);
    if (previousVote === 'dislike') optimisticDislikes = Math.max(0, optimisticDislikes - 1);

    if (nextVote === 'like') optimisticLikes += 1;
    if (nextVote === 'dislike') optimisticDislikes += 1;

    // Atualização imediata na interface
    setUserVote(nextVote);
    setLikesCount(optimisticLikes);
    setDislikesCount(optimisticDislikes);
    saveVoteToStorage(suggestionId, nextVote);

    setIsVoting(true);
    try {
      const response = await voteSuggestion(suggestionId, nextVote, previousVote);
      if (response.success && response.data) {
        setLikesCount(response.data.likesCount);
        setDislikesCount(response.data.dislikesCount);
      } else {
        // Rollback em caso de erro
        setUserVote(previousVote);
        setLikesCount(likesCount);
        setDislikesCount(dislikesCount);
        saveVoteToStorage(suggestionId, previousVote);
      }
    } catch {
      // Rollback
      setUserVote(previousVote);
      setLikesCount(likesCount);
      setDislikesCount(dislikesCount);
      saveVoteToStorage(suggestionId, previousVote);
    } finally {
      setIsVoting(false);
    }
  };

  return {
    userVote,
    likesCount,
    dislikesCount,
    isVoting,
    handleVote
  };
};
