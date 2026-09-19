import type { DebaterAggregateStats } from '@/features/debaters/types/debater.types';

export type RankingSortField =
  | 'avgScore'
  | 'winRate'
  | 'debatesCount'
  | 'avgDataDensity'
  | 'avgDirectAnswerRate'
  | 'avgEmotionalControl'
  | 'fewestFallacies'
  | 'factCheckAccuracy';

export interface RankingFilterOptions {
  searchQuery: string;
  sortField: RankingSortField;
  sortDirection: 'asc' | 'desc';
  minDebates: number;
}
