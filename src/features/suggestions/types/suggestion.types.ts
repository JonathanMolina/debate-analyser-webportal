export type SuggestionStatus = 'voting' | 'under_review' | 'accepted' | 'rejected';

export type VoteType = 'like' | 'dislike';

export type SuggestionSortOption = 'top' | 'recent' | 'comments';

export interface DebateSuggestion {
  id: string;
  youtubeUrl: string;
  youtubeVideoId: string;
  title: string;
  description: string | null;
  debaters: string | null;
  submittedBy: string;
  likesCount: number;
  dislikesCount: number;
  commentsCount: number;
  status: SuggestionStatus;
  createdAt: string;
}

export interface SuggestionComment {
  id: string;
  suggestionId: string;
  authorName: string;
  content: string;
  createdAt: string;
}

export interface SuggestionInput {
  youtubeUrl: string;
  title: string;
  description?: string;
  debaters?: string;
  submittedBy?: string;
  honeypot?: string;
}

export interface CommentInput {
  suggestionId: string;
  authorName?: string;
  content: string;
  honeypot?: string;
}

export interface VoteResult {
  likesCount: number;
  dislikesCount: number;
}
