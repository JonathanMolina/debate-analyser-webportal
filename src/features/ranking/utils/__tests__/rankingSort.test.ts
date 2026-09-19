import { describe, it, expect } from 'vitest';
import type { DebaterAggregateStats } from '@/features/debaters/types/debater.types';

describe('Ranking Calculations & Sorting Logic', () => {
  const sampleDebaters: DebaterAggregateStats[] = [
    {
      debaterId: 'deb_1',
      debaterName: 'Debatedor Alfa',
      debatesCount: 4,
      wins: 3,
      draws: 1,
      losses: 0,
      winRate: 75,
      avgScore: 135,
      avgSpeakingTimeSeconds: 600,
      avgWordsPerMinute: 140,
      avgVocabularyRichness: 80,
      avgDataDensity: 85,
      avgEmotionalControl: 90,
      avgAssertiveness: 80,
      avgVocalStability: 85,
      avgDirectAnswerRate: 90,
      avgRebuttalScore: 85,
      totalFallacies: 1,
      avgFallaciesPerDebate: 0.25,
      totalFactChecks: 8,
      factCheckAccuracy: 95,
      recentDebates: []
    },
    {
      debaterId: 'deb_2',
      debaterName: 'Debatedor Beta',
      debatesCount: 4,
      wins: 2,
      draws: 0,
      losses: 2,
      winRate: 50,
      avgScore: 120,
      avgSpeakingTimeSeconds: 600,
      avgWordsPerMinute: 145,
      avgVocabularyRichness: 75,
      avgDataDensity: 70,
      avgEmotionalControl: 75,
      avgAssertiveness: 80,
      avgVocalStability: 75,
      avgDirectAnswerRate: 80,
      avgRebuttalScore: 75,
      totalFallacies: 4,
      avgFallaciesPerDebate: 1.0,
      totalFactChecks: 8,
      factCheckAccuracy: 80,
      recentDebates: []
    },
    {
      debaterId: 'deb_3',
      debaterName: 'Debatedor Gama',
      debatesCount: 2,
      wins: 2,
      draws: 0,
      losses: 0,
      winRate: 100,
      avgScore: 140,
      avgSpeakingTimeSeconds: 600,
      avgWordsPerMinute: 150,
      avgVocabularyRichness: 85,
      avgDataDensity: 90,
      avgEmotionalControl: 92,
      avgAssertiveness: 85,
      avgVocalStability: 90,
      avgDirectAnswerRate: 95,
      avgRebuttalScore: 90,
      totalFallacies: 0,
      avgFallaciesPerDebate: 0.0,
      totalFactChecks: 4,
      factCheckAccuracy: 100,
      recentDebates: []
    }
  ];

  it('deve ordenar por Score Geral decrescente corretamente', () => {
    const sorted = [...sampleDebaters].sort((a, b) => b.avgScore - a.avgScore);
    expect(sorted[0].debaterName).toBe('Debatedor Gama');
    expect(sorted[1].debaterName).toBe('Debatedor Alfa');
    expect(sorted[2].debaterName).toBe('Debatedor Beta');
  });

  it('deve ordenar por Menor Incidência de Falácias', () => {
    const sorted = [...sampleDebaters].sort(
      (a, b) => a.avgFallaciesPerDebate - b.avgFallaciesPerDebate
    );
    expect(sorted[0].debaterName).toBe('Debatedor Gama');
    expect(sorted[1].debaterName).toBe('Debatedor Alfa');
    expect(sorted[2].debaterName).toBe('Debatedor Beta');
  });

  it('deve ordenar por Taxa de Vitórias', () => {
    const sorted = [...sampleDebaters].sort((a, b) => b.winRate - a.winRate);
    expect(sorted[0].winRate).toBe(100);
    expect(sorted[1].winRate).toBe(75);
    expect(sorted[2].winRate).toBe(50);
  });
});
